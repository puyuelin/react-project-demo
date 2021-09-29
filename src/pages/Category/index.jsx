import React, { Component } from "react";
import { Card, Table, Button, message, Modal } from "antd";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";

import LinkButton from "../../components/LinkButton";
import { reqCategorys, reqUpdateCategory, reqAddCategory } from "../../api";

export default class Category extends Component {
  state = {
    loading: false, // 是否正在获取数据中
    categorys: [], // 一级分类列表
    subCategorys: [], // 二级分类列表
    parentId: "0", // 当前需要显示的分类列表的父分类ID
    parentName: "", // 当前需要显示的分类列表的父分类名称
    showStatus: 0, // 标识添加/更新的确认框是否显示, 0: 都不显示, 1: 显示添加, 2: 显示更新
  };

  initColumns = () => {
    this.columns = [
      {
        title: "分类的名称",
        dataIndex: "name",
      },
      {
        title: "操作",
        width: 300,
        render: (category) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(category)}>
              修改分类
            </LinkButton>
            {this.state.parentId === "0" ? (
              <LinkButton onClick={() => this.showCategorys(category)}>
                查看子分类
              </LinkButton>
            ) : null}
          </span>
        ),
      },
    ];
  };

  /**
   * 异步获取一级/二级分类列表显示
   * parentId: 如果没有指定根据状态中的parentId请求, 如果指定了根据指定的请求
   */
  getCategorys = async (parentId) => {
    this.setState({ loading: true });
    parentId = parentId || this.state.parentId;
    const result = await reqCategorys(parentId);
    this.setState({ loading: false });
    if (result.status === 0) {
      const categorys = result.data;
      if (parentId === "0") {
        this.setState({ categorys });
      } else {
        this.setState({ subCategorys: categorys });
      }
    } else {
      message.error("获取分类列表失败");
    }
  };

  /**
   * 显示指定一级分类对象的二子列表
   */
  showSubCategorys = (category) => {
    this.setState({ parentId: category._id, parentName: category.name }, () => {
      this.getCategorys();
    });
  };

  /**
   * 显示指定一级分类列表
   */
  showCategorys = () => {
    this.setState({
      parentId: "0",
      parentName: "",
      subCategorys: [],
    });
  };

  showUpdate = () => {};

  componentDidMount() {
    this.initColumns();
    this.getCategorys();
  }

  render() {
    const {
      categorys,
      parentId,
      subCategorys,
      loading,
      parentName,
      showStatus,
    } = this.state;

    const extra = (
      <Button type="primary" icon={<PlusOutlined />}>
        添加
      </Button>
    );
    const title =
      parentId === "0" ? (
        "一级分类列表"
      ) : (
        <span>
          <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
          <RightOutlined style={{ marginRight: 5 }} />
          <span>{parentName}</span>
        </span>
      );

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey="_id"
          columns={this.columns}
          dataSource={parentId === "0" ? categorys : subCategorys}
          loading={loading}
          pagination={{ defaultPageSize: 5, showQuickJumper: true }}
        />
      </Card>
    );
  }
}
