import React, { Component } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import { Layout } from "antd";

// import memoryUtils from "../../utils/memoryUtils";

import LeftNav from "../../components/LeftNav";
import Header from "../../components/Header";

import Home from "../Home"
import Category from "../Category";
import Product from "../Product"
import Role from "../Role"
import User from "../User"
import Bar from "../Charts/Bar"
import Line from "../Charts/Line"
import Pie from "../Charts/Pie"
import Order from "../Order"
import NotFound from "../NotFound"

const { Footer, Sider, Content } = Layout;

export default class Admin extends Component {
  render() {
    const user = memoryUtils.user;
    if (!user._id) {
      return <Redirect to="/login" />;
    }
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
              <Route path="/product" component={Product} />
              <Route path="/role" component={Role} />
              <Route path="/user" component={User} />
              <Route path="/charts/bar" component={Bar}/>
              <Route path="/charts/pie" component={Pie}/>
              <Route path="/charts/line" component={Line}/>
              <Route path="/order" component={Order}/>
              <Route component={NotFound}/>
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
