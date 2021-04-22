import React from 'react'
import PropTypes from 'prop-types'
// import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm, Card, Input, message, Divider, Select, Spin, Message, Modal, Icon, Tabs } from 'antd'
import QueueAnim from 'rc-queue-anim'
import { Page, Print, UserSort, UserDisplay, UserSortLayer, SortSelect } from 'components'
import UserTable from './UserTable'
import UserCurrentTable from './UserCurrentTable'
import MissionTable from './MissionTable'
import OrderTable from './OrderTable'
import OrderReturnTable from './OrderReturnTable'
import BillAdjustTable from './BillAdjustTable'
import BillDiscountTable from './BillDiscountTable'
import BillDeferredTable from './BillDeferredTable'
import UserBillModal from './UserBillModal'
import styles from '../common.less'
// import queryString from 'query-string'
// import qs from 'qs'
import { getFormat } from 'utils'
import moment from 'moment'

const Search = Input.Search
const Option = Select.Option
const TabPane = Tabs.TabPane

const Counter = ({
  location, dispatch, counter, loading, app
}) => {
  const { isNavbar } = app
  const {
    showUserTable,
    modalVisible, modalData,modalPayType,modalType,modalPayTime,modalPayRate,
    defStandMap, disStandMap,
    displaySence, sortSence, userSortExtra,
    pageNum,
    pageSize,
    count,
    userList,
    searchName,
    userCurrent,
    dataLoading,
    missionList, missionSum,
    missionCurrent,
    orderList,
    orderReturnList,
    billAdjustList,
    billDeferredList,
    billDiscountList,
    sortFlag,
    gotoUser,
  } = counter

  const { user, userDisplaySence, userAttrList, userAttrMap, menuMap, requestMap } = app
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}

  const payTypeNameMap = requestMap['payTypeMap']
  const payTypeList = requestMap['payTypeList']
  const subjectMap = requestMap['subjectMap']

  const queryParam = {
    pageNum,
    pageSize,
    key: searchName,
    sortList: userSortList,
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
      dispatch({type: 'counter/updateSort'})  // 更多筛选加蒙版
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
      dispatch({type: 'counter/updateSort'})  // 加蒙版
    },
  }

  const handleSearchUser = (value) => {
    queryParam.pageNum = 1
    dispatch({
      type: 'counter/getUserList',
      payload: {
        ...queryParam,
        key: value,
      },
    })
  }

  const handleSync = () =>{
    dispatch({
      type: 'counter/getMissionList',
      payload: {
        userId: userCurrent.id,
      },
    })
    dispatch({
      type: 'counter/getOrderList',
      payload: {
        userId: userCurrent.id,
      },
    })
    dispatch({
      type: 'counter/getOrderReturnList',
      payload: {
        userId: userCurrent.id,
      },
    })
    dispatch({
      type: 'counter/getBillOperateList',
      payload: {
        userId: userCurrent.id,
      },
    })
  }

  const userTableProps = {
    dataSource: userList,
    count,
    pageNum,
    pageSize,
    userDisplayList,
    userDisplayMap,
    userAttrMap,
    dataLoading,
    userCurrent,
    onChangePage (n, s) {
      dispatch({
        type: 'counter/getUserList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
        },
      })
    },

    onSelectUser (data) {
      dispatch({
        type: 'counter/updateState',
        payload: {
          ...data,
          showUserTable:false,
        },
      })
      dispatch({
        type: 'counter/getMissionList',
        payload: {
          userId: data.userCurrent.id,
        },
      })
      dispatch({
        type: 'counter/getOrderList',
        payload: {
          userId: data.userCurrent.id,
        },
      })
      dispatch({
        type: 'counter/getOrderReturnList',
        payload: {
          userId: data.userCurrent.id,
        },
      })
      dispatch({
        type: 'counter/getBillOperateList',
        payload: {
          userId: data.userCurrent.id,
        },
      })
    },

    onCancelUser (data) {
      // dispatch({
      //   type: 'counter/updateState',
      //   payload: {
      //     showUserTable:true,
      //   },
      // })
    },
  }

  const missionTableProps = {
    dataSource: missionList,
    dataLoading,
    missionCurrent,
    menuMap,
    onChooseMission (data) {
      if(!modalVisible && missionCurrent && data.id == missionCurrent.id){
        dispatch({
          type: 'counter/updateState',
          payload: {
            missionCurrent: null
          },
        })
      }else{
        dispatch({
          type: 'counter/updateState',
          payload: {
            missionCurrent: data
          },
        })
      }
    },

    onCharge(data){
      let modalPayType = 3
      let modalPayRate = 0
      for(let node of payTypeList){
        if(node.payType == modalPayType){
          modalPayRate = node.rate?parseFloat(node.rate):0
          break
        }
      }
      dispatch({
        type: 'counter/showCharge',
        payload: {
          modalVisible: true,
          modalData: data.feeBillLists,
          modalPayType,
          modalPayRate,
          //modalPayTime:moment().format('YYYY-MM-DD HH:mm:ss'),
          missionCurrent: data,
          modalType:1
        },
      })
    },

    onRefund(data){
      dispatch({
        type: 'counter/showCharge',
        payload: {
          modalVisible: true,
          modalData: data.feeBillLists,
          modalPayType: 3,
          modalPayRate: 0,
         // modalPayTime:moment().format('YYYY-MM-DD HH:mm:ss'),
          missionCurrent: data,
          modalType:2,
        },
      })
    },

    onAdjust(data){
      dispatch({
        type: 'counter/showAdjust',
        payload: {
          modalVisible: true,
          modalData: data.feeBillLists,
          missionCurrent: data,
          modalType: 3,
        },
      })
    },

    onDiscount(data){
      if(data.feeBillLists){
        for(let node of data.feeBillLists){
          if(node.disStandId){
            node._disStandId = node.disStandId
          }
        }
      }
      dispatch({
        type: 'counter/getDiscountStandList',
        payload: {
          modalVisible: true,
          modalData: [{_add:true}],
          missionCurrent: data,
          modalType:4,
          disStandMap,
        },
      })
    },

    onDeferred(data){
      if(data.feeBillLists){
        for(let node of data.feeBillLists){
          if(node.defStandId){
            node._defStandId = node.defStandId
          }
        }
      }
      dispatch({
        type: 'counter/getDeferredStandList',
        payload: {
          modalVisible: true,
          modalData: data.feeBillLists,
          missionCurrent: data,
          modalType:5,
          defStandMap,
        },
      })
    },

    onConvert(data){
      let modalData = {
        srcData: {},
        dstData: {},
        convertFee: undefined
      }
      if(data.feeBillLists && data.feeBillLists.length==1){
        modalData.srcData = {...data.feeBillLists[0]}
      }
      dispatch({
        type: 'counter/updateState',
        payload: {
          modalVisible: true,
          modalData,
          missionCurrent: data,
          modalType:6
        },
      })
    }
  }

  const orderTableProps = {
    dataSource: orderList,
    dataLoading,
    payTypeNameMap,
    missionCurrent,
    userAttrList,
    subjectMap,
    menuMap,
    user,
    onUpdateStateOrderList(data){
      dispatch({
        type: 'counter/updateState',
        payload: {
          orderList: data,
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
    onCancelOrder (data) {
      if(dataLoading){
        message.error("请不要重复提交")
        return
      }
      dispatch({
        type: 'counter/cancelOrder',
        payload: {
          ...data
        },
      })
    },
  }

  const userBillModalProps = {
    dataSource: modalData,
    modalVisible: modalVisible,
    modalPayType,
    modalPayTime,
    modalPayRate,
    modalType,
    subjectMap,
    defStandMap,
    disStandMap,
    user,
    missionCurrent,
    missionList,
    userCurrent,
    payTypeList,
    gotoUser,
    onClose () {
      dispatch({
        type: 'counter/updateState',
        payload: {
          modalVisible: false,
        },
      })
    },
    onUpdateData(data) {
      dispatch({
        type: 'counter/updateState',
        payload: {
          modalData:data
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'counter/updateState',
        payload: {
          ...data,
        },
      })
    },
    onCompleteOrder (data, payType, payTime, rateFee){
      if(!data){
        Message.error("金额不能为空")
        return
      }
      let payList = [];
      let flag = true;
      for(let node of data){
        if(node._fee>0){
          if(node._fee*100 < 1){
            Message.error("金额不能小于0.01")
            return
          }
          flag = false;
          payList.push({billId:node.id,paidFee:Math.round(node._fee*100).toString()})
        }
      }
      if(flag){
        Message.error("金额不能为空")
        return
      }
      dispatch({
        type: 'counter/completeOrder',
        payload: {
          payList,
          payType: payType.toString(),
          orderDate: payTime,
          userId: userCurrent.id,
          rateFee
        },
      })
    },
    onCompleteOrderReturn (data, payType, payTime){
      if(!data){
        Message.error("金额不能为空")
        return
      }
      let payList = [];
      let flag = true;
      for(let node of data){
        if(node._refundFee>0){
          if(node._refundFee*100 < 1){
            Message.error("金额不能小于0.01")
            return
          }
          flag = false;
          payList.push({billId:node.id,paidFee:Math.round(node._refundFee*100).toString()})
        }
      }
      if(flag){
        Message.error("金额不能为空")
        return
      }
      dispatch({
        type: 'counter/completeOrderReturn',
        payload: {
          payList,
          payType: payType.toString(),
          userId: userCurrent.id,
          orderDate: payTime,
        },
      })
    },
    onUpdateBills (data) {
      dispatch({
        type: 'counter/updateBills',
        payload: {
          ...data,
        },
      })
    },
    onConvertOrder(data){
      dispatch({
        type: 'counter/convertOrder',
        payload: {
          ...data,
        },
      })
    },
    onChangeGotoUser() {
      dispatch({
        type: 'counter/updateState',
        payload: {
          gotoUser: !gotoUser
        },
      })
    }
  }

  const orderReturnTableProps = {
    dataSource: orderReturnList,
    user,
    dataLoading,
    payTypeNameMap,
    missionCurrent,
    menuMap,
    onUpdateStateOrderReturnList(data){
      dispatch({
        type: 'counter/updateState',
        payload: {
          orderReturnList: data,
        },
      })
    },
    onCancelOrderReturn (data) {
      if(dataLoading){
        message.error("请不要重复提交")
        return
      }
      dispatch({
        type: 'counter/cancelOrderReturn',
        payload: {
          ...data
        },
      })
    },
  }
  const billAdjustTableProps = {
    dataSource: billAdjustList,
    missionCurrent,
    dataLoading,
  }

  const billDiscountTableProps = {
    dataSource: billDiscountList,
    missionCurrent,
    dataLoading,
  }

  const billDeferredTableProps = {
    dataSource: billDeferredList,
    missionCurrent,
    dataLoading,
  }

  const handleResetQuery = () => {
    for (let sort of userSortList) {
      if (sort._idSelected) {
        sort._idSelected = []
      }
    }
    // dispatch({type: 'counter/updateState'})
    dispatch({type: 'counter/updateSort'})
  }

  const handleQuery = () => {
    dispatch({
      type: 'counter/getUserList',
      payload: {
        ...queryParam,
      },
    })
  }

  // const handleShowUserTable = () => {
  //   dispatch({
  //     type: 'counter/updateState',
  //     payload: {
  //       showUserTable:true,
  //     },
  //   })
  // }

  const createSort = () => {
    let i = 0
    const list = []
      for(let attr of userSortList){
        list.push({
          id:i++,
          content:(<SortSelect {...{...structSelectProps, attr}}/>)})
        }
      return list
  }

  const layerProps = {
    list: createSort(),
    query:(<div className={styles.queryBox} >
        <Button className={styles.inquery} type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQuery}>{dataLoading?'':'查询'}</Button>
        <Button className={styles.reset} onClick={handleResetQuery} disabled={dataLoading}>重置</Button>
        <UserSort {...userSortProps} className={styles.more}/>
    </div>),
  }

  return (
    <div>
      {sortFlag&&<div className={styles.masking}></div>}
      <div style={{padding:'12px',backgroundColor:'white'}}>
          <Card bordered={false} bodyStyle={{ padding: ' 0' }}>
          <QueueAnim >
            <Divider style={{ margin: '5px' }} dashed />
            <UserSortLayer {...layerProps}/>
            <Divider style={{ margin: '5px' }} dashed />
            <Row>
              <Search enterButton placeholder="搜索" onSearch={value => handleSearchUser(value)} style={{ float: 'right', width: isNavbar?'calc(100% - 50px)':'200px' }} />
              <UserDisplay {...userDisplayProps} />
            </Row>
          </ QueueAnim >
          </Card>
        </div>
        <div style={{padding:'12px',backgroundColor:'white',marginTop:'20px'}}>
          <Row style={{display: showUserTable?"":"none"}}><UserTable {...userTableProps} /></Row>
            {
              !showUserTable&&userCurrent&& <div><Row style={{ borderLeft: '5px solid #1890ff', paddingLeft: '10px', marginBottom: '15px' }}>
                <span style={{lineHeight:'32px'}}>当前学生</span>
                {/* <Icon type="close" style={{float:'right', fontSize:"16px"}} onClick={handleShowUserTable}/> */}
                {/* <Icon type={dataLoading?"loading":"sync"} style={{float:'right', fontSize:"13px", paddingTop:'2px', paddingRight:'10px' }} onClick={handleSync}/> */}
                <Button style={{float:'right'}} loading={dataLoading} onClick={handleSync}>{dataLoading?'':'刷新'}</Button></Row>
                <Row><UserCurrentTable {...userTableProps} /></Row>
                </div>
            }
        </div>
        <div style={{padding:'12px',backgroundColor:'white',marginTop:'20px'}}>
          <Row style={{ borderLeft: '5px solid #1890ff', paddingLeft: '10px', marginBottom: '15px' }}><span >收费任务 </span>
            {missionSum?<span> （应收总额:{getFormat(missionSum.totalFee)} 减免总额:{getFormat(missionSum.discount)} 收费总额:{getFormat(missionSum.paidFee)} 退费总额:{getFormat(missionSum.refund)} 欠费总额:{getFormat(missionSum.arrears)}）</span>:''}
          </Row>
          <Row><MissionTable {...missionTableProps} /></Row>
        </div>
        <div style={{padding:'12px',backgroundColor:'white',marginTop:'20px'}}>
          <Tabs defaultActiveKey="1" animated={false}>
            <TabPane tab="收费订单" key="1">
            <OrderTable {...orderTableProps} />
            </TabPane>
            <TabPane tab="退费订单" key="2">
            <OrderReturnTable {...orderReturnTableProps} />
            </TabPane>
            <TabPane tab="应收调整记录" key="3">
            <BillAdjustTable {...billAdjustTableProps} />
            </TabPane>
            <TabPane tab="减免调整记录" key="4">
            <BillDiscountTable {...billDiscountTableProps} />
            </TabPane>
            <TabPane tab="缓缴调整记录" key="5">
            <BillDeferredTable {...billDeferredTableProps} />
            </TabPane>
          </Tabs>
        </div>
          { modalVisible && <UserBillModal {...userBillModalProps} /> }
    </div>
  )
}

Counter.propTypes = {
  counter: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ counter, app, loading }) => ({ counter, app, loading }))(Counter)
