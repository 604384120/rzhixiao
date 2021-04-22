/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import * as feeSubject from 'services/feeSubject'
import * as statistics from 'services/statistics'
import * as order from 'services/order'
import * as feeMission from 'services/feeMission'
import { pageModel } from './common'
import { Message } from 'antd'
import { getSortParam } from 'utils'

export default modelExtend(pageModel, {
  namespace: 'statisticsTime',

  state: {
    modalVisible: false,
    modalData: {},

    sortSence: 'statisticsTimeSort',
    displaySence: 'statisticsTimeDisplay',
    statSence: 'statDataDisplay_time',
    pageNum: 1,
    pageSize: 20,
    count: 0,
    dataList: [],
    dataLoading: true,
    statData: null,
    totalBegin: 0,
    statList:[
      {name:'缴费总额',sum:'receivedFeeSum'},
      {name:'缴费总笔数',pens:'receivedFeeCount'},
      {name:'退费总额',sum:'refundSum'},
      {name:'退费总笔数',pens:'refundCount'},
    ],

    year: undefined,
    subjectId: undefined,
    missionId: undefined,

  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/statisticsTime') {
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
      const { sortSence } = yield select(_ => _.statisticsTime)
      yield put({
        type: 'app/initDisplay', 
        payload: {params:
            [{sence:sortSence, displayExtra:{}, defaultType: '1'}]
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
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: false,
        },
      })
    },

    * getDataList ({ payload }, { put, call, select }) {
      if(payload.year){
        payload.year = payload.year.toString()
      }
      if(payload.month){
        payload.month = payload.month.toString()
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })

      let data = yield call(statistics.getTimeStatistics, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      data = data.ret_content
      let {receivedFeeSum,receivedFeeCount,refundSum,refundCount,exceedFeeSum,exceedFeeCount} = data
      let statData = {receivedFeeSum,receivedFeeCount,refundSum,refundCount,exceedFeeSum,exceedFeeCount}
      yield put({
        type: 'updateState',
        payload: {
          dataList: data.orderStatisticsDayTypeEntityList.data?data.orderStatisticsDayTypeEntityList.data:[],
          count: parseInt(data.orderStatisticsDayTypeEntityList.count),
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          dataLoading: false,
          statData,
          sortFlag: false
        },
      })
    },

    * getSubjectDetail ({ payload }, { put, call, select }) {
      const { modalData } = yield select(_ => _.statisticsTime)
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
      if(payload.missionId && payload.missionId.length>0){
        payload.missionId = payload.missionId.toString()
      }
      let data = yield call(statistics.getTimeSubjectStatistics, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      data = data.ret_content
      let dataList = data.orderStatisticsDayTypeEntity?data.orderStatisticsDayTypeEntity:[]
      //插入总计的总计
      let temp = {
        id: '总计',
        subjectName: '总计',
        totalFee: data.receivedFeeSum,
        totalOrder: data.receivedFeeCount,
        refundFee: data.refundSum,
        refundOrder: data.refundCount
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

    * getMissionDetail ({ payload }, { put, call, select }) {
      const { modalData } = yield select(_ => _.statisticsTime)
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
      if(payload.subjectId && payload.subjectId.length>0){
        payload.subjectId = payload.subjectId.toString()
      }
      let data = yield call(statistics.getTimeMissionStatistics, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      data = data.ret_content
      let dataList = data.orderStatisticsDayTypeEntity?data.orderStatisticsDayTypeEntity:[]
      //插入总计的总计
      let temp = {
        id: '总计',
        missionName: '总计',
        totalFee: data.receivedFeeSum,
        totalOrder: data.receivedFeeCount,
        refundFee: data.refundSum,
        refundOrder: data.refundCount
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

    * getPayTypeDetail ({ payload }, { put, call, select }) {
      const { modalData } = yield select(_ => _.statisticsTime)
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
      if(payload.missionId && payload.missionId>0){
        payload.missionId = payload.missionId.toString()
      }
      if(payload.subjectId && payload.subjectId>0){
        payload.subjectId = payload.subjectId.toString()
      }
      let data = yield call(statistics.getTimePayTypeStatistics, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      data = data.ret_content
      let dataList = data.orderStatisticsDayTypeEntity?data.orderStatisticsDayTypeEntity:[]
      //插入总计的总计
      let temp = {
        id: '总计',
        payTypeName: '总计',
        totalFee: data.receivedFeeSum,
        totalOrder: data.receivedFeeCount,
        refundFee: data.refundSum,
        refundOrder: data.refundCount
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
  

    * showDetail ({ payload }, { put, call, select }) {
      const {modalType, timeType, sortList} = payload
      delete payload.sortList
      delete payload.modalType
      delete payload.timeType
      let modalData = {
        info: {...payload},
        dataLoading: true,
        dataList: [],
        missionId: undefined,
        subjectId: undefined,
      }
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: true,
          modalData,
          modalType,
        },
      })
      if(modalType == 1){
        //项目明细
        yield put({
          type: 'getSubjectDetail',
          payload: {
            timeType,
            time: payload.createDate,
            sortList,
          },
        })
      }else if(modalType == 2){
        //项目明细
        yield put({
          type: 'getMissionDetail',
          payload: {
            timeType,
            time: payload.createDate,
            sortList,
          },
        })
      }else if(modalType == 3){
        //收费方式明细
        yield put({
          type: 'getPayTypeDetail',
          payload: {
            timeType,
            time: payload.createDate,
            sortList,
          },
        })
      }
      
    },


  },
})
