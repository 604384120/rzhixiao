import { routerRedux } from 'dva/router'
import * as feeMission from 'services/feeMission'
import * as account from 'services/account'
import * as feeSubject from 'services/feeSubject'
import * as manageService from 'services/account'
import * as credit from 'services/credit'
import * as userService from 'services/user'
import modelExtend from 'dva-model-extend'
import { model } from 'models/common'
import queryString from 'query-string'
import { Message } from 'antd'
import moment from 'moment'

export default modelExtend(model, {
  namespace: 'feeMission',

  state: {                                      //  组合reducer函数(状态跟数据结构)的初始值
    modalVisible: false,
    pageNum: 1,
    pageSize: 20,
    list: null,
    dataLoading: true,
    current: {},
    count: 0,
    ModalType: null,
    searchName: '',
    disableReceipt: false,
    accountList: [],
    templateList: [],
    mchList:undefined,
    creditBatchList: null,
    subjectList: [],
    subjectMap: {},
    departTree: null,
    cgNum: '0',
  },

  subscriptions: {                                            // 触发器
    setup ({ dispatch, history }) {                           //setup表示初始化即调用。
      history.listen((location) => {
        if (location.pathname === '/feeMission') {          //判断是否等于/feemission路径  pathname属性是一个可读可写的字符串，可设置或返回当前 URL 的路径部分
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
      //获取所有学年列表
      yield put({
        type: 'app/getRequestYear', 
        payload: {}
      })
      //获取所有部门树
      yield put({
        type: 'app/getRequestDepart', 
        payload: {}
      })

      let { pageNum, pageSize,departId } = yield select(_ => _.feeMission)
      if (payload.pageNum && payload.pageSize) {
        pageNum = payload.pageNum
        pageSize = payload.pageSize
      }
      if(departId&&departId.length>0){
        departId = departId[departId.length - 1]
      }
      let data = yield call(feeMission.getMissionList, { name: payload.name, pageNum, pageSize,departId })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const list = data.ret_content.data?data.ret_content.data:[]
      yield put({        
        type: 'updateState',           
        payload: {
          list,
          count: parseInt(data.ret_content.count),
          pageNum,
          pageSize,
          dataLoading: false,
          sortFlag: false,
        },
      })
    },
    * getSubjectList ({ payload }, { put, call, select }) {
      //获取sujectList
      let subjectData = yield call(feeSubject.getSubjectList, {departId: payload.modalData.departId})
      if (!subjectData.success) {
        throw subjectData
      } else if (subjectData.ret_code != 1) {
        return Message.error(subjectData.ret_content)
      }
      const subjectList = subjectData.ret_content.data
      const subjectMap = {}
      for (let subject of subjectList) {
        subject._editable = true
        subjectMap[subject.id] = subject
      }

      yield put({
        type: 'showModal',
        payload: {
          ...payload,
          subjectList,
          subjectMap
        },
      })
    },
    * showEditMission ({ payload }, { put, call, select }) {
      let data = yield call(account.getMgrAccountList, { departId: payload.departId })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let accountList = {}
      data.ret_content.data.map((account) => {
        accountList[`${account.departName}/${account.loginName}`] = account
      })

      // const { subjectList } = yield select(_ => _.feeMission)
      // for (const optional of subjectList) {
      //   optional._editable = true
      // }

      yield put({
        type: 'showModal',
        payload: {
          ...payload,
          accountList,
          //subjectList,
          subjectSelectedList: [],
          subjectSelectedTemp: null,
          optionalSubjectSelectedList: [],
          optionalSubjectSelectedTemp: null,
          showOptionalSubject:false,
        },
      })
    },
    * getMissionList ({ payload }, { put, call, select }) {
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      let departId = []
      if(payload.departId&&payload.departId.length>0){
        departId = payload.departId
        payload.departId = payload.departId[payload.departId.length - 1]
      }
      if(payload.year){
        payload.year = payload.year.toString()
      }
      const data = yield call(feeMission.getMissionList, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const list = data.ret_content.data
      let { subjectMap, modalVisible } = yield select(_ => _.feeMission)
      for (let node of list) {
        if (node.subjectList) {
          let temp = node.subjectList.split(',')
          let tempArr = []
          let str = ''
          for (let id of temp) {
            tempArr.push({
              id,
              name: subjectMap[id] ? subjectMap[id].name : '',
            })
            if (str) str += ','
            str += subjectMap[id] ? subjectMap[id].name : ''
          }
          node.subjectList = tempArr
          node.subjectListDispaly = str
        }
      }
      //获取所有任务列表
      yield put({
        type: 'app/getRequestMission', 
        payload: {
          needUpdate: true
        }
      })
      yield put({
        type: 'updateState',
        payload: {
          list,
          count: data.ret_content.count,
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          dataLoading: false,
          searchName: payload.name,
          modalVisible: false,
          sortFlag: false,
          departId,
        },
      })
    },
    * updateMissionStatus ({ payload }, { put, call, select }) {
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      const param = {
        id: payload.mission.id,
        status: payload.status,
      }
      const data = yield call(feeMission.updateMissionStatus, param)
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: false,
        },
      })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const { list } = yield select(_ => _.feeMission)
      const target = list.filter(item => payload.mission.id === item.id)[0]
      if (target) {
        target.status = payload.status
      }
      Message.success('设置成功！')
      yield put({ type: 'updateState', payload: { list } })
    },
    * addMission ({ payload }, { put, call, select }) {
      let hasCredit = payload.hasCredit
      delete payload.hasCredit
      let timer = payload.timer
      delete payload.timer
      let data = yield call(feeMission.addMission, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        if(hasCredit){
          clearInterval(timer)
        }
        yield put({
          type: 'updateState',
          payload: {
            modalVisible: false, 
            dataLoading: false,
          },
        })
        return Message.error(data.ret_content)
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
          current: {
            missionId: data.ret_content
          },
          timer
        },
      })
      if(!hasCredit){
        //没有学分制直接返回
        Message.success('添加成功！')
        let { pageNum, pageSize, searchName } = yield select(_ => _.feeMission)
        yield put({
          type: 'getMissionList',
          payload: {
            name: searchName,
            pageNum,
            pageSize,
          },
        })
      }
    },
    * updateMission ({ payload }, { put, call, select }) {
      let data = yield call(feeMission.updateMission, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      Message.success('修改成功！')
      let { pageNum, pageSize, searchName } = yield select(_ => _.feeMission)
      yield put({
        type: 'getMissionList',
        payload: {
          name: searchName,
          pageNum,
          pageSize,
        },
      })
    },
    * deleteMission ({ payload }, { put, call, select }) {
      const param = {
        id: payload.mission.id,
        status: 0,
      }
      const data = yield call(feeMission.updateMissionStatus, param)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      Message.success('删除成功！')
      let { pageNum, pageSize, searchName } = yield select(_ => _.feeMission)
      yield put({
        type: 'getMissionList',
        payload: {
          name: searchName,
          pageNum,
          pageSize,
        },
      })
    },
    * addBill ({ payload }, { put, call, select }) {
      const data = yield call(feeMission.addBill, payload)
      const { timer } = yield select(_ => _.feeMission)

      if (data.ret_code == '1') {

      } else {
        clearInterval(timer)
        yield put({
          type: 'updateState',
          payload: {
            modalVisible: false,
          },
        })
        throw data
      }
    },

    * getCreateBillsPrs ({ payload }, { put, call, select }) {
      let { pageNum, pageSize, searchName, current } = yield select(_ => _.feeMission)
      if(!current.missionId){
        return
      }
      const prs = yield call(feeMission.getCreateBillsPrs, {missionId: current.missionId})
      const { timer } = yield select(_ => _.feeMission)
      if (prs.ret_code == '1') {
        if (prs.ret_content.cgNum == '100') {
          clearInterval(timer)
          yield put({
            type: 'updateState',
            payload: {
              cgNum: prs.ret_content.cgNum,
              modalVisible: false, 
              dataLoading: true,
            },
          })
          Message.success('添加成功！')

          yield put({
            type: 'getMissionList',
            payload: {
              name: searchName,
              pageNum,
              pageSize,
            },
          })
        } else {
          yield put({
            type: 'updateState',
            payload: {
              cgNum: prs.ret_content.cgNum,
            },
          })
        }
      } else {
        throw prs
      }
    },

    * getCreditBatchList ({ payload }, { put, call }) {
      const data = yield call(credit.getCreditBatchList)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      yield put({
        type: 'updateState',
        payload: {
          creditBatchList: data.ret_content,
        },
      })
    },

    * getGradeList ({ payload }, { put, call }) {
      payload.pageNum = 1;
      payload.pageSize = 50;
      payload.attrName = "年级"
      let data = yield call(userService.getAttrRelatePage, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      yield put({
        type: 'updateState',
        payload: {
          gradeList: data.ret_content.data?data.ret_content.data:[],
        },
      })
    },


  },

  reducers: {                        //  用来修改数据模型的state

    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

    setCurrentDep (state, { payload }) {
      return { ...state, ...payload }
    },

  },
})
