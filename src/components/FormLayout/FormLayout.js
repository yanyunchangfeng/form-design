import FieldCorAttr from "../../utils/field-cor-attr.js";
import WrapperDrop from "../DragAndDrop/WrapperDrop.js";
import WrapperDrag from "../DragAndDrop/WrapperDrag.js";
import emitter from "../../directive/dragdropdirective";
import React, { PureComponent, Fragment } from "react";
// import { useEventCallback } from "rxjs-hooks";
import { fromEvent, of, zip } from "rxjs";
import { map, switchMap, takeUntil, withLatestFrom, tap } from "rxjs/operators";
import GridCol from "../GridCol";

class FormLayout extends PureComponent {
  state = {
    dragStart:false
  }
  onDragStart = (event, data) => {
    this.setState({
      dragStart:true
    })
    event.stopPropagation();
    emitter.setDragData({
      tag: data.type,
      type: "move",
      data: data,
      index: data.gridIndex
    });
  };
  onDragEnd = () => {
    this.setState({
      dragStart:false
    })
  }
  onDropFormLayout = (item) => {
    const { dataSet, onDrop } = this.props;
    const { active } = dataSet;
    if (!active) {
      return;
    }
    if (!onDrop) {
      return;
    }
    onDrop(item);
  };
  generateField = (data,active,index) => {
    const {onDrop,dataSet} = this.props;
    const type = data.type;
    return FieldCorAttr[type].showField({
      dataSet: { ...data, active },
      activeField: this.activeFields,
      removeField: this.removeFields,
      onDrop: onDrop,
      parent:dataSet,
      cellGridIndex:index
    });
  };
  removeFields = (item) => {
    const { removeField } = this.props;
    removeField(item);
  };
  activeFields = (item) => {
    const { activeField } = this.props;
    const active  = item.active;
    if(item.type==='grid'){
      activeField(item);
      return 
    }
    if(active){
      return 
    }
    activeField(item);
  };
  render() {
    const { dataSet, isDragging, activeField, removeField, draggable} = this.props;
    const { dragStart } = this.state;
    const {
      active,
      attrInfo: { grid:{row,col,cells}},
    } = dataSet;
    const GridStyle = {
      display:'grid',
      gridTemplateRows:`repeat(${row},1fr)`,
      gridTemplateColumns:`repeat(${col},1fr)`
    }
    let status = "";
    if (active) {
      status = status + " active";
    }
    if (isDragging) {
      status = status + " draging";
    }
    // const resizer = [...document.querySelectorAll(".resizer")];
    // const itemCols = [...document.querySelectorAll(".flex-item-container")];
    // resizer.map((item, index) => {
    //   const mousedown$ = fromEvent(item, "mousedown");
    //   const itemEle$ = of(itemCols[index]);
    //   zip(mousedown$, itemEle$, (m, i) => {
    //     return { m: m, i: i };
    //   }).subscribe(val => console.log(val));
    // });
    return (
     
      <div
        className={`wf-component wf-component-textfield ${status} ${dragStart? 'drag-start':''}`}
        draggable={draggable}
        onMouseDown={ event => {
          event.stopPropagation();
          activeField(dataSet);
        }}
        onDragStart={event => this.onDragStart(event, dataSet)}
        onDragEnd = {event => this.onDragEnd()}
      >
        <div
          className="wf-remove icon icon-close"
          onMouseDown={event => {
            event.stopPropagation();
            removeField(dataSet);
          }}
        />
        <div style={GridStyle} className="grid">
            {cells.map((item,index)=>{
              return (
                <div className="cell" key={index}>
                <GridCol
                                onDropFormLayout={(item) =>
                                  this.onDropFormLayout(item)
                                }
                                cells={cells}
                                cellIndex={index}
                                {...this.props}
                              >
                             {item.item
                                ? this.generateField(
                                    item.item,
                                    item.active,
                                    index
                                  )
                                : ""}
                </GridCol>
                {true?<div className="resizer"></div>:''}
                </div>
              )
            })}
        </div> 
      </div>
    );
  }
}

export default WrapperDrop(WrapperDrag(FormLayout),['grid','base']);
