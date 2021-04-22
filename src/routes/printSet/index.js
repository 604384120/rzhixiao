import React from 'react'
import Mock from 'mockjs'
import { Row, Col, Card, Modal, Button, Input, Message } from 'antd'
import { connect } from 'dva'
import { Page } from 'components'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import PrintShow from './PrintShow'
import PrintConfig from './PrintConfig'
import styles from '../common.less'

const PrintSet = ({
  location,
  	dispatch,
  printSet,
  loading,
}) => {
  const {
    receiptTemplateTexts, imgUrl, configData, currentTexts, valueData, configData_temp,
  } = printSet

  const configProps = {
    receiptTemplateTexts,
    currentTexts,
    valueData,
    configData_temp,
    configData,
    onChangeType: (e) => {
      let value = e.target.value
      if (!configData_temp[currentTexts]) { Message.error('先选择文本框'); return }

      configData_temp[currentTexts].type = value
      configData.settingText.forEach((item) => {
        if (item.textId == currentTexts) {
          item.type = value
        }
      })

      dispatch({
        type: 'printSet/updateState',
        payload: {
          configData,
          configData_temp,
        },
      })
    },

    onChangeBeginNo: (e) => {
      configData.beginNo = e.target.value
      dispatch({
        type: 'printSet/updateState',
        payload: {
          configData,
        },
      })
    },

    onChangeText: (e) => {
      configData_temp[currentTexts].value = e.target.value
      configData.settingText.forEach((item) => {
        if (item.textId == currentTexts) {
          item.value = e.target.value
        }
      })

      dispatch({
        type: 'printSet/updateState',
        payload: {
          configData,
          configData_temp,
        },
      })
    },

    onChangePrintBg: (e) => {
      configData.printBg = e.target.checked?'1':'0'
      dispatch({
        type: 'printSet/updateState',
        payload: {
          configData,
        },
      })
    },

    onChooseRelate: (value) => {
      dispatch({
        type: 'printSet/chooseRelate',
        payload: {
          value
        },
      })
    },

    onChangeCurrent: (id) => {
      if (!configData_temp[id]) {
        configData_temp[id] = {
          id: null,
          type: '',
          relateType: null,
          relateId: '',
          value: '',
          textId: id,
        }

        configData.settingText.push(configData_temp[id])
      }
      dispatch({
        type: 'printSet/updateState',
        payload: {
          currentTexts: id,
          configData_temp,
          configData,
        },
      })
    },

    onChangeTop: (e) => {
      configData.offsetUp = e.target.value
      dispatch({
        type: 'printSet/updateState',
        payload: {
          configData,
        },
      })
    },

    onChangeLeft: (e) => {
      configData.offsetLeft = e.target.value
      dispatch({
        type: 'printSet/updateState',
        payload: {
          configData,
        },
      })
    },

    saveAll: () => {
      dispatch({
        type: 'printSet/updateSetting',
        payload: {
          ...configData,
        },
      })
    },
  }

  const showProps = {
    receiptTemplateTexts,
    imgUrl,
    currentTexts,
    onChoose: (node) => {
      const id = node.id
      if (!configData_temp[id]) {
        configData_temp[id] = {
          id: null,
          type: '',
          relateType: null,
          relateId: '',
          value: '',
          textId: id,
        }

        configData.settingText.push(configData_temp[id])
      }

      dispatch({
        type: 'printSet/updateState',
        payload: {
          currentTexts: node.id,
          configData_temp,
          configData,
        },
      })
    },
  }

  return (<Page inner className={styles.pageTemp}>
    <Row style={{minWidth: "1150px"}}>
      <div style={{width: "1150px", margin: "0 auto"}}>
        <div style={{width: '720px', display: 'inline-block', verticalAlign: 'top', paddingTop: '8px',}}>
          <div style={{margin: 'auto', left: 0, right: 0, width: '720px',}}>
            <div style={{ marginBottom: '50px' }}>
              <PrintShow {...showProps} />
            </div>
          </div>
        </div>
        <div style={{ width: '300px', display: 'inline-block', marginLeft:'40px' }}>
          <div style={{ marginLeft: '20px', width: '300px' }}>
            <PrintConfig {...configProps} />
          </div>
        </div>
      </div>
    </Row>
  </Page>)
}

export default connect(({ printSet, loading }) => ({ printSet, loading }))(PrintSet)

