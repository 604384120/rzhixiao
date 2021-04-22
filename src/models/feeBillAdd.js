/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import * as user from 'services/user'
import * as feeSubject from 'services/feeSubject'
import * as feeBill from 'services/feeBill'
import { pageModel } from './common'
import { Message } from 'antd'
import { getSortParam } from 'utils'

export default modelExtend(pageModel, {
  namespace: 'feeBillAdd',

  state: {
    modalVisible: false,
    modalPayType: '',
    feeBillError: false,
    modalEditData:{},

    sortSence: 'feeBillAddSort',
    displaySence: 'feeBillAddDisplay',
    userSortExtra: {},

    pageNum: 1,
    pageSize: 20,
    count: 0,
    userList: [],
    searchName: '',
    dataLoading: true,

    missionId: '',
    selectedUsers: [],
    subjectList: [],
    selectedAll: false,
    sortFlag: false,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/feeBillAdd') {
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
      const { userSortExtra, sortSence, displaySence } = yield select(_ => _.feeBillAdd)
      yield put({
        type: 'app/initDisplay', 
        payload: {params:
            [{sence:displaySence, displayExtra:{}},{sence:sortSence, displayExtra:userSortExtra, defaultType: '1'}]
          }
      })


      if(!payload.missionId){
        yield put({
          type: 'updateState',
          payload: {
            feeBillError: true,
          },
        })
        return
      }

      // 获取用户列表
      const { pageNum, pageSize } = yield select(_ => _.feeBillAdd)
      let data = yield call(feeBill.getUserListNoBill, { pageNum, pageSize,missionId:payload.missionId })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const userList = data.ret_content.data
      for (let userNode of userList) {
        if (userNode.attrList) {
          for (let attr of userNode.attrList) {
            userNode[attr.attrId] = attr.relateName
          }
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          userList,
          count: parseInt(data.ret_content.count),
          dataLoading: false,
          missionId: payload.missionId,
        },
      })
    },

    * getUserList ({ payload = {} }, { call, put, select }) {
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
          dataLoading: true,
        },
      })
      const { missionId } = yield select(_ => _.feeBillAdd)
      payload.missionId = missionId;
      let data = yield call(feeBill.getUserListNoBill, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const userList = data.ret_content.data
      for (let userNode of userList) {
        if (userNode.attrList) {
          for (let attr of userNode.attrList) {
            userNode[attr.attrId] = attr.relateName
          }
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          userList,
          count: parseInt(data.ret_content.count),
          searchName: payload.key,
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          dataLoading: false,
          selectedUsers: [],
          selectedAll: false,
          sortFlag: false
        },
      })
    },

    * showModal ({ payload = {} }, { call, put, select }) {
      const { missionId } = yield select(_ => _.feeBillAdd)
      let data = yield call(feeSubject.getSubjectList, {missionId})
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let subjectList = data.ret_content.data;
      for (let subject of subjectList) {
        subject.subjectId = subject.id;
        subject.discount = 0;
        subject._discount = 0;
        subject.totalFee = 0;
        subject._totalFee = 0;
        subject._fee = 0;
        subject.status = '0';
        subject._status = '0';
        subject.loans = 0;
        subject._loans = 0;
        subject. _add = true;
        subject.subType = subject.subType;
      }
      let userId = []
      yield put({
        type: 'updateState',
        payload: {
          subjectList,
          modalVisible: true,
          modalEditData: payload.modalEditData
        },
      })
    },

    * updateBills ({ payload }, { put, call, select }) {
      const { dataLoading, userSortList, pageNum, pageSize, searchName, selectedAll, count, missionId  } = yield select(_ => _.feeBillAdd)
      const { user } = yield select(_ => _.app)
      if(dataLoading){
        return Message.error("请不要重复点击")
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      let tempArr = {}
      let params = {}
      let billList = []
      for (let subject of payload.subjectList) {
        let param = {
          missionId,
          subjectId: subject.subjectId,
          status: '1'
        }
        
        if((user.isStand != '1'||user.isAdmin=='1') && subject._stand != '1'){
          if(subject._totalFee===''){
            continue
          }
          param.totalFee = subject._totalFee.toString()
        }
        if(subject._status=="1"){
          billList.push(param)
        }
      }
      if(billList.length==0){
        yield put({
          type: 'updateState',
          payload: {
            dataLoading: false,
          },
        })
        return Message.error("请设置至少一项收费项目")
      }
      tempArr.billList = JSON.stringify(billList)
      if(!selectedAll && payload.selectedUsers && payload.selectedUsers.length > 0){
        tempArr.userId = payload.selectedUsers.toString()
      }else if(selectedAll){
        if(payload.key){
          params.key = payload.key
        }
        if(missionId){
          params.missionId = missionId
        }
        if(count){
          params.count = count.toString()
        }
        let tempList = getSortParam(payload.sortList)
        if (tempList && tempList.length>0) {
          params.sortList = JSON.stringify(tempList)
        }
        tempArr.params = JSON.stringify(params)
      }
      let data = yield call(feeBill.addBatchBill, tempArr)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        yield put({
          type: 'updateState',
          payload: {
            dataLoading: false,
          },
        })
        return Message.error(data.ret_content)
      }

      Message.success('设置成功！')
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: false,
          dataLoading: false,
        },
      })

      yield put({
        type: 'getUserList',
        payload: {
          missionId: missionId,
          pageNum: pageNum,
          pageSize: pageSize,
          key: searchName,
          sortList: userSortList
        },
      })
    },

  },
})
