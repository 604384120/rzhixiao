import { Message } from 'antd'
import modelExtend from 'dva-model-extend'
import { model } from 'models/common'
import queryString from 'query-string'
import * as receiptService from 'services/receipt'

export default modelExtend(model, {
  namespace: 'receipt',
  state: {
    templateList: [],
    name: null,
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname == '/receipt') {
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
      const data = yield call(receiptService.getTemplateList, payload)

      if (!data.success) {
		        throw data
		    } else if (data.ret_code != 1) {
					return Message.error(data.ret_content)
		    }

				//获取所有票据类型
				yield put({
					type: 'app/getRequestTemplate', 
					payload: {
						needUpdate: true
					}
				})
		    yield put({
		    	type: 'updateState',
		    	payload: {
		    		templateList: data.ret_content,
		    	},
		    })
    },

    * getTemplateText ({ payload }, { put, call }) {
      const data = yield call(receiptService.getTemplateText, payload)

      if (!data.success) {
		        throw data
		    } else if (data.ret_code != 1) {
					return Message.error(data.ret_content)
		    }

		    yield put({
		    	type: 'updateState',
		    	payload: {
		    		receiptTemplateTexts: data.ret_content.receiptTemplateTexts,
		    	},
		    })
    },

    * updateTemplateList ({ payload }, { put, call, select }) {
      const data = yield call(receiptService.updateTemplateList, payload)

      if (!data.success) {
						throw data
		    } else if (data.ret_code != 1) {
					return Message.error(data.ret_content)	
		    }
				Message.success('保存成功')
		   	let { name } = yield select(_ => _.receipt)
		    yield put({
		    	type: 'query',
		    	payload: {
		    		name,
		    	},
		    })
    },

    * addTemplateList ({ payload }, { put, call, select }) {
      const data = yield call(receiptService.addTemplateList, payload)

      if (!data.success) {
		        throw data
		    } else if (data.ret_code != 1) {
		      return Message.error(data.ret_content)
		    }
				
		   	let { name } = yield select(_ => _.receipt)
		    yield put({
		    	type: 'query',
		    	payload: {
		    		name,
		    	},
		    })
    },
  },
  reducers: {

  },
})
