import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col,Tag, Button, InputNumber, Card, Input, message, Divider, Select, Spin, Message, Icon, Popover, DatePicker } from 'antd'
import { Page, Print, UserSort, UserDisplay, UserSortLayer, SortSelect, ExportTable } from 'components'
import UserTable from './UserTable'
import UserModal from './UserModal'
import styles from '../common.less'
import queryString from 'query-string'
import { getFormat, config, getSortParam, token } from 'utils'
import moment from 'moment'

const Option = Select.Option
const RangePicker = DatePicker.RangePicker;
const { TextArea, Search } = Input;
const { api } = config;

const FeeOrder = ({
  location, dispatch, feeOrder, loading, app
}) => {
  const {
    modalVisible,  modalImportData,
    displaySence, sortSence, userSortExtra,
    searchName, pageNum, pageSize, beginDate, endDate, reBeginDate, reEndDate, receiptBeginNo, receiptEndNo, orderNo, missionId, subjectId, status, printStatus,
    orderList, count, dataLoading,selectedOrders,
    printCheck, textData, templateHeight, settingData, cancelOrderData,
    orderFeeSum,sortFlag,exportFormat,formatVisible
  } = feeOrder

  const { user, userDisplaySence, userAttrList, userAttrMap, menuMap, requestMap, isNavbar } = app
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}

  const payTypeList = requestMap['payTypeList']
  const payTypeNameMap = requestMap['payTypeMap']
  const missionList = requestMap['missionList']
  const missionMap = requestMap['missionMap']
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
		payType:userSortMap['payType']?userSortMap['payType']._idSelected:undefined,
		reBeginDate,
		reEndDate,
		receiptBeginNo,
		receiptEndNo,
		accountId:userSortMap['accountId']?userSortMap['accountId']._idSelected:undefined,
    subjectId,
    status,
    printStatus,
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
        payload:{sence:displaySence, displayExtra:userSortExtra}
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
      dispatch({type: 'feeOrder/updateSort'})
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
      dispatch({type: 'feeOrder/updateSort'})  // 加蒙版
    },
  }

  const exportTableProps ={
    sence: 'order',
    styles,
    formatVisible,
    exportFormat,
    onChangeFormat (format) {
      dispatch({
        type: 'feeOrder/updateState',
        payload: {
          exportFormat: format
        },
      })
    },
    onFormatVisibleChange (visible) {
      dispatch({
        type: 'feeOrder/updateState',
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
      let url = `${api.exportOrderList}?${queryString.stringify(tempParam)}`
      return url
    }
  }

  const userTableProps = {
    dataSource: orderList,
    count,
    pageNum,
    pageSize,
    userAttrList,
    userDisplayList,
    userDisplayMap,
    userAttrMap,
    dataLoading,
    subjectMap,
    payTypeNameMap,
    selectedOrders,
    user,menuMap,
    rateVisible: orderFeeSum && (orderFeeSum.rateSum && orderFeeSum.rateSum != '0' || orderFeeSum.rateCount && orderFeeSum.rateCount != '0')?true:false,
    onChangePage (n, s) {
      dispatch({
        type: 'feeOrder/getOrderList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'feeOrder/updateState',
        payload: {
          ...data,
        },
      })
    },
    onPrintDelete (data) {
      dispatch({
        type: 'app/printDelete',
        payload: {
          ...data
        },
      })
    },
    onPrintSuccess (data) {
      dispatch({
        type: 'app/printSuccess',
        payload: {
          ...data
        },
      })
    },
    onGetPrint (data) {
      dispatch({
        type: 'app/getPrint',
        payload: {
          ...data
        },
      })
    },
    onUpdatePrint (data) {
      dispatch({
        type: 'app/updateState',
        payload: {
          ...data,
        },
      })
    },
  }

  const userModalProps = {
    modalImportData, modalVisible,
    missionList, missionMap,
    subjectMap,
    onClose () {
      dispatch({
        type: 'feeOrder/updateState',
        payload: {
          modalVisible: false,
          modalType: '',
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'feeOrder/updateState',
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
          type: 'feeOrder/importOrder',
          payload: {
            file:modalImportData.excel.fileName,
            timer: setInterval(() => {
              dispatch({
                type: 'feeOrder/getImportOrderPrs'
              })
            }, 1500)
          },
        })
    },
    onImportCover (data) {
      dispatch({
        type: 'feeOrder/coverOrder',
        payload: {
          ...data,
          timer: setInterval(() => {
            dispatch({
              type: 'feeOrder/getImportOrderPrs'
            })
          }, 1500)
        },
      })
    },
    onGetSubject (record) {
      dispatch({
        type: 'feeOrder/getSubjectListByMission',
        payload: {
          missionId: record.missionId
        },
      })
    }
  }

  const handleChangeDate = (value) => {
    dispatch({
      type: 'feeOrder/updateSort',
      payload:{
        beginDate: value.length == 0?'':value[0].format('YYYY-MM-DD HH:mm:ss'),
        endDate: value.length == 0?'':value[1].format('YYYY-MM-DD HH:mm:ss'),
      },
    })
	}

	const handleChangeReDate = (value) => {
    dispatch({
      type: 'feeOrder/updateSort',
      payload:{
        reBeginDate: value.length == 0?'':value[0].format('YYYY-MM-DD HH:mm:ss'),
        reEndDate: value.length == 0?'':value[1].format('YYYY-MM-DD HH:mm:ss'),
      },
    })
	}

  const handleChangeStatus = (value) => {
    dispatch({
      type: 'feeOrder/updateSort',
      payload:{
        status: value
      },
    })
  }

  const handleChangePrintStatus = (value) => {
    dispatch({
      type: 'feeOrder/updateSort',
      payload:{
        printStatus: value
      },
    })
  }
  
  const handleChangeOrderNo = (value) => {
    dispatch({
      type: 'feeOrder/updateSort',
      payload:{
        orderNo: value
      },
    })
	}

  const handleChangeMission = (value) => {
    dispatch({
      type: 'feeOrder/updateSort',
      payload:{
        missionId: value
      },
    })
	}

	const handleChangeSubject = (value) => {
    dispatch({
      type: 'feeOrder/updateSort',
      payload:{
        subjectId: value
      },
    })
	}
	
	const handleChangeReBeginNo = (value) => {
    dispatch({
      type: 'feeOrder/updateSort',
      payload:{
        receiptBeginNo: value
      },
    })
	}

	const handleChangeReEndNo = (value) => {
    dispatch({
      type: 'feeOrder/updateSort',
      payload:{
        receiptEndNo: value
      },
    })
	}

  const handleResetQueryOrder = () => {
    for (let sort of userSortList) {
      if (sort._idSelected) {
        sort._idSelected = []
      }
    }
    dispatch({
      type: 'feeOrder/updateSort',
      payload: {
        userSortList,
        accountId: [],
        payType: undefined,
        reBeginDate: undefined,
        reEndDate: undefined,
        receiptBeginNo: null,
        receiptEndNo: null,
        subjectId:undefined,
        missionId:undefined,
        printStatus: undefined,
	      status: undefined,
      },
    })
  }

  const handleChangeSearchName = (value) =>{
    dispatch({
      type: 'feeOrder/updateState',
      payload: {
        searchName: value.target.value
      },
    })
  }
  
  const handleOnSearch = (name) => {
		if(name || searchName){
			queryParam.key = name;
      dispatch({
        type: 'feeOrder/getOrderList',
        payload: {
          ...queryParam,
        },
      })
		}
	}

  const handleQueryOrder = () => {
    dispatch({
      type: 'feeOrder/getOrderList',
      payload: {
        ...queryParam,
      },
    })
  }
  
  const handleShowImport = () => {
    dispatch({
      type: 'feeOrder/updateState',
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
    cancelOrderData.visible = value
    dispatch({
      type: 'feeOrder/updateState',
      payload: {
        cancelOrderData
      },
    })
  }

  const handleChangeCancelRemark = (e) => {
		cancelOrderData.cancelRemark = e.target.value
		dispatch({
      type: 'feeOrder/updateState',
      payload: {
        cancelOrderData
      },
    })
	}

	const handleCancelOrder = () => {
		if(!cancelOrderData.cancelRemark){
			message.error("请输入冲正理由")
			return
    }
    if(dataLoading){
      message.error("请不要重复提交")
			return
    }
    dispatch({
      type: 'feeOrder/cancelOrder',
      payload: {
        orderNo:selectedOrders.toString(),
        remark:cancelOrderData.cancelRemark,
        queryParam,
      },
    })
  }

  const renderCancelOrder = () => {
		return(
			<div>
				<div>请输入冲正理由：</div>
				<TextArea style={{marginTop:'5px'}} value={cancelOrderData.cancelRemark} onChange={e=>handleChangeCancelRemark(e)}/>
				<div style={{textAlign: 'center' }}>
          <div style={{marginTop:'5px', marginBottom:'5px', color:'red', fontSize:'8px', maxWidth:'275px', textAlign:'left'}}>1.冲正：对线下收款记账错误的收费订单可进行冲正，冲正后该笔订单即被废除，不进入统计<br/>2.冲正结转订单时会将转入转出的两笔订单同时冲正</div>
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
      type: 'feeOrder/updateState',
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
            <div className={styles.sortTextW}>收费日期:</div>
                <RangePicker
                  disabled={dataLoading}
                  showTime={{ format: 'HH:mm:ss',defaultValue:[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}}
                  defaultValue={[beginDate?moment(beginDate):'', endDate?moment(endDate):'']}
                  disabledDate={current=>{return current && current > moment().endOf('day')}}
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
      },
    ]
      for(let attr of userSortList){
        i++
        if(attr.id == 'reDate'){
          list.push({
            id:i,
            content:(<div className={styles.sortCol}>
                      <div className={styles.sortText}>{attr.name}:</div>
                      <RangePicker
                        disabled={dataLoading}
                        showTime={{ format: 'HH:mm:ss',defaultValue:[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}}
                        disabledDate={current=>{return current && current > moment().endOf('day')}}
                        format="YYYY-MM-DD HH:mm:ss"
                        onChange={handleChangeReDate}
                        style={{width: 'calc(100% - 100px)'}}
                        placeholder={['开始时间', '结束时间']}/>
                    </div>)
                  })
        }else if(attr.id == 'receiptNo'){
          list.push({
            id:i,
            content:(<div className={styles.sortCol}>
                      <div className={styles.sortText}>{attr.name}:</div>
                      <div style={{width:'calc(100% - 100px)',display:'inline-block'}}>
                      <InputNumber min={0}  step={1} disabled={dataLoading} value={receiptBeginNo} onChange={handleChangeReBeginNo} style={{width:'calc(50% - 5px)'}}/>
                        ~<InputNumber min={0} step={1} disabled={dataLoading} value={receiptEndNo} onChange={handleChangeReEndNo} style={{width:'calc(50% - 5px)'}}/>
                      </div>
                    </div>)
                  })
        }else if(attr.id == 'orderNo'){
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
                        <Option key={0} value={0} title={'已冲正'}>已冲正</Option>
                        <Option key={6} value={6} title={'已对账'}>已对账</Option>
                        {user.isReview == '1'&&<Option key={5} value={5} title={'已驳回'}>已驳回</Option>}
                        {user.isReview == '1'&&<Option key={4} value={4} title={'审核中'}>审核中</Option>}
                      </Select>
                    </div>)
                  })
        }else if(attr.id == 'printStatus'){
          list.push({
            id:i,
            content:(<div className={styles.sortCol}>
                      <div className={styles.sortText}>{attr.name}:</div>
                      <Select disabled={dataLoading} allowClear={true} value={printStatus} className={styles.sortSelectMuti} placeholder={"选择"+attr.name} onChange={handleChangePrintStatus}>
                        <Option key={1} value={1} title={'已打印'}>已打印</Option>
                        <Option key={0} value={0} title={'未打印'}>未打印</Option>
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

  const renderOrderSum = () => {
    let sum = []
    sum.push(<Col span={12} >{'缴费总额：'+getFormat(orderFeeSum?orderFeeSum.feeSum:0)+'元'}</Col>)
    sum.push(<Col span={12} >{'缴费笔数：'+(orderFeeSum?orderFeeSum.count:'0')+'笔'}</Col>)
    return sum
  }
  
  const layerProps = {
    list: createSort(),
    query:(<div className={styles.queryBox}>
        <Button className={styles.inquery} type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQueryOrder}>{dataLoading?'':'查询'}</Button>
				<Button className={styles.reset} onClick={handleResetQueryOrder} disabled={dataLoading}>重置</Button>
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
                {renderOrderSum()}
              </Row>
            </div>
            <Divider style={{ margin: '5px' }} dashed />
            <Row style={{ marginBottom: '5px' }}>
              <Button type="primary" style={{ marginRight: '15px',marginBottom:isNavbar?'10px':undefined}} onClick={handleShowImport}>收费导入</Button>
              <Popover title="冲正确认" trigger="click" placement="top"
                content={renderCancelOrder()}
                visible={cancelOrderData.visible?cancelOrderData.visible:false}
                onVisibleChange={e=>handleCancelOrderVisibleChange(e)}
              ><Button type="primary" style={{ marginRight: '15px' }} disabled={selectedOrders.length == 0||menuMap['/feeOrderCancel']==undefined}>冲正</Button></Popover>
              <ExportTable {...exportTableProps}/>
              <div style={{width: isNavbar?'100%':'250px',display:'inline-blck',float: 'right'}}>
                <Search enterButton placeholder="搜索" value={searchName} onChange={(value)=>{handleChangeSearchName(value)}} onSearch={(value) => handleOnSearch(value)} style={{ float: 'right', width: isNavbar?'calc(100% - 50px)':'200px' }} />
                <UserDisplay {...userDisplayProps} />
              </div>
            </Row>
            <Row style={{ color:selectedOrders.length?'#1890ff':''}}>
            <Icon type="check" style={{marginLeft:'5px'}}/> 当前已选择{selectedOrders.length?selectedOrders.length:'0'}条记录
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

FeeOrder.propTypes = {
  feeOrder: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ feeOrder, app, loading }) => ({ feeOrder, app, loading }))(FeeOrder)
