import React from 'react';
import { Grid, AutoSizer } from 'react-virtualized';
import cellRenderer from './cellRenderer';
import style from './Sheet.scss';
import * as _ from 'lodash';

class Sheet extends React.Component {
  state = {
    automaticScrollSet: false,
  }
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
  }

  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.forceScroll.vertical !== 0 || nextProps.forceScroll.horizontal !== 0) &&
      !this.state.automaticScrollSet
    ) {
      this.setState({
        automaticScrollSet: true,
      }, this.initiateAutomaticScroll());
    }
  }

  componentDidUpdate() {
    if (this.props.shouldRecomputateGridSize) {
      this.gridRef.current.recomputeGridSize(); // Does a forceUpdate internally
    } else {
      this.gridRef.current.forceUpdate(); // Grid will only do a shallow compare of props
    }
  }

  /**
   * Overrides manual scroll in favour of the values specified in props.forceScroll.
   */
  initiateAutomaticScroll() {
    // Set automatic scroll
    const intervalId = window.setInterval(() => {
      this.gridRef.current._scrollingContainer.scrollLeft += this.props.forceScroll.horizontal;
      this.gridRef.current._scrollingContainer.scrollTop += this.props.forceScroll.vertical;
    }, this.props.forceScroll.interval);

    // Clear automatic scroll.
    const _this = this;
    document.addEventListener('mouseup', function clearAutomaticScroll() {
      window.clearInterval(intervalId);
      document.removeEventListener('mouseup', clearAutomaticScroll);
      _this.setState({
        automaticScrollSet: false,
      });
    });
  }

  render() {
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Grid
            activeCell={this.props.activeCell}
            className={style.table}
            columnCount={this.props.columnCount}
            columnWidth={this.props.columnWidth}
            cellRenderer={cellRenderer}
            getCellValue={this.props.getCellValue}
            height={height}
            onCellChange={this.props.onCellChange}
            onScroll={this.props.onScroll}
            onCellMouseDown={this.props.onCellSelect}
            onCellMouseOver={this.props.onCellMouseOver}
            onCellDoubleClick={this.props.onCellDoubleClick}
            selectedArea={this.props.selectedArea}
            style={{ outline: 'none' }}
            scrollingResetTimeInterval={0}
            ref={this.gridRef}
            rowCount={this.props.rowCount}
            rowHeight={this.props.rowHeight}
            width={width}
          />
        )}
      </AutoSizer>
    );
  }
}

export default Sheet;
