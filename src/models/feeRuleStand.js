/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import * as structService from 'services/struct'
import * as feeSubject from 'services/feeSubject'
import * as feeRule from 'services/feeRule'
import * as userService from 'services/user'
import { pageModel } from './common'
import { Message } from 'antd'
import moment from 'moment'
import { getFormat } from 'utils'
import * as manageService from 'services/account'

export default modelExtend(pageModel, {
  namespace: 'feeRuleStand',

  state: {
    modalType:'',
    modalVisible: false,
    modalData:{},
    batchData: {
      fee: undefined,
      visible: false
    },
    copyData: {
      year: undefined,
      visible: false
    },

    pageNum: 1,
    pageSize: 20,
    count: 0,
    dataList: null,
    dataLoading: true,
    searchName: "",
    selectedRules: [],

    year: undefined,
    subjectId: undefined,
    structId: undefined,
    departId: undefined,
    structItemPid: {},
    attrList:[],
    attrMap:{},

    structList: [],
    structMap: {},
    subjectList: [],
    subjectMap: {},
    yearList: [],
    userAttrList:undefined,
    selectedRelateId:null,
    departTreeList: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/feeRuleStand') {
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
      //获取所有项目列表
      data = yield call(feeSubject.getSubjectList)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      data = data.ret_content.data?data.ret_content.data:[]
      let subjectMap = {}
      let subjectList = []
      let { year} = yield select(_ => _.feeRuleStand)
      for (let subject of data) {
        if(subject.subType=='1'){
          subjectList.push(subject)
          subjectMap[subject.id] = subject
        }
      }
      let yyyy = moment().format('YYYY')
      // year = year?year: moment().format('YYYY')
      year = year?year: `${moment().format('M') < 9?yyyy- 1 : yyyy}`
     
      //获取学年列表
      let yearNow = moment().format("YYYY") - 10;
      let yearList = []
      for(let i=0;i<20;i++){
        yearList.push({year:(yearNow+i).toString()})
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: false,
          subjectMap: subjectMap,
          subjectList,
          structList,
          structMap,
          yearList,
          year,
        },
      })
    },

    *  getDepartTreeList ({ payload }, { put, call, select }) {
      // 获取部门树
      const departTreeData = yield call(manageService.getMgrDepartTree)
      if (!departTreeData.success) {
        throw departTreeData
      } else if (departTreeData.ret_code != 1) {
        return Message.error(departTreeData.ret_content)
      }
      let departTreeList = []
      const changeData = (data) => {
        data.forEach((index)=>{
          if(index.children){
           changeData(index.children)
          }
          departTreeList.push({id:index.id,label:index.label,pid:index.pid})
        })
      }
      changeData(departTreeData.ret_content)
      yield put({
        type: 'updateState',
        payload: {
          departTreeList
        },
      })
    },

    * getSubjectList ({ payload }, { put, call, select }) {
      let departId = []
      if(payload.departId){
        departId = payload.departId
        payload.departId = payload.departId.toString()
      }
      //获取对应部门的项目列表
      let data = yield call(feeSubject.getSubjectList,payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let dataList = data.ret_content.data?data.ret_content.data:[]
      let subjectList = []
      for (let subject of dataList) {
        if(subject.subType == '1'){
          subjectList.push(subject)
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          departId,
          subjectList,
          subjectId: undefined,
          dataList: [],
          structId: undefined
        },
      })
    },

    * getAllItemList ({ payload }, { put, call, select }) {
      const { structList,structMap } = yield select(_ => _.feeRuleStand)
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
      let attrList = []
      let attrMap = {}
      if(payload.structId != "0"){
        let data = yield call(structService.getStructAttr, { structId: payload.structId })
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }
  
        attrList = data.ret_content
        for (let attr of attrList) {
          attrMap[attr.attrId] = attr
        }
      }
      
      const { structList, subjectId, pageSize } = yield select(_ => _.feeRuleStand)
      // 清理数据
      for (let node of attrList) {
        delete node._idSelected
        delete node._selectList
      }
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
          attrList,
          attrMap,
          sortFlag: true
        },
      })

      if(payload.structId=="0"){
        yield put({
          type: 'getDataList',
          payload: {
            subjectId,
            structId: "0",
            pageNum: 1,
            pageSize
          },
        })
      }
    },
    * changeStructItem ({ payload }, { put, call, select }) {
      const { structMap, structList  } = yield select(_ => _.feeRuleStand)
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
    
    * changeSubject ({ payload }, { put, call, select }) {
      let data = yield call(feeRule.getFeeRuleAttr, {subjectId:payload.subjectId, year:payload.year})
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      let { subjectMap, structId, attrList, attrMap } = yield select(_ => _.feeRuleStand)
      subjectMap[payload.subjectId].attrId = data.ret_content.attrId?data.ret_content.attrId:undefined
      subjectMap[payload.subjectId].structId = data.ret_content.structId?data.ret_content.structId:undefined
      subjectMap[payload.subjectId].attrName = data.ret_content.attrName
      if(subjectMap[payload.subjectId].structId != structId){
        attrList = []
        attrMap = {}
        structId = subjectMap[payload.subjectId].structId
        if(structId && structId!='0'){
          data = yield call(structService.getStructAttr, { structId })
          if (!data.success) {
            throw data
          } else if (data.ret_code != 1) {
            return Message.error(data.ret_content)
          }
    
          attrList = data.ret_content
          attrMap = {}
          for (let attr of attrList) {
            attrMap[attr.attrId] = attr
          }
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          subjectMap,
          subjectId: payload.subjectId,
          structId,
          attrList,
          attrMap
        },
      })

      if(structId){
        payload.structId = structId
        yield put({
          type: 'getDataList',
          payload
        })
      }else{
        yield put({
          type: 'updateState',
          payload: {
            dataList:[],
            pageNum: 1,
            pageSize: 20,
            count: 0,
            dataLoading: false
          },
        })
      }
    },

    * updateFeeRuleAttr ({ payload }, { put, call, select }) {
      const { subjectId, structId, structItemPidSelected, dataLoading, pageNum, pageSize, searchName, year, subjectMap } = yield select(_ => _.feeRuleStand)
      if(dataLoading){
        return Message.error("请不要重复点击")
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      let attrName = payload.attrName
      delete payload.attrName
      let data = yield call(feeRule.updateFeeRuleAttr, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      Message.success('设置成功')
      subjectMap[subjectId].attrId = payload.attrId
      subjectMap[subjectId].attrName = attrName
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: false,
          dataLoading: structId?true:false,
          subjectMap
        },
      })

      if(structId){
        const params = {
          subjectId,
          structId,
          pid: structItemPidSelected ? structItemPidSelected._idSelected : '',
          pageNum,
          pageSize,
          name: searchName,
          year
        }
  
        yield put({
          type: 'getDataList',
          payload: {
            ...params,
          },
        })
      }
    },

    * getDataList ({ payload }, { put, call, select }) {
      const { attrList } = yield select(_ => _.feeRuleStand)
      const {selectedRelateId} = payload
      if(payload.subjectId){
        payload.subjectId = payload.subjectId.toString()
      }
      if(payload.missionId){
        payload.missionId = payload.missionId.toString()
      }
      if(payload.year){
        payload.year = payload.year.toString()
      }
      let attrArr = []
      for (let attr of attrList) {
        if (attr._idSelected && attr._idSelected.length > 0) {
          attrArr.push({ attrId: attr.attrId, valueName: attr._idSelected.toString() })
        }
      }
      if(attrArr && attrArr.length>0){
        payload.attrValueId = JSON.stringify(attrArr)
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      delete payload.selectedRelateId
      let data = yield call(feeRule.getRuleStandList, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      let dataList = data.ret_content.data
      let i=0
      for(let node of dataList){
        node._feeEditVisible = false
        node._index = i++
        node[node.structId] = node.name
        if(node.structItemEntities){
          for (let struct of node.structItemEntities) {
            node[struct.structId] = struct.name
          }
        }
        if (node.structItemAttrRelateEntities) {
          for (let attrValue of node.structItemAttrRelateEntities) {
            node[`attrId_${attrValue.attrId}`] = attrValue.relateName
          }
        }
        let arr = []
        arr.push({
          relateId:'0',
          relateName: "-",
          fee: node.fee?getFormat(node.fee):'',
          editable: node.editable
        })
        if(node.feeRuleStandRelateList){
          for(let relate of node.feeRuleStandRelateList){
            arr.push({
              relateId: relate.relateId,
              relateName: relate.relateName,
              fee: relate.fee?getFormat(relate.fee):'',
              editable: node.editable
            })
          }
        }
        node.feeList = arr
        node._feeList = arr
      }
      yield put({
        type: 'updateState',
        payload: {
          dataList,
          count: parseInt(data.ret_content.count),
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          selectedRules: [],
          dataLoading: false,
          sortFlag: false
        },
      })
      if(selectedRelateId){
        yield put({
          type: 'getFiltrateDataList',
          payload: {
            value:selectedRelateId
          },
        })
      }
    },

    * getFiltrateDataList({payload},{put,call,select}) {
      let { dataList } = yield select(_=>_.feeRuleStand)
      let { value } = payload
      let arr = []
      for(let item of dataList){
        if(value.length==0){ //判断有没有选中的值
          item.feeList = item._feeList
        }else{
          for(let v of value){
            let flag = false
            for(let index of item._feeList){
              if(index.relateId == v.key){
                arr.push(index)
                flag = true
                break
              }
            }
            if(flag) continue
            //未找到相应的记录
            arr.push({
              relateId: v.key,
              relateName: v.label,
              fee: item._feeList[0].fee,//从默认标准中取值
              editable: item._feeList[0].editable
            })
          }
          item.feeList = arr
          arr = []
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          dataList,
        },
      })
    },

    * delectRuleStand({payload},{put,call,select}) {
      const { subjectId, structId, dataLoading, structItemPidSelected, pageNum, pageSize, searchName, year, subjectMap } = yield select(_ => _.feeRuleStand)
      if(dataLoading){
        return Message.error("请不要重复点击")
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      let data = yield call(feeRule.delectRuleStand, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      Message.success('重置成功')

      delete subjectMap[subjectId].attrId
      let { selectedRelateId } = yield select(_=>_.feeRuleStand)
      selectedRelateId = null
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: structId?true:false,
          subjectMap,
          selectedRelateId,
        },
      })

      if(structId){
        const params = {
          subjectId,
          structId,
          pid: structItemPidSelected ? structItemPidSelected._idSelected : '',
          pageNum,
          pageSize,
          name: searchName,
          year
        }
        yield put({
          type: 'getDataList',
          payload: {
            ...params,
          },
        })
      }
    },

    * updateFeeRule ({ payload }, { put, call, select }) {
      const { subjectId, structId, structItemPidSelected, dataLoading, pageNum, pageSize, searchName, year, selectedRelateId } = yield select(_ => _.feeRuleStand)
      if(dataLoading){
        return Message.error("请不要重复点击")
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      let data = yield call(feeRule.updateRuleStand, {ruleList: payload.param})
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      Message.success('设置成功')
      const params = {
        subjectId,
        structId,
        pid: structItemPidSelected ? structItemPidSelected._idSelected : '',
        pageNum,
        pageSize,
        name: searchName,
        year,
        selectedRelateId,
      }
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: false,
        },
      })
      yield put({
        type: 'getDataList',
        payload: {
          ...params,
        },
      })
    },

    * copyRuleStand ({ payload }, { put, call, select }) {
      const { subjectId, structId, structItemPidSelected, dataLoading, pageNum, pageSize, searchName, copyData, year } = yield select(_ => _.feeRuleStand)
      if(dataLoading){
        return Message.error("请不要重复点击")
      }
      copyData.visible = false
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
          copyData
        },
      })
      let data = yield call(feeRule.copyRuleStand, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      Message.success('复制成功')
      yield put({
        type: 'changeSubject',
        payload: {
          year,
          subjectId,
          pageNum: 1,
          pageSize: 20
        },
      })
      
      // if(structId){
      //   const params = {
      //     subjectId,
      //     structId,
      //     pid: structItemPidSelected ? structItemPidSelected._idSelected : '',
      //     pageNum,
      //     pageSize,
      //     name: searchName,
      //     year
      //   }
      //   yield put({
      //     type: 'getDataList',
      //     payload: {
      //       ...params,
      //     },
      //   })
      // }else{
      //   yield put({
      //     type: 'updateState',
      //     payload: {
      //       dataLoading: false,
      //     },
      //   })
      // }
    },

    * getUserAttrList ({ payload }, { put, call, select }) {
      let data = yield call(userService.getUserAttr)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let userAttrList = []
      for (let attr of data.ret_content) {
        if(attr.valueType == '2'){
          //只有选项类型才能选择
          userAttrList.push(attr)
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          userAttrList
        },
      })
    },

    * getAttrValueList ({ payload }, { put, call, select }) {
      const { modalData } = yield select(_ => _.feeRuleStand)
      let data = yield call(userService.getUserAttrValue, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      modalData._attrValueList = data.ret_content
      yield put({
        type: 'updateState',
        payload: {
          modalData,
        },
      })
    },

  },
})
