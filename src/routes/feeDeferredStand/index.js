import React from 'react'
import { Row, Col, Button, Input, Menu, Message, Tabs, Select, Divider } from 'antd'
import { connect } from 'dva'
import { Page } from 'components'
import UserTable from './UserTable';
import styles from '../common.less'

const Option = Select.Option
const Search = Input.Search

const FeeDeferredStand = ({
  location,
  dispatch,
  feeDeferredStand,
  loading,app 
}) => {
  const { isNavbar } = app
  const { dataList,
    searchName,
    dataLoading,
    subjectList, subjectId, departTreeList, departId,
  } = feeDeferredStand

  const tableProps = {
    dataList,
    searchName,
    dataLoading,
    onUpdateState: (data) => {
      dispatch({
        type: 'feeDeferredStand/updateState',
        payload: {
          ...data,
        },
      })
    },
    onSave: (record) => {
      let data = {
        name: record._change.name!=undefined?record._change.name:record.name,
        status: record._change.status!=undefined?record._change.status:record.status,
        fee: record._change.fee!=undefined?Math.round(record._change.fee*100).toString():record.fee,
        reason: record._change.reason!=undefined?record._change.reason:record.reason,
        timeEnd: record._change.timeEnd!=undefined?record._change.timeEnd:record.timeEnd,
        subjectId
      }
      if(!data.name){
        Message.error("请输入标准名称")
        return
      }
      if(!data.name || data.fee == "0"){
        Message.error("请输入金额")
        return
      }
      if (record.id) {
        data.id = record.id;
        dispatch({
          type: 'feeDeferredStand/updateDeferredStand',
          payload: {
            ...data,
          },
        })
      } else {
        dispatch({
          type: 'feeDeferredStand/addDeferredStand',
          payload: {
            ...data,
          },
        })
      }
    },
    onDelete: (record) => {
      let data = {
        id: record.id,
        status: "0",
      }
      dispatch({
        type: 'feeDeferredStand/updateDeferredStand',
        payload: {
          ...data,
        },
      })
    }
  }

  const handleClickSort = () => {
    if(!departTreeList || departTreeList.length<=0){
      dispatch({
        type: 'feeDeferredStand/getDepartTreeList',
      })
    }
  }

  const handleChangeDepart = (value) => {
    dispatch({
      type: 'feeDeferredStand/getSubjectList',
      payload:{
        departId: value,
      },
    })
  }

  const handleAddItem = () => {
    const newItem = {
      id: '',
      name: undefined,
      status: '1',
      fee: "0",
      reason: undefined,
      timeEnd: undefined,
      _add: true,
      _editable: true,
      _change: {},
    }

    if (dataList.length == 0 || !dataList[0]._add) {
      dataList.unshift(newItem)
      dispatch({
        type: 'feeDeferredStand/updateState',
        payload: {
          dataList,
        },
      })
    }
  }

  const handleSearch = (value) => {
    dispatch({type: 'feeDeferredStand/updateState',payload:{searchName: value}})
  }

  const handleChangeSubject = (index) => {
    dispatch({
      type: 'feeDeferredStand/updateState',
      payload:{
        subjectId: index
      },
    })
    dispatch({
      type: 'feeDeferredStand/getDataList',
      payload:{
        subjectId: index
      },
    })
  }
  
  const createDepartOption = () => {
    const options = [];
    if(departTreeList){
      for(let index of departTreeList){
        options.push(<Option key={index.id} value={index.id} title={index.label}>{index.label}</Option>)
      }
    }
		return options;
  }
  
  const renderSubjectList = () => {
    const menuList = []
    if(subjectList){
      for(let subject of subjectList){
        if(isNavbar){
          menuList.push(
            <Tabs.TabPane key={subject.id} tab={subject.name}/>
          )
        }else{
          menuList.push(
            <Menu.Item key={subject.id}>{subject.name}</Menu.Item>
          )
        }
      }
      return menuList
    }
    return null
  }

  return (<Page inner>
    <Row style={{marginTop:'20px'}}>
      <Divider style={{ margin: '5px' }} dashed />
      <Row className={styles.sortCol}>
        <Col span={isNavbar?24:12}>
          <div className={styles.sortText}>部门:</div>
          <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} defaultValue={departId} value={departId} className={styles.sortSelectMuti} placeholder={"选择部门"} onFocus={handleClickSort} onChange={handleChangeDepart}>
            {createDepartOption()}
          </Select>
        </Col>
      </Row>
      <Divider style={{ margin: '5px' }} dashed />
      {
        isNavbar? <div style={{width:'100%'}}>
        <div><Tabs defaultActiveKey="1" activeKey={subjectId} animated={false} onChange={handleChangeSubject}>{renderSubjectList()}</Tabs>
        </div>
        </div>:<div style={{width:'200px',minHeight: '200px',float:'left'}}>
          <div><Menu style={{width:'90%'}} mode="inline" selectedKeys={[subjectId]} onClick={(e)=>handleChangeSubject(e.key)}>{renderSubjectList()}</Menu>
          </div>
        </div>
      }
      <div style={isNavbar?{width:"100%", marginTop:'10px'}:{float:'left',width:'calc(100% - 200px)'}}>
      <Row>
        <Button style={{marginBottom:'10px'}} type="primary" disabled={subjectId?false:true} onClick={handleAddItem} icon="plus">添加</Button>
        <Search
          placeholder="输入名称进行搜索"
          onSearch={(value) => handleSearch(value)}
          style={{ width: isNavbar?'100%':'200px', float: 'right', marginBottom:'10px' }}
          enterButton
        />
      </Row>
      <Row style={{marginTop:'5px'}}><UserTable {...tableProps} /></Row>
      </div>
    </Row>
      
  </Page>)
}

export default connect(({ feeDeferredStand, app, loading }) => ({ feeDeferredStand, app, loading }))(FeeDeferredStand)
