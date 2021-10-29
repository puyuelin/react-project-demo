import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Input } from "antd";

export default class Update extends Component {
  formRef = React.createRef();

  /* static propTypes = {
    setForm: PropTypes.func.isRequired,
    categoryName: PropTypes.string.isRequired,
  }; */

  componentDidMount() {
    this.props.setForm(this.formRef);
  }

  render() {
    const { categoryName } = this.props;
    return (
      <Form ref={this.formRef}>
        <Form.Item
          name="categoryName"
          initialValue={categoryName}
          rules={[{ required: true, message: "分类名称必须输入" }]}
        >
          <Input placeholder="请输入分类名称" />
        </Form.Item>
      </Form>
    );
  }
}
