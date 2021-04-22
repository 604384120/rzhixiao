import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Card, Input, Popover, Divider, Select, Spin, Tabs, Icon, Menu, Radio, DatePicker } from 'antd'
import { Page, UserSort, UserDisplay, UserSortLayer, JoinForm, SortSelect } from 'components'
import queryString from 'query-string'
import { getFormat, config, getYearFormat, token } from 'utils'
import styles from '../common.less'
import moment from 'moment'
import { routerRedux } from 'dva/router'
import UserTable from './UserTable'
import UserModal from './UserModal'

const Option = Select.Option
const { Search } = Input;
const RangePicker = DatePicker.RangePicker;
const { api } = config

const JoinAdminister = ({
  location, dispatch, joinAdminister, loading, app
}) => {
const {
  sortFlag, dataLoading, beginDate, endDate, joinAccountId, status, searchName, joinAccountList, count, pageNum, pageSize, dataList, modalVisible, modalData, departTree, departMap, disabledAttr, sortSence, displaySence, userSortExtra, setFormVisible, formModalData, year, countData,
} = joinAdminister
  const { isNavbar, menuMap, requestMap, userAttrMap, userDisplaySence, user  } = app

  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}

  // const payTypeList = requestMap['payTypeList']
  // const payTypeNameMap = requestMap['payTypeMap']

  const queryParam = {
    key:searchName,
    pageNum,
		pageSize,
    joinAccountId,
    beginDate,
    endDate,
    status,
    sortList: userSortList,
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
      dispatch({type: 'joinAdminister/updateSort'})  // 更多筛选加蒙版
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
      dispatch({type: 'joinAdminister/updateSort'})  // 加蒙版
    },
  }

  const joinFormProps = {
    ...formModalData,
    styles,
    setFormVisible,
    onClose () {
      dispatch({
        type: 'joinAdminister/updateState',
        payload: {
          setFormVisible: false,
        },
      })
    },
    onSubmit (data) {
      dispatch({
        type: 'joinAdminister/updateJoinForm',
        payload: {
          ...data
        },
      })
    },
    
  }

  const userTableProps = {
    dataSource: dataList,
    userDisplayList,
    count,
    pageNum,
    pageSize,
    onChangePage (n, s) {
      dispatch({
        type: 'joinAdminister/getDataList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'joinAdminister/updateState',
        payload: {
          ...data,
        },
      })
    },
    onAudit (record) {
      dispatch({
        type: 'joinAdminister/showUserAdd',
        payload: {
          record,
          enrol: null,
        },
      })
    },
    onReviewJoinUser (param) {
      dispatch({
        type: 'joinAdminister/reviewJoinUser',
        payload: {
          queryParam,
          param,
        }
      })
    },
    onEditUser (data) {
      dispatch(routerRedux.push({
        pathname: '/joinUserInfo',
        search: queryString.stringify({
          id: data.id,
        }),
      }))
    },

  }

  const userModalProps = {
    modalVisible, modalData, userAttrMap,
    departTree, departMap, disabledAttr,
    year, user,
    onClose () {
      dispatch({
        type: 'joinAdminister/updateState',
        payload: {
          modalVisible: false,
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'joinAdminister/updateState',
        payload: {
         ...data
        },
      })
    },
    onGetUserAttrValue (data){
      dispatch({
        type: 'joinAdminister/getUserAttrValue',
        payload: {
          ...data
        },
      })
    },
    onGetStructItemList (pid){
      dispatch({
        type: 'joinAdminister/getStructItemList',
        payload: {
          pid
        },
      })
    },
    onGetSubjectByMissId (value){
      dispatch({
        type: 'joinAdminister/getSubjectByMissId',
        payload: {
          year: value,
          modalData,
        },
      })
    },
    onSubmit (data){
      dispatch({
        type: 'joinAdminister/addJoinUser',
        payload: {
          queryParam,
          param: data,
        },
      })
    },
  }

  const handleChangeDate = (value) => {
    dispatch({type: 'joinAdminister/updateSort',   //退费日期加蒙版
      payload:{
        beginDate: value.length == 0?'':value[0].format('YYYY-MM-DD HH:mm:ss'),
        endDate: value.length == 0?'':value[1].format('YYYY-MM-DD HH:mm:ss'),
      },
    })
  }
  
  const handleClickAccount = () => {
		if(!joinAccountList || joinAccountList.length <= 0){
      dispatch({
        type: 'joinAdminister/getAccountList',
      })
		}
  }
  
  const handleChangeJoinAccount = (value) => {
    dispatch({type: 'joinAdminister/updateSort',payload:{joinAccountId: value}})   //经办人加蒙版
  }

  const handleChangePayType = (value) => {
    dispatch({type: 'joinAdminister/updateSort',payload:{payType: value}})   //支付方式加蒙版
  }

  const handleSetForm = () => {
    dispatch({
      type: 'joinAdminister/showSetForm',
      payload: {
      },
    })
  }

  const handleAddUser = () => {
    dispatch({
      type: 'joinAdminister/showUserAdd',
      payload: {
        enrol: true,
      },
    })
  }

  const handleChangeSearchName = (value) =>{
    dispatch({
      type: 'joinAdminister/updateState',
      payload: {
        searchName: value.target.value
      },
    })
  }

  const handleChangeStatus = (value) => {
    queryParam.status = value
    dispatch({
      type: 'joinAdminister/getDataList',
      payload: {
        ...queryParam,
      },
    })
  }

  const handleOnSearch = (name) => {
		if(name || searchName){
			queryParam.key = name;
      dispatch({
        type: 'joinAdminister/getDataList',
        payload: {
          ...queryParam,
        },
      })
		}
	}

  const handleQuery = () => {
    dispatch({
      type: 'joinAdminister/getDataList',
      payload: {
        ...queryParam,
      },
    })
  }

  const handleResetQuery = () => {
    for (let sort of userSortList) {
      if (sort._idSelected) {
        sort._idSelected = []
      }
    }
    dispatch({type: 'joinAdminister/updateSort',       //重置加蒙版
      payload: {
        userSortList,
        joinAccountId: [],
        // status: undefined,
      },
    })
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
  
  // const createPayType = () => {
  //   const options = [];
  //   if(payTypeList){
  //     for(let payType of payTypeList){
  //       options.push(<Option key={payType.payType} value={payType.payType} title={payType.name}>{payType.name}</Option>)
  //     }
  //   }
	// 	return options;
  // }

  const createSort = () => {
    let i = 0
    const list = [
      {
        id:i++,
        content:(
          <div className={styles.sortCol}>
            <div className={styles.sortTextW}>报名时段:</div>
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
      {sortFlag&&<div style={{backgroundColor:"rgba(240, 242, 245, 0.5)", zIndex:800, position:'absolute', width:'100%', height:'100%', margin:'-24px'}}></div>}
      <Row gutter={16}>
        <Col>
          <Card bordered={false} bodyStyle={{ padding: ' 0' }}>
            <div>
              <Divider style={{ margin: '5px' }} dashed />
              <UserSortLayer {...layerProps}/>
              <Divider style={{ margin: '5px' }} dashed />
              <Row>
                <Button type="primary" style={{ marginRight: '10px', marginBottom: '10px' }} onClick={handleAddUser}>建档入学</Button>
                {menuMap['/joinForm']!=undefined&&<Button type="primary" style={{ marginRight: '10px', }} onClick={handleSetForm}>报名表单设置</Button>}
             
                {
                  isNavbar?<div style={{width:'100%',}}><Tabs defaultActiveKey="0" activeKey={status} animated={false} onChange={handleChangeStatus}>
                  <Tabs.TabPane key="0" tab={"总人数："+(countData?countData.sumCount:'0')}/>
                  <Tabs.TabPane key="1" tab={"待审核："+(countData?countData.awaitCount:'0')}/>
                  <Tabs.TabPane key="2" tab={"审核通过："+(countData?countData.passCount:'0')}/>
                  <Tabs.TabPane key="3" tab={"审核驳回："+(countData?countData.rejectedCount:'0')}/>
                  </Tabs></div>
                  : <div style={{display:'inline-block', width:"calc(100% - 480px)", textAlign:'center',minWidth:"430px",}}>
                  <Radio.Group onChange={(e)=>handleChangeStatus(e.target.value)}>
                    <Radio.Button value="0">总人数：{countData?countData.sumCount:'0'}</Radio.Button>
                    <Radio.Button value="1">待审核：{countData?countData.awaitCount:'0'}</Radio.Button>
                    <Radio.Button value="2">审核通过：{countData?countData.passCount:'0'}</Radio.Button>
                    <Radio.Button value="3">审核驳回：{countData?countData.rejectedCount:'0'}</Radio.Button>
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
      { setFormVisible && <JoinForm {...joinFormProps} /> }
    </Page>
    )
  }


  JoinAdminister.propTypes = {
    joinAdminister: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.object,
  }

export default connect(({ joinAdminister, app, loading }) => ({ joinAdminister, app, loading }))(JoinAdminister)
