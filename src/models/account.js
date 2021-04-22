import { routerRedux } from 'dva/router'
import * as manageService from 'services/account'
import * as userService from 'services/user'
import modelExtend from 'dva-model-extend'
import { model } from 'models/common'
import queryString from 'query-string'
import { Message } from 'antd'
import md5 from 'md5'

export default modelExtend(model, {
  namespace: 'account',

  state: {
    modalVisible: false,
    modalType: null,
    modalAccount: null,
    modalDepart: null,

    pageNum: 1,
    pageSize: 20,
    accountList: [],
    count: 0,
    searchName: '',
    accountSelected: null,
    dataLoading: true,

    departs: [],
    departSelected: null,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/account') {
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
      //获取所有部门树
      yield put({
        type: 'app/getRequestDepart', 
        payload: {}
      })
      //获取所有权限树
      yield put({
        type: 'app/getRequestPrivilegeTree', 
        payload: {}
      })
      // 获取账户列表
      let { pageSize, departSelected, key } = yield select(_ => _.account)
      if (payload && payload.pageSize) {
        pageSize = payload.pageSize
      }
      const accountListData = yield call(manageService.getMgrAccountList, {
        pageNum: 1, pageSize, key, departId: departSelected ? departSelected.id : null,
      })
      if (!accountListData.success) {
        throw accountListData
      } else if (accountListData.ret_code != 1) {
        return Message.error(accountListData.ret_content)
      }

      yield put({
        type: 'updateState',
        payload: {
          accountList: accountListData.ret_content.data,
          count: parseInt(accountListData.ret_content.count),
          pageNum: 1,
          dataLoading: false,
        },
      })
    },

    * selectDepart ({ payload }, { put, call, select }) {
      if (payload.id) {
        // 获取部门信息
        const data = yield call(manageService.getMgrDepart, payload)
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }

        // 获取账户列表
        const { pageSize, searchName } = yield select(_ => _.account)
        const accountListData = yield call(manageService.getMgrAccountList, {
          pageNum: 1, pageSize, key: searchName, departId: payload.id,
        })
        if (!accountListData.success) {
          throw accountListData
        } else if (accountListData.ret_code != 1) {
          return Message.error(accountListData.ret_content)
        }
        Message.success(`当前选择的是：${data.ret_content.name}`)
        yield put({
          type: 'updateState',
          payload: {
            accountList: accountListData.ret_content.data,
            count: parseInt(accountListData.ret_content.count),
            pageNum: 1,
            departSelected: data.ret_content,
            accountSelected: null,
          },
        })
      } else {
        yield put({
          type: 'query',
          payload: {

          },
        })
        yield put({
          type: 'updateState',
          payload: {
            departSelected: null,
            accountSelected: null,
          },
        })
      }
    },

    * getMgrAccountList ({ payload }, { put, call }) {
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      const data = yield call(manageService.getMgrAccountList, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      yield put({
        type: 'updateState',
        payload: {
          accountList: data.ret_content.data,
          count: parseInt(data.ret_content.count),
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          searchName: payload.key,
          dataLoading: false,
        },
      })
    },

    * deleteMgrAccount ({ payload }, { put, call, select }) {
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      const data = yield call(manageService.deleteMgrAccount, payload)
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
      Message.success('账户删除成功')

      const {
        pageNum, pageSize, searchName, departSelected,
      } = yield select(_ => _.account)
      const list = yield call(manageService.getMgrAccountList, {
        pageNum, pageSize, key: searchName, departId: departSelected ? departSelected.id : '',
      })
      if (!list.success) {
        throw list
      } else if (list.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      yield put({
        type: 'updateState',
        payload: {
          accountList: list.ret_content.data,
          dataLoading: false,
        },
      })
    },

    * updateMgrAccount ({ payload }, { put, call, select }) {
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      if (payload.password) {
        payload.password = md5(payload.password)
        delete payload.password_repeat
      }
      const data = yield call(manageService.updateMgrAccount, payload)

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
      Message.success('账户修改成功')

      const {
        pageNum, pageSize, searchName, departSelected,
      } = yield select(_ => _.account)
      const list = yield call(manageService.getMgrAccountList, {
        pageNum, pageSize, key: searchName, departId: departSelected ? departSelected.id : '',
      })
      if (!list.success) {
        throw list
      } else if (list.ret_code != 1) {
        return Message.error(list.ret_content)
      }
      //获取所有账户列表
      yield put({
        type: 'app/getRequestAccount', 
        payload: {
          needUpdate: true
        }
      })

      yield put({
        type: 'updateState',
        payload: {
          accountList: list.ret_content.data,
          dataLoading: false,
        },
      })
    },

    * resetPwd ({ payload }, { put, call, select }) {
      payload.password = md5(payload.password)
      const data = yield call(manageService.resetPwd, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      Message.success('密码重置成功')
    },

    * updateMgrPrivilege ({ payload }, { put, call, select }) {
      let tempList = payload.privilegeList
      let str = ''
      for (let node of tempList) {
        str += `${node},`
      }
      payload.privilegeList = str
      const data = yield call(manageService.updateMgrPrivilege, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      Message.success('权限设置成功')

      const { accountSelected, departSelected } = yield select(_ => _.account)
      if (accountSelected) {
        accountSelected.privilegeList = tempList
        accountSelected._privilegeList = undefined
      } else if (departSelected) {
        departSelected.privilegeList = tempList
        departSelected._privilegeList = undefined
      }
      yield put({
        type: 'updateState',
        payload: {
          accountSelected,
          departSelected,
          editable: false
        },
      })
    },

    * updateMgrDepart ({ payload }, { put, call, select }) {
      const data = yield call(manageService.updateMgrDepart, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      Message.success('部门修改成功')

      //获取所有任务列表
      yield put({
        type: 'app/getRequestDepart', 
        payload: {
          needUpdate: true
        }
      })
      yield put({
        type: 'query',
      })
    },

    * deleteMgrDepart ({ payload }, { put, call }) {
      const data = yield call(manageService.deleteMgrDepart, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      Message.success('部门删除成功')

      yield put({
        type: 'query',
      })
    },

    * getMgrAttrList ({ payload }, { put, call }) {
      //获取列表
      let data = yield call(manageService.getMgrAttr, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let mgrAttrList =  data.ret_content;
      for (let attr of mgrAttrList) {
        if( attr.relateName ){
          attr.relateName = attr.relateName.split(","); 
        }else{
          attr.relateName = [];
        }
      }

      let addNode = {
        id: '_add',
        attrId: '',
        relateName: [],
        _add: true,
      }
      data.ret_content.push(addNode)
      yield put({
        type: 'updateState',
        payload: {
          mgrAttrList,
          dataLoading: false
        },
      })
    },

    * showDataAccess ({ payload }, { put, call }) {
      let data = yield call(userService.getUserAttr)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let userAttrList = data.ret_content;
      let userAttrMap = {};
      for (let attr of userAttrList) {
        userAttrMap[attr.id] = attr;
      }

      yield put({
        type: 'updateState',
        payload: {
          userAttrList,
          userAttrMap,
          modalVisible: true,
          modalAccount: payload,
          modalType:'dataAccess',
          dataLoading: true,
        },
      })

      yield put({
        type: 'getMgrAttrList',
        payload: {
          accountId: payload.id
        }
      })
     
    },

    * getAttrRelateList ({ payload }, { put, call, select }) {
      const { mgrAttrList } = yield select(_ => _.account)
      const node = mgrAttrList.filter(item => payload.id===item.id)[0]
      node._selectList = undefined;
      yield put({
        type: 'updateState',
        payload: {
          mgrAttrList,
        },
      })
      delete payload.id;
      payload.pageNum = 1;
      payload.pageSize = 50;
      let data = yield call(userService.getAttrRelatePage, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      node._selectList = data.ret_content.data
      yield put({
        type: 'updateState',
        payload: {
          mgrAttrList,
        },
      })
    },
    * updateMgrAttr ({ payload }, { put, call, select }) {
      const { mgrAttrList,dataLoading } = yield select(_ => _.account)
      if(dataLoading){
        return Message.error("请不要重复点击")
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading:true,
        },
      })
      let data = yield call(manageService.updateMgrAttr, payload)
      if (!data.success) {
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
      Message.success('数据权限修改成功')

     //获取列表
      yield put({
        type: 'getMgrAttrList',
        payload: {
          accountId: payload.accountId
        }
      })
    },

    * deleteMgrAttr ({ payload }, { put, call }) {
      yield put({
        type: 'updateState',
        payload: {
          dataLoading:true,
        },
      })
      let data = yield call(manageService.deleteMgrAttr, payload)
      if (!data.success) {
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
      Message.success('数据权限删除成功')

      //获取列表
      yield put({
        type: 'getMgrAttrList',
        payload: {
          accountId: payload.accountId
        }
      })
    },
  },

  reducers: {

    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

  },

})
