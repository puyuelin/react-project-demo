import React, { Component } from "react";
import { message, Button, Card, Table, Modal } from "antd";

import { PAGE_SIZE } from "../../utils/constants";
import { reqRoles, reqAddRole, reqUpdateRole } from "../../api";
import AddForm from "./AddForm";
import AuthForm from "./AuthForm";
import memoryUtils from "../../utils/memoryUtils";
import { formateDate } from "../../utils/dateUtils";
import storageUtils from "../../utils/storageUtils";

export default class Role extends Component {
  state = {
    roles: [], // 所有角色的列表
    role: {}, // 选中的role
    isShowAdd: false, // 是否显示添加界面
    isShowAuth: false, // 是否显示设置权限界面
  };

  constructor(props) {
    super(props);

    this.auth = React.createRef();
  }

  initColumn = () => {
    this.columns = [
      {
        title: "角色名称",
        dataIndex: "name",
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        render: (create_time) => formateDate(create_time),
      },
      {
        title: "授权时间",
        dataIndex: "auth_time",
        render: formateDate,
      },
      {
        title: "授权人",
        dataIndex: "auth_name",
      },
    ];
  };

  getRoles = async () => {
    const result = await reqRoles();
    if (result.status === 0) {
      const roles = result.data;
      this.setState({
        roles,
      });
    }
  };

  onRow = (role) => {
    return {
      onClick: (event) => {
        this.setState({ role });
      },
    };
  };

  // 添加角色
  addRole = () => {
    this.form.validateFields(async (error, values) => {
      if (!error) {
        this.setState({ isShowAdd: false });

        const { roleName } = values;
        this.form.resetFields();

        const result = await reqAddRole(roleName);
        if (result.status === 0) {
          message.success("添加角色成功");
          const role = result.data;
          this.setState((state) => ({
            roles: [...state.roles, role],
          }));
        }
      } else {
        message.success("添加角色失败");
      }
    });
  };

  // 更新角色
  updateRole = async () => {
    this.setState({ isShowAdd: false });

    const role = this.state.role;
    const menus = this.auth.current.getMenus();
    role.menus = menus;
    role.auth_time = Date.now();
    role.auth_name = memoryUtils.user.username;

    const result = await reqUpdateRole(role);
    if (result.status === 0) {
      // 如果当前更新的是自己角色的权限, 强制退出
      if (role._id === memoryUtils.user.role_id) {
        memoryUtils.user = {};
        storageUtils.removeUser();
        this.props.history.replace("/login");
        message.success("当前用户角色权限成功");
      } else {
        message.success("设置角色权限成功");
        this.setState({
          roles: [...this.state.roles],
        });
      }
    }
  };

  componentDidMount() {
    this.initColumn();
    this.getRoles();
  }

  render() {
    const { roles, role, isShowAdd, isShowAuth } = this.state;

    const title = (
      <span>
        <Button
          type="primary"
          onClick={() => this.setState({ isShowAdd: true })}
        >
          创建角色
        </Button>{" "}
        &nbsp;&nbsp;
        <Button
          type="primary"
          disabled={!role._id}
          onClick={() => this.setState({ isShowAuth: true })}
        >
          设置角色权限
        </Button>
      </span>
    );

    return (
      <Card title={title} bordered={false}>
        <Table
          dataSource={roles}
          columns={this.columns}
          bordered
          rowKey="_id"
          pagination={{ defaultPageSize: PAGE_SIZE }}
          rowSelection={{
            type: "radio",
            selectedRowKeys: [role._id],
            onSelect: (role) => {
              this.setState({ role });
            },
          }}
          onRow={this.onRow}
        />

        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({ isShowAdd: false });
            this.form.resetFields();
          }}
        >
          <AddForm setForm={(form) => (this.form = form)} />
        </Modal>

        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({ isShowAuth: false });
          }}
        >
          <AuthForm ref={this.auth} role={role} />
        </Modal>
      </Card>
    );
  }
}
