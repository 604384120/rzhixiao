/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import * as feeSubject from 'services/feeSubject'
import * as user from 'services/user'
import * as feeBill from 'services/feeBill'
import * as feeRule from 'services/feeRule'
import * as orderService from 'services/order'
import * as account from 'services/account'
import { pageModel } from './common'
import { Message } from 'antd'
import { getFormat, getSortParam } from 'utils'
import { routerRedux } from 'dva/router';

export default modelExtend(pageModel, {
  namespace: 'counter',

  state: {
    modalVisible: false,
    modalData: [],
    showUserTable: true,
    printCheck: 0,
    modalPayType: 3,
    modalPayTime: "",
    gotoUser: false,

    sortSence: 'counterSort',
    displaySence: 'counterDisplay',
    userSortExtra: {},

    userCurrent: null,

    pageNum: 1,
    pageSize: 20,
    count: 0,
    userList: [],
    searchName: '',
    dataLoading: true,

    missionList:[],
    missionCurrent:null,

    orderList:[],
    orderReturnList:[],
    billAdjustList:[],
    billDeferredList:[],
    billDiscountList:[],

    defStandMap: null,
    disStandMap: null,
    remark: '',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/counter') {
          const payload = queryString.parse(location.search)
          dispatch({
            type: 'query',
            payload,
          })
          dispatch({
            type: 'updateState',
            payload: {
              searchName: '',
            },
          })
        }
      })
    },
  },

  effects: {
    * query ({ payload = {} }, { call, put, select }) {
      const { userSortExtra, sortSence, displaySence } = yield select(_ => _.counter)
      yield put({
        type: 'app/initDisplay', 
        payload: {params:
            [{sence:displaySence, displayExtra:{}},{sence:sortSence, displayExtra:userSortExtra, defaultType: '1'}]
          }
      })

      //获取支付方式
      yield put({
        type: 'app/getRequestPayType', 
        payload: {}
      })
      //获取所有项目
      yield put({
        type: 'app/getRequestSubject', 
        payload: {}
      })
      // 获取用户列表
      const { pageNum, pageSize } = yield select(_ => _.counter)
      let data = yield call(user.getUserList, { pageNum, pageSize })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const userList = data.ret_content.data
      for (let userNode of userList) {
        if (userNode.attrList) {
          for (let attr of userNode.attrList) {
            userNode[attr.attrId] = attr.relateName
          }
        }
      }
      if(userList.length == 1){
        yield put({
          type: 'getMissionList',
          payload: {
            userId:userList[0].id
          },
        })
        yield put({
          type: 'getOrderList',
          payload: {
            userId:userList[0].id
          },
        })
        yield put({
          type: 'getOrderReturnList',
          payload: {
            userId:userList[0].id
          },
        })
        yield put({
          type: 'getBillOperateList',
          payload: {
            userId:userList[0].id
          },
        })
        yield put({
          type: 'updateState',
          payload: {
            userList,
            userCurrent: userList[0],
            dataLoading: false,
            showUserTable: false,
          },
        })
      }else{
        yield put({
          type: 'updateState',
          payload: {
            userList,
            count: parseInt(data.ret_content.count),
            dataLoading: false,
            sortFlag: false,
          },
        })
      }
    },

    * getDeferredStandList ({ payload = {} }, { call, put, select }) {
      if(!payload.defStandMap){
        const { requestMap } = yield select(_ => _.app)
        let subjectMap = requestMap['subjectMap']
        let defStandMap = {}
        //获取所有项目的缓缴标准
        let data = yield call(feeRule.getDeferredStandList, {status:"1"})
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }
        let standList = data.ret_content?data.ret_content:[]
        for (let node of standList) {
          if(!subjectMap[node.subjectId]){
            continue
          }
          defStandMap[node.id] = node
        }
        yield put({
          type: 'updateState',
          payload: {
            defStandMap,
            modalVisible: payload.modalVisible,
            modalData: payload.modalData,
            missionCurrent: payload.missionCurrent,
            modalType:payload.modalType
          },
        })
      }else{
        yield put({
          type: 'updateState',
          payload: {
            modalVisible: payload.modalVisible,
            modalData: payload.modalData,
            missionCurrent: payload.missionCurrent,
            modalType:payload.modalType
          },
        })
      }
    },

    * getDiscountStandList ({ payload = {} }, { call, put, select }) {
      if(!payload.disStandMap){
        const { requestMap } = yield select(_ => _.app)
        let subjectMap = requestMap['subjectMap']
        let disStandMap = {}
        //获取所有减免标准
        let data = yield call(feeRule.getDiscountStandList, {status:"1"})
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }
        let standList = data.ret_content?data.ret_content:[]
        for (let node of standList) {
          if(!subjectMap[node.subjectId]){
            continue
          }
          disStandMap[node.id] = node
        }
        yield put({
          type: 'updateState',
          payload: {
            disStandMap,
            modalVisible: payload.modalVisible,
            modalData: payload.modalData,
            missionCurrent: payload.missionCurrent,
            modalType:payload.modalType
          },
        })
      }else{
        yield put({
          type: 'updateState',
          payload: {
            modalVisible: payload.modalVisible,
            modalData: payload.modalData,
            missionCurrent: payload.missionCurrent,
            modalType:payload.modalType
          },
        })
      }
      
    },

    * getUserList ({ payload = {} }, { call, put, select }) {
      const { sortList } = payload
      let tempList = getSortParam(sortList)
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

      let data = yield call(user.getUserList, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const userList = data.ret_content.data
      for (let userNode of userList) {
        if (userNode.attrList) {
          for (let attr of userNode.attrList) {
            userNode[attr.attrId] = attr.relateName
          }
        }
      }
      if(userList.length == 1){
        yield put({
          type: 'getMissionList',
          payload: {
            userId:userList[0].id
          },
        })
        yield put({
          type: 'getOrderList',
          payload: {
            userId:userList[0].id
          },
        })
        yield put({
          type: 'getOrderReturnList',
          payload: {
            userId:userList[0].id
          },
        })
        yield put({
          type: 'getBillOperateList',
          payload: {
            userId:userList[0].id
          },
        })
        yield put({
          type: 'updateState',
          payload: {
            userList,
            dataLoading: false,
            userCurrent: userList[0],
            orderList:[],
            missionList:[],
            missionCurrent:null,
            sortFlag: false,
            showUserTable: false,
          },
        })
      }else{
        yield put({
          type: 'updateState',
          payload: {
            userList,
            count: parseInt(data.ret_content.count),
            searchName: payload.key,
            pageNum: payload.pageNum,
            pageSize: payload.pageSize,
            dataLoading: false,
            userCurrent:null,
            orderList:[],
            missionList:[],
            missionCurrent:null,
            sortFlag: false,
            missionSum: null,
            showUserTable: true,
          },
        })
      }
    },

    * getMissionList ({ payload }, { put, call, select }) {
      yield put({
        type: 'updateState',
        payload: {
          dataLoading:true,
        },
      })

      let data = yield call(feeBill.getMissionByUser, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      let missionList = data.ret_content?data.ret_content:[]
      let missionSum = {
        totalFee: 0,
        discount: 0,
        paidFee: 0,
        arrears: 0,
        refund: 0,
      }
      for(let node of missionList){
        missionSum.totalFee += parseInt(node.totalFee)
        missionSum.discount += parseInt(node.discount)
        missionSum.refund += parseInt(node.refund)
        missionSum.paidFee += parseInt(node.paidFee) + parseInt(node.refund)
        missionSum.arrears += parseInt(node.totalFee) - node.discount - node.paidFee - node.loans
        if(node.feeBillLists){
          for(let bill of node.feeBillLists){
            bill.arrears = parseInt(bill.totalFee) - bill.discount - bill.paidFee - bill.loans
            bill.paidFee = parseInt(bill.paidFee) + parseInt(bill.refund)
          }
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          missionList,
          dataLoading:false,
          missionSum
        },
      })
    },

    * getOrderList ({ payload }, { put, call, select }) {
      yield put({
        type: 'updateState',
        payload: {
          dataLoading:true,
        },
      })

      let data = yield call(feeBill.getOrderByUser, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      let orderList = data.ret_content?data.ret_content:[];
      for(let order of orderList){
        if(order.feeBillLists){
          for(let bill of order.feeBillLists){
            bill._order = order
            bill.templateCode = order.templateCode
            if(!bill.receiptNo){
              bill._checked = true
            }
          }
        }
      }

      yield put({
        type: 'updateState',
        payload: {
          orderList,
          dataLoading:false,
        },
      })
    },

    * getOrderReturnList ({ payload }, { put, call, select }) {
      yield put({
        type: 'updateState',
        payload: {
          dataLoading:true,
        },
      })

      let data = yield call(feeBill.getOrderReturnByUser, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      let orderReturnList = data.ret_content?data.ret_content:[];
      for(let order of orderReturnList){
        if(order.feeBillLists){
          for(let bill of order.feeBillLists){
            bill._order = order
          }
        }
      }

      yield put({
        type: 'updateState',
        payload: {
          orderReturnList,
          dataLoading:false,
        },
      })
    },

    * getBillOperateList ({ payload }, { put, call, select }) {
      yield put({
        type: 'updateState',
        payload: {
          dataLoading:true,
        },
      })

      let data = yield call(feeBill.getFeeBillOperateHistory, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      let arr = data.ret_content.feeBillOperateHistoryList&&data.ret_content.feeBillOperateHistoryList.data
        ?data.ret_content.feeBillOperateHistoryList.data:[];
      let billAdjustList = []
      let billDeferredList = []
      let billDiscountList = []
      for(let node of arr){
        if(node.snapshot){
          node.snapshot = JSON.parse(node.snapshot);
        }
        if(node.info){
          node.info = JSON.parse(node.info);
        }
        if(node.mask == '1' || node.mask == '0'){
          billAdjustList.push(node)
        }else if(node.mask == '2'){
          billDiscountList.push(node)
        }else{
          billDeferredList.push(node)
        }
      }

      yield put({
        type: 'updateState',
        payload: {
          billAdjustList,
          billDeferredList,
          billDiscountList,
          dataLoading:false,
        },
      })
    },

    * refundOrder ({ payload }, { put, call, select }) {
      const { dataLoading } = yield select(_ => _.counter)
      if(dataLoading){
        //正在处理中
        throw "请不要重复点击"
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      const data = yield call(orderService.refundOrder, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      Message.success('退费成功')
      const { userCurrent } = yield select(_ => _.counter)

      yield put({
        type: 'getMissionList',
        payload: {
          userId:userCurrent.id
        },
      })
      yield put({
        type: 'getOrderReturnList',
        payload: {
          userId:userCurrent.id
        },
      })
    },

    * cancelOrder ({ payload }, { put, call, select }) {
      const { dataLoading } = yield select(_ => _.counter)
      if(dataLoading){
        //正在处理中
        throw "请不要重复点击"
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      const data = yield call(orderService.cancelOrder, payload)
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

      Message.success('冲正成功')
      const { userCurrent } = yield select(_ => _.counter)

      yield put({
        type: 'getMissionList',
        payload: {
          userId:userCurrent.id
        },
      })
      yield put({
        type: 'getOrderList',
        payload: {
          userId:userCurrent.id
        },
      })
    },

    * cancelOrderReturn ({ payload }, { put, call, select }) {
      const { dataLoading } = yield select(_ => _.counter)
      if(dataLoading){
        //正在处理中
        throw "请不要重复点击"
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      const data = yield call(orderService.cancelOrderReturn, payload)
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

      Message.success('作废成功')
      const { userCurrent } = yield select(_ => _.counter)

      yield put({
        type: 'getMissionList',
        payload: {
          userId:userCurrent.id
        },
      })
      yield put({
        type: 'getOrderReturnList',
        payload: {
          userId:userCurrent.id
        },
      })
    },

    * completeOrder ({ payload }, { put, call, select }) {
      const { dataLoading, remark } = yield select(_ => _.counter)
      if(dataLoading){
        //正在处理中
        throw "请不要重复点击"
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading:true,
        },
      })
      payload.remark = remark
      const data = yield call(feeBill.completeOrder, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        yield put({
          type: 'updateState',
          payload: {
            dataLoading:false,
          },
        })
        return Message.error(data.ret_content)
      }

      Message.success('缴费成功')
      yield put({
        type: 'updateState',
        payload: {
          modalVisible:false,
          modalData:[],
          modalPayType:3
        },
      })
      //重新获取订单数据
      yield put({
        type: 'getMissionList',
        payload: {
          userId:payload.userId
        },
      })
      yield put({
        type: 'getOrderList',
        payload: {
          userId:payload.userId
        },
      })
    },

    * completeOrderReturn ({ payload }, { put, call, select }) {
      const { dataLoading, remark, gotoUser, userCurrent } = yield select(_ => _.counter)
      if(dataLoading){
        //正在处理中
        throw "请不要重复点击"
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading:true,
        },
      })
      payload.remark = remark
      const data = yield call(orderService.completeOrderReturn, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        yield put({
          type: 'updateState',
          payload: {
            dataLoading:false,
          },
        })
        return Message.error(data.ret_content)
      }

      Message.success('退费成功')
      yield put({
        type: 'updateState',
        payload: {
          modalVisible:false,
          modalData:[],
          modalPayType:3
        },
      })
      if(gotoUser && userCurrent){
        yield put(routerRedux.push({
          pathname:'/userInfo',
          search: queryString.stringify({
            id : userCurrent.id
          }),
        }))
      }
      //重新获取订单数据
      yield put({
        type: 'getMissionList',
        payload: {
          userId:payload.userId
        },
      })
      yield put({
        type: 'getOrderList',
        payload: {
          userId:payload.userId
        },
      })
      yield put({
        type: 'getOrderReturnList',
        payload: {
          userId:payload.userId
        },
      })
    },

    * convertOrder ({ payload }, { put, call, select }) {
      const { dataLoading,userCurrent } = yield select(_ => _.counter)
      if(dataLoading){
        //正在处理中
        throw "请不要重复点击"
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading:true,
        },
      })
      const data = yield call(orderService.convertOrder, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        yield put({
          type: 'updateState',
          payload: {
            dataLoading:false,
          },
        })
        return Message.error(data.ret_content)
      }

      Message.success('结转成功')
      yield put({
        type: 'updateState',
        payload: {
          modalVisible:false,
          modalData:[],
          modalPayType:3
        },
      })
      //重新获取订单数据
      yield put({
        type: 'getMissionList',
        payload: {
          userId:userCurrent.id
        },
      })
      yield put({
        type: 'getOrderList',
        payload: {
          userId:userCurrent.id
        },
      })
    },

    * updateBills ({ payload }, { put, call, select }) {
      let { dataLoading,userCurrent } = yield select(_ => _.counter)
      const { param } = payload

      if(dataLoading){
        return Message.error("请不要重复点击")
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true
        },
      })
      let data = yield call(feeBill.updateBatchBill, payload)
      
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        yield put({
          type: 'updateState',
          payload: {
            dataLoading: false
          },
        })
        return Message.error(data.ret_content)
      }
      //重新获取订单数据
      yield put({
        type: 'getMissionList',
        payload: {
          userId:userCurrent.id
        },
      })
      yield put({
        type: 'getOrderList',
        payload: {
          userId:userCurrent.id
        },
      })
      yield put({
        type: 'getOrderReturnList',
        payload: {
          userId:userCurrent.id
        },
      })
      yield put({
        type: 'getBillOperateList',
        payload: {
          userId:userCurrent.id
        },
      })
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: false
        },
      })
    },

    * showAdjust ({ payload }, { put, call, select }) {
      const {modalData, missionCurrent} = payload
      const data = yield call(feeSubject.getSubjectList, {missionId: missionCurrent.id})
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        yield put({
          type: 'updateState',
          payload: {
            dataLoading:false,
          },
        })
        return Message.error(data.ret_content)
      }
      let subjectList = data.ret_content.data
      let tempArr = [];
      for(let subject of subjectList){
        let addFlag = true;
        for (let node of modalData) {
          if(subject.id == node.subjectId){
            node._totalFee = getFormat(node.totalFee)
            node._reason = node.reason
            node.status = "1"
            node._status = "1"
            tempArr.push({...node})
            addFlag = false;
            break;
          }
        }
        if(addFlag){
          let tempNode = {
            id:"_add_"+subject.id,
            subjectId:subject.id,
            subjectName:subject.name,
            totalFee: 0,
            _totalFee: 0,
            status: '0',
            _status: '0',
            reason: '',
            _reason: '',
            _add: true,
          }
          tempArr.push(tempNode);
        }
      }

      yield put({
        type: 'updateState',
        payload: {
          modalVisible: true,
          modalData: tempArr,
          missionCurrent,
          modalType: 3,
        },
      })
    },


    * showCharge ({ payload }, { put, call, select }) {
      const data = yield call(account.getCurrentTime)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        yield put({
          type: 'updateState',
          payload: {
            dataLoading:false,
          },
        })
        return Message.error(data.ret_content)
      }

      yield put({
        type: 'updateState',
        payload: {
          modalPayTime: data.ret_content,
          ...payload
        },
      })
    },
  },

  reducers: {

    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

  },
})
