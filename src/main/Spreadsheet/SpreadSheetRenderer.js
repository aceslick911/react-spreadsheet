import React from 'react';
import { ScrollSync } from 'react-virtualized';
import Sheet from './Sheet/index';
import HeaderBar from './HeaderBar/index';
import SideBar from './SideBar/index';
import style from './GridRenderer.less';

/**
 * Wraps the HeaderBar, SideBar and Sheet and provides synchronized scrolling functionality
 * between them by utilizing the higer order component ScrollSync.
 */
export default function SpreadSheetRenderer({
  activeCell,
  forceScroll,
  getColumnWidth,
  getRowHeight,
  getCellValue,
  numberOfColumns,
  numberOfRows,
  onScrollMaster,
  onCellSelect,
  onCellChange,
  onCellMouseOver,
  onCellDoubleClick,
  onColumnSelect,
  onRowSelect,
  onSelectAll,
  onColumnResize,
  onRowResize,
  selection,
  shouldRecomputateGridSize,
}) {
  const selectedArea = calculateSelectedArea(
    selection.startSelection,
    selection.endSelection
  );
  const columnSelection = {
    from: selectedArea.x1,
    to: selectedArea.x0
  };
  const rowSelection = {
    from: selectedArea.y1,
    to: selectedArea.y0,
  };

  return (
    <ScrollSync>
      {({ clientHeight, clientWidth, onScroll, scrollHeight, scrollLeft, scrollTop, scrollWidth }) => (
        <div>
          <div className={style.tabContainer}>
            <div
              className={style.tab}
              onClick={onSelectAll}
            ></div>
          </div>
          <div className={style.headerbarContainer}>
            <HeaderBar
              columnCount={numberOfColumns}
              columnWidth={getColumnWidth}
              onColumnSelect={onColumnSelect}
              onColumnResize={onColumnResize}
              scrollLeft={scrollLeft}
              selection={columnSelection}
              shouldRecomputateGridSize={shouldRecomputateGridSize}
            ></HeaderBar>
          </div>
          <div className={style.sidebarContainer}>
            <SideBar
              onRowSelect={onRowSelect}
              onRowResize={onRowResize}
              rowCount={numberOfRows}
              rowHeight={getRowHeight}
              scrollTop={scrollTop}
              selection={rowSelection}
              shouldRecomputateGridSize={shouldRecomputateGridSize}
            ></SideBar>
          </div>
          <div className={style.sheetContainer}>
            <Sheet
              activeCell={activeCell}
              columnCount={numberOfColumns}
              columnWidth={getColumnWidth}
              forceScroll={forceScroll}
              getCellValue={getCellValue}
              onScroll={(args) => { onScroll(args); onScrollMaster(args); }}
              onCellChange={onCellChange}
              onCellSelect={onCellSelect}
              onCellMouseOver={onCellMouseOver}
              onCellDoubleClick={onCellDoubleClick}
              rowHeight={getRowHeight}
              rowCount={numberOfRows}
              selectedArea={selectedArea}
              shouldRecomputateGridSize={shouldRecomputateGridSize}
            ></Sheet>
          </div>
        </div>
      )}
    </ScrollSync>
  );
}

/**
 * Calculate the selected area in coordinate form.
 * @param {*} startSelection 
 * @param {*} endSelection 
 */
function calculateSelectedArea(startSelection, endSelection) {
  let selectedArea = {};
  selectedArea.x1 = Math.min(startSelection.columnIndex, endSelection.columnIndex);
  selectedArea.y1 = Math.min(startSelection.rowIndex, endSelection.rowIndex);
  selectedArea.x0 = Math.max(startSelection.columnIndex, endSelection.columnIndex);
  selectedArea.y0 = Math.max(startSelection.rowIndex, endSelection.rowIndex);
  return selectedArea;
}
