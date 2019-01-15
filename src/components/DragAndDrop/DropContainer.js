import React, { PureComponent } from "react";
import WrapperDrop from "./WrapperDrop.js";

class DropContainer extends PureComponent {
  onDragLeave= ()=> {
   console.log('onDragleave')
  }
  render() {
    const { children,currentDropIndex} = this.props;
    console.log(currentDropIndex)
    return (
      <div className="wf-formcanvas-layout-inner" onDragLeave = {this.onDragLeave}>
        {currentDropIndex === -1 ? <div className="wf-dragging-mark" /> : null}
        {children}
      </div>
    );
  }
}

export default WrapperDrop(DropContainer);
