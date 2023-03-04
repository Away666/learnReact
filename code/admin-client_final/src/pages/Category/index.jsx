import React, { Component } from 'react'
import { Card, Button, Icon, Table, message, Modal } from 'antd'
import LinkButton from '../../components/link-button'
import { reqCategorys, reqUpdateCategory, reqAddCategory, reqDeleteCategory } from '../../api'
import AddForm from './addForm'
import UpdateForm from './updateForm'

export default class Category extends Component {

  state = {
    loading: false,
    categorys: [],
    parentId: '0',
    subCategorys: [],
    parentName: '',
    visibleAdd: false,
    visibleUpdate: false,
    visibleDelete: false
  }

  initColumns = () => {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        width: 300,
        render: (category) => (
          <span>
            <LinkButton onClick={() => this.showUpdateModal(category)}>修改分类</LinkButton>
            {/*如何向实践回调函数传递参数：先定义一个匿名函数，在函数调用处理的函数并传入数据*/}
            {this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : ''}
            <LinkButton onClick={() => this.showDeleteModal(category)}>删除分类</LinkButton>
          </span>
        )
      }
    ];
  }

  //获取分类数据
  getCategorys = async (parentId) => {
    this.setState({ loading: true })
    parentId = parentId || this.state.parentId
    const result = await reqCategorys(parentId)
    this.setState({ loading: false })
    if (result.status === 0) {
      const categorys = result.data
      if (parentId === '0') {
        this.setState({
          categorys
        })
      } else {
        this.setState({
          subCategorys: categorys
        })
      }
    } else {
      message.error('获取分类列表失败')
    }
  }

  //显示二级分类
  showSubCategorys = (category) => {
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => {
      this.getCategorys()
    })
  }

  //显示一级分类
  showCategorys = () => {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }

  //添加操作
  showAddModal = () => {
    this.setState({
      visibleAdd: true,
    });
  };

  addCategory = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          visibleAdd: false
        })

        const { parentId, categoryName } = this.form.getFieldsValue()

        this.form.resetFields()

        const result = await reqAddCategory(categoryName, parentId)
        if (result.status === 0) {
          // 添加的分类就是当前分类列表下的分类
          if (parentId === this.state.parentId) {
            this.getCategorys()
          } else if (parentId === '0') { //在二级列表下添加一级分类
            this.getCategorys('0')
          }
        }
      }
    })
  }

  handleAddCancel = () => {
    this.setState({
      visibleAdd: false,
    });
  };

  //修改操作
  showUpdateModal = (category) => {
    this.category = category
    this.setState({
      visibleUpdate: true,
    });
  };

  updateCategory = () => {

    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          visibleUpdate: false
        })

        const categoryId = this.category._id
        // const categoryName = this.form.getFieldValue('categoryName')
        const { categoryName } = values

        this.form.resetFields()

        const result = await reqUpdateCategory({ categoryId, categoryName })
        if (result.status === 0) {
          this.getCategorys()
        }
      }
    })
  }

  handleUpdateCancel = () => {
    this.form.resetFields()
    this.setState({
      visibleUpdate: false,
    });
  };

  //删除操作
  showDeleteModal = (category) => {
    this.category = category
    this.setState({
      visibleDelete: true,
    });
  }

  deleteCategory = async () => {
    const categoryId = this.category._id
    this.setState({
      visibleDelete: false
    })
    const result = await reqDeleteCategory(categoryId)
    if (result.status === 0) {
      this.getCategorys()
    }
  }

  handleDeleteCancel = () => {
    this.setState({
      visibleDelete: false,
    });
  }

  //生命周期
  UNSAFE_componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getCategorys()
  }

  render() {
    const { loading, categorys, subCategorys, parentId, parentName } = this.state
    const title = parentId === '0' ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
        <Icon type="arrow-right" style={{ marginRight: 5 }}></Icon>
        <span>{parentName}</span>
      </span>
    )
    const extra = (
      <Button type="primary" onClick={this.showAddModal}>
        <Icon type="plus"></Icon>
        添加
      </Button>
    )
    const category = this.category || {}

    return (
      <Card title={title} extra={extra}>
        <Table
          dataSource={parentId === '0' ? categorys : subCategorys}
          columns={this.columns}
          bordered
          loading={loading}
          pagination={{ defaultPageSize: 5, showQuickJumper: true, hideOnSinglePage: true }}
          rowKey="_id" />
        <Modal
          title="添加分类"
          okText='确认'
          cancelText='取消'
          visible={this.state.visibleAdd}
          onOk={this.addCategory}
          onCancel={this.handleAddCancel}
        >
          <AddForm
            categorys={categorys}
            parentId={parentId}
            setForm={(form) => { this.form = form }}></AddForm>
        </Modal>
        <Modal
          title="修改分类"
          okText='确认'
          cancelText='取消'
          visible={this.state.visibleUpdate}
          onOk={this.updateCategory}
          onCancel={this.handleUpdateCancel}
        >
          <UpdateForm
            categoryName={category.name}
            setForm={(form) => { this.form = form }}></UpdateForm>
        </Modal>
        <Modal
          title="您确定要删除该分类吗？"
          okText='确认'
          okType='danger'
          cancelText='取消'
          visible={this.state.visibleDelete}
          onOk={this.deleteCategory}
          onCancel={this.handleDeleteCancel}
        >
        </Modal>
      </Card>
    )
  }
}
