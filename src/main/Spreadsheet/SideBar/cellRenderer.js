import React from 'react';
import Cell from './Cell';

export default function cellRenderer(props) {
  const {
    rowIndex,
    key,
    style,
    parent
  } = props;

  const isSelected = (
    rowIndex >= parent.props.selection.from &&
    rowIndex <= parent.props.selection.to
  );

  return (
    <div
      key={key}
      style={style}
    >
      <Cell
        onClick={parent.props.onClick}
        rowIndex={rowIndex}
        onResize={parent.props.onCellResize}
        isSelected={isSelected}
      ></Cell>
    </div>
  );
}
