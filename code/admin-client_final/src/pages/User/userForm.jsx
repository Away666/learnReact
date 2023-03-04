import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select } from 'antd'

const Item = Form.Item
const Option = Select.Option

class UserForm extends PureComponent {

  static propTypes = {
    setForm: PropTypes.func.isRequired, //用来传递form对象的函数
    roles: PropTypes.array.isRequired,
    user: PropTypes.object
  }

  UNSAFE_componentWillMount() {
    this.props.setForm(this.props.form)
  }


  /*
  对密码进行自定义验证
  */
  validatePwd = (rule, value, callback) => {
    if (!value) {
      callback('密码必须输入')
    } else if (value.length < 4) {
      callback('密码长度不能小于4位')
    } else if (value.length > 12) {
      callback('密码长度不能大于12位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码必须是英文、数字或下划线组成')
    } else {
      callback() // 验证通过
    }
    // callback('xxxx') // 验证失败, 并指定提示的文本
  }

  validatePhone = (rule, value, callback) => {
    var phone = value.replace(/\s/g, "");//去除空格
    //校验手机号，号段主要有(不包括上网卡)：130~139、150~153，155~159，180~189、170~171、    176~178。14号段为上网卡专属号段
    let regs = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/;
    if (value.length === 0) {
      callback();
    } else {
      if (!regs.test(phone)) {
        callback([new Error('手机号输入不合法')]);
      } else {
        callback();
      }
    }
  }

  validateEmail = (rule, value, callback) => {
    var email = value.replace(/\s/g, "");//去除空格
    let regs = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (value.length === 0) {
      callback();
    } else {
      if (!regs.test(email)) {
        callback([new Error('邮箱输入不合法')]);
      } else {
        callback();
      }
    }
  }


  render() {

    const { roles, user } = this.props
    const { getFieldDecorator } = this.props.form

    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 10 }, // 右侧包裹的宽度
    }

    return (
      <Form {...formItemLayout}>
        <Item label="用户名">
          {
            getFieldDecorator('username', {
              initialValue: user.username,
              rules: [
                { required: true, whitespace: true, message: '用户名必须输入' },
                { min: 4, message: '用户名至少4位' },
                { max: 12, message: '用户名最多12位' },
                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
              ],
            })(
              <Input placeholder="请输入用户名"></Input>
            )
          }
        </Item>
        <Item label="密码">
          {
            getFieldDecorator('password', {
              initialValue: user.password,
              rules: [{ validator: this.validatePwd }]
            })(
              <Input placeholder="请输入密码" disabled={user.password ? true : false} type="password"></Input>
            )
          }
        </Item>
        <Item label="手机号">
          {
            getFieldDecorator('phone', {
              initialValue: user.phone,
              rules: [{ validator: this.validatePhone }],
            })(
              <Input placeholder="请输入手机号"></Input>
            )
          }
        </Item>
        <Item label="邮箱">
          {
            getFieldDecorator('email', {
              initialValue: user.email,
              rules: [{ validator: this.validateEmail }],
            })(
              <Input placeholder="请输入邮箱"></Input>
            )
          }
        </Item>
        <Item label="角色">
          {
            getFieldDecorator('role_id', {
              initialValue: user.role_id,
              rules: [{ required: true, message: '角色必须选择' }]
            })(
              <Select>
                {
                  roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}
export default Form.create()(UserForm)
