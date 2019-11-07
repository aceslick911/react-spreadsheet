import ReactDOM from 'react-dom';
import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import Spreadsheet from './../main/Spreadsheet';
import style from './style.less';

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

    let newColumnsFormat = [...state.columnsFormat];
    newColumnsFormat[columnIndex] = size;
    setState({
      ...state,
      columnsFormat: newColumnsFormat
    });
  };

  const handleRowResize = ({ rowIndex, size }) => {

    let newRowsFormat = [...state.rowsFormat];
    newRowsFormat[rowIndex] = size;
    setState({
      ...state,
      rowsFormat: newRowsFormat
    })

  };

  const handleCellChange = ({ value, rowIndex, columnIndex }) => {

    let newCellData = [...state.cellData];
    if (typeof newCellData[rowIndex] === 'undefined') {
      newCellData[rowIndex] = [];
    }
    newCellData[rowIndex][columnIndex] = value;
    setState({
      ...state,
      cellData: newCellData
    })

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
