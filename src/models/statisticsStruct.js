/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import * as structService from 'services/struct'
import * as feeSubject from 'services/feeSubject'
import * as statistics from 'services/statistics'
import * as order from 'services/order'
import * as feeMission from 'services/feeMission'
import * as account from 'services/account'
import * as setService from 'services/printSet'
import { getTemplateText } from 'services/receipt'
import { pageModel } from './common'
import { Message } from 'antd'
import moment from 'moment'
import { config, getSortParam, getYearFormat, getYearNew } from 'utils'

export default modelExtend(pageModel, {
  namespace: 'statisticsStruct',

  state: {
    modalVisible: false,
    modalData: {},

    pageNum: 1,
    pageSize: 20,
    count: 0,
    dataList: [],
    dataLoading: true,
    statData: null,
    statSence: 'statDataDisplay_struct',
    sortSence: 'statisticsStructSort',
    userSortExtra: {},

    year: [`${getYearNew()}`],
    missionId: undefined,
    subjectId: undefined,
    structId: undefined,
    beginDate: `${moment().format('YYYY-MM-DD')} 00:00:00`,
    endDate: `${moment().format('YYYY-MM-DD')} 23:59:59`,
    structItemPid: {},
    userStatus: ['在读'],

    structList: [],
    type:'0',
    sortFlag: true
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/statisticsStruct') {
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
      const { statSence, userSortExtra, sortSence, displaySence } = yield select(_ => _.statisticsStruct)
      yield put({
        type: 'app/initDisplay', 
        payload: {params:
            [{sence:sortSence, displayExtra:userSortExtra, defaultType: '1', onFilter: function (attr) {
              if(attr){
                //过滤掉层级属性
                return attr.valueType === '3'
              }
              return false
            }},{sence:'statDataDisplay',senceKey:'struct',userAttrList:config.statDataList
            // userAttrList:config.statDataList.filter((item)=>{return item.id != 'convertFee'})
          },]
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
      //获取所有学校结构
      yield put({
        type: 'app/getRequestStruct', 
        payload: {}
      })
      let data = yield call(structService.getStructList)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      } else if (!data.ret_content) {
        return Message.error('请先设置学校结构')
      }
      const structMap = {}
      const structList = []
      let i = 0
      for (let struct of data.ret_content) {
        if (struct.status == '1') {
          structList.push(struct)
          struct._position = i++
          structMap[struct.id] = struct
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: false,
          missionId: payload.missionId,
          structList,
          structMap
        },
      })
    },

    * getAllItemList ({ payload }, { put, call, select }) {
      const { structList,structMap } = yield select(_ => _.statisticsStruct)
      let { itemPid, structId } = payload
      const struct = structMap[structId]
      let structPid = {}
      if (itemPid && itemPid.id) {
        structPid = structMap[itemPid.id]
        if (!structPid) {
          throw '无效的层级id'
        }
        if (struct._position <= structPid._position) {
          // 获取已选取的pid
          for (var i = struct._position - 1; i >= 0; i--) {
            if (structList[i]._idSelected) {
              itemPid = structList[i]
              break
            }
          }
          if (i < 0) {
            itemPid = {}
          }
        }
      }
      if (!struct._selectList || struct._selectList.length <= 0) {
        const data = yield call(structService.getAllItemList, { pid: itemPid?itemPid._idSelected:null, structId })
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }
        struct._selectList = data.ret_content?data.ret_content:[]
      }

      yield put({
        type: 'updateState',
        payload: {
          structList,
        },
      })
    },
    * changeStruct ({ payload }, { put, call, select }) {
      const { structList } = yield select(_ => _.statisticsStruct)
      // 清理数据
      for (let node of structList) {
        delete node._idSelected
        delete node._selectList
      }
      yield put({
        type: 'updateState',
        payload: {
          structId: payload.structId,
          structItemPid: {},
          dataList: [],
          count: 0,
          pageNum: 0,
          pageSize: 20,
          sortFlag: true
        },
      })
    },
    * changeStructItem ({ payload }, { put, call, select }) {
      const { structMap, structList  } = yield select(_ => _.statisticsStruct)
      let { id, structId } = payload
      let structItemPid
      if (id) {
        structMap[structId]._idSelected = id
        structItemPid = structMap[structId]
      } else {
        structMap[structId]._idSelected = undefined
        structItemPid = {}
        // 获取上级pid
        for (let i = structMap[structId]._position - 1; i >= 0; i--) {
          if (structList[i].status == '1' && structList[i]._idSelected) {
            structItemPid = structList[i]
            break
          }
        }
      }

      // 重置下级层级
      for (let i = structMap[structId]._position + 1; i < structList.length; i++) {
        delete structList[i]._idSelected
        delete structList[i]._selectList
      }

      yield put({
        type: 'updateState',
        payload: {
          structList,
          structItemPid,
          sortFlag: true
        },
      })
    },

    * getDataList ({ payload }, { put, call, select }) {
      const { beginDate, endDate, userStatus, sortList, year } = payload
      if (!beginDate) {
        throw '请选择开始时间!'
      }
      if (!endDate) {
        throw '请选择结束时间!'
      }
      if(!year || year.length<=0){
        throw '请选择学年!'
      }
      let tempList = getSortParam(sortList)
      if (tempList && tempList.length>0) {
        payload.sortList = JSON.stringify(tempList)
      }else{
        delete payload.sortList
      }
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
      
      let data = yield call(statistics.getArchitectureStatisticsList, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      data = data.ret_content
      let {paidFeeSum,refundSum,arrearsSum,totalFeeSum,discountSum,convertFeeSum,paidFeeCount,refundCount,arrearsCount,totalFeeCount,discountCount,exceedFeeSum,exceedFeeCount,convertFeeCount} = data
      let statData = {paidFeeSum,refundSum,arrearsSum,totalFeeSum,discountSum,convertFeeSum,paidFeeCount,refundCount,arrearsCount,totalFeeCount,discountCount,exceedFeeSum,exceedFeeCount,convertFeeCount}
      statData.receivedFeeSum = parseInt(paidFeeSum)+parseInt(refundSum)
      let dataList = []
      let structItemEntit = data.structItemEntity.data?data.structItemEntity.data:[]
      let total = {totalFee:0,totalFeeCount:0,discount:0,discountCount:0,paidFee:0,paidFeeCount:0,refund:0,refundCount:0,arrears:0,arrearsCount:0}
      for(let node of structItemEntit){
        let temp = {
          ...node.statisticsData,
          id: node.id,
          name: node.name
        }
        total.totalFee += parseInt(temp.totalFee)
        total.totalFeeCount += parseInt(temp.totalFeeCount)
        total.discount += parseInt(temp.discount)
        total.discountCount += parseInt(temp.discountCount)
        total.paidFee += parseInt(temp.paidFee)
        total.paidFeeCount += parseInt(temp.paidFeeCount)
        total.refund += parseInt(temp.refund)
        total.refundCount += parseInt(temp.refundCount)
        total.arrears += parseInt(temp.arrears)
        total.arrearsCount += parseInt(temp.arrearsCount)
        temp[node.structId] = node.name
        if(node.structItemEntities){
          for(let pnode of node.structItemEntities){
            temp[pnode.structId] = pnode.name
          }
        }
        let arr = []
        if(node.gradeList){
          let other  = {...node.statisticsData, name:'其他'}
          for(let n of node.gradeList){
            other.totalFee -= n.totalFee
            other.totalFeeCount -= n.totalFeeCount
            other.discount -= n.discount
            other.discountCount -= n.discountCount
            other.paidFee -= n.paidFee
            other.paidFeeCount -= n.paidFeeCount
            other.refund -= n.refund
            other.refundCount -= n.refundCount
            other.arrears -= n.arrears
            other.arrearsCount -= n.arrearsCount
            n.percent = n.totalFee!='0'&&n.totalFee!=null?((n.totalFee-n.arrears)/n.totalFee*100).toFixed(2)+'%':'0%',
            arr.push(n)
          }
           //存在其他的情况
          if(other.totalFee>0 || other.totalFeeCount>0 || other.discount>0 || other.discountCount>0 || other.paidFee>0 || other.paidFeeCount>0
            || other.refund>0 ||other.refundCount>0 || other.arrears>0 || other.arrearsCount>0){
              other.percent = other.totalFee!='0'&&other.totalFee!=null?((other.totalFee-other.arrears)/other.totalFee*100).toFixed(2)+'%':'0%',
              arr.push(other)
          }
        }
       
        arr.push({
          name:'合计',
          percent: temp.totalFee!='0'&&temp.totalFee!=null?((temp.totalFee-temp.arrears)/temp.totalFee*100).toFixed(2)+'%':'0%',
          ...node.statisticsData,
        })
        temp.gradeList = arr;
        dataList.push(temp)
      }
      yield put({
        type: 'updateState',
        payload: {
          dataList,
          count: parseInt(data.structItemEntity.count),
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          type: payload.type,
          userStatus,
          dataLoading: false,
          statData,
          sortFlag: false,
          printTotal: total
        },
      })
    },

    * getDetail ({ payload }, { put, call, select }) {
      const { modalData  } = yield select(_ => _.statisticsStruct)
      const { userStatus, beginDate, endDate, sortList } = payload
      if (!beginDate) {
        throw '请选择开始时间!'
      }
      if (!endDate) {
        throw '请选择结束时间!'
      }
      modalData.dataLoading = true
      yield put({
        type: 'updateState',
        payload: {
          modalData
        },
      })
      modalData.type = payload.type
      let tempList = getSortParam(sortList)
      if (tempList && tempList.length>0) {
        payload.sortList = JSON.stringify(tempList)
      }else{
        delete payload.sortList
      }
      if(payload.year){
        payload.year = payload.year.toString()
      }
      if(payload.missionId){
        payload.missionId = payload.missionId.toString()
      }
      if(payload.subjectId){
        payload.subjectId = payload.subjectId.toString()
      }
      if(payload.userStatus){
        payload.userStatus = payload.userStatus.toString()
      }
      //查询当前
      let data = yield call(statistics.getArchitectureStatisticsDetail, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let list = data.ret_content.statisticsDataLists?data.ret_content.statisticsDataLists:[]
      let dataList = []
      for(let node of list){
        for(let subNode of node.statisticsDataList){
          subNode.receivedFee = parseInt(subNode.paidFee)+parseInt(subNode.refund)
        }
        let temp = {
          year: node.year,
          statisticsDataList: node.statisticsDataList
        }
        //插入总计
        temp.statisticsDataList.push({
          paidFee: node.paidFeeSum,
          paidFeeCount: node.paidFeeCount,
          refund: node.refundSum,
          refundCount: node.refundCount,
          arrears: node.arrearsSum,
          arrearsCount: node.arrearsCount,
          totalFee: node.totalFeeSum,
          totalFeeCount: node.totalFeeCount,
          discount: node.discountSum,
          discountCount: node.discountCount,
          receivedFee: parseInt(node.paidFeeSum)+parseInt(node.refundSum),
          subjectName: "合计",
        })
        dataList.push(temp)
      }
      if(data.ret_content.statisticsDataSum){
        data.ret_content.statisticsDataSum.receivedFee = parseInt(data.ret_content.statisticsDataSum.paidFee)+parseInt(data.ret_content.statisticsDataSum.refund)
      }
      //插入总计的总计
      let temp = {
        year: '总计',
        statisticsDataList: [data.ret_content.statisticsDataSum]
      }
      
      dataList.push(temp)
      modalData.dataList = dataList
      modalData.dataLoading = false
      modalData.type = payload.type
      modalData.userStatus = userStatus
      yield put({
        type: 'updateState',
        payload: {
          modalData,
        },
      })
    },

    * getStatSubject ({ payload }, { put, call, select }) {
      const { modalData  } = yield select(_ => _.statisticsStruct)
      const { userStatus, beginDate, endDate, sortList, year } = payload
      if (!beginDate) {
        throw '请选择开始时间!'
      }
      if (!endDate) {
        throw '请选择结束时间!'
      }
      if(!year || year.length<=0){
        throw '请选择学年!'
      }
      modalData.dataLoading = true
      yield put({
        type: 'updateState',
        payload: {
          modalData
        },
      })
      modalData.type = payload.type
      let tempList = getSortParam(sortList)
      if (tempList && tempList.length>0) {
        payload.sortList = JSON.stringify(tempList)
      }else{
        delete payload.sortList
      }
      if(payload.year){
        payload.year = payload.year.toString()
      }
      if(payload.missionId){
        payload.missionId = payload.missionId.toString()
      }
      if(payload.subjectId){
        payload.subjectId = payload.subjectId.toString()
      }
      if(payload.userStatus){
        payload.userStatus = payload.userStatus.toString()
      }
      //查询当前
      let data = yield call(statistics.getArchitectureStatSubject, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let list = data.ret_content.statisticsDataList?data.ret_content.statisticsDataList:[]
      let dataList = []
      for(let node of list){
        node.receivedFee = parseInt(node.paidFee)+parseInt(node.refund)
        let arr = []
        if(node.gradeList){
          let other  = {...node.statisticsData, name:'其他'}
          for(let n of node.gradeList){
            other.totalFee -= n.totalFee
            other.totalFeeCount -= n.totalFeeCount
            other.discount -= n.discount
            other.discountCount -= n.discountCount
            other.paidFee -= n.paidFee
            other.paidFeeCount -= n.paidFeeCount
            other.refund -= n.refund
            other.refundCount -= n.refundCount
            other.arrears -= n.arrears
            other.arrearsCount -= n.arrearsCount
            arr.push(n)
          }
           //存在其他的情况
          if(other.totalFee>0 || other.totalFeeCount>0 || other.discount>0 || other.discountCount>0 || other.paidFee>0 || other.paidFeeCount>0
            || other.refund>0 ||other.refundCount>0 || other.arrears>0 || other.arrearsCount>0){
              other.receivedFee = parseInt(other.paidFee)+parseInt(other.refund)
              arr.push(other)
          }
        }
       
        arr.push({
          name:'合计',
          ...node,
        })
        node.gradeList = arr;
        dataList.push(node)
      }
      if(data.ret_content.statisticsDataSum){
        data.ret_content.statisticsDataSum.receivedFee = parseInt(data.ret_content.statisticsDataSum.paidFee)+parseInt(data.ret_content.statisticsDataSum.refund)
      }
      //插入总计的总计
      let temp = {
        id:'__total',
        subjectName: '总计',
        gradeList: [{id:'__total',...data.ret_content.statisticsDataSum}]
      }
      
      dataList.push(temp)
      modalData.dataList = dataList
      modalData.dataLoading = false
      modalData.type = payload.type
      modalData.userStatus = userStatus
      yield put({
        type: 'updateState',
        payload: {
          modalData,
        },
      })
    },

    * showDetail ({ payload }, { put, call, select }) {
      const { year, missionId, subjectId, type, userStatus, beginDate, endDate } = yield select(_ => _.statisticsStruct)
      let modalData = {
        info: {...payload},
        dataLoading: true,
        dataList: [],
        year,
        missionId,
        subjectId,
        type,
        userStatus,
        beginDate: beginDate,
        endDate: endDate,
      }
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: true,
          modalData,
        },
      })
      
      yield put({
        type: 'getStatSubject',
        payload: {
          missionId,
          year,
          subjectId,
          structId: payload.structId,
          structItemId: payload.id,
          type,
          userStatus,
          beginDate,
          endDate,
          sortList: payload.sortList,
        },
      })
    },


  },
})
