import { routerRedux } from 'dva/router'
import * as userService from 'services/user'
import * as joinUserService from 'services/joinUser'
import * as structServive from 'services/struct'
import modelExtend from 'dva-model-extend'
import { model } from 'models/common'
import queryString from 'query-string'
import { Message } from 'antd'
import md5 from 'md5'

export default modelExtend(model, {
  namespace: 'joinUserInfo',

  state: {
    attrMap: {},
    tempTypeMap: {},
    typeMap: {
      1: '基础信息',
      2: '学籍信息',
      3: '住宿信息',
      4: '联系信息',
      5: '自定义字段',
    },
    joinUserInfoMap: {},
    userId: '',
    opHistoryVisible: false,
    departTree: null,
    departMap: null,
    lastStruct: undefined,

    opList: [],
    opCount: 0,
    opPageNum: 1,
    opPageSize: 15,
    opLoading: false,
    opNeedFLash: true,

    modalVisible: false,
    modalData: '',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/joinUserInfo') {
          dispatch({
            type: 'query',
            payload: {
              ...queryString.parse(location.search),
            },
          })
        }
      })
    },
  },

  effects: {
    * query ({ payload }, { put, call, select }) {
      let { userId } = yield select(_ => _.joinUserInfo)
      if (userId != payload.userId) {
        // 清理之前页面得数据
        yield put({
          type: 'updateState',
          payload: {
            opList: [],
            opCount: 0,
            opPageNum: 1,
            opPageSize: 15,
            opLoading: false,
            opNeedFLash: true,
            modalVisible: false,
            modalData: '',
            joinUserInfoMap: {},
          },
        })
      }

      let data = yield call(joinUserService.getJoinAttr, { type: '1' })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      let list = data.ret_content
      let tempMap = {}
      let attrMap = {}
      let attrDepartMap = undefined
      for (let node of list) {
        node.span = 0
        attrMap[node.id] = node
        if (!tempMap[node.type]) {
          tempMap[node.type] = {
            firstNode: node,
            list: [node],
          }
        } else {
          tempMap[node.type].list.push(node)
        }
        if(node.valueType == '3'){
          if(!attrDepartMap) attrDepartMap = {}
          attrDepartMap[node.relateId] = node
        }
      }

      if(attrDepartMap){
        // 获取struct
        let data = yield call(structServive.getStructList)
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }
        let lastStruct = undefined
        let path= []
        for (let struct of data.ret_content) {
          if (struct.status == '1') {
            path.push(struct.id)
            if(attrDepartMap[struct.id]){
              struct._path = [...path]
              lastStruct = struct
            }
          }
        }
        if(!lastStruct){
          return Message.error('请先设置学校结构')
        }

        // 获取部门树
        let param = {}
        if(lastStruct._path.length > 0){
          param.structId = lastStruct._path.toString()
        }
        const departTreeData = yield call(structServive.getStructItemTree, param)
        if (!departTreeData.success) {
          throw departTreeData
        } else if (departTreeData.ret_code != 1) {
          return Message.error(departTreeData.ret_content)
        }
        let disabledAttr = {}
        let departMap = {}
        const checkData = (data) => {
          data.forEach((index) => {
            index.value = index.id
            if(lastStruct._path.length == 0 || lastStruct.id==index.structId){
              index.isLeaf = true
            }else{
              index.isLeaf = false
            }
            if (index.children) {
              if(lastStruct.id != index.structId){
                checkData(index.children)
              }else{
                delete index.children
              }
              
            }
            if(lastStruct.id != index.structId && !disabledAttr[index.attrId]){
              //设置不可编辑属性
              disabledAttr[index.attrId] = {
                attrId: index.attrId,
                structId: index.id,
              }
              if(index.structItemAttrRelateMap){
                //存在关联属性
                for(let attrId in index.structItemAttrRelateMap){
                  disabledAttr[attrId] = {
                    attrId
                  }
                }
              }
            }
            departMap[index.id] = index
          })
        }
        checkData(departTreeData.ret_content)
        yield put({
          type: 'updateState',
          payload: {
            departMap,
            departTree:departTreeData.ret_content,
            disabledAttr,
            lastStruct
          },
        })
      }
     
      // 获取学生属性
      data = yield call(joinUserService.getJoinUserInfo, { id: payload.id })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let joinUserInfoMap = {}
      if (data.ret_content.attrList) {
        for (let node of data.ret_content.attrList) {
          joinUserInfoMap[node.attrId] = node
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          list,
          attrMap,
          tempTypeMap: tempMap,
          dataLoading: false,
          joinUserInfoMap,
          userId: payload.id,
          opHistoryVisible: false,
        },
      })
    },

    * getUserAttrValue ({ payload }, { put, call, select }) {
      let data = yield call(userService.getUserAttrValue, { id: payload.id })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      const { attrMap } = yield select(_ => _.joinUserInfo)
      attrMap[payload.id]._select = data.ret_content

      yield put({
        type: 'updateState',
        payload: {
          attrMap,
        },
      })
    },

    * updateJoinUserInfo ({ payload }, { put, call, select }) {
      let { tempTypeMap, attrMap, joinUserInfoMap } = yield select(_ => _.joinUserInfo)
      const tempList = []
      let type = payload.type
      for (let node of tempTypeMap[type].list) {
        let valueTemp = tempTypeMap[type]._changeTemp[node.id]
        let value = null
        if(node.isRequired=='1' && !valueTemp){
          return Message.error(node.name+"为必填项")
        }
        if (joinUserInfoMap[node.id]) {
          if (node.valueType == '1') {
            value = joinUserInfoMap[node.id].relateName
          } else {
            value = joinUserInfoMap[node.id].relateId
          }
        }

        if ((!valueTemp && !value) || (valueTemp == value)) {
          continue
        }
        let temp = {
          attrId: node.id,
        }
        if (node.valueType == '1') {
          temp.relateName = valueTemp
        } else {
          temp.relateId = valueTemp
        }
        tempList.push(temp)
      }
      if (tempList.length <= 0) {
        tempTypeMap[type]._editable = false
        yield put({
          type: 'updateState',
          payload: {
            tempTypeMap,
          },
        })
        return
      }
      let data = yield call(joinUserService.updateJoinUser, { id: payload.id, attrList: JSON.stringify(tempList) })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      Message.success('操作成功')

      // 获取学生属性
      data = yield call(joinUserService.getJoinUserInfo, { id: payload.id })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      //清空所有的map
      joinUserInfoMap = {};
      if (data.ret_content.attrList) {
        for (let node of data.ret_content.attrList) {
          joinUserInfoMap[node.attrId] = node
        }
      }
      tempTypeMap[type]._editable = false
      yield put({
        type: 'updateState',
        payload: {
          joinUserInfoMap,
          tempTypeMap,
          opNeedFLash: true,
        },
      })
    },

    * changeOpHistoryVisible ({ payload }, { put, call, select }) {
      let {
        opList, opPageNum, opPageSize, userId, opNeedFLash,
      } = yield select(_ => _.joinUserInfo)
      if (payload.visible && opNeedFLash) {
        let data = yield call(joinUserService.getJoinUserOperate, { id: userId, pageNum: opPageNum, pageSize: opPageSize })
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }

        yield put({
          type: 'updateState',
          payload: {
            opList: data.ret_content.data,
            opLoading: false,
            opCount: data.ret_content.count,
            opNeedFLash: false,
          },
        })
      }

      yield put({
        type: 'updateState',
        payload: {
          opHistoryVisible: payload.visible,
        },
      })
    },

    * getUserOperate ({ payload }, { put, call, select }) {
      yield put({
        type: 'updateState',
        payload: {
          opLoading: true,
        },
      })
      let {
        opList, opPageNum, opPageSize, userId,
      } = yield select(_ => _.joinUserInfo)

      let data = yield call(joinUserService.getJoinUserOperate, { id: payload.id, pageNum: payload.pageNum, pageSize: payload.pageSize })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      opList = [...opList, ...data.ret_content.data]

      yield put({
        type: 'updateState',
        payload: {
          opList,
          opLoading: false,
          opCount: data.ret_content.count,
          opPageNum: payload.pageNum,
          opPageSize: payload.pageSize,
        },
      })
    },

    * getStructItemList ({ payload }, { put, call, select }) {
      const { departMap, lastStruct, disabledAttr } = yield select(_ => _.joinUserInfo)
      payload.pageNum = 1
      payload.structId = lastStruct.id
      const {callback} = payload
      delete payload.callback
      let data = yield call(structServive.getItemList, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let list = data.ret_content.data

      for(let node of list){
        node.label = node.name
        node.attrId = lastStruct.attrId
        node.value = node.id
        node.children = undefined
        node.isLeaf = true
        if(node.structItemAttrRelateEntities){
          node.structItemAttrRelateMap = {}
          for(let attr of node.structItemAttrRelateEntities){
            node.structItemAttrRelateMap[attr.attrId] = attr
            if(!disabledAttr[attr.attrId]){
              disabledAttr[attr.attrId] = {
                attrId: attr.attrId
              }
            }
          }
        }
        departMap[node.id] = node
      }
      departMap[payload.pid].children = list
      departMap[payload.pid].loading = false
      if(callback){
        callback()
      }
      yield put({
        type: 'updateState',
        payload: {
          departMap,
        },
      })
    },
  },
})
