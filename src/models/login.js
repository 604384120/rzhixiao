import { routerRedux } from 'dva/router'
import { autoLogin,login } from 'services/login'
import { Message } from 'antd'
import queryString from 'query-string'
import md5 from 'md5'

export default {
  namespace: 'login',

  state: {},

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/login') {
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
      if(payload.param && payload.sign){
        //自动登陆确认，现在正在加载中
        let editUser = {loading:true};
        yield put({
          type: 'app/updateState',
          payload: {
            editUser: editUser,
          },
        })
        const data = yield call(autoLogin, payload)
        if(data.ret_code == 1){
          let user = data.ret_content;
          if(user.shortName){
            //简称存在登陆成功
            yield put({
              type: 'app/query',
              payload: {
                user: data.ret_content,
                editUser: null,
              },
            })
          }else{
            //弹出验证页面
            editUser = data.ret_content;
            editUser.loading = false;
            yield put({
              type: 'app/updateState',
              payload: {
                editUser: editUser,
              },
            })
          }
        }else {
          return Message.error(data.ret_content)
        }
      }
    },

    * login ({
      payload,
    }, { put, call, select }) {
      payload.loginPwd = md5(payload.loginPwd)
      const data = yield call(login, payload)
      //const { locationQuery } = yield select(_ => _.app)
      if (data.ret_code == 1) {
        //const { from } = locationQuery
        yield put({
          type: 'app/query',
          payload: {
            user: data.ret_content,
          },
        })
        // if (from && from !== '/login') {
        //   yield put(routerRedux.push(from))
        // } else {
        //   yield put(routerRedux.push('/feeMission'))
        // }
      } else {
        yield put({
          type:'app/updateState',
          payload:{
            loginNum:data.ret_content.count,
            move:data.ret_content.count>=3?true:false,
            codeChange:new Date().getTime(),
          }
        })
        return Message.error(data.ret_content.msg)
      }
    },
  },

}
