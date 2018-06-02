## React Spreadsheet
React spreadsheet built upon *react-virtualized*  
**[Demo](https://simonfc.github.io/react-spreadsheet/)** - source code can be found in `src/demo/`

### Noteworthy Features
- Row and column resizing
- Drag and select + scroll
- ...*under development*

### Prop Types
| Property | Type&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Required? | Description |
|:---|:---|:---:|:---|
| cellData | Array or Function | ✓ | Data to display in the sheet. Either defined as a sparse *rows* **x** *columns* array or provided as a function with the signature ```function({rowIndex: number, columnIndex: number}): string```|
| columnsFormat | Array or Function |  | Defines the widths of the columns. Either defined as ```numbers``` in a sparse array or provided as a function with the signature ```function(columnIndex: number): number```|
| defaultColumnWidth | Number |  | Default column width. Defaults to 64px. |
| defaultRowHeight | Number |  | Default row height. Defaults to 20px. |
| onCellChange | Function |  | Callback invoked whenever the value of a cell changes. Has the signature ```function({ value: string, rowIndex: number, columnIndex: number }): void``` where ```value``` is the new content of the specified cell. |
| onColumnResize | Function |  | Callback invoked on a column resize action. Has the signature ```function({ columnIndex: number, size: number }): void``` where ```size``` is the new size of the specified column. |
| onRowResize | Function |  | Callback invoked on a row resize action. Has the signature ```function({ rowIndex: number, size: number }): void``` where ```size``` is the new size of the specified row. |
| onSelect | Function |  | Callback invoked on selection. Has the signature ```function({ startSelection, endSelection }): void``` where ```startSelection``` specifies the cell the selection originates from and  ```endSelection``` specifies the last cell in the selection process. ```startSelection``` and ```endSelection``` follows the type ```{ row:number, column: number }```|
| rowsFormat | Array or Function |  | Defines the heights of the rows. Either defined as ```numbers``` in a sparse array or provided as a function with the signature ```function(columnIndex: number): number```|

### Basic react-spreadsheet example
~~~~
import React from 'react';
import ReactDOM from 'react-dom';
import Spreadsheet from 'react-spreadsheet';

// Data to display in the sheet
cellData: [
  ['January', 'February', 'Mars'], // row
  ['1', '2', '3', , , 4, 5] // row
]

// Render the spreadsheet
ReactDOM.render(
  <Spreadsheet
    cellData={cellData}
  ></Spreadsheet>,
  document.getElementById('root')
);
~~~~
Check `src/demo/` for a more extensive example.

### Under the hood
Built upon *react-virtualized*

### To be done
- Rewrite with Redux