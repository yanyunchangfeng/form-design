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
  onDragStart = (event, data, index) => {
    this.setState({
      dragStart:true
    })
    event.stopPropagation();
    emitter.setDragData({
      tag: data.type,
      type: "move",
      data: data,
      index: index
    });
  };
  onDragEnd = () => {
    this.setState({
      dragStart:false
    })
  }
  onDropFormLayout = (item, cellIndex) => {
    const { dataSet, onDrop, gridIndex } = this.props;
    const { active } = dataSet;
    if (!active) {
      return;
    }
    if (!onDrop) {
      return;
    }
    onDrop(item, gridIndex, cellIndex);
  };
  generateField = (data, active, type) => {
    return FieldCorAttr[type].showField({
      dataSet: { ...data, active },
      activeField: this.activeFields,
      removeField: this.removeFields
    });
  };
  removeFields = (item,cellIndex) => {
    const { gridIndex, removeField } = this.props;
    removeField(item, gridIndex, cellIndex);
  };
  activeFields = (item, active, cellIndex) => {
    const { gridIndex, activeField } = this.props;
    if (active) {
      return;
    }
    activeField(item, gridIndex, cellIndex);
  };
  // {layout.map((val, index) => {
  //   return (
  //     <div className="flex-row" key={index}>
  //       {val.col.map((item, idx) => {
  //         return (
  //           <Fragment key={idx}>
  //             <div className="flex-item">
  //               <GridCol
  //                 onDropFormLayout={(item, row, col) =>
  //                   this.onDropFormLayout(item, row, col)
  //                 }
  //                 row={index}
  //                 col={idx}
  //                 layout={layout}
  //                 {...this.props}
  //               >
  //                 {item.item
  //                   ? this.generateField(
  //                       item.item,
  //                       item.active,
  //                       item.item.type
  //                     )
  //                   : ""}
  //               </GridCol>
  //             </div>
  //             {idx !== val.col.length - 1 ? (
  //               <div className="resizer" />
  //             ) : (
  //               ""
  //             )}
  //           </Fragment>
  //         );
  //       })}
  //     </div>
  //   );
  // })}
  render() {
    const { dataSet, isDragging, activeField, removeField, gridIndex } = this.props;
    const { dragStart } = this.state;
    const {
      active,
      attrInfo: { layout ,grid:{row,col,cells}}
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
        draggable
        onMouseDown={() => {
          activeField(dataSet, gridIndex);
        }}
        onDragStart={event => this.onDragStart(event, dataSet, gridIndex)}
        onDragEnd = {event => this.onDragEnd()}
      >
        <div
          className="wf-remove icon icon-close"
          onMouseDown={event => {
            event.stopPropagation();
            removeField(dataSet, gridIndex);
          }}
        />
        <div style={GridStyle} className="grid">
            {cells.map((item,index)=>{
              return (
                <div className="cell" key={index}>
                <GridCol
                                onDropFormLayout={(item,cellIndex) =>
                                  this.onDropFormLayout(item,cellIndex)
                                }
                                cells={cells}
                                cellIndex={index}
                                {...this.props}
                              >
                                {item.item
                                  ? this.generateField(
                                      item.item,
                                      item.active,
                                      item.item.type
                                    )
                                  : ""}
                </GridCol>
                {index?<div className="resizer"></div>:''}
                </div>
              )
            })}
        </div> 
      </div>
    );
  }
}

export default WrapperDrop(WrapperDrag(FormLayout));
