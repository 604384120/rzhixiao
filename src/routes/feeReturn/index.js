import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Tag, Col, Button, Card, Input, message, Divider, Select, Spin, Popover, DatePicker } from 'antd'
import { Page, UserSort, UserDisplay, UserSortLayer, SortSelect, ExportTable } from 'components'
import UserTable from './UserTable'
import UserModal from './UserModal'
import styles from '../common.less'
import queryString from 'query-string'
import moment from 'moment';
import { getFormat, config, getSortParam, token } from 'utils'

const Option = Select.Option
const RangePicker = DatePicker.RangePicker;
const { TextArea, Search } = Input;
const { api } = config;

const FeeReturn = ({
  location, dispatch, feeReturn, loading, app
}) => {
  const {
    modalVisible,  modalImportData,
    displaySence, sortSence, userSortExtra,
    searchName, pageNum, pageSize, beginDate, endDate, payType, accountId, missionId, subjectId, status,
    returnList, count, dataLoading,selectedOrders,
    cancelReturnData,
    returnFeeSum,
    sortFlag, exportFormat, formatVisible, orderNo, 
  } = feeReturn

  const { userDisplaySence, userAttrList, userAttrMap, user, menuMap, isNavbar, requestMap } = app
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}

  const payTypeList = requestMap['payTypeList']
  const payTypeNameMap = requestMap['payTypeMap']
  const missionList = requestMap['missionList']
  const subjectList = requestMap['subjectList']
  const subjectMap = requestMap['subjectMap']
  const accountList = requestMap['accountList']

  const queryParam = {
    key:searchName,
		pageNum,
		pageSize,
		beginDate,
		endDate,
		missionId,
		sortList: userSortList,
		payType: userSortMap['payType']?userSortMap['payType']._idSelected:undefined,
		accountId: userSortMap['accountId']?userSortMap['accountId']._idSelected:undefined,
    subjectId,
    status,
    orderNo,
  }
  const userDisplayProps = {
    userAttrList,
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
    userAttrList,
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
      dispatch({type: 'feeReturn/updateSort'})  // 更多筛选加蒙版
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
    payType,
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
      dispatch({type: 'feeReturn/updateSort'})  // 加蒙版
    },
  }

  const exportTableProps ={
    sence: 'return',
    styles,
    formatVisible,
    exportFormat,
    onFormatVisibleChange (visible) {
      dispatch({
        type: 'feeReturn/updateState',
        payload: {
          formatVisible: visible
        },
      })
    },
    
    onGetExportUrl () {
      let tempParam = { ...queryParam }
      let tempList = getSortParam(tempParam.sortList)
      if (tempList && tempList.length>0) {
        tempParam.sortList = JSON.stringify(tempList)
      } else {
        tempParam.sortList = null
      }
      if(tempParam.missionId){
        tempParam.missionId =  tempParam.missionId.toString();
      }
      if(tempParam.subjectId){
        tempParam.subjectId =  tempParam.subjectId.toString();
      }
      if(tempParam.payType){
        tempParam.payType =  tempParam.payType.toString();
      }
      if(token()){
        tempParam.token = token()
      }
  
      delete tempParam.pageNum
      delete tempParam.pageSize
      tempParam.sence = displaySence
      tempParam.form = exportFormat>=2?exportFormat:1;
      let url = `${api.exportOrderReturnList}?${queryString.stringify(tempParam)}`
      return url
    },
  
    onChangeFormat (format) {
      dispatch({
        type: 'feeReturn/updateState',
        payload: {
          exportFormat: format
        },
      })
    }
  }

  const userTableProps = {
    dataSource: returnList,
    count,
    pageNum,
    pageSize,
    userDisplayList,
    userDisplayMap,
    userAttrMap,
    dataLoading,
    subjectMap,
    user,
    payTypeNameMap,
    selectedOrders,
    onChangePage (n, s) {
      dispatch({
        type: 'feeReturn/getReturnList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'feeReturn/updateState',
        payload: {
          ...data,
        },
      })
    },
  }

  const userModalProps = {
    modalImportData, modalVisible,
    dataSource: subjectList,
    onClose () {
      dispatch({
        type: 'feeReturn/updateState',
        payload: {
          modalVisible: false,
          modalType: '',
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'feeReturn/updateState',
        payload: {
         ...data
        },
      })
    },
    onImportConfirm (data) {
      if(!modalImportData.excel){
        message.error('请选择文件');
        return;
        }
        dispatch({
          type: 'feeReturn/importReturn',
          payload: {
            file:modalImportData.excel.fileName,
            timer: setInterval(() => {
              dispatch({
                type: 'feeReturn/getImportReturnPrs'
              })
            }, 1500)
          },
        })
    },
    onImportCover (data) {
      dispatch({
        type: 'feeReturn/coverReturn',
        payload: {
          ...data,
          timer: setInterval(() => {
            dispatch({
              type: 'feeReturn/getImportReturnPrs'
            })
          }, 1500)
        },
      })
    },
  }

  const handleChangeDate = (value) => {
    dispatch({type: 'feeReturn/updateSort',  //退费日期加蒙版
      payload:{
        beginDate: value.length == 0?'':value[0].format('YYYY-MM-DD HH:mm:ss'),
        endDate: value.length == 0?'':value[1].format('YYYY-MM-DD HH:mm:ss'),
      }})
    // dispatch({
    //   type: 'feeReturn/updateState',
    //   payload:{
    //     beginDate: value.length == 0?'':value[0].format('YYYY-MM-DD HH:mm:ss'),
    //     endDate: value.length == 0?'':value[1].format('YYYY-MM-DD HH:mm:ss'),
    //   },
    // })
	}

  const handleChangeStatus = (value) => {
    dispatch({type: 'feeReturn/updateSort',payload:{status: value}})  // 状态加蒙版
    // dispatch({
    //   type: 'feeReturn/updateState',
    //   payload:{
    //     status: value
    //   },
    // })
  }
  
  const handleChangeOrderNo = (value) => {
    dispatch({type: 'feeReturn/updateSort',payload:{orderNo: value}})  // 订单号加蒙版
	}

  const handleChangeMission = (value) => {
    dispatch({type: 'feeReturn/updateSort',payload:{missionId: value}})  // 任务名称加蒙版
    // dispatch({
    //   type: 'feeReturn/updateState',
    //   payload:{
    //     missionId: value
    //   },
    // })
	}

	const handleChangeSubject = (value) => {
    dispatch({type: 'feeReturn/updateSort',payload:{subjectId: value}})  // 项目名称加蒙版
    // dispatch({
    //   type: 'feeReturn/updateState',
    //   payload:{
    //     subjectId: value
    //   },
    // })
	}

  const handleResetQueryOrder = () => {
    for (let sort of userSortList) {
      if (sort._idSelected) {
        sort._idSelected = []
      }
    }
    dispatch({type: 'feeReturn/updateSort',   //重置加蒙版
      payload:{
        userSortList,
        accountId: [],
        payType: undefined,
        subjectId:undefined,
        missionId:undefined,
        status: undefined,
      }})
    // dispatch({
    //   type: 'feeReturn/updateState',
    //   payload: {
    //     userSortList,
    //     accountId: [],
    //     payType: undefined,
    //     subjectId:undefined,
    //     missionId:undefined,
    //     status: undefined,
    //   },
    // })
  }

  const handleChangeSearchName = (value) =>{
    dispatch({
      type: 'feeReturn/updateState',
      payload: {
        searchName: value.target.value
      },
    })
  }
  
  const handleOnSearch = (name) => {
		if(name || searchName){
			queryParam.key = name;
      dispatch({
        type: 'feeReturn/getReturnList',
        payload: {
          ...queryParam,
        },
      })
		}
	}

  const handleQueryOrder = () => {
    dispatch({
      type: 'feeReturn/getReturnList',
      payload: {
        ...queryParam,
      },
    })
  }

  const handleShowImport = () => {
    dispatch({
      type: 'feeReturn/updateState',
      payload: {
        modalVisible: true,
        modalImportData:{
          step:0,
          importing: false,
          importType: 1
        }
      },
    })
  }
  

  const handleCancelOrderVisibleChange = (value) => {
    cancelReturnData.visible = value
    dispatch({
      type: 'feeReturn/updateState',
      payload: {
        cancelReturnData
      },
    })
  }

  const handleChangeCancelRemark = (e) => {
		cancelReturnData.cancelRemark = e.target.value
		dispatch({
      type: 'feeReturn/updateState',
      payload: {
        cancelReturnData
      },
    })
	}

	const handleCancelOrder = () => {
		if(!cancelReturnData.cancelRemark){
			message.error("请输入作废理由")
			return
    }
    if(dataLoading){
      message.error("请不要重复提交")
			return
    }
    dispatch({
      type: 'feeReturn/cancelReturn',
      payload: {
        orderNo:selectedOrders.toString(),
        remark:cancelReturnData.cancelRemark
      },
    })
  }

  const renderCancelOrder = () => {
		return(
			<div>
				<div>请输入作废理由：</div>
				<TextArea style={{marginTop:'5px'}} value={cancelReturnData.cancelRemark} onChange={e=>handleChangeCancelRemark(e)}/>
				<div style={{textAlign: 'center' }}>
          <div style={{marginTop:'5px',marginBottom:'5px', color:'red', textAlign:'center', fontSize:'8px'}}>作废：对线下退款记账错误的退费订单可进行<br/>冲正，冲正后该笔订单即被废除，不进入统计</div>
          <Button size="small" style={{ marginRight: '10px' }} onClick={()=>handleCancelOrderVisibleChange(false)}>取消</Button>
          <Button type="primary" size="small" onClick={()=>handleCancelOrder()}>确定</Button>
				</div>
			</div>
		)
	}

  const createMissionOption = () => {
    const options = [];
    if(missionList){
      for(let index of missionList){
        options.push(<Option key={index.id} value={index.id} title={index.name}>{index.name}</Option>)
      }
    }
		return options;
	}

  const createSubjectOption = () => {
    const options = [];
    if(subjectList){
      for(let index of subjectList){
        options.push(<Option key={index.id} value={index.id} title={index.name}>{index.name}</Option>)
      }
    }
		return options;
	}

  const getHeight = (value)=>{
    dispatch({
      type: 'feeReturn/updateState',
      payload:{
        templateHeight: value
      },
    })
  }

  const createSort = () => {
    let i = 0
    const list = [
      {
        id:i++,
        content:(
          <div className={styles.sortCol}>
            <div className={styles.sortTextW}>退费日期:</div>
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
      },{
        id:i++,
        content:(
          <div className={styles.sortCol}>
             <div className={styles.sortText}>任务名称:</div>
                <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={missionId} className={styles.sortSelectMuti} placeholder={"选择任务"} onChange={handleChangeMission}>
                {createMissionOption()}
                </Select>
          </div>
        )
      },{
        id:i++,
        content:(
          <div className={styles.sortCol} >
            <div className={styles.sortText}>项目名称:</div>
                <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={subjectId} className={styles.sortSelectMuti} placeholder={"选择项目"} onChange={handleChangeSubject}>
                {createSubjectOption()}
                </Select>
          </div>
        )
      }
    ]
      for(let attr of userSortList){
        i++
        if(attr.id == 'orderNo'){
          list.push({
            id:i,
            content:(<div className={styles.sortCol}>
                      <div className={styles.sortText}>{attr.name}:</div>
                      <Input disabled={dataLoading} value={orderNo} className={styles.sortSelectMuti} onChange={(e) => handleChangeOrderNo(e.target.value)}></Input>
                    </div>)
                  })
        }else if(attr.id == 'status'){
          list.push({
            id:i,
            content:(<div className={styles.sortCol}>
                      <div className={styles.sortText}>{attr.name}:</div>
                      <Select disabled={dataLoading} allowClear={true} value={status} className={styles.sortSelectMuti} placeholder={"选择"+attr.name} onChange={handleChangeStatus}>
                        <Option key={2} value={2} title={'正常'}>正常</Option>
                        <Option key={0} value={0} title={'已作废'}>已作废</Option>
                        <Option key={6} value={6} title={'已对账'}>已对账</Option>
                        {user.isReview == '1'&&<Option key={5} value={5} title={'已驳回'}>已驳回</Option>}
                        {user.isReview == '1'&&<Option key={4} value={4} title={'审核中'}>审核中</Option>}
                      </Select>
                    </div>)
                  })
        }else{
          list.push({
            id:i,
            content:(<SortSelect {...{...structSelectProps, attr}}/>)})
          }
        }
      return list
  }
  
  const layerProps = {
    list: createSort(),
    query:(<div className={styles.queryBox} >
        <Button className={styles.inquery} type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQueryOrder} >{dataLoading?'':'查询'}</Button>
				<Button className={styles.reset} onClick={handleResetQueryOrder} disabled={dataLoading} >重置</Button>
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
            <div style={{ padding: '5px', textAlign: 'center' }}>
              <Row style={{fontSize: '15px'}}>
                <Col span={12} >{'退费总额：'+getFormat(returnFeeSum?returnFeeSum.feeSum:0)+'元'}</Col>
                <Col span={12} >{'退费笔数：'+(returnFeeSum?returnFeeSum.count:0)+'笔'}</Col>
              </Row>
            </div>
            <Divider style={{ margin: '5px' }} dashed />
            <Row style={{ marginBottom: '10px' }}>
              <Button type="primary" style={{ marginRight: '15px',marginBottom:isNavbar?'10px':undefined }} onClick={handleShowImport}>退费导入</Button>
              <Popover title="作废确认" trigger="click" placement="top"
                content={renderCancelOrder()}
                visible={cancelReturnData.visible?cancelReturnData.visible:false}
                onVisibleChange={e=>handleCancelOrderVisibleChange(e)}
              ><Button type="primary" style={{ marginRight: '15px' }} disabled={selectedOrders.length == 0||menuMap['/feeReturnCancel']==undefined}>作废</Button></Popover>
              <ExportTable {...exportTableProps}/>
              <div style={{width: isNavbar?'100%':'250px',display:'inline-blck',float: 'right'}}>
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

FeeReturn.propTypes = {
  feeReturn: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ feeReturn, app, loading }) => ({ feeReturn, app, loading }))(FeeReturn)
