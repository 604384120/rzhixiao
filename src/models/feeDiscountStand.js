import { Message } from 'antd'
import modelExtend from 'dva-model-extend'
import { model } from 'models/common'
import * as feeRule from 'services/feeRule'
import * as feeSubject from 'services/feeSubject'
import * as manageService from 'services/account'

export default modelExtend(model, {
  namespace: 'feeDiscountStand',
  state: {
    dataList: [],
		name: null,
		subjectId: undefined
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname == '/feeDiscountStand') {
          dispatch({
            type: 'query',
            payload: {

            },
          })
        }
      })
    },
  },
  effects: {
    * query ({ payload }, { put, call, select }) {
			yield put({
				type: 'getSubjectList',
				payload: {},
			})
		},

		*  getSubjectList ({ payload }, { put, call, select }) {
			let departId = []
			if(payload.departId){
				departId = payload.departId
				payload.departId = payload.departId.toString()
			}
     //获取所有项目列表
      let data = yield call(feeSubject.getSubjectList,payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let subjectList = data.ret_content.data?data.ret_content.data:[]
			let subjectMap = {}
      for (let subject of subjectList) {
				subjectMap[subject.id] = subject
			}
			yield put({
				type: 'updateState',
				payload: {
					subjectList,
					subjectMap,
					departId,
					subjectId: undefined,
					dataList: [],
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
		
		* getDataList ({ payload }, { put, call }) {
			yield put({
				type: 'updateState',
				payload: {
					dataLoading: true
				},
			})

      const data = yield call(feeRule.getDiscountStandList, payload)
      if (!data.success) {
				throw data
			} else if (data.ret_code != 1) {
				return Message.error(data.ret_content)
			}

			yield put({
				type: 'updateState',
				payload: {
					dataList: data.ret_content?data.ret_content:[],
					dataLoading: false
				},
			})
    },

    * updateDiscountStand ({ payload }, { put, call, select }) {
      const data = yield call(feeRule.updateDiscountStand, payload)
      if (!data.success) {
				throw data
			} else if (data.ret_code != 1) {
				return Message.error(data.ret_content)	
			}
			if(payload.status != "0"){
				Message.success('保存成功')
			}else{
				Message.success('删除成功')
			}
			let { subjectId } = yield select(_ => _.feeDiscountStand)
			yield put({
				type: 'getDataList',
				payload: {
					subjectId,
				},
			})
    },

    * addDiscountStand ({ payload }, { put, call, select }) {
      const data = yield call(feeRule.addDiscountStand, payload)
      if (!data.success) {
				throw data
			} else if (data.ret_code != 1) {
				return Message.error(data.ret_content)
			}
			
			let { subjectId } = yield select(_ => _.feeDiscountStand)
			yield put({
				type: 'getDataList',
				payload: {
					subjectId,
				},
			})
    },
  },
  reducers: {

  },
})
