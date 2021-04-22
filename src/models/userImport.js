import { routerRedux } from 'dva/router'
import * as user from 'services/user'
import modelExtend from 'dva-model-extend'
import { model } from 'models/common'
import queryString from 'query-string'
import { Message } from 'antd'
import md5 from 'md5'

export default modelExtend(model, {
  namespace: 'userImport',

  state: {
    step: 0,
    fileList: [],
    uploading: false,
    uploadDisable: true,
    filePath: '',

    userAttrList: [],
    editable: '0',
    importInfo: [],
    importing: false,
    timerID: null,
    cfNum: '0',
    cgNum: '0',
    cgUrl: null,
    wxNum: '0',
    cgCoverNum: '0',
    cgCoverUrl: null,
    covering: false,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/userImport') {
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
    },

    * importUserInfo ({ payload }, { put, call }) {
      const data = yield call(user.importUserInfo, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      // 获取用户所有属性
      const attrData = yield call(user.getUserAttr)
      if (!attrData.success) {
        throw data
      } else if (attrData.ret_code != 1) {
        return Message.error(attrData.ret_content)
      }

      yield put({
        type: 'updateState',
        payload: {
          importInfo: data.ret_content,
          userAttrList: attrData.ret_content,
        },
      })
    },

    * importConfirm ({ payload }, { put, call }) {
      let data = yield call(user.importConfirm, { sortList: payload.sortList, editable:payload.editable })
      if (!data.success) {
        clearInterval(payload.timerID)
        throw data
      } else if (data.ret_code != 1) {
        clearInterval(payload.timerID)
        return Message.error(data.ret_content)
      }

      Message.success('设置成功！')

      yield put({
        type: 'updateState',
        payload: {
          step: 2,
          cgNum: '0',
          cgUrl: null,
          wxNum: '0',
          cfNum: '0',
          cgCoverNum: '0',
          importing: true,
          cgCoverUrl: null,
          covering: false,
          timerID: payload.timerID,
        },
      })
    },

    * getImportPrs ({ payload }, { put, call, select }) {
      const data = yield call(user.getImportPrs)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let {
        covering, cgNum, cgUrl, cgCoverNum, cgCoverUrl,
      } = yield select(_ => _.userImport)
      if (!covering) {
        cgNum = data.ret_content.cgNum
      } else {
        cgCoverNum = data.ret_content.cgNum
      }

      let cfNum = data.ret_content.cfNum
      let wxNum = data.ret_content.wxNum
      if (data.ret_content.status == '2') {
        const { timerID } = yield select(_ => _.userImport)
        clearInterval(timerID)
        if (!covering) {
          cgUrl = data.ret_content.url
        } else {
          cgCoverUrl = data.ret_content.url
        }
        yield put({
          type: 'updateState',
          payload: {
            cfNum,
            cgNum,
            cgUrl,
            wxNum,
            cgCoverNum,
            cgCoverUrl,
            importing: false,

          },
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            cfNum,
            cgNum,
            wxNum,
            cgCoverNum,
          },
        })
      }
    },

    * coverUser ({ payload }, { put, call }) {
      let data = yield call(user.coverUser)
      if (!data.success) {
        clearInterval(payload.timerID)
        throw data
      } else if (data.ret_code != 1) {
        clearInterval(payload.timerID)
        return Message.error(data.ret_content)
      }

      yield put({
        type: 'updateState',
        payload: {
          importing: true,
          timerID: payload.timerID,
          covering: true,
        },
      })
    },
  },
})
