/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import * as user from 'services/user'
import { pageModel } from './common'
import { Message } from 'antd'
import * as feeMission from 'services/feeMission'
import * as feeSubject from 'services/feeSubject'
import * as verifySubject from 'services/verifySubject'
import * as account from 'services/account'

export default modelExtend(pageModel, {
  namespace: 'verifySubject',

  state: {
    modalVisible: false,
    dataLoading: false,
    pageNum: 1,
    pageSize: 20,
    count: 0,
    searchName: null,
    year: undefined,
    missionId: undefined,
    subjectId: undefined,
    modalType: null,
    modalVerify: null,
    modalData: {},
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/verifySubject') {
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
      //获取所有操作人列表
      yield put({
        type: 'app/getRequestAccount',
        payload: {},
      })
      // let data = yield call(verifySubject.getVerifySubjectList)
      // if (!data.success) {
      //   throw data
      // } else if (data.ret_code != 1) {
      //   return Message.error(data.ret_content)
      // }
      // let list = data.ret_content.data?data.ret_content.data:[]
      // for(let node of list){
      //   if(node.accountList){
      //     node.accountName = ''
      //     let i = 0
      //     for(let item of node.accountList){
      //       if(i < node.accountList.length){
      //         node.accountName += (','+item.accountName)
      //       }else{
      //         // node.accountId += item.accountId
      //         node.accountName += item.accountName
      //       }
      //       i++
      //     }
      //   }
      // }
      
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: false,
        },
      })
      const { pageNum, pageSize, searchName, year, missionId, subjectId  } = yield select(_ => _.verifySubject)
      yield put({
        type: 'getDataList',
        payload: {
          year,
          missionId,
          subjectId,
          key: searchName,
          pageNum,
          pageSize,
        },
      })
    },

    * getDataList ({ payload }, { call, put, select }) {
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      if(payload.year){
        payload.year = payload.year.toString()
      }
      if(payload.missionId){
        payload.missionId = payload.missionId.toString()
      }
      if(payload.subjectId){
        payload.subjectId = payload.subjectId.toString()
      }
      let data = yield call(verifySubject.getVerifySubjectList,payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let list = data.ret_content.data
      for(let node of list){
        if(node.accountList){
          node.accountName = ''
          node.accountIdList = []
          let i = 0
          for(let item of node.accountList){
            if(i++ != 0){
              node.accountName += (','+item.accountName)
            }else{
              node.accountName += item.accountName
            }
            node.accountIdList.push(item.accountId)
          }
        }
      }
      let count = data.ret_content.count
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: false,
          list:data.ret_content.data,
          sortFlag: false,
          count: parseInt(data.ret_content .count),
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
        },
      })
    },

    * getSubjectByMission ({ payload }, { call, put, select }) {
      let { modalData } = yield select(_ => _.verifySubject)
      //获取所有项目列表
      let data = yield call(feeSubject.getSubjectList,payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      modalData.subjectList = data.ret_content.data?data.ret_content.data:[]
      modalData.subjectDisable = false
      yield put({
        type: 'updateState',
        payload: {
          modalData
        },
      })
    },

    * VerifySubjected ({ payload }, { call, put, select }) {
      const { modalType } = yield select(_ => _.verifySubject)
      let data = null
      if(modalType == 'add'){
        data = yield call(verifySubject.addVerifySubject,payload)
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }

        Message.success('操作成功')
      }else{
        data = yield call(verifySubject.updateVerifySubject,payload)
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }

        Message.success('操作成功')
      }
      
      const { pageNum, pageSize, searchName, year, missionId, subjectId  } = yield select(_ => _.verifySubject)
      yield put({
        type: 'getDataList',
        payload: {
          year,
          missionId,
          subjectId,
          key: searchName,
          pageNum,
          pageSize,
        },
      })
    },

    * deleteVerifySubject ({ payload }, { call, put, select }) {
      const param = {
        id: payload.id,
      }
      const data = yield call(verifySubject.deleteVerifySubject, param)
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
      const { pageNum, pageSize, searchName, year, missionId, subjectId  } = yield select(_ => _.verifySubject)
      yield put({
        type: 'getDataList',
        payload: {
          year,
          missionId,
          subjectId,
          key: searchName,
          pageNum,
          pageSize,
        },
      })
    },


  },

  reducers: {

    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

  },

})
