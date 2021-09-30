import React, { Component } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import { Layout } from "antd";

// import memoryUtils from "../../utils/memoryUtils";

import LeftNav from "../../components/LeftNav";
import Header from "../../components/Header";

import Home from "../Home"
import Category from "../Category";

const { Footer, Sider, Content } = Layout;

export default class Admin extends Component {
  render() {
    /* const user = memoryUtils.user;
    if (!user._id) {
      return <Redirect to="/login" />;
    } */
    return (
      <Layout style={{minHeight: '100%'}}>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{margin: 20, backgroundColor: '#fff'}}>
            <Switch>
              <Route path="/home" component={Home} />
              <Route path="/products/category" component={Category} />
              <Redirect to="/home" />
            </Switch>
          </Content>
          <Footer style={{ textAlign: "center", color: "#aaaaaa" }}>
            推荐使用谷歌浏览器， 可以获得更佳页面操作体验
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
