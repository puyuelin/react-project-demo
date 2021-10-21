import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Input } from "antd";

export default class AddForm extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.setForm(this.props.form);
  }

  render() {
    return (
      <Form>
        <Form.Item
          label="角色名称"
          name="roleName"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 15 }}
          initialValue=""
          rules={[{ required: true, message: "角色名称必须输入" }]}
        >
          <Input placeholder="请输入角色名称" />
        </Form.Item>
      </Form>
    );
  }
}