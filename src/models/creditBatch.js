import * as credit from 'services/credit'
import * as feeMission from 'services/feeMission'
import * as manageService from 'services/account'
import modelExtend from 'dva-model-extend'
import { model } from 'models/common'
import queryString from 'query-string'
import { Message } from 'antd'

export default modelExtend(model, {
  namespace: 'creditBatch',

  state: {
    pageNum: 1,
    pageSize: 20,
    list: null,
    count: 0,
    dataLoading: true,
    searchName: null,

    beginData: undefined,
    endDate: undefined
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/creditBatch') {
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
    * query ({ payload }, { put, call }) {
      let data = yield call(credit.getCreditBatchList)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let list = data.ret_content?data.ret_content:[]

      //获取所有学年列表
      yield put({
        type: 'app/getRequestYear', 
        payload: {}
      })

      yield put({
        type: 'updateState',
        payload: {
          list,
          dataLoading: false,
          sortFlag: false
        },
      })
    },
    * getDataList ({ payload }, { put, call }) {
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      if(payload.year){
        payload.year = payload.year.toString()
      }
      const data = yield call(credit.getCreditBatchList, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      yield put({
        type: 'updateState',
        payload: {
          list: data.ret_content?data.ret_content:[],
          dataLoading: false,
          sortFlag: false
        },
      })
    },
    * addCreditBatch ({ payload }, { put, call, select }) {
      const param = {
        name: payload.data.name,
        year: payload.data.year,
      }
      let data = yield call(credit.addCreditBatch, param)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      Message.success('添加成功！')
      const { searchName, beginDate, endDate, year } = yield select(_ => _.creditBatch)
      data = yield call(credit.getCreditBatchList, {name:searchName,beginDate,endDate, year:year?year.toString():undefined})
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      yield put({
        type: 'updateState',
        payload: {
          list: data.ret_content?data.ret_content:[],
          dataLoading: false,
        },
      })
    },
    * updateCreditBatch ({ payload }, { put, call, select }) {
      const param = {
        id: payload.data.id,
        name: payload.data.name,
        year: payload.data.year,
      }
      let data = yield call(credit.updateCreditBatch, param)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      Message.success('修改成功！')
      const { searchName, beginDate, endDate, year } = yield select(_ => _.creditBatch)
      data = yield call(credit.getCreditBatchList, {name:searchName, beginDate, endDate, year:year?year.toString():undefined})
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      yield put({
        type: 'updateState',
        payload: {
          list: data.ret_content?data.ret_content:[],
          dataLoading: false,
        },
      })
    },
    * deleteCreditBatch ({ payload }, { put, call, select }) {
      const param = {
        id: payload.data.id,
      }
      let data = yield call(credit.deleteCreditBatch, param)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      Message.success('删除成功！')
      const { searchName, beginDate, endDate, year } = yield select(_ => _.creditBatch)
      data = yield call(credit.getCreditBatchList, {name:searchName,beginDate,endDate, year:year?year.toString():undefined})
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      yield put({
        type: 'updateState',
        payload: {
          list: data.ret_content?data.ret_content:[],
          dataLoading: false,
        },
      })
    },

    
      
  },
})
