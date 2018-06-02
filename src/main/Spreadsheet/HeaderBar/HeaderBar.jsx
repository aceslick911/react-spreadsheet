import React from 'react';
import { Grid, AutoSizer } from 'react-virtualized';
import cellRenderer from './cellRenderer';

class HeaderBar extends React.Component {
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
  }

  componentDidUpdate() {
    if (this.props.shouldRecomputateGridSize) {
      // Does a forceUpdate internally
      this.gridRef.current.recomputeGridSize();
    } else {
      // ToDo
      // Grid will only do a shallow compare of props, which makes a forceUpdate necessary
      this.gridRef.current.forceUpdate();
    }
  }

  render() {
    const headerbarStyle = {
      overflowX: 'hidden',
      outline: 'none',
    };
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Grid
            ref={this.gridRef}
            height={height}
            width={width}
            style={headerbarStyle}
            rowCount={1}
            scrollLeft={this.props.scrollLeft}
            rowHeight={22}
            columnCount={this.props.columnCount}
            columnWidth={this.props.columnWidth}
            selection={this.props.selection}
            onClick={this.props.onColumnSelect}
            cellRenderer={cellRenderer}
            onCellResize={this.props.onColumnResize}
          />
        )}
      </AutoSizer>
    );
  }
}

export default HeaderBar;
