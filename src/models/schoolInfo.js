/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import * as userService from 'services/user'
import { pageModel } from './common'
import { Message } from 'antd'
import { getFormat } from 'utils'
import * as orderService from 'services/order'

export default modelExtend(pageModel, {
  namespace: 'schoolInfo',

  state: {
    editUser: {},
    editVisible: false,
    schoolName: '',
    configId: '1',
    orderCancelTime: null,
    configStatList:[{
      id:'totalFee',
      name:'应收总额',
      position:0,
      status:false
    },{
        id:'discount',
        name:'减免总额',
        position:0,
        status:false
      },{
        id:'receivedFee',
        name:'收费总额',
        position:0,
        status:false
      },{
        id:'refund',
        name:'退费总额',
        position:0,
        status:false
      },{
        id:'paidFee',
        name:'实收总额',
        position:0,
        status:false
      },{
        id:'arrears',
        name:'欠费总额',
        position:0,
        status:false
      },{
        id:'exceedFee',
        name:'超收总额',
        position:0,
        status:false
      },{
        id:'convertFee',
        name:'结转总额',
        position:0,
        status:false
      },
    ],
    joinReview:'0',
    joinBill:'0',
    joinGrade: undefined,
    verifyPay:'1',
    fee_limit:'1',
    arrears_ignore: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/schoolInfo') {
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
      //获取所有年级
      yield put({
        type: 'app/getRequestGrade', 
        payload: {}
      })
      const data = yield call(userService.getSchool, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let editUser = {}
      editUser.id = data.ret_content.id
      editUser.schoolName = data.ret_content.name
      editUser.logo = data.ret_content.logo
      editUser.logoInfo = data.ret_content.logoInfo
      editUser.orderCancelTime = data.ret_content.orderCancelTime
      editUser.joinReview = data.ret_content.joinReview
      editUser.joinBill = data.ret_content.joinBill
      editUser.joinGrade = data.ret_content.joinGrade
      editUser.verifyPay = data.ret_content.verifyPay
      editUser.fee_limit = data.ret_content.fee_limit
      editUser.arrears_ignore = data.ret_content.arrears_ignore
      const { configStatList } = yield select(_ => _.schoolInfo)
      let configStatMap = {}
      for(let node of configStatList){
        configStatMap[node.id] = node
      }
      yield put({
        type: 'updateState',
        payload: {
          configStatMap,
          editUser,
          schoolName: editUser.schoolName,
          orderCancelTime: data.ret_content.orderCancelTime,
          joinReview: data.ret_content.joinReview,
          joinBill: data.ret_content.joinBill,
          joinGrade: data.ret_content.joinGrade,
          verifyPay: data.ret_content.verifyPay,
          fee_limit: data.ret_content.fee_limit,
          arrears_ignore: data.ret_content.arrears_ignore,
        },
      })
    },

    * updateSchool ({ payload }, { call, put, select }) {
      const { user } = yield select(_ => _.app)
      const { editUser } = yield select(_ => _.schoolInfo)
      user.id = payload.id
      user.schoolName = payload.name
      user.logoInfo = payload.logoInfo
      if(payload.joinGrade){
        payload.joinGrade = payload.joinGrade.toString()
      }
      if(payload.arrears_ignore){
        payload.arrears_ignore = payload.arrears_ignore.toString()
      }
      const data = yield call(userService.updateSchoolSubmit, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      // let schoolInfo = yield select(_ => _.schoolInfo)
      editUser.schoolName = payload.name
      editUser.orderCancelTime = payload.orderCancelTime
      editUser.joinReview = payload.joinReview
      editUser.joinBill = payload.joinBill
      editUser.joinGrade = payload.joinGrade
      editUser.verifyPay = payload.verifyPay
      editUser.fee_limit = payload.fee_limit
      editUser.arrears_ignore = payload.arrears_ignore
      yield put({
        type: 'updateState',
        payload: {
          editVisible: false,
          editUser,
        },
      })
    },

    * getOrderPayType ({ payload }, { call, put, select }) {
        const data = yield call(orderService.getOrderPayType, payload)
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }
        let payTypeList = data.ret_content;
        let payTypeNameMap = {};
        for (let payType of payTypeList) {
          payTypeNameMap[payType.payType] = payType.name;
        }
        yield put({
          type: 'updateState',
          payload: {
            payTypeList,
            payTypeNameMap,
            editVisible: false,
          },
        })
    },

    * updateOrderPayType ({ payload }, { call, put, select }) {
      payload.id = payload.data.id
      payload.name = payload.data.name
      payload.rate = payload.data.rate
      delete payload.data
      const data = yield call(orderService.updateOrderPayType, payload)
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
      yield put({
        type: 'getOrderPayType',
        payload: {
        },
      })
    },

    * getDisplayAttr ({ payload }, { call, put, select }) {
      let data = yield call(userService.getDisplayAttr, { accountId:'0',sence:'statDataDisplay' })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const { configStatMap,configStatList } = yield select(_ => _.schoolInfo)
      for(let node of data.ret_content){
        if(configStatMap[node.id]){
          configStatMap[node.id].status = true
          configStatMap[node.id].position = node.position
        }
      }
      // configStatList.filter((item)=>{
      //   if(!item.status){
      //     item.position = 0
      //   }
      // })
      yield put({
        type: 'updateState',
        payload: {
          // configStatList,
          configStatMap,
          editVisible:false
        },
      })
    },
    
    * updateDisplayAttr ({ payload }, { call, put, select }) {
      const { configStatList } = yield select(_ => _.schoolInfo)
      let tempStr = ''
      let temp = []
      temp = configStatList.filter((item)=>item.status)
      temp.sort(function(a, b){return a.position-b.position})
      for(let attr of temp){
        tempStr += `${attr.id},`
      }
      let data = yield call(userService.updateDisplayAttr, { accountId:'0',sence: 'statDataDisplay', attrList: tempStr })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      Message.success('设置成功')
      yield put({
        type: 'getDisplayAttr',
        payload: {
        },
      })
    }


  },
})
