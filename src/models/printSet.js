import { routerRedux } from 'dva/router'
import modelExtend from 'dva-model-extend'
import { model } from 'models/common'
import queryString from 'query-string'
import { Message } from 'antd'
import * as setService from 'services/printSet'
import { getTemplateText } from 'services/receipt'

let makeLastNum = (index) => {
  return parseInt(index.split('-')[1])
}
let numConvert = (num) => {
  if(parseInt(num) < 10){
    return '0'+num
  }
  return num
}

export default modelExtend(model, {
  namespace: 'printSet',

  state: {
    receiptTemplateTexts: [],
    templateWidth: '',
    imgUrl: '',
    configData: '',
    currentTexts: null,
    configData_temp: {},
    valueData: [],
    backups: {},
    relateNum:{}
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname == '/printSet') {
          dispatch({
            type: 'query',
            payload: {
              ...queryString.parse(location.search),
            },
          })

          dispatch({
            type: 'updateState',
            payload: {
              search: { ...queryString.parse(location.search) },
            },
          })
        }
      })
    },
  },

  effects: {
    * query ({ payload }, { put, call, select }) {
      const textData = yield call(setService.getSetting, payload)

      const valueData = yield call(setService.getTextValue, payload)

      if (!textData.success) {
        throw textData
      } else if (textData.ret_code != 1) {
        return Message.error(textData.ret_content)
      }
      textData.ret_content.missionId = payload.missionId
      const data = yield call(getTemplateText, { templateId: textData.ret_content.templateId })

      if (!data.success) {
          throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      if (!valueData.success) {
          throw valueData
      } else if (valueData.ret_code != 1) {
        return Message.error(valueData.ret_content)
      }

      const textData_temp = { ...textData.ret_content }

      // textData_temp.settingText.forEach((item)=>{
      // 	item.relateValue = ''
      // 	if(item.type == '1'){
      // 		item.relateValue = item.relateId;
      // 		item.relateId = ''
      // 	}
      // })

      let arr = {}
      textData_temp.settingText.map((item) => {
        arr[item.textId] = { ...item }
      })

      const backups = {
        settingId: textData_temp.settingId,
        templateId: textData_temp.templateId,
        name: textData_temp.name,
        offsetUp: textData_temp.offsetUp,
        offsetLeft: textData_temp.offsetLeft,
        beginNo: textData_temp.beginNo,
        status: textData_temp.status,
      }

      backups.settingText = [].concat(JSON.parse(JSON.stringify(textData_temp.settingText)))
      
      let relateNum =  {'项目':0,'金额':0,'应缴':0,'欠费':0}
      for(let value of valueData.ret_content){
        if(value.relateType == '5'){
          let name = item.relateId.split('-')[0];
          let tempNum = makeLastNum(value.relateId)
          if(relateNum[name] < tempNum){
            relateNum[name] = tempNum
          }
        }
      }
      for(let n in relateNum){
        relateNum[n]+=1
        for(let i = 0; i < relateNum[n]; i ++){
          let subRelate = numConvert(i+1)
          valueData.ret_content.push({
            type: "2",
            relateType: "5",
            relateId: `${n}-${subRelate}`,
            value: `${n}-${subRelate}`,
            label: `${n}-${subRelate}`,
            new: false, //  新的且没选中，
          })
        }
      }

      yield put({
        type: 'updateState',
        payload: {
          receiptTemplateTexts: data.ret_content.receiptTemplateTexts,
          templateWidth: data.ret_content.templateWidth,
          imgUrl: data.ret_content.imgUrl,
          configData: textData_temp,
          valueData: valueData.ret_content,
          configData_temp: arr,
          backups,
          currentTexts: payload.currentTexts,
          templateId: textData.templateId,
          relateNum
        },
      })
    },

    * updateSetting ({ payload }, { put, call, select }) {
      const { search, currentTexts } = yield select(_ => _.printSet)
      if (!payload.offsetUp) {
        payload.offsetUp = '0'
      }
      if (!payload.offsetLeft) {
        payload.offsetLeft = '0'
      }

      if (!payload.beginNo || isNaN(payload.beginNo)) {
        Message.error('请输入正确的票据起始编号')
        return
      }
      let subNum = []
      let monNum = []
      for(let index of payload.settingText){
        if(index.relateType == '5'){
          if(index.relateId.split('-')[0] == '项目'){
            subNum.push(makeLastNum(index.relateId))
          }else{
            monNum.push(makeLastNum(index.relateId))
          }
        }
      }
      for( let i = 0; i < subNum.length;){
        i++
        if(subNum.indexOf(i) < 0){
          Message.error(`请按项目顺序选填项目名称`)
          return
        }
      }
      for( let i = 0; i < monNum.length;){
        i++
        if(monNum.indexOf(i) < 0){
          Message.error(`请按金额顺序选填金额名称`)
          return
        }
      }
      const data = yield call(setService.updateSetting, payload)

      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      Message.success('保存成功')
		    yield put({
		    	type: 'query',
		    	payload: {
          ...search,
		    		currentTexts,
		    	},
		    })
    },

    * chooseRelate ({ payload }, { put, call, select }) {
      let { valueData, configData_temp, currentTexts, configData, relateNum } = yield select(_ => _.printSet)
      const value = payload.value
      let relatetype
      valueData.forEach((item) => {
        if (item.relateId == value) {
          relatetype = item.relateType
          if(item.relateType == '5'){
            item.new = true //  新的且选中
            //  判断项目和金额不可以用合并写法，不然当金额是1的时候点项目会金额加，或者点金额项目加
            let name = value.split('-')[0]
            if(makeLastNum(value) >= relateNum[name]){
              relateNum[name]+=1
              let subRelate = numConvert(relateNum[name])
              valueData.push({
                type: "2",
                relateType: "5",
                relateId: `${name}-${subRelate}`,
                value: `${name}-${subRelate}`,
                label: `${name}-${subRelate}`,
                new: false, //  新的且没选中
              })
            }
          }
        }
      })
      configData_temp[currentTexts].relateId = value
      configData_temp[currentTexts].relateType = relatetype
      configData.settingText.forEach((item) => {
        if (item.textId == currentTexts) {
          item.relateId = value
          item.relateType = relatetype
        }
      })
      yield put({
        type: 'updateState',
        payload: {
          configData,
          configData_temp,
          valueData,
          relateNum
        },
      })
    },
  },

  reducers: {},
})
