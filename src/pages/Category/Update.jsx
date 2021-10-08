import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Input } from "antd";

export default class Update extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired,
    categoryName: PropTypes.string.isRequired,
  };

  componentDidMount() {
    this.props.setForm(this.props.form);
  }

  render() {
    const { categoryName } = this.props;
    return (
      <Form>
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
