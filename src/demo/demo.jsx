import ReactDOM from 'react-dom';
import React from 'react';
import Spreadsheet from './../main/Spreadsheet';
import style from './style.scss';
// import XLSX from 'xlsx';

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

  handleSelect(selection) {
    // console.log(selection);
  }

  render() {
    return (
      <div className={style.demo}>
        {/* <input type="file" onChange={handleFileSubmit} /> */}
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


/*
function handleFileSubmit(e) {
  const files = e.target.files;
  if (!files || files.length == 0) return;
  const file = files[0];

  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    var filename = file.name;
    // pre-process data
    var binary = "";
    var bytes = new Uint8Array(e.target.result);
    var length = bytes.byteLength;
    for (var i = 0; i < length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    // call 'xlsx' to read the file
    var workbook = XLSX.read(binary, {type: 'binary', cellDates:true, cellStyles:true});
    console.log(workbook);
    console.log(workbook.Sheets.Sheet1['!cols']);
    console.log(workbook.Sheets.Sheet1['!rows']);

    let first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let data = XLSX.utils.sheet_to_json(first_worksheet, {header: 1});
    console.log('sheet_to_json:');
    console.log(data);
  };
  fileReader.readAsArrayBuffer(file);
}
*/