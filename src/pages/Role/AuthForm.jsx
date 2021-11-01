import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Input, Tree } from "antd";
import menuList from "../../config/menuConfig";

export default class AuthForm extends Component {
  static propTypes = {
    role: PropTypes.object,
  };

  constructor(props) {
    super(props);

    // 根据传入角色的menus生成初始状态
    const { menus } = this.props.role;
    this.state = {
      checkedKeys: menus,
    };
  }

  // 选中某个node时的回调
  onCheck = (checkedKeys) => {
    this.setState({ checkedKeys });
    this.props.role.menus = checkedKeys;
  };

  render() {
    this.props.role.menus = [];
    const { role } = this.props;
    const { checkedKeys } = this.state;

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 15 },
    };

    return (
      <div>
        <Form.Item label="角色名称" {...formItemLayout}>
          <Input value={role.name} disabled />
        </Form.Item>

        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
          treeData={menuList}
        />
      </div>
    );
  }
}
