import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Card, Input, message, Divider, Select, Spin, Popover, DatePicker, Icon } from 'antd'
import { Page, UserSort, UserDisplay, UserSortLayer, SortSelect } from 'components'
import UserTable from './UserTable'
import styles from '../common.less'
import moment from 'moment';

const Option = Select.Option
const RangePicker = DatePicker.RangePicker;
const { TextArea, Search } = Input;

const FeeOrderReview = ({
  location, dispatch, feeOrderReview, loading, app
}) => {
  const {
    displaySence, sortSence, userSortExtra,
    searchName, pageNum, pageSize, beginDate, endDate, payType, accountId, missionId, subjectId, status,
    feeReviewList, count, dataLoading, selectedOrders, selectedAll,
    cancelFeeReviewData, confirmFeeReviewData,
    sortFlag, orderNo, 
  } = feeOrderReview

  const { userDisplaySence, userAttrList, userAttrMap, requestMap, isNavbar } = app
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}

  const payTypeNameMap = requestMap['payTypeMap']
  const missionList = requestMap['missionList']
  const subjectList = requestMap['subjectList']
  const subjectMap = requestMap['subjectMap']

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
      dispatch({type: 'feeOrderReview/updateSort'})  // 更多筛选加蒙版
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
      dispatch({type: 'feeOrderReview/updateSort'})  // 加蒙版
    },
  }

  const userTableProps = {
    dataSource: feeReviewList,
    count,
    pageNum,
    pageSize,
    userDisplayList,
    userDisplayMap,
    userAttrMap,
    dataLoading,
    subjectMap,
    payTypeNameMap,
    selectedOrders,
    selectedAll,
    onChangePage (n, s) {
      dispatch({
        type: 'feeOrderReview/getOrderList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'feeOrderReview/updateState',
        payload: {
          ...data,
        },
      })
    },
  }

  const userModalProps = {
    dataSource: subjectList,
    onUpdateState (data) {
      dispatch({
        type: 'feeOrderReview/updateState',
        payload: {
         ...data
        },
      })
    },
  }

  const handleChangeDate = (value) => {
    dispatch({type: 'feeOrderReview/updateSort',
    payload:{
      beginDate: value.length == 0?'':value[0].format('YYYY-MM-DD HH:mm:ss'),
      endDate: value.length == 0?'':value[1].format('YYYY-MM-DD HH:mm:ss'),
    }})
	}

  const handleChangeStatus = (value) => {
    dispatch({type: 'feeOrderReview/updateSort',payload:{status: value}})  // 状态加蒙版
  }

  const handleChangeOrderNo = (value) => {
    dispatch({type: 'feeOrderReview/updateSort',payload:{orderNo: value}})  // 订单号加蒙版
	}

  const handleChangeMission = (value) => {
    dispatch({type: 'feeOrderReview/updateSort',payload:{missionId: value}})  // 任务名称加蒙版
	}

	const handleChangeSubject = (value) => {
    dispatch({type: 'feeOrderReview/updateSort',payload:{subjectId: value}})  // 项目名称加蒙版
	}

  // const handleClickSort = (attr) => {
  //   if (!attr._selectList || attr._selectList.length <= 0) {
  //     dispatch({
  //       type: 'app/getAttrRelateList',
  //       payload: {
  //         attrId: attr.id,
  //         sence: sortSence,
  //         valueType: attr.valueType,
  //       },
  //     })
  //   }
  // }

  // const handleSearchSort = (attr, value) => {
  //   dispatch({
  //     type: 'app/getAttrRelateList',
  //     payload: {
  //       attrId: attr.id,
  //       key:value,
  //       sence: sortSence
  //     },
  //   })
  // }

  // const handleChangeSort = (value, attr) => {
  //   userSortMap[attr.id]._idSelected = value
  //   dispatch({type: 'feeOrderReview/updateSort'})  // 院系加蒙版
  // }

  const handleResetQueryOrder = () => {
    for (let sort of userSortList) {
      if (sort._idSelected) {
        sort._idSelected = []
      }
    }
    dispatch({type: 'feeOrderReview/updateSort',  // 重置加蒙版
    payload: {
      userSortList,
      accountId: [],
      payType: undefined,
      subjectId:undefined,
      missionId:undefined,
      status: undefined,
      },
    })
  }

  const handleChangeSearchName = (value) =>{
    dispatch({
      type: 'feeOrderReview/updateState',
      payload: {
        searchName: value.target.value
      },
    })
  }
  
  const handleOnSearch = (name) => {
		if(name || searchName){
			queryParam.key = name;
      dispatch({
        type: 'feeOrderReview/getOrderList',
        payload: {
          ...queryParam,
        },
      })
		}
	}

  const handleQueryOrder = () => {
    dispatch({
      type: 'feeOrderReview/getOrderList',
      payload: {
        ...queryParam,
      },
    })
  }

  

  const handleConfirmOrderVisibleChange = (value) => {
    confirmFeeReviewData.visible = value
    dispatch({
      type: 'feeOrderReview/updateState',
      payload: {
        confirmFeeReviewData
      },
    })
  }

  const handleCancelOrderVisibleChange = (value) => {
    cancelFeeReviewData.visible = value
    dispatch({
      type: 'feeOrderReview/updateState',
      payload: {
        cancelFeeReviewData
      },
    })
  }

  const handleChangeCancelRemark = (e) => {
		cancelFeeReviewData.cancelRemark = e.target.value
		dispatch({
      type: 'feeOrderReview/updateState',
      payload: {
        cancelFeeReviewData
      },
    })
  }
  
  const handleConfirmOrder = () => {
    dispatch({
      type: 'feeOrderReview/orderReview',
      payload: {
        status:'2',
        orderNo:selectedOrders,
        remark:cancelFeeReviewData.cancelRemark,
        queryParam,
        count,
      },
    })
	}

	const handleCancelOrder = () => {
		if(!cancelFeeReviewData.cancelRemark){
			message.error("请输入拒绝理由")
			return
    }
    
    if(dataLoading){
      message.error("请不要重复提交")
			return
    }
    dispatch({
      type: 'feeOrderReview/orderReview',
      payload: {
        status:'5',
        orderNo:selectedOrders,
        remark:cancelFeeReviewData.cancelRemark,
        queryParam,
        count,
      },
    })
  }

  const renderConfirmOrder = () => {
		return(
			<div>
				<div>确定对筛选结果审核通过</div>
				<div style={{ marginTop: '20px', textAlign: 'center' }}>
				<Button size="small" style={{ marginRight: '10px' }} onClick={()=>handleConfirmOrderVisibleChange(false)}>取消</Button>
				<Button type="primary" size="small" onClick={()=>handleConfirmOrder()}>确定</Button>
				</div>
			</div>
		)
  }
  
  const renderCancelOrder = () => {
		return(
			<div>
				<div>拒绝理由：</div>
				<TextArea style={{marginTop:'5px'}} value={cancelFeeReviewData.cancelRemark} onChange={e=>handleChangeCancelRemark(e)}/>
				<div style={{ marginTop: '20px', textAlign: 'center' }}>
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
      type: 'feeOrderReview/updateState',
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
          content:(<div>
              <div className={styles.sortText}>{attr.name}:</div>
              <Input disabled={dataLoading} value={orderNo} className={styles.sortSelectMuti} onChange={(e) => handleChangeOrderNo(e.target.value)}></Input>
            </div>
          )
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
        <Button className={styles.inquery} type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQueryOrder} >查询</Button>
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
            <Row style={{ marginBottom: '10px' }}>
              <Popover trigger="click" placement="top"
                  content={renderConfirmOrder()}
                  visible={confirmFeeReviewData.visible?confirmFeeReviewData.visible:false}
                  onVisibleChange={e=>handleConfirmOrderVisibleChange(e)}
                ><Button type="primary" style={{ marginRight: '15px',marginBottom:isNavbar?'10px':undefined }} disabled={selectedOrders.length == 0}>审核通过</Button></Popover>
              <Popover trigger="click" placement="top"
                content={renderCancelOrder()}
                visible={cancelFeeReviewData.visible?cancelFeeReviewData.visible:false}
                onVisibleChange={e=>handleCancelOrderVisibleChange(e)}
              ><Button ghost type="primary" style={{ marginRight: '15px' }} disabled={selectedOrders.length == 0}>审核拒绝</Button></Popover>
              <div style={{width: isNavbar?'100%':'250px',display:'inline-blck',float: 'right'}}>
                <Search enterButton placeholder="搜索" value={searchName} onChange={(value)=>{handleChangeSearchName(value)}} onSearch={(value) => handleOnSearch(value)} style={{ float: 'right', width: isNavbar?'calc(100% - 50px)':'200px' }} />
                <UserDisplay {...userDisplayProps} />
              </div>
            </Row>
            <Row style={{color:'#1890ff', visibility:selectedOrders.length>0?'visible':'hidden',fontSize:'12px'}}>
              <Icon type="check" style={{marginLeft:'5px'}}/> 当前已选择{selectedAll?count:(selectedOrders.length?selectedOrders.length:'0')}条记录
            </Row>
            <Row><UserTable {...userTableProps} /></Row>
            </div>
          </Card>
        </Col>
      </Row>
    </Page>
  )
}

FeeOrderReview.propTypes = {
  feeOrderReview: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ feeOrderReview, app, loading }) => ({ feeOrderReview, app, loading }))(FeeOrderReview)
