import React from 'react'
import Mock from 'mockjs'
import { Row, Col, Card, Button, Input } from 'antd'
import { connect } from 'dva'
import { Page } from 'components'
import styles from './index.less'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import ReceiptTable from './ReceiptTable'
import ReceiptModal from './ReceiptModal'

const Search = Input.Search

const Receipt = ({
  location,
  dispatch,
  receipt,
  app,
  loading,
}) => {
  const { templateList, name, visible, text, record } = receipt
  const { menuMap,isNavbar } = app
  const searchTem = (value) => {
    dispatch({
      type: 'receipt/updateState',
      payload: {
        name: value,
      },
    })
    dispatch({
      type: 'receipt/query',
      payload: {
        name: value,
      },
    })
  }


  const addItem = () => {
    const newItem = {
      id: '',
      name: '',
      createDate: '',
      code: '',
      status: '1',
      imgUrl: '',
      width: '',
      digits: '',
      numCopies: '',
      numRelates: '',
      _add: true,
      _editable: true,
      _change: {},
    }

    if (templateList.length == 0 || !templateList[0]._add) {
      templateList.unshift(newItem)
      dispatch({
        type: 'receipt/updateState',
        payload: {
          templateList,
        },
      })
    }
  }

  const tableProps = {
    templateList,
    text,
    menuMap,
    onDesignTemp: (record) => {
      dispatch(routerRedux.push({
        pathname: 'template',
        search: queryString.stringify({
		            templateId: record.id,
		        }),
      }))
    },
    onUpdataState: (data) => {
      dispatch({
        type: 'receipt/updateState',
        payload: {
          ...data
        },
      })
    },
    onEdit: (record) => {
      let i
      templateList.map((item, index) => {
        if (item.id == record.id) {
          i = index
        }
      })
      templateList[i]._editable = true
      templateList[i]._change = {}
      dispatch({
        type: 'receipt/updateState',
        payload: {
          templateList,
        },
      })
    },
    onSave: (record) => {
      let data = {
        code: record._change.code?record._change.code:record.code,
        // digits: record._change.digits?record._change.digits:record.digits,
        name: record._change.name?record._change.name:record.name,
        // numCopies: record._change.numCopies?record._change.numCopies:record.numCopies,
        // numRelates: record._change.numRelates?record._change.numRelates:record.numRelates,
        status: record.status
      }
      if (record.id) {
        data.id = record.id;
        dispatch({
          type: 'receipt/updateTemplateList',
          payload: {
            ...data,
          },
        })
      } else {
        dispatch({
          type: 'receipt/addTemplateList',
          payload: {
            ...data,
          },
        })
      }
    },
    onCancel: (record) => {
      let i
      templateList.map((item, index) => {
        if (item.id == record.id) {
          i = index
        }
      })
      if (record.id) {
        delete templateList[i]._editable
      } else {
        templateList.splice(0, 1)
      }

      dispatch({
        type: 'receipt/updateState',
        payload: {
          templateList,
        },
      })
    },
    onShowModal: (visible,text,record) => {
      dispatch({
        type: 'receipt/updateState',
        payload: {
          visible,
          text,
          record
        },
      })
    },
  }

  const modalProps = {
    visible,
    record,
    onhandleClose : (visible) => {
      dispatch({
        type: 'receipt/updateState',
        payload: {
          visible : !visible
        },
      })
    },

    onSubmit (visible,datas) {
      let data = {
        id : datas.id,
        name : datas.name,
        status : datas.status,
        info : JSON.stringify(datas.info)
      }
      dispatch({
        type: 'receipt/updateTemplateList',
        payload: {
          ...data
        },
      })
      dispatch({
        type: 'receipt/updateState',
        payload: {
          visible : visible
        },
      })
    }
  }
  


  return (<Page inner>
    <Row>
      <Button type="primary" onClick={addItem} icon="plus" style={{marginBottom:'10px' }}>添加</Button>
      <Search
        placeholder="输入名称进行搜索"
        onSearch={value => searchTem(value)}
        style={{ width: isNavbar?'100%':300, float: 'right' }}
        enterButton
      />
    </Row>
    <ReceiptTable {...tableProps} />
      
      {visible&&<ReceiptModal {...modalProps}></ReceiptModal>}
      
  </Page>)
}

export default connect(({ receipt, loading, app }) => ({ receipt, loading, app }))(Receipt)
