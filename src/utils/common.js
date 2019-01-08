export default class DeepClone {
  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
}