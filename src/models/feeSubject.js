// import * as receipt from 'services/receipt'
// import * as feeMission from 'services/feeMission'
import * as feeSubject from 'services/feeSubject'
// import * as manageService from 'services/account'
import * as userService from 'services/user'
import modelExtend from 'dva-model-extend'
import { model } from 'models/common'
import queryString from 'query-string'
import { Message } from 'antd'
import * as receiptService from 'services/receipt'

export default modelExtend(model, {
  namespace: 'feeSubject',

  state: {
    pageNum: 1,
    pageSize: 20,
    list: null,
    count: 0,
    dataLoading: true,
    searchName: null,
    isAdmin: '0',
    type: undefined,
    templateId: undefined,
    mchId: undefined,
    departs: [],

    sortSence: 'feeSubjectSort',
    displaySence: 'feeSubjectDisplay',
    userSortExtra: {},
    
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/feeSubject') {
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
      const { userSortExtra, sortSence, displaySence } = yield select(_ => _.feeSubject)
      yield put({
        type: 'app/initDisplay', 
        payload: {params:
            [{sence:displaySence, displayExtra:{}},{sence:sortSence, displayExtra:userSortExtra, defaultType: '1'}]
          }
      })
      // 获取票据类型
      yield put({
        type: 'app/getRequestTemplate', 
        payload: {}
      })
      // 获取收款账户
      yield put({
        type: 'app/getRequestMch', 
        payload: {}
      })
      // 获取部门树
      yield put({
        type: 'app/getRequestDepart', 
        payload: {}
      })

      const { user } = yield select(_ => _.app)

      yield put({
        type: 'updateState',
        payload: {
          pageNum: 1,
          dataLoading: false,
          isAdmin: user.isAdmin,
        },
      })
      yield put({
        type: 'getSubjectList',
        payload: {
          pageNum: 1,
          pageSize: 20,
        },
      })
    },

    * getSubjectList ({ payload }, { put, call }) {
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      const {type, templateId, mchId, departId,} = payload
      let departs = []
      if(type){
        payload.type =  type.toString();
      }
      if(templateId){
        payload.templateId =  templateId.toString();
      }
      if(mchId){
        payload.mchId =  mchId.toString();
      }
      if(departId){
        departs.push(departId)
      }
      const data = yield call(feeSubject.getSubjectList, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      
      //获取所有项目列表
      yield put({
        type: 'app/getRequestSubject', 
        payload: {
          needUpdate: true
        }
      })

      yield put({
        type: 'updateState',
        payload: {
          list: data.ret_content.data?data.ret_content.data:[],
          count: data.ret_content.count,
          pageNum: payload.pageNum,
          searchName: payload.name,
          dataLoading: false,
          sortFlag: false,
          departs,
        },
      })
    },

    * addSubject ({ payload }, { put, call, select }) {
      const param = {
        name: payload.subject.name,
        status: payload.subject.status,
        type: payload.subject.type,
        departId: payload.subject.departId,
        code: payload.subject.code,
        templateId: payload.subject.templateId,
        mchId: payload.subject.mchId,
      }
      let data = yield call(feeSubject.addSubject, param)
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
      Message.success('添加成功！')
      const { pageNum, pageSize } = yield select(_ => _.feeSubject)
      yield put({
        type: 'getSubjectList',
        payload: {
          pageNum,
          pageSize,
        },
      })
    },

    * updateSubject ({ payload }, { put, call, select }) {
      const param = {
        id: payload.subject.id,
        name: payload.subject.name,
        status: payload.subject.status,
        type: payload.subject.type,
        departId: payload.subject.departId,
        code: payload.subject.code,
        templateId: payload.subject.templateId==undefined?null:payload.subject.templateId,
        mchId: payload.subject.mchId,
      }
      let data = yield call(feeSubject.updateSubject, param)
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
      const { pageNum, pageSize } = yield select(_ => _.feeSubject)
      yield put({
        type: 'getSubjectList',
        payload: {
          pageNum,
          pageSize,
        },
      })
    },

    * deleteSubject ({ payload }, { put, call, select }) {
      const param = {
        id: payload.subject.id,
      }
      let data = yield call(feeSubject.deleteSubject, param)
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
      // data = yield call(feeSubject.getSubjectList, { name: payload.name })
      // if (!data.success) {
      //   throw data
      // } else if (data.ret_code != 1) {
      //   return Message.error(data.ret_content)
      // }
      // yield put({
      //   type: 'updateState',
      //   payload: {
      //     list: data.ret_content.data?data.ret_content.data:[],
      //     count: data.ret_content.count,
      //     pageNum: 1,
      //     dataLoading: false,
      //   },
      // })
      const { pageNum, pageSize } = yield select(_ => _.feeSubject)
      yield put({
        type: 'getSubjectList',
        payload: {
          pageNum,
          pageSize,
        },
      })
    },

    * updateTemplateList ({ payload }, { put, call, select }) {
      const data = yield call(feeSubject.updateSubject, payload)

      if (!data.success) {
						throw data
		    } else if (data.ret_code != 1) {
					return Message.error(data.ret_content)	
		    }
				Message.success('保存成功')
		    yield put({
		    	type: 'query',
		    	payload: {
		    	},
		    })
    },

      
  },
})
