/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import * as user from 'services/user'
import * as structServive from 'services/struct'
import * as joinUserService from 'services/joinUser'
import * as order from 'services/order'
import * as feeMission from 'services/feeMission'
import * as account from 'services/account'
import * as setService from 'services/printSet'
import { getTemplateText } from 'services/receipt'
import { pageModel } from './common'
import { Message } from 'antd'
import moment from 'moment'
import { getSortParam } from 'utils'

export default modelExtend(pageModel, {
  namespace: 'joinUser',

  state: {
    modalVisible: false,
    modalData: {},

    sortSence: 'joinUserSort',
    displaySence: 'joinUserDisplay',
    userSortExtra: {},

    pageNum: 1,
    pageSize: 20,
    dataList: [],
    sumCount: 0,
    awaitCount: 0,
    passCount: 0,
    rejectedCount: 0,
    searchName: '',
    dataLoading: false,
    showJoin: false,

    deaprtTree: null,
    deaprtMap: null,

    beginDate: `${moment().format('YYYY-MM-DD')} 00:00:00`,
    endDate: `${moment().format('YYYY-MM-DD')} 23:59:59`,
    joinAccountId: undefined,
    status: undefined,

    selectedData: [],
    cancelJoinData: {},
    confirmJoinData:{},
    joinAccountList: undefined,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/joinUser') {
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
      const { accountId } = payload
      const { userSortExtra, sortSence, displaySence,joinAccountId, beginDate, endDate } = yield select(_ => _.joinUser)
      yield put({
        type: 'app/initDisplay', 
        payload: {
          func:joinUserService.getJoinAttr,
          funcKey: displaySence,
          params:
            [{sence:displaySence, displayExtra:{}},{sence:sortSence, displayExtra:userSortExtra, defaultType: '1'}]
          }
      })

      let joinAccountList = undefined
      if(accountId && accountId!=joinAccountId){
        let data = yield call(joinUserService.getJoinAccountList)
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }
        joinAccountList = data.ret_content.data?data.ret_content.data:[]
        yield put({
          type: 'updateState',
          payload: {
            joinAccountList,
            joinAccountId:accountId
          },
        })
        yield put({
          type: 'getDataList',
          payload: {
            beginDate, endDate, accountId, pageNum:1, pageSize:20
          },
        })
      }
    },

    * getAccountList ({ payload }, { put, call }) {
      let data = yield call(joinUserService.getJoinAccountList)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      yield put({
        type: 'updateState',
        payload: {
          joinAccountList: data.ret_content.data?data.ret_content.data:[]
        },
      })
    },

    * getDataList ({ payload }, { put, call, select }) {
      const {sortList, beginDate, endDate} = payload
      if (!beginDate) {
        throw '请选择开始时间!'
      }
      if (!endDate) {
        throw '请选择结束时间!'
      }
      let tempList = getSortParam(sortList)
      if (tempList && tempList.length>0) {
        payload.sortList = JSON.stringify(tempList)
      }else{
        delete payload.sortList
      }
      if(payload.status=='0'){
        delete payload.status
      }
      // 获取经办人条件
      if(payload.joinAccountId){
        payload.accountId = payload.joinAccountId.toString()
        delete payload.joinAccountId
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      if(payload.showJoin){
        payload.type = '1'
      }
      delete payload.showJoin
      const data = yield call(joinUserService.getJoinUserList, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const dataList = data.ret_content.data?data.ret_content.data:[]
      for (let node of dataList) {
        if (node.attrList) {
          for (let attr of node.attrList) {
            node[attr.attrId] = attr.relateName
          }
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          dataList,
          sumCount: parseInt(data.ret_content.sumCount),
          awaitCount: parseInt(data.ret_content.awaitCount),
          passCount: parseInt(data.ret_content.passCount),
          rejectedCount: parseInt(data.ret_content.rejectedCount),
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          searchName: payload.key,
          status: payload.status?payload.status:'0',
          dataLoading: false,
          selectedData: [],
          sortFlag: false,
          modalVisible: false,
          showJoin: payload.type == '1'
        },
      })
    },

    * reviewJoinUser ({ payload }, { put, call, select }) {
        yield put({
          type: 'updateState',
          payload: {
            dataLoading: true,
          },
        })
        const data = yield call(joinUserService.reviewJoinUser, payload)
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
        Message.success('操作成功')
        yield put({
          type: 'updateState',
          payload: {
            cancelJoinData: {},
            confirmJoinData: {}
          },
        })
        const { sortList, beginDate, endDate, joinAccountId, pageNum, pageSize, searchName } = yield select(_ => _.joinUser)
        yield put({
          type: 'getDataList',
          payload: {
            sortList, beginDate, endDate, joinAccountId, pageNum, pageSize,
            key: searchName
          },
        })

      },

      * addJoinUser ({ payload }, { put, call, select }) {
        const { sortList, beginDate, endDate, joinAccountId, pageNum, pageSize, searchName, dataLoading } = yield select(_ => _.joinUser)
        if(dataLoading){
          return Message.error("请不要重复点击")
        }
        yield put({
          type: 'updateState',
          payload: {
            dataLoading: true,
          },
        })
        if(payload.attrList){
          payload.attrList = JSON.stringify(payload.attrList)
        }
        const data = yield call(joinUserService.addJoinUser, payload)
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
        Message.success('报名成功')
      
        yield put({
          type: 'getDataList',
          payload: {
            sortList, beginDate, endDate, joinAccountId, pageNum, pageSize,
            key: searchName
          },
        })

      },
    
    
    * showUserAdd ({ payload }, { put, call, select }) {
      let data = yield call(joinUserService.getJoinForm)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      if(!data.ret_content.attrList){
        return Message.error("请先保存并发布好报名表单")
      }
      const { departMap } = yield select(_ => _.joinUser)
      let modalData = data.ret_content
      modalData._changeTemp = {}
      if(data.ret_content.attrList){
        const { userAttrMap } = yield select(_ => _.app)
        let formAttrMap = {}
        let formDepartMap = undefined
        for(let node of data.ret_content.attrList){
          formAttrMap[node.attrId] = node
          if(userAttrMap[node.attrId] && userAttrMap[node.attrId].valueType == '3'){
            if(!formDepartMap) formDepartMap = {}
            formDepartMap[userAttrMap[node.attrId].relateId] = node
          }
        }
        modalData.attrMap = formAttrMap
        if(formDepartMap && !departMap){
          //需要生成部门树
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
              if(formDepartMap[struct.id]){
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
              lastStruct,
              modalVisible: true,
              modalData
            },
          })
          return
        }
      }
      
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: true,
          modalData
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

      const { modalData } = yield select(_ => _.joinUser)
      const attr = modalData.attrList.filter(_=>_.attrId===payload.id)[0]
      attr._select = data.ret_content

      yield put({
        type: 'updateState',
        payload: {
          modalData,
        },
      })
    },

    * getStructItemList ({ payload }, { put, call, select }) {
      const { departMap, lastStruct, disabledAttr } = yield select(_ => _.joinUser)
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
