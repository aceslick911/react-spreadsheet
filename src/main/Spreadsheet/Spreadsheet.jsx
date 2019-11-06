/**
 * Container component. Handles the state and logic necessary
 * for selection, resizing, scroll, etc.
 */
import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import reset from './reset.scss';
import PropTypes from 'prop-types';
import SpreadSheetRenderer from './SpreadSheetRenderer';
import util from './util';

// Configuration.
const CONFIG = {
  GROWTH_MARGIN: 600,   // Scroll margin in pixels from where the sheets size will be extended.
  GROWTH_SCALE: 30,     // Number of rows/columns the sheet will grow with at a time when expanded.
  SCROLL_MARGIN: 40,    // Inner margin of sheet from where scrolling will be activated.
  SCROLL_INTERVAL: 50,  // Scrolling interval in ms.
  SCROLL_STEP: 20,      // Size of scrolling step.
};

const Spreadsheet = (props) => {
  const defaultProps = {
    defaultColumnWidth: 64,
    defaultRowHeight: 20,
    onColumnResize: function () { },
    onRowResize: function () { },
    onCellChange: function () { },
  };

  // Initial state.
  const [state, setState] = useState({
    numberOfColumns: 0,
    numberOfRows: 0,
    isSelecting: false,
    selection: {
      startSelection: {
        rowIndex: -1,
        columnIndex: -1,
      },
      endSelection: {
        rowIndex: -1,
        columnIndex: -1,
      },
    },
    insertMode: 'substitute', // 'substitute' or 'edit'
    activeCell: {
      rowIndex: -1,
      columnIndex: -1,
    },
    forceScroll: {          
      horizontal: 0,
      vertical: 0,
      interval: CONFIG.SCROLL_INTERVAL,
    },
    shouldRecomputateGridSize: false,
  });

  const sheetRef = useRef(null);

  componentWillReceiveProps = (nextProps) => {
    // When a resize of columns or rows is being made the grid components(header/sidebar/sheet)
    // must be refreshed in order for them to request the new sizes.
    if (
      nextProps.columnsFormat !== this.props.columnsFormat ||
      nextProps.rowsFormat !== this.props.rowsFormat
    ) {
      this.setState({
        shouldRecomputateGridSize: true,
      }, () => {
        this.setState({
          shouldRecomputateGridSize: false,
        });
      });
    }
  }


  const componentDidMount = useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);

    // componentWillUnmount
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  });


  /**
   * Width of the specified column
   */
  getColumnWidth = ({index}) => {
    if (typeof this.props.columnsFormat === 'function') {
      return this.props.columnsFormat(index);
    } else if (typeof this.props.columnsFormat[index] === 'undefined') {
      return this.props.defaultColumnWidth;
    } else {
      return this.props.columnsFormat[index];
    }
  }

  /**
   * Height of the specified row
   */
  getRowHeight = ({index}) => {
    if (typeof this.props.rowsFormat === 'function') {
      return this.props.rowsFormat(index);
    } else if (typeof this.props.rowsFormat[index] === 'undefined') {
      return this.props.defaultRowHeight;
    } else {
      return this.props.rowsFormat[index];
    }
  }

  /**
   * Grow the sheet with the specified number of columns
   */
  growWidth(sizeToGrow) {
    this.setState((prevState) => ({
      numberOfColumns: prevState.numberOfColumns + sizeToGrow
    }));
  }

  /**
   * Grow the sheet with the specified number of rows
   */
  growHeight(sizeToGrow) {
    this.setState((prevState) => ({
      numberOfRows: prevState.numberOfRows + sizeToGrow
    }));
  }

  /**
   * Sets the selection locally and passes the new selection to the props.onSelect handler.
   */
  setSelection = ({ startSelection, endSelection }) => {
    this.setState(prevState => {
      let newSelection = {};
      newSelection.startSelection = {
        ...prevState.selection.startSelection,
        ...startSelection
      };
      newSelection.endSelection = {
        ...prevState.selection.endSelection,
        ...endSelection
      };
      this.props.onSelect(newSelection);
      return {
        selection: newSelection
      };
    });
  } 

  /**
   * Selects all the cells in the specified column.
   */
  selectColumn(columnIndex) {
    this.setSelection({
      startSelection: {
        rowIndex: 0,
        columnIndex,
      },
      endSelection: {
        rowIndex: Number.POSITIVE_INFINITY,
        columnIndex,
      },
    });
    this.setState({
      insertMode: 'substitute',
      activeCell: {
        rowIndex: 0,
        columnIndex,
      }
    });
  }

  /**
   * Selects all the cells in the specified row
   */
  selectRow(rowIndex) {
    this.setSelection({
      startSelection: {
        rowIndex,
        columnIndex: 0,
      },
      endSelection: {
        rowIndex,
        columnIndex: Number.POSITIVE_INFINITY,
      },
    });
    this.setState({
      insertMode: 'substitute',
      activeCell: {
        rowIndex,
        columnIndex: 0,
      }
    });
  }

  /**
   * Get the value of the specified cell.
   */
  getCellValue = ({rowIndex, columnIndex}) => {
    if (typeof this.props.cellData === 'function') {
      return this.props.cellData({rowIndex, columnIndex});
    } else if (
      this.props.cellData[rowIndex] &&
      this.props.cellData[rowIndex][columnIndex]
    ) {
      return this.props.cellData[rowIndex][columnIndex];
    }
    return '';
  }
  
  handleScroll = (args) => {
    const distanceToRightEdge = args.scrollWidth - (args.scrollLeft + args.clientWidth);
    if (distanceToRightEdge < CONFIG.GROWTH_MARGIN) {
      this.growWidth(CONFIG.GROWTH_SCALE);
    }
    const distanceToBottom = args.scrollHeight - (args.scrollTop + args.clientHeight);
    if (distanceToBottom < CONFIG.GROWTH_MARGIN) {
      this.growHeight(CONFIG.GROWTH_SCALE);
    } 
  }

  handleCellSelect = ({rowIndex, columnIndex}) => {
    this.setSelection({
      startSelection: { rowIndex, columnIndex },
      endSelection: { rowIndex, columnIndex }
    });
    this.setState({
      isSelecting: true,
      insertMode: 'substitute',
      activeCell: {
        rowIndex,
        columnIndex,
      }
    });
    
    const throttled = util.throttle(this.handleMouseMoveScroll, 100);
    document.addEventListener('mousemove', throttled);
    document.onmouseup = function() {
      document.removeEventListener('mousemove', throttled);
    };
  }

  // ToDo: refactor
  /**
   * Handles scrolling whenever a user selects and drags towards the edges of the sheet.
   */
  handleMouseMoveScroll = (e) => {
    const rect = this.sheetRef.current.getBoundingClientRect();
    let forceScroll = {
      horizontal: 0,
      vertical: 0,
    };
    let endSelection = {};

    // Check horizontal scroll
    if (e.clientX < rect.left + CONFIG.SCROLL_MARGIN) {
      forceScroll.horizontal = - CONFIG.SCROLL_STEP;
      endSelection.columnIndex = - Number.POSITIVE_INFINITY; // ToDo: Fix, not infinity
    } else if (e.clientX > rect.right - CONFIG.SCROLL_MARGIN){
      forceScroll.horizontal = CONFIG.SCROLL_STEP;
      endSelection.columnIndex = Number.POSITIVE_INFINITY;
    }

    // Check vertical scroll
    if (e.clientY < rect.top + CONFIG.SCROLL_MARGIN) {
      forceScroll.vertical = - CONFIG.SCROLL_STEP;
      endSelection.rowIndex = - Number.POSITIVE_INFINITY;
    } else if (e.clientY > rect.bottom - CONFIG.SCROLL_MARGIN) {
      forceScroll.vertical = CONFIG.SCROLL_STEP;
      endSelection.rowIndex = Number.POSITIVE_INFINITY;
    }

    this.setSelection({
      endSelection: endSelection
    });

    this.setState((prevState) => ({
      forceScroll: {
        ...prevState.forceScroll,
        ...forceScroll,
      },
    }));
  }

  handleMouseUp = () => {
    this.setState((prevState) => ({
      isSelecting: false,
      forceScroll: {
        ...prevState.forceScroll,
        horizontal: 0,
        vertical: 0,
      }
    }));
  }

  const handleCellMouseOver = ({ rowIndex, columnIndex }) => {
    if (state.isSelecting) {
      setSelection({
        endSelection: {
          rowIndex,
          columnIndex,
        }
      });
    }
  };

  const handleRowSelect = (rowIndex) => {
    selectRow(rowIndex);
  };

  const handleColumnSelect = (columnIndex) => {
    selectColumn(columnIndex);
  };

  const handleColumnResize = ({ columnIndex, offset }) => {
    const currentWidth = getColumnWidth({ index: columnIndex });
    if (currentWidth + offset > 0) {
      props.onColumnResize({
        size: currentWidth + offset,
        columnIndex: columnIndex
      });
    }
  };

  const handleRowResize = ({ rowIndex, offset }) => {
    const currentHeight = getRowHeight({ index: rowIndex });
    if (currentHeight + offset > 0) {
      props.onRowResize({
        size: currentHeight + offset,
        rowIndex: rowIndex
      });
    }
  };

  const handleCellDoubleClick = ({ rowIndex, columnIndex }) => {
    setState({
      ...state,
      insertMode: 'edit',
      activeCell: {
        rowIndex,
        columnIndex,
      }
    });
  };

  const handleSelectAll = () => {
    setSelection({
      startSelection: {
        rowIndex: 0,
        columnIndex: 0,
      },
      endSelection: {
        rowIndex: Number.POSITIVE_INFINITY,
        columnIndex: Number.POSITIVE_INFINITY,
      },
    });
  };

  // ToDo
  const handleCellChange = ({ value, rowIndex, columnIndex }) => {
    props.onCellChange({ value, rowIndex, columnIndex });
  };


    return (
      <div
      style={{ height: '100%', position: 'relative' }}
      ref={sheetRef}
      >
        <SpreadSheetRenderer
        activeCell={state.activeCell}
        forceScroll={state.forceScroll}
        getColumnWidth={getColumnWidth}
        getRowHeight={getRowHeight}
        getCellValue={getCellValue}
        numberOfColumns={state.numberOfColumns}
        numberOfRows={state.numberOfRows}
        onCellChange={handleCellChange}
        onCellSelect={handleCellSelect}
        onCellMouseOver={handleCellMouseOver}
        onCellDoubleClick={handleCellDoubleClick}
        onColumnSelect={handleColumnSelect}
        onColumnResize={handleColumnResize}
        onRowSelect={handleRowSelect}
        onSelectAll={handleSelectAll}
        onScrollMaster={handleScroll}
        onRowResize={handleRowResize}
        selection={state.selection}
        shouldRecomputateGridSize={state.shouldRecomputateGridSize}
        ></SpreadSheetRenderer>
      </div>
    );
};

Spreadsheet.propTypes = {
  columnsFormat: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.func,
  ]),
  rowsFormat: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.func,
  ]),
  cellData: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ])
      )
    ),
    PropTypes.func,
  ]).isRequired,
  onColumnResize: PropTypes.func,
  onRowResize: PropTypes.func,
  onSelect: PropTypes.func,
  defaultColumnWidth: PropTypes.number,
  defaultRowHeight: PropTypes.number,
};

export default Spreadsheet;
