import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Tree } from 'antd'
import menuList from '../../config/menuConfig'

const Item = Form.Item
const { TreeNode } = Tree;

export default class AuthForm extends PureComponent {

  static propTypes = {
    role: PropTypes.object
  }

  constructor(props) {
    super(props)

    const { menus } = this.props.role
    this.state = {
      checkedKeys: menus
    }
  }

  getTreeNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      )
      return pre
    }, [])
  }

  // 为父组件提交获取最新menus数据的方法
  getMenus = () => this.state.checkedKeys

  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
  };


  componentWillMount() {
    this.TreeNodes = this.getTreeNodes(menuList)
  }

  // 当组件接收到新的属性时自动调用
  UNSAFE_componentWillReceiveProps(nextProps) {
    const menus = nextProps.role.menus
    this.setState({
      checkedKeys: menus
    })
    // this.state.checkedKeys = menus
  }

  render() {

    const { role } = this.props
    const { checkedKeys } = this.state

    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 10 }, // 右侧包裹的宽度
    }

    return (
      <Form>
        <Item label="角色名称" {...formItemLayout}>
          <Input value={role.name} disabled></Input>
        </Item>
        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        >
          <TreeNode title="平台权限" key="all">
            {this.TreeNodes}
          </TreeNode>
        </Tree>
      </Form>
    )
  }
}

