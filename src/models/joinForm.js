import { routerRedux } from 'dva/router'
import * as userService from 'services/user'
import * as joinUser from 'services/joinUser'
import modelExtend from 'dva-model-extend'
import { model } from 'models/common'
import queryString from 'query-string'
import { Message } from 'antd'
import md5 from 'md5'

export default modelExtend(model, {
  namespace: 'joinForm',

  state: {
    userAttrList: [],
    userAttrMap: {},

    title:'',
    descr:'',
    attrList: []
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/joinForm') {
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

      data = yield call(joinUser.getJoinForm)
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
      yield put({
        type: 'updateState',
        payload: {
          userAttrList,
          userAttrMap,
          title: data.ret_content.title,
          descr: data.ret_content.descr,
          attrList
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
    },
  },
})
