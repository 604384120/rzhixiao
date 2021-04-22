import { Modal, Button, Col, Form, Input, Icon } from 'antd'

const FormItem = Form.Item

const UpdatePwdModal = ({
  pwdModalVisible, pdepart, submit, item, current, hidePwdModal, updatePwdSubmit, form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
    getFieldValue,
    resetFields,
  },
}) => {
  const formItemLayout = {
	  labelCol: {
	    span: 6,
	  },
	  wrapperCol: {
	    span: 14,
	  },
  }

  const submitForm = () => {
    validateFields((errors) => {
	      if (errors) {
	        return
	      }
	    	const data = {
	        ...getFieldsValue(),
	      }
      updatePwdSubmit(data)
      resetFields()
	    })
  }

  const checkPwd = (rule, value, callback) => {
    if (value !== getFieldValue('password')) {
      callback('两次密码输入必须一致')
    }
    callback()
  }

  return (
    <Modal
      visible={pwdModalVisible}
      onCancel={() => { hidePwdModal() }}
      title="修改密码"
      footer={
        <Button type="primary" onClick={() => { submitForm() }}>保存</Button>
				}
    >
      <Form layout="horizontal">
        <FormItem label="原密码" key="c" hasFeedback {...formItemLayout}>
          {getFieldDecorator('password_original', {
							initialValue: '',
							rules: [
								{
									required: true,
									message: '请填写密码',
								},
							],
						})(<Input type="password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请填写原密码" />)}
        </FormItem>
        <FormItem label="新密码" key="a" hasFeedback {...formItemLayout}>
          {getFieldDecorator('password', {
							initialValue: '',
							rules: [
								{
									required: true,
									message: '请填写密码',
								},
							],
						})(<Input type="password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请填写新密码" />)}
        </FormItem>

        <FormItem label="再次输入新密码" key="b" hasFeedback {...formItemLayout}>
          {getFieldDecorator('password_repeat', {
							initialValue: '',
							rules: [
								{
									required: true,
									message: '请再次输入密码',
								}, {
									validator: checkPwd,
								},
							],
						})(<Input type="password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请确认新密码" />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create()(UpdatePwdModal)
