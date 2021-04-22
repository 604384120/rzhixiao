/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import * as user from 'services/user'
import { pageModel } from './common'
import { Message } from 'antd'
import { getSortParam } from 'utils'

export default modelExtend(pageModel, {
  namespace: 'userTransfer',

  state: {
    
    sortSence: 'userTransferSort',
    displaySence: 'userTransferDisplay',
    userSortExtra: {
      typeMask: '异动类型',
    },

    dataLoading: false,
    dataList: [],
    pageNum: 1,
    pageSize: 20,
    count: 0,

    searchName: '',
    orderBy: 'timeDesc',
    exportFormat: 1,
    typeMask:undefined
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/userTransfer') {
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
      const { userSortExtra, sortSence, displaySence } = yield select(_ => _.userTransfer)
      yield put({
        type: 'app/initDisplay', 
        payload: {params:
            [{sence:displaySence, displayExtra:{}},{sence:sortSence, displayExtra:userSortExtra, defaultType: '1'}]
          }
      })
    },

    * getDataList ({ payload }, { put, call, select }) {
      const { sortList } = payload
      let tempList = getSortParam(sortList)
      if (tempList && tempList.length>0) {
        payload.sortList = JSON.stringify(tempList)
      }else{
        delete payload.sortList
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true
        }
      })
      const data = yield call(user.getUserTransferInfo,payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const dataList = data.ret_content.data?data.ret_content.data:[]
      for (let order of dataList) {
        if (order.attrList) {
          for (let attr of order.attrList) {
            order[attr.attrId] = attr.relateName
          }
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          dataList,
          count: parseInt(data.ret_content.count),
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          orderBy: payload.orderBy,
          searchName: payload.key,
          dataLoading: false,
          sortFlag: false
        },
      })
    },

  },
})
