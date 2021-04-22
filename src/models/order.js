import { routerRedux } from 'dva/router'
import * as order from 'services/order'
import * as feeMission from 'services/feeMission'
import * as user from 'services/user'
import * as struct from 'services/struct'
import * as account from 'services/account'
import modelExtend from 'dva-model-extend'
import { model } from 'models/common'
import queryString from 'query-string'
import { Message } from 'antd'
import moment from 'moment'
import * as setService from 'services/printSet'
import { getTemplateText } from 'services/receipt'

export default modelExtend(model, {
  namespace: 'order',

  state: {
    sortNameMap: {},
    payTypeNameMap: {},
    pageNum: 1,
    pageSize: 20,
    list: null,
    count: 0,
    dataLoading: true,
    searchName: '',
    beginDate: `${moment().format('YYYY-MM-DD')} 00:00:00`,
    endDate: `${moment().format('YYYY-MM-DD')} 23:59:59`,
    missionIdSelected: '',
    missionList: '',
    structList: [],
    payType: '',
    reBeginDate: '',
    reEndDate: '',
    receiptBeginNo: '',
    receiptEndNo: '',
    accountId: [],
    accountList: null,
    userAttrList: [],
    userAttrMap: {},
    userAttrRelateMap: {},
    userDisplayList: [],
    userDisplayListTemp: [],
    userDisplayMap: {},
    displayVisible: false,
    userSortList: [],
    userSortListTemp: [],
    userSortMap: {},
    dsortVisible: false,
    settingData: {},
    textData: {},
    templateHeight: 0,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/order') {
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
      let sortNameMap = {}
      sortNameMap.payType = '支付方式'
      sortNameMap.reDate = '开票时段'
      sortNameMap.receiptNo = '票据号段'
      sortNameMap.accountId = '经办人'

      let payTypeNameMap = {}
      payTypeNameMap['1'] = '微信'
      payTypeNameMap['2'] = '支付宝'
      payTypeNameMap['3'] = '现金'
      payTypeNameMap['4'] = 'POS机'

      let data = yield call(user.getUserAttr)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        throw data.ret_content
      }
      const userAttrList = data.ret_content
      const userAttrMap = {}
      const userAttrRelateMap = {}
      i = 0
      for (let attr of userAttrList) {
        attr._position = i++
        userAttrMap[attr.id] = attr
        userAttrRelateMap[`${attr.valueType}_${attr.relateId}`] = attr
      }

      // 获取显示属性
      data = yield call(user.getDisplayAttr, { sence: 'orderDisplay' })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        throw data.ret_content
      }
      const userDisplayList = data.ret_content
      const userDisplayMap = {}
      const userDisplayListTemp = []
      let i = 0
      for (let attr of userDisplayList) {
        attr._position = i++
        attr._checked = true
        attr.name = userAttrMap[attr.id].name
        userDisplayMap[attr.id] = attr
        userDisplayListTemp.push({ ...attr })
      }

      for (let attr of userAttrList) {
        if (!userDisplayMap[attr.id]) {
          let attrTemp = { ...attr }
          attrTemp._checked = false
          attrTemp._position = userDisplayListTemp.length
          userDisplayListTemp.push(attrTemp)
        }
      }

      data = yield call(struct.getStructList)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        throw data.ret_content
      } else if (!data.ret_content) {
        throw '请先设置学校结构'
      }
      let structList = data.ret_content
      let structMap = {}
      for (let struct of structList) {
        if (struct.status == '1') {
          sortNameMap[struct.id] = struct.label
        }
      }

      // 获取过滤条件
      data = yield call(user.getDisplayAttr, { sence: 'orderSort' })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        throw data.ret_content
      }
      const userSortList = data.ret_content
      const userSortMap = {}
      const userSortListTemp = []
      i = 0
      for (let attr of userSortList) {
        attr._position = i++
        attr._checked = true
        if (sortNameMap[attr.id]) {
          attr.name = sortNameMap[attr.id]
        }
        userSortListTemp.push({ ...attr })
        userSortMap[attr.id] = attr
      }

      // 添加层级过滤条件
      for (let struct of structList) {
        if (struct.status == '1' && !userSortMap[struct.id]) {
          let attr = {
            id: struct.id,
            name: struct.label,
            _position: userSortListTemp.length,
            _checked: false,
            attrId: userAttrRelateMap[`3_${struct.id}`].id,
          }
          userSortListTemp.push(attr)
        }
      }
      // 添加固定过滤条件
      if (!userSortMap.payType) {
        let attr = {
          id: 'payType',
          name: '支付方式',
          _position: userSortListTemp.length,
          _checked: false,
        }
        userSortListTemp.push(attr)
      }
      if (!userSortMap.reDate) {
        let attr = {
          id: 'reDate',
          name: '开票时段',
          _position: userSortListTemp.length,
          _checked: false,
        }
        userSortListTemp.push(attr)
      }
      if (!userSortMap.receiptNo) {
        let attr = {
          id: 'receiptNo',
          name: '票据号段',
          _position: userSortListTemp.length,
          _checked: false,
        }
        userSortListTemp.push(attr)
      }
      if (!userSortMap.accountId) {
        let attr = {
          id: 'accountId',
          name: '经办人',
          _position: userSortListTemp.length,
          _checked: false,
        }
        userSortListTemp.push(attr)
      }

      // 获取最近的收费任务
      data = yield call(feeMission.getMissionSimple)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        throw data.ret_content
      }
      const missionList = data.ret_content.data ? data.ret_content.data : []

      let orderList = null
      let count = 0
      let missionIdSelected = null
      if (missionList && missionList.length > 0) {
        missionIdSelected = missionList[0].id
        if (payload.missionId) {
          missionIdSelected = payload.missionId
        }
        const {
          beginDate, endDate, pageNum, pageSize,
        } = yield select(_ => _.order)

        data = yield call(order.getOrderList, {
          pageNum, pageSize, missionId: missionIdSelected, beginDate, endDate,
        })
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          throw data.ret_content
        }
        orderList = data.ret_content.data
        count = data.ret_content.count
        for (let order of orderList) {
          if (order.attrList) {
            for (let attr of order.attrList) {
              order[attr.attrId] = attr.relateName
            }
          }
        }
      }

      yield put({
        type: 'updateState',
        payload: {
          missionList,
          list: orderList,
          count,
          dataLoading: false,
          missionIdSelected,
          userAttrList,
          userAttrMap,
          userDisplayList,
          userDisplayListTemp,
          userDisplayMap,
          userSortList,
          userSortListTemp,
          userSortMap,
          structList,
          userAttrRelateMap,
          sortNameMap,
          payTypeNameMap,
        },
      })
    },

    * getOrderList ({ payload }, { put, call, select }) {
      const {
        sortList, missionId, beginDate, endDate,
      } = payload
      if (!missionId) {
        throw '请选择收费任务!'
      }
      if (!beginDate) {
        throw '请选择开始时间!'
      }
      if (!endDate) {
        throw '请选择结束时间!'
      }
      if (payload.receiptBeginNo && payload.receiptEndNo && payload.receiptEndNo < payload.receiptBeginNo) {
        throw '请输入正确的票据编号!'
      }
      let tempList = []
      const { userAttrRelateMap } = yield select(_ => _.order)
      if (sortList && sortList.length > 0) {
        for (let sort of sortList) {
          if (sort._idSelected && sort._idSelected.length > 0) {
            let tempSort = {}
            tempSort.attrId = userAttrRelateMap[`3_${sort.id}`].id
            tempSort.relateName = ''
            for (let select of sort._idSelected) {
              tempSort.relateName += `${select},`
            }
            tempList.push(tempSort)
          }
        }
      }
      if (tempList && tempList.length>0) {
        payload.sortList = JSON.stringify(tempList)
      }else{
        delete payload.sortList
      }
      // 获取经办人条件
      const { accountList } = yield select(_ => _.order)
      if (accountList) {
        let accountStr = ''
        for (let account of accountList) {
          if (payload.accountId.indexOf(`${account.loginName}(${account.name})`) >= 0) {
            accountStr += `${account.id},`
          }
        }
        if (accountStr) {
          payload.accountId = accountStr
        }
      }

      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      const data = yield call(order.getOrderList, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        throw data.ret_content
      }
      const orderList = data.ret_content.data
      for (let order of orderList) {
        if (order.attrList) {
          for (let attr of order.attrList) {
            order[attr.attrId] = attr.relateName
          }
        }
      }

      yield put({
        type: 'updateState',
        payload: {
          list: orderList,
          count: data.ret_content.count,
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          searchName: payload.key,
          dataLoading: false,
        },
      })
    },

    * resetDisplay ({ payload }, { put, call, select }) {
      let data = yield call(user.deleteDisplayAttr, { sence: 'orderDisplay' })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        throw data.ret_content
      }

      data = yield call(user.getDisplayAttr, { sence: 'orderDisplay' })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        throw data.ret_content
      }
      const userDisplayList = data.ret_content
      const userDisplayMap = {}
      const userDisplayListTemp = []
      let i = 0
      const { userAttrList, userAttrMap } = yield select(_ => _.order)
      for (let attr of userDisplayList) {
        attr._position = i++
        attr._checked = true
        attr.name = userAttrMap[attr.id].name
        userDisplayListTemp.push({ ...attr })
        userDisplayMap[attr.id] = attr
      }

      i = 0
      for (let attr of userAttrList) {
        if (!userDisplayMap[attr.id]) {
          let attrTemp = { ...attr }
          attrTemp._checked = false
          attrTemp._position = userDisplayListTemp.length
          userDisplayListTemp.push(attrTemp)
        }
      }
      Message.success('重置成功')
      yield put({
        type: 'updateState',
        payload: {
          userDisplayList,
          userDisplayListTemp,
          userDisplayMap,
        },
      })
    },

    * updateDisplay ({ payload }, { put, call }) {
      const { userDisplayListTemp } = payload
      const userDisplayList = []
      const userDisplayMap = []
      let tempStr = ''
      let i = 0
      for (let attr of userDisplayListTemp) {
        if (attr._checked) {
          let attrTemp = { ...attr }
          attrTemp._checked = true
          attrTemp._position = i++
          userDisplayList.push(attrTemp)
          userDisplayMap[attrTemp.id] = attrTemp
          tempStr += `${attrTemp.id},`
        }
      }

      let data = yield call(user.updateDisplayAttr, { sence: 'orderDisplay', attrList: tempStr })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        throw data.ret_content
      }
      Message.success('设置成功')
      yield put({
        type: 'updateState',
        payload: {
          displayVisible: false,
          userDisplayList,
          userDisplayMap,
        },
      })
    },

    * resetSort ({ payload }, { put, call, select }) {
      let data = yield call(user.deleteDisplayAttr, { sence: 'orderSort' })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        throw data.ret_content
      }

      data = yield call(user.getDisplayAttr, { sence: 'orderSort' })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        throw data.ret_content
      }
      const userSortList = data.ret_content
      const userSortMap = {}
      const userSortListTemp = []
      const { structList, userAttrRelateMap, sortNameMap } = yield select(_ => _.order)
      let i = 0
      for (let attr of userSortList) {
        attr._position = i++
        attr._checked = true
        if (sortNameMap[attr.id]) {
          attr.name = sortNameMap[attr.id].name
        }
        userSortListTemp.push({ ...attr })
        userSortMap[attr.id] = attr
      }

      // 添加层级过滤条件
      for (let struct of structList) {
        if (struct.status == '1' && !userSortMap[struct.id]) {
          let attr = {
            id: struct.id,
            name: struct.label,
            _position: userSortListTemp.length,
            _checked: false,
            attrId: userAttrRelateMap[`3_${struct.id}`].id,
          }
          userSortListTemp.push(attr)
        }
      }
      // 添加固定过滤条件
      if (!userSortMap.payType) {
        let attr = {
          id: 'payType',
          name: '支付方式',
          _position: userSortListTemp.length,
          _checked: false,
        }
        userSortListTemp.push(attr)
      }
      if (!userSortMap.reDate) {
        let attr = {
          id: 'reDate',
          name: '开票时段',
          _position: userSortListTemp.length,
          _checked: false,
        }
        userSortListTemp.push(attr)
      }
      if (!userSortMap.receiptNo) {
        let attr = {
          id: 'receiptNo',
          name: '票据号段',
          _position: userSortListTemp.length,
          _checked: false,
        }
        userSortListTemp.push(attr)
      }
      if (!userSortMap.accountId) {
        let attr = {
          id: 'accountId',
          name: '经办人',
          _position: userSortListTemp.length,
          _checked: false,
        }
        userSortListTemp.push(attr)
      }

      Message.success('重置成功')
      yield put({
        type: 'updateState',
        payload: {
          userSortList,
          userSortListTemp,
          userSortMap,
          payType: '',
          reBeginDate: null,
          reEndDate: null,
          receiptBeginNo: '',
          receiptEndNo: '',
          accountId: [],
        },
      })
    },

    * updateSort ({ payload }, { put, call }) {
      const { userSortListTemp } = payload
      const userSortList = []
      const userSortMap = []
      let tempStr = ''
      let i = 0
      for (let attr of userSortListTemp) {
        if (attr._checked) {
          let attrTemp = { ...attr }
          attrTemp._checked = true
          attrTemp._position = i++
          userSortList.push(attrTemp)
          userSortMap[attrTemp.id] = attrTemp
          tempStr += `${attrTemp.id},`
        }
      }
      let data = yield call(user.updateDisplayAttr, { sence: 'orderSort', attrList: tempStr })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        throw data.ret_content
      }
      Message.success('设置成功')
      yield put({
        type: 'updateState',
        payload: {
          sortVisible: false,
          userSortList,
          userSortMap,
          payType: '',
          reBeginDate: null,
          reEndDate: null,
          receiptBeginNo: '',
          receiptEndNo: '',
          accountId: [],
        },
      })
    },

    * getAttrRelateList ({ payload }, { put, call, select }) {
      let data = yield call(user.getAttrRelateList, { attrId: payload.attrId })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        throw data.ret_content
      }

      const { userSortList, userSortMap } = yield select(_ => _.order)
      if (!userSortMap[payload.id]) {
        throw '错误的删选条件！'
      }

      userSortMap[payload.id]._selectList = data.ret_content
      yield put({
        type: 'updateState',
        payload: {
          userSortMap,
        },
      })
    },

    * print ({ payload }, { put, call }) {
      const data = yield call(setService.getSetting, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        throw data.ret_content
      }

      const temData = yield call(getTemplateText, { templateId: data.ret_content.templateId })

      if (!temData.success) {
        throw temData
      } else if (temData.ret_code != 1) {
        throw temData.ret_content
      }

      yield put({
        type: 'updateState',
        payload: {
          textData: temData.ret_content,
          settingData: data.ret_content,
        },
      })
    },

    * getMgrAccountList ({ payload }, { put, call }) {
      const data = yield call(account.getMgrAccountList)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        throw data.ret_content
      }
      yield put({
        type: 'updateState',
        payload: {
          accountList: data.ret_content.data,
        },
      })
    },
  },
})
