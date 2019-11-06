import React from 'react';
import style from './ResizeHandle.scss';
import ReactDOM from 'react-dom';

class ResizeHandle extends React.PureComponent {
  state = {
    showResizeLine: false,
    isResizing: false,
    startResizePos: undefined,
  };
  constructor(props) {
    super(props);
    this.draggableRef = React.createRef();
  }

  handleMouseDown = (e) => {
    e.preventDefault();
    const element = e.target;
    let position = e.clientX;
    document.addEventListener('mouseup', closeDragElement);
    document.addEventListener('mousemove', handleElementDrag);
    
    this.setState({
      showResizeLine: true,
      isResizing: true,
      startResizePos: position,
    });
    
    function handleElementDrag(e) {
      const offset = position - e.clientX;
      position = e.clientX;
      element.style.left = (element.offsetLeft - offset) + 'px';
      element.style.position = 'absolute';
    }
    
    const _this = this;
    function closeDragElement(e) {
      document.removeEventListener('mouseup', closeDragElement);
      document.removeEventListener('mousemove', handleElementDrag);
      element.style.position = 'unset';
      _this.setState({
        showResizeLine: false,
        isResizing: false,
      });
      let offset = position - _this.state.startResizePos;
      _this.props.onResize(offset);
    }
  }

  handleClick = (e) => {
    // Prevent the column from being selected
    e.stopPropagation();
  }

  render() {
    return (
      <div
        className={style.container}
      >
        <div 
          ref={this.draggableRef}
          className={style.resizeHandle}
          onMouseDown={this.handleMouseDown}
          onClick={this.handleClick}
        >
          { this.state.showResizeLine ? <div className={style.resizeLine}></div> : null }
        </div>
      </div>
    );
  }
}

export default ResizeHandle;