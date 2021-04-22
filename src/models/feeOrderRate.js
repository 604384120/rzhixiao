/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import * as feeSubject from 'services/feeSubject'
import * as order from 'services/order'
import * as feeMission from 'services/feeMission'
import * as account from 'services/account'
import { pageModel } from './common'
import { Message } from 'antd'
import moment from 'moment'
import { getSortParam } from 'utils'

export default modelExtend(pageModel, {
  namespace: 'feeOrderRate',

  state: {
    orderFeeSum:null,
    modalVisible: false,
    modalUsers: [],
    modalPayType: '',

    sortSence: 'orderRateSort',
    displaySence: 'orderRateDisplay',
    userSortExtra: {
      payType: '支付方式',
      reDate: '开票时段',
      receiptNo: '票据号段',
      accountId: '经办人',
      status: '状态',
      printStatus: '打印状态',
      orderNo: '订单号'
    },

    pageNum: 1,
    pageSize: 20,
    orderList: [],
    count: 0,
    searchName: '',
    dataLoading: true,

    beginDate: `${moment().format('YYYY-MM-DD')} 00:00:00`,
    endDate: `${moment().format('YYYY-MM-DD')} 23:59:59`,
    missionId: undefined,
    status: undefined,
    printStatus: undefined,

    selectedOrders: [],
    printCheck: 0, 
    textData: {},
    timer: null,
    cancelOrderData: {},
    exportFormat: 1,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/feeOrderRate') {
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
      const { userSortExtra, sortSence, displaySence } = yield select(_ => _.feeOrderRate)
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
      //获取所有经办人列表
      yield put({
        type: 'app/getRequestAccount', 
        payload: {}
      })
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: false,
          missionId: payload.missionId,
        },
      })
    },

    * getOrderList ({ payload }, { put, call, select }) {
      const {
        sortList, beginDate, endDate, missionId, payType
      } = payload
      if (!beginDate) {
        throw '请选择开始时间!'
      }
      if (!endDate) {
        throw '请选择结束时间!'
      }
      if (payload.receiptBeginNo && payload.receiptEndNo && payload.receiptEndNo < payload.receiptBeginNo) {
        throw '请输入正确的票据编号!'
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
      if(payType){
        payload.payType =  payType.toString();
      }
      if(payload.accountId){
        payload.accountId =  payload.accountId.toString();
      }
      let { orderFeeSum } = yield select(_ => _.feeOrderRate)
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      const data = yield call(order.getOrderRateList, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const orderList = data.ret_content.data?data.ret_content.data:[]
      for (let order of orderList) {
        if (order.attrList) {
          for (let attr of order.attrList) {
            order[attr.attrId] = attr.relateName
          }
        }
      }
      const feeSum = yield call(order.getOrderFeeSum,payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      orderFeeSum = feeSum.ret_content
      yield put({
        type: 'updateState',
        payload: {
          orderFeeSum,
          orderList,
          count: parseInt(data.ret_content.count),
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          searchName: payload.key,
          dataLoading: false,
          selectedOrders: [],
          sortFlag: false
        },
      })
    },

  },
})
