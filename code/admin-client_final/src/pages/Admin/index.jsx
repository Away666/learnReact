import React, { Component } from 'react'
// import memoryUtils from '../../utils/memoryUtils.js'
import {connect} from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../Home'
import Category from '../Category'
import Product from '../Product'
import User from '../User'
import Role from '../Role'
import Bar from '../Charts/bar'
import Line from '../Charts/line'
import Pie from '../Charts/pie'
import NotFound from '../NotFount'

const { Sider, Content, Footer } = Layout

class Admin extends Component {
  render() {
    // const user = memoryUtils.user
    const user = this.props.user
    if (!user || !user._id) {
      return <Redirect to="/login" />
    }
    return (
      <Layout style={{ minHeight: '100%' }}>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{ margin: '20px', backgroundColor: '#fff' }}>
            <Switch>
            <Redirect exact={true} from='/' to="/home" />
              <Route path="/home" component={Home}></Route>
              <Route path="/category" component={Category}></Route>
              <Route path="/product" component={Product}></Route>
              <Route path="/user" component={User}></Route>
              <Route path="/role" component={Role}></Route>
              <Route path="/charts/bar" component={Bar}></Route>
              <Route path="/charts/line" component={Line}></Route>
              <Route path="/charts/pie" component={Pie}></Route>
              <Route component={NotFound}></Route>
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center', color: '#ccc' }}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {}
)(Admin)
