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
import * as feeSubject from 'services/feeSubject'
import moment from 'moment'
import { getSortParam } from 'utils'

export default modelExtend(model, {
  namespace: 'joinAdminister',

  state: {
    dataLoading: false,
    beginDate: `${moment().format('YYYY-MM-DD')} 00:00:00`,
    endDate: `${moment().format('YYYY-MM-DD')} 23:59:59`,
    joinAccountId: undefined,
    payType: undefined,
    status: undefined,
    joinAccountList: undefined,
    searchName: '',
    count: 0,
    pageNum: 1,
    pageSize: 20,
    dataList: null,
    modalVisible: false,
    modalData: {},
    // deaprtTree: null,
    // departMap: null,
    sortSence: 'joinUserSort',
    displaySence: 'joinUserDisplay',
    userSortExtra: {},
    setFormVisible: false,
    formModalData: null,
    year: undefined,
    countData: null,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/joinAdminister') {
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
      const { accountId } = payload
      const { userSortExtra, sortSence, displaySence,joinAccountId, beginDate, endDate } = yield select(_ => _.joinAdminister)
      yield put({
        type: 'app/initDisplay', 
        payload: {
          func:joinUserService.getJoinAttr,
          funcKey: displaySence,
          fontParams: {type: '1'},
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
          joinAccountId:accountId
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
      const { sortList,beginDate, endDate, joinAccountId, pageNum, pageSize, searchName, status } = payload
      let params = {}
      if (!beginDate) {
        throw '请选择开始时间!'
      }
      if (!endDate) {
        throw '请选择结束时间!'
      }
      let tempList = getSortParam(sortList)
      if (tempList && tempList.length>0) {
        params.sortList = JSON.stringify(tempList)
      }else{
        delete params.sortList
      }
      if(status!='0'){
        if(status == '1'){
          params.status = '1,5,6'
        }else{
          params.status = status
        }
      }
      // 获取经办人条件
      if(joinAccountId){
        params.accountId = joinAccountId.toString()
      }
      if(searchName){
        params.key = searchName
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      params.beginDate = beginDate
      params.endDate = endDate
      params.pageNum = pageNum
      params.pageSize = pageSize
      let data = yield call(joinUserService.getJoinUserList,params)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const dataList = data.ret_content.data?data.ret_content.data:[]
      let {sumCount, awaitCount, passCount, rejectedCount} = data.ret_content
      let countData = {sumCount, awaitCount, passCount, rejectedCount}
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
          countData,
          status: payload.status?payload.status:'0',
          modalVisible: false,
          searchName: payload.key,
          setFormVisible: false,
        },
      })
    },

    * showUserAdd ({ payload }, { put, call, select }) {
      let data = yield call(joinUserService.getJoinForm, {type: '1'})
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      if(!data.ret_content.attrList){
        return Message.error("请先保存并发布好报名表单")
      }
      let { departMap, modalData, lastStruct } = yield select(_ => _.joinAdminister)
      modalData = data.ret_content
      modalData._count = 1
      modalData._changeTemp = {}
      modalData.dataList = []
      //获取学年列表
      let yearNow = moment().format("YYYY") - 10;
      let yearList = []
      let year = moment().format('YYYY')
      for(let i=0;i<20;i++){
        yearList.push({year:(yearNow+i).toString()})
      }
      modalData.yearList = yearList
      if(payload.enrol){
        modalData._enrol = payload.enrol
      }
      modalData._addEdit = false

      if(payload.record){
        modalData.joinUserId = payload.record.id
        modalData.reservationFee= payload.record.fee
      }

      const { user } = yield select(_ => _.app)
      if(user.joinBill == '0' || !user.joinBill){
        yield put({
          type: 'getSubjectByMissId',
          payload: {
            modalData,
            year: `${moment().format('M') < 9?year- 1 : year}`,
          },
        })
      }
      let tempAttrMap = {}
      if(payload.record && payload.record.attrList){
        for(let n of payload.record.attrList){
          tempAttrMap[n['attrId']] = n
        }
      }
      if(data.ret_content.attrList){
        const { userAttrMap } = yield select(_ => _.app)
        let formAttrMap = {}
        let formDepartMap = undefined
        for(let node of data.ret_content.attrList){
          formAttrMap[node.attrId] = node
          if(userAttrMap[node.attrId] && userAttrMap[node.attrId].valueType == '3'){
            if(!formDepartMap) formDepartMap = {}
            formDepartMap[userAttrMap[node.attrId].relateId] = node
            node._displayValue = payload.record?payload.record[node.attrId]:undefined
            modalData._changeTemp[node.attrId] = tempAttrMap[node.attrId]?tempAttrMap[node.attrId].relateId:undefined
          }else if(userAttrMap[node.attrId] && userAttrMap[node.attrId].valueType == '1'){
            modalData._changeTemp[node.attrId] = payload.record?payload.record[node.attrId]:undefined
          }else if(userAttrMap[node.attrId] && userAttrMap[node.attrId].valueType == '2'){
            modalData._changeTemp[node.attrId] = tempAttrMap[node.attrId]?tempAttrMap[node.attrId].relateId:undefined
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
          let attrPath = []
          for (let struct of data.ret_content) {
            if (struct.status == '1') {
              path.push(struct.id)
              attrPath.push(struct.attrId)
              if(formDepartMap[struct.id]){
                struct._path = [...path]
                struct._attrPath = [...attrPath]
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
          if(lastStruct && lastStruct._attrPath){
            let departPath = []
            for(let s of lastStruct._attrPath){
              if(tempAttrMap[s]){
                departPath.push(tempAttrMap[s].relateId)
              }
            }
            modalData._changeTemp["_departTree"] = departPath
          }
          yield put({
            type: 'updateState',
            payload: {
              departMap,
              departTree:departTreeData.ret_content,
              disabledAttr,
              lastStruct,
              modalVisible: true,
              modalData,
              year: `${moment().format('M') < 9?year- 1 : year}`,
            },
          })
          return
        }
      }
      if(lastStruct && lastStruct._attrPath){
        let departPath = []
        for(let s of lastStruct._attrPath){
          if(tempAttrMap[s]){
            departPath.push(tempAttrMap[s].relateId)
          }
        }
        modalData._changeTemp["_departTree"] = departPath
      }
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: true,
          modalData,
          year: `${moment().format('M') < 9?year- 1 : year}`,
        },
      })
    },

    * getSubjectByMissId ({ payload }, { put, call, select }) {
      let { modalData, year } = payload
      //获取任务对应的项目
      let subjectList = yield call(feeSubject.getSubjectByMissId, {year})
      if (!subjectList.success) {
        throw subjectList
      } else if (subjectList.ret_code != 1) {
        return Message.error()
      }
      modalData.dataList = subjectList.ret_content?subjectList.ret_content:[]
      modalData._count = 1
      yield put({
        type: 'updateState',
        payload: {
          modalData,
          year,
        },
      })
    },

    * showSetForm ({ payload }, { put, call, select }) {
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

      data = yield call(joinUser.getJoinForm, {type: '1'})
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
      formModalData.attrList = attrList
      formModalData.type = '1'
      yield put({
        type: 'updateState',
        payload: {
          formModalData,
          setFormVisible: true
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

      let { modalData } = yield select(_ => _.joinAdminister)
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
      const { departMap, lastStruct, disabledAttr } = yield select(_ => _.joinAdminister)
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
      let data = yield call(joinUser.updateJoinUserStatus, payload)
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

    * reviewJoinUser ({ payload }, { put, call, select }) {
      const { queryParam, param } = payload
      let data = yield call(joinUserService.reviewJoinUser, param)
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
      const { sortList, beginDate, endDate, joinAccountId, pageNum, pageSize, searchName, dataLoading, modalData } = yield select(_ => _.joinAdminister)
      const { queryParam,param, } = payload
      if(dataLoading){
        return Message.error("请不要重复点击")
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      if(param.attrList){
        param.attrList = JSON.stringify(param.attrList)
      }
      if(param.billList){
        param.billList = JSON.stringify(param.billList)
      }
      let data = null
      if(modalData._enrol){
        data = yield call(joinUserService.addJoinUser, param)
      }else{
        param.status = '2'
        data = yield call(joinUserService.reviewJoinUser, param)
      }
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
      if(modalData._enrol){
        Message.success('报名成功')
      }else{
        Message.success('审核成功')
      }
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: false
        },
      })
      yield put({
        type: 'getDataList',
        payload: {
          ...queryParam
        },
      })

    },

  },
})
