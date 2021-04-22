import React from 'react'
import { Row, Col, Card, Button, Input } from 'antd'
import { Page } from 'components'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import UserTable from './UserTable'
import UserModal from './UserModal'

const Search = Input.Search

const CreditClass = ({
  location,
  dispatch,
  creditClass,
  loading,
  app,
}) => {
  const { isNavbar } = app
  const {
    list, searchName, dataLoading, modalVisible, modalImportData
  } = creditClass
  const { user } = app
  const userTableProps = {
    dataSource: list,
    searchName,
    dataLoading,
    isAdmin:user.isAdmin,
    onUpdateDataSource (data) {
      dispatch({
        type: 'creditClass/updateState',
        payload: {
          list: data,
        },
      })
    },
    onAddCreditClass (data) {
      dispatch({
        type: 'creditClass/addCreditClass',
        payload: {
          data
        },
      })
    },
    onSaveCreditClass (data) {
      dispatch({
        type: 'creditClass/updateCreditClass',
        payload: {
          data
        },
      })
    },
    onDeleteCreditClass (data) {
      dispatch({
        type: 'creditClass/deleteCreditClass',
        payload: {
          data
        },
      })
    },
  }

  const userModalProps = {
    modalImportData, modalVisible,
    onClose () {
      dispatch({
        type: 'creditClass/updateState',
        payload: {
          modalVisible: false,
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'creditClass/updateState',
        payload: {
         ...data
        },
      })
    },
    onImportConfirm (data) {
      if(!modalImportData.excel){
        message.error('请选择文件');
        return;
        }
        dispatch({
          type: 'creditClass/importCreditClass',
          payload: {
            file:modalImportData.excel.fileName,
            timer: setInterval(() => {
              dispatch({
                type: 'creditClass/getImportCreditClassPrs'
              })
            }, 1500)
          },
        })
    },
    onImportCover (data) {
      dispatch({
        type: 'creditClass/coverCreditClass',
        payload: {
          ...data,
          timer:setInterval(() => {
            dispatch({
              type: 'creditClass/getImportCreditClassPrs'
            })
          }, 1500)
        },
      })
    },
  }

  const handleOnAdd = () => {
    if (list.length == 0 || !list[0]._add) {
      const newSub = {
        id: '',
        name: '',
        property: '',
        status: '1',
        type: '',
        _editable: true,
        _add: true,
        _tempSource: {
          id: '',
          name: '',
          status: '1',
        },
      }
      list.unshift(newSub)
      dispatch({
        type: 'creditClass/updateState',
        payload: {
          list,
        },
      })
    }
  }

  const handleOnSearch = (value) => {
    dispatch({
      type: 'creditClass/updateState',
      payload: {
        searchName: value
      },
    })
  }

  const handleShowImport = () => {
    dispatch({
      type: 'creditClass/updateState',
      payload: {
        modalVisible: true,
        modalImportData:{
          step:0,
          importing: false,
          covering: false,
        }
      },
    })
  }

  return (
    <Page inner>
      <Row gutter={16}>
        <Col>
          <Card bordered={false} bodyStyle={{ padding: ' 0' }}>
            <Row style={{marginBottom:'20px'}}>
              {user.isAdmin == '1' && <Button icon="plus" onClick={() => { handleOnAdd() }} type="primary" style={{marginBottom:isNavbar?'10px':undefined}} >添加课程</Button>}
              {user.isAdmin == '1' && <Button style={{ marginLeft: '15px' }} onClick={handleShowImport}>课程导入</Button>}
              <Search enterButton placeholder="搜索" onSearch={value => handleOnSearch(value)} style={{ width: isNavbar?'100%':200, float: 'right' }} />
            </Row>
            <UserTable {...userTableProps} />
          </Card>
        </Col>
      </Row>
      { modalVisible && <UserModal {...userModalProps} /> }
    </Page>
  )
}

CreditClass.propTypes = {
  creditClass: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default connect(({ creditClass, app, loading }) => ({ creditClass, app, loading }))(CreditClass)

