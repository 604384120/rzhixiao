import React from 'react'
import { Row, Col, Card, Button, Input, Icon, Tabs, DatePicker, Modal, Select, Spin, Message, Popover, Cascader, Divider, Progress, Checkbox, InputNumber } from 'antd'
import { Page } from 'components'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import moment from 'moment'
import FeeRule from './FeeRule'
import UserBill from './UserBill'
import Order from './Order'
import Refund from './Refund'
import Statistics from './Statistics'
import Error from './../error'
import { getYearFormat, getFormat } from 'utils'

const TabPane = Tabs.TabPane
const Option = Select.Option

const FeeMissionInfo = ({
  location,
  dispatch,
  feeMissionInfo,
  loading,
  app,
}) => {
  const {
    missionInfo, missionId, missionEdiable, missionError, receiptList, subjectMap, subjectList, 
    ruleData, billData, orderData, refundData,statData, index,
    paySubjectList, modalVisible, cgNum, creditBatchList,
  } = feeMissionInfo

  const { user, menuMap, isNavbar, requestMap, userDisplaySence, userAttrList, userAttrMap } = app

  const payTypeList = requestMap['payTypeList']
  const payTypeNameMap = requestMap['payTypeMap']
  const departTree = requestMap['departTree']
  const gradeList = requestMap['gradeList']
  const accountList = requestMap['accountList']

  const displayUpdateState = (data, sence) => {
    userDisplaySence[sence] = {...userDisplaySence[sence], ...data}
    dispatch({
      type: 'app/updateState',
      payload: {
        userDisplaySence
      },
    })
  }
  const displayReset = (sence, displayExtra) => {
    dispatch({
      type: 'app/resetDisplay',
      payload:{sence, displayExtra}
    })
  }
  const displayUpdate = (data, sence) => {
    dispatch({
      type: 'app/updateDisplay',
      payload: {
        displayListTemp:data,
        sence
      },
    })
  }
  const displayAttrRelateList = (data, sence) => {
    dispatch({
      type: 'app/getAttrRelateList',
      payload: {
        ...data,
        sence
      },
    })
  }
  
  const FeeRuleProps = {
    ruleData,
    menuMap,
    missionId,
    missionInfo,
    subjectMap,
    userAttrList,
    user,isNavbar,
    onUpdateState (data) {
      dispatch({
        type: 'feeMissionInfo/updateState',
        payload: {
          ruleData: data,
        },
      })
    },

    onUpdateSort () {
      ruleData.sortFlag = true
      dispatch({
        type: 'feeMissionInfo/updateState',
        payload: {
          ruleData
        },
      })
    },

    onGetRuleList (data) {
      dispatch({
        type: 'feeMissionInfo/getRuleList',
        payload: {
          ...data,
        },
      })
    },
    onGetAllItemList (data) {
      dispatch({
        type: 'feeMissionInfo/getAllItemList',
        payload: {
          ...data,
        },
      })
    },
    onChangeStructItemSort (data) {
      dispatch({
        type: 'feeMissionInfo/changeStructItemSort',
        payload: {
          ...data,
        },
      })
    },
    onUpdateFeeRule (data) {
      //设置不可在点击
      ruleData. dataLoading = true,
      dispatch({
        type: 'feeMissionInfo/updateState',
        payload: {
          ruleData
        },
      })
      dispatch({
        type: 'feeMissionInfo/updateFeeRule',
        payload: {
          param: data,
          timer: setInterval(() => {
            dispatch({
              type: 'feeMissionInfo/getCreateBillsPrs',
              payload: {
                missionId,
              },
            })
          }, 1500)
        },
      })

      ruleData.cgNum = 0
      ruleData.modalVisible = true
      ruleData.ModalType = "addbill"
      dispatch({
        type: 'feeMissionInfo/updateState',
        payload: {
          ruleData
        },
      })
    },
    onChangeStruct (value) {
      dispatch({
        type: 'feeMissionInfo/changeStruct',
        payload: {
          structId: value,
        },
      })
    },
    onChangeSubject (value) {
      dispatch({
        type: 'feeMissionInfo/changeSubject',
        payload: {
          subjectId: value,
          missionId
        },
      })
    },
    onGetUserAttrList () {
      dispatch({
        type: 'feeMissionInfo/getUserAttrList',
        payload: {
        },
      })
    },
    onUpdateFeeRuleAttr(data) {
      dispatch({
        type: 'feeMissionInfo/updateFeeRuleAttr',
        payload: {
          ...data,
        },
      })
    },
    onGetAttrValueList(data) {
      dispatch({
        type: 'feeMissionInfo/getAttrValueList',
        payload: {
          ...data
        },
      })
    },
  }

  const UserBillProps = {
    billData,
    missionId,
    missionInfo,
    userDisplaySence,
    userAttrList,
    userAttrMap,
    subjectMap,
    subjectList,
    user,isNavbar,
    menuMap,
    displayUpdateState,
    displayReset,
    displayUpdate,
    displayAttrRelateList,
    onUpdateState (data) {
      dispatch({
        type: 'feeMissionInfo/updateState',
        payload: {
          billData: data,
        },
      })
    },
    onUpdateSort () {
      billData.sortFlag = true
      dispatch({
        type: 'feeMissionInfo/updateState',
        payload: {
          billData
        },
      })
    },
    onGetBillList (data) {
      dispatch({
        type: 'feeMissionInfo/getBillList',
        payload: {
          ...data,
        },
      })
    },
    onUpdateBills (data) {
      dispatch({
        type: 'feeMissionInfo/updateBills',
        payload: {
          ...data,
        },
      })
    },
    onUpdateBillsBatch (data) {
      dispatch({
        type: 'feeMissionInfo/updateBillsBatch',
        payload: {
          ...data,
        },
      })
    },
    onBillAdd () {
      dispatch(routerRedux.push({
        pathname: '/feeBillAdd',
        search: queryString.stringify({
          missionId,
        }),
      }))
    },
    onCreateBills (data) {
      dispatch({
        type: 'feeMissionInfo/createBills',
        payload: {
          ...data,
        },
      })
    },
    onGetCreateBillsPrs (data) {
      dispatch({
        type: 'feeMissionInfo/getCreateBillsPrs',
        payload: {
          ...data,
        },
      })
    },
    onImportConfirm (data) {
      dispatch({
        type: 'feeMissionInfo/importBill',
        payload: {
          ...data,
        },
      })
    },
    onGetImportPrs (data) {
      dispatch({
        type: 'feeMissionInfo/getImportBillPrs',
        payload: {
          ...data,
        },
      })
    },
    onImportCover (data) {
      dispatch({
        type: 'feeMissionInfo/coverBill',
        payload: {
          ...data,
        },
      })
    },
    onQueryOperateHistory (data,mask) {
      dispatch({
        type: 'feeMissionInfo/getFeeBillOperateHistory',
        payload: {
          userId: data.userId,
          mask: mask,
        },
      })
    }
  }

  const OrderProps = {
    orderData,
    missionId,
    missionInfo,
    userDisplaySence,
    userAttrList,
    userAttrMap,
    user,isNavbar,
    payTypeList,
    payTypeNameMap,
    subjectMap,
    menuMap,
    displayUpdateState,
    displayReset,
    displayUpdate,
    displayAttrRelateList,
    onUpdateState (data) {
      dispatch({
        type: 'feeMissionInfo/updateState',
        payload: {
          orderData: data,
        },
      })
    },
    onUpdateSort () {
      orderData.sortFlag = true
      dispatch({
        type: 'feeMissionInfo/updateState',
        payload: {
          orderData
        },
      })
    },
    opUpdateSubjectMap (data) {
      dispatch({
        type: 'feeMissionInfo/updateState',
        payload: {
          subjectMap: data,
        },
      })
    },
    onGetOrderList (data) {
      dispatch({
        type: 'feeMissionInfo/getOrderList',
        payload: {
          ...data,
        },
      })
    },
    onGetMgrAccountList (data) {
      dispatch({
        type: 'feeMissionInfo/getMgrAccountList',
        payload: {
          ...data,
        },
      })
    },
    onPrintSet () {
      dispatch(routerRedux.push({
        pathname: '/printSet',
        search: queryString.stringify({
          missionId: missionId
        }),
      }))
    },
    onPrintDelete (data) {
      dispatch({
        type: 'app/printDelete',
        payload: {
          ...data
        },
      })
    },
    onPrintSuccess (data) {
      dispatch({
        type: 'app/printSuccess',
        payload: {
          ...data
        },
      })
    },
    onGetPrint (data) {
      dispatch({
        type: 'app/getPrint',
        payload: {
          ...data
        },
      })
    },
    onUpdatePrint (data) {
      dispatch({
        type: 'app/updateState',
        payload: {
          ...data,
        },
      })
    },
    onPrintAll (data) {
      dispatch({
        type: 'feeMissionInfo/printAll',
        payload: {
          ...data,
        },
      })
    },
    onImportConfirm (data) {
      dispatch({
        type: 'feeMissionInfo/importOrder',
        payload: {
          ...data,
        },
      })
    },
    onGetImportPrs (data) {
      dispatch({
        type: 'feeMissionInfo/getImportOrderPrs',
        payload: {
          ...data,
        },
      })
    },
    onImportCover (data) {
      dispatch({
        type: 'feeMissionInfo/coverOrder',
        payload: {
          ...data,
        },
      })
    },
    onCancelOrder(data) {
      dispatch({
        type: 'feeMissionInfo/cancelOrder',
        payload: {
          ...data,
        },
      })
    },
    onhandleFormatVisibleChange(visible) {
      orderData.formatVisible = visible
      dispatch({
        type: 'feeMissionInfo/updateState',
        payload: {
          orderData
        },
      })
    },
    onhandleChangeFormat(format) {
      orderData.exportFormat = format
      dispatch({
        type: 'feeMissionInfo/updateState',
        payload: {
          orderData
        },
      })
    }
  }

  const RefundProps = {
    refundData,
    missionId,
    missionInfo,
    userDisplaySence,
    userAttrList,
    userAttrMap,
    user,isNavbar,
    payTypeList,
    payTypeNameMap,
    subjectMap,
    menuMap,
    displayUpdateState,
    displayReset,
    displayUpdate,
    displayAttrRelateList,
    onUpdateState (data) {
      dispatch({
        type: 'feeMissionInfo/updateState',
        payload: {
          refundData: data,
        },
      })
    },

    onUpdateSort () {
      refundData.sortFlag = true
      dispatch({
        type: 'feeMissionInfo/updateState',
        payload: {
          refundData
        },
      })
    },

    opUpdateSubjectMap (data) {
      dispatch({
        type: 'feeMissionInfo/updateState',
        payload: {
          subjectMap: data,
        },
      })
    },
    onGetOrderReturnList (data) {
      dispatch({
        type: 'feeMissionInfo/getOrderReturnList',
        payload: {
          ...data,
        },
      })
    },
    onGetMgrAccountList (data) {
      dispatch({
        type: 'feeMissionInfo/getRefundMgrAccountList',
        payload: {
          ...data,
        },
      })
    },
    onImportConfirm (data) {
      dispatch({
        type: 'feeMissionInfo/importReturn',
        payload: {
          ...data,
        },
      })
    },
    onGetImportPrs (data) {
      dispatch({
        type: 'feeMissionInfo/getImportReturnPrs',
        payload: {
          ...data,
        },
      })
    },
    onImportCover (data) {
      dispatch({
        type: 'feeMissionInfo/coverReturn',
        payload: {
          ...data,
        },
      })
    },
    onCancelOrderReturn(data) {
      dispatch({
        type: 'feeMissionInfo/cancelOrderReturn',
        payload: {
          ...data,
        },
      })
    },
    onhandleFormatVisibleChange(visible) {
      refundData.formatVisible = visible
      dispatch({
        type: 'feeMissionInfo/updateState',
        payload: {
          refundData
        },
      })
    },
    onhandleChangeFormat(format) {
      refundData.exportFormat = format
      dispatch({
        type: 'feeMissionInfo/updateState',
        payload: {
          refundData
        },
      })
    }
  }

  const StatisticsProps = {
    statData,
    missionId,
    missionInfo,
    userDisplaySence,
    userAttrList,
    userAttrMap,
    user,
    isNavbar,
    displayUpdateState,
    displayReset,
    displayUpdate,
    displayAttrRelateList,
    onUpdateState (data) {
      dispatch({
        type: 'feeMissionInfo/updateState',
        payload: {
          statData: data,
        },
      })
    },
    onUpdateSort () {
      statData.sortFlag = true
      dispatch({
        type: 'feeMissionInfo/updateState',
        payload: {
          statData
        },
      })
    },
    // onGetAttrRelateList (data) {
    //   dispatch({
    //     type: 'feeMissionInfo/getStatAttrRelateList',
    //     payload: {
    //       ...data,
    //     },
    //   })
    // },
    onGetBillList (data) {
      dispatch({
        type: 'feeMissionInfo/getStatBillList',
        payload: {
          ...data,
        },
      })
    },
    // onResetUserAttr (data) {
    //   dispatch({
    //     type: 'feeMissionInfo/resetUserAttr',
    //     payload: {
    //       ...data,
    //     },
    //   })
    // },
    // onUpdateUserAttr (data) {
    //   dispatch({
    //     type: 'feeMissionInfo/updateUserAttr',
    //     payload: {
    //       ...data,
    //     },
    //   })
    // },
  }

  const handleChangeTabs = (index) => {
    dispatch({
      type: 'feeMissionInfo/updateState',
      payload: {
        index,
      },
    })
    dispatch({
      type: 'feeMissionInfo/changeTabs',
      payload: {
        index,
      },
    })
  }

  const handleEdit = () => {
    missionInfo._subjectList = []
    for(let item of subjectList){
      item._isDefault = parseInt(item._isDefault)
      missionInfo._subjectList.push(item)
    }
    missionInfo._chagneTemp = { ...missionInfo }
    delete missionInfo._chagneTemp.departId
    // dispatch({
    //   type: 'feeMissionInfo/updateState',
    //   payload: {
    //     missionEdiable: true,
    //     missionInfo,
    //   },
    // })
    dispatch({
      type: 'feeMissionInfo/getEdit',
      payload: {
        missionEdiable: true,
        missionInfo,
      },
    })
  }

  const handleSave = () => {
    let temp = missionInfo._chagneTemp
    let data = []
    let hasCredit = null;
    data.name = temp.name
    data.beginDate = temp.beginDate?temp.beginDate:''
    data.endDate = temp.endDate?temp.endDate:''
    if(!temp.year){
      Message.error('请选择学年')
      return
    }
    data.year = temp.year
    if (receiptList) {
      let templateNode = receiptList.filter(item => temp.templateName === item.name)[0]
      if (!templateNode) {
        Message.error('请选择发票模板')
        return
      }
      data.templateId = templateNode.id
    } else {
      // data.templateId = missionInfo.templateId
      data.templateId = temp.templateId
    }
    if (accountList) {
      let chargeNode = accountList.filter(item => temp.chargeName === `${item.departName}/${item.loginName}`)[0]
      if (!chargeNode) {
        Message.error('请选择负责人')
        return
      }
      data.chargeId = chargeNode.id
    } else {
      data.chargeId = missionInfo.chargeId
    }
    if(temp.gradeId && temp.gradeId.length>0){// 年级
      data.gradeId = temp.gradeId.toString()
    }
    data.departId = temp.departId
    data.id = missionId
    let subjectArr = []
    let subjectMap = {}
    for(let subject of missionInfo._subjectList){
      let modifyMin = subject._modifyMin?Math.round(subject._modifyMin*100).toString():null
      let modifyStep = subject._modifyStep?Math.round(subject._modifyStep*100).toString():null
      let userShowName = subject._userShowName
      console.log(subject.remark)
      if(subject._allowDeferred == subject.allowDeferred && subject._isRequired == subject.isRequired && subject._isDefault == subject.isDefault
        && subject._allowModify == subject.allowModify && modifyMin == subject.modifyMin && modifyStep == subject.modifyStep
        && userShowName == subject.userShowName && subject._remark == subject.remark && subject._userShowStatus == subject.userShowStatus){
        continue
      }
      let tempSubject = null
      if(subject._addSubject && !subject._batchId && subject.subType=='2'){
        Message.error('请选择学分批次!')
        return
      }

      if(subject._userShowStatus && (!userShowName || userShowName == '')){
        Message.error('请输入合并展示名称!')
        return
      }

      if(userShowName){
        if(subjectMap[userShowName]){
          if(subjectMap[userShowName]._isRequired != subject._isRequired ||
            subjectMap[userShowName]._isDefault != subject._isDefault){
              Message.error('相同显示名称的项目配置必须相同')
              return
          }
        }else{
          subjectMap[userShowName] = subject
        }
      }

      if(subject._isRequired == '1'){
        tempSubject = {
          subjectId:subject.id,
          isRequired:"1",
          isDefault:subject._isDefault,
          allowModify:subject._allowModify,
          allowDeferred:subject._allowDeferred,
          modifyMin:subject._allowModify=='1'?modifyMin:null,
          modifyStep:subject._allowModify=='1'?modifyStep:null,
          userShowName,
          remark: subject._remark,
          userShowStatus: subject._userShowStatus?'1':'0'
        }
      }else{
        tempSubject = {
          subjectId:subject.id,
          isRequired:"0",
          isDefault:2,
          allowModify:'0',
          allowDeferred:'0',
          modifyMin: null,
          modifyStep: null,
          userShowName,
          remark: subject._remark,
          userShowStatus: subject._userShowStatus?'1':'0'
        }
      }
      if(subject._isStand){
        tempSubject.isStand = subject._isStand
      }
      if(subject._batchId){
        tempSubject.batchId = subject._batchId
      }
      if((subject.subType == '2' && subject._addSubject) || (subject._isStand=='1' && subject._addSubject)){
        // 学分学费或者是点选了适配已有标准
        hasCredit = true;
      }
      subjectArr.push(tempSubject)
    }
    if(subjectArr.length>0){
      data.subjectList = JSON.stringify(subjectArr)   //转换成json
    }
    data.hasCredit = hasCredit
    dispatch({
      type: 'feeMissionInfo/updateMission',
      payload: {
        ...data,
        timer: data.hasCredit?setInterval(() => {
          dispatch({
            type: 'feeMissionInfo/getCreateBillPrs',
            payload: {missionId},
          })
        },1500):null
      },
    })
    if(hasCredit){
      dispatch({
        type: 'feeMissionInfo/updateState',
        payload: {
          modalVisible: true,
          cgNum: 0,
          missionEdiable:false
        },
      })
    }
  }

  const handleCancel = () => {
    delete missionInfo._chagneTemp
    missionInfo.subjectName = ''
    missionInfo._subjectAddVisible = false
    delete missionInfo._subjectList
    for(let subject of subjectList){
      subject._isRequired = subject.isRequired
      subject._isDefault = subject.isDefault
      subject._allowModify = subject.allowModify
      subject._allowDeferred = subject.allowDeferred
      subject._modifyMin = subject.modifyMin?getFormat(subject.modifyMin):undefined
      subject._modifyStep = subject.modifyStep?getFormat(subject.modifyStep):undefined
      missionInfo.subjectName += subject.name
    }
    dispatch({
      type: 'feeMissionInfo/updateState',
      payload: {
        missionEdiable: false,
        missionInfo,
      },
    })
  }

  const handleChangeTemp = (name, value) => {
    if (value && [...value].length > 40) {
      Message.error('长度超过限制')
      return
    }
    missionInfo._chagneTemp[name] = value
    dispatch({
      type: 'feeMissionInfo/updateState',
      payload: {
        missionInfo,
      },
    })
  }

  const handleClickCharge = () => {
    if (!accountList) {
      dispatch({
        type: 'feeMissionInfo/getAccountList',
      })
    }
  }

  const handleChangeCharge = (value) => {
    missionInfo._chagneTemp.chargeName = value
    dispatch({
      type: 'feeMissionInfo/updateState',
      payload: {
        missionInfo,
      },
    })
  }

  const handleChangeYear = (value) => {
    missionInfo._chagneTemp.year = value
    dispatch({
      type: 'feeMissionInfo/updateState',
      payload: {
        missionInfo,
      },
    })
  }

  const handleChangeTemplate = (value) => {
    missionInfo._chagneTemp.templateId = missionInfo.subjectList[0].templateId
    missionInfo._chagneTemp.templateName = value
    dispatch({
      type: 'feeMissionInfo/updateState',
      payload: {
        missionInfo,
      },
    })
  }
  

  const handleChangeGrade = (value) => {
    missionInfo._chagneTemp.gradeId = value
    dispatch({
      type: 'feeMissionInfo/updateState',
      payload: {
        missionInfo,
      },
    })
  }

  const handleChangeSubjectAdd = (value) => {
    for(let item of paySubjectList){
      if(item.id == value){
        item._isRequired = '0'
        item._isDefault = 2
        item._allowModify = '0'
        item._allowDeferred = '0'
        item._isStand = user.isStand?user.isStand:'0'
        item._modifyMin = null
        item._modifyStep = null
        item._deleteIoc = true      // 显示删除图标
        item._isStandVisible = true   // 显示适配已有标准
        item._isbachIdVisible = true    // 显示批次选择框
        item._addSubject = true     // 新添加的收费项目
        item._userShowName = undefined
        missionInfo._subjectList.push(item)
      }
    }
    dispatch({
      type: 'feeMissionInfo/updateState',
      payload: {
        missionInfo,
        paySubjectList
      },
    })
    missionInfo._subjectAddVisible = null
  }

  const handelSubjectAdd = () => {
    missionInfo._subjectAddVisible = true    // 显示要添加的收费项目选择框
    dispatch({type:'feeMissionInfo/updateState',payload: {missionInfo}})
  }

  const createYearOption = () => {
    const option = [];
    let yearNow = moment().format("YYYY") - 10;
    for(let i=0;i<20;i++){
      option.push(<Option key={i} value={(yearNow+i).toString()} title={getYearFormat(yearNow+i)}>{getYearFormat(yearNow+i)}</Option>)
    }
    return option;
  }


  const createChargeOption = () => {
    let options = []
    if (accountList) {
      for (let account of accountList) {
        let str = `${account.departName}/${account.loginName}`
        options.push(<Option key={String(account.id)} value={str} title={str}>{str}</Option>)
      }
    }
    return options
  }

  const createSubjectListOption = () => {
    let options = []
    if (paySubjectList) {
      for (let subject of paySubjectList) {
        if( (missionInfo._subjectList.filter(item => subject.id == item.id).length <= 0) && (subject.mchId == subjectList[0].mchId) && (subject.templateId == subjectList[0].templateId) ){
          options.push(<Option key={String(subject.id)} value={subject.id} title={subject.name}>{subject.name}</Option>)
        }
      }
    }
    return options
  }

  const createDepartOptions = () => {
    if(user.departId && user.departId!="0"){
      //属于部门的从所属部门开始
      return departTree
    }
    //添加学校根结点
    let temp = [{
      value: '0',
      label: user.schoolName,
      children: departTree,
    }]
    return temp
  }

  const handleChangeSubject = (subject, index, value) => {
    subject[index] = value
    if(index == '_isRequired'){
      subject._isDefault = 2
    }
    if(index == '_remark'){
      let remark = value
      if(subject._userShowName){
        for(let n of missionInfo._subjectList){
          if(n._userShowName == subject._userShowName){
            n._remark = remark
          }
        }
      }
    }
    dispatch({
      type: 'feeMissionInfo/updateState',
      payload: {
        subjectList,
      },
    })
  }

  const handleDeleteSubject = (subject) => {
    let i = 0
    for(let item of missionInfo._subjectList){
      if(item.id == subject.id){
        if(item._batchId){
          item._batchId = undefined
        }
        missionInfo._subjectList.splice(i, 1)
        dispatch({
          type: 'feeMissionInfo/updateState',
          payload: {
            missionInfo
          },
        })
      break
      }
      i++
    }
  }

  const handleClickCreditBatch = () => {
    dispatch({
      type: 'feeMissionInfo/getCreditBatchList',
    })
  }

  const handleSelectCreditBatch = (value, subject) => {
    const target = missionInfo._subjectList.filter(item => subject.id === item.id)[0]
    target._batchId = value;
    dispatch({
      type: 'feeMissionInfo/updateState',
      payload: {
        missionInfo
      },
    })
  }

  const createCreditBatchOption = () => {
    const options = [];
    if(creditBatchList){
			for (let select of creditBatchList) {
				options.push(<Option key={select.id} value={select.id} title={select.name}>{select.name}</Option>)
			}
			return options
		}
		return null;
  }

  // const handleChangeCheckVisible = (e) => {
  //   missionInfo.mergeCheckVisible = e.target.checked
  //   dispatch({
  //     type: 'feeMissionInfo/updateState',
  //     payload: {
  //       missionInfo
  //     },
  //   })
  // }

  const handelFeeSubjectVisible = () => {
    missionInfo._feeSubjectVisible = true
    dispatch({
      type:'feeMissionInfo/updateState',
      payload: {
        missionInfo
      }
    })
  }

  const handelClose = () => {
    missionInfo._feeSubjectVisible = false
    dispatch({
      type:'feeMissionInfo/updateState',
      payload: {
        missionInfo
      }
    })
  }

  const renderSubjectName = () => {
    let displayStr = missionInfo.subjectName
    if(missionInfo.subjectName && missionInfo.subjectName.length>=15){
      displayStr = missionInfo.subjectName.substr(0,15)+"..."
    }
    if(missionEdiable){
      let arr = []
      let i=0
      for(let node of missionInfo._subjectList){
        i++
        arr.push(<div style={{width:'600px'}} key={i++}>
          <Row style={{fontWeight:'500'}}>{node.name} 
            <div style={{ display:'inline-block', float:'right',marginRight:'25px'}}>
              {node._isStandVisible && <span style={{ marginLeft:'10px',fontSize:'12px' }}><Checkbox style={{marginRight:'5px'}} disabled={node.subType == '2'||(user.isStand=='1' && user.isAdmin!='1')} checked={node._isStand=='1'} onChange={(e)=>handleChangeSubject(node, "_isStand", e.target.checked?'1':'0')}/>适配已有标准</span>} 
              {node._deleteIoc && <span className="mission-subject-side"> <Icon className="mission-subject-delete" style={{ marginBottom:'-2px'}} type="delete" onClick={(e) => { e.stopPropagation(); handleDeleteSubject(node) }} /></span>}
            </div>
          </Row>
          <Row style={{marginTop:'5px', marginLeft:'20px'}}> <Checkbox style={{marginRight:'5px'}} checked={node._isRequired=='1'}  onChange={(e)=>handleChangeSubject(node, "_isRequired", e.target.checked)}/>必缴项目
          {
            node._isRequired=='1'&&<div style={{display:'inline-block', marginLeft:'5px'}}>
              {/* <Checkbox style={{marginRight:'5px'}} checked={node._isDefault=='1'} onChange={(e)=>handleChangeSubject(node, "_isDefault", e.target.checked?'1':'0')}/>默认选择 */}
              <Checkbox style={{marginRight:'5px'}} checked={node._allowModify=='1'}  onChange={(e)=>handleChangeSubject(node, "_allowModify", e.target.checked?'1':'0')}/>允许分期
              <Checkbox style={{marginRight:'5px'}} checked={node._allowDeferred=='1'}  onChange={(e)=>handleChangeSubject(node, "_allowDeferred", e.target.checked?'1':'0')}/>允许缓缴
              <Checkbox style={{fontSize:'12px',}} checked={node._userShowStatus=='1'} onChange={(e)=>handleChangeSubject(node, "_userShowStatus", e.target.checked)}>手机端合并显示</Checkbox>
            </div>
          }
          <div style={{display:'inline-block', marginLeft:'5px'}}>
           </div>
            <Select style={{width:'128px',display: "inline-block",marginLeft: '8px'}} size='small' placeholder={"默认勾选"} value={node._isDefault} onChange={(value)=>{handleChangeSubject(node,'_isDefault',value)}}>
              <Option key={2} value={2} title={'默认勾选'}>默认勾选</Option>
              <Option key={1} value={1} disabled={node._isRequired=='1'?false:true} title={'默认且不可取消'}>默认且不可取消</Option>
              <Option key={0} value={0} title={'默认不勾选'}>默认不勾选</Option>
            </Select>
          </Row>
          <Row>
          {
            (node.subType=='2' && !node._isbachIdVisible)?<div style={{display:'inline-block'}}>
            <Select size="small" style={{width:'150px',marginTop:'5px', marginLeft:'20px', marginRight:'10px'}} value={missionInfo.creditBatchName} disabled={true}/>
            </div>:node.subType=='2' && node._isbachIdVisible&&<div style={{display:'inline-block'}}>
              <Select size="small" style={{width:'150px',marginTop:'5px', marginLeft:'20px', marginRight:'10px'}}
                value={node._batchId}
                placeholder={"选择学分学费批次"}
                showSearch optionFilterProp="children"
                onFocus={() => handleClickCreditBatch()}
                onChange={(value)=>{handleSelectCreditBatch(value, node)}}
                >{createCreditBatchOption()}</Select>
            </div>
          }
          {
            node._isRequired=='1'&&node._allowModify=='1'&&<div style={{display:'inline-block'}}>
              <InputNumber size='small' min={0} value={node._modifyMin} style={{marginTop:'5px', width:'120px', marginLeft:node.subType=='2'?'':'20px'}} placeholder="最低分期金额" onChange={(value)=>handleChangeSubject(node, "_modifyMin", value)}/>
              <InputNumber size='small' min={0} value={node._modifyStep} style={{marginTop:'5px', marginLeft:'5px', width:'80px'}} placeholder="倍数步长" onChange={(value)=>handleChangeSubject(node, "_modifyStep", value)}/>
            </div>
          }
            {/* {!missionInfo.mergeCheckVisible && <Input size='small' value={node._remark} placeholder="请输入提示" style={{marginLeft:'20px', marginRight:'10px', marginTop:'5px', width:'150px'}} onChange={(e) => handleChangeSubject(node, "_remark", e.target.value)} />} */}
          </Row>
            <Row><Input size='small' value={node._remark} placeholder="请输入提示" style={{marginLeft:'20px', marginRight:'10px', width:'150px'}} onChange={(e) => handleChangeSubject(node, "_remark", e.target.value)} />
            <Input value={node._userShowName} 
            onChange={(e)=>handleChangeSubject(node, "_userShowName", e.target.value)}
            size='small' style={{width:'150px',marginTop:'5px'}}
              placeholder={"请输入合并展示名称"}/></Row>
          <Divider style={{ margin: '10px' }} dashed />
        </div>)
      }
      arr.push(missionInfo._subjectAddVisible?<Select key={i} showSearch optionFilterProp="children" defaultValue="请选择" style={{ width: 120 }} onChange={(value) => {handleChangeSubjectAdd(value)}}>
        {createSubjectListOption()}
      </Select>:<a style={{ border:'1px dashed rgb(217,217,217)', padding:'5px 12px', borderRadius:'5px'}} key={i} href="javascript:;" onClick={handelSubjectAdd}><Icon style={{ fontSize:'12px',marginRight:'5px'}} type="plus" />添加</a>)
      // return <Popover title={<div>设置收费项目<div style={{float:'right',fontSize:'12px'}}>
      //   <Checkbox checked={missionInfo.mergeCheckVisible} onChange={handleChangeCheckVisible}/>手机端合并显示项目</div>
      //  </div>} placement="bottom" visible={true} content={
      //   <div style={{ maxHeight:'300px', overflowX:'hidden', }}>
      //     {arr}
      //   </div>
      // }>{displayStr}</Popover>
      return <div style={{display:'inline-block'}}>
        <a onClick={handelFeeSubjectVisible}>{displayStr}</a>
        <Modal
        visible={missionInfo._feeSubjectVisible}
        onCancel={handelClose}
        closable={true}
        title={<div>设置收费项目</div>}
        footer={null}
        width={'700px'}
        maskClosable={true}
        >
          <div style={{ height:'600px', overflowX:'hidden', overflowX:'scroll' }}>
            {arr}
          </div>
        </Modal>
      </div>
    }

    return displayStr
  }

  const createGradeOption = () => {
    const options = []
    if (gradeList) {
      for (let select of gradeList) {
        options.push(<Option key={select.relateId} value={select.relateId} title={select.relateId}>{select.relateName}</Option>)
      }
      return options
    }
    return null
  }

  const handleClickDepart = (e) => {
    if (!departTree) {
      dispatch({
        type: 'feeMissionInfo/getDepartTree',
      })
    }
  }
  const handleChangeDepart = (e) => {
    missionInfo._chagneTemp.departId =  e[e.length - 1]
    dispatch({
      type: 'feeMissionInfo/updateState',
      payload: {
        missionInfo,
      },
    })
  }
  let numPerRow = 4
  if(document.body.clientWidth < 600){
    numPerRow = 1;
  }else{
    numPerRow = Math.round(document.body.clientWidth / 300)
    if(numPerRow > 4){
      numPerRow = 4
    }
  }

  return (
    missionError ? <Error /> :
    <Page inner>
      <Row gutter={16}>
        <Col>
          <Card bordered={false} bodyStyle={{ padding: ' 0' }}>
            <Row>
              <div style={{ margin: '10px', height: '31px' }}><span style={{ fontSize: '21px' }}>
                {missionEdiable ? <Input style={{
width: '300px', height: '31px', fontSize: '21px', margin: '-10px', marginBottom: isNavbar?'10px':undefined
}}
                  value={missionInfo._chagneTemp.name}
                  onChange={e => handleChangeTemp('name', e.target.value)}
                /> : missionInfo.name}
              </span>
                {(user.id==missionInfo.chargeId||user.isAdmin=="1")?(missionEdiable ? <div style={{ float: 'right' }}><Button style={{ marginRight: '10px' }} onClick={handleCancel}>取消</Button><Button type="primary" onClick={handleSave}>保存</Button></div>
                  : <Button type="primary" style={{ float: 'right' }} onClick={handleEdit}>编辑</Button>):""}
              </div>
              <div style={{display: 'block', width: '100%', margin: '5px 0 0 20px', height: '33px', verticalAlign: 'middle', lineHeight: '33px',}}>
                <Col span={24/numPerRow} >创建人&nbsp;&nbsp;&nbsp;：{missionInfo.acountName}</Col>
                <Col span={24/numPerRow} >负责人&nbsp;&nbsp;&nbsp;：{missionEdiable ? <Select 
                  value={missionInfo._chagneTemp.chargeName} allowClear showSearch
                  style={{ width: '200px' }} optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onFocus={() => handleClickCharge()}
                  notFoundContent={!accountList ? <Spin size="small" /> : null}
                  onChange={(value) => { handleChangeCharge(value) }}
                  >{createChargeOption()}</Select> : missionInfo.chargeName}
                </Col>
                <Col span={24/numPerRow} >所属部门：{missionEdiable ? <Cascader style={{ width: '200px' }} options={createDepartOptions()} placeholder="请选择所属部门" expandTrigger="hover"
                  placeholder={missionInfo.departmentsName?missionInfo.departmentsName:"请选择部门"} onClick={() => handleClickDepart()}  notFoundContent={!departTree ? <Spin size="small" /> : null}
                  changeOnSelect onChange={handleChangeDepart} /> : missionInfo.departmentsName?missionInfo.departmentsName:user.schoolName}
                </Col>
                <Col span={24/numPerRow} >所属学年：{missionEdiable&&!missionInfo.year ? <Select
                      style={{ width: '200px' }} showSearch
                      allowClear optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      value={missionInfo._chagneTemp.year}
                      onChange={(value) => { handleChangeYear(value) }}
                >{createYearOption()}</Select> : getYearFormat(missionInfo.year)}</Col> 
              </div>
              <div style={{display: 'block', width: '100%', margin: '5px 0 0 20px', height: '33px', lineHeight: '33px',}}>
                <Col span={24/numPerRow} >起始时间：{missionEdiable ? <DatePicker disabledDate={(current) => { return missionInfo._chagneTemp.endDate && current > moment(missionInfo._chagneTemp.endDate) }}
                  format="YYYY-MM-DD HH:mm:ss"   style={{ width: '200px' }}
                  onChange={time => handleChangeTemp('beginDate', time ? time.format('YYYY-MM-DD HH:mm:ss') : null)}
                  value={missionInfo._chagneTemp.beginDate ? moment(missionInfo._chagneTemp.beginDate) : undefined}
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                /> : (missionInfo.beginDate?missionInfo.beginDate:"无限制")}</Col>
                <Col span={24/numPerRow} >截至时间：{missionEdiable ? <DatePicker disabledDate={(current) => { return missionInfo._chagneTemp.beginDate && current < moment(missionInfo._chagneTemp.beginDate) }}
                  format="YYYY-MM-DD HH:mm:ss"   style={{ width: '200px' }}
                  onChange={time => handleChangeTemp('endDate', time ? time.format('YYYY-MM-DD HH:mm:ss') : null)}
                  value={missionInfo._chagneTemp.endDate ? moment(missionInfo._chagneTemp.endDate) : undefined}
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                /> : (missionInfo.endDate?missionInfo.endDate:"无限制")}</Col>
                <Col span={24/numPerRow} >收费项目：{renderSubjectName()}</Col>
                <Col span={24/numPerRow} >年级：{missionEdiable?<Select mode="multiple" allowClear={true}  value={missionInfo._chagneTemp.gradeId} onChange={ handleChangeGrade } optionFilterProp="children" placeholder="请选择年级" style={{ width: 'calc(100% - 50px)' }} notFoundContent={!gradeList?<Spin size="small" />:null}>
                {createGradeOption()}
              </Select>:(missionInfo.gradeValue?missionInfo.gradeValue:'')}</Col>
              </div>
              <div style={{display: 'block', width: '100%', margin: '5px 0 0 20px', height: '33px', lineHeight: '33px',}}>
                <Col span={24/numPerRow} >收费账户：{missionInfo.mchName?missionInfo.mchName:"默认账户"}</Col>
                <Col span={24/numPerRow} >票据类型：{missionEdiable && missionInfo._subjectList ?<Select
                    allowClear
                    style={{width:'200px'}}
                    placeholder='请选择'
                    onChange={ handleChangeTemplate }>
                    {missionInfo._subjectList[0].templateName && <option value={missionInfo._subjectList[0].templateName}>{missionInfo._subjectList[0].templateName}</option>}
                  </Select>:(missionInfo.templateName?missionInfo.templateName:'')}
                </Col>
              </div>
            </Row>
            <Row style={{ marginTop: '10px' }}>
              <Tabs defaultActiveKey="1" activeKey={index} animated={false} onChange={handleChangeTabs}>
                <TabPane tab="收费标准" key="1">
                  {
                    index==1&&<FeeRule {...FeeRuleProps} />
                  }
                </TabPane>
                <TabPane tab="应收账单" key="2">
                  {
                    index==2&&<UserBill {...UserBillProps} />
                  }
                </TabPane>
                <TabPane tab="收费明细" key="3">
                {
                    index==3&&<Order {...OrderProps} />
                }
                </TabPane>
                <TabPane tab="退费明细" key="4">
                {
                    index==4&&<Refund {...RefundProps} />
                }
                </TabPane>
                <TabPane tab="任务统计" key="5">
                {
                    index==5&&<Statistics {...StatisticsProps} />
                }
                </TabPane>

              </Tabs>
            </Row>
          </Card>
        </Col>
      </Row>
      <Modal
        visible = {modalVisible}
        onCancel={() => { onClose() }}
        title="项目创建中"
        footer={null}
        width="300px"
        maskClosable={false}
        closable={cgNum!=100?false:true}
      >
        <div style={{width: '40%',margin: 'auto', textAlign:'center'}}> <Progress type="circle" percent={cgNum} width={80} /></div>
    </Modal>
    </Page>
  )
}

FeeMissionInfo.propTypes = {
  feeMissionInfo: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default connect(({ feeMissionInfo, app, loading }) => ({ feeMissionInfo, app, loading }))(FeeMissionInfo)

