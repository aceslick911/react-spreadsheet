
import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { Grid, AutoSizer } from 'react-virtualized';
import cellRenderer from './cellRenderer';
import style from './Sheet.scss';
import * as _ from 'lodash';

const Sheet = ({
  shouldRecomputateGridSize,
  forceScroll,
  activeCell,
  columnCount,
  columnWidth,
  getCellValue,
  onCellChange,
  onScroll,
  onCellSelect,
  onCellMouseOver,
  onCellDoubleClick,
  selectedArea,
  rowCount,
  rowHeight,
}) => {
  const [state, setState] = useState({
    automaticScrollSet: false,
  });

  const gridRef = useRef();

  const componentWillReceiveProps = (nextProps) => {
    if (
      (nextProps.forceScroll.vertical !== 0 || nextProps.forceScroll.horizontal !== 0) &&
      !state.automaticScrollSet
    ) {
      setState({
        ...state,
        automaticScrollSet: true,
      }, initiateAutomaticScroll());
    }
  }

  const componentDidUpdate = useEffect(() => {
    if (shouldRecomputateGridSize) {
      gridRef.current.recomputeGridSize(); // Does a forceUpdate internally
    } else {
      gridRef.current.forceUpdate(); // Grid will only do a shallow compare of props
    }
  });

  /**
   * Overrides manual scroll in favour of the values specified in props.forceScroll.
   */
  const initiateAutomaticScroll = () => {
    // Set automatic scroll
    const intervalId = window.setInterval(() => {
      gridRef.current._scrollingContainer.scrollLeft += forceScroll.horizontal;
      gridRef.current._scrollingContainer.scrollTop += forceScroll.vertical;
    }, forceScroll.interval);

    // Clear automatic scroll.
    const _this = this;
    document.addEventListener('mouseup', function clearAutomaticScroll() {
      window.clearInterval(intervalId);
      document.removeEventListener('mouseup', clearAutomaticScroll);
      setState({
        ...state,
        automaticScrollSet: false,
      });
    });
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <Grid
          activeCell={activeCell}
          className={style.table}
          columnCount={columnCount}
          columnWidth={columnWidth}
          cellRenderer={cellRenderer}
          getCellValue={getCellValue}
          height={height}
          onCellChange={onCellChange}
          onScroll={onScroll}
          onCellMouseDown={onCellSelect}
          onCellMouseOver={onCellMouseOver}
          onCellDoubleClick={onCellDoubleClick}
          selectedArea={selectedArea}
          style={{ outline: 'none' }}
          scrollingResetTimeInterval={0}
          ref={gridRef}
          rowCount={rowCount}
          rowHeight={rowHeight}
          width={width}
        />
      )}
    </AutoSizer>
  );
}


export default Sheet;
