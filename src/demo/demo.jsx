import ReactDOM from 'react-dom';
import React from 'react';
import Spreadsheet from './../main/Spreadsheet';
import style from './style.scss';

class Demo extends React.Component {
  state = {
    columnsFormat: [202, , 90, , 202],
    rowsFormat: [36.25, , , 27],
    cellData: [
      ['Januari', 'Februari', , , 'Mars'],
      ['Umeå', 'Kalmar', 'Stockholm', 'Göteborg'],
      ['1', '2', '3', 4, 5]
    ]
  }

  handleColumnResize = ({ columnIndex, size }) => {
    this.setState((prevState) => {
      let newColumnsFormat = [...prevState.columnsFormat];
      newColumnsFormat[columnIndex] = size;
      return { columnsFormat: newColumnsFormat };
    });
  }

  handleRowResize = ({ rowIndex, size }) => {
    this.setState((prevState) => {
      let newRowsFormat = [...prevState.rowsFormat];
      newRowsFormat[rowIndex] = size;
      return { rowsFormat: newRowsFormat };
    });
  }

  handleCellChange = ({value, rowIndex, columnIndex}) => {
    this.setState((prevState) => {
      let newCellData = [...prevState.cellData];
      if (typeof newCellData[rowIndex] === 'undefined') {
        newCellData[rowIndex] = [];
      }
      newCellData[rowIndex][columnIndex] = value;
      return { cellData: newCellData };
    });
  }

  handleSelect(selection) { }

  render() {
    return (
      <div className={style.demo}>
        <h2>Spreadsheet Demo</h2>
        <div className={style.output}>
          <Spreadsheet
            columnsFormat={this.state.columnsFormat}
            rowsFormat={this.state.rowsFormat}
            cellData={this.state.cellData}
            onCellChange={this.handleCellChange}
            onColumnResize={this.handleColumnResize}
            onRowResize={this.handleRowResize}
            onSelect={this.handleSelect}
          ></Spreadsheet>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Demo></Demo>,
  document.getElementById('root')
);
