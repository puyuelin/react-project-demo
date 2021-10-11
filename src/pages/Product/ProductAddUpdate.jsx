import React, { PureComponent } from "react";
import { Card, Form, Input, Button, Cascader, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import PicturesWall from "./PicturesWall";
import RichTextEditor from "./RichTextEditor";
import LinkButton from "../../components/LinkButton";
import { reqCategorys, reqAddOrUpdateProduct } from "../../api";

const { TextArea } = Input;
export default class ProductAddUpdate extends PureComponent {
  state = {
    options: [],
  };

  initOptions = async (categorys) => {
    const options = categorys.map((c) => ({
      value: c._id,
      label: c.name,
      isLeaf: false,
    }));

    // 如果是一个二级分类商品的更新
    const { isUpdate, product } = this;
    const { pCategoryId } = product;
    if (isUpdate && pCategoryId !== "0") {
      const subCategorys = await this.getCategorys(pCategoryId);
      const childOptions = subCategorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }));

      const targetOption = options.find(
        (option) => option.value === pCategoryId
      );

      targetOption.children = childOptions;
    }

    this.setState({
      options,
    });
  };

  // 异步获取一级/二级分类列表, 并显示
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId);
    if (result.status === 0) {
      const categorys = result.data;
      if (parentId === "0") {
        this.initOptions(categorys);
      } else {
        return categorys;
      }
    }
  }

  // 验证价格的自定义验证函数
  validatePrice = (rule, value) => {
    if (value * 1 > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("价格必须大于0"));
  };

  // 用加载下一级列表的回调函数
  loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[0];
    targetOption.loading = true;

    const subCategorys 

    setTimeout(() => {
      targetOption.loading = false;
      targetOption.children = [
        {
          label: `${targetOption.label} Dynamic 1`,
          value: "dynamic1",
        },
        {
          label: `${targetOption.label} Dynamic 2`,
          value: "dynamic2",
        },
      ];
      setOptions([...options]);
    }, 1000);
  };

  render() {
    const { isUpdate, product } = this;

    const layout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 },
    };

    const title = (
      <span>
        <LinkButton
          onClick={() => this.props.history.goBack()}
          icon={<ArrowLeftOutlined style={{ fontSize: 20 }} />}
        ></LinkButton>
        <span>{isUpdate ? "修改商品" : "添加商品"}</span>
      </span>
    );

    return (
      <Card title={title}>
        <Form {...layout}>
          <Form.Item
            name="name"
            label="商品名称"
            rules={[{ required: true, message: "必须输入商品名称" }]}
            initialValue={product.name}
          >
            <Input placeholder="请输入商品名称" />
          </Form.Item>
          <Form.Item
            name="desc"
            label="商品描述"
            rules={[{ required: true, message: "必须输入商品描述" }]}
            initialValue={product.desc}
          >
            <TextArea
              placeholder="请输入商品描述"
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
          <Form.Item
            name="price"
            label="商品价格"
            rules={[
              { required: true, message: "必须输入商品价格" },
              { validator: this.validatePrice },
            ]}
            initialValue={product.price}
          >
            <Input type="number" placeholder="请输入商品价格" addonAfter="元" />
          </Form.Item>
          <Form.Item
            name="categoryIds"
            label="商品分类"
            rules={[{ required: true, message: "必须指定商品分类" }]}
            initialValue={product.categoryIds}
          >
            <Cascader
              placeholder="请指定商品分类"
              options={this.state.options}
              loadData={this.loadData}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
            <Button type="link" htmlType="button" onClick={onFill}>
              Fill form
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}
