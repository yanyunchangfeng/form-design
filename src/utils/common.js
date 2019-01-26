import FieldCorAttr from "./field-cor-attr";
import fieldImages from './field-images'
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
const deepClone = obj => {
  return JSON.parse(JSON.stringify(obj));
};
const initArray = num => {
  let arr = [];
  for (let i = 0; i < num; i++) {
    arr[i] = { active: false};
  }
  return arr;
};
const resetArrayActive = arr => {
  arr.forEach(item => {
    item.active = false;
    const cells = item.attrInfo.grid.cells;
    cells.forEach(subItem => subItem.active = false);
  });
};
//for move
const resetArrayCellActive = arr => {
  arr.forEach(item => {
    const cells = item.attrInfo.grid.cells;
    cells.forEach(subItem => subItem.active = false);
  })
}
const resetArrayCellGridIndex = arr =>{
  arr.forEach((item, index)=>{
       const cells = item.attrInfo.grid.cells;
       cells.forEach(subItem => (subItem.item)&&(subItem.gridIndex = index))
  })
}
const resetCellActive = (arr, gridIndex, cellIndex) => {
  const cells = arr[gridIndex].attrInfo.grid.cells;
  cells.forEach(item => (item.active = false));
  cells[cellIndex].active = true;
};
const addArrayIndex = arr => {
  arr.forEach((item, index) => (item.gridIndex = index));
};
const initLayoutValue = item => {
  const layoutInitValue = deepClone({
    ...FieldCorAttr[item.type].initValues
  });
  const attrInfo = {
    titleValue: item.name,
    ...layoutInitValue
  };
  return { ...item, attrInfo, active: true };
};
const initGridCells = (arr) =>{
  arr.forEach((item,index)=>{
    const cells = item.attrInfo.grid.cells;
    cells.forEach((subItem,cellIndex) => {
      subItem.active = false;
      subItem.item = null;
      subItem.gridIndex = index;
      subItem.cellIndex = cellIndex;
    })
  })
}
const activeIndex = (arr, index) => {
  arr[index].active = true;
};
const getActiveItem = arr => {
  return arr.find(item => item.active === true);
};
const getCellActiveItem = (arr, gridIndex, cellIndex) => {
  return arr[gridIndex].attrInfo.grid.cells[cellIndex].item;
};
const addCellItem = (arr, gridIndex, cellIndex, cellItem) => {
  arr[gridIndex].attrInfo.grid.cells[cellIndex].item = initLayoutValue(
    cellItem
  );
};
const addCanvasItem = (arr, index, item) => {
  arr.splice(index+1, 0, initLayoutValue(item));
};
const updateCurrentCanvasItem = (arr, gridIndex, item) => {
  arr[gridIndex] = item;
};
const updateCurrentCellItem = (arr, gridIndex, cellIndex, item) => {
  arr[gridIndex].attrInfo.grid.cells[cellIndex].item = item;
};
const addCellItemGridIndex = (arr, index) => {
  arr.gridIndex = index;
};
const isgridCellHascellItem = (arr,gridIndex,cellIndex) =>{
   const item = arr[gridIndex].attrInfo.grid.cells[cellIndex].item;
   const bool = item ? true : false;
   return bool;
}
const addGridCellGridBaseItem =(arr,gridIndex,cellGridIndex,cellIndex,item) =>{
 arr[gridIndex].attrInfo.grid.cells[cellGridIndex].item.attrInfo.grid.cells[cellIndex].item= initLayoutValue(item)
}
const updateGridCellGridBaseItem =(arr,gridIndex,cellGridIndex,cellIndex,item)=>{
  arr[gridIndex].attrInfo.grid.cells[cellGridIndex].item.attrInfo.grid.cells[cellIndex].item = item;
}
const getGridCellGridCellActiveItem =(arr,gridIndex,cellGridIndex,cellIndex)=>{
   return  arr[gridIndex].attrInfo.grid.cells[cellGridIndex].item.attrInfo.grid.cells[cellIndex].item
}
const resetGridCellGridCellActive = (arr,gridIndex,cellGridIndex,cellIndex)=>{
    const gridCellGridCell = arr[gridIndex].attrInfo.grid.cells[cellGridIndex].item.attrInfo.grid.cells;
    gridCellGridCell.forEach(item => item.active = false);
    gridCellGridCell[cellIndex].active = true;
}
const resetAllGridCellGridCellActice = (arr,gridIndex) =>{
  const cells = arr[gridIndex].attrInfo.grid.cells;
  cells.forEach(item=>{
    item.item&&item.item.type==='grid'&&item.item.attrInfo.grid.cells.forEach(item=>item.active=false)
  })
}
export default {
  deepClone,
  initArray,
  addArrayIndex,
  activeIndex,
  addCellItem,
  getActiveItem,
  addCanvasItem,
  resetCellActive,
  getCellActiveItem,
  resetArrayActive,
  updateCurrentCanvasItem,
  updateCurrentCellItem,
  addCellItemGridIndex,
  resetArrayCellGridIndex,
  resetArrayCellActive,
  initLayoutValue,
  initGridCells,
  isgridCellHascellItem,
  addGridCellGridBaseItem,
  updateGridCellGridBaseItem,
  getGridCellGridCellActiveItem,
  resetGridCellGridCellActive,
  resetAllGridCellGridCellActice,
  layoutItems,
  baseItems
};
