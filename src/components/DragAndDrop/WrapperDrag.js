import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import emitter from "../../directive/dragdropdirective";
export default function WrapperDrag(Component, dragTag) {
  return class DragElement extends PureComponent {
    state = {
      draggable: true,
      dragStart: false
    };
    componentDidMount() {
      this.emitter = emitter;
    }
    onDragStart = event=> {
      const { dataSet} = this.props;
      this.emitter.setDragData({ tag: dragTag, type: "new", data: dataSet });
      // event.dataTransfer.setData('text','123')
      this.setState({ dragStart: true });
      // if(!onDragStart){
      //   return 
      // }
      // onDragStart( event, dataSet);
    };
    onDragEnd = () => {
      this.setState({ dragStart: false });
      // const{onDragEnd} = this.props;
      // if(!onDragEnd){
      //   return 
      // }
      // onDragEnd()
    };
    render() {
      const { draggable, dragStart } = this.state;
      const { className } =  this.props
      return (
        <div
          className={ `clearfix margin-bottom-rem ${className?'no-margin-bottom':''}` }
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
          ref={comp => {
            this.dragComp = comp;
          }}
        >
          <Component
            {...this.props}
            dragStart={dragStart}
            draggable={draggable}
          />
        </div>
      );
    }
  };
}
WrapperDrag.propTypes = {
  dataSet: PropTypes.object
};
