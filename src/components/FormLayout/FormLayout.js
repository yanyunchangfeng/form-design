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
  onDropFormLayout = (item, row, col) => {
    const { dataSet, onDrop, index } = this.props;
    const { active } = dataSet;
    if (!active) {
      return;
    }
    if (!onDrop) {
      return;
    }
    onDrop(item, index, row, col);
  };
  generateField = (data, active, type) => {
    return FieldCorAttr[type].showField({
      dataSet: { ...data, active },
      activeField: this.activeFields,
      removeField: this.removeFields
    });
  };
  removeFields = (item, row, col) => {
    const { index, removeField } = this.props;
    removeField(item, index, row, col);
  };
  activeFields = (item, active, row, col) => {
    const { index, activeField } = this.props;
    if (active) {
      return;
    }
    activeField(item, index, row, col);
  };
  render() {
    const { dataSet, isDragging, activeField, removeField, index } = this.props;
    const { dragStart } = this.state;
    const {
      active,
      attrInfo: { layout }
    } = dataSet;
    let status = "";
    if (active) {
      status = status + " active";
    }
    if (isDragging) {
      status = status + " draging";
    }
    const resizer = [...document.querySelectorAll(".resizer")];
    const itemCols = [...document.querySelectorAll(".flex-item-container")];
    resizer.map((item, index) => {
      const mousedown$ = fromEvent(item, "mousedown");
      const itemEle$ = of(itemCols[index]);
      zip(mousedown$, itemEle$, (m, i) => {
        return { m: m, i: i };
      }).subscribe(val => console.log(val));
    });
    return (
     
      <div
        className={`wf-component wf-component-textfield ${status} ${dragStart? 'drag-start':''}`}
        draggable
        onMouseDown={() => {
          activeField(dataSet, index);
        }}
        onDragStart={event => this.onDragStart(event, dataSet, index)}
        onDragEnd = {event => this.onDragEnd()}
      >
        <div
          className="wf-remove icon icon-close"
          onMouseDown={event => {
            event.stopPropagation();
            removeField(dataSet, index);
          }}
        />
        {layout.map((val, index) => {
          return (
            <div className="flex-row" key={index}>
              {val.col.map((item, idx) => {
                return (
                  <Fragment key={idx}>
                    <div className="flex-item">
                      <GridCol
                        onDropFormLayout={(item, row, col) =>
                          this.onDropFormLayout(item, row, col)
                        }
                        row={index}
                        col={idx}
                        layout={layout}
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
                    </div>
                    {idx !== val.col.length - 1 ? (
                      <div className="resizer" />
                    ) : (
                      ""
                    )}
                  </Fragment>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

export default WrapperDrop(WrapperDrag(FormLayout));
