import { routerRedux } from 'dva/router'
import * as user from 'services/user'
import modelExtend from 'dva-model-extend'
import { model } from 'models/common'
import queryString from 'query-string'
import { Message } from 'antd'
import md5 from 'md5'
import * as joinUserService from 'services/joinUser'
import * as structServive from 'services/struct'
import * as userService from 'services/user'
import * as joinUser from 'services/joinUser'
import moment from 'moment'
import { getSortParam } from 'utils'

export default modelExtend(model, {
  namespace: 'joinStudent',

  state: {
    dataLoading: false,
    beginDate: `${moment().format('YYYY-MM-DD')} 00:00:00`,
    endDate: `${moment().format('YYYY-MM-DD')} 23:59:59`,
    joinAccountId: undefined,
    status: undefined,
    joinAccountList: undefined,
    searchName: '',
    totalBegin: 0,
    count: 0,
    pageNum: 1,
    pageSize: 20,
    dataList: null,
    modalVisible: false,
    modalData: {},
    deaprtTree: null,
    departMap: null,
    sortSence: 'joinStudentSort',
    displaySence: 'joinStudentDisplay',
    userSortExtra: {
      payType: '支付方式',
    },
    statData: null,
    statList: [
      {id: 'surplus',name: '剩余总额'},
      {id: 'paidFee',name: '收费总额'},
      {id: 'refund',name: '退费总额'},
      {id: 'offset',name: '入学冲抵'},
    ],
    countData: null,
    setFormVisible: false,
    formModalData: null,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/joinStudent') {
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
      const { userSortExtra, sortSence, displaySence,joinAccountId, beginDate, endDate } = yield select(_ => _.joinStudent)
      yield put({
        type: 'app/initDisplay', 
        payload: {
          func:joinUserService.getJoinAttr,
          funcKey: displaySence,
          fontParams: {type: '2'},
          params:
            [{sence:displaySence, displayExtra:{}},{sence:sortSence, displayExtra:userSortExtra, defaultType: '1'}]
          }
      })
      //获取所有支付方式
      yield put({
        type: 'app/getRequestPayType', 
        payload: {}
      })
      let data = yield call(joinUserService.getJoinAccountList)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let joinAccountList = data.ret_content.data?data.ret_content.data:[]
      yield put({
        type: 'updateState',
        payload: {
          joinAccountList,
          // joinAccountId:accountId
        },
      })
      // yield put({
      //   type: 'getDataList',
      //   payload: {
      //     beginDate, endDate, accountId, pageNum:1, pageSize:20
      //   },
      // })
    },

    * getDataList ({ payload }, { put, call, select }) {
      const {sortList, beginDate, endDate, payType} = payload
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
      if(payType){
        payload.payType =  payType.toString();
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      let data = yield call(joinUserService.getIntentionUserList,payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let dataList = data.ret_content.data?data.ret_content.data:[]
      let {paidFeeSum, refundSum, surplusSum, offsetSum, paidFeeCount, refundCount, surplusCount, offsetCount} = data.ret_content.joinOrderStat
      let statData = { paidFeeSum, refundSum, surplusSum, offsetSum, paidFeeCount, refundCount, surplusCount, offsetCount }
      let countData = {
        sumCount: data.ret_content.sumCount,
        awaitCount: data.ret_content.awaitCount,
        passCount: data.ret_content.passCount,
        refundCount: data.ret_content.refundCount,}
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
          dataLoading: false,
          dataList,
          sortFlag: false,
          count: parseInt(data.ret_content.sumCount),
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          statData,
          countData,
          status: payload.status?payload.status:'0',
          modalVisible: false,
          searchName: payload.key,
        },
      })
    },

    * showUserAdd ({ payload }, { put, call, select }) {
      let data = yield call(joinUserService.getJoinForm, {type: '2'})
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      if(!data.ret_content.attrList){
        return Message.error("请先保存并发布好报名表单")
      }
      const { departMap } = yield select(_ => _.joinStudent)
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

      const { modalData } = yield select(_ => _.joinStudent)
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
      const { departMap, lastStruct, disabledAttr } = yield select(_ => _.joinStudent)
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

    * showSetForm ({ payload }, { put, call, select }) {
      // 获取收款账户
      yield put({
        type: 'app/getRequestMch', 
        payload: {}
      })
      let formModalData = {}
      let data = yield call(userService.getUserAttr)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let userAttrList = data.ret_content
      let userAttrMap = {}
      for (let node of userAttrList) {
        userAttrMap[node.id] = node
      }

      data = yield call(joinUser.getJoinForm, {type: '2'})
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      let attrList = data.ret_content.attrList
      let arr = ["姓名","性别","身份证件号","手机号码"]
      if(!attrList || attrList.listen<=0){
        //默认构造表单
        attrList = []
        for(let node of userAttrList){
          if(arr.indexOf(node.name) >= 0){
            attrList.push({
              attrId: node.id,
              isRequired: '1',
              cantDel: true
            })
            node._disable = true
          }
        }
      }else{
        for(let node of attrList){
          if(userAttrMap[node.attrId] && arr.indexOf(userAttrMap[node.attrId].name) >= 0){
            node.cantDel = true
          }
          if(userAttrMap[node.attrId]){
            userAttrMap[node.attrId] ._disable = true
          }
        }
      }
      formModalData.userAttrList = userAttrList
      formModalData.userAttrMap = userAttrMap
      formModalData.title = data.ret_content.title
      formModalData.descr = data.ret_content.descr
      formModalData.fee = data.ret_content.fee?(data.ret_content.fee/100).toString():'0'
      formModalData.feeName = data.ret_content.feeName
      formModalData.mchId = data.ret_content.mchId
      formModalData.attrList = attrList
      formModalData.type = '2'
      yield put({
        type: 'updateState',
        payload: {
          formModalData,
          setFormVisible: true
        },
      })
    },

    * updateJoinForm ({ payload }, { put, call, select }) {
      let data = yield call(joinUser.updateJoinForm, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      Message.success("操作成功")
      yield put({
        type: 'updateState',
        payload: {
          setFormVisible: false
        },
      })
    },

    * updateJoinUserStatus ({ payload }, { put, call, select }) {
      const { param, queryParam} = payload
      let data = yield call(joinUser.updateJoinUserStatus, param)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      Message.success("操作成功")
      yield put({
        type: 'getDataList',
        payload: {
          ...queryParam
        },
      })
    },

    * addJoinUser ({ payload }, { put, call, select }) {
      const { sortList, beginDate, endDate, joinAccountId, pageNum, pageSize, searchName, dataLoading } = yield select(_ => _.joinStudent)
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
      if(payload.billList){
        payload.billList = JSON.stringify(payload.billList)
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
        type: 'updateState',
        payload: {
          modalVisible: false
        },
      })
      yield put({
        type: 'getDataList',
        payload: {
          sortList, beginDate, endDate, joinAccountId, pageNum, pageSize,
          key: searchName
        },
      })

    },

  },
})
