/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import * as feeSubject from 'services/feeSubject'
import * as feeBill from 'services/feeBill'
import * as order from 'services/order'
import * as feeMission from 'services/feeMission'
import * as account from 'services/account'
import * as feeRule from 'services/feeRule'
import { pageModel } from './common'
import { Message } from 'antd'
import moment from 'moment'
import { getSortParam } from 'utils'

export default modelExtend(pageModel, {
  namespace: 'feeDeferred',

  state: {
    modalVisible: false,
    modalType: null,
    modalEditData:{},
    
    sortSence: 'deferrerdSort',
    displaySence: 'deferrerdDisplay',
    userSortExtra: {
      accountId: '经办人',
    },

    pageNum: 1,
    pageSize: 20,
    deferredList: [],
    count: 0,
    searchName: '',
    dataLoading: true,

    beginDate: `${moment().format('YYYY-MM-DD')} 00:00:00`,
    endDate: `${moment().format('YYYY-MM-DD')} 23:59:59`,
    missionId: undefined,
    subjectId: undefined,
    status: undefined,
    printStatus: undefined,
    year:undefined,

    selectedRecords: [],
    printCheck: 0, 
    textData: {},
    timer: null,
    defStandMap: null,
    selectedAll: false,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/feeDeferred') {
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
      const { userSortExtra, sortSence, displaySence } = yield select(_ => _.feeDeferred)
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
      //获取所有学年列表
      yield put({
        type: 'app/getRequestYear', 
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

    * getAccountList ({ payload }, { put, call }) {
      yield put({
        type: 'app/getRequestAccount',
        payload: {},
      })
    },

    * getDeferredStandList ({ payload = {} }, { call, put, select }) {
      if(!payload.defStandMap){
        const { requestMap } = yield select(_ => _.app)
        let subjectMap = requestMap['subjectMap']
        let defStandMap = {}
        //获取所有项目的缓缴标准
        let data = yield call(feeRule.getDeferredStandList, {status:"1"})
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }
        let standList = data.ret_content?data.ret_content:[]
        for (let node of standList) {
          if(!subjectMap[node.subjectId]){
            continue
          }
          defStandMap[node.id] = node
        }
        yield put({
          type: 'updateState',
          payload: {
            defStandMap,
            modalVisible: payload.modalVisible,
            modalEditData: payload.modalEditData,
            modalType:payload.modalType
          },
        })
      }else{
        yield put({
          type: 'updateState',
          payload: {
            modalVisible: payload.modalVisible,
            modalEditData: payload.modalEditData,
            modalType:payload.modalType
          },
        })
      }
    },

    * getDeferredList ({ payload }, { put, call, select }) {
      const {
        sortList, subjectId, missionId
      } = payload
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
      if(payload.year){
        payload.year =  payload.year.toString();
      }
      if(payload.accountId){
        payload.accountId =  payload.accountId.toString();
      }
      // // 获取经办人条件
      // const { accountList } = yield select(_ => _.feeDeferred)
      // if (accountList) {
      //   let accountStr = ''
      //   for (let account of accountList) {
      //     if (payload.accountId.indexOf(`${account.loginName}(${account.name})`) >= 0) {
      //       accountStr += `${account.id},`
      //     }
      //   }
      //   if (accountStr) {
      //     payload.accountId = accountStr
      //   }
      // }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      const data = yield call(feeBill.getDeferredList, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const deferredList = data.ret_content.data?data.ret_content.data:[]
      for (let order of deferredList) {
        if(order.defStandId){
          order._defStandId = order.defStandId
        }
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
      yield put({
        type: 'updateState',
        payload: {
          deferredList,
          count: parseInt(data.ret_content.count),
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          searchName: payload.key,
          dataLoading: false,
          selectedRecords: [],
          sortFlag: false,
          selectedAll:false,
        },
      })
    },

    * importDeferred ({ payload }, { put, call, select }) {
      const { modalImportData } = yield select(_ => _.feeDeferred)
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
          modalImportData
        },
      })
      payload.type='deferred'
      let timer = payload.timer
      delete payload.timer
      let data = yield call(feeBill.importBill, payload)
      
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

    * getImportDeferredPrs ({ payload }, { put, call, select }) {
      const data = yield call(feeBill.getImportBillPrs)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let { modalImportData, timer } = yield select(_ => _.feeDeferred)
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

    * coverDeferred ({ payload }, { put, call, select }) {
      let { modalImportData } = yield select(_ => _.feeDeferred)
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
      let { dataLoading } = yield select(_ => _.feeDeferred)

      if(dataLoading){
        return Message.error("请不要重复点击")
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true
        },
      })
      payload.billList = JSON.stringify(payload.billList)
      if(payload.id){
        payload.id = payload.id.toString()
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
      let data = yield call(feeBill.updateBatchDeferredBill, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        yield put({
          type: 'updateState',
          payload: {
            dataLoading: false
          }
        })
        return Message.error(data.ret_content)
      }
      Message.success("更新成功");
      let { searchName,pageNum,pageSize,missionId,sortSence,accountId,subjectId,status,year } = yield select(_ => _.feeDeferred)
      let { userDisplaySence } = yield select(_ => _.app)
      yield put({
        type: 'getDeferredList',
        payload: {
          key:searchName,
          pageNum,
          pageSize,
          missionId,
          sortList: userDisplaySence[sortSence]?userDisplaySence[sortSence].displayList:undefined,
          accountId,
          subjectId,
          status,
          year,
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
