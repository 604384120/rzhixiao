/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { pageModel } from './common'
import { Message } from 'antd'
import * as order from 'services/order'
import * as verifySubject from 'services/verifySubject'
import { getSortParam } from 'utils'

export default modelExtend(pageModel, {
  namespace: 'verifySubjectStat',

  state: {
    sortSence: 'verifySort',
    displaySence: 'verifyDisplay',
    userSortExtra: {},
    dataLoading: false,
    pageNum: 1,
    pageSize: 20,
    count: 0,
    searchName: null,
    subjectList: [],
    missionList: [],
    accountList: [],
    subjectId: undefined,
    missionId: undefined,
    accountId: undefined,
    subjectMap: {},
    modalType: null,
    modalVerify: null,
    status:2,
    verifyStatList:null,
    
    modalType: undefined,
    modalData: undefined,
    modalVisible: false,

    beginDate: null,
    endDate: null,
    confirmVerifyVisible: false,
    selectedVerifys: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/verifySubjectStat') {
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
    * query ({ payload }, { call, put, select }) {
      const { userSortExtra, sortSence, displaySence, } = yield select(_ => _.verifySubjectStat)
      yield put({
        type: 'app/initDisplay', 
        payload: {params:
            [{sence:displaySence, displayExtra:{}},{sence:sortSence, displayExtra:userSortExtra, defaultType: '1'}]
          }
      })
      // 获取核销的核销人，核销项目，核销任务
      let data = yield call(verifySubject.getVerifySubjectList)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let list = data.ret_content.data
      let subjectList = []
      let missionMap = {}
      let accountMap = {}
      let subjectMap = {}
      let missionList = []
      let accountList = []
      for(let node of list){
        if( !subjectMap[node.subjectId] ){
          node._subVisible = true
          subjectList.push(node)
          subjectMap[node.subjectId] = node
        }
        if( !missionMap[node.missionId] ){
          missionList.push(node)
          missionMap[node.missionId] = node
        }

        for(let account of node.accountList){
          if( !accountMap[account.accountId] ){
            accountMap[account.accountId] = node
            accountList.push(account)
          }
        }
      }
      let subjectId = undefined
      let missionId = undefined
      let accountId = undefined
      
      if(payload.subjectId){
        subjectId = payload.subjectId
      }
      if(payload.missionId){
        missionId = payload.missionId
      }
      if(payload.accountId){
        accountId = payload.accountId
      }

      yield put({
        type: 'updateState',
        payload: {
          dataLoading: false,
          subjectList,
          missionList,
          accountList,
          subjectMap,
          subjectId,
          missionId,
          accountId,
        },
      })

      if(payload.missionId || payload.subjectId){
        yield put({
          type: 'getDataList',
          payload: {
            missionId: payload.missionId,
            subjectId: payload.subjectId,
            pageNum: 1,
            pageSize: 20
          },
        })
      }
    },

    * getDataList ({ payload }, { call, put, select }) {
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      const { sortList } = payload
      let tempList = getSortParam(sortList)
      if (tempList && tempList.length>0) {
        payload.sortList = JSON.stringify(tempList)
      }else{
        delete payload.sortList
      }
      if(payload.missionId){
        payload.missionId = payload.missionId.toString()
      }
      if(payload.subjectId){
        payload.subjectId = payload.subjectId.toString()
      }
      if(payload.status && (payload.status == 2)){
        delete payload.status
      }
      if(payload.accountId){
        payload.accountId = payload.accountId.toString()
      }
      let data = yield call(verifySubject.getVerifySubjectStatisticsList,payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let verifyStatList = data.ret_content.data?data.ret_content.data:[]
      for(let item of verifyStatList){
        if (item.attrList) {
          for (let attr of item.attrList) {
            item[attr.attrId] = attr.relateName
          }
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: false,
          verifyStatList,
          sortFlag: false,
          count: parseInt(data.ret_content .count),
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          searchName: payload.key,
          confirmVerifyVisible: false,
          selectedVerifys: []
        },
      })
    },

    * addVerifyBill ({ payload }, { call, put, select }) {
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      let data = yield call(verifySubject.addVerifyBill,payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      Message.success("核销成功")
      const { pageNum, pageSize, subjectId, beginDate, endDate, missionId, status, searchName, sortSence } = yield select(_ => _.verifySubjectStat)
      let { userDisplaySence } = yield select(_ => _.app)
      yield put({
        type: 'getDataList',
        payload: {
          key: searchName,
          pageNum,
          pageSize,
          subjectId,
          missionId,
          status,
          beginDate,
          endDate,
          sortList: userDisplaySence[sortSence]?userDisplaySence[sortSence].displayList:undefined,
        },
      })
    },

    * updateVerifyBill ({ payload }, { call, put, select }) {
      let data = yield call(verifySubject.updateVerifyBill,payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      Message.success("取消核销成功")
      const { pageNum, pageSize, beginDate, endDate, subjectId, missionId, status, searchName, sortSence } = yield select(_ => _.verifySubjectStat)
      let { userDisplaySence } = yield select(_ => _.app)
      yield put({
        type: 'getDataList',
        payload: {
          key: searchName,
          pageNum,
          pageSize,
          subjectId,
          missionId,
          status,
          beginDate, 
          endDate,
          sortList: userDisplaySence[sortSence]?userDisplaySence[sortSence].displayList:undefined,
        },
      })
    },

    * addVerifyBillScan ({ payload }, { call, put, select }) {
      let data = yield call(verifySubject.addVerifyBillScan,payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        let modalData = { error: data.ret_content }
        yield put({
          type: 'updateState',
          payload: {
            modalData
          },
        })
        return Message.error(data.ret_content)
      }
      let modalData = data.ret_content
      modalData.billId = payload.billId
      for(let node of modalData.attrList){
        modalData[node.attrId] = node.relateName
      }
      
      //获取所有数据
      yield put({
        type: 'updateState',
        payload: {
          modalData
        },
      })
    },

    * changeSelected ({ payload }, { call, put, select }) {
      let { subjectMap, subjectList, subjectId } = yield select(_ => _.verifySubjectStat)
      
     
      for(let subject of subjectList){
        if(payload.missionId.length == 0 || payload.missionId.indexOf(subject.missionId)>=0){
          subject._subVisible = true
        }else{
          subject._subVisible = false
        }
      }
    
      if(subjectId){
        let subjectIds = []
        for(let index of subjectId){
          if(subjectMap[index]&&subjectMap[index]._subVisible){
            subjectIds.push(index)
          }
        }
        subjectId = subjectIds
      }
      
      
      yield put({
        type: 'updateState',
        payload: {
          subjectMap,
          subjectId,
        },
      })
      
    },

    * showBillInfo ({ payload }, { call, put, select }) {
      let modalData = {dataLoading:true, ...payload}
      yield put({
        type: 'updateState',
        payload: {
          modalData,
          modalType: 'info',
          modalVisible: true
        },
      })
      let { payTypeNameMap } = yield select(_ => _.verifySubjectStat)
      if(!payTypeNameMap){
        let data = yield call(order.getOrderPayType)
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }
        let payTypeList = data.ret_content?data.ret_content:[]
        payTypeNameMap = {};
        for (let payType of payTypeList) {
          payTypeNameMap[payType.payType] = payType.name;
        }
      }
      let data = yield call(order.getOrderList, {billId: payload.bill.billId})
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let orderList = data.ret_content.data?data.ret_content.data:[]
      for (let order of orderList) {
        if (order.attrList) {
          for (let attr of order.attrList) {
            order[attr.attrId] = attr.relateName
          }
        }
      }

      data = yield call(order.getOrderReturnList, {billId: payload.bill.billId})
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let orderReturnList = data.ret_content.data?data.ret_content.data:[]
      for (let order of orderReturnList) {
        if (order.attrList) {
          for (let attr of order.attrList) {
            order[attr.attrId] = attr.relateName
          }
        }
      }

      data = yield call(verifySubject.getVerifyBillOperateList, {billId: payload.bill.billId})
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let operateList = data.ret_content?data.ret_content:[]

      modalData.orderList = orderList
      modalData.orderReturnList = orderReturnList
      modalData.operateList = operateList
      modalData.dataLoading = false
      yield put({
        type: 'updateState',
        payload: {
          payTypeNameMap,
          modalData,
          modalType: 'info',
          modalVisible: true,
        },
      })

      
    },


  },
})
