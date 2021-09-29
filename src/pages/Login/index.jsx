import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import { reqLogin } from "../../api";

import logo from "../../assets/images/logo.png";
import "./login.less";

export default class Login extends Component {
  login = async (values) => {
    const { username, password } = values;
    const result = await reqLogin(username, password);

    if (result.status === 0) {
      message.success("登录成功");

      const user = result.data;
      memoryUtils.user = user;
      storageUtils.saveUser(user);

      this.props.history.replace("/");
    } else {
      message.error(result.msg);
    }
  };

  validator = (rules, value, callback) => {
    const pwdReg = /^[a-zA-Z0-9_]+$/;
    const length = value && value.length;
    if (!value) {
      return Promise.reject(new Error("必须输入密码"));
    } else if (length < 4) {
      return Promise.reject(new Error("密码必须大于 4 位"));
    } else if (length > 12) {
      return Promise.reject(new Error("密码必须小于 12 位"));
    } else if (!pwdReg.test(value)) {
      return Promise.reject(new Error("密码必须是英文、 数组或下划线组成"));
    } else {
      return Promise.resolve();
    }
  };

  render() {
    /* const user = memoryUtils.user;
    if (user && user._id) {
      return <Redirect to="/" />;
    } */
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h1>React 项目: 后台管理系统</h1>
        </header>
        <section className="login-content">
          <h3>用户登录</h3>
          <Form className="login-form" onFinish={this.login}>
            <Form.Item
              name="username"
              rules={[
                { required: true, whitespace: true, message: "必须输入用户名" },
                { min: 4, message: "用户名必须大于 4 位" },
                { max: 12, message: "用户名必须小于 12 位" },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: "用户名必须是英文、 数组或下划线组成",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
                style={{ color: "rgba(0,0,0,.25)" }}
              />
            </Form.Item>

            <Form.Item rules={[{ validator: this.validator }]} name="password">
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                style={{ color: "rgba(0,0,0,.25)" }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}
