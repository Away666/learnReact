import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import AddUpdate from './add-update'
import Detail from './detail'
import Home from './home'
import './index.less'

export default class Product extends Component {

  render() {
    return (
      <Switch>
        <Route exact path='/product' component={Home}></Route>
        <Route path='/product/detail' component={Detail}></Route>
        <Route path='/product/addupdate' component={AddUpdate}></Route>
        <Redirect to='/product'></Redirect>
      </Switch>
    )
  }
}
