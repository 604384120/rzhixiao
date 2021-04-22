/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import * as user from 'services/user'
import * as feeSubject from 'services/feeSubject'
import * as feeBill from 'services/feeBill'
import * as order from 'services/order'
import * as feeMission from 'services/feeMission'
import * as account from 'services/account'
import * as setService from 'services/printSet'
import { getTemplateText } from 'services/receipt'
import { pageModel } from './common'
import { Message } from 'antd'
import moment from 'moment'
import { getSortParam } from 'utils'

export default modelExtend(pageModel, {
  namespace: 'feeAdjustHistory',

  state: {

    sortSence: 'feeAdjustHistorySort',
    displaySence: 'feeAdjustHistoryDisplay',
    userSortExtra: {
      accountId: '经办人',
    },

    pageNum: 1,
    pageSize: 20,
    count: 0,
    dataLoading: true,

    beginDate: `${moment().format('YYYY-MM-DD')} 00:00:00`,
    endDate: `${moment().format('YYYY-MM-DD')} 23:59:59`,
    missionId: undefined,
    subjectId: undefined,
    searchName: '',

    timer: null,
    orderBy: 'timeDesc',
    dataList: [],
    feeAdjustSum: null,
    feeAdjustCount: null,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/feeAdjustHistory') {
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
      const { userSortExtra, sortSence, displaySence } = yield select(_ => _.feeAdjustHistory)
      yield put({
        type: 'app/initDisplay', 
        payload: {params:
            [{sence:displaySence, displayExtra:{}},{sence:sortSence, displayExtra:userSortExtra, defaultType: '1'}]
          }
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
      //获取所有学年列表
      yield put({
        type: 'app/getRequestYear', 
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

    * getFeeAdjustHistory ({ payload }, { put, call }) {
      const { sortList, subjectId, missionId, year, } = payload
      let tempList = getSortParam(sortList)
      if(payload.accountId){
        payload.accountId =  payload.accountId.toString();
      }
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
      if(year){
        payload.year =  year.toString();
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true
        },
      })
      payload.mask = '1'
      const data = yield call(feeBill.getFeeBillOperateHistory, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const dataList = data.ret_content.feeBillOperateHistoryList.data?data.ret_content.feeBillOperateHistoryList.data:[]
      for (let order of dataList) {
        if (order.attrList) {
          for (let attr of order.attrList) {
            order[attr.attrId] = attr.relateName
          }
        }
        if(order.snapshot){
          order.snapshot = JSON.parse(order.snapshot);
          order.srcTotalFee = order.snapshot.totalFee
        }
        if(order.info){
          order.info = JSON.parse(order.info);
          order.totalFee = order.info.totalFee
          order.reason = order.info.reason
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          dataList,
          count: parseInt(data.ret_content.feeBillOperateHistoryList.count),
          feeAdjustSum: data.ret_content.updateFeeSum,
          feeAdjustCount: data.ret_content.count,
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          dataLoading: false,
          searchName: payload.key,
          orderBy: payload.orderBy,
          sortFlag: false
        },
      })
    },

  },
})
