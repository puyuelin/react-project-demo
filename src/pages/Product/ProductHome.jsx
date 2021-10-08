import React, { Component } from "react";
import { Card, Select, Input, Button, Table, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import LinkButton from "../../components/LinkButton";
import { reqProducts, reqSearchProducts, reqUpdateStatus } from "../../api";
import { PAGE_SIZE } from "../../utils/constants";

const { Option } = Select;

export default class ProductHome extends Component {
  state = {
    total: 0, // 商品的总数量
    products: [], // 商品的数组
    loading: false, // 是否正在加载中
    searchName: "", // 搜索的关键字
    searchType: "productName", // 根据哪个字段搜索
  };

  // 初始化table的列的数组
  initColumns = () => {
    this.columns = [
      {
        title: "商品名称",
        dataIndex: "name",
      },
      {
        title: "商品描述",
        dataIndex: "desc",
      },
      {
        title: "价格",
        dataIndex: "price",
        render: (price) => "¥" + price, // 当前指定了对应的属性, 传入的是对应的属性值
      },
      {
        width: 100,
        title: "状态",
        render: (product) => {
          const { status, _id } = product;
          const newStatus = status === 1 ? 2 : 1;
          return (
            <span>
              <Button
                type="primary"
                onClick={() => this.updateStatus(_id, newStatus)}
              >
                {status === 1 ? "下架" : "上架"}
              </Button>
              <span>{status === 1 ? "在售" : "已下架"}</span>
            </span>
          );
        },
      },
      {
        width: 100,
        title: "操作",
        render: (product) => {
          return (
            <span>
              <LinkButton
                onClick={() =>
                  this.props.history.push("/product/detail", { product })
                }
              >
                详情
              </LinkButton>
              <LinkButton
                onClick={() =>
                  this.props.history.push("/product/addupdate", product)
                }
              >
                修改
              </LinkButton>
            </span>
          );
        },
      },
    ];
  };

  // 获取指定页码的列表数据显示
  getProducts = async (pageNum) => {
    this.pageNum = pageNum;
    this.setState({ loading: false });

    const { searchName, searchType } = this.state;
    let result;
    if (searchName) {
      result = await reqSearchProducts({
        pageNum,
        pageSize: PAGE_SIZE,
        searchName,
        searchType,
      });
    } else {
      result = await reqProducts(pageNum, PAGE_SIZE);
    }

    this.setState({ loading: false });
    if (result.status === 0) {
      const { total, list } = result.data;
      this.setState({ total, products: list });
    }
  };

  // 更新指定商品的状态
  updateStatus = async (productId, status) => {
    const result = await reqUpdateStatus(productId, status);
    if (result.status === 0) {
      message.success("更新商品成功");
      this.getProducts(this.pageNum);
    }
  };

  componentDidMount() {
    this.initColumns();
    this.getProducts(1);
  }

  render() {
    const { products, total, loading, searchType, searchName } = this.state;

    const title = (
      <span>
        <Select
          value={searchType}
          style={{ width: 150 }}
          onChange={(value) => this.setState({ searchType: value })}
        >
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input
          placeholder="关键字"
          style={{ width: 150, margin: "0 15px" }}
          value={searchName}
          onChange={(e) => this.setState({ searchName: e.target.value })}
        />
        <Button type="primary" onClick={() => this.getProducts(1)}>
          搜索
        </Button>
      </span>
    );

    const extra = (
      <Button
        onClick={() => this.props.history.push("/product/addupdate")}
        type="primary"
        icon={<PlusOutlined />}
      >
        添加商品
      </Button>
    );

    return (
      <Card title={title} extra={extra} bordered={false}>
        <Table
          bordered
          rowKey="_id"
          loading={loading}
          dataSource={products}
          columns={this.columns}
          pagination={{
            current: this.pageNum,
            total,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            onChange: this.getProducts,
          }}
        />
      </Card>
    );
  }
}
