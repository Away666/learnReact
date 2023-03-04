import React, { Component } from "react";
import { Card, Icon, List } from "antd";

import memoryUtils from "../../utils/memoryUtils";
import { BASE_IMG_URL } from "../../utils/constants";
import { reqCategory } from "../../api";

const Item = List.Item;

export default class Detail extends Component {
  state = {
    cName1: "",
    cName2: "",
  };

  async componentDidMount() {
    console.log(this.props);
    // const { pCategoryId, categoryId } = this.props.location.state.product
    const { pCategoryId, categoryId } = memoryUtils.product;
    if (pCategoryId === "0") {
      const result = await reqCategory(categoryId);
      const cName1 = result.data.name;
      this.setState({ cName1 });
    } else {
      // 通过多个await方式发多个请求：后面一个请求是在前一个请求成功返回之后才发送
      // const result1 = await reqCategory(pCategoryId)
      // const result2 = await reqCategory(categoryId)
      // const cName1 = result1.data.name
      // const cName2 = result2.data.name

      // 一次性发送多个请求，只有都成功了，才正常处理
      const results = await Promise.all([
        reqCategory(pCategoryId),
        reqCategory(categoryId),
      ]);
      const cName1 = results[0].data.name;
      const cName2 = results[1].data.name;

      this.setState({ cName1, cName2 });
    }
  }

  componentWillUnmount() {
    memoryUtils.product = {};
  }

  render() {
    // const { name, desc, price, detail, imgs } = this.props.location.state.product
    const { name, desc, price, detail, imgs } = memoryUtils.product;
    const { cName1, cName2 } = this.state;
    const title = (
      <span>
        <Icon
          type="arrow-left"
          style={{ color: "#1DA57A", fontSize: "20px" }}
          onClick={() => {
            this.props.history.goBack();
          }}
        ></Icon>
        <span style={{ marginLeft: "10px" }}>商品详情</span>
      </span>
    );
    return (
      <Card title={title}>
        <List>
          <Item className="product-detail">
            <span className="left">商品名称：</span>
            <span>{name}</span>
          </Item>
          <Item className="product-detail">
            <span className="left">商品描述：</span>
            <span>{desc}</span>
          </Item>
          <Item className="product-detail">
            <span className="left">商品价格：</span>
            <span>{price}元</span>
          </Item>
          <Item className="product-detail">
            <span className="left">所属分类：</span>
            <span>
              {cName1} {cName2 ? "-->" + cName2 : ""}
            </span>
          </Item>
          <Item className="product-detail">
            <span className="left">商品图片：</span>
            <span>
              {imgs.map((img) => {
                return (
                  <img
                    src={BASE_IMG_URL + img}
                    key={img}
                    alt="img"
                    style={{
                      width: "200px",
                      height: "200px",
                      border: "1px solid #002140",
                      marginRight: "10px",
                    }}
                  />
                );
              })}
            </span>
          </Item>
          <Item className="product-detail">
            <span className="left">商品详情：</span>
            <div dangerouslySetInnerHTML={{ __html: detail }}></div>
          </Item>
        </List>
      </Card>
    );
  }
}
