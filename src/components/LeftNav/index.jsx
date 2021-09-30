import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu } from "antd";

import "./index.less";
import logo from "../../assets/images/logo.png";
import menuList from "../../config/menuConfig";

const { SubMenu } = Menu;

class LeftNav extends Component {
  state = {
    collapsed: false,
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  getMenuNodes = (menuList) => {
    return menuList.map((item) => {
      if (!item.children) {
        return (
          <Menu.Item key={item.key} icon={item.icon}>
            {item.title}
          </Menu.Item>
        );
      } else {
        return (
          <SubMenu key={item.key} title={item.title} icon={item.icon}>
            {this.getMenuNodes(item.children)}
          </SubMenu>
        );
      }
    });
  };

  handleClick = ({ key }) => {
    this.props.history.replace(key);
  };

  handleOpenChange = (openKeys) => {
    this.path = openKeys;
  };

  render() {
    let path = this.props.location.pathname;
    let selectedPath = path;
    if (selectedPath.indexOf("/products") === 0) {
      selectedPath = "/products";
    }

    return (
      <div className="left-nav">
        <Link to="/" className="left-nav-header">
          <img src={logo} alt="logo" />
          <h1>硅谷后台</h1>
        </Link>

        <Menu
          mode="inline"
          theme="dark"
          defaultOpenKeys={[selectedPath]}
          defaultSelectedKeys={[path]}
          onClick={this.handleClick}
        >
          {this.getMenuNodes(menuList)}
        </Menu>
      </div>
    );
  }
}

export default withRouter(LeftNav);
