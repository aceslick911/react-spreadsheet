import React from 'react';
import ResizeHandle from './ResizeHandle/ResizeHandle';
import style from './Cell.scss';

export default class Cell extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  handleClick = () => {
    this.props.onClick(this.props.rowIndex);
  }

  handleResize = (offset) => {
    this.props.onResize({
      offset: offset,
      rowIndex: this.props.rowIndex,
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
        { this.props.rowIndex }
        <ResizeHandle
          onResize={this.handleResize}
        ></ResizeHandle>
      </div>
    );
  }
}