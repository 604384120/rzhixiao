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
  namespace: 'feeAdjust',

  state: {
    modalVisible: false,
    modalType: null,
    modalEditData:{},
    
    sortSence: 'adjustSort',
    displaySence: 'adjustDisplay',
    userSortExtra: {
    },

    searchName: '',
    missionId: undefined,
    subjectId: undefined,
    year:undefined,
    queryTime: undefined,
    selectedAll: false,

    userData: {
      dataLoading: false,
      dataList: [],
      dataSelected: [],
      pageNum: 1,
      pageSize: 20,
      type: '0',
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/feeAdjust') {
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
      const { userSortExtra, sortSence, displaySence } = yield select(_ => _.feeAdjust)
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
      let userData = {
        dataLoading: false,
        dataList: [],
        dataSelected: [],
        pageNum: 1,
        pageSize: 20,
        lastMissionId: "_first"
      }
      yield put({
        type: 'updateState',
        payload: {
          userData,
        },
      })
    },

    * getUserList ({ payload }, { put, call, select }) {
      const { userData } = yield select(_ => _.feeAdjust)
      const { sortList, subjectId, missionId, year, queryTime } = payload
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
      if(year){
        payload.year =  year.toString();
      }
      if(userData.type){
        payload.type = userData.type
      }
      // delete payload.accountId
      userData.dataLoading = true,
      yield put({
        type: 'updateState',
        payload: {
          userData
        },
      })
      const data = yield call(feeBill.getBills, payload)
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
      if(userData.lastMissionId=="_first" || userData.lastMissionId != payload.missionId){
        //获取任务对应的项目
        let subjectList = yield call(feeSubject.getSubjectByMissId, {missionId: payload.missionId})
        if (!subjectList.success) {
          throw subjectList
        } else if (subjectList.ret_code != 1) {
          return Message.error()
        }
        userData.subjectList = subjectList.ret_content?subjectList.ret_content:[]
      }
      
      let tempTime = queryTime?queryTime:new Date().getTime()
      userData.dataList = dataList
      userData.count = parseInt(data.ret_content.count)
      userData.pageNum = payload.pageNum
      userData.pageSize = payload.pageSize
      userData.dataLoading = false
      userData.dataSelected = []
      userData.queryTime = tempTime
      userData.lastMissionId = payload.missionId
      yield put({
        type: 'updateState',
        payload: {
          userData,
          searchName: payload.key,
          queryTime: tempTime,
          sortFlag: false,
          selectedAll: false,
        },
      })
    },


    * importBill ({ payload }, { put, call, select }) {
      const { modalType,modalImportData } = yield select(_ => _.feeAdjust)
      modalImportData.step = 1;
      modalImportData.cgNum = '0';
      modalImportData.wxNum = '0';
      modalImportData.cfNum = '0';
      modalImportData.cgCoverNum = '0';
      modalImportData.importing = true;
      modalImportData.covering = false;
      yield put({
        type: 'updateState',
        modalImportData,
      })
      let timer = payload.timer
      delete payload.timer
      let data = null
      if(modalType == 'import'){   // 调整导入
        if(!payload.type){
          delete payload.type
        }
        data = yield call(feeBill.importBill, payload)
      }else{    // 导入关闭
        data = yield call(feeBill.importBillDelete , payload)
      }
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        clearInterval(timer)
        modalImportData.step = 2;
        modalImportData.message = data.ret_content;
        yield put({
          type: 'updateState',
          payload:{    // 调整导入 || 导入关闭
            modalImportData,
            timer,
          }
        })
        return
      }
      modalImportData.step = 1;
      yield put({     
        type: 'updateState',
        payload: {    // 调整导入 || 导入关闭
          modalImportData,
          timer,
        }
      })
    },

    * getImportBillPrs ({ payload }, { put, call, select }) {
      const data = yield call(feeBill.getImportBillPrs)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let { modalImportData, timer, modalType, } = yield select(_ => _.feeAdjust)
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
        })
      } else {
        yield put({
          type: 'updateState',
        })
      }
    },

    * coverBill ({ payload }, { put, call, select }) {
      let { modalImportData } = yield select(_ => _.feeAdjust)
      let timer = payload.timer
      let data = yield call(feeBill.coverBill)
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
          timer
        },
      })
    },

    * updateBills ({ payload }, { put, call, select }) {
      let { userData } = yield select(_ => _.feeAdjust)
      if(userData.dataLoading){
        return Message.error("请不要重复点击")
      }
      userData.dataLoading = true
      yield put({
        type: 'updateState',
        payload: {
          userData
        },
      })
      payload.billList = JSON.stringify(payload.billList)
      if(payload.userId){
        payload.userId = payload.userId.toString()
      }
      if(payload.params){
        let tempList = getSortParam(payload.params.sortList)
        if (tempList && tempList.length>0) {
          payload.params.sortList = JSON.stringify(tempList)
        }else{
          delete payload.params.sortList
        }
        payload.params = JSON.stringify(payload.params)
      }
      let data = yield call(feeBill.updateBatchBill, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        userData.dataLoading = false
        yield put({
          type: 'updateState',
          payload: {
            userData,
          },
        })
        return Message.error(data.ret_content)
      }
      let { searchName,missionId,sortSence,subjectId } = yield select(_ => _.feeAdjust)
      let { userDisplaySence } = yield select(_ => _.app)
      yield put({
        type: 'getUserList',
        payload: {
          key:searchName,
          pageNum: userData.pageNum,
          pageSize: userData.pageSize,
          missionId,
          sortList: userDisplaySence[sortSence]?userDisplaySence[sortSence].displayList:undefined,
          subjectId,
        }
      })

      yield put({
        type: 'updateState',
        payload: {
          modalVisible: false
        },
      })
    },

  },
})
