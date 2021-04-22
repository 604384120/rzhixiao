import { routerRedux } from 'dva/router'
import * as user from 'services/user'
import modelExtend from 'dva-model-extend'
import { model } from 'models/common'
import queryString from 'query-string'
import { Message } from 'antd'
import md5 from 'md5'
import * as joinUser from 'services/joinUser'
import * as account from 'services/account'
import moment from 'moment'

export default modelExtend(model, {
  namespace: 'joinStat',

  state: {
    dataList: [],
    count: 0,
    pageNum: 1,
    pageSize: 20,
    searchName: null,
    dataLoading: false,
    accountList: [],
    accountId: undefined,
    beginDate: `${moment().format('YYYY-MM-DD')} 00:00:00`,
    endDate: `${moment().format('YYYY-MM-DD')} 23:59:59`,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/joinStat') {
          dispatch({
            type: 'query',
            payload: {
              ...queryString.parse(location.search),
            },
          })
        }
      })
    },
  },

  effects: {
    * query ({ payload }, { put, call, select }) {
      let data = yield call(joinUser.getJoinAccountList)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let accountList = data.ret_content.data
      yield put({
        type: 'updateState',
        payload: {
          accountList
        },
      })

    },

    * getDataList ({ payload }, { put, call, select }) {
      const {beginDate, endDate} = payload
      if (!beginDate) {
        throw '请选择开始时间!'
      }
      if (!endDate) {
        throw '请选择结束时间!'
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      let data = yield call(joinUser.getJoinAccountStat,payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let dataList = data.ret_content.data
      let count = data.ret_content.count
      yield put({
        type: 'updateState',
        payload: {
          dataList,
          count: parseInt(data.ret_content .count),
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          dataLoading: false,
          sortFlag: false,
        },
      })

    },

  },
})
