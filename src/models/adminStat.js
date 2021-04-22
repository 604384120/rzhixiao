/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import * as structService from 'services/struct'
import * as statistics from 'services/statistics'
import * as group from 'services/group'
import { pageModel } from './common'
import { Message } from 'antd'
import moment from 'moment'
import { config, getSortParam, getYearFormat, getYearNew } from 'utils'

export default modelExtend(pageModel, {
  namespace: 'adminStat',

  state: {

    dataList: [],
    dataLoading: true,
    statData: null,
    statSence: 'statDataDisplay_admin',

    year: `${getYearNew()}`,
    beginDate: `${moment().format('YYYY-MM-DD')} 00:00:00`,
    endDate: `${moment().format('YYYY-MM-DD')} 23:59:59`,
    userStatus: ['在读'],

    type:'0',
    yearList: [],
    totalBegin: 0,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/adminStat') {
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
      yield put({
        type: 'app/initDisplay', 
        payload: {params:
            [{sence:'statDataDisplay',senceKey:'admin',userAttrList:config.statDataList
            // userAttrList:config.statDataList.filter((item)=>{return item.id != 'convertFee'})
          },],
        }
      })
      //获取学年列表
      let yearNow = moment().format("YYYY") - 10;
      let yearList = []
      for(let i=0;i<20;i++){
        yearList.push({year:(yearNow+i).toString()})
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: false,
          yearList,
        },
      })
    },

    * getDataList ({ payload }, { put, call, select }) {
      const { beginDate, endDate, userStatus, } = payload
      if (!beginDate) {
        throw '请选择开始时间!'
      }
      if (!endDate) {
        throw '请选择结束时间!'
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
      
      let data = yield call(group.getGroupTreeStatistics, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      data = data.ret_content
      let {paidFeeSum,refundSum,arrearsSum,totalFeeSum,discountSum,convertFeeSum,paidFeeCount,refundCount,arrearsCount,totalFeeCount,discountCount,exceedFeeSum,exceedFeeCount,convertFeeCount} = data.statisticsDataSum
      let statData = {paidFeeSum,refundSum,arrearsSum,totalFeeSum,discountSum,convertFeeSum,paidFeeCount,refundCount,arrearsCount,totalFeeCount,discountCount,exceedFeeSum,exceedFeeCount,convertFeeCount}
      statData.receivedFeeSum = parseInt(paidFeeSum)+parseInt(refundSum)
      
      let list = data.groupStatisticsData?data.groupStatisticsData:[]

      let index = 0
      const changeData = (data, num) => {
        for(let node of data){
          node._value = node.type+'_'+node.id
          node._index = index
          if(num){
            node._index = num
          }
          if(node.groupStatisticsData){
            node.children = node.groupStatisticsData
            changeData(node.groupStatisticsData, index++)
          }
        }
      }
      if(list){
        changeData(list)
      }

      yield put({
        type: 'updateState',
        payload: {
          dataList: list,
          type: payload.type,
          userStatus,
          dataLoading: false,
          statData,
          sortFlag: false,
        },
      })
    },


  },
})
