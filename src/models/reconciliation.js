/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import * as user from 'services/user'
import * as feeSubject from 'services/feeSubject'
import * as feeBill from 'services/feeBill'
import * as feeMission from 'services/feeMission'
import * as account from 'services/account'
import * as statistics from 'services/statistics'
import * as order from 'services/order'
import { pageModel } from './common'
import { Message } from 'antd'
import moment from 'moment'
import { getSortParam } from 'utils'

export default modelExtend(pageModel, {
  namespace: 'reconciliation',

  state: {

    sortSence: 'reconciliationAllSort',
    displaySence: 'reconciliationAllDisplay',
    userSortExtra: {
      accountId: '经办人',
      status: '状态',
      orderNo: '订单号',
    },

    // dateRangeType: 1,
    searchName: '',
    beginDate: `${moment().format('YYYY-MM-DD')}`,
    endDate: `${moment().format('YYYY-MM-DD')}`,

    totalBegin: 0,
    sumReconciliation: {},
    index:'1',
    payTypeId: undefined,
    accountId: undefined,
    missionId: undefined,
    subjectId: undefined,
    status: undefined,
    orderNo: undefined,

    orderData: {
      pageNum: 1,
      pageSize: 20,
      count: 0,
      dataLoading: false,
      selectedOrders: [],
      orderList: [],
      cancelOrderData: {
        cancelRemark: '',
      }
    },
    
    returnData: {
      pageNum: 1,
      pageSize: 20,
      count: 0,
      searchName: '',
      dataLoading: false,
      selectedReturns: [],
      returnList: [],
      cancelReturnData: {
        cancelRemark: '',
      }
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/reconciliation') {
          const payload = queryString.parse(location.search)
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },

  effects: {
    * query ({ payload = {} }, { call, put, select }) {
      const { userSortExtra, sortSence, displaySence } = yield select(_ => _.reconciliation)
      yield put({
        type: 'app/initDisplay', 
        payload: {params:
            [{sence:displaySence, displayExtra:{}},{sence:sortSence, displayExtra:userSortExtra, defaultType: '1'}]
          }
      })
      //获取所有支付方式
      yield put({
        type: 'app/getRequestPayType', 
        payload: {}
      })
      //获取所有任务列表
      yield put({
        type: 'app/getRequestMission', 
        payload: {}
      })
      //获取所有项目列表
      yield put({
        type: 'app/getRequestSubject', 
        payload: {}
      })
      //获取所有经办人列表
      yield put({
        type: 'app/getRequestAccount', 
        payload: {}
      })

       let orderData = {
        pageNum: 1,
        pageSize: 20,
        count: 0,
        searchName: '',
        dataLoading: false,
        selectedOrders: [],
        orderList: [],
        cancelOrderData: {
          cancelRemark: '',
        }
      }
      
      let returnData = {
        pageNum: 1,
        pageSize: 20,
        count: 0,
        searchName: '',
        dataLoading: false,
        selectedReturns: [],
        returnList: [],
        cancelReturnData: {
          cancelRemark: '',
        }
      }

      yield put({
        type: 'updateState',
        payload: {
          orderData,
          returnData,
        },
      })

      const { beginDate, endDate } = yield select(_ => _.reconciliation)
      yield put({
        type:'getOverallReconciliation',
        payload:{
          beginDate,
          endDate,
          index: '1',
          pageNum: 1,
          pageSize: 20,
        }
      })
    },

    * getOverallReconciliation ({ payload = {} }, { call, put, select }) {
      const { beginDate, endDate, sortList, missionId, subjectId, payTypeId, accountId, } = payload
      if (!beginDate) {
        throw '请选择开始时间!'
      }
      if (!endDate) {
        throw '请选择结束时间!'
      }
      let tempList = getSortParam(sortList)
      if (tempList && tempList.length>0) {
        payload.sortList = JSON.stringify(tempList)
      }else{
        delete payload.sortList
      }
      if(missionId){
        payload.missionId =  missionId.toString();
      }
      if(subjectId){
        payload.subjectId =  subjectId.toString();
      }
      if(payTypeId){
        payload.payType =  payload.payTypeId.toString();
        delete payload.payTypeId
      }
      if(accountId){
        payload.accountId =  payload.accountId.toString();
      }
      let data = null
      const { orderData, returnData, index } = yield select(_ => _.reconciliation)
      if(index == 1){
        orderData.dataLoading = true
        yield put({
          type: 'updateState',
          payload: {
            orderData
          },
        })
        data = yield call(order.getOrderReconciliation, payload)
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }
        orderData.sumReconciliation =  data.ret_content.payTypeStatistics
        orderData.orderList = data.ret_content.orderListEntity.data?data.ret_content.orderListEntity.data:[]
        for (let order of orderData.orderList) {
          if (order.attrList) {
            for (let attr of order.attrList) {
              order[attr.attrId] = attr.relateName
            }
          }
          if(order.feeBillLists){
            for(let subject of order.feeBillLists){
              subject._order = order;
              if(subject.receiptNo){
                subject._checked = false;
              }else{
                subject._checked = true;
              }
            }
          }
        }
        orderData.pageNum = payload.pageNum
        orderData.pageSize = payload.pageSize
        orderData.count = parseInt(data.ret_content.orderListEntity.count)
        orderData.dataLoading = false
        orderData.selectedOrders = []
        yield put({
          type: 'updateState',
          payload: {
            orderData,
            sortFlag: false,
          },
        })
      }else{
        returnData.dataLoading = true
        yield put({
          type: 'updateState',
          payload: {
            returnData
          },
        })
        delete payload.index
        data = yield call(order.getReturnOrderReconciliation, payload)
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }
        returnData.sumReconciliation =  data.ret_content.payTypeStatistics
        returnData.returnList = data.ret_content.orderListEntity.data?data.ret_content.orderListEntity.data:[]
        for (let order of returnData.returnList) {
          if (order.attrList) {
            for (let attr of order.attrList) {
              order[attr.attrId] = attr.relateName
            }
          }
          if(order.feeBillLists){
            for(let subject of order.feeBillLists){
              subject._order = order;
              if(subject.receiptNo){
                subject._checked = false;
              }else{
                subject._checked = true;
              }
            }
          }
        }
        returnData.pageNum = payload.pageNum
        returnData.pageSize = payload.pageSize
        returnData.count = parseInt(data.ret_content.orderListEntity.count)
        returnData.dataLoading = false
        returnData.selectedReturns = []
        yield put({
          type: 'updateState',
          payload: {
            returnData,
            sortFlag: false,
          },
        })
      }
    },

    * cancelOrder ({ payload }, { put, call, select }) {
      const { orderData } = yield select(_ => _.reconciliation)
      orderData.dataLoading= true,
      yield put({
        type: 'updateState',
        payload: {
          orderData
        },
      })
      const data = yield call(order.cancelOrder, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        orderData.dataLoading= false,
        yield put({
          type: 'updateState',
          payload: {
            orderData
          },
        })
        return Message.error(data.ret_content)
      }
      Message.success('冲正成功')
      for(let order of orderData.selectedOrders){
        const node = orderData.orderList.filter(item => item.orderNo === order)[0]
        node.status = '0'
        node.remark = payload.remark
      }
      orderData.dataLoading= false,
      orderData.cancelOrderData.visible = false
      orderData.selectedOrders = []
      yield put({
        type: 'updateState',
        payload: {
          orderData,
        },
      })
    },

    * cancelReturn ({ payload }, { put, call, select }) {
      const { returnData } = yield select(_ => _.reconciliation)
      returnData.dataLoading = true
      yield put({
        type: 'updateState',
        payload: {
          returnData
        },
      })
      const data = yield call(order.cancelOrderReturn, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        returnData.dataLoading = false
        yield put({
          type: 'updateState',
          payload: {
            returnData
          },
        })
        return Message.error(data.ret_content)
      }

      Message.success('作废成功')
      // const { selectedOrders,returnList } = yield select(_ => _.feeReturn)
      for(let order of returnData.selectedReturns){
        const node = returnData.returnList.filter(item => item.orderNo === order)[0]
        node.status = '0'
        node.remark = payload.remark
      }
      returnData.dataLoading= false,
      returnData.cancelReturnData.visible = false
      returnData.selectedReturns = []
      yield put({
        type: 'updateState',
        payload: {
          returnData,
        },
      })
    },

    * updateReconciliation ({ payload }, { put, call, select  }) {
      const { orderData, returnData, index } = yield select(_ => _.reconciliation)
      orderData.dataLoading= true,
      yield put({
        type: 'updateState',
        payload: {
          orderData
        },
      })
      const { beginDate, endDate, sortList, missionId, subjectId, payTypeId, accountId, orderNo } = payload
      let param = {}
      let tempList = getSortParam(sortList)
      if (tempList && tempList.length>0) {
        payload.sortList = JSON.stringify(tempList)
      }else{
        delete payload.sortList
      }
      if(missionId){
        payload.missionId =  missionId.toString();
      }
      if(subjectId){
        payload.subjectId =  subjectId.toString();
      }
      if(payTypeId){
        payload.payType =  payload.payTypeId.toString();
        delete payload.payTypeId
      }
      if(accountId){
        payload.accountId =  payload.accountId.toString();
      }
      if(orderNo){
        payload.orderNo =  payload.orderNo.toString();
      }
      param.params = {...payload}
      param.params = JSON.stringify(param.params)
      
      if(index == 1){
        param.orderNo = orderData.selectedOrders.toString()
        let data = yield call(order.updateOrderReconciliation, param)
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }
        Message.success('对账成功')
        for(let order of orderData.selectedOrders){
          const node = orderData.orderList.filter(item => item.orderNo === order)[0]
          node.status = '6'
        }
        orderData.dataLoading= false,
        orderData.selectedOrders = []
        yield put({
          type: 'updateState',
          payload: {
            orderData
          },
        })
      }else{
        param.orderNo = returnData.selectedReturns.toString()
        let data = yield call(order.updateReturnOrderReconciliation, param)
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }
        Message.success('对账成功')
        for(let order of returnData.selectedReturns){
          const node = returnData.returnList.filter(item => item.orderNo === order)[0]
          node.status = '6'
        }
        returnData.dataLoading= false,
        returnData.selectedReturns = []
        yield put({
          type: 'updateState',
          payload: {
            returnData
          },
        })
      }
    },

  },
})
