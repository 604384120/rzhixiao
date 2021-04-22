import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col,Tag, Button, InputNumber, Card, Input, message, Divider, Select, Spin, Message, Icon, Popover, DatePicker } from 'antd'
import { Page, Print, UserSort, UserDisplay, UserSortLayer, SortSelect } from 'components'
import UserTable from './UserTable'
import styles from '../common.less'
import queryString from 'query-string'
import { getFormat, config, getSortParam, token } from 'utils'
import moment from 'moment'

const Option = Select.Option
const RangePicker = DatePicker.RangePicker;
const { TextArea, Search } = Input;
const { api } = config;

const FeeOrderRate = ({
  location, dispatch, feeOrderRate, loading, app
}) => {
  const { isNavbar } = app;
  const {
    modalVisible,  modalImportData, missionMap,
    displaySence, sortSence, userSortExtra,
    searchName, pageNum, pageSize, beginDate, endDate, payType, reBeginDate, reEndDate, receiptBeginNo, receiptEndNo, accountId, orderNo, missionId, status, printStatus,
    orderList, count, dataLoading,
    orderFeeSum,sortFlag,exportFormat,formatVisible
  } = feeOrderRate

  const { user, userDisplaySence, userAttrList, userAttrMap, menuMap, requestMap } = app
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}

  const payTypeList = requestMap['payTypeList']
  const payTypeNameMap = requestMap['payTypeMap']
  const missionList = requestMap['missionList']
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
		reBeginDate,
		reEndDate,
		receiptBeginNo,
		receiptEndNo,
		accountId: userSortMap['accountId']?userSortMap['accountId']._idSelected:undefined,
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
      dispatch({type: 'feeOrderRate/updateSort'})
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
      dispatch({type: 'feeOrderRate/updateSort'})  // 加蒙版
    },
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
    payTypeNameMap,
    user,
    onChangePage (n, s) {
      dispatch({
        type: 'feeOrderRate/getOrderList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'feeOrderRate/updateState',
        payload: {
          ...data,
        },
      })
    },
  }

  const handleChangeDate = (value) => {
    dispatch({
      type: 'feeOrderRate/updateSort',
      payload:{
        beginDate: value.length == 0?'':value[0].format('YYYY-MM-DD HH:mm:ss'),
        endDate: value.length == 0?'':value[1].format('YYYY-MM-DD HH:mm:ss'),
      },
    })
	}

	const handleChangeReDate = (value) => {
    dispatch({
      type: 'feeOrderRate/updateSort',
      payload:{
        reBeginDate: value.length == 0?'':value[0].format('YYYY-MM-DD HH:mm:ss'),
        reEndDate: value.length == 0?'':value[1].format('YYYY-MM-DD HH:mm:ss'),
      },
    })
	}

  const handleChangeStatus = (value) => {
    dispatch({
      type: 'feeOrderRate/updateSort',
      payload:{
        status: value
      },
    })
  }

  const handleChangePrintStatus = (value) => {
    dispatch({
      type: 'feeOrderRate/updateSort',
      payload:{
        printStatus: value
      },
    })
  }
  
  const handleChangeOrderNo = (value) => {
    dispatch({
      type: 'feeOrderRate/updateSort',
      payload:{
        orderNo: value
      },
    })
	}

  const handleChangeMission = (value) => {
    dispatch({
      type: 'feeOrderRate/updateSort',
      payload:{
        missionId: value
      },
    })
	}
	
	const handleChangeReBeginNo = (value) => {
    dispatch({
      type: 'feeOrderRate/updateSort',
      payload:{
        receiptBeginNo: value
      },
    })
	}

	const handleChangeReEndNo = (value) => {
    dispatch({
      type: 'feeOrderRate/updateSort',
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
      type: 'feeOrderRate/updateSort',
      payload: {
        userSortList,
        accountId: [],
        payType: undefined,
        reBeginDate: undefined,
        reEndDate: undefined,
        receiptBeginNo: null,
        receiptEndNo: null,
        missionId:undefined,
        printStatus: undefined,
	      status: undefined,
      },
    })
  }

  const handleChangeSearchName = (value) =>{
    dispatch({
      type: 'feeOrderRate/updateState',
      payload: {
        searchName: value.target.value
      },
    })
  }
  
  const handleOnSearch = (name) => {
		if(name || searchName){
			queryParam.key = name;
      dispatch({
        type: 'feeOrderRate/getOrderList',
        payload: {
          ...queryParam,
        },
      })
		}
	}

  const handleQueryOrder = () => {
    dispatch({
      type: 'feeOrderRate/getOrderList',
      payload: {
        ...queryParam,
      },
    })
  }
  
  const handleFormatVisibleChange = (visible) => {
    dispatch({
      type: 'feeOrderRate/updateState',
      payload: {
        formatVisible: visible
      },
    })
  }
  
  const getExportUrl = () => {
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
    if(tempParam.payType){
      tempParam.payType =  tempParam.payType.toString();
    }
    if(token()){
      tempParam.token = token()
    }

    delete tempParam.pageNum
    delete tempParam.pageSize
    tempParam.sence = displaySence
    tempParam.form = 2;
    tempParam.type = 2;
    let url = `${api.exportOrderList}?${queryString.stringify(tempParam)}`
    return url
  }

  const handleChangeFormat = (format) => {
    dispatch({
      type: 'feeOrderRate/updateState',
      payload: {
        exportFormat: format
      },
    })
  }

  const renderTable = () => {
    if(exportFormat == 2){
      return (
        <table border="1px" borderColor="#ddd" className={styles.formatTable} style={{marginLeft:'10px',textAlign:'center',verticalAlign:'middle',width:'540px'}}>
        <thead style={{background:"rgb(245,245,245)"}}>
          <tr>
            <td>姓名</td>
            <td>收费时间</td>
            <td>订单号</td>
            <td>支付方式</td>
            <td>票据单号</td>
            <td>实收合计</td>
            <td>学费</td>
            <td>书本费</td>
            <td>住宿费</td>
          </tr>
        </thead>
        <tbody>
              <tr>
                <td>学生1</td>
                <td>9:00-10:00</td>
                <td>12376543</td>
                <td>支付宝</td>
                <td>12332765458</td>
                <td>88888</td>
                <td>77777</td>
                <td>22222</td>
                <td>99999</td>
              </tr>
              <tr>
                <td>学生2</td>
                <td>9:00-10:00</td>
                <td>12376543</td>
                <td>支付宝</td>
                <td>12332765458</td>
                <td>88888</td>
                <td>77777</td>
                <td>22222</td>
                <td>99999</td>
              </tr>
              <tr>
                <td>学生3</td>
                <td>9:00-10:00</td>
                <td>12376543</td>
                <td>支付宝</td>
                <td>12332765458</td>
                <td>88888</td>
                <td>77777</td>
                <td>22222</td>
                <td>99999</td>
              </tr>
              <tr>
                <td>学生4</td>
                <td>9:00-10:00</td>
                <td>12376543</td>
                <td>支付宝</td>
                <td>12332765458</td>
                <td>88888</td>
                <td>77777</td>
                <td>22222</td>
                <td>99999</td>
              </tr>
            </tbody>
          </table>
      )
    }else{
      return (
        <table border="1px" borderColor="#ddd" className={styles.formatTable} style={{marginLeft:'10px',textAlign:'center',verticalAlign:'middle',width:'540px'}}>
        <thead style={{background:"rgb(245,245,245)"}}>
          <tr>
            <td>姓名</td>
            <td>收费时间</td>
            <td>订单号</td>
            <td>支付方式</td>
            <td>票据单号</td>
            <td>项目名称</td>
            <td>本次实收</td>
          </tr>
        </thead>
        <tbody>
              <tr>
                <td>学生1</td>
                <td>9:00-10:00</td>
                <td>1234587654</td>
                <td>支付宝</td>
                <td>9999900000</td>
                <td>学费</td>
                <td>88888</td>
              </tr>
              <tr>
              <td>学生2</td>
                <td>9:00-10:00</td>
                <td>1234587654</td>
                <td>支付宝</td>
                <td>9999900000</td>
                <td>学费</td>
                <td>88888</td>
              </tr>
              <tr>
              <td>学生3</td>
                <td>9:00-10:00</td>
                <td>1234587654</td>
                <td>支付宝</td>
                <td>9999900000</td>
                <td>学费</td>
                <td>88888</td>
              </tr>
              <tr>
              <td>学生4</td>
                <td>9:00-10:00</td>
                <td>1234587654</td>
                <td>支付宝</td>
                <td>9999900000</td>
                <td>学费</td>
                <td>88888</td>
              </tr>
            </tbody>
          </table>
      )
    }
  }

  const renderFormat = () => {
    return(
      <div style={{width:'630px', height:'250px'}}>
          <Col span={3} style={{textAlign:'center'}}>
            <div><Tag color={exportFormat>=2?"":"blue"} onClick={()=>handleChangeFormat(1)}>&nbsp;&nbsp;格式1&nbsp;&nbsp;</Tag></div>
            <div style={{marginTop:'15px'}}><Tag color={exportFormat==2?"blue":""} onClick={()=>handleChangeFormat(2)}>&nbsp;&nbsp;格式2&nbsp;&nbsp;</Tag></div>
          </Col>
          <Col span={21} style={{borderLeft:"1px solid rgb(240,240,240)"}}>
          <div style={{marginLeft:'10px',marginBottom:'5px'}}>示例：</div>
          {renderTable()}
          <Button type="primary" style={{marginTop:'15px', float:"right"}} target="_blank" href={getExportUrl()}>确认导出</Button>
          </Col>
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
  
  const getHeight = (value)=>{
    dispatch({
      type: 'feeOrderRate/updateState',
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
      }
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
    if(orderFeeSum){
      sum.push(<Col span={12} >{'手续费总额：'+getFormat(orderFeeSum.rateSum)+'元'}</Col>)
      sum.push(<Col span={12} >{'订单笔数：'+(orderFeeSum?orderFeeSum.count:'0')+'笔'}</Col>)
    }
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
                <Button style={{ marginRight: '15px' }} target="_blank" href={getExportUrl()}>导出</Button>
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
    </Page>
  )
}

FeeOrderRate.propTypes = {
  feeOrderRate: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ feeOrderRate, app, loading }) => ({ feeOrderRate, app, loading }))(FeeOrderRate)
