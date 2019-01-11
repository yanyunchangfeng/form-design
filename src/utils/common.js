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
export default {
  deepClone,
  initArray
}