import FieldCorAttr from "./field-cor-attr";
const deepClone = (obj) => {
   return JSON.parse(JSON.stringify(obj))
}
const initArray = (num) => {
    let arr  = [];
    for(let i = 0 ;i < num; i++){
       arr[i] = {active:false};
    }
    return arr;
}
const resetArrayActive = (arr) => {
   arr.forEach(item => {
       item.active = false;
       const cells = item.attrInfo.grid.cells;
       cells.forEach(subItem=>subItem.active = false)
      }
   )
}
const addArrayIndex = (arr) => {
   arr.forEach((item,index) => item.index = index);
}
const initLayoutValue = (item) => {
   const layoutInitValue = deepClone({
      ...FieldCorAttr[item.type].initValues
    });
    const attrInfo = {
      titleValue: item.name,
      ...layoutInitValue
    };
    return {...item,attrInfo,active:true}
}
const activeIndex = (arr,index) =>{
   arr[index].active = true;
}
const getActiveItem = (arr) =>{
    return arr.find(item => item.active === true)
}
const getCellActiveItem = (arr,gridIndex,cellIndex)=>{
   return arr[gridIndex].attrInfo.grid.cells[cellIndex].item 
}
const addCellItem = (arr,gridIndex,cellIndex,cellItem)=>{
   arr[gridIndex].attrInfo.grid.cells[cellIndex].item = initLayoutValue(cellItem);
}
const addCanvasItem = (arr,index,item) => {
   arr.splice(index, 0, initLayoutValue(item));
}
export default {
  deepClone,
  initArray,
  addArrayIndex,
  activeIndex,
  addCellItem,
  getActiveItem,
  addCanvasItem,
  getCellActiveItem,
  resetArrayActive,
  initLayoutValue
}