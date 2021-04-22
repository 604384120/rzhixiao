import { routerRedux } from 'dva/router'
import * as userService from 'services/user'
import modelExtend from 'dva-model-extend'
import { model } from 'models/common'
import queryString from 'query-string'
import { Message } from 'antd'
import md5 from 'md5'

export default modelExtend(model, {
  namespace: 'userAttr',

  state: {
    dataLoading: true,
    list: [],
    attrMap: {},
    tempTypeMap: {},
    typeMap: {
      1: '基础信息',
      2: '学籍信息',
      3: '住宿信息',
      4: '联系信息',
      5: '自定义字段',
    },
    disabledDisplayArr: [
      "姓名","学号","身份证件号"
    ],

    modalVisible: false,
    valueList: [],
    valueMap: {},
    modalAttrId: '',
    modalAttrName: '',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/userAttr') {
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
      let data = yield call(userService.getUserAttr, { status: '1,2' })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      let list = data.ret_content
      let tempMap = {}
      let attrMap = {}
      for (let node of list) {
        node.span = 0
        attrMap[node.id] = node
        if (!tempMap[node.type]) {
          node.span = 1
          tempMap[node.type] = {
            firstNode: node,
            list: [node],
          }
        } else {
          tempMap[node.type].firstNode.span++
          tempMap[node.type].list.push(node)
        }
      }

      let addNode = {
        id: '_add',
        name: '',
        status: '',
        _add: true,
        type: '5',
      }
      if (tempMap['5']) {
        addNode.span = 0
        tempMap['5'].firstNode.span++
        tempMap['5'].list.push(addNode)
      }else{
        addNode.span = 1
        let addList = []
        tempMap['5'] = {}
        addList.push(addNode)
        tempMap['5'].list = addList
      }
      attrMap._add = addNode
      
      let tempList = []
      for (let type in tempMap) {
        tempList = [...tempList, ...tempMap[type].list]
      }

      yield put({
        type: 'updateState',
        payload: {
          list: tempList,
          attrMap,
          tempTypeMap: tempMap,
          dataLoading: false,
        },
      })
    },
    * updateUserAttrStatus ({ payload }, { put, call, select }) {
      let data = yield call(userService.updateUserAttrStatus, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      Message.success('设置成功')

      const { attrMap } = yield select(_ => _.userAttr)
      attrMap[payload.id]._editable = false
      attrMap[payload.id].status = payload.status
      attrMap[payload.id].userShow = payload.userShow
      yield put({
        type: 'updateState',
        payload: {
          attrMap,
        },
      })
    },

    * addUserAttr ({ payload }, { put, call }) {
      let data = yield call(userService.addUserAttr, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      Message.success('添加成功')

      yield put({
        type: 'query',
      })
    },

    * updateUserAttrValue ({ payload }, { put, call, select }) {
      let data = yield call(userService.updateUserAttrValue, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      Message.success('更新成功')

      const { modalAttrId, modalAttrName } = yield select(_ => _.userAttr)
      yield put({
        type: 'showAttrValue',
        payload: {
          id: modalAttrId,
          name: modalAttrName,
        },
      })
    },

    * addUserAttrValue ({ payload }, { put, call, select }) {
      let data = yield call(userService.addUserAttrValue, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      Message.success('添加成功')

      const { modalAttrId, modalAttrName } = yield select(_ => _.userAttr)
      yield put({
        type: 'showAttrValue',
        payload: {
          id: modalAttrId,
          name: modalAttrName,
        },
      })
    },

    * deleteUserAttrValue ({ payload }, { put, call, select }) {
      let data = yield call(userService.deleteUserAttrValue, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      Message.success('删除成功')

      const { modalAttrId, modalAttrName } = yield select(_ => _.userAttr)
      yield put({
        type: 'showAttrValue',
        payload: {
          id: modalAttrId,
          name: modalAttrName,
        },
      })
    },

    * deleteUserAttr ({ payload }, { put, call, select }) {
      payload.status = '0'
      const data = yield call(userService.deleteUserAttr, payload)
      if (!data.success) {
		        throw data
		    } else if (data.ret_code != 1) {
		      return Message.error(data.ret_content)
		    }
      Message.success('删除成功')
      yield put({
        type: 'query'
      })
    },

    * showAttrValue ({ payload }, { put, call, select }) {
      let data = yield call(userService.getUserAttrValue, { id: payload.id })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      let list = data.ret_content
      let valueMap = {}
      for (let node of list) {
        valueMap[node.id] = node
      }
      if(payload.valueDefault!='1'){
        let addNode = {
          id: '_add',
          name: '',
          code: '',
          status: '1',
          _add: true,
        }
        list.push(addNode)
        valueMap._add = addNode
      }
      const { modalAttrName } = yield select(_ => _.userAttr)
      if(modalAttrName == '年级'){
        //获取所有年级列表
        yield put({
          type: 'app/getRequestGrade', 
          payload: {
            needUpdate: true
          }
        })
      }
      yield put({
        type: 'updateState',
        payload: {
          valueList: list,
          valueMap,
          modalAttrId: payload.id,
          modalAttrName: payload.name,
          modalVisible: true,
        },
      })
    },
  },
})
