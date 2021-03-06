import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Card, Divider, Select, Spin, Icon, DatePicker, Checkbox, Tabs, Input, Menu, Dropdown, Popover } from 'antd'
import { Page, UserSort, UserSortLayer, UserDisplay, SortSelect  } from 'components'
import styles from '../common.less'
import { getFormat,config } from 'utils'
import moment from 'moment';
import XLSX from 'xlsx';
import OrderTable from './OrderTable'
import OrderReturnTable from './OrderReturnTable'

const { payType } = config
const Option = Select.Option
const TabPane = Tabs.TabPane
const { TextArea, Search } = Input;

const Reconciliation = ({
  location, dispatch, reconciliation, loading, app
}) => {
  const {
    displaySence, sortSence, userSortExtra, beginDate, endDate, totalBegin, dataLoading, sortFlag, index, searchName, accountId, payTypeId, missionId, subjectId, status, orderNo, 
    orderData, returnData,
  } = reconciliation

  const { user, userDisplaySence, userAttrList, userAttrMap, userData, menuMap, requestMap, isNavbar } = app

  const { RangePicker } = DatePicker;

  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}

  const payTypeList = requestMap['payTypeList']
  const payTypeNameMap = requestMap['payTypeMap']
  const missionList = requestMap['missionList']
  const subjectList = requestMap['subjectList']
  const accountList = requestMap['accountList']

  const queryParam = {
    key:searchName,
    beginDate,
    endDate,
    missionId,
		sortList: userSortList,
		payTypeId,
		accountId: userSortMap['accountId']?userSortMap['accountId']._idSelected:undefined,
    subjectId,
    status,
    orderNo,
    pageNum: index == 1?orderData.pageNum:returnData.pageNum,
    pageSize: index == 1?orderData.pageSize:returnData.pageSize,
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
      dispatch({type: 'reconciliation/updateSort'})  // ?????????????????????
      dispatch({
        type: 'app/updateDisplay',
        payload: {
          displayListTemp:data,
          sence: sortSence,
        },
      })
    },
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
      dispatch({type: 'reconciliation/updateSort'})  // ?????????
    },
  }

  const orderTableProps = {
    orderData,
    dataSource: orderData.orderList,
    userAttrList,
    userDisplayList,
    userDisplayMap,
    userAttrMap,
    payTypeNameMap,
    user,menuMap,
    onChangePage (n, s) {
      queryParam.pageNum = n
      queryParam.pageSize = s
      dispatch({
        type: 'reconciliation/getOverallReconciliation',
        payload: {
          ...queryParam,
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'reconciliation/updateState',
        payload: {
          ...data,
        },
      })
    },
  }

  const orderReturnTableProps = {
    returnData,
    dataSource: returnData.returnList,
    userDisplayList,
    userDisplayMap,
    userAttrMap,
    user,
    payTypeNameMap,
    onChangePage (n, s) {
      queryParam.pageNum = n
      queryParam.pageSize = s
      dispatch({
        type: 'reconciliation/getOverallReconciliation',
        payload: {
          ...queryParam,
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'reconciliation/updateState',
        payload: {
          ...data,
        },
      })
    },
  }

  const handleQuery = (value) => {
    dispatch({
      type: 'reconciliation/getOverallReconciliation',
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
    dispatch({type: 'reconciliation/updateSort',   //???????????????
      payload:{
        userSortList,
        accountId: [],
        payTypeId: undefined,
        subjectId:undefined,
        missionId:undefined,
        status: undefined,
        orderNo: undefined,
      }})
  }

  const handleReconciliation = () => {
    dispatch({
      type: 'reconciliation/updateReconciliation',
      payload: {
        ...queryParam
      },
    })
  }

  const handleChangeSearchName = (value) =>{
    dispatch({
      type: 'reconciliation/updateState',
      payload: {
        searchName : value.target.value
      },
    })
  }

  const handleOnSearch = (name) => {
    if(name || searchName){
      queryParam.key = name;
    }
    dispatch({
      type: 'reconciliation/getOverallReconciliation',
      payload: {
        ...queryParam,
      },
    })
		
	}

  const handleChangeDateRange = (value) => {
    if(value.length != 0){
      dispatch({type: 'reconciliation/updateSort',    //?????????????????????
        payload: {
            // dateRangeType: 0,
            beginDate: value[0].format('YYYY-MM-DD'),
            endDate: value[1].format('YYYY-MM-DD'),
        },
      })
    }
  }

  const handleChangeAccount = (value) => {
    dispatch({type: 'reconciliation/updateSort',payload:{accountId: value}})  // ????????????????????????
  }
  
  const handleChangeOrderNo = (value) => {
    dispatch({type: 'reconciliation/updateSort',payload:{orderNo: value}})  // ??????????????????
	}

  const handleChangeMission = (value) => {
    dispatch({type: 'reconciliation/updateSort',payload:{missionId: value}})  // ?????????????????????
	}

	const handleChangeSubject = (value) => {
    dispatch({type: 'reconciliation/updateSort',payload:{subjectId: value}})  // ?????????????????????
  }
  
  const handleChangePaytype = (value) => {
    dispatch({type: 'reconciliation/updateSort',payload:{payTypeId: value}})  // ?????????????????????
  }

  const handleChangeStatus = (value) => {
    dispatch({type: 'reconciliation/updateSort',payload:{status: value}})  // ???????????????
  }

  const handleMoveLeft = () => {
    if(totalBegin>0){
      dispatch({
        type: 'reconciliation/updateState',
        payload: {
          totalBegin:totalBegin-1
        },
      })
    }
   
  }

  const handleMoveRight = () => {
    dispatch({
      type: 'reconciliation/updateState',
      payload: {
        totalBegin:totalBegin+1
      },
    })
  }

  const handleChangeTabs = (value) => {
    dispatch({
      type: 'reconciliation/updateState',
      payload: {
        index: value
      },
    })
    handleQuery(value)
  }

  const handleCancelOrderVisibleChange = (value) => {
    if(index == 1){
      orderData.cancelOrderData.visible = value
      dispatch({
        type: 'reconciliation/updateState',
        payload: {
          orderData
        },
      })
    }else{
      returnData.cancelReturnData.visible = value
      dispatch({
        type: 'reconciliation/updateState',
        payload: {
          returnData
        },
      })
    }
  }

  const handleChangeCancelRemark = (e) => {
    if(index == 1){
      orderData.cancelOrderData.cancelRemark = e.target.value
      dispatch({
        type: 'reconciliation/updateState',
        payload: {
          orderData
        },
      })
    }else{
      returnData.cancelReturnData.cancelRemark = e.target.value
      dispatch({
        type: 'reconciliation/updateState',
        payload: {
          returnData
        },
      })
    }
		
  }
  
  const handleCancelOrder = () => {
    if(index == 1){
      if(!orderData.cancelOrderData.cancelRemark){
        message.error("?????????????????????")
        return
      }
      if(orderData.dataLoading){
        message.error("?????????????????????")
        return
      }
      dispatch({
        type: 'reconciliation/cancelOrder',
        payload: {
          orderNo:orderData.selectedOrders.toString(),
          remark:orderData.cancelOrderData.cancelRemark,
        },
      })
    }else{
      if(!returnData.cancelReturnData.cancelRemark){
        message.error("?????????????????????")
        return
      }
      if(returnData.dataLoading){
        message.error("?????????????????????")
        return
      }
      dispatch({
        type: 'reconciliation/cancelReturn',
        payload: {
          orderNo:returnData.selectedReturns.toString(),
          remark:returnData.cancelReturnData.cancelRemark
        },
      })
    }
  }

  const createPayTypeOption = (attr) => {
    const options = [];
    if(payTypeList){
      for(let payType of payTypeList){
        options.push(<Option key={payType.payType} value={payType.payType} title={payType.name}>{payType.name}</Option>)
      }
    }
		return options;
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

  const renderCancelOrder = () => {
		return(
			index == 1?<div>
      <div>????????????????????????</div>
      <TextArea style={{marginTop:'5px'}} value={orderData.cancelOrderData.cancelRemark} onChange={e=>handleChangeCancelRemark(e)}/>
      <div style={{textAlign: 'center' }}>
        <div style={{marginTop:'5px', marginBottom:'5px', color:'red', maxWidth:'275px', textAlign:'left', fontSize:'8px'}}>1.????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????<br/>2.??????????????????????????????????????????????????????????????????</div>
        <Button size="small" style={{ marginRight: '10px' }} onClick={()=>handleCancelOrderVisibleChange(false)}>??????</Button>
        <Button type="primary" size="small" onClick={()=>handleCancelOrder()}>??????</Button>
      </div>
    </div>:<div>
				<div>????????????????????????</div>
				<TextArea style={{marginTop:'5px'}} value={returnData.cancelReturnData.cancelRemark} onChange={e=>handleChangeCancelRemark(e)}/>
				<div style={{textAlign: 'center' }}>
          <div style={{marginTop:'5px',marginBottom:'5px', color:'red', textAlign:'center', fontSize:'8px'}}>????????????????????????????????????????????????????????????<br/>????????????????????????????????????????????????????????????</div>
          <Button size="small" style={{ marginRight: '10px' }} onClick={()=>handleCancelOrderVisibleChange(false)}>??????</Button>
          <Button type="primary" size="small" onClick={()=>handleCancelOrder()}>??????</Button>
				</div>
			</div>
		)
	}

  const createTotal = () => {
    const cols = [];
    let lists = []
    let i =0;
    let a = 1
    let step = 4
    if(document.body.clientWidth < 600){
      step = 1;
    }else{
      step = Math.round(document.body.clientWidth / 400)
      if(step == 5){
        step = 4
      }
    }
    let sumReconciliation = null
    if(index == 1){
      sumReconciliation = orderData.sumReconciliation
    }else{
      sumReconciliation = returnData.sumReconciliation
    }
    //????????????
    if(sumReconciliation){
      lists[0] = {}
      lists[0].date = sumReconciliation.date
      lists[0].paidFee = sumReconciliation.paidFee
      lists[0].paidFeeCount = sumReconciliation.paidFeeCount
      lists[0].payType = '0'
      lists[0].realFee = sumReconciliation.realFee
      lists[0].refund = sumReconciliation.refund
      lists[0].refundCount = sumReconciliation.refundCount
      //????????????
      if(sumReconciliation.typeStatistics){
        for(let node of sumReconciliation.typeStatistics){
          lists[a++] = node
        }
        for(i = totalBegin;i<lists.length;i++){
          cols.push(
            <Col span={24/step} style={{height:'200px', display:'inline-block', borderRight:"1px solid #ffffff"}} key={lists[i].payType}>
              {
                totalBegin!==0&&cols.length<1&&<Icon type='double-left' onClick={handleMoveLeft} style={{position:'absolute', marginTop:'88px', fontSize:'22px', color:'#c3c3c3'}}/>
              }
              <div style={{ margin:"0 auto"}}>
                 {lists[i].payType=='0'?<div style={{fontSize:'20px', marginTop:'20px', marginLeft:'20px'}}>??????</div>
                 :<div style={{fontSize:'20px', marginTop:'20px', marginLeft:'20px'}}>
                 {payType[lists[i].payType]&&<Icon type={payType[lists[i].payType].icon} style={{marginRight:'10px'}}/>}
                 {payTypeNameMap[lists[i].payType]}
                 </div>}
                 <div style={{marginTop:'10px'}}>
                   <span style={{fontSize:'16px', marginLeft:'20px'}}>????????????:</span>
                   <span style={{fontSize:'20px', marginLeft:'5px', color:'#1890ff'}}>{getFormat(lists[i].realFee)}</span>
                   <span style={{fontSize:'12px', paddingTop:'6px', marginLeft:'5px'}}>???</span>
                 </div>
                 <div style={{marginTop:'25px'}}>
                   <span style={{fontSize:'12px', marginLeft:'20px'}}>????????????:</span>
                   <span style={{fontSize:'12px', marginLeft:'5px'}}>{getFormat(lists[i].paidFee)}</span>
                   <span style={{fontSize:'10px', marginLeft:'5px'}}>???</span>
                   <span style={{fontSize:'12px', marginLeft:'10px'}}>|</span>
                   <span style={{fontSize:'12px', marginLeft:'10px'}}>{lists[i].paidFeeCount}</span>
                   <span style={{fontSize:'10px', marginLeft:'5px'}}>???</span>
                 </div>
                 <div style={{marginTop:'10px'}}>
                   <span style={{fontSize:'12px', marginLeft:'20px'}}>????????????:</span>
                   <span style={{fontSize:'12px', marginLeft:'5px'}}>{getFormat(lists[i].refund)}</span>
                   <span style={{fontSize:'10px', marginLeft:'5px'}}>???</span>
                   <span style={{fontSize:'12px', marginLeft:'10px'}}>|</span>
                   <span style={{fontSize:'12px', marginLeft:'10px'}}>{lists[i].refundCount}</span>
                   <span style={{fontSize:'10px', marginLeft:'5px'}}>???</span>
                 </div>
               </div>
                {
                  cols.length>=step-1&&totalBegin<lists.length-step&&<Icon type='double-right' onClick={handleMoveRight} style={{position:'absolute', marginTop:'88px', fontSize:'22px', color:'#c3c3c3', top:0, right:0}}/>
                }
            </Col>
          )
          if(cols.length==step){
            break
          }
        }
      }
    }
   return cols;
  }

  const createSort = () => {
    let i = 0
    const list = [
      {
        id:i++,
        content:(
          <div className={styles.sortCol}>
            <div className={styles.sortTextW}>????????????:</div>
              <RangePicker
                disabled={dataLoading}
                allowClear={false}
                //showTime={{ format: 'HH:mm:ss',defaultValue:[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}}
                value={[moment(beginDate), moment(endDate)]}
                disabledDate={(current)=>{return current && current > moment().endOf('day')}}
                format="YYYY-MM-DD"
                onChange={handleChangeDateRange}
                placeholder={['????????????', '????????????']}
                style={{width: 'calc(100% - 100px)'}}
              />
          </div>
        ),
        length:2
      },{
        id:i++,
        content:(
          <div className={styles.sortCol}>
             <div className={styles.sortText}>????????????:</div>
                <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={missionId} className={styles.sortSelectMuti} placeholder={"????????????"} onChange={handleChangeMission}>
                {createMissionOption()}
                </Select>
          </div>
        )
      },{
        id:i++,
        content:(
          <div className={styles.sortCol} >
            <div className={styles.sortText}>????????????:</div>
                <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={subjectId} className={styles.sortSelectMuti} placeholder={"????????????"} onChange={handleChangeSubject}>
                {createSubjectOption()}
                </Select>
          </div>
        )
      },{
        id:i++,
        content:(
          <div className={styles.sortCol} >
            <div className={styles.sortText}>????????????:</div>
              <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={payTypeId} className={styles.sortSelect} placeholder={"??????????????????"} onChange={handleChangePaytype}>
                {createPayTypeOption()}
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
                    <Select disabled={dataLoading} allowClear={true} value={status} className={styles.sortSelectMuti} placeholder={"??????"+attr.name} onChange={handleChangeStatus}>
                      <Option key={2} value={2} title={'??????'}>??????</Option>
                      <Option key={6} value={6} title={'?????????'}>?????????</Option>
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
      <Button className={styles.inquery} type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQuery} >{(index == 1?orderData.dataLoading:returnData.dataLoading)?'':'??????'}</Button>
      <Button className={styles.reset} onClick={handleResetQuery} disabled={dataLoading} >??????</Button>
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
            <Row style={{marginTop:'10px', backgroundColor:'#f7f7f7', marginBottom: '10px'}}>
            {createTotal()}
            </Row>
            <Divider style={{ margin: '5px' }} dashed />
            <Tabs defaultActiveKey="1" activeKey={index} animated={false} onChange={handleChangeTabs}>
                <TabPane tab="????????????" key="1">
                  {
                    index==1 && <div>
                      <Row style={{marginBottom:'10px'}}>
                        <Popover title="????????????" trigger="click" placement="top"
                          content={renderCancelOrder()}
                          visible={orderData.cancelOrderData.visible?orderData.cancelOrderData.visible:false}
                          onVisibleChange={e=>handleCancelOrderVisibleChange(e)}
                        ><Button type="primary" style={{ marginRight: '15px', marginBottom: '10px' }} disabled={orderData.selectedOrders.length == 0}>??????</Button></Popover>
                        <Button style={{ marginRight: '10px' }} disabled={orderData.selectedOrders.length == 0} onClick={handleReconciliation}>????????????</Button>
                      <div style={{width: isNavbar?'100%':'250px',display:'inline-blck',float: 'right'}}>
                        <Search enterButton placeholder="??????" value={searchName} onChange={(value)=>{handleChangeSearchName(value)}} onSearch={(value) => handleOnSearch(value)} style={{ float: 'right', width: isNavbar?'calc(100% - 50px)':'200px', marginBottom:isNavbar?'5px':undefined }} />
                        <UserDisplay {...userDisplayProps} />
                      </div>
                      </Row>
                      <Row><OrderTable {...orderTableProps} /></Row>
                    </div>
                  }
                </TabPane>
                <TabPane tab="????????????" key="2">
                {
                  index==2&&<div>
                  <Row style={{marginBottom:'10px'}}>
                    <Popover title="????????????" trigger="click" placement="top"
                      content={renderCancelOrder()}
                      visible={returnData.cancelReturnData.visible?returnData.cancelReturnData.visible:false}
                      onVisibleChange={e=>handleCancelOrderVisibleChange(e)}
                    ><Button type="primary" style={{ marginRight: '15px', marginBottom: '10px' }} disabled={returnData.selectedReturns.length == 0}>??????</Button></Popover>
                      <Button style={{ marginRight: '10px' }} disabled={returnData.selectedReturns.length == 0} onClick={handleReconciliation}>????????????</Button>
                      <div style={{width: isNavbar?'100%':'250px',display:'inline-blck',float: 'right'}}>
                        <Search enterButton placeholder="??????" value={searchName} onChange={(value)=>{handleChangeSearchName(value)}} onSearch={(value) => handleOnSearch(value)} style={{ float: 'right', width: isNavbar?'calc(100% - 50px)':'200px', marginBottom:isNavbar?'10px':undefined }} />
                        <UserDisplay {...userDisplayProps} />
                      </div>
                  </Row>
                  <Row><OrderReturnTable {...orderReturnTableProps} /></Row>
                  </div>
                }
                </TabPane>
              </Tabs>
            </div>
          </Card>
        </Col>
      </Row>
    </Page>
  )
}

Reconciliation.propTypes = {
  reconciliation: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ reconciliation, app, loading }) => ({ reconciliation, app, loading }))(Reconciliation)
