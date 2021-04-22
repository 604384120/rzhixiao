import { Message } from 'antd'
import modelExtend from 'dva-model-extend'
import { model } from 'models/common'
import queryString from 'query-string'
import { routerRedux } from 'dva/router'
import * as templateService from 'services/receipt'
import * as setService from 'services/printSet'

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
  namespace: 'template',
  state: {
    templateId: '',
    receiptTemplateTexts: [],
    deletedText:[],
    templateWidth: '',//  用来计算，不可以为零
    templateWidthTemp: '',//  用来显示票据宽度，可以为零
    fontSize: 13,
    imgUrl: '',
    currentText: null,
    imgAspect: 1,
    imgWidth: 0,
    imgHeight: 0,
    popVisible: false,
    newTextName: '',
    fileList: [],
    upLoading: false,
    rulerSize: 200,
    relateNum:{},
    valueData: [],
    configData_temp: {},
    configData: '',
    type: '1',
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname == '/template') {
          dispatch({
            type: 'query',
            payload: {
              templateId: queryString.parse(location.search).templateId,
            },
          })

          dispatch({
            type: 'updateState',
            payload: {
              templateId: queryString.parse(location.search).templateId,
            },
          })
        }
      })
    },
  },
  effects: {
    * query ({ payload }, { put, call }) {
      const textData = yield call(setService.getSetting, payload)
      if (!textData.success) {
        throw textData
      } else if (textData.ret_code != 1) {
        return Message.error(textData.ret_content)
      }
      const valueData = yield call(setService.getTextValue, payload)
      if (!valueData.success) {
        throw valueData
      } else if (valueData.ret_code != 1) {
        return Message.error(valueData.ret_content)
      }
      const textData_temp = { ...textData.ret_content }
      let tempData = {}
      let relateNum = {'项目':0,'金额':0,'应缴':0,'欠费':0}
      for(let item of textData_temp.settingText){
        tempData[item.textId] = { ...item }
        if(item.relateId && item.type == '5'){
          let name = item.relateId.split('-')[0];
          let tempNum = makeLastNum(item.relateId)
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

      const data = yield call(templateService.getTemplateText, payload)

      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      const arr = data.ret_content.receiptTemplateTexts.map((item) => {
        item.positionX = Number(item.positionX)
        item.positionY = Number(item.positionY)
        item.width = Number(item.width)
        item.height = Number(item.height)
        if(tempData[item.id]){
          if(tempData[item.id].type){
            item.type = tempData[item.id].type
          }
          if(tempData[item.id].relateType){
            item.relateType = tempData[item.id].relateType
          }
          if(tempData[item.id].relateId){
            item.relateId = tempData[item.id].relateId
          }
          if(tempData[item.id].value){
            item.value = tempData[item.id].value
          }
        }
        return item
      })

      let currentText = null
      if (arr && arr.length > 0) {
        currentText = arr[0]
      }

      let templateWidthTemp = data.ret_content.templateWidth
      let fontSize = parseInt(data.ret_content.fontSize)
      if(fontSize < 5 || isNaN(fontSize)){
        fontSize = 13
      }else if(fontSize > 20){
        fontSize = 20
      }
      let templateWidth = ''
      if(!templateWidthTemp || templateWidthTemp == '' || templateWidthTemp == '0'){
        templateWidth = '1'
      }else{
        templateWidth = templateWidthTemp
      }
      let rulerSize = 10
      if (parseInt(templateWidth) > 10) {
        rulerSize = (parseInt((parseInt(templateWidth) - 1) / 50) + 1) * 50
      } else if (!templateWidth) {
        rulerSize = 200
      }

      yield put({
        type: 'updateState',
        payload: {
          receiptTemplateTexts: arr,
          templateWidth,
          templateWidthTemp,
          fontSize,
          rulerSize,
          imgUrl: data.ret_content.imgUrl,
          currentText,
          valueData: valueData.ret_content,
          configData: textData_temp,   // 整个设置的默认数据（票据图片以下的部分）
          configData_temp: tempData, // 文本框选项map用来做比较和查找或者用来做输入文本的值value
          relateNum
        },
      })
    },

    * updateTemplateText ({ payload }, { put, call, select }) {
      let { deletedText, configData } = yield select(_ => _.template)
      if(!payload.templateWidthTemp){
        return Message.error("票据宽度不能为空")
      }
      if(payload.templateWidthTemp == '0'){
        return Message.error("票据宽度不能为0")
      }
      for(let item of payload.receiptTemplateTexts){
        if(!item['name']){
          return Message.error("文本框名称不能为空")
        }
        if(!item.subjectNo){
          delete item.subjectNo
        }
        if(!item.createDate){
          delete item.createDate
        }
        for (let key in item) {
          item[key] = String(item[key])
        }
      }
      if (!configData.beginNo || isNaN(configData.beginNo)) {
        Message.error('请输入正确的票据起始编号')
        return
      }
      payload.templateWidth = String(payload.templateWidthTemp)
      delete payload.templateWidthTemp
      if(configData.offsetUp){
        payload.offsetUp = configData.offsetUp
      }
      if(configData.offsetLeft){
        payload.offsetLeft = configData.offsetLeft
      }
      if(configData.offsetUp){
        payload.offsetUp = configData.offsetUp
      }
      payload.beginNo = configData.beginNo
      payload.printBg = configData.printBg
      let subNum = []
      let monNum = []
      for(let index of payload.receiptTemplateTexts){
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

      for(let node of deletedText){
        payload.receiptTemplateTexts.push({id: node.id,status:'0'})
      }
      payload.fontSize = payload.fontSize.toString()

      const data = yield call(templateService.updateTemplateText, payload)

      if(!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      Message.success('成功保存')

		    // yield put({
		    // 	type: 'query',
        // payload: {
        //   templateId,
        // },
		    // })

      // 跳转页面
      yield put(routerRedux.push('/receipt'))
    },
    * chooseRelate ({ payload }, { put, call, select }) {
      let { valueData, configData_temp, currentText, configData, relateNum, receiptTemplateTexts } = yield select(_ => _.template)
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

      configData_temp[currentText.id].relateId = value
      configData_temp[currentText.id].relateType = relatetype
      configData.settingText.forEach((item) => {
        if (item.textId == currentText.id) {
          item.relateId = value
          item.relateType = relatetype
        }
      })
      receiptTemplateTexts.filter((item)=>{if(item.id == currentText.id){
        item.relateId = value
        item.relateType = relatetype
        return item
      }})
      
      yield put({
        type: 'updateState',
        payload: {
          configData,
          configData_temp,
          valueData,
          relateNum,
          receiptTemplateTexts
        },
      })
    },
  },
  reducers: {},
})
