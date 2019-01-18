import React, { PureComponent } from "react";
import FieldCorAttr from "../../utils/field-cor-attr.js";
import emitter from "../../directive/dragdropdirective";
import Util from "../../utils/common";
import { take } from "rxjs/operators";
import PropTypes from "prop-types";
const emitter$ = emitter;
const data$ = emitter$.getDragData().pipe(take(1));

class GridCol extends PureComponent {
  state = {
    dropTags: ['base','grid'],
    dragenter: false
  };
  onDragEnter = event => {
    const {
      dataSet: { active},
      cells,
      cellIndex,
    } = this.props;
    // console.log(this.props)
    const { dropTags } = this.state;
    event.preventDefault();
    event.stopPropagation();
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
      dataSet: { active ,gridIndex},
      onDropFormLayout,
      cellIndex,
      cells,
    } = this.props;
    event.stopPropagation();
    event.preventDefault();
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
          const item = { ...dragData.data, attrInfo,gridIndex,cellIndex };
          onDropFormLayout(item);
        }
      }
    });
  };
  render() {
    const { dragenter } = this.state;
    const { children } = this.props;
    return (
      <div
        className={`${dragenter ? "drag-enter" : ""}`}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDrop={event => this.onDrops(event)}
        onDragOver={this.onDragOver}
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
