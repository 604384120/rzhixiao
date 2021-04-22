import React from 'react'
import { Row, Col, Card, Modal, Button, Input, Message } from 'antd'
import { connect } from 'dva'
import { Page } from 'components'
import styles from '../common.less'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import Container from './Container'
import TemConfig from './TemConfig'
import TopRuler from './TopRuler'

const Template = ({
  location,
  dispatch,
  template,
  loading,
}) => {
  const {
    receiptTemplateTexts, templateWidth, templateWidthTemp, imgUrl, currentText, deletedText, fontSize,
    imgAspect, imgWidth, imgHeight, popVisible, newTextName, fileList, upLoading, rulerSize, configData, configData_temp, valueData,
  } = template

  const topRulerrProps = {
    rulerSize,
  }

  const containerProps = {
    currentText,
    receiptTemplateTexts,
    templateWidth,
    fontSize,
    imgUrl,
    imgWidth,
    imgHeight,
    rulerSize,
    imgload: (e) => {
      dispatch({
        type: 'template/updateState',
        payload: {
          imgAspect: e.target.height / e.target.width,
          imgWidth: e.target.width,
          imgHeight: e.target.height,
        },
      })
    },
    move: (texts, currentText) => {
      dispatch({
        type: 'template/updateState',
        payload: {
          currentText,
          receiptTemplateTexts: texts,
        },
      })
    },
    onChangeCurrentText: (textData) => {
      dispatch({
        type: 'template/updateState',
        payload: {
          currentText: textData,
        },
      })
    },
    onChangeName: (textData,value) => {
      textData.name = value
      dispatch({
        type: 'template/updateState',
      })
    },
    onDelete: (textData) => {
      for(let i=0;i<receiptTemplateTexts.length;i++){
        if(receiptTemplateTexts[i].id==textData.id){
          deletedText.push(receiptTemplateTexts[i])
          receiptTemplateTexts.splice(i,1)
          break
        }
      }
      dispatch({
        type: 'template/updateState',
        payload: {
          deletedText
        },
      })
    }
  }

  const configProps = {
    receiptTemplateTexts,
    templateWidth,
    templateWidthTemp,
    currentText,
    imgAspect,
    imgWidth,
    imgHeight,
    popVisible,
    newTextName,
    fileList,
    upLoading,
    configData,
    configData_temp,
    valueData,
    fontSize,
    onUploadImg: (file) => {
      dispatch({
        type: 'template/updateState',
        payload: {
          fileList: [file],
        },
      })
    },
    onUpload: (url) => {
      dispatch({
        type: 'template/updateState',
          payload: {
            imgUrl: url.fileName,
          },
      })
    },
    onChangeWidth: (e) => {
      let value = e.target.value
      if (parseInt(value) > 400) {
        return Message.error('票据过大')
      }
      let tempRuler = 10
      if (value > 10) {
        tempRuler = (parseInt((parseInt(value) - 1) / 50) + 1) * 50
      }
      const w = imgWidth * rulerSize * value / (templateWidth * tempRuler)
      dispatch({
        type: 'template/updateState',
        payload: {
          templateWidth: !value || value == '0'?'1':value,
          templateWidthTemp: value,
          imgWidth: w,
          imgHeight: w * imgAspect,
          rulerSize: tempRuler,
        },
      })
    },
    onChangeFontSize: (value) => {
      dispatch({
        type: 'template/updateState',
          payload: {
            fontSize: value,
          },
      })
    },
    onTextWidth: (e) => {
      let value = e.target.value
      const width = parseInt(value?value:0) / templateWidth * 100
      let current = null
      receiptTemplateTexts.filter((item)=>{
        if(item.id == currentText.id){
          item.width = width
          current = item
        }
      })
      dispatch({
        type: 'template/updateState',
        payload: {
          receiptTemplateTexts,
          currentText: current,
        },
      })
    },
    onTextHeight: (e) => {
      let value = e.target.value
      const height = parseInt(value?value:0) / (imgAspect * templateWidth) * 100
      let current = null
      receiptTemplateTexts.filter((item)=>{
        if(item.id == currentText.id){
          item.height = height
          current = item
        }
      })

      dispatch({
        type: 'template/updateState',
        payload: {
          receiptTemplateTexts,
          currentText: current,
        },
      })
    },
    onTextPosX: (value) => {
      let num = value?value:0
      const x = num / templateWidth * 100
      let current = null
      receiptTemplateTexts.filter((item)=>{
        if(item.id == currentText.id){
          item.positionX = x
          item._positionX = num
          current = item
        }
      })

      dispatch({
        type: 'template/updateState',
        payload: {
          receiptTemplateTexts,
          currentText: current,
        },
      })
    },
    onTextPosY: (value) => {
      let num = value?value:0
      const y = num / (imgAspect * templateWidth) * 100
      let current = null
      receiptTemplateTexts.filter((item)=>{
        if(item.id == currentText.id){
          item.positionY = y
          item._positionY = num
          current = item
        }
      })

      dispatch({
        type: 'template/updateState',
        payload: {
          receiptTemplateTexts,
          currentText: current,
        },
      })
    },
    changePop: (visible) => {
      dispatch({
        type: 'template/updateState',
        payload: {
          popVisible: visible,
        },
      })
    },
    onChangeName: (e) => {
      dispatch({
        type: 'template/updateState',
        payload: {
          newTextName: e.target.value,
        },
      })
    },
    onAddText: () => {
      if (!newTextName) {
        return Message.error('请输入文本框名')
      }
      const id = Date.now()

      const newData = {
        id,
        name: newTextName,
        height: 6,
        width: 20,
        positionX: 0,
        positionY: 0,
        // subjectNo: null,
        // createDate: null,
        status: 1,
        new: true,
        type: '2'
      }

      receiptTemplateTexts.push(newData)
      let item = receiptTemplateTexts[receiptTemplateTexts.length-1]
      configData_temp[item.id] = item
      dispatch({
        type: 'template/updateState',
        payload: {
          receiptTemplateTexts,
          popVisible: false,
          currentText: newData,
          newTextName: '',
          configData_temp,
        },
      })
    },
    onSelectText: (value) => {
      dispatch({
        type: 'template/updateState',
        payload: {
          currentText: receiptTemplateTexts.filter(_ => _.id == value)[0],
        },
      })
    },
    onSaveAll: () => {
      const data = [...receiptTemplateTexts]
      data.filter((item) => {
        if (item.new) {
          item.id = null
          delete item.new
        }
      })
      dispatch({
        type: 'template/updateTemplateText',
        payload: {
          receiptTemplateTexts: data,
          imgUrl,
          templateWidthTemp,
          fontSize,
          templateId: queryString.parse(location.search).templateId,
        },
      })
    },
    onCancel: () => {
      dispatch(routerRedux.push('/receipt'))
    },
    onChangeType: (e) => {
      if (!currentText) { Message.error('先选择文本框'); return }
      let value = e.target.value
      if(!configData_temp[currentText.id]){// 如果setting是空的也就是一个都没有绑定的情况下
        configData_temp[currentText.id] = {type: value}
      }
      configData_temp[currentText.id].type = value
      receiptTemplateTexts.filter((item)=>{if(item.id == currentText.id){
        item.type = value
        return item
      }})
      dispatch({
        type: 'template/updateState',
        payload: {
          configData_temp,
          receiptTemplateTexts,
        },
      })
    },
    onChooseRelate: (value) => {
      dispatch({
        type: 'template/chooseRelate',
        payload: {
          value
        },
      })
    },
    onChangeText: (e) => {
      let value = e.target.value
      if(!configData_temp[currentText.id]){
        configData_temp[currentText.id] = {type: '1', value: value}
      }
      configData_temp[currentText.id].value = value
      receiptTemplateTexts.filter((item)=>{if(item.id == currentText.id){
        item.value = value
        return item
      }})
      dispatch({
        type: 'template/updateState',
        payload: {
          configData_temp,
          receiptTemplateTexts,
        },
      })
    },
    onChangeBeginNo: (e) => {
      configData.beginNo = e.target.value
      dispatch({
        type: 'template/updateState',
        payload: {
          configData,
        },
      })
    },
    onChangeTop: (e) => {
      configData.offsetUp = e.target.value
      dispatch({
        type: 'template/updateState',
        payload: {
          configData,
        },
      })
    },

    onChangeLeft: (e) => {
      configData.offsetLeft = e.target.value
      dispatch({
        type: 'template/updateState',
        payload: {
          configData,
        },
      })
    },
    onChangePrintBg: (e) => {
      configData.printBg = e.target.checked?'1':'0'
      dispatch({
        type: 'template/updateState',
        payload: {
          configData,
        },
      })
    },
  }

  return (<Page inner className={styles.pageTemp}>
    <Row style={{minWidth: "1150px"}}>
      <div style={{width: "1150px", margin: "0 auto"}}>
        <div style={{width:'720px', display: 'inline-block', verticalAlign: 'top', paddingTop: '8px', marginLeft:'10px'}}>
          <div style={{margin: 'auto', left: 0, right: 0, width: '720px'}}>
            <div style={{ marginBottom: '50px' }}>
              <TopRuler {...topRulerrProps} />
              <Container {...containerProps} />
            </div>
          </div>
        </div>
        <div style={{ width: '300px', display: 'inline-block', marginLeft:'40px' }}>
          <div style={{ marginLeft: '20px', width: '300px' }}>
            <TemConfig {...configProps} />
          </div>
        </div>
      </div>
    </Row>
  </Page>)
}

export default connect(({ template, loading }) => ({ template, loading }))(Template)
