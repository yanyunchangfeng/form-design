
# react-form-design

react-form-design可通过拖拽生成自定义表单，需搭配ant design组件库使用。

## Index

* [Install](#install)
* [Usage](#usage)
* [API](#api)
* [Compatibility](#compatibility)
* [License](#license)
##sc
## Install
```
yarn add react-form-design 
```

## Usage
```css
.form-display .ant-col-8,
.form-display .ant-col-10 {
  padding-left: 16px;
}
.form-display .ant-form-item {
  display: flex;
  margin-bottom: 16px;
}
.form-display .ant-form-item-label {
  text-overflow: ellipsis;
}
.form-display .ant-form-item-control-wrapper {
  flex: 1 1 auto;
}

```
```jsx
import { Button, Form, Tabs } from "antd";
import { FormDesign } from 'antd';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { FormDisplay } = FormDesign;

class FormShow extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };
  render() {
    const { fieldsData, form } = this.props;
    return (
      <Form
        className="form-display"
        layout="inline"
        onSubmit={this.handleSubmit}
      >
        <FormDisplay
          fieldsData={fieldsData}
          form={form}
          formItemLayout={{
            labelCol: {
              span: 8
            },
            wrapperCol: {
              span: 10
            }
          }}
        />
        <FormItem wrapperCol={{ span: 10, offset: 12 }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedFormShow = Form.create({
  mapPropsToFields(props) {
    let obj = {};
    let { initValues } = props;
    if (initValues) {
      Object.keys(initValues).forEach(key => {
        obj[key] = Form.createFormField({
          value: initValues[key]
        });
      });
    }
    return obj;
  }
})(FormShow);
class App extends PureComponent {
  state = { fieldsData: [] };
  save = data => {
    this.setState({ fieldsData: data });
  };
  onSubmit = values => {
    console.log(values);
  };
  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const onSubmit = this.props;
        if (onSubmit) {
          onSubmit(values);
        }
      }
    });
  };
  render() {
    return (
      <Tabs type="card">
        <TabPane tab="form表单设计" key="1">
          <FormDesign onSave={this.save} height="500px" />
        </TabPane>
        <TabPane tab="form表单展示" key="2">
          <div style={{ backgroundColor: "#fff", padding: "15px 0" }}>
            <WrappedFormShow fieldsData={this.state.fieldsData} />
          </div>
        </TabPane>
        <TabPane tab="form表单还原" key="3">
          <FormDesign
            onSave={this.save}
            height="500px"
            fieldsData={this.state.fieldsData}
          />
        </TabPane>
      </Tabs>
    );
  }
}
ReactDOM.render(<App />, mountNode);
```


## API

### FormDesign
自定义表单展示，可拖拽生成所需表单。

| 参数     | 说明         | 类型         | 默认值 |
|----------|-------------|-------------|-------|
| className    | 设置表单class          | string | - |
| height    | 设置表单高度           | string  | - |
| onSave    | 用于保存表单数据          | (fieldsData)=>void  | - |

### FormDisplay
展示之前定义的自定义表单。

| 参数     | 说明         | 类型         | 默认值 |
|----------|-------------|-------------|-------|
| form    | ant design 中经 Form.create() 包装过的组件自带的this.props.form 属性，该属性必传           | object  | - |
| fieldsData    | 自定义表单的数据，必须传，用于展示表单           | array  | `[]` |
| formItemLayout    | 用于设置label标签布局和输入控件布局样式         | object |`{labelCol: {span: 7},wrapperCol: {span: 17}}` |

## Compatibility

该插件支持chrome，firefox最新两个版本。

## License

Licensed under the MIT License
