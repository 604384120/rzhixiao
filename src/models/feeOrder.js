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
  namespace: 'feeOrder',

  state: {
    orderFeeSum:null,
    modalVisible: false,
    modalUsers: [],
    modalPayType: '',

    sortSence: 'orderSort',
    displaySence: 'orderDisplay',
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
    subjectId: undefined,
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
        if (location.pathname === '/feeOrder') {
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
      const { userSortExtra, sortSence, displaySence } = yield select(_ => _.feeOrder)
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
        sortList, beginDate, endDate, subjectId, missionId, payType
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
      if(subjectId){
        payload.subjectId =  subjectId.toString();
      }
      if(payType){
        payload.payType =  payType.toString();
      }
      if(payload.accountId){
        payload.accountId =  payload.accountId.toString();
      }
      let { orderFeeSum } = yield select(_ => _.feeOrder)
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      const data = yield call(order.getOrderList, payload)
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

    * cancelOrder ({ payload }, { put, call, select }) {
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      let queryParam = payload.queryParam
      delete payload.queryParam
      const data = yield call(order.cancelOrder, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        yield put({
          type: 'updateState',
          payload: {
            dataLoading: false,
          },
        })
        return Message.error(data.ret_content)
      }

      Message.success('冲正成功')
      yield put({
        type: 'updateState',
        payload: {
          cancelOrderData: {},
          selectedOrders:[]
        },
      })
      yield put({
        type: 'getOrderList',
        payload: {
          ...queryParam
        },
      })
    },

    * importOrder ({ payload }, { put, call, select }) {
      const { modalImportData } = yield select(_ => _.feeOrder)
      modalImportData.step = 1;
      modalImportData.cgNum = '0';
      modalImportData.wxNum = '0';
      modalImportData.cfNum = '0';
      modalImportData.importing = true;
      yield put({
        type: 'updateState',
        payload: {
          modalImportData
        },
      })
      let data;
      let timer = payload.timer
      delete payload.timer
      if(modalImportData.importType==1){
        data = yield call(order.importOrder, payload)
      }else{
        let arr = []
        for(let node of modalImportData.subjectSort){
          if(!node._add){
            arr.push({
              missionId:node.missionId,
              subjectId:node.subjectId,
              position:node.position,
            })
          }
        }
        if(arr.length<=0){
          return Message.error("请选择冲抵顺序")
        }
        payload.subjectSort = JSON.stringify(arr)
        data = yield call(order.importFee, payload)
      }
      
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        clearInterval(timer)
        modalImportData.step = 2;
        modalImportData.message = data.ret_content;
        yield put({
          type: 'updateState',
          payload: {
            modalImportData,
          },
        })
        return
      }
      modalImportData.step = 1;
      yield put({
        type: 'updateState',
        payload: {
          modalImportData,
          timer
        },
      })
    },

    * getImportOrderPrs ({ payload }, { put, call, select }) {
      const data = yield call(order.getImportPrs)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let { modalImportData, timer } = yield select(_ => _.feeOrder)
      modalImportData.cgNum = data.ret_content.cgNum
      modalImportData.cfNum = data.ret_content.cfNum
      modalImportData.wxNum = data.ret_content.wxNum
      if (data.ret_content.status == '2') {
        clearInterval(timer)
        modalImportData.importing = false;
        yield put({
          type: 'updateState',
          payload: {
            modalImportData
          },
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
           
          },
        })
      }
    },

    * coverOrder ({ payload }, { put, call, select }) {
      let { modalImportData } = yield select(_ => _.feeOrder)
      let timer = payload.timer
      let data = yield call(order.coverOrder)
      if (!data.success) {
        clearInterval(timer)
        throw data
      } else if (data.ret_code != 1) {
        clearInterval(timer)
        return Message.error(data.ret_content)
      }
      modalImportData.importing = true;
      yield put({
        type: 'updateState',
        payload: {
          modalImportData,
          timer
        },
      })
    },

    * getSubjectListByMission ({ payload }, { put, call, select }) {
      let { missionMap } = yield select(_ => _.feeOrder)
      let data = yield call(feeSubject.getSubjectList, payload)
      if (!data.success) {
        clearInterval(timer)
        throw data
      } else if (data.ret_code != 1) {
        clearInterval(timer)
        return Message.error(data.ret_content)
      }
      missionMap[payload.missionId]._subjectList = data.ret_content.data?data.ret_content.data:[]
      yield put({
        type: 'updateState',
        payload: {
          missionMap
        },
      })
    },

  },
})
