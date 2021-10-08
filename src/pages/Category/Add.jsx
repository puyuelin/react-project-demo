import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Input, Select } from "antd";

const { Option } = Select;
export default class Add extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired,
    categorys: PropTypes.array.isRequired,
    parentId: PropTypes.string.isRequired,
  };

  componentDidMount() {
    this.props.setForm(this.props.form);
  }

  render() {
    const { categorys, parentId } = this.props;

    return (
      <Form>
        <Form.Item name="parentId" initialValue={parentId}>
          <Select>
            <Option value="0">一级分类</Option>
            {categorys.map((c) => (
              <Option value={c._id}>{c.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="categoryName"
          rules={[{ required: true, message: "分类名称必须输入" }]}
        >
          <Input placeholder="请输入分类名称" />
        </Form.Item>
      </Form>
    );
  }
}
