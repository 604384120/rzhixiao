/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import * as user from 'services/user'
import * as feeSubject from 'services/feeSubject'
import * as feeBill from 'services/feeBill'
import * as feeMission from 'services/feeMission'
import * as account from 'services/account'
import * as statistics from 'services/statistics'
import * as order from 'services/order'
import { pageModel } from './common'
import { Message } from 'antd'
import moment from 'moment'

export default modelExtend(pageModel, {
  namespace: 'statistics',

  state: {

    sortSence: 'statisticsAllSort',
    displaySence: 'statisticsAllDisplay',
    userSortExtra: {
      accountId:'操作员',
      payType:'支付方式',
      subjectId:'收费项目',
      missionId:'收费任务',
    },

    dateRangeType: 1,
    beginDate: `${moment().format('YYYY-MM-DD')}`,
    endDate: `${moment().format('YYYY-MM-DD')}`,
    dataLoading: true,
    userSortExtraMap:{},

    showSubject: false,

    totalBegin: 0,
    sumStatistics: {},
    dayStatistics: [],
    dayList:[],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/statistics') {
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
      const { userSortExtra, sortSence, displaySence } = yield select(_ => _.statistics)
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
      //获取所有经办人列表
      yield put({
        type: 'app/getRequestAccount', 
        payload: {}
      })
      //获取所有支付方式
      yield put({
        type: 'app/getRequestPayType', 
        payload: {}
      })
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: false,
          missionId: payload.missionId,
        },
      })
      const { beginDate, endDate } = yield select(_ => _.statistics)
      yield put({
        type:'getOverallStatistics',
        payload:{
          beginDate,
          endDate
        }
      })
    },

    * getOverallStatistics ({ payload = {} }, { call, put }) {
      const { sortList } = payload
      let tempList = []
      if (sortList && sortList.length > 0) {
        for (let sort of sortList) {
          if (sort._idSelected && sort._idSelected.length > 0) {
            if(sort.id == 'dateRange'){
              continue;
            }else if(sort.id == 'missionId'){
              payload.missionId = sort._idSelected.toString();
            }else if(sort.id == 'subjectId'){
              payload.subjectId = sort._idSelected.toString();
            }else if(sort.id == 'payType'){
              payload.payType = sort._idSelected.toString();
            }else if(sort.id == 'accountId'){
              payload.accountId = sort._idSelected.toString();
            }else{
              let tempSort = {}
              tempSort.attrId = sort.id
              if(sort._valueType && sort._valueType == '3'){
                tempSort.relateId = ''
                for (let select of sort._idSelected) {
                  tempSort.relateId += `${select},`
                }
              }else{
                tempSort.relateName = ''
                for (let select of sort._idSelected) {
                  tempSort.relateName += `${select},`
                }
              }
              tempList.push(tempSort)
            }
          }
        }
      }
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
      let showSubject = payload.showSubject
      //let showSubject = 1
      delete payload.showSubject
      let data = null
      if(showSubject == 1){
        data = yield call(statistics.getOverallStatisticsSubject, payload)
      }else{
        data = yield call(statistics.getOverallStatistics, payload)
      }
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

      let dayStatistics = data.ret_content.dayStatistics;
      let dayList = [];
      let id = 0;
      if(dayStatistics){
        for(let day of dayStatistics){
          let i = 0;
          let pos = 0
          if(day.typeStatistics){
            for(let type of day.typeStatistics){
              if(showSubject == 1){
                if(type.subjectStatistics && type.subjectStatistics.length>0){
                  //需要遍历项目
                  let j = 0
                  for(let subjuct of type.subjectStatistics){
                    let temp = {...subjuct};
                    if(i == 0&&j==0){
                      temp.date = day.date;
                      temp.rowSpan = 2;
                      pos = id
                    }else{
                      temp.rowSpan = 0;
                      dayList[pos].rowSpan++
                    }
                    if(j==0){
                      temp.subRowSpan = type.subjectStatistics.length+1
                    }else{
                      temp.subRowSpan = 0
                    }
                    temp.id = id++;
                    dayList.push(temp);
                    j++
                  }
                  temp = {
                    id: id++,
                    name: "小计",
                    rowSpan: 0,
                    paidFee: type.paidFee,
                    refund: type.refund,
                    paidFeeCount: type.paidFeeCount,
                    refundCount: type.refundCount,
                    realFee: type.realFee,
                    subRowSpan: 0
                  }
                  dayList[pos].rowSpan++
                  dayList.push(temp);
                }else{
                  let temp = {...type};
                  if(i == 0){
                    temp.date = day.date;
                    temp.rowSpan = 2
                    pos = id
                  }else{
                    temp.rowSpan = 0;
                    dayList[pos].rowSpan++
                  }
                  temp.id = id++;
                  temp.name = '小计'
                  dayList.push(temp);
                }
                i++;
              }else{
                let temp = {...type};
                if(i == 0){
                  temp.date = day.date;
                  temp.rowSpan = day.typeStatistics.length+1;
                }else{
                  temp.rowSpan = 0;
                }
                temp.id = id++;
                dayList.push(temp);
                i++;
              }
            }
          }
          let temp = {
            payType: "0",
            id: id++,
            rowSpan: 0,
            paidFee: day.paidFee,
            refund: day.refund,
            paidFeeCount: day.paidFeeCount,
            refundCount: day.refundCount,
            realFee: day.realFee,
          }
          dayList.push(temp);
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          sumStatistics: data.ret_content.sumStatistics,
          dayStatistics,
          dayList,
          dataLoading: false,
          sortFlag: false,
          showSubject
        },
      })
    },

  },
})
