/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import * as feeBill from 'services/feeBill'
import * as feeSubject from 'services/feeSubject'
import * as statistics from 'services/statistics'
import * as feeMission from 'services/feeMission'
import { pageModel } from './common'
import { Message } from 'antd'
import { config, getSortParam, getYearFormat, getYearNew } from 'utils'

export default modelExtend(pageModel, {
  namespace: 'statisticsMission',

  state: {
    modalVisible: false,
    modalData: {
      dataType:0,
      dataTypeMap: {
        0:"展示全部",
        4:"仅显示欠费",
        // 1:"仅显示有账单",
        2:"仅显示有缴费",
        5:"仅显示超额缴费",
        3:"仅显示缴费完成"
      },
    },

    sortSence: 'statisticsSort',
    displaySence: 'statisticsDisplay',
    statSence: 'statDataDisplay_mission',
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
        if (location.pathname === '/statisticsMission') {
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
      const { sortSence, displaySence, statSence } = yield select(_ => _.statisticsMission)
      yield put({
        type: 'app/initDisplay', 
        payload: {params:
            [{sence:displaySence, displayExtra:{}},
              {sence:sortSence, displayExtra:{}, defaultType: '1', fixed:{'学生状态':{}}},
              {sence:"statDataDisplay",senceKey:"mission",userAttrList:config.statDataList.filter((item)=>{return item.id != 'convertFee'})}]
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
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: false,
        },
      })
    },

    * getDataList ({ payload }, { put, call, select }) {
      const { userStatus } = payload
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

      let data = yield call(statistics.getMissionStatistics, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      data = data.ret_content
      let {paidFeeSum,refundSum,arrearsSum,totalFeeSum,discountSum,paidFeeCount,refundCount,arrearsCount,totalFeeCount,discountCount,exceedFeeSum,exceedFeeCount} = data
      let statData = { paidFeeSum,refundSum,arrearsSum,totalFeeSum,discountSum,paidFeeCount,refundCount,arrearsCount,totalFeeCount,discountCount,exceedFeeSum,exceedFeeCount }
      statData.receivedFeeSum = parseInt(paidFeeSum)+parseInt(refundSum)
      let dataListPage = data.statisticsDataListPage.data?data.statisticsDataListPage.data:[]
      for(let node of dataListPage){
        node.receivedFee = parseInt(node.paidFee)+parseInt(node.refund)
      }
      yield put({
        type: 'updateState',
        payload: {
          dataList: dataListPage,
          count: parseInt(data.statisticsDataListPage.count),
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          dataLoading: false,
          statData,
          type: payload.type,
          userStatus,
          sortFlag: false
        },
      })
    },

    * getStatistics ({ payload }, { put, call, select }) {
      const { modalData, modalType } = yield select(_ => _.statisticsMission)
      const { sortList } = payload;
      modalData.dataLoading=true;
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
      if(modalType==2){
        payload.type=modalData.type
      }
      //查询当前
      let data = yield call(statistics.getMissionStatisticsDetail, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let dataList = data.ret_content.statisticsDataList?data.ret_content.statisticsDataList:[]
      for(let node of dataList){
        node.receivedFee = parseInt(node.paidFee)+parseInt(node.refund)
      }
      //插入总计的总计
      let temp = {
        subjectName: '总计',
        paidFee: data.ret_content.paidFeeSum,
        paidFeeCount: data.ret_content.paidFeeCount,
        refund: data.ret_content.refundSum,
        refundCount: data.ret_content.refundCount,
        arrears: data.ret_content.arrearsSum,
        arrearsCount: data.ret_content.arrearsCount,
        totalFee: data.ret_content.totalFeeSum,
        totalFeeCount: data.ret_content.totalFeeCount,
        discount: data.ret_content.discountSum,
        discountCount: data.ret_content.discountCount,
        receivedFee: parseInt(data.ret_content.paidFeeSum)+parseInt(data.ret_content.refundSum)
      }
      dataList.push(temp)
      modalData.dataList = dataList
      modalData.dataLoading=false;
      yield put({
        type: 'updateState',
        payload: {
          modalData,
        },
      })
    },

    * getDetailStatistics ({ payload }, { put, call, select }) {
      const { modalData } = yield select(_ => _.statisticsMission)
      modalData.spinning = true
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
      //modalData.stat.receivedFeeSum = parseInt(modalData.stat.paidFeeSum)+parseInt(modalData.stat.refundSum)+''
      modalData.spinning = false
      yield put({
        type: 'updateState',
        payload: {
          modalData,
        },
      })
    },

    * getDetailBillList ({ payload }, { put, call, select }) {
      const { sortList, missionId } = payload
      if (!missionId) {
        throw '请选择收费任务!'
      }
      const { modalData } = yield select(_ => _.statisticsMission)
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

    * showDetail ({ payload }, { put, call, select }) {
      const {modalType, missionId, type, missionName, userStatus} = payload
      delete payload.modalType
      let modalData = {
        info: {...payload},
        dataLoading: true,
        dataList: [],
        missionId,
        missionName,
        stat: {},
        pageNum: 1,
        pageSize: 20,
        type,
        displaySence: 'statisticsDisplay',
        sortSence: 'statisticsSort',
        statSence: 'statDataDisplay',
        dataType:0,
        dataTypeMap: {
          0:"展示全部",
          4:"仅显示欠费",
          // 1:"仅显示有账单",
          2:"仅显示有缴费",
          5:"仅显示超额缴费",
          3:"仅显示缴费完成"
        },
      }
      yield put({
        type: 'app/initDisplay', 
        payload: {params:
          [{sence:modalData.statSence, senceKey:payload.missionId, displayExtra:{}, userAttrList:config.statDataList}]
        }
      })
      //默认学生状态
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
          modalType,
        },
      })
      if(modalType==1){
        yield put({
          type: 'getDetailBillList',
          payload: {
            missionId,
            pageNum: 1,
            pageSize: 20,
            sortList:userDisplaySence['statisticsSort'].displayList
          },
        })
      }else{
        yield put({
          type: 'getStatistics',
          payload: {
            missionId,
            type,
            sortList:userDisplaySence['statisticsSort'].displayList
          },
        })
      }
    },


  },
})
