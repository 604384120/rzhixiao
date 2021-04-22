/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import * as feeSubject from 'services/feeSubject'
import * as statistics from 'services/statistics'
import * as feeMission from 'services/feeMission'
import * as feeBill from 'services/feeBill'
import * as orderService from 'services/order'
import { pageModel } from './common'
import { Message } from 'antd'
import { getFormat, config, getYearFormat, getYearNew, getSortParam } from 'utils'

export default modelExtend(pageModel, {
  namespace: 'statisticsStudent',

  state: {
    modalVisible: false,
    modalType: null,
    modalData:{},
    
    sortSence: 'statStudentSort',
    displaySence: 'statStudentDisplay',
    statSence: 'statDataDisplay_student',
    userSortExtra: {
    },

    dataLoading: true,
    dataList: [],
    pageNum: 1,
    pageSize: 20,
    dataType:0,
    dataTypeMap: {
      0:"展示全部",
      4:"仅显示欠费",
      1:"仅显示有账单",
      2:"仅显示有缴费",
      5:"仅显示超额缴费",
      3:"仅显示缴费完成",
      6:"仅显示有退费",
      7:"仅显示有缓缴",
      8:"仅显示有减免",
    },

    searchName: '',
    missionId: undefined,
    subjectId: undefined,
    year: `${getYearNew()}`,
    queryTime: undefined,
    exportFormat: 1,
    exceedFeeVisible: false, //table和modal的超收共用

    statData: null,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/statisticsStudent') {
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
      const { userSortExtra, sortSence, displaySence, statSence } = yield select(_ => _.statisticsStudent)
      yield put({
        type: 'app/initDisplay', 
        payload: {params:
            [{sence:displaySence, displayExtra:{}},{sence:sortSence, displayExtra:userSortExtra, defaultType: '1'},{sence:'statDataDisplay',senceKey:'student',userAttrList:config.statDataList.filter((item)=>{return item.id != 'convertFee'})}]
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
          dataLoading:false,
        },
      })
    },

    * getDataList ({ payload }, { put, call, select }) {
      const { sortList, subjectId, missionId, year, queryTime } = payload
      let exceedFeeVisible =false
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
      delete payload.accountId
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      let data = yield call(statistics.getStudentStatisticsList, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      data = data.ret_content
      let {paidFeeSum,refundSum,arrearsSum,totalFeeSum,discountSum,exceedFeeSum} = data
      let statData = {paidFeeSum,refundSum,arrearsSum,totalFeeSum,discountSum,exceedFeeSum}
      statData.receivedFeeSum = parseInt(paidFeeSum)+parseInt(refundSum)
      let dataList = data.feeBillEntities.data?data.feeBillEntities.data:[]
      for (let order of dataList) {
        if (order.attrList) {
          for (let attr of order.attrList) {
            order[attr.attrId] = attr.relateName
          }
        }
        if(order.statisticsData && order.statisticsData.exceedFee && order.statisticsData.exceedFee != '0'){
          exceedFeeVisible = true
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          dataList,
          count: parseInt(data.feeBillEntities.count),
          dataLoading: false,
          searchName: payload.key,
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          statData,
          sortFlag: false,
          exceedFeeVisible,
        },
      })
    },

    * showDetail ({ payload }, { put, call, select }) {
      const { userCurrent } = payload
      let modalData = {
        userCurrent,
        missionList: [],
        orderList: [],
        orderReturnList: [],
        index:1,
      }
      yield put({
        type: 'updateState',
        payload: {
          modalData,
          modalVisible: true,
        },
      })
      const { missionId,subjectId,year } = yield select(_ => _.statisticsStudent)
      yield put({
        type: 'getMissionList',
        payload: {
          userId: userCurrent.userId,
          missionId: missionId?missionId.toString():undefined,
          subjectId: subjectId?subjectId.toString(): undefined,
          year: year?year.toString():undefined
        },
      })
    },

    * changeIndex ({ payload }, { put, call, select }) {
      const { modalData,missionId,subjectId,year } = yield select(_ => _.statisticsStudent)
      modalData.index = payload.index
      yield put({
        type: 'updateState',
        payload: {
          modalData,
        },
      })
      let param = {
        userId: modalData.userCurrent.userId,
        missionId: missionId?missionId.toString():undefined,
        subjectId: subjectId?subjectId.toString():undefined,
        year: year?year.toString():undefined,
      }
      if(payload.index == 1){
        //显示任务列表
        if(!modalData.missionList || modalData.missionList.length==0){
          yield put({
            type: 'getMissionList',
            payload: {
              ...param
            },
          })
        }
      }else if(payload.index == 2){
        if(!modalData.orderList || modalData.orderList.length==0){
          yield put({
            type: 'getOrderList',
            payload: {
              ...param
            },
          })
        }
      }else if(payload.index == 3){
        if(!modalData.orderReturnList || modalData.orderReturnList.length==0){
          yield put({
            type: 'getOrderReturnList',
            payload: {
              ...param
            },
          })
        }
      }else{
        if(!modalData.billOperateList || modalData.billOperateList.length==0){
          yield put({
            type: 'getBillOperateList',
            payload: {
              ...param
            },
          })
        }
      }
    },

    * getMissionList ({ payload }, { put, call, select }) {
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })

      const { modalData } = yield select(_ => _.statisticsStudent)
      let data = yield call(feeBill.getMissionByUser, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      modalData['missionList'] =  data.ret_content?data.ret_content:[]

      yield put({
        type: 'updateState',
        payload: {
          modalData,
          dataLoading: false,
        },
      })
    },

    * getOrderList ({ payload }, { put, call, select }) {
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })

      const { modalData } = yield select(_ => _.statisticsStudent)
      let data = yield call(feeBill.getOrderByUser, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      modalData['orderList'] =  data.ret_content?data.ret_content:[]

      yield put({
        type: 'updateState',
        payload: {
          modalData,
          dataLoading: false,
        },
      })
    },

    * getOrderReturnList ({ payload }, { put, call, select }) {
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })

      const { modalData } = yield select(_ => _.statisticsStudent)
      let data = yield call(feeBill.getOrderReturnByUser, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      modalData['orderReturnList'] =  data.ret_content?data.ret_content:[]

      yield put({
        type: 'updateState',
        payload: {
          modalData,
          dataLoading: false,
        },
      })
    },

    * getBillOperateList ({ payload }, { put, call, select }) {
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })

      const { modalData } = yield select(_ => _.statisticsStudent)
      let data = yield call(feeBill.getFeeBillOperateHistory, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      modalData['billOperateList'] = data.ret_content.feeBillOperateHistoryList&&data.ret_content.feeBillOperateHistoryList.data
        ?data.ret_content.feeBillOperateHistoryList.data:[];
      modalData['billAdjustList']  = []
      modalData['billDeferredList'] = []
      modalData['billDiscountList'] = []
      for(let node of modalData['billOperateList']){
        if(node.snapshot){
          node.snapshot = JSON.parse(node.snapshot);
        }
        if(node.info){
          node.info = JSON.parse(node.info);
        }
        if(node.mask == '1'){
          modalData['billAdjustList'].push(node)
        }else if(node.mask == '2'){
          modalData['billDiscountList'].push(node)
        }else{
          modalData['billDeferredList'].push(node)
        }
      }

      yield put({
        type: 'updateState',
        payload: {
          modalData,
          dataLoading: false,
        },
      })
    },
  },
})
