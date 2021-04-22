import * as feeMission from 'services/feeMission'
import * as account from 'services/account'
import * as receipt from 'services/receipt'
import * as feeSubject from 'services/feeSubject'
import * as structService from 'services/struct'
import * as feeRule from 'services/feeRule'
import * as user from 'services/user'
import * as feeBill from 'services/feeBill'
import * as order from 'services/order'
import * as setService from 'services/printSet'
import * as manageService from 'services/account'
import { getTemplateText } from 'services/receipt'
import modelExtend from 'dva-model-extend'
import { model } from 'models/common'
import queryString from 'query-string'
import { Message } from 'antd'
import moment from 'moment'
import qs from 'qs'
import axios from 'axios'
import { getFormat, config, getSortParam } from 'utils'
import * as credit from 'services/credit'
import * as userService from 'services/user'

export default modelExtend(model, {
  namespace: 'feeMissionInfo',

  state: {
    missionId: null,
    missionInfo: {},
    missionEdiable: false,
    missionError: false,
    subjectMap: {},
    index: '1',

    accountList: null,
    receiptList: null,

    userAttrList: [],
    userAttrMap: {},

    paySubjectList:null,
    modalVisible:false,   // 控制添加项目保存后的转圈
    cgNum: 0,
    creditBatchList: null,


    ruleData: {
      pageNum: 1,
      pageSize: 20,
      list: null,
      count: 0,
      selectedRules: [],
      tempRuleFee: null,
      tempRuleVisiable: false,
      dataLoading: false,
      structList: [],
      structMap: {},
      structIdSelected: null,
      subjectList: [],
      subjectIdSelected: undefined,
      displayStructId: '',
      searchName: '',
      structItemPidSelected: {},
      attrList: null,
      attrMap: {},
      cgNum: 0,
      sortFlag: true
    },

    billData: {
      pageNum: 1,
      pageSize: 20,
      list: null,
      count: 0,
      data: null,
      dataLoading: false,

      searchName: '',
      selectedBills:[],

      modalVisible: false,
      modalData: {},
      modalType: '',
      modalPrsNum: '0',
      modalClosable: false,
      sortFlag: true,
      selectedAll: false,

      modalTableVisible: false,
      modalTableData: {},
      operateHistoryList: [],
      modalTableMask: '',
    },

    orderData: {
      sortNameMap: {},
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
      payType: undefined,
      reBeginDate: undefined,
      reEndDate: undefined,
      receiptBeginNo: undefined,
      receiptEndNo: undefined,
      status: null,
      printStatus: null,
      accountId: undefined,
      accountList: null,
      userAttrRelateMap: {},
      settingData: {},
      textData: {},
      templateHeight: 0,
      printCheck: 0,
      printAllVisible: false,
      sortFlag: true,
      exportFormat: 1,
    },

    refundData: {
      sortNameMap: {},
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
      payType: [],
      accountId: [],
      accountList: null,
      status: null,
      userAttrRelateMap: {},
      sortFlag: true,
      exportFormat: 1,
    },

    statData: {
      pageNum: 1,
      pageSize: 20,
      list: null,
      count: 0,
      data: null,
      dataLoading: false,
      spinning:false,

      searchName: '',
      type: 0,
      billStat: {
        allFee: '0',
        allCount: '0',
        discountFee: '0',
        discountCount: '0',
        paidFee: '0',
        paidCount: '0',
        owedFee: '0',
        owedCount: '0',
      },
      totalBegin: 0,
      sortFlag: true,
      dataTypeMap: {
        0:"展示全部", 
        4:"仅显示欠费",
        // 1:"仅显示有账单",
        2:"仅显示有缴费",
        5:"仅显示超额缴费",
        3:"仅显示缴费完成",
        6:"仅显示有退费",
        7:"仅显示有缓缴",
        8:"仅显示有减免", 
      },
      exceedFeeVisible: false,
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/feeMissionInfo') {
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
      const { missionId } = yield select(_ => _.feeMissionInfo)
      if (payload.missionId == missionId) {
        return
      }
      yield put({
        type: 'app/initDisplay', 
        payload: {params:
            [{sence:"userBillSort", displayExtra:{}, defaultType: '1'},{sence:"userBillDisplay", displayExtra:{}},
            {sence:"orderSort",  displayExtra: {
              payType: '支付方式',
              reDate: '开票时段',
              receiptNo: '票据号段',
              accountId: '经办人',
              status: '状态',
              printStatus: '打印状态',
              orderNo: '订单号'
            }, defaultType: '1'},{sence:"orderDisplay", displayExtra:{}},
            {sence:"returnSort",  displayExtra: {
              payType: '退费方式',
              accountId: '经办人',
              status: '状态',
              orderNo: '订单号',
            }, defaultType: '1'},{sence:"returnDisplay", displayExtra:{}},
            {sence:"statisticsSort", displayExtra:{}, defaultType: '1'},{sence:"statisticsDisplay", displayExtra:{}},
            {sence:"statDataDisplay", senceKey:payload.missionId, displayExtra:{}, userAttrList:config.statDataList}
            ]
          }
      })
      //获取所有支付方式
      yield put({
        type: 'app/getRequestPayType', 
        payload: {}
      })

      let missionData = yield call(feeMission.getMissionById, { id: payload.missionId })
      if (!missionData.success) {
        yield put({
          type: 'updateState',
          payload: {
            missionError: true,
          },
        })
        throw missionData
      } else if (missionData.ret_code != 1) {
        yield put({
          type: 'updateState',
          payload: {
            missionError: true,
          },
        })
        return Message.error(missionData.ret_content)
      }
      let subjectMap = {}
      let subjectName = ""
      // let mergeCheckVisible = false
      for (let subject of missionData.ret_content.subjectList) {
        subject._isRequired = subject.isRequired
        subject._isDefault = parseInt(subject.isDefault)
        subject._allowModify = subject.allowModify
        subject._allowDeferred = subject.allowDeferred
        subject._modifyMin = subject.modifyMin?getFormat(subject.modifyMin):undefined
        subject._modifyStep = subject.modifyStep?getFormat(subject.modifyStep):undefined
        subject._userShowName = subject.userShowName?subject.userShowName:undefined
        subject._remark = subject.remark?subject.remark:undefined
        subject._userShowStatus = subject.userShowStatus
        subjectName += subject.name
        if(subject.isRequired != '1'){
          subjectName+="(选缴)"
        }
        subjectName+=';'
        subjectMap[subject.id] = subject
      }
      if(missionData.ret_content.gradeList){// 年级
        let gradeValue = ""
        let gradeId = []
        let i = 0
        for (let grade of missionData.ret_content.gradeList) {
          if(i != 0){
            gradeValue+=';'
          }
          gradeValue += grade.value
          gradeId.push(grade.id)
          i++
        }
        missionData.ret_content.gradeValue = gradeValue
        missionData.ret_content.gradeId = gradeId
      }
      // missionData.ret_content.mergeCheckVisible = mergeCheckVisible
      missionData.ret_content.subjectName = subjectName
      //获取所有项目的缓缴标准
      let data = yield call(feeRule.getDeferredStandList, {status:"1"})
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let standList = data.ret_content?data.ret_content:[]
      for (let node of standList) {
        if(!subjectMap[node.subjectId]){
          continue
        }
        if(!subjectMap[node.subjectId]._defStandMap){
          subjectMap[node.subjectId]._defStandMap = {}
        }
        subjectMap[node.subjectId]._defStandMap[node.id] = node
      }
      //获取所有减免标准
      data = yield call(feeRule.getDiscountStandList, {status:"1"})
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      standList = data.ret_content?data.ret_content:[]
      for (let node of standList) {
        if(!subjectMap[node.subjectId]){
          continue
        }
        if(!subjectMap[node.subjectId]._disStandMap){
          subjectMap[node.subjectId]._disStandMap = {}
        }
        subjectMap[node.subjectId]._disStandMap[node.id] = node
      }

      //获取所有年级
      yield put({
        type: 'app/getRequestGrade', 
        payload: {}
      })

      let ruleData = {
        pageNum: 1,
        pageSize: 20,
        list: null,
        count: 0,
        selectedRules: [],
        tempRuleFee: null,
        tempRuleVisiable: false,
        dataLoading: false,
        structList: [],
        structMap: {},
        structIdSelected: null,
        subjectList: [],
        subjectIdSelected: undefined,
        displayStructId: '',
        searchName: '',
        structItemPidSelected: {},
        attrList: null,
        attrMap: {},
        cgNum: 0,
      }

      let billData = {
        pageNum: 1,
        pageSize: 20,
        list: null,
        count: 0,
        data: null,
        dataLoading: false,

        searchName: '',
        displaySence: 'userBillDisplay',
        sortSence: 'userBillSort',
        selectedBills:[],
        selectedAll: false,

        modalVisible: false,
        modalData: {},
        modalType: '',
        modalPrsNum: '0',
        modalClosable: false,
        modalImportData: {},

        modalTableVisible: false,
        modalTableData: {},
        operateHistoryList: [],
        modalTableMask: '',
      }

      let orderData = {
        sortNameMap: {},
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
        payType: undefined,
        reBeginDate: undefined,
        reEndDate: undefined,
        receiptBeginNo: undefined,
        receiptEndNo: undefined,
        accountId: undefined,
        accountList: null,
        userAttrRelateMap: {},
        displaySence: 'orderDisplay',
        sortSence: 'orderSort',
        userSortExtra: {
          payType: '支付方式',
          reDate: '开票时段',
          receiptNo: '票据号段',
          accountId: '经办人',
          status: '状态',
          printStatus: '打印状态',
          orderNo: '订单号'
        },
        settingData: {},
        textData: {},
        templateHeight: 0,
        printCheck: 0,
        printAllVisible:false,
        modalImportData: {},
        printData:{},
        exportFormat: 1,
      }

      let refundData = {
        sortNameMap: {},
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
        payType: [],
        accountId: [],
        accountList: null,
        userAttrRelateMap: {},
        displaySence: 'returnDisplay',
        sortSence: 'returnSort',
        userSortExtra: {
          payType: '退费方式',
          accountId: '经办人',
          status: '状态',
          orderNo: '订单号',
        },
        modalImportData: {},
        exportFormat: 1,
      }

      let statData = {
        pageNum: 1,
        pageSize: 20,
        list: null,
        count: 0,
        data: null,
        dataLoading: false,

        searchName: '',
        type: 0,
        // sortVisible: false,
        // displayVisible: false,
        // userDisplayList: [],
        // userDisplayListTemp: [],
        // userDisplayMap: {},
        // userSortList: [],
        // userSortListTemp: [],
        // userSortMap: {},
        displaySence: 'statisticsDisplay',
        sortSence: 'statisticsSort',
        statSence: 'statDataDisplay',
        billStat: {
          allFee: '0',
          allCount: '0',
          discountFee: '0',
          discountCount: '0',
          paidFee: '0',
          paidCount: '0',
          owedFee: '0',
          owedCount: '0',
        },
        totalBegin: 0,
        statList:[
          {name:'应收总额',sum:'totalFeeSum',count:'totalFeeCount'},
          {name:'收费总额',sum:'paidFeeSum',count:'paidFeeCount'},
          {name:'欠费总额',sum:'arrearsSum',count:'arrearsCount'},
          {name:'减免总额',sum:'discountSum',count:'discountCount'},
          {name:'退费总额',sum:'refundSum',count:'refundCount'},
          {name:'超收总额',sum:'exceedFeeSum',count:'exceedFeeCount'},
          {name:'结转总额',sum:'convertFeeSum',count:'convertFeeCount'}
        ],
        dataTypeMap: {
          0:"展示全部", 
          4:"仅显示欠费",
          // 1:"仅显示有账单",
          2:"仅显示有缴费", 
          5:"仅显示超额缴费",
          3:"仅显示缴费完成",
          6:"仅显示有退费",
          7:"仅显示有缓缴",
          8:"仅显示有减免", 
        },
        exceedFeeVisible: false,
      }

      yield put({
        type: 'updateState',
        payload: {
          missionInfo: missionData.ret_content,
          missionId: payload.missionId,
          subjectMap,
          subjectList: missionData.ret_content.subjectList,
          ruleData,
          billData,
          statData,
          orderData,
          refundData,
          missionError: false,
          missionEdiable: false,
          userAttrList: [],
          userAttrMap: {},
        },
      })

      yield put({
        type: 'changeTabs',
        payload: {
          index: '1',
        },
      })
    },

    * changeTabs ({ payload }, { put, call, select }) {
      const { ruleData, orderData, refundData, statData, billData } = yield select(_ => _.feeMissionInfo)
      if (payload.index == 1) {
        if (!ruleData.structList || ruleData.structList.length <= 0) {
          let data = yield call(structService.getStructList)
          if (!data.success) {
            throw data
          } else if (data.ret_code != 1) {
            return Message.error(data.ret_content)
          } else if (!data.ret_content) {
            return Message.error('请先设置学校结构')
          }
          const structMap = {}
          const structList = []
          let i = 0
          for (let struct of data.ret_content) {
            if (struct.status == '1') {
              structList.push(struct)
              struct._position = i++
              structMap[struct.id] = struct
              // if(struct.label == "班级"){
              //   ruleData.structIdSelected = struct.id;
              // }
            }
          }

          ruleData.structList = structList
          ruleData.structMap = structMap
          yield put({
            type: 'updateState',
            payload: {
              ruleData,
            },
          })
        }
      } else if (payload.index == 2) {
        let { missionId } = yield select(_ => _.feeMissionInfo)
        if (!billData.list || billData.list.length == 0) {
          yield put({
            type: 'getBillList',
            payload: {
              missionId,
              pageNum: billData.pageNum,
              pageSize: billData.pageSize,
              key: '',
            },
          })
        }
      } else if (payload.index == 3) {
        let { missionId, userAttrList, userAttrMap } = yield select(_ => _.feeMissionInfo)
        if(!orderData.list || orderData.list.length==0){
          // 获取数据
          let data = yield call(order.getOrderList, {
            pageNum: orderData.pageNum, pageSize: orderData.pageSize, missionId, beginDate: orderData.beginDate, endDate: orderData.endDate,
          })
          if (!data.success) {
            throw data
          } else if (data.ret_code != 1) {
            return Message.error(data.ret_content)
          }
          let orderList = data.ret_content.data
          let count = parseInt(data.ret_content.count)
          let pos = 0
          for (let order of orderList) {
            order._position = pos++
            if (order.attrList) {
              for (let attr of order.attrList) {
                order[attr.attrId] = attr.relateName
              }
            }
            if(order.feeBillLists){
              for(let subject of order.feeBillLists){
                subject._order = order;
                if(subject.receiptNo){
                  subject._checked = false;
                }else{
                  subject._checked = true;
                }
              }
            }
          }
          const feeSum = yield call(order.getOrderFeeSum,{
            pageNum: orderData.pageNum, pageSize: orderData.pageSize, missionId, beginDate: orderData.beginDate, endDate: orderData.endDate,
          })
          if (!data.success) {
            throw data
          } else if (data.ret_code != 1) {
            return Message.error(data.ret_content)
          }
          orderData.orderFeeSum = feeSum.ret_content
          orderData.list = orderList
          orderData.count = count
          orderData.dataLoading = false
          orderData.printData = {}
          orderData.selectedOrders = []
          orderData.sortFlag = false
          yield put({
            type: 'updateState',
            payload: {
              orderData,
              index: payload.index,
            },
          })
        }
      }else if (payload.index == 4) {
        let { missionId } = yield select(_ => _.feeMissionInfo)
        if(!refundData.list || refundData.list.length == 0){
          // 获取数据
          let data = yield call(order.getOrderReturnList, {
            pageNum: refundData.pageNum, pageSize: refundData.pageSize, missionId, beginDate: refundData.beginDate, endDate: refundData.endDate,
          })
          if (!data.success) {
            throw data
          } else if (data.ret_code != 1) {
            return Message.error(data.ret_content)
          }
          let orderList = data.ret_content.data
          let count = parseInt(data.ret_content.count)
          for (let order of orderList) {
            if (order.attrList) {
              for (let attr of order.attrList) {
                order[attr.attrId] = attr.relateName
              }
            }
          }
          const feeSum = yield call(order.getOrderReturnFeeSum,{
            pageNum: refundData.pageNum, pageSize: refundData.pageSize, missionId, beginDate: refundData.beginDate, endDate: refundData.endDate,
          })
          if (!data.success) {
            throw data
          } else if (data.ret_code != 1) {
            return Message.error(data.ret_content)
          }
          refundData.returnFeeSum = feeSum.ret_content
          refundData.list = orderList
          refundData.count = count
          refundData.dataLoading = false
          refundData.sortFlag = false
          yield put({
            type: 'updateState',
            payload: {
              refundData,
              index: payload.index,
            },
          })
        }
      }else if (payload.index == 5) {
        let { missionId } = yield select(_ => _.feeMissionInfo)
        if(!statData.list || statData.list.length == 0){
          yield put({
            type: 'getStatBillList',
            payload: {
              missionId,
              pageNum: statData.pageNum,
              pageSize: statData.pageSize,
              key: '',
              type: 0,
            },
          })
        }
      }

      yield put({
        type: 'updateState',
        payload: {
          billData,
          orderData,
          refundData,
          statData,
          index: payload.index,
        },
      })
    },

    * getDepartTree ({ payload }, { put, call }) {
      //获取所有部门树
      yield put({
        type: 'app/getRequestDepart', 
        payload: {}
      })
    },

    * getAccountList ({ payload }, { put, call }) {
      //获取所有操作人
      yield put({
        type: 'app/getRequestAccount', 
        payload: {}
      })
    },

    * getReceiptList ({ payload }, { put, call }) {
      let data = yield call(receipt.getTemplateList)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      yield put({
        type: 'updateState',
        payload: {
          receiptList: data.ret_content,
        },
      })
    },

    * getUserAttrList ({ payload }, { put, call, select }) {
      let data = yield call(user.getUserAttr)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let userAttrList = data.ret_content
      let userAttrMap = {}
      let i = 0
      for (let attr of userAttrList) {
        attr._position = i++
        userAttrMap[attr.id] = attr
      }
      yield put({
        type: 'updateState',
        payload: {
          userAttrList,
          userAttrMap
        },
      })
    },

    * updateMission ({ payload }, { put, call, select }) {
      let hasCredit = payload.hasCredit
      delete payload.hasCredit
      let timer = payload.timer
      delete payload.timer
      let data = yield call(feeMission.updateMission, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        if(hasCredit){
          clearInterval(timer)
        }
        yield put({
          type: 'updateState',
          payload: {
            modalVisible: false, 
          },
        })
        return Message.error(data.ret_content)
      }
     
      if(hasCredit){
        yield put({
          type: 'updateState',
          payload: {
            timer
          },
        })
      }else{
        Message.success('修改成功！')
        //获取所有任务列表
        yield put({
          type: 'app/getRequestMission', 
          payload: {
            needUpdate: true
          }
        })
        //获取所有学年列表
        yield put({
          type: 'app/getRequestYear', 
          payload: {
            needUpdate: true
          }
        })
        yield put({
          type: 'getMissionById',
          payload: {
            ...payload,
          },
        })
      }
      
    },

    * getRuleList ({ payload }, { put, call, select }) {
      const { labelId, missionId, subjectId } = payload
      if (!missionId) {
        throw '请选择收费任务!'
      }
      const { ruleData } = yield select(_ => _.feeMissionInfo)
      let attrArr = []
      for (let attr of ruleData.attrList) {
        if (attr._idSelected && attr._idSelected.length > 0) {
          attrArr.push({ attrId: attr.attrId, valueName: attr._idSelected.toString() })
        }
      }
      if(attrArr && attrArr.length>0){
        payload.attrValueId = JSON.stringify(attrArr)
      }
      if(payload.subjectId){
        payload.subjectId = payload.subjectId.toString()
      }

      ruleData.dataLoading = true
      ruleData.sortFlag = false
      ruleData.selectedRules = []
      yield put({
        type: 'updateState',
        payload: {
          ruleData,
        },
      })

      const data = yield call(feeRule.getRuleList, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      let ruleList = data.ret_content.data
      let i = 0
      for(let node of ruleList){
        node._feeEditVisible = false
        node._index = i++
        node[node.structId] = node.name
        if(node.structItemEntities){
          for (let struct of node.structItemEntities) {
            node[struct.structId] = struct.name
          }
        }
        if (node.structItemAttrRelateEntities) {
          for (let attrValue of node.structItemAttrRelateEntities) {
            node[`attrId_${attrValue.attrId}`] = attrValue.relateName
          }
        }
        let arr = []
        if(node.feeRuleStandRelateList){
          for(let relate of node.feeRuleStandRelateList){
            arr.push({
              relateId: relate.relateId,
              relateName: relate.relateName,
              fee: relate.fee?getFormat(relate.fee):undefined,
              editable: node.editable
            })
          }
        }
        arr.unshift({
          relateId:'0',
          relateName: "-",
          fee: node.fee?getFormat(node.fee):undefined,
          editable: node.editable
        })
        node.feeList = arr
      }
      ruleData.list = ruleList
      ruleData.count = parseInt(data.ret_content.count),
      ruleData.pageNum = payload.pageNum,
      ruleData.pageSize = payload.pageSize,
      ruleData.displayStructId = payload.structId,
      ruleData.searchName = payload.name,
      ruleData.dataLoading = false,
      yield put({
        type: 'updateState',
        payload: {
          ruleData,
        },
      })
    },
    * getAllItemList ({ payload }, { put, call, select }) {
      const { ruleData } = yield select(_ => _.feeMissionInfo)
      let { itemPid, structId } = payload
      const struct = ruleData.structMap[structId]
      let structPid = {}
      let pid = ''
      if (itemPid && itemPid.id) {
        structPid = ruleData.structMap[itemPid.id]
        if (!structPid) {
          throw '无效的层级id'
        }
        if (struct._position <= structPid._position) {
          // 获取已选取的pid
          for (var i = struct._position - 1; i >= 0; i--) {
            if (ruleData.structList[i]._idSelected) {
              itemPid = ruleData.structList[i]
              break
            }
          }
          if (i < 0) {
            itemPid = {}
          }
        }
        pid = itemPid._idSelected
      }

      if (!struct._selectList || struct._selectList.length <= 0) {
        const data = yield call(structService.getAllItemList, { pid, structId })
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }

        struct._selectList = data.ret_content
      }

      yield put({
        type: 'updateState',
        payload: {
          ruleData,
        },
      })
    },
    * changeStruct ({ payload }, { put, call, select }) {
      const { ruleData,missionId } = yield select(_ => _.feeMissionInfo)

      let data = yield call(structService.getStructAttr, { structId: payload.structId })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      let attrList = data.ret_content
      let attrMap = {}
      for (let attr of attrList) {
        attrMap[attr.attrId] = attr
      }
      ruleData.attrList = attrList
      ruleData.attrMap = attrMap
      ruleData.structIdSelected = payload.structId
      // 清理数据
      for (let node of ruleData.attrList) {
        delete node._idSelected
        delete node._selectList
      }

      for (let node of ruleData.structList) {
        delete node._idSelected
        delete node._selectList
      }
      ruleData.structItemPidSelected = {}
      ruleData.searchName = ''
       ruleData.list = []
       ruleData.count = 0
       ruleData.pageNum = 1
       ruleData.pageSize = 20
       ruleData.sortFlag = true
      yield put({
        type: 'updateState',
        payload: {
          ruleData,
        },
      })
      if(payload.structId == '0'){
        //获取统一
        yield put({
          type: 'getRuleList',
          payload: {
            missionId,
            subjectId: ruleData.subjectIdSelected,
            structId: "0",
            pageNum: ruleData.pageNum,
            pageSize: ruleData.pageSize,
            name: ruleData.searchName,
          },
        })
      }
    },
    * changeSubject ({ payload }, { put, call, select }) {
      let data = yield call(feeRule.getFeeRuleAttr, {subjectId:payload.subjectId, missionId:payload.missionId})
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let { subjectMap, ruleData, missionId } = yield select(_ => _.feeMissionInfo)
      subjectMap[payload.subjectId].attrId = data.ret_content.attrId?data.ret_content.attrId:null
      subjectMap[payload.subjectId].structId = data.ret_content.structId?data.ret_content.structId:null
      subjectMap[payload.subjectId].attrName = data.ret_content.attrName
      if(subjectMap[payload.subjectId].structId != ruleData.structIdSelected){
        ruleData.attrList = []
        ruleData.attrMap = {}
        ruleData.structIdSelected = data.ret_content.structId?data.ret_content.structId:null
        if(ruleData.structIdSelected && ruleData.structIdSelected!='0'){
          data = yield call(structService.getStructAttr, { structId:ruleData.structIdSelected })
          if (!data.success) {
            throw data
          } else if (data.ret_code != 1) {
            return Message.error(data.ret_content)
          }
    
          ruleData.attrList = data.ret_content
          for (let attr of ruleData.attrList) {
            ruleData.attrMap[attr.attrId] = attr
          }
          ruleData.structItemPidSelected = {}
        }
      }
      ruleData.sortFlag = true
      yield put({
        type: 'updateState',
        payload: {
          subjectMap,
          ruleData
        },
      })

      if(ruleData.structIdSelected){
        payload.structId = ruleData.structIdSelected
        yield put({
          type: 'getRuleList',
          payload: {
            missionId,
            subjectId: ruleData.subjectIdSelected,
            structId: ruleData.structIdSelected,
            pageNum: ruleData.pageNum,
            pageSize: ruleData.pageSize,
            name: ruleData.searchName,
          },
        })
      }else{
        ruleData.pageNum = 1
        ruleData.count = 0
        ruleData.list = []
        yield put({
          type: 'updateState',
          payload: {
            ruleData
          },
        })
      }
    },
    * changeStructItemSort ({ payload }, { put, call, select }) {
      const { ruleData } = yield select(_ => _.feeMissionInfo)
      let { id, structId } = payload
      if (id) {
        ruleData.structMap[structId]._idSelected = id
        ruleData.structItemPidSelected = ruleData.structMap[structId]
      } else {
        ruleData.structMap[structId]._idSelected = undefined
        ruleData.structItemPidSelected = null
        // 获取上级pid
        for (let i = ruleData.structMap[structId]._position - 1; i >= 0; i--) {
          if (ruleData.structList[i].status == '1' && ruleData.structList[i]._idSelected) {
            ruleData.structItemPidSelected = ruleData.structList[i]
            break
          }
        }
      }

      // 重置下级层级
      for (let i = ruleData.structMap[structId]._position + 1; i < ruleData.structList.length; i++) {
        delete ruleData.structList[i]._idSelected
        delete ruleData.structList[i]._selectList
      }
      ruleData.sortFlag = true
      yield put({
        type: 'updateState',
        payload: {
          ruleData,
        },
      })
    },
    * updateFeeRuleAttr ({ payload }, { put, call, select }) {
      const { ruleData,subjectMap,missionId } = yield select(_ => _.feeMissionInfo)
      if(ruleData.dataLoading){
        return Message.error("请不要重复点击")
      }
      ruleData.dataLoading = true
      yield put({
        type: 'updateState',
        payload: {
          ruleData
        },
      })
      let attrName = payload.attrName
      delete payload.attrName
      let data = yield call(feeRule.updateFeeRuleAttr, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      Message.success('设置成功')
      subjectMap[payload.subjectId].attrId = payload.attrId
      subjectMap[payload.subjectId].attrName = attrName
      ruleData.modalVisible = false
      ruleData.dataLoading = false
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: false,
          dataLoading: ruleData.structIdSelected?true:false,
          subjectMap
        },
      })

      if(ruleData.structIdSelected){
        const params = {
          subjectId: ruleData.subjectIdSelected,
          structId: ruleData.structIdSelected,
          pid: ruleData.structItemPidSelected ? ruleData.structItemPidSelected._idSelected : '',
          pageNum: ruleData.pageNum,
          pageSize: ruleData.pageSize,
          name: ruleData.searchName,
          missionId
        }
  
        yield put({
          type: 'getDataList',
          payload: {
            ...params,
          },
        })
      }
    },
    * getAttrValueList ({ payload }, { put, call, select }) {
      const { ruleData } = yield select(_ => _.feeMissionInfo)
      let data = yield call(user.getUserAttrValue, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      ruleData.modalData._attrValueList = data.ret_content
      yield put({
        type: 'updateState',
        payload: {
          ruleData,
        },
      })
    },
    * updateFeeRule ({ payload }, { put, call, select }) {
      const { missionId, ruleData } = yield select(_ => _.feeMissionInfo)
      let timer = payload.timer
      delete payload.timer
      let data = yield call(feeRule.updateRule, {ruleList:payload.param})
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        clearInterval(timer)
        ruleData.dataLoading = false
        ruleData.modalVisible = false
        yield put({
          type: 'updateState',
          payload: {
            ruleData
          },
        })
        return Message.error(data.ret_content)
      }
      //Message.success('设置成功')
      ruleData.dataLoading = true,
      ruleData.timer = timer
      yield put({
        type: 'updateState',
        payload: {
          ruleData,
        },
      })
    },

    * getAttrRelateList ({ payload }, { put, call, select }) {
      const { billData } = yield select(_ => _.feeMissionInfo)
      if (!billData.userSortMap[payload.attrId]) {
        throw '错误的筛选条件！'
      }
      billData.userSortMap[payload.attrId]._selectList = undefined;
      yield put({
        type: 'updateState',
        payload: {
          billData,
        },
      })
      payload.pageNum = 1;
      payload.pageSize = 50;
      let data = yield call(user.getAttrRelatePage, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      billData.userSortMap[payload.attrId]._selectList = data.ret_content.data
      yield put({
        type: 'updateState',
        payload: {
          billData,
        },
      })
    },
    * createBills ({ payload }, { put, call, select }) {
      const data = yield call(feeMission.createBills, payload)
      const { billData } = yield select(_ => _.feeMissionInfo)

      if (data.ret_code != '1') {
        clearInterval(billData.timer)
        Message.error(data.ret_content)
        billData.modalClosable = true
        yield put({
          type: 'updateState',
          payload: {
            billData,
          },
        })
      }
    },

    * getCreateBillsPrs ({ payload }, { put, call, select }) {
      const prs = yield call(feeMission.getCreateBillsPrs, payload)
      const { ruleData,missionId } = yield select(_ => _.feeMissionInfo)
      if (prs.ret_code == '1') {
        if (prs.ret_content.cgNum == '100') {
          clearInterval(ruleData.timer)
          ruleData.cgNum = parseInt(prs.ret_content.cgNum)
          ruleData.dataLoading = true
          yield put({
            type: 'updateState',
            payload: {
             ruleData
            },
          })
          Message.success('修改成功！')
          yield put({
            type: 'getRuleList',
            payload: {
              missionId,
              subjectId: ruleData.subjectIdSelected,
              structId: ruleData.structIdSelected,
              pageNum: ruleData.pageNum,
              pageSize: ruleData.pageSize,
              name: ruleData.searchName,
              pid: ruleData.structItemPidSelected._idSelected,
            },
          })
        } else {
          ruleData.cgNum = parseInt(prs.ret_content.cgNum)
          yield put({
            type: 'updateState',
            payload: {
              ruleData
            },
          })
        }
      } else {
        throw prs
      }
    },
    * getBillList ({ payload }, { put, call, select }) {
      const { billData } = yield select(_ => _.feeMissionInfo)
      billData.dataLoading = true
      yield put({
        type: 'updateState',
        payload: {
          billData,
        },
      })
      const { sortList, missionId } = payload
      if (!missionId) {
        throw '请选择收费任务!'
      }
      let tempList = getSortParam(sortList)
      if (tempList && tempList.length>0) {
        payload.sortList = JSON.stringify(tempList)
      }else{
        delete payload.sortList
      }
      if(payload.subjectId){
        payload.subjectId = payload.subjectId.toString()
      }
      billData.dataLoading = true
      billData.selectedAll = false
      yield put({
        type: 'updateState',
        payload: {
          billData,
        },
      })

      const data = yield call(feeBill.getBills, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const billList = data.ret_content.data
      for (let bill of billList) {
        if (bill.attrList) {
          for (let attr of bill.attrList) {
            bill[attr.attrId] = attr.relateName
          }
        }
      }

      billData.list = billList
      billData.count = parseInt(data.ret_content.count)
      billData.pageNum = payload.pageNum
      billData.pageSize = payload.pageSize
      billData.searchName = payload.key
      billData.dataLoading = false
      billData.selectedBills = []
      billData.sortFlag = false
      yield put({
        type: 'updateState',
        payload: {
          billData,
        },
      })
    },

    * updateBills ({ payload }, { put, call, select }) {
      let { billData, missionId } = yield select(_ => _.feeMissionInfo)
      if(billData.dataLoading){
        return Message.error("请不要重复点击")
      }
      billData.dataLoading = true
      yield put({
        type: 'updateState',
        payload: {
          billData
        },
      })
      if(payload.userId){
        payload.userId = payload.userId.toString()
      }
      if(payload.params){
        let tempList = getSortParam(payload.params.sortList)
        if (tempList && tempList.length>0) {
          payload.params.sortList = JSON.stringify(tempList)
        }else{
          delete payload.params.sortList
        }
        payload.params = JSON.stringify(payload.params)
      }
      payload.billList = JSON.stringify(payload.billList)
      
      let data = yield call(feeBill.updateBatchBill, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        billData.dataLoading = false
        yield put({
          type: 'updateState',
          payload: {
            billData,
          },
        })
        return Message.error(data.ret_content)
      }
      billData.modalVisible = false
      yield put({
        type: 'updateState',
        payload: {
          billData
        },
      })
      //重新获取订单数据
      yield put({
        type: 'getBillList',
        payload: {
          missionId: missionId,
          pageNum: billData.pageNum,
          pageSize: billData.pageSize,
          key: billData.searchName,
          sortList: billData.userSortList,
          subjectId: billData.subjectId,
        },
      })
    },

    * updateBillsBatch ({ payload }, { put, call, select }) {
      const { subjectList, missionId } = payload
      let param = {
        missionId,
      }
      const { billData } = yield select(_ => _.feeMissionInfo)
      if(billData.dataLoading){
        return Message.error("请不要重复点击")
      }
      billData.dataLoading = true
      yield put({
        type: 'updateState',
        payload: {
          billData,
        },
      })
      let i=0
      for(let node of billData.list){
        if(!billData.selectedBills.includes(i++)){
          continue;
        }

        for (let subject of subjectList) {
          if (subject._discount != subject.discount || subject._disReason != subject.disReason || subject._disReason != subject.disReason
            || subject._totalFee != subject.totalFee  || subject._loans != subject.loans || subject._status != subject.status) {
            if(!subject._add || subject._status=="1"){
              param.userId = node.userId;
              param.subjectId = subject.subjectId;
              param.discount = subject._discount ? subject._discount.toString() : '0'
              param.disReason = subject._disReason
              param.totalFee = subject._totalFee ? subject._totalFee.toString() : '0'
              param.loans = subject._loans ? subject._loans.toString() : '0'
              param.status = subject._status ? subject._status.toString() : '0'
              if(!subject._add){
                const billNodeSrc = node.feeBillListEntities.filter(_ => _.subjectName === subject.subjectName)[0]
                if(billNodeSrc){
                  param.id = billNodeSrc.id;
                }
              }
             
              let data = yield call(feeBill.updateBill, param)
              if (!data.success) {
                throw data
              } else if (data.ret_code != 1) {
                billData.dataLoading = false
                yield put({
                  type: 'updateState',
                  payload: {
                    billData,
                  },
                })
                return Message.error(data.ret_content)
              }
            }
          }
        }

      }

      Message.success('设置成功！')
      billData.modalVisible = false
      billData.modalData.feeBillListEntities = subjectList
      billData.dataLoading = false
      yield put({
        type: 'updateState',
        payload: {
          billData,
        },
      })

      yield put({
        type: 'getBillList',
        payload: {
          missionId: missionId,
          pageNum: billData.pageNum,
          pageSize: billData.pageSize,
          key: billData.searchName,
          sortList: billData.userSortList,
          shbjectId: billData.subjectId,
        },
      })
    },

    * importBill ({ payload }, { put, call, select }) {
      const { billData } = yield select(_ => _.feeMissionInfo)
      billData.modalImportData.step = 1;
      billData.modalImportData.cgNum = '0';
      billData.modalImportData.wxNum = '0';
      billData.modalImportData.cfNum = '0';
      billData.modalImportData.cgCoverNum = '0';
      billData.modalImportData.importing = true;
      billData.modalImportData.covering = false;
      billData.timer = payload.timer
      yield put({
        type: 'updateState',
        payload: {
          billData
        },
      })
      const {importType} = payload
      let data
      delete payload.importType
      delete payload.timer
      if(importType == 2){
        data = yield call(feeBill.importBillBySubject, payload)
      }else{
        data = yield call(feeBill.importBill, payload)
      }
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        clearInterval(billData.timer)
        billData.modalImportData.step = 2;
        billData.modalImportData.message = data.ret_content;
        yield put({
          type: 'updateState',
          payload: {
            billData,
          },
        })
        return
      }
      billData.modalImportData.step = 1;
      yield put({
        type: 'updateState',
        payload: {
          billData,
        },
      })
    },

    * getImportBillPrs ({ payload }, { put, call, select }) {
      const data = yield call(feeBill.getImportBillPrs)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let { billData } = yield select(_ => _.feeMissionInfo)
      if (! billData.modalImportData.covering) {
        billData.modalImportData.cgNum = data.ret_content.cgNum
      } else {
        billData.modalImportData.cgCoverNum = data.ret_content.cgNum
      }
      billData.modalImportData.cfNum = data.ret_content.cfNum
      billData.modalImportData.wxNum = data.ret_content.wxNum
      if (data.ret_content.status == '2') {
        clearInterval(billData.timer)
        billData.modalImportData.importing = false;
        yield put({
          type: 'updateState',
          payload: {
            billData
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

    * coverBill ({ payload }, { put, call, select }) {
      let { billData } = yield select(_ => _.feeMissionInfo)
      billData.timer = payload.timer
      let data = yield call(feeBill.coverBill)
      if (!data.success) {
        clearInterval(billData.timer)
        throw data
      } else if (data.ret_code != 1) {
        clearInterval(billData.timer)
        return Message.error(data.ret_content)
      }
      billData.modalImportData.importing = true;
      billData.modalImportData.covering = true;
      yield put({
        type: 'updateState',
        payload: {
          billData
        },
      })
    },

    * getOrderList ({ payload }, { put, call, select }) {
      const {
        sortList, missionId, beginDate, endDate,
      } = payload
      if (!beginDate) {
        throw '请选择开始时间!'
      }
      if (!endDate) {
        throw '请选择结束时间!'
      }
      if (payload.receiptBeginNo && payload.receiptEndNo && payload.receiptEndNo < payload.receiptBeginNo) {
        throw '请输入正确的票据编号!'
      }
      const { orderData, subjectMap } = yield select(_ => _.feeMissionInfo)
      let tempList = getSortParam(sortList)
      if (tempList && tempList.length>0) {
        payload.sortList = JSON.stringify(tempList)
      }else{
        delete payload.sortList
      }
      if(orderData.sortSubjectSelected){
        payload.subjectId =  orderData.sortSubjectSelected.toString();
      }
      if(payload.accountId){
        payload.accountId =  payload.accountId.toString();
      }
      if(payload.payType){
        payload.payType =  payload.payType.toString();
      }
      orderData.dataLoading = true
      yield put({
        type: 'updateState',
        payload: {
          orderData,
        },
      })
      const data = yield call(order.getOrderList, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const orderList = data.ret_content.data
      let i=0
      for (let order of orderList) {
        order._position = i++
        if (order.attrList) {
          for (let attr of order.attrList) {
            order[attr.attrId] = attr.relateName
          }
        }
        if(order.feeBillLists){
          for(let subject of order.feeBillLists){
            subject._order = order;
            if(subject.receiptNo){
              subject._checked = false;
            }else{
              subject._checked = true;
            }
          }
        }
      }
      const feeSum = yield call(order.getOrderFeeSum,payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      orderData.orderFeeSum = feeSum.ret_content
      orderData.list = orderList
      orderData.count = parseInt(data.ret_content.count)
      orderData.pageNum = payload.pageNum
      orderData.pageSize = payload.pageSize
      orderData.searchName = payload.key
      orderData.dataLoading = false
      orderData.curSubjectList = orderData.sortSubjectSelected
      orderData.printData = {}
      orderData.selectedOrders = []
      orderData.sortFlag = false
      yield put({
        type: 'updateState',
        payload: {
          orderData,
        },
      })
    },
    * cancelOrder ({ payload }, { put, call, select }) {
      const { orderData } = yield select(_ => _.feeMissionInfo)
      if(orderData.dataLoading){
        return Message.error("请不要重复点击")
      }
      orderData.dataLoading = true
      yield put({
        type: 'updateState',
        payload: {
          orderData
        },
      })
      let queryParam = payload.queryParam
      delete payload.queryParam
      const data = yield call(order.cancelOrder, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        orderData.dataLoading = false
        yield put({
          type: 'updateState',
          payload: {
            orderData
          },  
        })
        return Message.error(data.ret_content)
      }

      Message.success('冲正成功')
      yield put({
        type: 'getOrderList',
        payload: {
          ...queryParam
        },
      })
    },
    * importOrder ({ payload }, { put, call, select }) {
      const { orderData } = yield select(_ => _.feeMissionInfo)
      orderData.modalImportData.step = 1;
      orderData.modalImportData.cgNum = '0';
      orderData.modalImportData.wxNum = '0';
      orderData.modalImportData.cfNum = '0';
      orderData.modalImportData.importing = true;
      orderData.timer = payload.timer
      yield put({
        type: 'updateState',
        payload: {
          orderData
        },
      })

      let data;
      delete payload.timer
      if(orderData.modalImportData.importType==1){
        data = yield call(order.importOrder, payload)
      }else{
        let arr = []
        for(let node of orderData.modalImportData.subjectSort){
          if(!node._add){
            arr.push({
              missionId:payload.missionId,
              subjectId:node.subjectId,
              position:node.position,
            })
          }
        }
        if(arr.length<=0){
          return Message.error("请选择冲抵顺序")
        }
        payload.subjectSort = JSON.stringify(arr)
        data = yield call(order.importFee, payload)
      }
      
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        clearInterval(orderData.timer)
        orderData.modalImportData.step = 2;
        orderData.modalImportData.message = data.ret_content;
        yield put({
          type: 'updateState',
          payload: {
            orderData,
          },
        })
        return
      }
      orderData.modalImportData.step = 1;
      yield put({
        type: 'updateState',
        payload: {
          orderData,
        },
      })
    },

    * getImportOrderPrs ({ payload }, { put, call, select }) {
      const data = yield call(order.getImportPrs)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let { orderData } = yield select(_ => _.feeMissionInfo)
      orderData.modalImportData.cgNum = data.ret_content.cgNum
      orderData.modalImportData.cfNum = data.ret_content.cfNum
      orderData.modalImportData.wxNum = data.ret_content.wxNum
      if (data.ret_content.status == '2') {
        clearInterval(orderData.timer)
        orderData.modalImportData.importing = false;
        yield put({
          type: 'updateState',
          payload: {
            orderData
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

    * coverOrder ({ payload }, { put, call, select }) {
      let { orderData } = yield select(_ => _.feeMissionInfo)
      orderData.timer = payload.timer
      let data = yield call(order.coverOrder)
      if (!data.success) {
        clearInterval(orderData.timer)
        throw data
      } else if (data.ret_code != 1) {
        clearInterval(orderData.timer)
        return Message.error(data.ret_content)
      }
      orderData.modalImportData.importing = true;
      yield put({
        type: 'updateState',
        payload: {
          orderData
        },
      })
    },
    * getOrderReturnList ({ payload }, { put, call, select }) {
      const {
        sortList, missionId, beginDate, endDate,
      } = payload
      if (!beginDate) {
        throw '请选择开始时间!'
      }
      if (!endDate) {
        throw '请选择结束时间!'
      }
      if (payload.receiptBeginNo && payload.receiptEndNo && payload.receiptEndNo < payload.receiptBeginNo) {
        throw '请输入正确的票据编号!'
      }
      const { refundData } = yield select(_ => _.feeMissionInfo)
      let tempList = getSortParam(sortList)
      if (tempList && tempList.length>0) {
        payload.sortList = JSON.stringify(tempList)
      }else{
        delete payload.sortList
      }
      if(refundData.sortSubjectSelected){
        payload.subjectId =  refundData.sortSubjectSelected.toString();
      }
      if(payload.accountId){
        payload.accountId =  payload.accountId.toString();
      }
      // // 获取经办人条件
      // if (refundData.accountList) {
      //   let accountStr = ''
      //   for (let account of refundData.accountList) {
      //     if (payload.accountId.indexOf(`${account.loginName}(${account.name})`) >= 0) {
      //       accountStr += `${account.id},`
      //     }
      //   }
      //   if (accountStr) {
      //     payload.accountId = accountStr
      //   }
      // }
      refundData.dataLoading = true
      yield put({
        type: 'updateState',
        payload: {
          refundData,
        },
      })
      const data = yield call(order.getOrderReturnList, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const orderList = data.ret_content.data
      for (let order of orderList) {
        if (order.attrList) {
          for (let attr of order.attrList) {
            order[attr.attrId] = attr.relateName
          }
        }
      }
      const feeSum = yield call(order.getOrderReturnFeeSum,payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      refundData.returnFeeSum = feeSum.ret_content
      refundData.list = orderList
      refundData.count = parseInt(data.ret_content.count)
      refundData.pageNum = payload.pageNum
      refundData.pageSize = payload.pageSize
      refundData.searchName = payload.key
      refundData.dataLoading = false
      refundData.sortFlag = false
      yield put({
        type: 'updateState',
        payload: {
          refundData,
        },
      })
    },
    * cancelOrderReturn ({ payload }, { put, call, select }) {
      const { refundData } = yield select(_ => _.feeMissionInfo)
      if(refundData.dataLoading){
        return Message.error("请不要重复点击")
      }
      refundData.dataLoading = true
      yield put({
        type: 'updateState',
        payload: {
          refundData
        },
      })
      const data = yield call(order.cancelOrderReturn, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        refundData.dataLoading = false
        yield put({
          type: 'updateState',
          payload: {
            refundData
          },
        })
        return Message.error(data.ret_content)
      }

      Message.success('作废成功')
      const node = refundData.list.filter(item=>item.orderNo===payload.orderNo)[0]
      node.status = '0'
      if(node.feeBillLists){
        for(let bill of node.feeBillLists){
          bill._cancelOrderVisible = false
        }
        node.remark = payload.remark
      }
      
      refundData.dataLoading = false
      yield put({
        type: 'updateState',
        payload: {
          refundData
        },
      })
    },
    * importReturn ({ payload }, { put, call, select }) {
      const { refundData } = yield select(_ => _.feeMissionInfo)
      refundData.modalImportData.step = 1;
      refundData.modalImportData.cgNum = '0';
      refundData.modalImportData.cfNum = '0';
      refundData.modalImportData.wxNum = '0';
      refundData.modalImportData.importing = true;
      refundData.timer = payload.timer
      yield put({
        type: 'updateState',
        payload: {
          refundData
        },
      })
      payload.type = 'return'
      delete payload.timer
      let data = yield call(order.importOrder, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        clearInterval(refundData.timer)
        refundData.modalImportData.step = 2;
        refundData.modalImportData.message = data.ret_content;
        yield put({
          type: 'updateState',
          payload: {
            refundData,
          },
        })
        return
      }
      refundData.modalImportData.step = 1;
      yield put({
        type: 'updateState',
        payload: {
          refundData,
        },
      })
    },

    * getImportReturnPrs ({ payload }, { put, call, select }) {
      const data = yield call(order.getImportPrs)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let { refundData } = yield select(_ => _.feeMissionInfo)
      refundData.modalImportData.cgNum = data.ret_content.cgNum
      refundData.modalImportData.cfNum = data.ret_content.cfNum
      refundData.modalImportData.wxNum = data.ret_content.wxNum
      if (data.ret_content.status == '2') {
        clearInterval(refundData.timer)
        refundData.modalImportData.importing = false;
        yield put({
          type: 'updateState',
          payload: {
            refundData
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

    * coverReturn ({ payload }, { put, call, select }) {
      let { refundData } = yield select(_ => _.feeMissionInfo)
      refundData.timer = payload.timer
      let data = yield call(order.coverOrder)
      if (!data.success) {
        clearInterval(refundData.timer)
        throw data
      } else if (data.ret_code != 1) {
        clearInterval(refundData.timer)
        return Message.error(data.ret_content)
      }
      refundData.modalImportData.importing = true;
      yield put({
        type: 'updateState',
        payload: {
          refundData
        },
      })
    },
    * getMgrAccountList ({ payload }, { put, call, select }) {
      const data = yield call(account.getMgrAccountList)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const { orderData } = yield select(_ => _.feeMissionInfo)
      orderData.accountList = data.ret_content.data
      yield put({
        type: 'updateState',
        payload: {
          orderData,
        },
      })
    },
    * getRefundMgrAccountList ({ payload }, { put, call, select }) {
      const data = yield call(account.getMgrAccountList)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const { refundData } = yield select(_ => _.feeMissionInfo)
      refundData.accountList = data.ret_content.data
      yield put({
        type: 'updateState',
        payload: {
          refundData,
        },
      })
    },
    * getPrint ({ payload }, { put, call, select }) {
      const data = yield call(setService.getSetting, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      const temData = yield call(getTemplateText, { templateId: data.ret_content.templateId })

      if (!temData.success) {
        throw temData
      } else if (temData.ret_code != 1) {
        return Message.error(temData.ret_content)
      }
      const { orderData } = yield select(_ => _.feeMissionInfo)
      orderData.textData = temData.ret_content
      orderData.settingData = data.ret_content
      orderData.settingData.orderNo = payload.orderNo
      orderData.settingData.missionId = payload.missionId
      orderData.settingData.billId = payload.billId
      orderData.printCheck = 1
      yield put({
        type: 'updateState',
        payload: {
          orderData,
        },
      })
      // const prnhtml = window.document.getElementById("prn").innerHTML
      // window.document.getElementById("printArea").innerHTML = prnhtml;
      // yield put({
      //   type: 'app/updateState',
      //   payload: {
      //     printing: true,
      //   }
      // })
      // window.print();
      // yield put({
      //   type: 'app/updateState',
      //   payload: {
      //     printing: false
      //   }
      // })
    },
    * print ({ payload }, { put, call, select }) {
      const { orderData } = yield select(_ => _.feeMissionInfo)

      yield put({
        type: 'app/updateState',
        payload: {
          printing: true,
        },
      })
      window.print()
      yield put({
        type: 'app/updateState',
        payload: {
          printing: false,
        },
      })
      orderData.printCheck = 2,
      yield put({
        type: 'updateState',
        payload: {
          orderData,
        },
      })
    },
    * printSuccess ({ payload }, { put, call, select }) {
      const { orderData } = yield select(_ => _.feeMissionInfo)
      let notips = payload.noTips;
      delete payload.notips;
      if(!notips){
        if(orderData.dataLoading){
          return Message.error("请不要重复点击")
        }
        orderData.dataLoading = true;
        yield put({
          type: 'updateState',
          payload: {
            orderData
          },
        })
      }else{
        delete payload.notips;
      }
      const data = yield call(setService.addReceiptHistory, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        orderData.dataLoading = false;
        yield put({
          type: 'updateState',
          payload: {
            orderData
          },
        })
        return Message.error(data.ret_content)
      }
      if(!notips){
        Message.success('打印成功')
      }
     
      orderData.printCheck = 0
      const node = orderData.list.filter(item => item.orderNo === payload.orderNo)[0]
      if (node) {
        for(let bill of node.feeBillLists){
          if(bill._checked){
            bill.receiptNo = payload.receiptNo;
            bill._checked = false;
          }
        }
      }
      orderData.dataLoading = false;
      yield put({
        type: 'updateState',
        payload: {
          orderData,
        },
      })
    },
    * printAll ({ payload }, { put, call, select }) {
      const {
        sortList, missionId, beginDate, endDate,
      } = payload
      if (!beginDate) {
        throw '请选择开始时间!'
      }
      if (!endDate) {
        throw '请选择结束时间!'
      }
      if (payload.receiptBeginNo && payload.receiptEndNo && payload.receiptEndNo < payload.receiptBeginNo) {
        throw '请输入正确的票据编号!'
      }
      const { orderData,userAttrList,missionInfo,subjectMap } = yield select(_ => _.feeMissionInfo)
      let tempList = getSortParam(sortList)
      if (tempList && tempList.length>0) {
        payload.sortList = JSON.stringify(tempList)
      }else{
        delete payload.sortList
      }
      // 获取经办人条件
      if (orderData.accountList) {
        let accountStr = ''
        for (let account of orderData.accountList) {
          if (payload.accountId.indexOf(`${account.loginName}(${account.name})`) >= 0) {
            accountStr += `${account.id},`
          }
        }
        if (accountStr) {
          payload.accountId = accountStr
        }
      }
      let tempMap={};
      for(let node of userAttrList){
        tempMap[node.name] = node.id
      }
      orderData.modalPrintAll = 1;
      orderData.modalPrintAllPrinted = 0;
      orderData.modalPrintAllTotal = '-';
      orderData.printAllVisible = false;
      yield put({
        type: 'updateState',
        payload: {
          orderData,
        },
      })
      let count = 0;
      payload.pageNum = 1;
      payload.pageSize= 500;
      payload.printStatus = 2;//未开票
      payload.subjectId = "";
      if(subjectMap){
        for(let index in subjectMap){
          if(subjectMap[index]._checked){
            payload.subjectId += subjectMap[index].id+','
          }
        }
      }
       //循环拉取所有未打印的数据
      while(true){
        let data = yield call(order.getOrderList, payload)
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }
        if(count == 0){
          orderData.modalPrintAllTotal = data.ret_content.count;
          yield put({
            type: 'updateState',
            payload: {
              orderData,
            },
          })
        }
        const orderList = data.ret_content.data
        for (let order of orderList) {
          let name = '',xuehao='',yuanxi='',banji='';
          //获取姓名、学号、院系、班级
          if (order.attrList) {
            for (let attr of order.attrList) {
              if(attr.attrId == tempMap['姓名']){
                name = attr.relateName;
              }else if(attr.attrId == tempMap['学号']){
                xuehao = attr.relateName;
              }else if(attr.attrId == tempMap['院系']){
                yuanxi = attr.relateName;
              }else if(attr.attrId == tempMap['班级']){
                banji = attr.relateName;
              }
            }
          }
          let subList = order.feeBillLists;
          let txt = "<&票据><&票据头>缴款人="+name+" "+xuehao+" "+yuanxi+" "+banji+"</&票据头><&收费项目>";
          let needPrint = false;
          let billStr = "";
          for(let billNode of subList){
            if(subjectMap[billNode.subjectId]&&!billNode.receiptNo&&subjectMap[billNode.subjectId]._checked){
              txt+="收费项目="+billNode.subCode+"\t计费数量=1\t收费标准="+getFormat(billNode.totalFee)+"\t金额="+getFormat(billNode.paidFee)+"\n";
              needPrint = true;
              billStr+=billNode.id+","
            }
          }
          if(!needPrint){
            count++;
            orderData.modalPrintAllPrinted = count;
            yield put({
              type: 'updateState',
              payload: {
                orderData,
              },
            })
            continue;
          }
          txt += "</&收费项目></&票据>";
          let params = {
            ZrTxt:txt,
            IsPrn:1,
            PjLx:missionInfo.templateCode
          };
          // //博思打印
          async function printBs (url) {
            return axios.get(url)
            .then((retdata) => {
              return Promise.resolve(retdata)
            }) .catch((err) => {
              return Promise.reject("无法调用博思打印接口，请检查相应服务是否开启");
            });
          }
          const url = "http://127.0.0.1:7699/PZrPj?"+qs.stringify(params);
          let temp = yield call(printBs, url)
          //处理成功
          let retStr = temp.data?temp.data:'打印失败';
          if(retStr.indexOf('成功:') == 0){
            count++;
            let arr = retStr.split(',');
            orderData.modalPrintAllPrinted = count;
            //获取票据号
            yield put({
              type: 'feeMissionInfo/printSuccess',
              payload: {
                missionId: order.missionId,
                orderNo: order.orderNo,
                receiptNo: arr[1],
                billId: billStr,
                noTips: true,
              },
            })
             yield put({
              type: 'updateState',
              payload: {
                orderData,
              },
            })
          }
          else{
            //出错了
            orderData.modalPrintAllError = '订单号：'+order.orderNo+":"+retStr;
            yield put({
              type: 'updateState',
              payload: {
                orderData,
              },
            })
            return;
          }
        }
        if(data.ret_content.count <= count){
          //处理完成
          break;
        }
        payload.pageNum ++;
      }
      orderData.modalPrintAllClosable = true;
      yield put({
        type: 'updateState',
        payload: {
          orderData,
        },
      })
    },
    * printDelete ({ payload }, { put, call, select }) {
      let param = [{
        orderNo: payload.orderNo,
        receiptNo: payload.receiptNo,
      }]
      const data = yield call(setService.deleteReceiptHistory, {receiptList:param})
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      Message.success('作废成功')
      const { orderData } = yield select(_ => _.feeMissionInfo)
      const node = orderData.list.filter(item => item.orderNo === payload.orderNo)[0]
      if (node) {
        for(let bill of node.feeBillLists){
          if(bill.receiptNo == payload.receiptNo){
            bill.receiptNo = ''
          }
        }
      }

      yield put({
        type: 'updateState',
        payload: {
          orderData,
        },
      })
    },

    * getStatBillList ({ payload }, { put, call, select }) {
      const { statData } = yield select(_ => _.feeMissionInfo)
      const { sortList, missionId } = payload
      if (!missionId) {
        throw '请选择收费任务!'
      }
      let tempList = getSortParam(sortList)
      if (tempList && tempList.length>0) {
        payload.sortList = JSON.stringify(tempList)
      }else{
        delete payload.sortList
      }
      statData.dataLoading = true
      statData.sortFlag = false
      yield put({
        type: 'updateState',
        payload: {
          statData,
        },
      })

      yield put({
        type: 'getBillStatistics',
        payload: {
          ...payload,
        },
      })

      const data = yield call(feeBill.getBills, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const billList = data.ret_content.data
      let exceedFeeVisible = false
      for (let bill of billList) {
        if (bill.attrList) {
          for (let attr of bill.attrList) {
            bill[attr.attrId] = attr.relateName
          }
        }
        if(bill.feeBillListEntities){
          //合计
          let tempTotal = {
            subjectName:"小计",
            totalFee: 0,
            refund:0,
            paidFee: 0,
            exceedFee: 0,
            discount: 0,
            loans: 0,
            status: 0,
            id: '_totalSum'
          }
          for(let node of bill.feeBillListEntities){
            if(node.status == '1'){
              tempTotal.totalFee += parseInt(node.totalFee)
              tempTotal.refund += parseInt(node.refund)
              tempTotal.paidFee += parseInt(node.paidFee)
              tempTotal.discount += parseInt(node.discount)
              tempTotal.exceedFee += node.exceedFee?parseInt(node.exceedFee):0
              tempTotal.loans += parseInt(node.loans)
            }
            if(tempTotal.exceedFee != 0){
              exceedFeeVisible = true
            }
          }
          bill.feeBillListEntities.push(tempTotal)
        }
      }
      statData.list = billList
      statData.count = parseInt(data.ret_content.count)
      statData.pageNum = payload.pageNum
      statData.pageSize = payload.pageSize
      statData.searchName = payload.key
      statData.dataLoading = false
      statData.type = payload.type
      statData.exceedFeeVisible = exceedFeeVisible
      yield put({
        type: 'updateState',
        payload: {
          statData,
        },
      })
    },

    * getBillStatistics ({ payload }, { put, call, select }) {
      const { statData } = yield select(_ => _.feeMissionInfo)
      statData.spinning=true
      yield put({
        type: 'updateState',
        payload: {
          statData,
        },
      })
      delete payload.pageNum
      delete payload.pageSize
      const data = yield call(feeBill.getBillStatistics, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      statData.billStat = data.ret_content
      //statData.billStat.receivedFeeSum = parseInt(statData.billStat.paidFeeSum)+parseInt(statData.billStat.refundSum)+parseInt(statData.billStat.convertFee)
      statData.spinning=false
      yield put({
        type: 'updateState',
        payload: {
          statData,
        },
      })
    },

    * getEdit ({ payload }, { put, call, select }) {
      const { missionInfo, missionEdiable } = payload
      let { paySubjectList } = yield select(_ => _.feeMissionInfo)
      let data = {}
      if(!paySubjectList){
        data = yield call( feeSubject.getSubjectList )
        paySubjectList = data.ret_content.data
      }
      for(let item of paySubjectList){
        if(missionInfo.subjectList[0].id == item.id){
          missionInfo.subjectList[0].mchId = item.mchId
          missionInfo.subjectList[0].mchName = item.mchName
          missionInfo.subjectList[0].templateId = item.templateId
          missionInfo.subjectList[0].templateName = item.templateName
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          paySubjectList,
          missionInfo,
          missionEdiable,
        },
      })
    },

    * getMissionById ({ payload }, { put, call, select }) {
      let data = yield call(feeMission.getMissionById, { id: payload.id })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      let subjectMap = {}
      let subjectName = ""
      // let mergeCheckVisible = false
      for (let subject of data.ret_content.subjectList) {
        subject._isRequired = subject.isRequired
        subject._isDefault = subject.isDefault
        subject._allowModify = subject.allowModify
        subject._allowDeferred = subject.allowDeferred
        subject._modifyMin = subject.modifyMin?getFormat(subject.modifyMin):undefined
        subject._modifyStep = subject.modifyStep?getFormat(subject.modifyStep):undefined
        subject._userShowName = subject.userShowName
        subject._remark = subject.remark
        subject._userShowStatus = subject.userShowStatus
        subjectName += subject.name
        if(subject.isRequired != '1'){
          subjectName+="(选缴)"
        }
        subjectName+=';'
        if(subject.userShowName){
          subject.userShowStatus = true
        }
        subjectMap[subject.id] = subject
      }
      if(data.ret_content.gradeList){// 年级
        let gradeValue = ""
        let gradeId = []
        let i = 0
        for (let grade of data.ret_content.gradeList) {
          if(i != 0){
            gradeValue+=';'
          }
          gradeValue += grade.value
          gradeId.push(grade.id)
          i++
        }
        data.ret_content.gradeValue = gradeValue
        data.ret_content.gradeId = gradeId
      }
      const { billData,statData } = yield select(_ => _.feeMissionInfo)
      // data.ret_content.mergeCheckVisible = mergeCheckVisible
      data.ret_content.subjectName = subjectName
      if(payload.reset){
        billData.list = []
        statData.list = []
      }
      yield put({
        type: 'updateState',
        payload: {
          billData,
          statData,
          missionInfo: data.ret_content,
          missionEdiable: false,
          subjectMap, 
          subjectList: data.ret_content.subjectList
        },
      })
    },

    * getCreateBillPrs ({ payload }, { put, call, select }) {
      const prs = yield call(feeMission.getCreateBillsPrs, payload)
      const { timer,missionId } = yield select(_ => _.feeMissionInfo)
      if (prs.ret_code == '1') {
        if (prs.ret_content.cgNum == '100') {
          clearInterval(timer)
          let cgNum = parseInt(prs.ret_content.cgNum)
          yield put({
            type: 'updateState',
            payload: {
              modalVisible: false,
              cgNum
            },
          })
          Message.success('设置成功！')
          let reset = '1' // 添加一个项目，重置任务统计和应收账单
          yield put({
            type: 'getMissionById',
            payload: {
              reset,
              id: missionId,
            },
          })
          
        } else {
          let cgNum = parseInt(prs.ret_content.cgNum)
          yield put({
            type: 'updateState',
            payload: {
              cgNum
            },
          })
        }
      } else {
        throw prs
      }
    },

    * getCreditBatchList ({ payload }, { put, call, select }) {
      const data = yield call(credit.getCreditBatchList)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      yield put({
        type: 'updateState',
        payload: {
          creditBatchList: data.ret_content,
        },
      })
    },

    * getFeeBillOperateHistory ({ payload }, { put, call, select }) {
      const { missionId } = yield select(_ => _.feeMissionInfo)
      payload.missionId = missionId
      const data = yield call(feeBill.getFeeBillOperateHistory,payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      const { billData,statData } = yield select(_ => _.feeMissionInfo)
      billData.modalTableVisible = true
      billData.modalTableData.dataLoading = false
      billData.operateHistoryList = data.ret_content.feeBillOperateHistoryList.data?data.ret_content.feeBillOperateHistoryList.data:[]
      billData.modalTableMask = payload.mask
      for (let order of billData.operateHistoryList) {
        if (order.attrList) {
          for (let attr of order.attrList) {
            order[attr.attrId] = attr.relateName
          }
        }
        if(order.snapshot){
          order.snapshot = JSON.parse(order.snapshot);
          order.srcTotalFee = order.snapshot.totalFee
        }
        if(order.info){
          order.info = JSON.parse(order.info);
          order.totalFee = order.info.totalFee
          order.reason = order.info.reason
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          billData,
        },
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

    setCurrentDep (state, { payload }) {
      return { ...state, ...payload }
    },

  },
})
