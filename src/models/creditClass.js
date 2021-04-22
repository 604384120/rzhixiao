import * as credit from 'services/credit'
import * as feeMission from 'services/feeMission'
import * as manageService from 'services/account'
import modelExtend from 'dva-model-extend'
import { model } from 'models/common'
import queryString from 'query-string'
import { Message } from 'antd'

export default modelExtend(model, {
  namespace: 'creditClass',

  state: {
    pageNum: 1,
    pageSize: 20,
    list: null,
    count: 0,
    dataLoading: true,
    searchName: null,
    departTree: null,
    departMap: {},
    templateList: null,
    mchList: null,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/creditClass') {
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
    * query ({ payload }, { put, call }) {
      const data = yield call(credit.getCreditClassList, { name: payload.name })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      yield put({
        type: 'updateState',
        payload: {
          list: data.ret_content?data.ret_content:[],
          dataLoading: false,
        },
      })
    },
    * getCreditClassList ({ payload }, { put, call }) {
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      const data = yield call(credit.getCreditClassList, { name: payload.name, missionId: payload.missionId })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      yield put({
        type: 'updateState',
        payload: {
          list: data.ret_content?data.ret_content:[],
          dataLoading: false,
        },
      })
    },
    * addCreditClass ({ payload }, { put, call }) {
      const param = {
        name: payload.data.name,
        type: payload.data.type,
        property: payload.data.property,
        code: payload.data.code,
        credit: payload.data.credit.toString(),
      }
      let data = yield call(credit.addCreditClass, param)
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
      data = yield call(credit.getCreditClassList)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      yield put({
        type: 'updateState',
        payload: {
          list: data.ret_content?data.ret_content:[],
          dataLoading: false,
        },
      })
    },
    * updateCreditClass ({ payload }, { put, call }) {
      const param = {
        id: payload.data.id,
        name: payload.data.name,
        type: payload.data.type,
        property: payload.data.property,
        code: payload.data.code,
        credit: payload.data.credit.toString(),
      }
      let data = yield call(credit.updateCreditClass, param)
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
      data = yield call(credit.getCreditClassList)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      yield put({
        type: 'updateState',
        payload: {
          list: data.ret_content?data.ret_content:[],
          dataLoading: false,
        },
      })
    },
    * deleteCreditClass ({ payload }, { put, call }) {
      const param = {
        id: payload.data.id,
      }
      let data = yield call(credit.deleteCreditClass, param)
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
      data = yield call(credit.getCreditClassList)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      yield put({
        type: 'updateState',
        payload: {
          list: data.ret_content?data.ret_content:[],
          dataLoading: false,
        },
      })
    },

    * importCreditClass ({ payload }, { put, call, select }) {
      const { modalImportData } = yield select(_ => _.creditClass)
      modalImportData.step = 1;
      modalImportData.cgNum = '0';
      modalImportData.wxNum = '0';
      modalImportData.cfNum = '0';
      modalImportData.cgCoverNum = '0';
      modalImportData.importing = true;
      modalImportData.covering = false;
      yield put({
        type: 'updateState',
        payload: {
          modalImportData
        },
      })
      let timer = payload.timer
      delete payload.timer
      let data = yield call(credit.importCreditClass, payload)
      
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        clearInterval(timer)
        modalImportData.step = 2;
        modalImportData.message = data.ret_content;
        yield put({
          type: 'updateState',
          payload: {
            modalImportData,
          },
        })
        return
      }
      modalImportData.step = 1;
      yield put({
        type: 'updateState',
        payload: {
          modalImportData,
          timer
        },
      })
    },

    * getImportCreditClassPrs ({ payload }, { put, call, select }) {
      const data = yield call(credit.getImportCreditClassPrs)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let { modalImportData, timer } = yield select(_ => _.creditClass)
      if (! modalImportData.covering) {
        modalImportData.cgNum = data.ret_content.cgNum
      } else {
        modalImportData.cgCoverNum = data.ret_content.cgNum
      }
      modalImportData.cfNum = data.ret_content.cfNum
      modalImportData.wxNum = data.ret_content.wxNum
      if (data.ret_content.status == '2') {
        clearInterval(timer)
        modalImportData.importing = false;
        yield put({
          type: 'updateState',
          payload: {
            modalImportData
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

    * coverCreditClass ({ payload }, { put, call, select }) {
      let { modalImportData } = yield select(_ => _.creditClass)
      let timer = payload.timer
      let data = yield call(credit.coverCreditClass)
      if (!data.success) {
        clearInterval(timer)
        throw data
      } else if (data.ret_code != 1) {
        clearInterval(timer)
        return Message.error(data.ret_content)
      }
      modalImportData.importing = true;
      modalImportData.covering = true;
      yield put({
        type: 'updateState',
        payload: {
          modalImportData,
          timer
        },
      })
    },
      
  },
})
