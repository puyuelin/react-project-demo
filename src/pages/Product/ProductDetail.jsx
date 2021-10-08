import React, { Component } from "react";
import { List, Card } from "antd";

import LinkButton from "../../components/link-button";
import { BASE_IMG_URL } from "../../utils/constants";
import { reqCategory } from "../../api";

export default class ProductDetail extends Component {
  state = {
    cName1: "", // 一级分类名称
    cName2: "", // 二级分类名称
  };

  render() {
    return <div>ProductDetail</div>;
  }
}
