import React from 'react';
import { Grid, AutoSizer } from 'react-virtualized';
import cellRenderer from './cellRenderer';

class SideBar extends React.Component {
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
    const sidebarStyle = {
      overflowY: 'hidden',
      outline: 'none',
    };
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Grid
            ref={this.gridRef}
            style={sidebarStyle}
            height={height}
            width={width}
            cellRenderer={cellRenderer}
            columnCount={1}
            scrollTop={this.props.scrollTop}
            columnWidth={40}
            rowCount={this.props.rowCount}
            rowHeight={this.props.rowHeight}
            selection={this.props.selection}
            onClick={this.props.onRowSelect}
            onCellResize={this.props.onRowResize}
          />
        )}
      </AutoSizer>
    );
  }
}

export default SideBar;
