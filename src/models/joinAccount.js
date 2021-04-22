import { routerRedux } from 'dva/router'
import * as user from 'services/user'
import modelExtend from 'dva-model-extend'
import { model } from 'models/common'
import queryString from 'query-string'
import { Message } from 'antd'
import md5 from 'md5'
import * as joinUser from 'services/joinUser'
import * as account from 'services/account'

export default modelExtend(model, {
  namespace: 'joinAccount',

  state: {
    dataLoading: false,
    yearList: [],
    status: null,
    dataList: [],
    pageNum: 1,
    pageSize: 20,
    count: 0,
    searchName: null,
    modalVisible: false,
    accountId: undefined,
    modalList: [],
    modalData: null,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/joinAccount') {
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
      
    },

    * getDataList ({ payload }, { put, call, select }) {
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      let data = yield call(joinUser.getJoinAccountList,payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let dataList = data.ret_content.data?data.ret_content.data:[]
      let count = data.ret_content.count
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: false,
          dataList,
          sortFlag: false,
          count: parseInt(data.ret_content.count),
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
        },
      })
    },

    * addJoinAccount ({ payload }, { put, call, select }) {
      const { pageNum,pageSize,key,status,accountId } = payload
      let params = {}
      params.accountId = payload.accountId
      let data = yield call(joinUser.addJoinAccount,params)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      yield put({
        type: 'getDataList',
        payload: {
          pageNum,
          pageSize,
          key,
          status,
        },
      })
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: false,
          accountId: undefined
        }
      })
    },

    * showModal ({ payload }, { put, call, select }) {
      let modalList = []
      let modalData = {}
      if(payload.modalType=='add'){
        let data = yield call(account.getMgrAccountList,'')
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }
        for(let node of data.ret_content.data){
          modalData[node.id] = node
        }
        yield put({
          type: 'updateState',
          payload: {
            dataLoading: false,
            modalList:data.ret_content.data,
            modalType: 'add',
            modalVisible: true,
            modalData,
          },
        })
      }else{
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'links',
            modalVisible: true,
            modalData: {
              accountId: payload.accountId,
              partnerId: payload.partnerId,
              type: payload.type
            }
          },
        })
      }
      
    },

    * updateJoinAccount ({ payload }, { put, call, select }) {
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      const param = {
        id: payload.data.id,
        status: payload.status,
      }
      const data = yield call(joinUser.updateJoinAccount, param)
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: false,
        },
      })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const { dataList } = yield select(_ => _.joinAccount)
      const target = dataList.filter(item => payload.data.id === item.id)[0]
      if (target) {
        target.status = payload.status
      }
      Message.success('设置成功！')
      yield put({ type: 'updateState', payload: { dataList } })
    },




  },
  reducers: {

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

  },
})
