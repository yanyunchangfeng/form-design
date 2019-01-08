import React, { PureComponent } from "react";
import { Select, Button } from "antd";
const Option = Select.Option;
export default class FormLayoutAttr extends PureComponent {
  handleChange = ({ rowoptionvalue, coloptionvalue }) => {
    const { activeItem, onSave } = this.props;
    const { index, attrInfo } = activeItem;
    // const span = 1/ coloptionvalue;
    const layout = this.initItems(rowoptionvalue, coloptionvalue);
    const updateAttrInfo = {
      ...attrInfo,
      layout: layout,
      // span: span,
      rowoptionvalue: rowoptionvalue,
      coloptionvalue: coloptionvalue
    };
    const updateActiveItem = { ...activeItem, attrInfo: updateAttrInfo };
    onSave(updateActiveItem, index);
  };
  initItems(rowoptionvalue, coloptionvalue) {
    let layout = [];
    for (let i = 0; i < rowoptionvalue; i++) {
      let obj = {};
      obj["col"] = [];
      for (let j = 0; j < coloptionvalue; j++) {
        obj["col"].push({ active: false });
      }
      layout.push(obj);
    }
    return layout;
  }
  render() {
    const {
      activeItem: {
        attrInfo: { coloptions, coloptionvalue, rowoptions, rowoptionvalue }
      }
    } = this.props;
    return (
      <div className="wf-panel wf-settingpanel open">
        <div className="wf-sidepanel-head">布局设置</div>
        <div className="wf-settings-pane">
          <div className="wf-form wf-widgetsettings">
            <div className="wf-setter-field wf-setting-label">
              <div className="fieldname">行</div>
              <div className="fieldblock">
                <Select
                  value={rowoptionvalue}
                  style={{ width: 120 }}
                  onChange={value => {
                    this.handleChange({
                      rowoptionvalue: value,
                      coloptionvalue: coloptionvalue
                    });
                  }}
                >
                  {rowoptions.map((val, index) => {
                    return (
                      <Option value={val.key} key={index}>
                        {val.value}
                      </Option>
                    );
                  })}
                </Select>
              </div>
              <div className="fieldblock">
                <div className="fieldname">列</div>
                <Select
                  value={coloptionvalue}
                  style={{ width: 120 }}
                  onChange={value => {
                    this.handleChange({
                      rowoptionvalue: rowoptionvalue,
                      coloptionvalue: value
                    });
                  }}
                >
                  {coloptions.map((val, index) => {
                    return (
                      <Option value={val.key} key={index}>
                        {val.value}
                      </Option>
                    );
                  })}
                </Select>
              </div>
              <div className="fieldblock">
                <Button type="primary">重置</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
