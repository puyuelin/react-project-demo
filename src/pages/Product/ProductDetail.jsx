import React, { Component } from "react";
import { List, Card } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import LinkButton from "../../components/LinkButton";
import { BASE_IMG_URL } from "../../utils/constants";
import { reqCategory } from "../../api";

export default class ProductDetail extends Component {
  state = {
    cName1: "", // 一级分类名称
    cName2: "", // 二级分类名称
  };

  render() {
    // 读取携带过来的state数据
    const { name, desc, price, detail, imgs } =
      this.props.location.state.product;
    const { cName1, cName2 } = this.state;

    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <ArrowLeftOutlined style={{ marginRight: 10, fontSize: 20 }} />
        </LinkButton>

        <span>商品详情</span>
      </span>
    );

    return (
      <Card title={title} className="product-detail">
        <List>
          <List.Item>
            <span className="left">商品名称:</span>
            <span>{name}</span>
          </List.Item>
          <List.Item>
            <span className="left">商品描述:</span>
            <span>{desc}</span>
          </List.Item>
          <List.Item>
            <span className="left">商品价格:</span>
            <span>{price}元</span>
          </List.Item>
          <List.Item>
            <span className="left">所属分类:</span>
            <span>
              {cName1} {cName2 ? " --> " + cName2 : ""}
            </span>
          </List.Item>
          <List.Item>
            <span className="left">商品图片:</span>
            <span>
              {imgs.map((img) => (
                <img
                  key={img}
                  src={BASE_IMG_URL + img}
                  className="product-img"
                  alt="img"
                />
              ))}
            </span>
          </List.Item>
          <List.Item>
            <span className="left">商品详情:</span>
            <span dangerouslySetInnerHTML={{ __html: detail }}></span>
          </List.Item>
        </List>
      </Card>
    );
  }
}
