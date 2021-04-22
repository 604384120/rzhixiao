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
  namespace: 'feeLoan',

  state: {
    modalVisible: false,
    modalUsers: [],
    modalPayType: '',

    sortSence: 'loanSort',
    displaySence: 'loanDisplay',
    userSortExtra: {
      accountId: '经办人',
      orderNo: '订单号',
      loanType: '贷款类型',
    },

    pageNum: 1,
    pageSize: 20,
    loanList: [],
    count: 0,
    searchName: '',
    dataLoading: true,

    beginDate: `${moment().format('YYYY-MM-DD')} 00:00:00`,
    endDate: `${moment().format('YYYY-MM-DD')} 23:59:59`,
    missionId: undefined,
    subjectId: undefined,
    status: 2,
    printStatus: undefined,
    loanType: undefined,

    selectedLoans: [],
    printCheck: 0, 
    textData: {},
    timer: null,
    cancelLoanData: {},
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/feeLoan') {
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
      const { userSortExtra, sortSence, displaySence } = yield select(_ => _.feeLoan)
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
      //获取所有项目列表
      yield put({
        type: 'app/getRequestYear', 
        payload: {}
      })
      //获取所有贷款类型
      yield put({
        type: 'app/getRequestLoanType', 
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

    * getLoanTypeList ({ payload }, { put, call }) {
      let data = yield call(order.getLoanType)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      yield put({
        type: 'updateState',
        payload: {
          loanTypeList: data.ret_content?data.ret_content:[]
        },
      })
    },

    * getLoanList ({ payload }, { put, call, select }) {
      const {beginDate, endDate, sortList, subjectId, missionId, loanType} = payload
      if (!beginDate) {
        throw '请选择开始时间!'
      }
      if (!endDate) {
        throw '请选择结束时间!'
      }
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
      if(loanType){
        payload.loanType =  loanType.toString();
      }
      if(payload.year){
        payload.year =  payload.year.toString();
      }
      if(payload.accountId){
        payload.accountId =  payload.accountId.toString();
      }
      // // 获取经办人条件
      // const { accountList } = yield select(_ => _.feeLoan)
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
      const data = yield call(order.getLoanList, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const loanList = data.ret_content.data?data.ret_content.data:[]
      for (let order of loanList) {
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
          loanList,
          count: parseInt(data.ret_content.count),
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          searchName: payload.key,
          dataLoading: false,
          selectedLoans: [],
          sortFlag: false
        },
      })
    },

    * cancelLoan ({ payload }, { put, call, select }) {
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      const data = yield call(order.cancelOrder, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      Message.success('作废成功')
      const { selectedLoans,loanList } = yield select(_ => _.feeLoan)
      for(let id of selectedLoans){
        const node = loanList.filter(item => item.orderNo === id)[0]
        node.status = 0
        node.remark = payload.remark
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: false,
          cancelLoanData: {}
        },
      })
    },

    * importLoan ({ payload }, { put, call, select }) {
      const { modalImportData } = yield select(_ => _.feeLoan)
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
      let data;
      payload.type='loan'
      let timer = payload.timer
      delete payload.timer
      if(modalImportData.importType==1){
        data = yield call(order.importOrder, payload)
      }else{
        let arr = []
        for(let node of modalImportData.subjectSort){
          if(!node._add){
            arr.push({
              missionId:node.missionId,
              subjectId:node.subjectId,
              position:node.position,
            })
          }
        }
        if(arr.length<=0){
          return Message.error("请选择冲抵顺序")
        }
        payload.subjectSort = JSON.stringify(arr)
        data = yield call(order.importFee, payload)
      }
      
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

    * getImportLoanPrs ({ payload }, { put, call, select }) {
      const data = yield call(order.getImportPrs)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let { modalImportData, timer } = yield select(_ => _.feeLoan)
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

    * coverLoan ({ payload }, { put, call, select }) {
      let { modalImportData } = yield select(_ => _.feeLoan)
      let timer = payload.timer
      let data = yield call(order.coverOrder)
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

    * getSubjectListByMission ({ payload }, { put, call, select }) {
      let { missionMap } = yield select(_ => _.feeLoan)
      let data = yield call(feeSubject.getSubjectList, payload)
      if (!data.success) {
        clearInterval(timer)
        throw data
      } else if (data.ret_code != 1) {
        clearInterval(timer)
        return Message.error(data.ret_content)
      }
      missionMap[payload.missionId]._subjectList = data.ret_content.data?data.ret_content.data:[]
      yield put({
        type: 'updateState',
        payload: {
          missionMap
        },
      })
    },

  },
})
