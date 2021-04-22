import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Card, Input, message, Divider, Select, Spin, Popover, DatePicker,Radio,Tabs, Checkbox, } from 'antd'
import { Page, UserSort, UserDisplay, UserSortLayer, SortSelect } from 'components'
import UserTable from './UserTable'
import UserModal from './UserModal'
import styles from '../common.less'
import queryString from 'query-string'
import moment from 'moment';
import { getSortParam, token, config } from 'utils'

const Option = Select.Option
const RangePicker = DatePicker.RangePicker;
const { TextArea, Search } = Input;
const { api } = config;

const JoinUser = ({
  location, dispatch, joinUser, loading, app
}) => {
  const { isNavbar, menuMap } = app;
  const {
    displaySence, sortSence, userSortExtra,
    searchName, pageNum, pageSize, beginDate, endDate, joinAccountId,  status,
    dataList,  sumCount, awaitCount, passCount, rejectedCount, dataLoading, selectedData, joinAccountList,
    cancelJoinData,confirmJoinData, modalVisible, modalData, departTree, departMap, disabledAttr, showJoin,
    sortFlag
  } = joinUser
  
  const { userDisplaySence, userAttrList, userAttrMap } = app
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}
  const queryParam = {
    key:searchName,
		pageNum,
		pageSize,
		beginDate,
		endDate,
		sortList: userSortList,
		joinAccountId,
    status,
    showJoin,
  }
  const userDisplayProps = {
    userAttrList:userDisplaySence[displaySence]&&userDisplaySence[displaySence].userAttrList?userDisplaySence[displaySence].userAttrList:{},
    ...userDisplaySence[displaySence],
    onUpdateState (data) {
      userDisplaySence[displaySence] = {...userDisplaySence[displaySence], ...data}
      dispatch({
        type: 'app/updateState',
        payload: {
          userDisplaySence
        },
      })
    },
    onReset () {
      dispatch({
        type: 'app/resetDisplay',
        payload:{sence:displaySence}
      })
    },
    onUpdate (data) {
      dispatch({
        type: 'app/updateDisplay',
        payload: {
          displayListTemp:data,
          sence: displaySence,
        },
      })
    },
  }
  const userSortProps = {
    userAttrList:userDisplaySence[displaySence]&&userDisplaySence[displaySence].userAttrList?userDisplaySence[displaySence].userAttrList:{},
    ...userDisplaySence[sortSence],
    displayExtra: userSortExtra,
    onUpdateState (data) {
      const {userDisplaySence} = app
      userDisplaySence[sortSence] = {...userDisplaySence[sortSence], ...data}
      dispatch({
        type: 'app/updateState',
        payload: {
          userDisplaySence
        },
      })
    },
    onReset () {
      dispatch({
        type: 'app/resetDisplay',
        payload:{sence:sortSence, displayExtra:userSortExtra}
      })
    },
    onUpdate (data) {
      dispatch({type: 'joinUser/updateSort'})  // 更多筛选加蒙版
      dispatch({
        type: 'app/updateDisplay',
        payload: {
          displayListTemp:data,
          sence: sortSence,
        },
      })
    },
  }
  const structSelectProps = {
    dataLoading,
    userSortMap,
    userAttrMap,
    styles,
    onGetSelectList (data) {
      dispatch({
        type: 'app/getAttrRelateList',
        payload: {
          ...data
        },
      })
    },

    onChangeSort (value, attr) {
      dispatch({type: 'joinUser/updateSort'})  // 加蒙版
    },
  }

  const userTableProps = {
    dataSource: dataList,
    count:sumCount,
    pageNum,
    pageSize,
    userDisplayList,
    userDisplayMap,
    userAttrMap,
    dataLoading,
    selectedData,
    onChangePage (n, s) {
      dispatch({
        type: 'joinUser/getDataList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'joinUser/updateState',
        payload: {
          ...data,
        },
      })
    },
    onEditUser(data) {
      dispatch(routerRedux.push({
        pathname: '/joinUserInfo',
        search: queryString.stringify({
          id: data.id,
        }),
      }))
    }
  }

  const userModalProps = {
    modalVisible, modalData, userAttrMap,
    departTree, departMap, disabledAttr,
    onClose () {
      dispatch({
        type: 'joinUser/updateState',
        payload: {
          modalVisible: false,
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'joinUser/updateState',
        payload: {
         ...data
        },
      })
    },
    onGetUserAttrValue (data){
      dispatch({
        type: 'joinUser/getUserAttrValue',
        payload: {
          ...data
        },
      })
    },
    onGetStructItemList (pid){
      dispatch({
        type: 'joinUser/getStructItemList',
        payload: {
          pid
        },
      })
    },
    onSubmit (data){
      dispatch({
        type: 'joinUser/addJoinUser',
        payload: {
          ...data
        },
      })
    },
  }

  const handleChangeDate = (value) => {
    dispatch({type: 'joinUser/updateSort',   //退费日期加蒙版
      payload:{
        beginDate: value.length == 0?'':value[0].format('YYYY-MM-DD HH:mm:ss'),
        endDate: value.length == 0?'':value[1].format('YYYY-MM-DD HH:mm:ss'),
      },
    })
	}

  const handleChangeStatus = (value) => {
    queryParam.status = value
    dispatch({
      type: 'joinUser/getDataList',
      payload: {
        ...queryParam,
      },
    })
  }
  
  const handleClickAccount = () => {
		if(!joinAccountList || joinAccountList.length <= 0){
      dispatch({
        type: 'joinUser/getAccountList',
      })
		}
	}
  const handleChangeJoinAccount = (value) => {
    dispatch({type: 'joinUser/updateSort',payload:{joinAccountId: value}})   //经办人加蒙版
  }
  
  const handleResetQuery = () => {
    for (let sort of userSortList) {
      if (sort._idSelected) {
        sort._idSelected = []
      }
    }
    dispatch({type: 'joinUser/updateSort',       //重置加蒙版
      payload: {
        userSortList,
        joinAccountId: [],
        status: undefined,
      },
    })
  }

  const handleChangeSearchName = (value) =>{
    dispatch({
      type: 'joinUser/updateState',
      payload: {
        searchName: value.target.value
      },
    })
  }
  
  const handleOnSearch = (name) => {
		if(name || searchName){
			queryParam.key = name;
      dispatch({
        type: 'joinUser/getDataList',
        payload: {
          ...queryParam,
        },
      })
		}
	}

  const handleQuery = () => {
    dispatch({
      type: 'joinUser/getDataList',
      payload: {
        ...queryParam,
      },
    })
  }

  const handleAddUser = () => {
    dispatch({
      type: 'joinUser/showUserAdd',
      payload: {
      },
    })
  }

  const handleConfirmJoinVisibleChange = (value) => {
    confirmJoinData.visible = value
    dispatch({
      type: 'joinUser/updateState',
      payload: {
        confirmJoinData
      },
    })
  }

  const handleCancelJoinVisibleChange = (value) => {
    cancelJoinData.visible = value
    dispatch({
      type: 'joinUser/updateState',
      payload: {
        cancelJoinData
      },
    })
  }

  const handleChangeCancelRemark = (e) => {
		cancelJoinData.cancelRemark = e.target.value
		dispatch({
      type: 'joinUser/updateState',
      payload: {
        cancelJoinData
      },
    })
  }
  
  const handleConfirmJoin = () => {
    dispatch({
      type: 'joinUser/reviewJoinUser',
      payload: {
        status:'2',
        userId:selectedData.toString(),
      },
    })
	}

	const handleCancelJoin = () => {
		if(!cancelJoinData.cancelRemark){
			message.error("请输入驳回理由")
			return
    }
    if(dataLoading){
      message.error("请不要重复提交")
			return
    }
    dispatch({
      type: 'joinUser/reviewJoinUser',
      payload: {
        status:'3',
        userId:selectedData.toString(),
        remark:cancelJoinData.cancelRemark
      },
    })
  }

  const  onChangeShowJoin = (value) => {
    queryParam.showJoin = value.target.checked
    handleQuery()
  }
  
  const getExportUrl = (type) => {
    let tempParam = {...queryParam};
    let tempList = getSortParam(tempParam.sortList)
    if (tempList && tempList.length>0) {
      tempParam.sortList = JSON.stringify(tempList)
    } else {
      tempParam.sortList = null
    }
    if(tempParam.joinAccountId){
      tempParam.joinAccountId = tempParam.joinAccountId.toString()
    }
    if(token()){
      tempParam.token = token()
    }
    if(tempParam.status=='0'){
      delete tempParam.status
    }
    delete tempParam.pageNum
    delete tempParam.pageSize
    delete tempParam.showJoin
    tempParam.sence = displaySence
    let url = null
    if(showJoin){
      tempParam.type = '1'
      url = api.exportJoinUserForm1 + '?' + queryString.stringify(tempParam);
    }else{
      url = api.exportJoinUserForm2 + '?' + queryString.stringify(tempParam);
    }
		
		return url
  }

  const renderConfirmJoin = () => {
		return(
			<div>
				<div>确定对筛选结果审核通过</div>
				<div style={{ marginTop: '20px', textAlign: 'center' }}>
				<Button size="small" style={{ marginRight: '10px' }} onClick={()=>handleConfirmJoinVisibleChange(false)}>取消</Button>
				<Button type="primary" size="small" onClick={()=>handleConfirmJoin()}>确定</Button>
				</div>
			</div>
		)
  }
  
  const renderCancelJoin = () => {
		return(
			<div>
				<div>驳回理由：</div>
				<TextArea style={{marginTop:'5px'}} value={cancelJoinData.cancelRemark} onChange={e=>handleChangeCancelRemark(e)}/>
				<div style={{ marginTop: '20px', textAlign: 'center' }}>
				<Button size="small" style={{ marginRight: '10px' }} onClick={()=>handleCancelJoinVisibleChange(false)}>取消</Button>
				<Button type="primary" size="small" onClick={()=>handleCancelJoin()}>确定</Button>
				</div>
			</div>
		)
	}

  const createJoinAccountOption = () => {
		const options = [];
		if(joinAccountList){
		  for(let select of joinAccountList){
				options.push(<Option key={select.accountId} value={select.accountId} title={select.loginName}>{select.loginName+'('+select.name+')'}</Option>)
		  }
		  return options;
		}
		return null;
	}

  const createSort = () => {
    let i = 0
    const list = [
      {
        id:i++,
        content:(
          <div className={styles.sortCol}>
            <div className={styles.sortTextW}>建档日期:</div>
                <RangePicker
                  disabled={dataLoading}
                  showTime={{ format: 'HH:mm:ss',defaultValue:[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}}
                  defaultValue={[beginDate?moment(beginDate):'', endDate?moment(endDate):'']}
                  disabledDate={(current)=>{return current && current > moment().endOf('day')}}
                  format="YYYY-MM-DD HH:mm:ss" 
                  placeholder={['开始时间', '结束时间']}
                  onChange={handleChangeDate}
                  style={{width: 'calc(100% - 100px)'}}
                />
          </div>
        ),
        length: 2,
      }
    ]
    if(menuMap['/joinAccount']!=undefined){
      list.push(
        {
          id:i++,
          content:(
            <div className={styles.sortCol}>
              <div className={styles.sortText}>招生人员:</div>
              <Select disabled={dataLoading} mode="multiple" allowClear={true} value={joinAccountId} className={styles.sortSelectMuti} placeholder={"选择招生人员"}
              	optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onFocus={handleClickAccount} onChange={handleChangeJoinAccount} notFoundContent={!joinAccountList?<Spin size="small" />:null}>
              {createJoinAccountOption()}
              </Select>
            </div>
          )
        }
      )
    }
    for(let attr of userSortList){
      i++
      list.push({
        id:i,
        content:(<SortSelect {...{...structSelectProps, attr}}/>)})
      }
      return list
  }
  
  const layerProps = {
    list: createSort(),
    query:(<div className={styles.queryBox} >
        <Button className={styles.inquery} type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQuery} >查询</Button>
				<Button className={styles.reset} onClick={handleResetQuery} disabled={dataLoading} >重置</Button>
				<UserSort {...userSortProps} className={styles.more}/>
    </div>),
  }

  return (
    <Page inner>
      {sortFlag&&<div className={styles.masking} ></div>}
      <Row gutter={16}>
        <Col>
          <Card bordered={false} bodyStyle={{ padding: ' 0' }}>
            <div>
            <Divider style={{ margin: '5px' }} dashed />
            <UserSortLayer {...layerProps}/>
            <Divider style={{ margin: '5px' }} dashed />
            <Row style={{ marginBottom: '10px' }}>
              {menuMap['/joinUserAdd']!=undefined&&
                <Button type="primary" style={{ marginRight: '10px',marginBottom:'10px' }} onClick={handleAddUser}>报名</Button>
              }
              {menuMap['/reviewJoinUser']!=undefined&&
                <Popover trigger="click" placement="top"
                  content={renderConfirmJoin()}
                  visible={confirmJoinData.visible?confirmJoinData.visible:false}
                  onVisibleChange={e=>handleConfirmJoinVisibleChange(e)}
                ><Button type="primary" style={{ marginRight: '10px',marginBottom:'10px' }} disabled={selectedData.length == 0}>审核通过</Button></Popover>
              }
              {menuMap['/reviewJoinUser']!=undefined&&
                <Popover trigger="click" placement="top"
                  content={renderCancelJoin()}
                  visible={cancelJoinData.visible?cancelJoinData.visible:false}
                  onVisibleChange={e=>handleCancelJoinVisibleChange(e)}
                ><Button ghost type="primary" style={{ marginRight: '10px',marginBottom:'10px' }} disabled={selectedData.length == 0}>审核驳回</Button></Popover>
              }
                <Button disabled={dataList.length == 0} target="_blank" href={getExportUrl()}>导出</Button>
                <Checkbox style={{marginLeft:"10px"}} onChange={onChangeShowJoin}>显示招生时信息</Checkbox>
             
                {
                  isNavbar?<div style={{width:'100%'}}><Tabs defaultActiveKey="0" activeKey={status} animated={false} onChange={handleChangeStatus}>
                  <Tabs.TabPane key="0" tab={"总人数："+sumCount}/>
                  <Tabs.TabPane key="1" tab={"待审核："+awaitCount}/>
                  <Tabs.TabPane key="2" tab={"审核通过："+passCount}/>
                  <Tabs.TabPane key="3" tab={"审核驳回："+rejectedCount}/>
                  </Tabs></div>
                  : <div style={{display:'inline-block', marginBottom:'10px', width:"calc(100% - 750px)", textAlign:'center',minWidth:"430px"}}>
                  <Radio.Group onChange={(e)=>handleChangeStatus(e.target.value)}>
                    <Radio.Button value="0">总人数：{sumCount}</Radio.Button>
                    <Radio.Button value="1">待审核：{awaitCount}</Radio.Button>
                    <Radio.Button value="2">审核通过：{passCount}</Radio.Button>
                    <Radio.Button value="3">审核驳回：{rejectedCount}</Radio.Button>
                  </Radio.Group>
                  </div>
                }
                <div style={{width: isNavbar?'100%':'250px',display:'inline-block',float: 'right'}}>
                  <Search enterButton placeholder="搜索" value={searchName} onChange={(value)=>{handleChangeSearchName(value)}} onSearch={(value) => handleOnSearch(value)} style={{ float: 'right', width: isNavbar?'calc(100% - 50px)':'200px' }} />
                  <UserDisplay {...userDisplayProps} />
                </div>
              </Row>
            <Row><UserTable {...userTableProps} /></Row>
            </div>
          </Card>
        </Col>
      </Row>
      { modalVisible && <UserModal {...userModalProps} /> }
    </Page>
  )
}

JoinUser.propTypes = {
  joinUser: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ joinUser, app, loading }) => ({ joinUser, app, loading }))(JoinUser)
