import ReactDOM from 'react-dom';
import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import Spreadsheet from './../main/Spreadsheet';
import style from './style.scss';

const Demo = () => {
  const [state, setState] = useState({
    columnsFormat: [202, , 90, , 202],
    rowsFormat: [36.25, , , 27],
    cellData: [
      ['Januari', 'Februari', , , 'Mars'],
      ['Umeå', 'Kalmar', 'Stockholm', 'Göteborg'],
      ['1', '2', '3', 4, 5]
    ]
  });

  const handleColumnResize = ({ columnIndex, size }) => {
    setState((prevState) => {
      let newColumnsFormat = [...prevState.columnsFormat];
      newColumnsFormat[columnIndex] = size;
      return { columnsFormat: newColumnsFormat };
    });
  };

  const handleRowResize = ({ rowIndex, size }) => {
    setState((prevState) => {
      let newRowsFormat = [...prevState.rowsFormat];
      newRowsFormat[rowIndex] = size;
      return { rowsFormat: newRowsFormat };
    });
  };

  const handleCellChange = ({ value, rowIndex, columnIndex }) => {
    setState((prevState) => {
      let newCellData = [...prevState.cellData];
      if (typeof newCellData[rowIndex] === 'undefined') {
        newCellData[rowIndex] = [];
      }
      newCellData[rowIndex][columnIndex] = value;
      return { cellData: newCellData };
    });
  };

  const handleSelect = (selection) => { };

  return (
    <div className={style.demo}>
      <h2>Spreadsheet Demo</h2>
      <div className={style.output}>
        <Spreadsheet
          columnsFormat={state.columnsFormat}
          rowsFormat={state.rowsFormat}
          cellData={state.cellData}
          onCellChange={handleCellChange}
          onColumnResize={handleColumnResize}
          onRowResize={handleRowResize}
          onSelect={handleSelect}
        ></Spreadsheet>
      </div>
    </div>
  );

}

ReactDOM.render(
  <Demo></Demo>,
  document.getElementById('root')
);
