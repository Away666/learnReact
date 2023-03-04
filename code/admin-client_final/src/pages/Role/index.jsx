import React, { Component } from "react";
import { Card, Button, Table, Modal, message } from "antd";
import { connect } from "react-redux";
import { PAGE_SIZE } from "../../utils/constants";
import { reqRoles, reqAddRole, reqUpdateRole } from "../../api";
import AddForm from "./addForm";
import AuthForm from "./authForm";
// import memoryUtils from "../../utils/memoryUtils";
// import storageUtils from "../../utils/storageUtils.js";
import { formateDate } from "../../utils/dateUtils";
import { logout } from "../../redux/actions";

class Role extends Component {
  state = {
    roles: [],
    role: {}, //选择的role
    visibleAdd: false,
    visibleAuth: false,
  };

  constructor(props) {
    super(props);

    this.auth = React.createRef();
  }

  /*
  初始化table的列的数组
   */
  initColumns = () => {
    this.columns = [
      {
        title: "角色名称",
        dataIndex: "name",
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        render: (create_time) => formateDate(create_time),
      },
      {
        title: "授权时间",
        dataIndex: "auth_time",
        render: formateDate,
      },
      {
        title: "授权人",
        dataIndex: "auth_name",
      },
    ];
  };

  getRoles = async () => {
    const result = await reqRoles();
    if (result.status === 0) {
      const roles = result.data;
      this.setState({
        roles,
      });
    }
  };

  onRow = (role) => {
    return {
      onClick: (event) => {
        this.setState({
          role,
        });
      },
    };
  };
  // 角色操作

  showAddModal = () => {
    this.setState({
      visibleAdd: true,
    });
  };

  addRole = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          visibleAdd: false,
        });

        const { roleName } = values;

        this.form.resetFields();

        const result = await reqAddRole(roleName);
        if (result.status === 0) {
          message.success("添加角色成功");
          const role = result.data;
          // const roles = this.state.roles
          // roles.push(role)
          // this.setState({
          //   roles
          // })
          // 更新roles状态：基于原本状态数据更新
          this.setState((state) => ({
            roles: [...state.roles, role],
          }));
        } else {
          message.error("添加角色失败！");
        }
      }
    });
  };

  handleAddCancel = () => {
    this.setState({
      visibleAdd: false,
    });
  };

  // 权限操作
  showAuthModal = () => {
    this.setState({
      visibleAuth: true,
    });
  };

  setAuth = async () => {
    this.setState({
      visibleAuth: false,
    });
    const role = this.state.role;
    // 得到最新的menus
    const menus = this.auth.current.getMenus();
    role.menus = menus;
    // role.auth_name = memoryUtils.user.username;
    role.auth_name = this.props.user.username;
    role.auth_time = Date.now();
    const result = await reqUpdateRole(role);
    if (result.status === 0) {
      // 如果当前更新的是自己角色的权限，强制退出
      if (role._id === this.props.user.role_id) {
        // memoryUtils.user = {};
        // storageUtils.removeUser();
        // this.props.history.replace("/login");
        this.props.logout()
        message.success("当前用户角色权限修改了，请重新登陆！");
      } else {
        message.success("设置角色权限成功！");
      }
      this.setState({
        roles: [...this.state.roles],
      });
    } else {
      message.error("设置角色权限失败！");
    }
  };

  handleAuthCancel = () => {
    this.setState({
      visibleAuth: false,
    });
  };

  componentWillMount() {
    this.initColumns();
  }

  componentDidMount() {
    this.getRoles();
  }

  render() {
    const { roles, role, visibleAdd, visibleAuth } = this.state;

    const title = (
      <span>
        <Button type="primary" onClick={this.showAddModal}>
          创建角色
        </Button>
        <Button
          type="primary"
          onClick={this.showAuthModal}
          disabled={!role._id}
          style={{ marginLeft: "10px" }}
        >
          设置角色权限
        </Button>
      </span>
    );

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="_id"
          dataSource={roles}
          columns={this.columns}
          rowSelection={{
            type: "radio",
            selectedRowKeys: [role._id],
            onSelect: (role) => {
              // 选择某个radio时回调
              this.setState({
                role,
              });
            },
          }}
          onRow={this.onRow}
          pagination={{ defaultPageSize: PAGE_SIZE }}
        ></Table>
        <Modal
          title="添加角色"
          okText="确认"
          cancelText="取消"
          visible={visibleAdd}
          onOk={this.addRole}
          onCancel={this.handleAddCancel}
        >
          <AddForm
            setForm={(form) => {
              this.form = form;
            }}
          ></AddForm>
        </Modal>

        <Modal
          title="设置角色权限"
          okText="确认"
          cancelText="取消"
          visible={visibleAuth}
          onOk={this.setAuth}
          onCancel={this.handleAuthCancel}
        >
          <AuthForm role={role} ref={this.auth}></AuthForm>
        </Modal>
      </Card>
    );
  }
}
export default connect((state) => ({ user: state.user }), { logout })(Role);
