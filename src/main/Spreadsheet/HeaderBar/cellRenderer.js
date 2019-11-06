import React from 'react';
import Cell from './Cell';

export default function cellRenderer(props) {
  const {
    columnIndex,
    key,
    style,
    parent
  } = props;
  
  const isSelected = (
    columnIndex >= parent.props.selection.from &&
    columnIndex <= parent.props.selection.to
  );

  return (
    <div
      key={key}
      style={style}
    >
      <Cell
        onClick={parent.props.onClick}
        columnIndex={columnIndex}
        onResize={parent.props.onCellResize}
        isSelected={isSelected}
      ></Cell>
    </div>
  );
}
