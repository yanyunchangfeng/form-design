import React, { PureComponent, Fragment } from "react";
import emitter from "../../directive/dragdropdirective";
import { take } from "rxjs/operators";
export default function WrapperDrop(Component) {
  return class DropElement extends PureComponent {
    componentDidMount() {
      this.emitter = emitter;
      this.data$ = emitter.getDragData().pipe(take(1));
    }
    onDragOver = event => {
      event.preventDefault();
      event.stopPropagation();
      const { onDragOver } = this.props;
      if (onDragOver) {
        this.data$.subscribe(dragData => {
          if (dragData.tag !== "base") {
            onDragOver(event, this.props.dataSet, this.containerComp);
          }
        });
      }
    };
    onDragLeave = event => {
      const { onDragLeave } = this.props;
      if (onDragLeave) {
        this.data$.subscribe(dragData => {
          if (dragData.tag !== "base") {
            onDragLeave(event, this.containerComp);
          }
        });
      }
    };
    //数组项内排序
    moveJudge = (index) => {
      const { moveField} = this.props;
      const dragIndex = index;
      const curIndex = this.props.currentDropIndex;
      if (curIndex >= dragIndex) {
        //往下拖拽
        if(!moveField){
          return 
        }
        moveField(dragIndex, curIndex);
      } else {
        if(!moveField){
          return 
        }
        moveField(dragIndex, curIndex + 1);
        //往上拖拽
      }
    };
    //插入新项并排序
    dropJudge = data => {
      const { onDrop } = this.props;
      if (!onDrop) {
        return;
      }
      onDrop(data);
    };
    onDrop = event => {
      event.preventDefault();
      event.stopPropagation();
      this.data$.subscribe(dragData => {
        if (dragData.tag !== "base") {
          if (dragData.type === "move") {
            this.moveJudge(dragData.index);
          } else {
            this.dropJudge(dragData.data, event);
          }
        }
      });
    };
    render() {
      const { currentDropIndex, dataSet, index } = this.props;
      // const { gridIndex } = dataSet
      // console.log(gridIndex)
      // console.log(this.props)
      return (
        <Fragment>
          <div
            onDragOver={this.onDragOver}
            onDragLeave={this.onDragLeave}
            onDrop={this.onDrop}
            ref={comp => {
              this.containerComp = comp;
            }}
            style={dataSet ? {} : { height: "100%" }}
          >
            <Component {...this.props} {...this.state} />
            {currentDropIndex === index ? (
              <div className="wf-dragging-mark" />
            ) : (
              ""
            )}
          </div>
        </Fragment>
      );
    }
  };
}
