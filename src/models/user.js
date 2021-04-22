/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import * as structServive from 'services/struct'
import * as user from 'services/user'
import { pageModel } from './common'
import { Message } from 'antd'
import { getSortParam } from 'utils'

export default modelExtend(pageModel, {
  namespace: 'user',

  state: {
    modalVisible: false,
    modalData: {},
    modalType: '',
    tempTypeMap: undefined,
    typeMap: {
      1: '基础信息',
      2: '学籍信息',
      3: '住宿信息',
      4: '联系信息',
      5: '自定义字段',
    },
    version: undefined,
    versionType: '',

    sortSence: 'userSort',
    displaySence: 'userDisplay',
    userSortExtra: {},

    pageNum: 1,
    pageSize: 20,
    count: 0,
    userList: [],
    selectedUsers: [],
    selectedAll: false,
    searchName: '',
    userCurrent: {},
    userId: '',
    dataLoading: true,
    lastStruct: undefined,

    departTree: null,
    departMap: null,
    selectedDepart: [],
    depart:undefined,
    departLoadKeys: [],
    modalImpDelData: {},
    timer: null,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/user') {
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
      let { departTree } = yield select(_ => _.user)
      if(!departTree){
        //获取层级结构
        let data = yield call(structServive.getStructList)
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        } else if (!data.ret_content) {
          return Message.error('请先设置学校结构')
        }
        const structList = data.ret_content
        let i = 0
        let lastStruct = undefined
        let path= []
        for (let item of structList) {
          item._position = i++
          if (item.status == '1') {
            lastStruct = item
            path.push(item.id)
          }
        }
        if(!lastStruct){
          return Message.error('请先设置学校结构')
        }
        let param = {}
        path.pop()
        if(path.length > 0){
          param.structId = path.toString()
        }
        const app = yield select(_ => _.app)
        // 获取部门树
        const departTreeData = yield call(structServive.getStructItemTree, param)
        if (!departTreeData.success) {
          throw departTreeData
        } else if (departTreeData.ret_code != 1) {
          return Message.error(departTreeData.ret_content)
        }
        let disabledAttr = {}
        const departMap = {}
        const checkData = (data) => {
          data.forEach((index) => {
            index.value = index.id
            if(path.length == 0){
              index.isLeaf = true
            }else{
              index.isLeaf = false
            }
            
            if (index.children) {
              checkData(index.children)
            }
            if(lastStruct.id != index.structId && !disabledAttr[index.attrId]){
              //设置不可编辑属性
              if(!disabledAttr[index.attrId]){
                disabledAttr[index.attrId] = {
                  attrId: index.attrId,
                  structId: index.id,
                }
              }
              if(index.structItemAttrRelateMap){
                //存在关联属性
                for(let attrId in index.structItemAttrRelateMap){
                  if(!disabledAttr[attrId]){
                    disabledAttr[attrId] = {
                      attrId
                    }
                  }
                }
              }
            }
            departMap[index.id] = index
          })
        }
        checkData(departTreeData.ret_content)
        departTree = [
          {
            value: '0',
            id: "0",
            label: app.user.schoolName,
            children: departTreeData.ret_content
          }
        ]

        // 筛选条件组件
        const { userSortExtra, sortSence, displaySence } = yield select(_ => _.user)
        yield put({
          type: 'app/initDisplay', 
          payload: {params:
              [{sence:displaySence, displayExtra:{}},{sence:sortSence, displayExtra:userSortExtra, defaultType: '1', onFilter: function (attr) {
                if(attr){
                  //过滤掉层级属性
                  return attr.valueType === '3'
                }
                return false
              }}]
            }
        })
        yield put({
          type: 'updateState',
          payload: {
            departTree,
            departMap,
            disabledAttr,
            lastStruct
          },
        })
      }
      if(payload.version){
        yield put({
          type: 'updateState',
          payload: {
            version: payload.version,
            versionType: payload.versionType,
          },
        })
      }else{
        yield put({
          type: 'updateState',
          payload: {
            version: undefined,
            versionType: undefined
          },
        })
      }
      // 获取用户列表
      const { userDisplaySence } = yield select(_ => _.app)
      const { pageNum, pageSize, searchName, depart } = yield select(_ => _.user)
      yield put({
        type: 'getUserList',
        payload: {
          key: searchName,
          pageNum,
          pageSize,
          sortList: userDisplaySence['userSort']?userDisplaySence['userSort'].displayList:undefined,
          depart,
          version:payload.version,
        },
      })
    },

    *showModalAddUser({ payload }, { put, call, select }){
      const { userAttrList } = yield select(_ => _.app)
      let { tempTypeMap } = yield select(_ => _.user)
      if(userAttrList && !tempTypeMap){
        let i = 0
        tempTypeMap = {}
        for (let attr of userAttrList) {
          attr._position = i++
          if (!tempTypeMap[attr.type]) {
            tempTypeMap[attr.type] = {
              firstNode: attr,
              list: [attr],
            }
          } else {
            tempTypeMap[attr.type].list.push(attr)
          }
        }
      }
        yield put({
          type:'updateState',
          payload:{
            tempTypeMap,
            modalVisible: true,
            modalData: payload.modalData,
            modalType: payload.modalType 
          }
        })
    },


    * getUserList ({ payload = {} }, { call, put, select }) {
      const { sortList } = payload
      let tempList = getSortParam(sortList)
      let depart = null
      if(payload.depart){
        //存在组织结构查询条件
        tempList.push(payload.depart)
        depart = payload.depart
        delete payload.depart
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
      let data = yield call(user.getUserList, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const userList = data.ret_content.data
      let { selectedAll } = yield select(_ => _.user)
      let selectedUsers = []
      for (let userNode of userList) {
        if (userNode.attrList) {
          for (let attr of userNode.attrList) {
            userNode[attr.attrId] = attr.relateName
          }
        }
        if(selectedAll){
          selectedUsers.push(userNode.id)
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          userList,
          count: parseInt(data.ret_content.count),
          searchName: payload.key,
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          dataLoading: false,
          depart,
          selectedUsers,
          sortFlag: false
        },
      })
    },

    * deleteUserInfo ({ payload }, { put, call, select }) {
      const data = yield call(user.deleteUserInfo, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      Message.success('删除成功！')

      const { userDisplaySence } = yield select(_ => _.app)
      const { pageNum, pageSize, searchName, depart } = yield select(_ => _.user)
      yield put({
        type: 'getUserList',
        payload: {
          key: searchName,
          pageNum,
          pageSize,
          sortList: userDisplaySence['userSort'].displayList,
          depart
        },
      })
    },

    * updateUserInfo ({ payload }, { put, call, select }) {
      const { attrList } = payload
      payload.attrList = JSON.stringify(attrList)

      const data = yield call(user.updateUserInfo, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      Message.success('操作成功')

      const { userDisplaySence } = yield select(_ => _.app)
      const { pageNum, pageSize, searchName, depart } = yield select(_ => _.user)
      yield put({
        type: 'getUserList',
        payload: {
          key: searchName,
          pageNum,
          pageSize,
          sortList: userDisplaySence['userSort'].displayList,
          depart
        },
      })
    },

    * getUserAttrValue ({ payload }, { put, call, select }) {
      let data = yield call(user.getUserAttrValue, { id: payload.id })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      const { userAttrMap } = yield select(_ => _.app)
      userAttrMap[payload.id]._select = data.ret_content

      yield put({
        type: 'app/updateState',
        payload: {
          userAttrMap,
        },
      })
    },

    * getStructItemList ({ payload }, { put, call, select }) {
      const { departMap, lastStruct, disabledAttr } = yield select(_ => _.user)
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

    * importUserDelete ({ payload }, { put, call, select }) {
      const { modalImpDelData } = yield select(_ => _.user)
      modalImpDelData.step = 1;
      modalImpDelData.cgNum = '0';
      modalImpDelData.wxNum = '0';
      modalImpDelData.importing = true;
      yield put({
        type: 'updateState',
        payload: {
          modalImpDelData
        },
      })
      let timer = payload.timer
      delete payload.timer
      let data = yield call(user.importUserDelete, payload)
      
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        clearInterval(timer)
        modalImpDelData.step = 2;
        modalImpDelData.message = data.ret_content;
        yield put({
          type: 'updateState',
          payload: {
            modalImpDelData,
          },
        })
        return
      }
      modalImpDelData.step = 1;
      yield put({
        type: 'updateState',
        payload: {
          modalImpDelData,
          timer
        },
      })
    },

    * getImportUserPrs ({ payload }, { put, call, select }) {
      const data = yield call(user.getImportPrs)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let { modalImpDelData, timer } = yield select(_ => _.user)
      modalImpDelData.cgNum = data.ret_content.cgNum
      modalImpDelData.wxNum = data.ret_content.wxNum
      if (data.ret_content.status == '2') {
        clearInterval(timer)
        modalImpDelData.importing = false;
        yield put({
          type: 'updateState',
          payload: {
            modalImpDelData
          },
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
           
          },
        })
      }
    },

  },

  reducers: {

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

  },
})
