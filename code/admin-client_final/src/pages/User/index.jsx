import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { formateDate } from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from '../../api'
import UserForm from './userForm'

export default class User extends Component {
  state = {
    users: [],
    roles: [],
    visible: false,
    visibleDelete: false
  }

  initColums = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: (role_id) => this.roleNames[role_id]
      },
      {
        title: '操作',
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
        )
      }
    ];
  }

  // 根据role的数组，生成包含所有角色名的对象（属性名用角色id值）
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
    this.roleNames = roleNames
  }

  getUsers = async () => {
    const result = await reqUsers()
    if (result.status === 0) {
      const { users, roles } = result.data
      this.initRoleNames(roles)
      this.setState({
        users,
        roles
      })
    }
  }

  //添加或修改操作
  addOrUpdateUser = async () => {
    this.setState({
      visible: false
    })
    const user = this.form.getFieldsValue()
    this.form.resetFields()
    // 如果是更新，需要给user指定_id属性
    if (this.user) {
      user._id = this.user._id
    }
    const result = await reqAddOrUpdateUser(user)
    if (result.status === 0) {
      message.success(`${this.user ? '修改' : '添加'}用户成功！`)
      this.getUsers()
    }
  }

  showUpdate = (user) => {
    this.user = user //保存user
    this.setState({
      visible: true
    })
  }

  handleCancel = () => {
    this.form.resetFields()
    this.setState({
      visible: false
    })
    this.user = null
  }


  componentWillMount() {
    this.initColums()
  }

  componentDidMount() {
    this.getUsers()
  }

  // 删除操作
  deleteUser = (user) => {
    Modal.confirm({
      title: `您确定要删除${user.username}吗？`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if (result.status === 0) {
          message.success('删除用户成功！')
          this.getUsers()
        }
      }
    })
  }


  render() {
    const { users, roles, visible } = this.state
    const user = this.user || {}
    const title = <Button type="primary" onClick={() => this.setState({ visible: true })}>创建用户</Button>
    return (
      <Card title={title}>
        <Table
          dataSource={users}
          columns={this.columns}
          bordered
          pagination={{ defaultPageSize: 5 }}
          rowKey="_id" />
        <Modal
          title={user._id ? '修改用户' : '添加用户'}
          okText='确认'
          cancelText='取消'
          visible={visible}
          onOk={this.addOrUpdateUser}
          onCancel={this.handleCancel}
        >
          <UserForm
            setForm={(form) => { this.form = form }}
            roles={roles}
            user={user}
          ></UserForm>
        </Modal>
      </Card>
    )
  }
}
