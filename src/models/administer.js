/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { pageModel } from './common'
import { Message } from 'antd'
import moment from 'moment'
import { getSortParam } from 'utils'
import md5 from 'md5'
import * as group from 'services/group'

export default modelExtend(pageModel, {
  namespace: 'administer',

  state: {
    modalVisible: false,
    modalType: null,
    modalAccount: null,
    modalDepart: null,

    pageNum: 1,
    pageSize: 20,
    accountList: [],
    count: 0,
    // searchName: '',
    dataLoading: true,

    departs: [],
    // departSelected: null,
    status: '0',
    typeExact: undefined,
    valueExact: undefined, 
    selectedAll: false,
    selectedOrders: [],
    typeExact: undefined,

    enabledVisible: false,
    disabledVisible: false,
    deleteVisible: false,
    manyDepartId: [],
    departTreeSearch: null,
    departTree: null,
    departMap: {},
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/administer') {
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
      // 获取部门树
      const departTreeData = yield call(group.getGroupMgrDepartTree)
      if (!departTreeData.success) {
        throw departTreeData
      } else if (departTreeData.ret_code != 1) {
        return Message.error(departTreeData.ret_content)
      }
      let departMap = {}
      let departTreeMap = {}
      const changeData = (data, path) => {
       data.forEach((index) => {
        index.show = false
        index.value = index.type +'_'+ index.id
        index.label = index.name
        index._path = path
        let tempPath = [...path]
        if(index.type == '2'){
          departMap[index.token] = index
        }
        if (index.groupDepartList) {
          index.children = index.groupDepartList
          tempPath.push(index.value)
          changeData(index.groupDepartList, tempPath)
        }
        // index.path = tempPath
        departTreeMap[index.value] = index
       })
     }
     changeData(departTreeData.ret_content, [])
     let departTree= departTreeData.ret_content?departTreeData.ret_content:[]

      yield put({
        type: 'updateState',
        payload: {
          pageNum: 1,
          dataLoading: false,
          departTree,
          departMap,
          departTreeMap
        },
      })
      yield put({
        type: 'getMgrAccountList',
        payload: {
          pageNum: 1,
          pageSize: 20,
        },
      })
    },

    * getMgrAccountList ({ payload }, { put, call, select }) {
      let {pageNum, pageSize, typeExact, valueExact, status, departMap, departTreeMap, departs} = yield select(_ => _.administer)
      if(payload.departs){
        departs = payload.departs
      }
      if(payload.pageNum){
        pageNum = payload.pageNum
      }
      if(payload.pageSize){
        pageSize = payload.pageSize
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      let param = {}
      param.status = status == '0'?null:status
      if(typeExact && valueExact){
        if(typeExact == '1'){
          param.id = valueExact
        }else if(typeExact == '2'){
          param.name = valueExact
        }else{
          param.phone = valueExact
        }
      }
      let tempDepart = departTreeMap[departs[0]]
      param.pageNum = pageNum
      param.pageSize = pageSize
      param.departId = payload.departId?payload.departId:tempDepart?tempDepart.id:null
      if(payload.token){
        param.gtoken = payload.token
      }else{
        param.gtoken = tempDepart?tempDepart.token:null
      }
      param.type = tempDepart?tempDepart.type:null
      const data = yield call(group.getGroupMgrAccountList, param)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      yield put({
        type: 'updateState',
        payload: {
          accountList: data.ret_content.data,
          count: parseInt(data.ret_content.count),
          pageNum,
          pageSize,
          dataLoading: false,
          departs
        },
      })
    },

    * deleteMgrDepart ({ payload }, { put, call }) {
      const data = yield call(group.deleteGroupMgrDepart, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      Message.success('部门删除成功')

      yield put({
        type: 'query',
      })
    },

    * updateMgrDepart ({ payload }, { put, call, select }) {
      const data = yield call(group.updateGroupMgrDepart, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      Message.success('部门修改成功')

      yield put({
        type: 'query',
      })
    },

    * searchStruct ({ payload }, { put, call, select }) {
      const {departTreeSearch,departTree} = payload
      const showTree = (index) => {
        index.show = true
        if(index.tempLate){
          showTree(index.tempLate)
        }
      }
      const changeData = (data, node) => {
        data.forEach((index) => {
          index.show = false
          if(node){
            index.tempLate = node
          }
          if( index.name.indexOf(departTreeSearch) >= 0){
            index.show = true
            if(index.tempLate){
              showTree(index.tempLate)
              // index.tempLate.show = true
            }
          }
          if (index.children) {
            changeData(index.children, index)
          }
        })
      }
      changeData(departTree)
      yield put({
        type: 'updateState',
        payload: {
          departTree,
          departTreeSearch
        },
      })
    },

    * updateMgrAccount ({ payload }, { put, call, select }) {
      const {pageNum, pageSize, manyDepartId, departMap, departs, departTreeMap} = yield select(_ => _.administer)
      let { user } = yield select(_ => _.app)
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      if (payload.password) {
        payload.password = md5(payload.password)
        delete payload.password_repeat
      }
      let departList = []
      for(let i = 0; i < manyDepartId.length; i++){
        let depart = manyDepartId[i].pop()
        let departId = departTreeMap[depart]?(departTreeMap[depart].type == '2'?'0':departTreeMap[depart].id):'0'
        departList.push({departId: departId, gtoken: departTreeMap[depart]?departTreeMap[depart].token:user.token})
      }
      payload.departList = JSON.stringify(departList)
      delete payload.departId
      const data = yield call(group.updateGroupMgrAccount, payload)

      if (!data.success) {
        yield put({
          type: 'updateState',
          payload: {
            dataLoading: false,
          },
        })
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
      Message.success('账户修改成功')
      // let depart = departs[0]?departs[0]:''

      yield put({
        type: 'updateState',
        payload: {
          dataLoading: false,
        },
      })
      yield put({
        type: 'getMgrAccountList',
        payload: {
          pageNum,
          pageSize,
          // departId: depart,
          // token: departs[0]?departTreeMap[depart].token:'',
        },
      })
    },

    * deleteMgrAccount ({ payload }, { put, call, select }) {
      const {accountList,} = yield select(_ => _.administer)
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
          enabledVisible: false,
          disabledVisible: false,
          deleteVisible: false,
        },
      })
      let ids = []
      if(payload.selectedOrders){
        ids = []
        for(let index of payload.selectedOrders){
          ids.push(accountList[index].id)
        }
      }
      const data = yield call(group.updateGroupMgrAcc, {id: payload.id?payload.id:ids.toString(), status: payload.status})
      if (!data.success) {
        yield put({
          type: 'updateState',
          payload: {
            dataLoading: false,
          },
        })
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
      if(payload.status == '1'){
        Message.success('账户启用成功')
      }else if(payload.status == '2'){
        Message.success('账户禁用成功')
      }else{
        Message.success('账户删除成功')
      }

      yield put({
        type: 'updateState',
        payload: {
          dataLoading: false,
          selectedOrders: [],
        },
      })
      yield put({
        type: 'getMgrAccountList',
        payload: {
        },
      })
    },

    * resetPwd ({ payload }, { put, call, select }) {
      payload.password = md5(payload.password)
      const data = yield call(group.updatePwd, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      Message.success('密码重置成功')
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
