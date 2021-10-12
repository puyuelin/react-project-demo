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

  constructor(props) {
    super(props);

    this.pw = React.createRef();
    this.editor = React.createRef();
  }

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
  };

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

    const subCategorys = await this.getCategorys(targetOption.value);
    targetOption.loading = false;

    if (subCategorys && subCategorys.length > 0) {
      const childOptions = subCategorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }));
      targetOption.children = childOptions;
    } else {
      // 当前选中的分类没有二级分类
      targetOption.isLeaf = true;
    }

    this.setState({ options: [...this.state.options] });
  };

  submit = () => {
    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        const { name, desc, price, categoryIds } = values;
        let pCategoryId, categoryId;
        if (categoryIds.length === 1) {
          pCategoryId = "0";
          categoryId = categoryIds[0];
        } else {
          pCategoryId = categoryIds[0];
          categoryId = categoryIds[1];
        }
        const imgs = this.pw.current.getImgs();
        const detail = this.editor.current.getDetail();

        const product = {
          name,
          desc,
          price,
          imgs,
          detail,
          pCategoryId,
          categoryId,
        };

        // 如果是更新, 需要添加_id
        if (this.isUpdate) {
          product._id = this.product._id;
        }

        const result = await reqAddOrUpdateProduct(product);
        if (result.status === 0) {
          message.success(`${this.isUpdate ? "更新" : "添加"}商品成功!`);
          this.props.history.goBack();
        } else {
          message.error(`${this.isUpdate ? "更新" : "添加"}商品失败!`);
        }
      }
    });
  };

  componentDidMount() {
    const product = this.props.location.state; // 如果是添加没值, 否则有值
    this.isUpdate = !!product;
    this.product = product || {};

    this.getCategorys("0");
  }

  render() {
    const { isUpdate, product } = this;
    const { pCategoryId, categoryId, imgs, detail } = product;

    const categoryIds = [];
    if (isUpdate) {
      // 商品是一个一级分类的商品
      if (pCategoryId === "0") {
        categoryIds.push(categoryId);
      } else {
        // 商品是一个二级分类的商品
        categoryIds.push(pCategoryId);
        categoryIds.push(categoryId);
      }
    }

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
          <Form.Item label="商品图片">
            <PicturesWall ref={this.pw} imgs={imgs} />
          </Form.Item>
          <Form.Item
            label="商品详情"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 20 }}
          >
            <RichTextEditor ref={this.editor} detail={detail} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={this.submit}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}
