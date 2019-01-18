import React, { PureComponent } from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";
import "./index.scss";
import { take } from "rxjs/operators";
// import "@babel/polyfill";
import DropContainer from "../../components/DragAndDrop/DropContainer.js";
import fieldImages from "../../utils/field-images.js";
import BaseFields from "../../components/BaseFields";
import { Collapse } from "antd";
import LayoutFields from "../../components/LayoutFields";
import FieldCorAttr from "../../utils/field-cor-attr.js";
import Util from "../../utils/common.js";
import emitter from "../../directive/dragdropdirective";
import { constants } from "zlib";
const emitter$ = emitter;
const data$ = emitter$.getDragData().pipe(take(1));
const Panel = Collapse.Panel;
const layoutItems = [
  {
    name: "布局控件",
    url: fieldImages.img_formsection,
    type: "grid"
  }
];
const baseItems = [
  {
    name: "单行输入框",
    url: fieldImages.img_textfield,
    type: "textfield"
  },
  {
    name: "多行输入框",
    url: fieldImages.img_textareafield,
    type: "textareafield"
  },
  {
    name: "日期",
    url: fieldImages.img_date,
    type: "dateformat"
  },
  {
    name: "日期区间",
    url: fieldImages.img_datesection,
    type: "dateformatsection"
  },
  {
    name: "单选框",
    url: fieldImages.img_radiobox,
    type: "radiobox"
  },
  {
    name: "多选框",
    url: fieldImages.img_multiplebox,
    type: "multiplebox"
  },
  {
    name: "下拉框",
    url: fieldImages.img_angledown,
    type: "dropdownfield"
  },
  {
    name: "级联下拉",
    url: fieldImages.img_cascadedrop,
    type: "cascadedrop"
  },
  {
    name: "附件",
    url: fieldImages.img_attachment,
    type: "attachment"
  },
  {
    name: "表单隐藏域",
    url: fieldImages.img_formhidden,
    type: "formhidden"
  },
  {
    name: "数字输入框",
    url: fieldImages.img_img_number,
    type: "number"
  },
  {
    name: "金额",
    url: fieldImages.img_img_money,
    type: "money"
  }
];
export default class FormDesign extends PureComponent {
  constructor(props) {
    super(props);
    const canvasItems = this.props.fieldsData;
    this.state = {
      originItems: { baseItems: baseItems, layoutItems: layoutItems },
      canvasItems,
      activeItem: null,
      currentDropIndex: -2,
      dropTags: ["grid"]
    };
  }
  onChangeDropIndex = index => {
    if (this.state.currentDropIndex === index) {
      return;
    }
    this.setState({ currentDropIndex: index });
  };
  updateGridState = item => {
    this.setState(
      prevState => {
        const canvasItems = [...prevState.canvasItems];
        Util.resetArrayActive(canvasItems);
        Util.addCanvasItem(canvasItems,this.state.currentDropIndex+1,item);
        const activeItem = Util.getActiveItem(canvasItems);
        Util.addArrayIndex(canvasItems)
        return {
          activeItem,
          currentDropIndex:-2,
          canvasItems
        };
      },
      () => {
        this.saveToOuter(this.state.canvasItems);
        //用该函数来监听渲染是否完成
      }
    );
  };
  updateGridIndexGridState = (item ,gridIndex)=> {
    this.setState(
      prevState => {
        const canvasItems = [...prevState.canvasItems];
        Util.resetArrayActive(canvasItems);
        Util.activeIndex(canvasItems,gridIndex);
        Util.addCellItem(canvasItems,gridIndex,item.cellIndex,item);
        Util.activeIndex(canvasItems[gridIndex].attrInfo.grid.cells,item.cellIndex)
        const activeItem = Util.getCellActiveItem(canvasItems,gridIndex,item.cellIndex) ;
        Util.addCellItemGridIndex(activeItem,gridIndex);
        return {
          activeItem,
          currentDropIndex:-2,
          canvasItems
        };
      },
      () => {
        this.saveToOuter(this.state.canvasItems);
        //用该函数来监听渲染是否完成
      }
    );
  };
  onDrop = (item, index, cellIndex) => {
    data$.subscribe(dragData => {
      if (this.state.dropTags.indexOf(dragData.tag) > -1) {
        if(index===undefined&&cellIndex===undefined){
          this.updateGridState(item)
        }else{
          this.updateGridIndexGridState(item,index,cellIndex)
        }  
      } else {
        this.updateBaseState(item, index, cellIndex);
      }
    });
  };
  componentWillReceiveProps(nextprops){
     if(nextprops.fieldsData!==this.props.fieldsData){
       const canvasItems = nextprops.fieldsData
       this.setState({canvasItems:nextprops.fieldsData},()=>{
         this.saveToOuter(canvasItems)
       })
     }
  }
  updateBaseState(item, gridIndex) {
    this.setState(
      prevState => {
        let canvasItems = [...prevState.canvasItems];
        const cellIndex = item.cellIndex;
        Util.resetCellActive(canvasItems,gridIndex,cellIndex);
        Util.addCellItem(canvasItems,gridIndex,cellIndex,item);
        // const cells = canvasItems[gridIndex].attrInfo.grid.cells;
        // cells.forEach(item => item.active = false);
        // cells[cellIndex].active = true;
        // cells[cellIndex].item = item;
        // let activeItem = cells[cellIndex].item;
        Util.activeIndex(canvasItems[gridIndex].attrInfo.grid.cells,cellIndex)
        const activeItem = Util.getCellActiveItem(canvasItems,gridIndex,cellIndex)
        // activeItem.index = gridIndex;
        Util.addCellItemGridIndex(activeItem,gridIndex);
        return {
          currentDropIndex: -2,
          activeItem,
          canvasItems
        };
      },
      () => {
        this.saveToOuter(this.state.canvasItems);
        //用该函数来监听渲染是否完成
      }
    );
  }
  // onDragStart = (event, data) => {
    // this.setState({ currentGhostImage: data });
    // event.dataTransfer.setDragImage(findDOMNode(this.ghostImage), 74, 16);
  // };
  onDragEnd = () => {
    this.setState({ currentDropIndex: -2 });
  };
  //文本块dragover事件
  FieldDragOver = (event, dataSet, comp) => {
    data$.subscribe(dragData => {
      if (this.state.dropTags.indexOf(dragData.tag) > -1) {
        this.moveLayout(event, dataSet, comp);
      }
    });
  };
  moveLayout = (event, dataSet, comp) => {
    if (dataSet) {
      //排序时在容器内item项上移动
      const hoverBoundingRect = findDOMNode(comp).getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverClientY = event.clientY - hoverBoundingRect.top;
      const index = dataSet.index;
      if (hoverClientY <= hoverMiddleY) {
        this.onChangeDropIndex(index - 1);
      } else {
        this.onChangeDropIndex(index);
      }
    }
  };
  //容器dragover事件
  containerDragOver = event => {
    if (event.target.className === "wf-formcanvas-layout-inner") {
      const itemNodes = event.target.children;
      const len = itemNodes.length;
      if (len >= 1) {
        const BoundingLastChild = findDOMNode(
          itemNodes[len - 1]
        ).getBoundingClientRect();

        if (event.clientY > BoundingLastChild.bottom) {
          this.onChangeDropIndex(len - 1);
        }
      } else {
        this.onChangeDropIndex(-1);
      }
    }
  };
  //鼠标离开容器事件
  containerDragleave = (event, comp) => {
    this.onChangeDropIndex(-2);
    // console.log('container dragleave');
    // const hoverBoundingRect = findDOMNode(comp).getBoundingClientRect();
    // if (
    //   event.clientY > hoverBoundingRect.bottom ||
    //   event.clientY < hoverBoundingRect.top ||
    //   event.clientX < hoverBoundingRect.left ||
    //   event.clientX > hoverBoundingRect.right
    // ) {
    //   this.onChangeDropIndex(-2);
    // }
  };
  generateField = () => {
    const { canvasItems, currentDropIndex } = this.state;
    return canvasItems.map((item, index) => {
        return FieldCorAttr[item.type].showField({
          dataSet: { ...item },
          key: index,
          index:index,
          gridIndex: index,
          currentDropIndex,
          moveField: this.moveField,
          removeField: this.removeField,
          activeField: this.activeField,
          onDragOver: this.FieldDragOver,
          // onDragEnd: this.onDragEnd,
          onDrop: this.onDrop,
          // onDragStart: this.onDragStart
        });
    });
  };
  activeField = (item, gridIndex) => {
    if (item.type !== "grid") {
      this.setState(
        prevState => {
          let canvasItems = [...prevState.canvasItems];
          Util.resetArrayActive(canvasItems);
          const cellIndex = item.cellIndex;
          Util.activeIndex(canvasItems,gridIndex)
          Util.activeIndex(canvasItems[gridIndex].attrInfo.grid.cells,cellIndex)
          const activeItem = Util.getCellActiveItem(canvasItems,gridIndex,cellIndex);
          return { activeItem };
        },
        () => {
          this.saveToOuter(this.state.canvasItems);
        }
      );
    } else {
      this.setState(
        prevState => {
          let canvasItems = [...prevState.canvasItems];
          Util.resetArrayActive(canvasItems);
          const cellIndex = item.cellIndex;
          let activeItem;
          if(cellIndex!==undefined){
            Util.activeIndex(canvasItems,gridIndex);
            Util.activeIndex(canvasItems[gridIndex].attrInfo.grid.cells,cellIndex)
            activeItem = Util.getCellActiveItem(canvasItems,gridIndex,cellIndex);
            return { canvasItems, activeItem }
          }
          const index = item.index;
          Util.activeIndex(canvasItems,index);
          activeItem = Util.getActiveItem(canvasItems);
          return {canvasItems, activeItem}
          // canvasItems.forEach(item => {
          //   item.active = false;
          //   const cells = item.attrInfo.grid.cells;
          //   cells.forEach(cell => cell.active = false);
          // });
          // canvasItems = [
          //   ...canvasItems.slice(0, gridIndex),
          //   { ...item, active: true },
          //   ...canvasItems.slice(gridIndex + 1)
          // ];
          
          // const activeItem = Util.getCellActiveItem(canvasItems,gridIndex,cellIndex) ;
          // const activeItem = canvasItems.find(item => item.active === true);
          
        },
        () => {
          this.saveToOuter(this.state.canvasItems);
        }
      );
    }
  };
  removeField = (item, gridIndex, cellIndex ) => {
    if (item.type !== "grid") {
      this.setState(
        prevState => {
          const canvasItems = [...prevState.canvasItems];
          canvasItems[gridIndex].attrInfo.grid.cells[cellIndex].item = null
          let activeItem;
          if (!item.active) {
            return {
              canvasItems
            };
          } else {
            activeItem = canvasItems[gridIndex];
            return {
              canvasItems,
              activeItem
            };
          }
        },
        () => {
          this.saveToOuter(this.state.canvasItems);
        }
      );
    } else {
      this.setState(
        prevState => {
          const canvasItems = [...prevState.canvasItems];
          canvasItems.splice(gridIndex, 1);
          let activeItem;
          if (!item.active) {
            return {
              canvasItems
            };
          } else {
            activeItem = null;
            return { canvasItems, activeItem };
          }
        },
        () => {
          this.saveToOuter(this.state.canvasItems);
        }
      );
    }
  };
  moveField = (dragIndex, curIndex) => {
    if (dragIndex === curIndex) {
      return;
    }
    this.setState(
      prevState => {
        const canvasItems = [...prevState.canvasItems];
        canvasItems.splice(curIndex, 0, ...canvasItems.splice(dragIndex, 1));
        canvasItems.forEach((item, index) => {
          item.index = index;
          const cells = item.attrInfo.grid.cells;
          cells.forEach(cell => cell.active = false)
        });
        canvasItems.forEach((item,index) => {
          const cells = item.attrInfo.grid.cells;
          cells.forEach(cell => cell.item && (cell.item.index = index))
        })
        const activeItem = canvasItems.find(item => item.active === true);
        return {
          canvasItems,
          currentDropIndex:-2,
          activeItem
        };
      },
      () => {
        this.saveToOuter(this.state.canvasItems);
      }
    );
  };
  saveData = (item, gridIndex) => {
    if (item.type !== "grid") {
      this.setState(
        prevState => {
          const canvasItems = [...prevState.canvasItems];
          const cellIndex = item.cellIndex;
          Util.updateCurrentCellItem(canvasItems,gridIndex,cellIndex,item);
          // canvasItems[gridIndex].attrInfo.grid.cells[cellIndex].item = item;
          const activeItem = item;
          return { canvasItems, activeItem };
        },
        () => {
          this.saveToOuter(this.state.canvasItems);
        }
      );
    } else {
      this.setState(
        prevState => {
          const canvasItems = [...prevState.canvasItems];
          const cellIndex = item.cellIndex;
          let activeItem;
          if(cellIndex!==undefined){
            Util.updateCurrentCellItem(canvasItems,gridIndex,cellIndex,item);
            activeItem = Util.getCellActiveItem(canvasItems,gridIndex,cellIndex);
            return { canvasItems,activeItem}
          }
          const index = item.index;
          Util.updateCurrentCanvasItem(canvasItems,gridIndex,item)
          // Util.activeIndex(canvasItems,index);
          activeItem = Util.getActiveItem(canvasItems);
          return {canvasItems,activeItem}
          // canvasItems[gridIndex] = item;
          // const activeItem = item;
          // return { canvasItems, activeItem };
        },
        () => {
          this.saveToOuter(this.state.canvasItems);
        }
      );
    }
  };
  saveToOuter = canvasItems => {
    const fieldsData = canvasItems;
    this.props.onSave(fieldsData);
  };
  render() {
    const { activeItem, currentDropIndex } = this.state;
    // console.log(currentDropIndex)
    // this.emitter = emitter;
    // this.data$ = emitter.getDragData().pipe(take(1));
    // const { className, height } = this.props;
    // let fd = "fd-content";
    // if (className) {
    //   fd = fd + className;
    // }
    return (
      <div className="fd-content">
        <div className="wf-panel wf-widgetspanel ">
          <Collapse defaultactiveId={["1", "2"]}>
            <Panel header="布局组件" key="1">
              {layoutItems.map((item, index) => {
                return (
                  <LayoutFields
                    className="no-margin-bottom"
                    dataSet={item}
                    key={index}
                    onDragEnd={this.onDragEnd}
                    onDragStart={this.onDragStart}
                  />
                );
              })}
            </Panel>
            <Panel header="基础组件" key="2">
              {baseItems.map((item, index) => {
                return (
                  <BaseFields
                    dataSet={item}
                    key={index}
                    onDragStart={this.onDragStart}
                  />
                );
              })}
            </Panel>
          </Collapse>
        </div>
        <div className="wf-formcanvas">
          <div className="wf-formcanvas-layout">
            <DropContainer
              onDrop={this.onDrop}
              onDragLeave={this.containerDragleave}
              onDragOver={this.containerDragOver}
              currentDropIndex={currentDropIndex}
              moveField={this.moveField}
            >
              {this.generateField()}
            </DropContainer>
          </div>
        </div>
        <div className="wf-right">
          {activeItem
            ? FieldCorAttr[activeItem.type].showAttr({
                onSave: this.saveData,
                activeItem
              })
            : ""}
        </div>
      </div>
    );
  }
}
// <div
//           className="wf-widgetsitem"
//           style={{ zIndex: "-1", position: "absolute" }}
//           ref={ghostImage => {
//             this.ghostImage = ghostImage;
//           }}
//         >
//           <label>{currentGhostImage.name}</label>
//           <img className="widgeticon" src={currentGhostImage.url} alt="图片" />
//         </div>
FormDesign.propTypes = {
  className: PropTypes.string,
  height: PropTypes.string,
  onSave: PropTypes.func
};
