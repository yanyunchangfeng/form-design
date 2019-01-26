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
    // {
    //   return layout.map((val, index) => {
    //     return (
    //       <div className="flex-row" key={index}>
    //         {val.col.map((item, idx) => {
    //           return (
               
    //               <div className="flex-item" key={idx}>
    //                 {item.item ? this.getFields(item.item) : ""}
    //               </div>
                
    //           );
    //         })}
    //       </div>
    //     );
    //   });
    // }
    const { fieldsData } = this.props;
    return (
      <div className="ant-advanced-search-form">
        {fieldsData.map((items,index) => {
          const grid = items.attrInfo.grid;
          const {row,col,cells} = grid;
          const GridStyle = {
            display:'grid',
            gridTemplateRows:`repeat(${row},1fr)`,
            gridTemplateColumns:`repeat(${col},1fr)`
          }
          {
            return (
              <div className="grid" style={GridStyle} key={index}>
                   {
                     cells.map((item,idx)=>{
                       const cellitem = item.item;
                       const type = cellitem&&cellitem.type;
                       switch (type){
                         case 'grid':
                            const grid = cellitem.attrInfo.grid;
                            const {row,col,cells} = grid;
                            const GridStyle = {
                              display:'grid',
                              gridTemplateRows:`repeat(${row},1fr)`,
                              gridTemplateColumns:`repeat(${col},1fr)`
                            }
                            return (
                              <div className="cell"key="idx">
                                <div className="grid" style={GridStyle}>
                                    {
                                      cells.map((item,idx)=>{
                                        const cellitem = item.item;
                                        
                                        return (<div className="cell" key={idx}>
                                            {cellitem?this.getFields(cellitem):''}
                                        </div>)
                                      })
                                    }
                                </div>
                              </div>
                            )
                            return ;
                         default:
                         return (
                          <div className="cell" key={idx}>
                               {cellitem?this.getFields(item.item):""}
                               {
                                 
                               }
                          </div>
                        )
                       }
                      
                     })
                   }
              </div>
            )
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
