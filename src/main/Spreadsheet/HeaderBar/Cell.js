import React from 'react';
import ResizeHandle from './ResizeHandle/ResizeHandle';
import style from './Cell.scss';
import util from '../util';

export default class Cell extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  handleClick = () => {
    this.props.onClick(this.props.columnIndex);
  }

  handleResize = (offset) => {
    this.props.onResize({
      offset: offset,
      columnIndex: this.props.columnIndex,
    });
  }

  render() {
    let classes = style.cell;
    if (this.props.isSelected) {
      classes += ' ' + style.selected;
    }

    return (
      <div
        className={classes}
        onClick={this.handleClick}
      >
        {util.encode_col(this.props.columnIndex)}
        <ResizeHandle
          onResize={this.handleResize}
        ></ResizeHandle>
      </div>
    );
  }
}