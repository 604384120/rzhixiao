/* global window */
/* global document */
/* global location */
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import { EnumRoleType } from 'enums'
import { query, logout, updateMyPwd } from 'services/app'
import * as menusService from 'services/menus'
import * as message from 'services/message'
import * as account from 'services/account'
import * as userService from 'services/user'
import * as setService from 'services/printSet'
// import { getTemplateText } from 'services/receipt'
import * as receipt from 'services/receipt'
import * as feeMission from 'services/feeMission'
import * as manageService from 'services/account'
import * as orderService from 'services/order'
import * as feeSubject from 'services/feeSubject'
import * as order from 'services/order'
import * as structServive from 'services/struct'
import * as group from 'services/group'
// import * as logins from 'services/app'
import queryString from 'query-string'
import { Message } from 'antd'
import md5 from 'md5'
import { token } from 'utils'
const { prefix } = config

export default {
  namespace: 'app',
  state: {
    user: null,
    permissions: {
      visit: [],
    },
    menu: [
    ],
    menuMap: {},
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    locationPathname: '',
    locationQuery: {},
    pwdModalVisible: false,
    msgVisible: false,
    msgLoading: false,
    msgList: [],
    msgPageSize: 15,
    msgPageNum: 1,
    msgCount: 0,
    msgUnreadCount: 0,
    msgStatus: null,
    msgTimer: null,
    msgRefesh: true,
    userAttrList: [],
    userAttrMap: {},
    userDisplaySence:{},
    printCheck: 0,
    textData: {},
    printLoading: false,
    printData: {},
    codeChange:new Date().getTime(),
    move:false,
    loginNum:'',

    requestMap:{}
  },
  subscriptions: {

    setupHistory ({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: queryString.parse(location.search),
          },
        })
      })
    },

    setup ({ dispatch }) {
      dispatch({ type: 'query' ,payload: {
        ...queryString.parse(location.search),
      },})
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    },
    

  },
  effects: {
    * query ({
      payload,
    }, { call, put, select }) {
      if(payload.token){
        token(payload.token)
        payload = undefined
      }
      const { locationPathname,locationQuery } = yield select(_ => _.app)
      if(locationQuery.param && locationQuery.sign && (!payload || Object.keys(payload).length==0)){
          return;
      }
      let user = window.localStorage.getItem('login_info')
      if (user) {
        user = JSON.parse(user)
      }
      if (payload && payload.user && (!user || payload.loginName != user.loginName || payload.shortName != user.shortName)) {
        user = payload.user
        user.permissions = {
          visit: [],
        }
        window.localStorage.setItem('login_info', JSON.stringify(user))
      }
      if (user) {
        if(!user.groupStatus && !token()){
          //特殊处理登录默认跳转到子学校的情况
          token(user.token)
        }
        let data = yield call(menusService.query)
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }

        const ret_content = data.ret_content
        if(!ret_content){
          return Message.error("权限不足")
        }
        const { permissions } = user
        let menu = ret_content
        permissions.visit = ret_content.map(item => item.id)
        let rediretPath = ""
        let menuMap = {}
        for(let node of menu){
          if(node.route){
            if(node.route == "/feeMission"){
              rediretPath = "/feeMission"
            }else if(!rediretPath){
              rediretPath = node.route
            }
            menuMap[node.route] = node
          }
        }
        if(token()){
          const data = yield call(userService.getSchool)
          if (!data.success) {
            throw data
          } else if (data.ret_code != 1) {
            return Message.error(data.ret_content)
          }
          
          user = {...user, ...data.ret_content}
          user.schoolName = user.name
        }

        yield put({
          type: 'updateState',
          payload: {
            user,
            permissions,
            menu,
            menuMap
          },
        })
        if (locationPathname === '/login' || locationPathname === '/' ) {
          yield put(routerRedux.push({
            pathname: rediretPath
          }))
        }
        // 查询未读消息条数
        if(token()){
          yield put({
            type: 'getMessageCount',
          })
        }
      } else if (config.openPages && config.openPages.indexOf(locationPathname) < 0) {
        window.location.href = '/#/login'
        // yield put(routerRedux.push({
        //   pathname: '/login',
        // }))
      }
    },
    * logout ({
      payload,
    }, { call, put, select }) {
      const data = yield call(logout, parse(payload))
      if (data.success && data.ret_code == 1) {
        localStorage.clear()
        let { msgTimer } = yield select(_ => _.app)
        clearInterval(msgTimer)
        yield put({
          type: 'updateState',
          payload: {
            msgVisible: false,
            msgLoading: false,
            msgList: [],
            msgPageSize: 15,
            msgPageNum: 1,
            msgCount: 0,
            msgUnreadCount: 0,
            msgStatus: null,
            msgTimer: null,
            msgRefesh: true,
            user:null,
            editUser: null
          },
        })
        //yield put({ type: 'query' })
        window.location.href = '/'
      } else {
        throw (data)
      }
    },

    * changeNavbar (action, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },

    * updatePwd ({
      payload,
    }, { call, put }) {
      const result = yield call(updateMyPwd, parse(payload))
      if (result && result.ret_code == '1') {
        Message.success('修改成功')
      }
    },

    * getMessageList ({ payload }, { put, call, select }) {
      if (payload.msgRefesh) {
        // 强制刷新，清空之间的数据
        delete payload.msgRefesh
        yield put({
          type: 'updateState',
          payload: {
            msgLoading: true,
            msgCount: '0',
            msgList: [],
            msgPageNum: 1,
            msgPageSize: 15,
            msgRefesh: false,
          },
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            msgLoading: true,
          },
        })
      }
      let { queryType } = payload
      delete payload.queryType
      const data = yield call(message.getMessageList, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      let { msgList } = yield select(_ => _.app)
      if (queryType) {
        // 追加
        msgList = [...msgList, ...data.ret_content.data]
      } else {
        msgList = data.ret_content.data
      }

      yield put({
        type: 'updateState',
        payload: {
          msgLoading: false,
          msgCount: data.ret_content.count,
          msgList,
          msgPageNum: payload.pageNum,
          msgPageSize: payload.pageSize,
        },
      })
    },

    * getMessageCount ({ payload }, { put, call, select }) {
      let { msgUnreadCount, msgRefesh, user } = yield select(_ => _.app)
      let tempUser = window.localStorage.getItem('login_info')

      if (tempUser) {
        tempUser = JSON.parse(tempUser)
        if (tempUser.loginName != user.loginName || tempUser.shortName != user.shortName) {
          window.location.reload()
          //yield put({ type: 'query' })
        }
      } else {
        //window.location.reload()
        yield put({ type: 'query' })
      }
      const data = yield call(message.getCount, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      if (msgUnreadCount != data.ret_content) {
        // 存在新消息
        msgRefesh = true
        yield put({
          type: 'updateState',
          payload: {
            msgUnreadCount: data.ret_content,
            msgRefesh,
          },
        })
      }
    },

    * updateMessageStatus ({ payload }, { put, call, select }) {
      const data = yield call(message.updateMessageStatus, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      const { msgList, msgUnreadCount } = yield select(_ => _.app)
      const msg = msgList.filter(item => item.id === payload.id)[0]
      if (msg) {
        msg.status = payload.status
        delete msg._showCheckbox
      }
      yield put({
        type: 'updateState',
        payload: {
          msgList,
          msgUnreadCount: (msgUnreadCount - 1).toString(),
        },
      })
    },

    * updateSchool ({ payload }, { put, call, select }) {
      const param = {
        name: payload.schoolName,
        shortName: payload.shortName,
        logoInfo: payload.logoInfo,
        password: md5(payload.loginPwd),
        printType: payload.printType,
      }
      const data = yield call(account.updateSchool, param)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      const { editUser } = yield select(_ => _.app)
      editUser.schoolName = payload.schoolName;
      editUser.shortName = payload.shortName;
      editUser.logoInfo = payload.logoInfo;
      editUser.printType = payload.printType;
      yield put({
        type: 'updateState',
        payload: {
          user: editUser,
          editUser: null
        },
      })

      yield put({
        type: 'query',
        payload: {
          user:editUser,
        },
      })
    },
    * getAttrRelateList ({ payload }, { put, call, select }) {
      const { userDisplaySence, structList, userAttrMap } = yield select(_ => _.app)
      const displayMap = payload.userSortMap
      const attr = displayMap[payload.attrId]
      let userAttr = userAttrMap[payload.attrId]
      if (!attr) {
        throw '错误的筛选条件！'
      }
      if(payload.attrId == 'missionId') {
        const { requestMap } = yield select(_ => _.app)
        if(!requestMap['missionList']){
           // 获取所有任务列表
          let data = yield call(feeMission.getMissionSimple)
          if (!data.success) {
            throw data
          } else if (data.ret_code != 1) {
            return Message.error(data.ret_content)
          }
          let missionList = data.ret_content.data?data.ret_content.data:[]
          let missionMap = []
          for (let mission of missionList) {
            missionMap[mission.id] = mission
          }
          requestMap['missionList'] =  missionList
          requestMap['missionMap'] =  missionMap
        }
        attr._selectList = requestMap['missionList']
      }else if(payload.attrId == 'subjectId') {
        const { requestMap } = yield select(_ => _.app)
        if(!requestMap['subjectList']){
           // 获取所有项目列表
          let data = yield call(feeSubject.getSubjectList)
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
          requestMap['subjectList'] =  subjectList
          requestMap['subjectMap'] =  subjectMap
        }
        attr._selectList = requestMap['subjectList']
      }else if(payload.attrId == 'payType'){
        const { requestMap } = yield select(_ => _.app)
        if(!requestMap['payTypeList']){
          // 获取支付方式
          let data = yield call(orderService.getOrderPayType)
          if (!data.success) {
            throw data
          } else if (data.ret_code != 1) {
            return Message.error(data.ret_content)
          }
          let payTypeList = data.ret_content? data.ret_content:[]
          let payTypeNameMap = {};
          for (let payType of payTypeList) {
            payTypeNameMap[payType.payType] = payType.name;
          }
          requestMap['payTypeList'] =  payTypeList
          requestMap['payTypeMap'] =  payTypeNameMap
        }
        attr._selectList = requestMap['payTypeList']
      }else if(payload.attrId == 'accountId') {
        const { requestMap } = yield select(_ => _.app)
        if(!requestMap['accountList']){
          // 获取所有操作人列表
          let data = yield call(account.getMgrAccountList)
          if (!data.success) {
            throw data
          } else if (data.ret_code != 1) {
            return Message.error(data.ret_content)
          }
          let accountList = data.ret_content.data?data.ret_content.data:[]
          requestMap['accountList'] =  accountList
        }
        attr._selectList = requestMap['accountList']
      }else if(payload.attrId == 'loanType') {
        const { requestMap } = yield select(_ => _.app)
        if(!requestMap['loanTypeList']){
          // 获取所有贷款类型
          let data = yield call(order.getLoanType)
          if (!data.success) {
            throw data
          } else if (data.ret_code != 1) {
            return Message.error(data.ret_content)
          }
          let loanTypeMap = {}
          for(let node of data.ret_content){
            loanTypeMap[node['id']] = node['name']
          }
          requestMap['loanTypeList'] =  data.ret_content?data.ret_content:[]
          requestMap['loanTypeMap'] =  loanTypeMap
        }
        attr._selectList = requestMap['loanTypeList']
      }else if(payload.attrId == 'subsidyType') {
        const { requestMap } = yield select(_ => _.app)
        if(!requestMap['subsidyTypeList']){
          // 获取所有奖助学金类型
          let data = yield call(order.getSubsidyType)
          if (!data.success) {
            throw data
          } else if (data.ret_code != 1) {
            return Message.error(data.ret_content)
          }
          requestMap['subsidyTypeList'] =  data.ret_content?data.ret_content:[]
        }
        attr._selectList = requestMap['subsidyTypeList']
      }else if(userAttr && userAttr.valueType == '3') {
        if(payload.value){
          //需要联动其他的筛选条件
          let reset = true
          if(attr._idSelected && attr._idSelected.length>0){
            //判断数据变动情况
            reset = false
            for(let a of attr._idSelected){
              if(payload.value.indexOf(a) < 0){
                //数据有减少
                reset = true
                break;
              }
            }
          }
          let subStruct = false //是否是子层级
          for(let struct of structList) {
            if(displayMap[struct.attrId]){
              //displayMap[struct.attrId]._refresh = false  // 设置所有的层级list为不可刷新
              if(subStruct) {  // 当循环超过当前选择的层级后
                displayMap[struct.attrId]._refresh = true     // 当循环超过当前选择的层级后，把当前层级之下的层级全部设置为强制重新刷新
                if(reset) {  // 当循环超过当前选择的层级后，把当前层级之下的层级全部置空
                  displayMap[struct.attrId]._idSelected = []
                  displayMap[struct.attrId]._options = []
                }
              }else if(struct.attrId == payload.attrId){
                subStruct = true
              }
            }
          }

          //需要保存当前的选项，避免因为查询而消失
          attr._options = attr._selectList.filter(_=>payload.value.indexOf(_.id)>=0)
          attr._idSelected = payload.value
          attr._valueType = '3'
          if(attr._haskey){
            attr._refresh = true
          }
        }else{
          //查询数据
          let params = {}
          params.pageNum = 1;
          params.pageSize = 50;
          params.structId = userAttr.relateId
          for(let struct of structList) {
            if(displayMap[struct.attrId]){
              if(struct.attrId == payload.attrId){
                break;
              }
              if(displayMap[struct.attrId]._idSelected && displayMap[struct.attrId]._idSelected.length>0){
                params.pid = displayMap[struct.attrId]._idSelected.toString()
              }
            }
          }
          if(!attr._selectList || attr._selectList.length<=0 || attr._refresh || payload.key) {
            if(payload.key){
              params.searchName = payload.key
              attr._haskey = true
            }else{
              attr._haskey = false
            }
            params.noParent = '1' // 筛选框不需要父级传1
            const data = yield call(structServive.getItemList, params)
            if (!data.success) {
              throw data
            } else if (data.ret_code != 1) {
              return Message.error(data.ret_content)
            }
            const structItemList = data.ret_content.data?data.ret_content.data:[]
            if(attr._options){
              for(let a of attr._options){
                if(structItemList.filter(_=>_.id===a.id).length<=0){
                  structItemList.push(a)
                }
              }
            }
            attr._selectList = structItemList
            attr._refresh = false
          }
        }
      }else{
        let param = {}
        param.pageNum = 1;
        param.pageSize = 50;
        param.attrId = payload.attrId
        param.sence = payload.sence
        if(payload.key){
          param.key = payload.key
        }
        let data = yield call(userService.getAttrRelatePage, param)
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }
        displayMap[payload.attrId]._selectList = data.ret_content.data
      }
      yield put({
        type: 'updateState',
        payload: {
          userDisplaySence,
        },
      })
    },
    * initDisplay ({ payload }, { put, call, select }) {
      // 获取用户所有属性
      let { userDisplaySence, userAttrList, userAttrMap, structList } = yield select(_ => _.app)
      if(!structList && token()) { // 获取层级结构
        let data = yield call(structServive.getStructList)
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }
        yield put({
          type: 'updateState',
          payload: {
            structList: data.ret_content?data.ret_content:[]
          },
        })
      }
      if((!userAttrList || userAttrList.length<=0) && token()){
        let data  = yield call(userService.getUserAttr)

        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }
        userAttrList = data.ret_content
        userAttrMap = {}
        let i = 0
        let tempPid = null
        for (let attr of userAttrList) {
          attr._position = i++
          userAttrMap[attr.id] = attr
        }
        yield put({
          type: 'updateState',
          payload: {
            userAttrList,
            userAttrMap,
          },
        })
      }
      let initFlag = false
      for(let senceNode of payload.params){
        let {sence, displayExtra, senceKey} = senceNode
        if(senceKey){
          sence += "_" + senceKey
        }
        if(userDisplaySence[sence]){
          //已经存在
          continue
        }
        if(payload.func){
          //从其他地方获取
          if(!initFlag){
            let data = yield call(payload.func, payload.fontParams)
            if (!data.success) {
              throw data
            } else if (data.ret_code != 1) {
              return Message.error(data.ret_content)
            }
            userAttrList = data.ret_content
            userAttrMap = {}
            let i = 0
            let tempPid = null
            for (let attr of userAttrList) {
              attr._position = i++
              userAttrMap[attr.id] = attr
            }
            initFlag = true
          }
          userDisplaySence[sence] = {...userDisplaySence[sence], ...{userAttrList,userAttrMap}}
        }
        if(senceNode.userAttrList){
          //固定字段
          userAttrList = senceNode.userAttrList
          userAttrMap = {}
          let i = 0
          let tempPid = null
          for (let attr of userAttrList) {
            attr._position = i++
            userAttrMap[attr.id] = attr
          }
          userDisplaySence[sence] = {...userDisplaySence[sence], ...{userAttrList,userAttrMap}}
        }
        let data = null
        if(token()){
          data = yield call(userService.getDisplayAttr, { sence: senceNode.sence, senceKey:senceNode.senceKey, defaultType: senceNode.defaultType })
        }else{
          data = yield call(group.getDisplayAttrAdmin, { sence: senceNode.sence, senceKey:senceNode.senceKey, defaultType: senceNode.defaultType })
        }
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }
        if(!data.ret_content){
          data.ret_content = []
        }
        const displayList = []
        const displayMap = {}
        const displayListTemp = []
        let i = 0
        let tempPid = null
        const { onFilter, fixed } = senceNode
        for (let attr of data.ret_content) {
          if(!userAttrMap[attr.id] && (!displayExtra || !displayExtra[attr.id])){
            //不存在的属性直接删除并跳过
            continue
          }
          if(onFilter && onFilter(userAttrMap[attr.id])){
            continue
          }
          attr._position = i++
          attr._checked = true
          attr.name = userAttrMap[attr.id]?userAttrMap[attr.id].name:displayExtra[attr.id]
          if(displayExtra && displayExtra[attr.id]){
            attr._extra = true
          }
          displayList.push(attr)
          displayMap[attr.id] = attr
          displayListTemp.push({ ...attr })
        }
        i = 0
        tempPid = null
        for (let attr of userAttrList) {
          if(onFilter && onFilter(attr)){
            continue
          }
          if (!displayMap[attr.id]) {
            let attrTemp = { ...attr }
            attrTemp._checked = false
            attrTemp._checkedsdf = false
            attrTemp._position = displayListTemp.length
            if(fixed && fixed[attr.name]){
              attrTemp._checked = true
              let attrFixed = {...attrTemp}
              displayMap[attrFixed.id] = attrFixed
              displayList.push(attrFixed)
            }
            displayListTemp.push(attrTemp)
          }
        }
        // 添加固定过滤条件
        for(let extra in displayExtra){
          if (!displayMap[extra]) {
            let attr = {
              id: extra,
              name: displayExtra[extra],
              _position: displayListTemp.length,
              _checked: false,
              _extra: true,
            }
            displayListTemp.push(attr)
          }
        }
        userDisplaySence[sence] = {...userDisplaySence[sence], ...{
          visible: false,
          displayList,
          displayListTemp,
          displayMap,
          onFilter,
        }}
      }
      yield put({
        type: 'updateState',
        payload: {
          userDisplaySence,
        },
      })
    },

    * getRequestTemplate ({ payload }, { put, call, select }) {
      let { requestMap } = yield select(_ => _.app)
      if(!payload.needUpdate && requestMap['template'] && requestMap['template'].length > 0){
        return
      }
        // 获取票据类型
      const dataTemplate = yield call(receipt.getTemplateList)
      if (!dataTemplate.success) {
        throw dataTemplate
      } else if (dataTemplate.ret_code != 1) {
        return Message.error(dataTemplate.ret_content)
      }
      requestMap['template'] = dataTemplate.ret_content?dataTemplate.ret_content:[]
      if(payload.needUpdate){
        yield put({
          type: 'updateState',
          payload: {
            requestMap,
          },
        })
      }
    },

    * getRequestMch ({ payload }, { put, call, select }) {
      let { requestMap } = yield select(_ => _.app)
      if(!payload.needUpdate && requestMap['mch'] && requestMap['mch'].length > 0){
        return
      }
       // 获取收款账户
      const dataMch = yield call(feeMission.getMchList, {clear:'1'})
      if (!dataMch.success) {
        throw dataMch
      } else if (dataMch.ret_code != 1) {
        return Message.error(dataMch.ret_content)
      }
      requestMap['mch'] = dataMch.ret_content?dataMch.ret_content:[]
      if(payload.needUpdate){
        yield put({
          type: 'updateState',
          payload: {
            requestMap,
          },
        })
      }
    },

    * getRequestDepart ({ payload }, { put, call, select }) {
      let { requestMap } = yield select(_ => _.app)
      if(!payload.needUpdate && requestMap['departTree'] && requestMap['departTree'].length > 0){
        return
      }
       // 获取部门树
       const departTreeData = yield call(manageService.getMgrDepartTree)
       if (!departTreeData.success) {
         throw departTreeData
       } else if (departTreeData.ret_code != 1) {
         return Message.error(departTreeData.ret_content)
       }
       let departMap = {}
       const changeData = (data, path) => {
        data.forEach((index) => {
           let tempPath = [...path]
           index.value = index.id
           if (index.children) {
             tempPath.push(index.id)
             changeData(index.children, tempPath)
           }
           index.path = tempPath
           departMap[index.id] = index
        })
      }
      changeData(departTreeData.ret_content, [])
      requestMap['departTree'] = departTreeData.ret_content?departTreeData.ret_content:[]
      requestMap['departMap'] = departMap
      if(payload.needUpdate){
        yield put({
          type: 'updateState',
          payload: {
            requestMap,
          },
        })
      }
    },

    * getRequestPayType ({ payload }, { put, call, select }) {
      let { requestMap } = yield select(_ => _.app)
      if(!payload.needUpdate && requestMap['payTypeList'] && requestMap['payTypeList'].length > 0){
        return
      }
        // 获取支付方式
      let data = yield call(orderService.getOrderPayType)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let payTypeList = data.ret_content? data.ret_content:[]
      let payTypeNameMap = {};
      for (let payType of payTypeList) {
        payTypeNameMap[payType.payType] = payType.name;
      }
      requestMap['payTypeList'] =  payTypeList
      requestMap['payTypeMap'] =  payTypeNameMap
      if(payload.needUpdate){
        yield put({
          type: 'updateState',
          payload: {
            requestMap,
          },
        })
      }
    },

    * getRequestSubject ({ payload }, { put, call, select }) {
      let { requestMap } = yield select(_ => _.app)
      if(!payload.needUpdate && requestMap['subjectList'] && requestMap['subjectList'].length > 0){
        return
      }
        // 获取所有项目列表
      let data = yield call(feeSubject.getSubjectList)
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
      requestMap['subjectList'] =  subjectList
      requestMap['subjectMap'] =  subjectMap
      if(payload.needUpdate){
        yield put({
          type: 'updateState',
          payload: {
            requestMap,
          },
        })
      }
    },

    * getRequestYear ({ payload }, { put, call, select }) {
      let { requestMap } = yield select(_ => _.app)
      if(!payload.needUpdate && requestMap['yearList'] && requestMap['yearList'].length > 0){
        return
      }
        //获取学年列表
      let data = yield call(feeMission.getYearList)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let yearList = data.ret_content?data.ret_content:[]
      requestMap['yearList'] =  yearList
      if(payload.needUpdate){
        yield put({
          type: 'updateState',
          payload: {
            requestMap,
          },
        })
      }
    },

    * getRequestMission ({ payload }, { put, call, select }) {
      let { requestMap } = yield select(_ => _.app)
      if(!payload.needUpdate && requestMap['missionList'] && requestMap['missionList'].length > 0){
        return
      }
        // 获取所有任务列表
      let data = yield call(feeMission.getMissionSimple)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let missionList = data.ret_content.data?data.ret_content.data:[]
      let missionMap = []
      for (let mission of missionList) {
        missionMap[mission.id] = mission
      }
      requestMap['missionList'] =  missionList
      requestMap['missionMap'] =  missionMap
      if(payload.needUpdate){
        yield put({
          type: 'updateState',
          payload: {
            requestMap,
          },
        })
      }
    },

    * getRequestAccount ({ payload }, { put, call, select }) {
      let { requestMap } = yield select(_ => _.app)
      if(!payload.needUpdate && requestMap['accountList'] && requestMap['accountList'].length > 0){
        return
      }
        // 获取所有操作人列表
      let data = yield call(account.getMgrAccountList)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let accountList = data.ret_content.data?data.ret_content.data:[]
      requestMap['accountList'] =  accountList
      if(payload.needUpdate){
        yield put({
          type: 'updateState',
          payload: {
            requestMap,
          },
        })
      }
    },

    * getRequestLoanType ({ payload }, { put, call, select }) {
      let { requestMap } = yield select(_ => _.app)
      if(!payload.needUpdate && requestMap['loanTypeList'] && requestMap['loanTypeList'].length > 0){
        return
      }
        // 获取所有贷款类型
      let data = yield call(order.getLoanType)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let loanTypeMap = {}
      for(let node of data.ret_content){
        loanTypeMap[node['id']] = node['name']
      }
      requestMap['loanTypeList'] =  data.ret_content?data.ret_content:[]
      requestMap['loanTypeMap'] =  loanTypeMap
      if(payload.needUpdate){
        yield put({
          type: 'updateState',
          payload: {
            requestMap,
          },
        })
      }
    },

    * getRequestSubsidyType ({ payload }, { put, call, select }) {
      let { requestMap } = yield select(_ => _.app)
      if(!payload.needUpdate && requestMap['subsidyTypeList'] && requestMap['subsidyTypeList'].length > 0){
        return
      }
        // 获取所有奖助学金类型
      let data = yield call(order.getSubsidyType)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      requestMap['subsidyTypeList'] =  data.ret_content?data.ret_content:[]
      if(payload.needUpdate){
        yield put({
          type: 'updateState',
          payload: {
            requestMap,
          },
        })
      }
    },

    * getRequestPrivilegeTree ({ payload }, { put, call, select }) {
      let { requestMap } = yield select(_ => _.app)
      if(!payload.needUpdate && requestMap['privilegeTree'] && requestMap['privilegeTree'].length > 0){
        return
      }
        // 获取权限树
      const privilegeTreeData = yield call(manageService.getMgrPrivilegeTree)
      if (!privilegeTreeData.success) {
        throw privilegeTreeData
      } else if (privilegeTreeData.ret_code != 1) {
        return Message.error(privilegeTreeData.ret_content)
      }
      requestMap['privilegeTree'] =  privilegeTreeData.ret_content?privilegeTreeData.ret_content:[]
      if(payload.needUpdate){
        yield put({
          type: 'updateState',
          payload: {
            requestMap,
          },
        })
      }
    },

    * getRequestGrade ({ payload }, { put, call, select }) {
      let { requestMap } = yield select(_ => _.app)
      if(!payload.needUpdate && requestMap['gradeList'] && requestMap['gradeList'].length > 0){
        return
      }
        // 获取权所有年级
      let data = yield call(userService.getAttrRelatePage, {pageNum:1,pageSize:50,attrName:'年级'})
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      requestMap['gradeList'] =  data.ret_content.data?data.ret_content.data:[]
      if(payload.needUpdate){
        yield put({
          type: 'updateState',
          payload: {
            requestMap,
          },
        })
      }
    },

    * resetDisplay ({ payload }, { put, call, select }) {
      let { userDisplaySence, userAttrList, userAttrMap } = yield select(_ => _.app)
      if(userDisplaySence[payload.sence].userAttrList){
        userAttrList = userDisplaySence[payload.sence].userAttrList
        userAttrMap = userDisplaySence[payload.sence].userAttrMap
      }
      let sence = payload.sence
      let data = null
      if(token()){
        data = yield call(userService.deleteDisplayAttr, { sence })
      }else{
        data = yield call(group.deleteDisplayAttrAdmin, { sence })
      }
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      if(token()){
        data = yield call(userService.getDisplayAttr, { sence })
      }else{
        data = yield call(group.getDisplayAttrAdmin, { sence })
      }
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      if(!data.ret_content){
        data.ret_content = []
      }
      const displayList = []
      const displayMap = {}
      const displayListTemp = []
      let i = 0
      let tempPid = null
      const displayExtra = payload.displayExtra
      for (let attr of data.ret_content) {
        if(!userAttrMap[attr.id] && (!displayExtra || !displayExtra[attr.id])){
          //不存在的属性直接跳过
          continue
        }
        attr._position = i++
        attr._checked = true
        attr.name = userAttrMap[attr.id]?userAttrMap[attr.id].name:displayExtra[attr.id]
        if(payload.onFilter){
          continue
        }
        if(displayExtra && displayExtra[attr.id]){
          attr._extra = true
        }
        displayList.push(attr)
        displayListTemp.push({ ...attr })
        displayMap[attr.id] = attr
      }
      i = 0
      tempPid = null
      for (let attr of userAttrList) {
        if(payload.onFilter){
          continue
        }
        if (!displayMap[attr.id]) {
          let attrTemp = { ...attr }
          attrTemp._checked = false
          attrTemp._position = displayListTemp.length
          displayListTemp.push(attrTemp)
        }
      }
      // 添加固定过滤条件
      for(let extra in displayExtra){
        if (!displayMap[extra]) {
          let attr = {
            id: extra,
            name: displayExtra[extra],
            _position: displayListTemp.length,
            _checked: false,
            _extra: true
          }
          displayListTemp.push(attr)
        }
      }
      Message.success('重置成功')
      const displaySence = userDisplaySence[payload.sence];
      displaySence.displayList = displayList
      displaySence.displayListTemp = displayListTemp
      displaySence.displayMap = displayMap
      yield put({
        type: 'updateState',
        payload: {
          userDisplaySence
        },
      })
    },

    * updateDisplay ({ payload }, { put, call, select }) {
      const { userDisplaySence } = yield select(_ => _.app)
      const { displayListTemp } = payload
      const displayList = []
      const displayMap = []
      let tempStr = ''
      let i = 0
      let tempPid = null
      for (let attr of displayListTemp) {
        if (attr._checked) {
          let attrTemp = { ...attr }
          attrTemp._checked = true
          attrTemp._position = i++
          displayList.push(attrTemp)
          displayMap[attrTemp.id] = attrTemp
          tempStr += `${attrTemp.id},`
        }
      }
      let sence = payload.sence
      let data = null
      if(token()){
        data = yield call(userService.updateDisplayAttr, { sence, attrList: tempStr })
      }else{
        data = yield call(group.updateDisplayAttrAdmin, { sence, attrList: tempStr })
      }
      
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      Message.success('设置成功')
      const displaySence = userDisplaySence[payload.sence];
      displaySence.visible = false
      displaySence.displayList = displayList
      displaySence.displayMap = displayMap
      yield put({
        type: 'updateState',
        payload: {
          displaySence
        },
      })
    },

    * getPrint ({ payload }, { put, call, select }) {
      const { printData } = yield select(_ => _.app)
      let templateId  = ""
      for(let data of printData._list){
        let subList = data.feeBillLists;
        let billStr = "";
        let billList = []
        for(let billNode of subList){
          if(printData._subjectMap[billNode.subjectId]._checked && !billNode.receiptNo){
            billStr += billNode.id+",";
            billList.push(billNode)
          }
        }
        if(billList.length<=0){
          continue
        }
        let param = {
          missionId:data.missionId,
          orderNo:data.orderNo,
          billId: billStr,
        }
        let settingData = yield call(setService.getSetting, param)
        if (!settingData.success) {
          throw settingData
        } else if (settingData.ret_code != 1) {
          return Message.error(settingData.ret_content)
        }
        settingData = settingData.ret_content
        settingData.orderNo = data.orderNo
        settingData.missionId = data.missionId
        settingData.billId = billStr
        data._settingData = settingData
        templateId = settingData.templateId
      }
     
      let temData = yield call(receipt.getTemplateText, { templateId })
      if (!temData.success) {
        throw temData
      } else if (temData.ret_code != 1) {
        return Message.error(temData.ret_content)
      }
      let textData = temData.ret_content
      yield put({
        type: 'updateState',
        payload: {
          printData,
          textData,
          printCheck: 1
        },
      })
    },
    * print ({ payload }, { put, call, select }) {
      yield put({
        type: 'updateState',
        payload: {
          printing: true,
        },
      })
      window.print()
      yield put({
        type: 'updateState',
        payload: {
          printing: false,
        },
      })
      yield put({
        type: 'updateState',
        payload: {
          printCheck: 2
        },
      })
    },

    * printSuccessBatch ({ payload }, { put, call, select }) {
      const { printData } = yield select(_ => _.app)
      if(printData._dataLoading){
        return Message.error("请不要重复点击")
      }

      printData._dataLoading = true
      yield put({
        type: 'updateState',
        payload: {
          printData,
        },
      })

      for(let record of printData._list){
        if(!record._settingData){
          continue
        }
        let param = {
          beginNo: record._settingData.beginNo,
          missionId: record._settingData.missionId,
          orderNo: record._settingData.orderNo,
          settingId: record._settingData.settingId,
          receiptNo: record._settingData.receiptNo,
          billId: record._settingData.billId,
          remark: printData._remark?printData._remark:undefined
        }
        let data = yield call(setService.addReceiptHistory, param)
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          printData._dataLoading = false
          return Message.error(data.ret_content)
        }
        for(let billNode of record.feeBillLists){
          if(printData._subjectMap[billNode.subjectId]._checked && !billNode.receiptNo){
            billNode.receiptNo = record._settingData.receiptNo;
            billNode.downUrl = record._settingData.downUrl;
          }
        }
        printData._isPrinting --;
      }
      Message.success('打印成功')
      printData._dataLoading = false
      yield put({
        type: 'updateState',
        payload: {
          printCheck: 0,
          printData,
        },
      })
    },

    * printSuccess ({ payload }, { put, call, select }) {
      const { printData } = yield select(_ => _.app)

      let { list } = payload
      if(!list){
        list = [payload]
      }

      for(let node of list){
        let { notips, billList } = node;
        if(!notips){
          if(printData._dataLoading){
            return Message.error("请不要重复点击")
          }
          printData._dataLoading = true
        }else{
          delete node.notips;
        }
        delete node.billList
        if(printData._remark){
          node.remark = printData._remark
        }
        const data = yield call(setService.addReceiptHistory, node)
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          printData._dataLoading = false
          return Message.error(data.ret_content)
        }
        if(!notips){
          Message.success('打印成功')
        }
       
        for(let bill of billList){
          bill.receiptNo = data.ret_content.receiptNo;
          bill.downUrl = data.ret_content.downUrl;
        }
        billList[0]._order._dataLoading = false
        printData._dataLoading = false
        printData._isPrinting --;
        yield put({
          type: 'updateState',
          payload: {
            printCheck: 0,
            printData,
          },
        })
      }
      
    },

    * printDelete ({ payload }, { put, call, select }) {
      const { printData } = payload
      let param = [{
        missionId: printData._order.missionId,
        orderNo: printData._order.orderNo,
        receiptNo: printData.receiptNo,
      }]
      const data = yield call(setService.deleteReceiptHistory, {receiptList:param})
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      Message.success('作废成功')
      let receiptNo = printData.receiptNo
      for(let bill of printData._order.feeBillLists){
        if(bill.receiptNo == receiptNo){
          bill.receiptNo = ''
        }
      }

      yield put({
        type: 'updateState',
        payload: {
          printData,
        },
      })
    },

  },
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    switchSider (state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },

    showPwdModal (state, { payload }) {
      return { ...state, ...payload, pwdModalVisible: true }
    },

    hidePwdModal (state) {
      return { ...state, pwdModalVisible: false }
    },
  },
}
