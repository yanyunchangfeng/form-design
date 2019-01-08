import React, { PureComponent } from "react";
import { Form } from "antd";
import PropTypes from "prop-types";
import './index.scss'
import FieldCorAttr from "../../utils/field-cor-attr.js";
const FormItem = Form.Item;


export default class FormDisplay extends PureComponent {
  getFields(item) {
    const { getFieldDecorator } = this.props.form;
    const { attrInfo, type } = item;
    const { name, titleValue, verifyValue } = attrInfo;
    return (
 
      <FormItem label={titleValue}>
        {getFieldDecorator(name, {
          rules: [
            {
              required: verifyValue,
              message: "必填项!"
            }
          ]
        })(FieldCorAttr[type].getReallyField(attrInfo))}
      </FormItem>
    );
  }
  render() {
    //   <Row key={index}>
    //   {val.col.map((item, idx) => {
    //     return (
    //       <Col span={span} key={idx}>
    //         {item.item
    //           ? this.getFields(item.item, item.item.type)
    //           : ""}
    //       </Col>
    //     );
    //   })}
    // </Row>
    const { fieldsData } = this.props;
    return (
      <div className="ant-advanced-search-form">
        {fieldsData.map((items, i) => {
          const layout = items.attrInfo.layout;
          {
            return layout.map((val, index) => {
              return (
                <div className="flex-row" key={index}>
                  {val.col.map((item, idx) => {
                    return (
                     
                        <div className="flex-item" key={idx}>
                          {item.item ? this.getFields(item.item) : ""}
                        </div>
                      
                    );
                  })}
                </div>
              );
            });
          }
        })}
      </div>
    );
  }
}

FormDisplay.propTypes = {
  form: PropTypes.object.isRequired,
  fieldsData: PropTypes.array.isRequired,
  formItemLayout: PropTypes.object
};
