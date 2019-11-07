import React from 'react';
import styleSheet from './cellRenderer.less';
import classNames from 'classnames';

// ToDo: refactor to a class.
export default function cellRenderer({ columnIndex, rowIndex, key, style, parent }) {
  function handleMouseDown() {
    parent.props.onCellMouseDown({ columnIndex, rowIndex });
  }

  function handleMouseOver() {
    parent.props.onCellMouseOver({ columnIndex, rowIndex });
  }

  function handleChange(e) {
    parent.props.onCellChange({
      value: e.target.value,
      rowIndex,
      columnIndex
    });
  }

  function handleDoubleClick(e) {
    parent.props.onCellDoubleClick({
      rowIndex,
      columnIndex
    });
  }

  const cellStyle = calculateCellStyle(
    { column: columnIndex, row: rowIndex },
    parent.props.selectedArea,
    parent.props.activeCell
  );

  const classes = classNames({
    [styleSheet.Cell]: true,
    [styleSheet.marked]: cellStyle.isMarked,
    [styleSheet.borderTop]: cellStyle.hasBorderTop,
    [styleSheet.borderBottom]: cellStyle.hasBorderBottom,
    [styleSheet.borderLeft]: cellStyle.hasBorderLeft,
    [styleSheet.borderRight]: cellStyle.hasBorderRight,
    [styleSheet.resizeMarker]: cellStyle.hasResizeMarker,
  });

  const cellValue = parent.props.getCellValue({
    rowIndex: rowIndex,
    columnIndex: columnIndex,
  });

  return (
    <div
      key={key}
      className={classes}
      style={style}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onMouseOver={handleMouseOver}
    // Prevent the textarea from being selected on single click. Capture phase.
    //onMouseDownCapture={e => e.preventDefault()}
    >
      <textarea
        onChange={handleChange}
        value={cellValue}
      ></textarea>
    </div>
  );
}

/**
 * Determines the style for a cell.
 */
function calculateCellStyle(position, selectedArea, activeCell) {
  let style = {};

  // Check if the cell is inside the selected area
  if (
    position.column < selectedArea.x1 ||
    position.column > selectedArea.x0 ||
    position.row < selectedArea.y1 ||
    position.row > selectedArea.y0) {
    // Not inside
    return style;
  }

  // Aligned to top?
  if (position.row === selectedArea.y1) {
    style.hasBorderTop = true;
  }

  // Aligned to bottom?
  if (position.row === selectedArea.y0) {
    style.hasBorderBottom = true;
  }

  // Aligned to left hand side?
  if (position.column === selectedArea.x1) {
    style.hasBorderLeft = true;
  }

  // Aligned to right hand side?
  if (position.column === selectedArea.x0) {
    style.hasBorderRight = true;
  }

  // Resize marker?
  if (position.column === selectedArea.x0 &&
    position.row === selectedArea.y0) {
    style.hasResizeMarker = true;
  }

  if (
    position.row !== activeCell.rowIndex ||
    position.column !== activeCell.columnIndex
  ) {
    style.isMarked = true;
  }

  return style;
}
