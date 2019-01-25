import React, { PureComponent } from "react";
import FieldCorAttr from "../../utils/field-cor-attr.js";
import emitter from "../../directive/dragdropdirective";
// import WrapperDrop from "../DragAndDrop/WrapperDrop.js";
// import WrapperDrag from "../DragAndDrop/WrapperDrag.js";
import Util from "../../utils/common";
import { take } from "rxjs/operators";
import PropTypes from "prop-types";
const emitter$ = emitter;
const data$ = emitter$.getDragData().pipe(take(1));

class GridCol extends PureComponent {
  state = {
    dropTags: this.props.dropTags,
    dragenter: false
  };
  onDragEnter = event => {
    event.stopPropagation();
    event.preventDefault();
    const {
      dataSet: { active},
      cells,
      cellIndex
    } = this.props;
    const { dropTags } = this.state;
    data$.subscribe(dragData => {
      if (dropTags.indexOf(dragData.tag) > -1) {
        if (!active) {
          return;
        }
        if(!cells[cellIndex].item){
          this.setState({dragenter: true })
        }
      }
    });
  };
  onDragOver = event => {
    event.preventDefault();
    event.stopPropagation();
  };
  onDragLeave = () => {
    const {
      dataSet: { active },
      cells,
      cellIndex,
     
    } = this.props;
    const { dropTags } = this.state;
    
    data$.subscribe(dragData => {
      if (dropTags.indexOf(dragData.tag) > -1) {
        if (!active) {
          return;
        }
        if(!cells[cellIndex].item){
          this.setState({ dragenter: false });
        }
      }
    });
  };
  onDrops = (event) => {
    const {
      dataSet: { active,gridIndex},
      onDropFormLayout,
      cellIndex,
      cells,
      parent,
      cellGridIndex
    } = this.props;
    event.stopPropagation();
    event.preventDefault();
    // console.log(parent)
    const { dropTags } = this.state;
    data$.subscribe(dragData => {
      const tag = dragData.tag;
      if (dropTags.indexOf(tag) > -1) {
        if (!active) {
          return;
        }
        if (!cells[cellIndex].item) {
          this.setState({ dragenter: false });
          const baseInfo = Util.deepClone({
            ...FieldCorAttr[dragData.data.type].initValues
          });
          const attrInfo = {
            titleValue: dragData.data.name,
            ...baseInfo,
            
          };
          let item;
          if(parent){
             item ={...dragData.data,attrInfo,gridIndex,cellGridIndex,cellIndex}
          }else{
             item = { ...dragData.data, attrInfo,gridIndex,cellIndex };
          }
          
          onDropFormLayout(item);
        }
      }
    });
  };
  render() {
    const { dragenter } = this.state;
    const { children} =  this.props;
    return (
      <div
        className={`${dragenter ? "drag-enter" : ""}`}
        onDragEnter={event => this.onDragEnter(event)}
        onDragLeave={event => this.onDragLeave(event)}
        onDrop={event => this.onDrops(event)}
        onDragOver={event => this.onDragOver(event)}
        style={{ height: "100%" ,display:'flex',flex:1,minHeight:'50px'}}
      >
          {children}
      </div>
    );
  }
}
GridCol.propTypes = {
  dataSet: PropTypes.object
};
export default GridCol;
