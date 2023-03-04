import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Modal } from "antd";
import { connect } from "react-redux";

import { formateDate } from "../../utils/dateUtils";
// import memoryUtils from '../../utils/memoryUtils'
// import storageUtils from '../../utils/storageUtils'
import menuList from "../../config/menuConfig";
import "./index.less";
import LinkButton from "../link-button";
import { logout } from "../../redux/actions";

class Header extends Component {
  state = {
    currentTime: formateDate(Date.now()),
  };

  getTime = () => {
    this.setTime = setInterval(() => {
      const currentTime = formateDate(Date.now());
      this.setState({ currentTime });
    }, 1000);
  };

  getTitle = () => {
    const path = this.props.location.pathname;
    let title;
    menuList.forEach((item) => {
      if (item.key === path) {
        title = item.title;
      } else if (item.children) {
        const cItem = item.children.find(
          (cItem) => path.indexOf(cItem.key) === 0
        );
        if (cItem) {
          title = cItem.title;
        }
      }
    });
    return title;
  };

  logout = () => {
    Modal.confirm({
      title: "你确定退出吗？",
      onOk: () => {
        // storageUtils.removeUser();
        // memoryUtils.user = {};
        // this.props.history.replace("/login");
        this.props.logout();
      },
    });
  };

  /**
   * 第一次render()之后执行一次
   * 一般再次执行异步操作：发ajax请求/启动定时器
   */
  componentDidMount() {
    this.getTime();
  }

  componentWillUnmount() {
    clearInterval(this.setTime);
  }

  render() {
    // const username = memoryUtils.user.username
    const username = this.props.user.username;
    // const title = this.getTitle()
    const title = this.props.headTitle;

    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎，{username}</span>
          {/* <span className="header-top-logout" onClick={this.logout}>退出</span> */}
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{this.state.currentTime}</span>
            <img
              src="http://api.map.baidu.com/images/weather/day/qing.png"
              alt="weather"
            />
            <span>晴</span>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({ headTitle: state.headTitle, user: state.user }),
  {logout}
)(withRouter(Header));
