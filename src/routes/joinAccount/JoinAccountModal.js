import { Modal, Button, Col, Form, Input, Icon, Cascader, Table, Divider, Popconfirm, Select, Spin, Row } from 'antd'
import moment from 'moment'
import { getFormat, config, getYearFormat } from 'utils'
import QRCode  from 'qrcode.react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const FormItem = Form.Item

const JoinAccountModal = ({
  modalVisible, dataLoading, modalType, subjectList, modalList, accountId, modalData,
  onClose, onSubmit, onHideModal, onChangeAccount,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
    getFieldValue,
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

  const handleChangeAccount = (value) => {
    onChangeAccount (value)
  }

  const handleConfirmOrderVisibleChange = (value) => {
    onHideModal ()
  }

	const createAccountSelect = () => {
    const options = [];
    if(modalList){
      for(let index of modalList){
        options.push(<Option key={index.id} value={index.id} title={index.loginName+'('+index.name+')'}>{index.loginName+'('+index.name+')'}</Option>)
      }
    }
    return options;
  }

  const createNameSelect = () => {
    const options = [];
    if(modalList){
      for(let index of modalList){
        options.push(<Option key={index.id} value={index.name} title={index.name}>{index.name}</Option>)
      }
    }
    return options;
  }

  const createPhoneSelect = () => {
    const options = [];
    if(modalList){
      for(let index of modalList){
        options.push(<Option key={index.id} value={index.phone} title={index.phone}>{index.phone}</Option>)
      }
    }
    return options;
  }

  const createDepartSelect = () => {
    const options = [];
    if(modalList){
      for(let index of modalList){
        options.push(<Option key={index.id} value={index.departId} title={index.departName}>{index.departName}</Option>)
      }
    }
    return options;
  }
  
  const submitJoinAccount = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      onSubmit(data)
    })
  }

  if (modalType == 'add') {
    return (
      <Modal
        visible={modalVisible}
        onCancel={() => { onClose() }}
        title={'添加'}
        footer={<div>
                <Button style={{ marginRight: '10px' }} onClick={()=>handleConfirmOrderVisibleChange(false)}>取消</Button>
                <Button type="primary" onClick={() => { submitJoinAccount() }}>确定</Button>
              </div>}
      >
        <Form layout="horizontal">
          <FormItem {...formItemLayout} label="账号" key="accountId">
            {getFieldDecorator('accountId', {
              initialValue: null,
              rules: [{ required: true, message: '请选择账号' }],
            })(<Select style={{ width: '100%' }} showSearch optionFilterProp="children" placeholder="请选择账号" onChange={(value) => handleChangeAccount(value)}>
              {createAccountSelect()}
            </Select>)}
          </FormItem>
          <FormItem {...formItemLayout} label="姓名" key='name'>
            {getFieldDecorator('name', {
              initialValue: accountId?modalData[accountId].name:null,
              rules: [{ required: true, message: '请选择账号' }],
            })(<Select style={{ width: '100%' }} disabled>
              {createNameSelect()}
          </Select>)}
          </FormItem>
          <FormItem {...formItemLayout} label="手机号" key='phone'>
            {getFieldDecorator('phone', {
              initialValue: accountId?modalData[accountId].phone:null,
              rules: [{ required: true, message: '请选择账号' }],
            })(<Select style={{ width: '100%' }} disabled>
              {createPhoneSelect()}
          </Select>)}
          </FormItem>
          <FormItem {...formItemLayout} label="所属部门" key='departId'>
            {getFieldDecorator('departId', {
              initialValue: accountId?modalData[accountId].departName:null,
              rules: [{ required: true, message: '请选择账号' }],
            })(<Select style={{ width: '100%' }} disabled>
              {createDepartSelect()}
          </Select>)}
          </FormItem>
        </Form>
      </Modal>)
  }else {
    let interLinkAge = null
    if(modalData.type){
      interLinkAge = "https://wx.weiweixiao.net/index.php/Wap/ModSfgl/index.html?id="+modalData.partnerId+"&accountId="+modalData.accountId+"&type=2"
    }else{
      interLinkAge = "https://wx.weiweixiao.net/index.php/Wap/ModSfgl/index.html?id="+modalData.partnerId+"&accountId="+modalData.accountId+"&type=1"
    }
    return (
      <Modal
        visible={modalVisible}
        onCancel={() => { onClose() }}
        title={modalData.type?'意向招生链接':'招生链接'}
        footer={<div></div>}
      ><Row style={{marginTop:'-10px'}}>
          <Row style={{marginBottom:'20px'}}>
            <Col span={24} style={{marginBottom:'10px'}}>链接地址</Col>
            <Col span={19}><Input disabled value={interLinkAge} /></Col>
            <Col span={4} offset={1}>
              <CopyToClipboard text={interLinkAge}>
                <Button type="primary">复制</Button>
              </CopyToClipboard>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{marginBottom:'10px'}}>招生二维码</Col>
            <Col span={24} style={{textAlign:'center'}}>
              <QRCode value={interLinkAge}  //value参数为生成二维码的链接
                      size={200} //二维码的宽高尺寸
                      fgColor="#000000"  //二维码的颜色
              />
            </Col>
          </Row>
        </Row>
      </Modal>)
  }
}

export default Form.create()(JoinAccountModal)
