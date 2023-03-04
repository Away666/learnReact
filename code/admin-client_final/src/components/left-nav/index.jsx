import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu, Icon } from "antd";
import { connect } from "react-redux";

import "./index.less";
import Logo from "../../assets/images/logo192.png";
import menuList from "../../config/menuConfig.js";
// import memoryUtils from "../../utils/memoryUtils";
import { setHeadTitle } from "../../redux/actions";

const { SubMenu } = Menu;

class LeftNav extends Component {
  /**
   * 判断当前登陆用户对item是否有权限
   */
  hasAuth = (item) => {
    const { key, isPublic } = item;
    // const menus = memoryUtils.user.role.menus;
    const menus = this.props.user.role.menus;
    // const username = memoryUtils.user.username;
    const username = this.props.user.username;
    /**
     * 如果当前用户是admin
     * 如果当前item是公开的
     * 当前用户有此item的权限：key有没有menus中
     */
    if (username === "admin" || isPublic || menus.indexOf(key) !== -1) {
      return true;
    } else if (item.children) {
      // 如果当前用户有此item的某个子item的权限
      return !!item.children.find((child) => menus.indexOf(child.key) !== -1);
    }
    return false;
  };

  /**
   * 根据menu的数据数组生成对应的标签数组
   * 使用map() + 递归调用
   */
  // getMenuNodes = (menuList) => {
  //   return menuList.map(item => {
  //     if (!item.children) {
  //       return (
  //         <Menu.Item key={item.key}>
  //           <Link to={item.key}>
  //             <Icon type={item.icon} />
  //             <span>{item.title}</span>
  //           </Link>
  //         </Menu.Item>
  //       )
  //     } else {
  //       return (
  //         <SubMenu
  //           key={item.key}
  //           title={
  //             <span>
  //               <Icon type={item.icon} />
  //               <span>{item.title}</span>
  //             </span>
  //           }
  //         >
  //           {
  //             this.getMenuNodes(item.children)
  //           }
  //         </SubMenu>
  //       )
  //     }
  //   })
  // }

  /**
   * 根据menu的数据数组生成对应的标签数组
   * 使用reduce() + 递归调用
   */
  getMenuNodes = (menuList) => {
    // 得到当前请求的路由路径
    const path = this.props.location.pathname;
    return menuList.reduce((pre, item) => {
      // 如果当前用户有item对应的权限，才需要显示对应的菜单项
      if (this.hasAuth(item)) {
        // 向pre添加<Menu.Item>
        if (!item.children) {
          // 判断item是否是当前对应的item
          if (item.key === path || path.indexOf(item.key) === 0) {
            // 更新redux中的headTitle状态
            this.props.setHeadTitle(item.title);
          }
          pre.push(
            <Menu.Item key={item.key}>
              <Link
                to={item.key}
                onClick={() => this.props.setHeadTitle(item.title)}
              >
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          );
        } else {
          // 查找一个与当前请求路径匹配的子Item
          const cItem = item.children.find(
            (cItem) => path.indexOf(cItem.key) === 0
          );
          // 如果存在，说明当前item的子列表需要打开
          if (cItem) {
            this.openKey = item.key;
          }
          pre.push(
            <SubMenu
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </span>
              }
            >
              {this.getMenuNodes(item.children)}
            </SubMenu>
          );
        }
      }
      return pre;
    }, []);
  };

  UNSAFE_componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList);
  }

  render() {
    let path = this.props.location.pathname;
    if (path.indexOf("/product") === 0) {
      path = "/product";
    }
    const openKey = this.openKey;

    return (
      <div className="left-nav">
        <Link to="/" className="left-nav-header">
          <img src={Logo} alt="Logo" />
          <h1>后台管理</h1>
        </Link>
        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
        >
          {this.menuNodes}
        </Menu>
      </div>
    );
  }
}

export default connect((state) => ({ user: state.user }), { setHeadTitle })(
  withRouter(LeftNav)
);
