import React, { PureComponent } from "react";
import FieldCorAttr from "../../utils/field-cor-attr.js";
import emitter from "../../directive/dragdropdirective";
import DeepClone from "../../utils/common";
import { take } from "rxjs/operators";
import PropTypes from "prop-types";
const emitter$ = emitter;
const data$ = emitter$.getDragData().pipe(take(1));

class GridCol extends PureComponent {
  state = {
    dropTags: ["base"],
    dragenter: false
  };
  onDragEnter = event => {
    const {
      dataSet: { active },
      row,
      col,
      layout
    } = this.props;
    const { dropTags } = this.state;
    event.preventDefault();
    event.stopPropagation();
    data$.subscribe(dragData => {
      if (dropTags.indexOf(dragData.tag) > -1) {
        if (!active) {
          return;
        }
        if (!layout[row]["col"][col].item) {
          this.setState({ dragenter: true });
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
      row,
      col,
      layout
    } = this.props;
    const { dropTags } = this.state;
    data$.subscribe(dragData => {
      if (dropTags.indexOf(dragData.tag) > -1) {
        if (!active) {
          return;
        }
        if (!layout[row]["col"][col].item) {
          this.setState({ dragenter: false });
        }
      }
    });
  };
  onDrops = () => {
    const {
      dataSet: { active },
      onDropFormLayout,
      row,
      col,
      layout
    } = this.props;
    const { dropTags } = this.state;
    data$.subscribe(dragData => {
      if (dropTags.indexOf(dragData.tag) > -1) {
        if (!active) {
          return;
        }
        if (!layout[row]["col"][col].item) {
          this.setState({ dragenter: false });
          const baseInfo = DeepClone.deepClone({
            ...FieldCorAttr[dragData.data.type].initValues
          });
          const attrInfo = {
            titleValue: dragData.data.name,
            ...baseInfo,
            row,
            col
          };
          const item = { ...dragData.data, attrInfo };
          onDropFormLayout(item, row, col);
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
        onDrop={this.onDrops}
        onDragOver={this.onDragOver}
        style={{ height: "100%" ,display:'flex',flex:1}}
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
