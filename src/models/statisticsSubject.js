/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import * as feeBill from 'services/feeBill'
import * as feeSubject from 'services/feeSubject'
import * as statistics from 'services/statistics'
import * as feeMission from 'services/feeMission'
import { pageModel } from './common'
import { Message } from 'antd'
import { config, getYearFormat, getYearNew, getSortParam } from 'utils'

export default modelExtend(pageModel, {
  namespace: 'statisticsSubject',

  state: {
    modalVisible: false,
    modalData: {},

    sortSence: 'statisticsSort',
    displaySence: 'statisticsDisplay',
    statSence: 'statDataDisplay_subject',
    pageNum: 1,
    pageSize: 20,
    count: 0,
    dataList: [],
    dataLoading: true,
    statData: {},

    year: `${getYearNew()}`,
    subjectId: undefined,
    missionId: undefined,
    userStatus: ['在读'],

    type:'0',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/statisticsSubject') {
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
      const { userSortExtra, sortSence, displaySence, statSence } = yield select(_ => _.statisticsSubject)
      yield put({
        type: 'app/initDisplay', 
        payload: {params:
            [{sence:displaySence, displayExtra:{}},{sence:sortSence, displayExtra:userSortExtra, defaultType: '1', fixed:{'学生状态':{}}},{sence:'statDataDisplay',senceKey:'subject',userAttrList:config.statDataList.filter((item)=>{return item.id != 'convertFee'})}]
          }
      })
      //获取所有学年列表
      yield put({
        type: 'app/getRequestYear', 
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
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: false,
        },
      })
    },

    * getDataList ({ payload }, { put, call, select }) {
      if(payload.subjectId){
        payload.subjectId = payload.subjectId.toString()
      }
      if(payload.missionId){
        payload.missionId = payload.missionId.toString()
      }
      if(payload.year){
        payload.year = payload.year.toString()
      }
      if(payload.userStatus){
        payload.userStatus = payload.userStatus.toString()
      }

      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })

      let data = yield call(statistics.getSubjectStatistics, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      data = data.ret_content
      let {paidFeeSum,refundSum,arrearsSum,totalFeeSum,discountSum,paidFeeCount,refundCount,arrearsCount,totalFeeCount,discountCount,exceedFeeSum,exceedFeeCount} = data
      let statData = {paidFeeSum,refundSum,arrearsSum,totalFeeSum,discountSum,paidFeeCount,refundCount,arrearsCount,totalFeeCount,discountCount,exceedFeeSum,exceedFeeCount}
      statData.receivedFeeSum = parseInt(paidFeeSum)+parseInt(refundSum)
      yield put({
        type: 'updateState',
        payload: {
          dataList: data.statisticsDataListPage.data?data.statisticsDataListPage.data:[],
          count: parseInt(data.statisticsDataListPage.count),
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          dataLoading: false,
          statData,
          type:payload.type,
          sortFlag: false
        },
      })
    },

    * getStatistics ({ payload }, { put, call, select }) {
      const { modalData  } = yield select(_ => _.statisticsSubject)
      modalData.dataLoading = true
      const { sortList } = payload
      yield put({
        type: 'updateState',
        payload: {
          modalData,
        },
      })
      let tempList = getSortParam(sortList)
      if (tempList && tempList.length>0) {
        payload.sortList = JSON.stringify(tempList)
      }else{
        delete payload.sortList
      }
      if(payload.missionId){
        payload.missionId = payload.missionId.toString()
      }
      //查询当前
      let data = yield call(statistics.getMissionStatisticsDetail, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let dataList = data.ret_content.statisticsDataList?data.ret_content.statisticsDataList:[]
      //插入总计的总计
      let temp = {
        subjectName: '总计',
        paidFee: data.ret_content.paidFeeSum,
        refund: data.ret_content.refundSum,
        arrears: data.ret_content.arrearsSum,
        totalFee: data.ret_content.totalFeeSum,
        discount: data.ret_content.discountSum,
      }
      dataList.push(temp)
      modalData.dataList = dataList
      modalData.dataLoading = false
      yield put({
        type: 'updateState',
        payload: {
          modalData,
        },
      })
    },

    * getDetailStatistics ({ payload }, { put, call, select }) {
      const { modalData } = yield select(_ => _.statisticsSubject)
      modalData.dataLoading = true
      yield put({
        type: 'updateState',
        payload: {
          modalData,
        },
      })
      delete payload.pageNum
      delete payload.pageSize
      const data = yield call(feeBill.getBillStatistics, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      modalData.stat = data.ret_content
      modalData.dataLoading = false
      yield put({
        type: 'updateState',
        payload: {
          modalData,
        },
      })
    },

    * getDetailBillList ({ payload }, { put, call, select }) {
      const { sortList, subjectId } = payload
      if (!subjectId) {
        throw '请选择收费项目!'
      }
      const { modalData } = yield select(_ => _.statisticsSubject)
      let tempList = getSortParam(sortList)
      if (tempList && tempList.length>0) {
        payload.sortList = JSON.stringify(tempList)
      }else{
        delete payload.sortList
      }
      modalData.dataLoading = true
      yield put({
        type: 'updateState',
        payload: {
          modalData,
        },
      })

      yield put({
        type: 'getDetailStatistics',
        payload: {
          ...payload,
        },
      })

      const data = yield call(feeBill.getBills, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const billList = data.ret_content.data?data.ret_content.data:[]
      for (let bill of billList) {
        if (bill.attrList) {
          for (let attr of bill.attrList) {
            bill[attr.attrId] = attr.relateName
          }
        }
        if(bill.feeBillListEntities){
          //合计
          let tempTotal = {
            subjectName:"小计",
            totalFee: 0,
            refund:0,
            paidFee: 0,
            discount: 0,
            loans: 0,
            status: 0,
            id: '_totalSum'
          }
          for(let node of bill.feeBillListEntities){
            if(node.status == '1'){
              tempTotal.totalFee += parseInt(node.totalFee)
              tempTotal.refund += parseInt(node.refund)
              tempTotal.paidFee += parseInt(node.paidFee)
              tempTotal.discount += parseInt(node.discount)
              tempTotal.loans += parseInt(node.loans)
            }
          }
          bill.feeBillListEntities.push(tempTotal)
        }
      }
      modalData.dataList = billList
      modalData.count = parseInt(data.ret_content.count)
      modalData.pageNum = payload.pageNum
      modalData.pageSize = payload.pageSize
      modalData.searchName = payload.key
      modalData.dataLoading = false
      modalData.type = payload.type
      yield put({
        type: 'updateState',
        payload: {
          modalData,
        },
      })
    },

    * getDetail ({ payload }, { put, call, select }) {
      const { modalData } = yield select(_ => _.statisticsSubject)
      modalData.dataLoading = true
      yield put({
        type: 'updateState',
        payload: {
          modalData,
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
      if(payload.year){
        payload.year = payload.year.toString()
      }
      let data = yield call(statistics.getSubjectStatisticsDetail, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      data = data.ret_content
      let {paidFeeSum,paidFeeCount,refundSum,refundCount,arrearsSum,arrearsCount,totalFeeSum,totalFeeCount,discountSum,discountCount} = data
      modalData.stat = {paidFeeSum,paidFeeCount,refundSum,refundCount,arrearsSum,arrearsCount,totalFeeSum,totalFeeCount,discountSum,discountCount}
      modalData.stat.receivedFeeSum = parseInt(paidFeeSum)+parseInt(refundSum)
      modalData.stat.receivedFeeCount = parseInt(paidFeeCount)
      let feeBillEntities = data.feeBillEntities&&data.feeBillEntities.data?data.feeBillEntities.data:[]
      for(let bill of feeBillEntities){
        if (bill.attrList) {
          for (let attr of bill.attrList) {
            bill[attr.attrId] = attr.relateName
          }
        }
      }
      modalData.dataList = feeBillEntities
      modalData.count = data.feeBillEntities?parseInt(data.feeBillEntities.count):0
      modalData.pageNum = payload.pageNum
      modalData.pageSize = payload.pageSize
      modalData.searchName = payload.key
      modalData.dataLoading = false
      yield put({
        type: 'updateState',
        payload: {
          modalData,
        },
      })
    },

    * showDetail ({ payload }, { put, call, select }) {
      const {subjectId, subjectName, year, missionId, userStatus} = payload
      let modalData = {
        info: {...payload},
        dataLoading: true,
        dataList: [],
        subjectId,
        subjectName,
        stat: {},
        pageNum: 1,
        pageSize: 20,
        year,
        missionId,
        statSence: 'statDataDisplay',
      }
      yield put({
        type: 'app/initDisplay', 
        payload: {params:
          [{sence:modalData.statSence, userAttrList:config.statDataList}]
        }
      })
      const { userDisplaySence } = yield select(_ => _.app)
      for(let attr of userDisplaySence['statisticsSort'].displayList){
        if(attr.name == '学生状态'){
          attr._idSelected = userStatus
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: true,
          modalData,
        },
      })
      yield put({
        type: 'getDetail',
        payload: {
          subjectId: subjectId,
          missionId,
          pageNum: 1,
          pageSize: 20,
          sortList:userDisplaySence['statisticsSort'].displayList
        },
      })
    },


  },
})
