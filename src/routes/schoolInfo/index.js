import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, InputNumber, Card, Input, Form, Upload, Icon, Message, Menu, Tabs, Checkbox, Select, Spin } from 'antd'
import { Page, UserSortLayer, UserStatusSelect } from 'components'
import styles from '../common.less'
import { config } from 'utils'
import UserTable from './UserTable'
import ConfigStatTable from './ConfigStatTable'

const { api } = config
const FormItem = Form.Item
const Search = Input.Search
const SchoolInfo = ({
  location, dispatch, schoolInfo, loading, app,
   form: {
    getFieldValue,
    getFieldDecorator,
    setFieldsValue,
    validateFields,
    validateFieldsAndScroll,
  },
}) => {
  const { isNavbar, requestMap } = app
  const {
    editUser, editVisible, schoolName, configId, payTypeList, dataLoading, orderCancelTime, configStatList, joinReview, joinBill, joinGrade, verifyPay, fee_limit, arrears_ignore,
  } = schoolInfo

  const gradeList = requestMap['gradeList']

  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  }

  const userTableProps = {
    dataSource: payTypeList,
    dataLoading,
    onUpdateDataSource (data) {
      // dispatch({
      //   type: 'creditClass/updateState',
      //   payload: {
      //     list: data,
      //   },
      // })
    },
    onUpdateDataSource (data) {
      dispatch({
        type: 'schoolInfo/updateState',
        payload: {
          payTypeList: data,
        },
      })
    },
    onSaveOrderPayType (data) {
      dispatch({
        type: 'schoolInfo/updateOrderPayType',
        payload: {
          data
        },
      })
    },
    
  }

  const ConfigStatTableProps = {
    dataSource: configStatList,
    editVisible,
    dataLoading,
    onUpdate (data) {
      dispatch({
        type: 'schoolInfo/updateState',
        payload: {
          ...data
        },
      })
    },
  }

  const headleEdit = () => {
    dispatch({
      type:'schoolInfo/updateState',
      payload:{
        editVisible: true
      }
    })
  }

  const handleReset = () => {
    setFieldsValue({schoolName:editUser.schoolName})
    dispatch({
      type:'schoolInfo/updateState',
      payload:{
        editVisible: false,
        schoolName : editUser.schoolName,
        orderCancelTime: editUser.orderCancelTime,
        joinReview: editUser.joinReview,
        joinBill: editUser.joinBill,
        joinGrade: editUser.joinGrade,
        verifyPay: editUser.verifyPay,
        fee_limit: editUser.fee_limit,
        arrears_ignore: editUser.arrears_ignore,
      }
    })
  }

  const headleSubmit = () => {
    if(configId == 4){
      dispatch({
        type:'schoolInfo/updateDisplayAttr',
        payload:{
        }
      })
    }else{
      dispatch({
        type:'schoolInfo/updateSchool',
        payload:{
          id: editUser.id,
          name: schoolName,
          logoInfo: editUser.logoInfo,
          orderCancelTime: orderCancelTime,
          joinReview: joinReview,
          joinBill: joinBill,
          joinGrade: joinGrade,
          verifyPay: verifyPay,
          fee_limit: fee_limit,
          arrears_ignore: arrears_ignore,
        }
      })
    }
  }

  const handleChangeTemp = (value) => {
    dispatch({
      type:'schoolInfo/updateState',
      payload:{
        schoolName : value,
      }
    })
  }

  const handleChangeTime = (value) => {
    let orderCancelTime = value
    dispatch({
      type:'schoolInfo/updateState',
      payload:{
        orderCancelTime,
      }
    })
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

  const logoRender = (editUser) => {
    if(editUser){
      if (editUser.logoInfo) {
        return <img src={editUser.logoInfo} style={{ width:isNavbar?'100%':undefined,height:'100%' }} />
      } else if (editUser.logo) {
        return <img src={editUser.logo} style={{ width:isNavbar?'100%':undefined,height:'100%' }} />
      }
    }
  }

  const handleChangeConfig = (index) => {
    if(index != configId){
      if(index == 2){
        dispatch({
          type: 'schoolInfo/getOrderPayType',
          payload:{
            configId: configIds
          },
        })
      }else if(index == 4){
        dispatch({
          type: 'schoolInfo/getDisplayAttr',
          payload:{
            configId: configIds
          },
        })
      }
      // else if(index == 5){
      //   dispatch({
      //     type: 'schoolInfo/getSchool',
      //   })
      // }
      let configIds = index
      dispatch({
        type: 'schoolInfo/updateState',
        payload:{
          configId: configIds,
          editVisible: false,
        },
      })
    }
  }

  const handleChangeJoinReview = (e) => {
    dispatch({
      type: 'schoolInfo/updateState',
      payload:{
        joinReview: e.target.checked?'1':'0'
      },
    })
  }

  const handleChangeJoinBill = (e) => {
    dispatch({
      type: 'schoolInfo/updateState',
      payload:{
        joinBill: e.target.checked?'1':'0'
      },
    })
  }

  const handleChangeGrade = (value) => {
    dispatch({
      type: 'schoolInfo/updateState',
      payload: {
        joinGrade: value
      },
    })
  }

  const handleChangeVerifyPay = (e) => {
    dispatch({
      type: 'schoolInfo/updateState',
      payload:{
        verifyPay: e.target.checked?'1':'0'
      },
    })
  }

  const handleChangeFee_limity = (e) => {
    dispatch({
      type: 'schoolInfo/updateState',
      payload:{
        fee_limit: e.target.checked?'1':'0'
      },
    })
  }

  const handleChangeUserStatus = (value) => {
    dispatch({type: 'schoolInfo/updateSort',payload:{arrears_ignore: value}})   //学生状态加蒙版
  }

  const createGradeOption = () => {
    const options = []
    if (gradeList) {
      for (let select of gradeList) {
        options.push(<Option key={select.relateId} value={select.relateId} title={select.name}>{select.relateName}</Option>)
      }
      return options
    }
    return null
  }
  
  const renderConfig = () => {
    const menuList = []
    if(isNavbar){
      menuList.push(<Tabs.TabPane key={1} tab={'学校信息设置'}/>)
      menuList.push(<Tabs.TabPane key={2} tab={'手续费配置'}/>)
      menuList.push(<Tabs.TabPane key={3} tab={'冲正/作废配置'}/>)
      menuList.push(<Tabs.TabPane key={4} tab={'统计信息显示配置'}/>)
      menuList.push(<Tabs.TabPane key={7} tab={'学生设置'}/>)
      menuList.push(<Tabs.TabPane key={5} tab={'招生设置'}/>)
      menuList.push(<Tabs.TabPane key={6} tab={'核销设置'}/>)
    }else{
      menuList.push(<Menu.Item key={1}>{'学校信息设置'}</Menu.Item>)
      menuList.push(<Menu.Item key={2}>{'手续费配置'}</Menu.Item>)
      menuList.push(<Menu.Item key={3}>{'冲正/作废配置'}</Menu.Item>)
      menuList.push(<Menu.Item key={4}>{'统计信息显示配置'}</Menu.Item>)
      menuList.push(<Menu.Item key={7}>{'学生设置'}</Menu.Item>)
      menuList.push(<Menu.Item key={5}>{'招生设置'}</Menu.Item>)
      menuList.push(<Menu.Item key={6}>{'核销设置'}</Menu.Item>)
    }
    return menuList
  }

  return (
    <Page inner>
      <Row gutter={16}>
        <Col>
          <Card bordered={false} bodyStyle={{ padding: ' 0' }}>
            <div>
              <Row>
                {
                  isNavbar? <div style={{width:'100%'}}>
                  <div><Tabs defaultActiveKey="1" activeKey={configId} animated={false} onChange={handleChangeConfig}>{renderConfig()}</Tabs>
                  </div>
                  </div>: <div style={{width:'200px',float:'left'}}>
                <div><Menu style={{width:'92%'}} mode={"inline"} selectedKeys={[configId]} onClick={(e)=>handleChangeConfig(e.key)}>{renderConfig()}</Menu>
                </div>
                </div>
                }
                <div style={isNavbar?{width:"100%", marginTop:'10px'}:{float:'left',width:'calc(100% - 200px)'}}>
                  {configId == 1 && <Row>
                    <Form layout="horizontal" onSubmit={undefined} >
                      <FormItem label="学校名称" {...formItemLayout} key="name" style={{marginBottom:'50px'}}>
                        {getFieldDecorator('schoolName', {
                        initialValue: schoolName,
                        rules: [{ required: true, message: '请输入学校名称!' }, { max: 40, message: '长度超过限制!' }],
                      })(<Input disabled={!editVisible} onChange={(e)=>{handleChangeTemp(e.target.value)}}/>)}
                      </FormItem>
                      <FormItem label={<span style={{lineHeight:'100px'}}>学校图标</span>} {...formItemLayout}>
                        {getFieldDecorator('logoInfo', {
                          rules: [
                            {
                              required: true,
                              message: '请上传校标',
                            },
                          ],
                        })(<div style={{maxWidth:'400px',minWidth:'80px',height:'80px',border:"1px dashed #e9e9e9",display:'table',textAlign:'center'}}>{
                          editVisible?<div style={{display:'table-cell',verticalAlign:'middle'}}><div><Upload {...uploadProps} style={{cursor:'pointer'}}>
                            <div>
                            {editUser.logoInfo ? <div style={{height:'80px'}}><img style={{height: '100%'}} src={editUser.logoInfo}/></div> : <div><Icon type='upload' style={{fontSize:'18px'}}/><div>点击上传</div></div>}
                            </div>
                          </Upload></div></div>
                          :<div style={{height:'80px',display:'table-cell',verticalAlign:'middle'}}>
                              {logoRender(editUser)}
                          </div>
                        }</div>)}
                      </FormItem>
                      {editVisible?<div style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit" onClick={headleSubmit}>保存</Button>
                        <Button style={{ marginLeft: 8 }} onClick={handleReset}>取消</Button>
                      </div>
                      :<Button style={{display:'block',margin:'0 auto'}} type="primary" onClick={headleEdit}>编辑</Button>}
                    </Form>
                  </Row>}
                  {configId == 2 && <Row>
                    <Col style={{color:'red',marginBottom:'10px',textIndent:'2rem'}}>* 若设置了费率，则产生的手续费将由学生支付</Col>
                    <UserTable {...userTableProps} />
                  </Row>}
                  {configId == 3 && <Row>
                    <Col style={{textAlign:'center',marginTop:'50px',marginBottom:'20px'}}>冲正/作废时间限制：订单生成<InputNumber placeholder='请输入' disabled={!(configId == '3' && editVisible)} style={{width:'5rem',margin:'0 10px',textAlign:'center'}} defaultValue={editUser.orderCancelTime} value={orderCancelTime} onChange={(value) => handleChangeTime(value)}/>天后不允许冲正/作废</Col>
                    <Col style={{textAlign:'center',marginBottom:'30px'}}>(不填代表没有，不做限制)</Col>
                    {editVisible?<div style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit" onClick={headleSubmit}>保存</Button>
                        <Button style={{ marginLeft: 8 }} onClick={handleReset}>取消</Button>
                      </div>
                      :<Button style={{display:'block',margin:'0 auto'}} type="primary" onClick={headleEdit}>编辑</Button>}
                  </Row>}
                  {configId == 4 && <Row>
                    <ConfigStatTable {...ConfigStatTableProps} />
                    {editVisible&&configStatList.length>0?<div style={{ textAlign: 'center',marginTop:'20px' }}>
                        <Button type="primary" htmlType="submit" onClick={headleSubmit}>保存</Button>
                        <Button style={{ marginLeft: 8 }} onClick={handleReset}>取消</Button>
                      </div>
                      :<Button style={{display:'block',margin:'20px auto'}} type="primary" onClick={headleEdit}>编辑</Button>}
                  </Row>}
                  {configId == 5 && <Row>
                    <Col offset={4}>
                      <Checkbox style={{fontSize:'15px',margin:'20px 0 20px 0'}} disabled={!editVisible} defaultChecked={editUser.joinReview=='1'} checked={joinReview=='1'} onChange={e=>handleChangeJoinReview(e)}>报名表单无需审核</Checkbox>
                    </Col>
                    <Col offset={4}>
                      <Checkbox style={{fontSize:'15px',marginBottom:'20px'}} disabled={!editVisible} defaultChecked={editUser.joinBill=='1'} checked={joinBill=='1'} onChange={e=>handleChangeJoinBill(e)}>报名通过后自动生成学生账单</Checkbox>
                    </Col>
                    <Col offset={4} span={14} style={{marginBottom:'36px'}}>
                      年级：<Select allowClear={true}  disabled={!editVisible} value={joinGrade} onChange={ handleChangeGrade } optionFilterProp="children" placeholder="请选择年级" style={{ width: 'calc(100% - 50px)' }} notFoundContent={!gradeList?<Spin size="small" />:null}>
                        {createGradeOption()}
                      </Select>
                    </Col>
                    <Col offset={4} span={24}>
                      {editVisible?<div style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit" onClick={headleSubmit}>保存</Button>
                        <Button style={{ marginLeft: 8 }} onClick={handleReset}>取消</Button>
                      </div>
                      :<Button style={{display:'block',margin:'0 auto'}} type="primary" onClick={headleEdit}>编辑</Button>}
                    </Col>
                  </Row>}
                  {configId == 6 && <Row>
                    <Col offset={4}>
                      <Checkbox style={{fontSize:'15px',margin:'20px 0 20px 0'}} disabled={!editVisible} defaultChecked={editUser.verifyPay=='1'} checked={verifyPay=='1'} onChange={e=>handleChangeVerifyPay(e)}>仅核销缴费完成账单</Checkbox>
                    </Col>
                    <Col offset={4} span={24}>
                      {editVisible?<div style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit" onClick={headleSubmit}>保存</Button>
                        <Button style={{ marginLeft: 8 }} onClick={handleReset}>取消</Button>
                      </div>
                      :<Button style={{display:'block',margin:'0 auto'}} type="primary" onClick={headleEdit}>编辑</Button>}
                    </Col>
                  </Row>}
                  {configId == 7 && <Row>
                    <Col offset={4}>
                      <Checkbox style={{fontSize:'15px',margin:'20px 0 20px 0'}} disabled={!editVisible} defaultChecked={editUser.fee_limit=='1'} checked={fee_limit=='1'} onChange={e=>handleChangeFee_limity(e)}>学生退学需要将账单清零，退学后无法再修改账单</Checkbox>
                    </Col>
                    <Col offset={4}>
                      <div style={{width: '240px', display: 'inline-block'}}>学生状态修改为 <UserStatusSelect disabled={!editVisible} value={arrears_ignore} className={styles.sortSelectMuti} placeholder={"选择学生状态"} onChange={handleChangeUserStatus} /></div>之后，剩余欠费金额不再计入欠费
                    </Col>
                    <Col offset={4} span={24}>
                      {editVisible?<div style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit" onClick={headleSubmit}>保存</Button>
                        <Button style={{ marginLeft: 8 }} onClick={handleReset}>取消</Button>
                      </div>
                      :<Button style={{display:'block',margin:'0 auto'}} type="primary" onClick={headleEdit}>编辑</Button>}
                    </Col>
                  </Row>}
                </div>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </Page>
  )
}

SchoolInfo.propTypes = {
  schoolInfo: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ schoolInfo, app, loading }) => ({ schoolInfo, app, loading }))(Form.create()(SchoolInfo))
