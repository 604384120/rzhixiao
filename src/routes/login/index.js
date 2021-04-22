import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input, Radio,Upload,Icon,Message,Spin } from 'antd'
import { config } from 'utils'
import styles from './index.less'
import imgLogo from './img/logo.png'
import imgBg from './img/bg.png'
import imgLeft from './img/left.png'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const { api } = config

const Login = ({
  app,
  loading,
  dispatch,
  form: {
    getFieldValue,
    getFieldDecorator,
    setFieldsValue,
    validateFields,
    validateFieldsAndScroll,
  },
}) => {
  const { editUser } = app;
  let isNavbar = document.body.clientWidth < 600
  let { move,codeChange } = app;
  function handleOk () {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'login/login', payload: values })
    })
  }
  const formItemLayout = {
	  labelCol: {
	    span: 6,
	  },
	  wrapperCol: {
	    span: 14,
    },
  }

  const uploadProps = {
    action: api.importUserExcel,
    showUploadList: false,
    beforeUpload: (file) => {
      editUser.fileList = [file];
      dispatch({ type: 'app/updateState', payload: {editUser:editUser} })
    },
    data: { sence: 'uploadImg' },
    fileList: editUser?editUser.fileList:[],
    onChange: (info) => {
      if (info.file.status === 'done') {
        Message.success('上传成功')
        editUser.logoInfo = info.file.response.ret_content.fileName;
        dispatch({ type: 'app/updateState', payload: {editUser:editUser} })
      } else if (info.file.status === 'error') {
        Message.error('上传失败')
      }
    },
  }

  const handleSave = () => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      values.logoInfo = editUser.logoInfo;
      values.printType = values.printType==1?'bs':''
      dispatch({ type: 'app/updateSchool', payload: values })
    })
  }

  const handleShortNameChange = (e) => {
    editUser.shortName = e.target.value;
    dispatch({ type: 'app/updateState', payload: {editUser:editUser} })
  }

  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== getFieldValue('loginPwd')) {
      callback('两次密码不一致!');
    } else {
      callback();
    }
  }

  const validateToNextPassword = (rule, value, callback) => {
    if (value && getFieldValue('loginPwdRepeat')) {
        validateFields(['loginPwdRepeat'], { force: true });
    }
    callback();
  }
  const headleImg = () => {
    dispatch({ 
      type:'app/updateState',
      payload:{
        codeChange:new Date().getTime()
      }
    })
  }

  const showEditForm = () => {

    if(editUser.loading){
      return (
          <Form className={styles.form}>
         <img className={styles.left} src={imgLeft} />
          <div className={styles.right}>
          <Spin size="large" style={{marginLeft:'100px',marginTop:'50px'}}/>
          </div>
         </Form>
      )
    }
    return (
  <Form layout="horizontal" className={styles.editform}>
        <FormItem label='校标' {...formItemLayout}>
            {getFieldDecorator('logoInfo', {
              rules: [
                {
                  required: true,
                  message: '请上传校标',
                },
              ],
            })(<div><div><Upload {...uploadProps}>
                <div style={{width:'360px',height:'100px',border:"1px dashed #e9e9e9"}}>
                {editUser.logoInfo ? <div style={{textAlign:'center',height:"100%"}}><img style={{height:"100%",width:"100%"}} src={editUser.logoInfo}/></div> : <div><Icon type='upload' style={{fontSize:'18px',marginTop:'30px',marginLeft:'160px'}}/><div style={{marginTop:'5px',marginLeft:'143px'}}>点击上传</div></div>}
                </div>
              </Upload></div><div style={{lineHeight:'10px',fontSize:'12px',color:'#b0b0b0',marginTop:'5px'}}>建议宽度560px，支持jpg png格式图片</div></div>)}
          </FormItem>
          <FormItem label='学校名称' {...formItemLayout}>
            {getFieldDecorator('schoolName', {
              rules: [
                {
                  required: true,
                  message: '学校名称不能为空',
                },{
                  max:255,
                  message: '长度不能超过255个字符',
                }
              ],
            })(<Input placeholder="请输入学校名称" />)}
          </FormItem>
          <FormItem label='学校英文简称' {...formItemLayout}>
            {getFieldDecorator('shortName', {
              rules: [
                {
                  required: true,
                  message: '学校英文简称不能为空',
                },{
                  max:10,
                  message: '长度不能超过10个字符',
                },{
                  pattern:'^[a-zA-Z0-9]+$',
                  message: '只能为英文或者数字',
                }
              ],
            })(<div><div><Input onChange={handleShortNameChange} placeholder="请输入学校英文简称" /></div><div style={{lineHeight:'10px',fontSize:'12px',color:'#b0b0b0'}}>如北京大学英文简称为pku，则登录账号为admin@pku</div></div>)}
          </FormItem>
          <FormItem label='登录账号' {...formItemLayout}>
           admin@{editUser.shortName}
          </FormItem>
          <FormItem label='登录密码' {...formItemLayout}>
            {getFieldDecorator('loginPwd', {
              rules: [
                {
                  required: true,
                  message: '密码不能为空',
                },{
                  validator: validateToNextPassword,
                }
              ],
            })(<Input type="password" placeholder="请输入登陆密码" autoComplete='new-password'/>)}
          </FormItem>
          <FormItem label='确认密码' {...formItemLayout}>
            {getFieldDecorator('loginPwdRepeat', {
              rules: [
                {
                  required: true,
                  message: '请再次输入密码',
                }, {
                  validator: compareToFirstPassword,
                }
              ],
            })(<Input type="password" placeholder="请再次输入登录密码" autoComplete='new-password'/>)}
          </FormItem>
          <FormItem label='博思开票' {...formItemLayout}>
            {getFieldDecorator('printType', {
              initialValue:editUser.printType=='bs'?1:2,
              rules: [{required: true}],
            })(<RadioGroup><Radio value={1}>是</Radio><Radio value={2}>否</Radio></RadioGroup>)}
          </FormItem>
          <Row  style={{marginTop:'50px',textAlign:'center'}}>
            <Button type="primary" onClick={handleSave} loading={loading.effects.login}>保存</Button>
          </Row>
        </Form>
    )
  }
  
  return (
    <div style={{ overflowY:"auto", overflowX:'hidden', height:'calc(100vh)'}}>
    <div style={{minHeight: '600px', position:'relative'}}>
      <div className={styles['body-bg']} style={{ backgroundImage: `url(${imgBg})` }}>
        <div className={styles.logo} style={{ backgroundImage: `url(${imgLogo})` }} />
      </div>
      <div className={styles.logo}>
        <img alt="logo" src={config.logo} />
        <span>{config.name}</span>
      </div>
      {
        editUser?showEditForm(): <Form className={isNavbar?styles.formM:styles.form}>
        <img className={styles.left} src={imgLeft}/>
        <div className={styles.right}>
          <FormItem hasFeedback>
            {getFieldDecorator('loginName', {
              rules: [
                {
                  required: true,
                  message: '用户名不得为空',
                },
              ],
            })(<Input onPressEnter={handleOk} placeholder="用户名" />)}
          </FormItem>
          <FormItem hasFeedback>
            {getFieldDecorator('loginPwd', {
              rules: [
                {
                  required: true,
                  message: '密码不得为空',
                },
              ],
            })(<Input type="password" onPressEnter={handleOk} placeholder="密码" />)}
          </FormItem>
         { move==false?'':<FormItem>
            {getFieldDecorator('authCode', {
              rules: [
                {
                  required: true,
                  message: '验证码不得为空',
                },
              ],
            })(<div><Input style={{width:'60%'}} type="text" onPressEnter={handleOk} placeholder="验证码" />
              <img src={api.authCode+'?'+codeChange} onClick={headleImg} alt="获取验证码" style={{width:'39%',height:'30%',marginTop:'-5px',marginLeft:'1%'}}></img></div>)}
          </FormItem>}
          <Row>
            <Button style={{marginTop:move==true?'0px':'30px'}} type="primary" onClick={handleOk} loading={loading.effects.login}>
              登录
            </Button>
          </Row>
        </div>
      </Form>
      }
     
      <div className={styles.copyright}>{config.copyRight}</div>
    </div>
    </div>
  )
}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ app,loading }) => ({ app,loading }))(Form.create()(Login))
