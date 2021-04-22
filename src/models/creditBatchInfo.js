/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import * as credit from 'services/credit'
import * as receipt from 'services/receipt'
import * as account from 'services/account'
import { pageModel } from './common'
import { Message } from 'antd'
import { getSortParam } from 'utils'

export default modelExtend(pageModel, {
  namespace: 'creditBatchInfo',

  state: {
    modalVisible: false,
    modalUsers: [],
    modalPayType: '',

    sortSence: 'creditBatchSort',
    displaySence: 'creditBatchDisplay',
    userSortExtra: {},

    batchId: '',
    searchName: '',
    index: '1',
    queryTime: undefined,

    userData: {
      dataLoading: false,
      dataList: [],
      dataSelected: [],
      pageNum: 1,
      pageSize: 20
    },
    statData: {
      dataLoading: false,
      dataList: [],
      pageNum: 1,
      pageSize: 20
    },
    hisData: {
      dataLoading: false,
      dataList: [],
      pageNum: 1,
      pageSize: 20
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/creditBatchInfo') {
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
      const { userSortExtra, sortSence, displaySence, batchId } = yield select(_ => _.creditBatchInfo)
      if (payload.batchId == batchId) {
        return
      }
      yield put({
        type: 'app/initDisplay', 
        payload: {params:
            [{sence:displaySence, displayExtra:{}},{sence:sortSence, displayExtra:userSortExtra, defaultType: '1'}]
          }
      })
      let userData = {
        dataLoading: false,
        dataList: [],
        dataSelected: [],
        pageNum: 1,
        pageSize: 20
      }
      let statData = {
        dataLoading: false,
        dataList: [],
        pageNum: 1,
        pageSize: 20
      }
      let hisData = {
        dataLoading: false,
        dataList: [],
        pageNum: 1,
        pageSize: 20
      }
      yield put({
        type: 'updateState',
        payload: {
          batchId: payload.batchId,
          userData,
          statData,
          hisData,
          index: '1',
        },
      })
    },

    * getUserList ({ payload }, { put, call, select }) {
      const { userData } = yield select(_ => _.creditBatchInfo)
      userData.dataLoading=true
      yield put({
        type: 'updateState',
        payload: {
          userData
        },
      })
      const { sortList, queryTime } = payload
      delete payload.queryTime
      let tempList = getSortParam(sortList)
      if (tempList && tempList.length>0) {
        payload.sortList = JSON.stringify(tempList)
      }else{
        delete payload.sortList
      }
      let data = yield call(credit.getCreditBatchDetail, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let dataList = data.ret_content.data?data.ret_content.data:[]
      for(let node of dataList){
        if (node.attrList) {
          for (let attr of node.attrList) {
            node[attr.attrId] = attr.relateName
          }
        }
      }
      let tempTime = queryTime?queryTime:new Date().getTime()
      userData.dataList = dataList
      userData.dataLoading = false
      userData.count = data.ret_content.count
      userData.pageNum = payload.pageNum
      userData.pageSize = payload.pageSize
      userData.queryTime = tempTime
      userData.dataSelected = []
      yield put({
        type: 'updateState',
        payload: {
          userData,
          queryTime: tempTime,
          sortFlag: false,
        },
      })
    },

    * deleteUser ({ payload }, { put, call, select }) {
      const { userData, batchId, searchName } = yield select(_ => _.creditBatchInfo)
      const { sortList } = payload
      delete payload.sortList
      if(userData.dataLoading){
        return Message.error("请不要重复操作")
      }
      userData.dataLoading = true
      yield put({
        type: 'updateState',
        payload: {
          userData
        },
      })
      payload.id = payload.id.toString()
      const data = yield call(credit.deleteCreditBatchDetail, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      Message.success('删除成功')
      yield put({
        type: 'getUserList',
        payload: {
          sortList,
          name: searchName,
          batchId,
        },
      })
    },


    * importCreditBatch ({ payload }, { put, call, select }) {
      const { modalImportData } = yield select(_ => _.creditBatchInfo)
      modalImportData.step = 1;
      modalImportData.cgNum = '0';
      modalImportData.wxNum = '0';
      modalImportData.cfNum = '0';
      modalImportData.cgCoverNum = '0';
      modalImportData.importing = true;
      modalImportData.covering = false;
      yield put({
        type: 'updateState',
        payload: {
          modalImportData,
        },
      })
      let timer = payload.timer
      delete payload.timer
      let data = yield call(credit.importCreditBatch, payload)
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

    * getImportCreditBatchPrs ({ payload }, { put, call, select }) {
      const data = yield call(credit.getImportCreditBatchPrs)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let { modalImportData, timer } = yield select(_ => _.creditBatchInfo)
      if (! modalImportData.covering) {
        modalImportData.cgNum = data.ret_content.cgNum
      } else {
        modalImportData.cgCoverNum = data.ret_content.cgNum
      }
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

    * coverCreditBatch ({ payload }, { put, call, select }) {
      let { modalImportData } = yield select(_ => _.creditBatchInfo)
      let data = yield call(credit.coverCreditBatch)
      let timer = payload.timer
      if (!data.success) {
        clearInterval(timer)
        throw data
      } else if (data.ret_code != 1) {
        clearInterval(timer)
        return Message.error(data.ret_content)
      }
      modalImportData.importing = true;
      modalImportData.covering = true;
      yield put({
        type: 'updateState',
        payload: {
          modalImportData,
          timer,
        },
      })
    },

    * getStatList ({ payload }, { put, call, select }) {
      const { statData } = yield select(_ => _.creditBatchInfo)
      statData.dataLoading = true
      yield put({
        type: 'updateState',
        payload: {
          statData
        },
      })
      const { sortList, queryTime } = payload
      delete payload.queryTime
      let tempList = getSortParam(sortList)
      if (tempList && tempList.length>0) {
        payload.sortList = JSON.stringify(tempList)
      }else{
        delete payload.sortList
      }
      let data = yield call(credit.getCreditStatistics, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let dataList = data.ret_content.data?data.ret_content.data:[]
      for(let node of dataList){
        if (node.attrList) {
          for (let attr of node.attrList) {
            node[attr.attrId] = attr.relateName
          }
        }
      }
      let tempTime = queryTime?queryTime:new Date().getTime()
      statData.dataList = dataList
      statData.dataLoading = false
      statData.count = data.ret_content.count
      statData.pageNum = payload.pageNum
      statData.pageSize = payload.pageSize
      statData.queryTime = tempTime
      statData.dataLoading = false
      yield put({
        type: 'updateState',
        payload: {
          statData,
          queryTime: tempTime,
          sortFlag: false,
        },
      })
    },

    * getStatDetail ({ payload }, { put, call, select }) {
      let data = yield call(credit.getUserClassDetail, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const { modalImportData } = yield select(_ => _.creditBatchInfo)
      let dataList = data.ret_content.data?data.ret_content.data:[]
      let classType = {
        "1":"公共基础课",
        "2":"专业课",
        "3":"学科基础课"
      }
      let classProperty = {
        "1": "必修课",
        "2": "非必修课",
      }
      for(let node of dataList){
        node.type = classType[node.type]
        node.property = classProperty[node.property]
      }
      modalImportData.dataList = dataList
      modalImportData.dataLoading = false
      modalImportData.count = data.ret_content.count
      modalImportData.pageNum = payload.pageNum
      modalImportData.pageSize = payload.pageSize
      yield put({
        type: 'updateState',
        payload: {
          modalImportData
        },
      })
    },

    * showStatDetail ({ payload }, { put, call, select }) {
      const { userInfo } = payload
      delete payload.userInfo
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: true,
          modalType: 'statDetail',
          modalImportData: {
            dataList: [],
            count: 0,
            dataLoading: true,
            userInfo,
          }
        },
      })

      yield put({
        type: 'getStatDetail',
        payload: {
          ...payload,
          userId: userInfo.userId,
          pageNum: 1,
          pageSize: 20,
        },
      })
      
    },

    * getHisList ({ payload }, { put, call, select }) {
      const { hisData } = yield select(_ => _.creditBatchInfo)
      hisData.dataLoading = true
      yield put({
        type: 'updateState',
        payload: {
          hisData
        },
      })
      const { sortList, queryTime } = payload
      delete payload.queryTime
      let tempList = getSortParam(sortList)
      if (tempList && tempList.length>0) {
        payload.sortList = JSON.stringify(tempList)
      }else{
        delete payload.sortList
      }
      let data = yield call(credit.getCreditOperateList, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let dataList = data.ret_content.data?data.ret_content.data:[]
      for(let node of dataList){
        if (node.attrList) {
          for (let attr of node.attrList) {
            node[attr.attrId] = attr.relateName
          }
        }
      }
      let tempTime = queryTime?queryTime:new Date().getTime()
      hisData.dataList = dataList
      hisData.dataLoading = false
      hisData.count = data.ret_content.count
      hisData.pageNum = payload.pageNum
      hisData.pageSize = payload.pageSize
      hisData.queryTime = tempTime
      hisData.dataLoading = false
      yield put({
        type: 'updateState',
        payload: {
          hisData,
          queryTime: tempTime,
          sortFlag: false,
        },
      })
    },

   
  },
})
