/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { pageModel } from './common'
import { Message } from 'antd'
import moment from 'moment'
import { token } from 'utils'
import * as menusService from 'services/menus'
import * as group from 'services/group'
import { routerRedux } from 'dva/router'
import PropTypes from 'prop-types';

export default modelExtend(pageModel, {
  namespace: 'main',

  state: {
    dataList: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/main') {
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
      let data = yield call(group.getGroupStatistics)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      
      yield put({
        type: 'updateState',
        payload:{
          dataList: data.ret_content?data.ret_content:[]
        }
      })
    },

  },
})
