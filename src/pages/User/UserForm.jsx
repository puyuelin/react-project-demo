import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form, Select, Input } from "antd";

const { Option } = Select;

export default class UserForm extends PureComponent {
  static propTypes = {
    setForm: PropTypes.func.isRequired,
    roles: PropTypes.array.isRequired,
    user: PropTypes.object,
  };

  componentDidMount() {
    this.props.setForm(this.props.form);
  }

  render() {
    const { roles, user } = this.props;

    return (
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 15 }}>
        <Form.Item label="用户名" name="username" initialValue={user.username}>
          <Input placeholder="请输入用户名" />
        </Form.Item>

        {user._id ? null : (
          <Form.Item label="密码" name="password" initialValue={user.password}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        )}

        <Form.Item label="手机号" name="phone" initialValue={user.phone}>
          <Input placeholder="请输入手机号" />
        </Form.Item>

        <Form.Item label="邮箱" name="email" initialValue={user.email}>
          <Input placeholder="请输入邮箱" />
        </Form.Item>

        <Form.Item label="角色" name="role_id" initialValue={user.role_id}>
          <Select>
            {roles.map((role) => (
              <Option key={role._id} value={role._id}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    );
  }
}
