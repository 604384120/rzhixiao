/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import * as structService from 'services/struct'
import * as credit from 'services/credit'
import { pageModel } from './common'
import { Message } from 'antd'
import { getFormat } from 'utils'

export default modelExtend(pageModel, {
  namespace: 'creditRule',

  state: {
    modalVisible: false,
    modalData: {},

    pageNum: 1,
    pageSize: 20,
    count: 0,
    dataList: [],
    dataLoading: true,
    searchName: '',
    selectedRules: [],

    structId: undefined,
    structItemPid: {},

    structList: [],
    structMap: {},
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/creditRule') {
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
          structList,
          structMap,
        },
      })
    },

    * getAllItemList ({ payload }, { put, call, select }) {
      const { structList,structMap } = yield select(_ => _.creditRule)
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
      const { structList } = yield select(_ => _.creditRule)
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
          statData: {},
          sortFlag: true
        },
      })
    },
    * changeStructItem ({ payload }, { put, call, select }) {
      const { structMap, structList  } = yield select(_ => _.creditRule)
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
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })

      let data = yield call(credit.getCreditRuleList, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      data = data.ret_content
      let tempList = data.data?data.data:[]
      let dataList = []
      for(let node of tempList){
        node[node.structId] = node.name
        for(let pnode of node.structItemEntities){
          node[pnode.structId] = pnode.name
        }
        if(node.fee){
          node.fee = getFormat(node.fee)
          node._fee = node.fee
        }
        dataList.push(node)
      }
      yield put({
        type: 'updateState',
        payload: {
          dataList,
          count: parseInt(data.count),
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          dataLoading: false,
          selectedRules:[],
          sortFlag: false
        },
      })
    },

    * updateRule ({ payload }, { put, call, select }) {
      const { dataList, dataLoading  } = yield select(_ => _.creditRule)
      if(dataLoading){
        throw "请不要重复设置"
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      const fee = payload.fee
      const tempArr = payload.structItemId
      if(tempArr){
        payload.structItemId = tempArr.toString()
      }
      payload.fee = Math.round(fee*100).toString()
      let data = yield call(credit.updateCreditRule, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      Message.success('设置成功')
      for(let id of tempArr){
        const node = dataList.filter(item=>item.id===id)[0]
        node.fee = fee
        node._fee = fee
        node._feeEditVisible = false
      }
      yield put({
        type: 'updateState',
        payload: {
          dataList,
          batchVisible: false,
          dataLoading: false
        },
      })
    },

  },
})
