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
  namespace: 'feeReturnReview',

  state: {
    modalUsers: [],
    modalPayType: '',

    sortSence: 'returnReviewSort',
    displaySence: 'returnReviewDisplay',
    userSortExtra: {
      payType: '退费方式',
      accountId: '经办人',
      orderNo: '订单号',
    },

    pageNum: 1,
    pageSize: 20,
    returnReviewList: [],
    count: 0,
    searchName: '',
    dataLoading: true,

    beginDate: `${moment().format('YYYY-MM-DD')} 00:00:00`,
    endDate: `${moment().format('YYYY-MM-DD')} 23:59:59`,
    missionId: undefined,
    subjectId: undefined,
    status: undefined,
    printStatus: undefined,

    selectedAll: false,
    selectedOrders: [],
    printCheck: 0, 
    textData: {},
    timer: null,
    cancelReturnReviewData: {},
    confirmReturnReviewData:{},
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/feeReturnReview') {
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
      const { userSortExtra, sortSence, displaySence } = yield select(_ => _.feeReturnReview)
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
      //获取所有经办人列表
      yield put({
        type: 'app/getRequestAccount', 
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

    * getReturnList ({ payload }, { put, call, select }) {
      const {
        sortList, beginDate, endDate, subjectId, missionId, payType
      } = payload
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
      if(payType){
        payload.payType =  payType.toString();
      }
      payload.status = 4
      if(payload.accountId){
        payload.accountId =  payload.accountId.toString();
      }
      // // 获取经办人条件
      // const { accountList } = yield select(_ => _.feeReturnReview)
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
      const data = yield call(order.getOrderReturnList, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const returnReviewList = data.ret_content.data?data.ret_content.data:[]
      for (let order of returnReviewList) {
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
          returnReviewList,
          count: parseInt(data.ret_content.count),
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          searchName: payload.key,
          dataLoading: false,
          selectedOrders: [],
          sortFlag: false
        },
      })
    },

    * orderReturnReview ({ payload }, { put, call, select }) {
        let { dataLoading, selectedAll, returnReviewList  } = yield select(_ => _.feeReturnReview)
        if(dataLoading){
          return Message.error("请不要重复点击")
        }
        yield put({
          type: 'updateState',
          payload: {
            dataLoading: true,
          },
        })
        let tempPayload = {}
        if(selectedAll){
          if(payload.queryParam.missionId){
            payload.queryParam.missionId = payload.queryParam.missionId.toString();
          }
          if(payload.queryParam.payType){
            payload.queryParam.payType =  payload.queryParam.toString();
          }
          if(payload.queryParam.accountId){
            payload.queryParam.accountId = payload.queryParam.accountId.toString();
          }
          if(payload.queryParam.subjectId){
            payload.queryParam.subjectId = payload.queryParam.toString();
          }
          delete payload.queryParam.pageNum
          delete payload.queryParam.pageSize
          let tempList = getSortParam(payload.queryParam.sortList)
          if (tempList && tempList.length>0) {
            payload.queryParam.sortList = JSON.stringify(tempList)
          }else{
            delete payload.queryParam.sortList
          }
          tempPayload.params = JSON.stringify(payload.queryParam)
          tempPayload.params = payload.queryParam
          tempPayload.params.count = payload.count.toString()
          tempPayload.params = JSON.stringify(tempPayload.params)
        }else{
          if(payload.orderNo){
            let orderNo = []
            for(let pos of payload.orderNo){
              orderNo.push(returnReviewList[pos].orderNo)
            }
            tempPayload.orderNo = orderNo.toString()
          }
        }
        tempPayload.status = payload.status
        tempPayload.remark = payload.remark
        const data = yield call(order.orderReturnReview, tempPayload)
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }
        Message.success('操作成功')
        yield put({
          type: 'updateState',
          payload: {
            cancelReturnReviewData: {},
            confirmReturnReviewData: {}
          },
        })
        const { sortList, beginDate, endDate, subjectId, missionId, payType, accountId, pageNum, pageSize, searchName } = yield select(_ => _.feeReturnReview)
        yield put({
          type: 'getReturnList',
          payload: {
            sortList, beginDate, endDate, subjectId, missionId, payType, accountId, pageNum, pageSize,
            name: searchName,
            selectedAll: false,
            selectedOrders: [],
          },
        })

      },
    
    * importReturn ({ payload }, { put, call, select }) {
      const { modalImportData, timer } = yield select(_ => _.feeReturnReview)
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
      payload.type = 'returnReview'
      let data = yield call(order.importOrder, payload)
      
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
        },
      })
    },

    * getImportReturnPrs ({ payload }, { put, call, select }) {
      const data = yield call(order.getImportPrs)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let { modalImportData, timer } = yield select(_ => _.feeReturnReview)
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

    * coverReturn ({ payload }, { put, call, select }) {
      let { modalImportData, timer } = yield select(_ => _.feeReturnReview)
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
          modalImportData
        },
      })
    },

  },
})
