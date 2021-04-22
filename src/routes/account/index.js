import { Tree } from 'antd'
import React from 'react'
import Mock from 'mockjs'
import { Row, Col, Card, Button, Modal, notification, message, Input } from 'antd'
import { Page } from 'components'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import SchoolTree from './SchoolTree'
import SchoolTable from './SchoolTable'
import SchoolModal from './SchoolModal'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import PrivilegeTree from './PrivilegeTree'
// import styles from './index.less'
import styles from '../common.less'

const Search = Input.Search

const Account = ({
  location,
  dispatch,
  account,
  loading,
  app,
}) => {
  const {
    modalVisible, modalType, accountList, count, pageNum, pageSize, dataLoading, accountSelected, departs,
    departSelected, searchName, modalAccount, modalDepart,userAttrList, userAttrMap, mgrAttrList, editable
  } = account
  const { user, requestMap } = app

  const departTree = requestMap['departTree']
  const departMap = requestMap['departMap']
  const privilegeTree = requestMap['privilegeTree']

  const SchoolTreeProps = {
    departTree,
    schoolName: user.schoolName,
    departs,
    user,
    onSelectDepart (data) {
      if (data == '0') {
        dispatch({
          type: 'account/updateState',
          payload: {
            departs: [],
          },
        })
        dispatch({
          type: 'account/selectDepart',
          payload: {
            id: data,
          },
        })
        return
      }

      const arr = []
      arr.push(data)
      dispatch({
        type: 'account/updateState',
        payload: {
          departs: arr,
        },
      })
      dispatch({
        type: 'account/selectDepart',
        payload: {
          id: data,
        },
      })
    },
    onAddDepart (data) {
      dispatch({
        type: 'account/showModal',
        payload: {
          modalType: 'addDepart',
          modalDepart: data,
        },
      })
    },
    onEditDepart (data) {
      dispatch({
        type: 'account/showModal',
        payload: {
          modalType: 'editDepart',
          modalDepart: data,
        },
      })
    },
    onDeleteDepart (data) {
      const key = `open${Date.now()}`
      const btn = (<Button type="primary" size="small" onClick={() => { deleteMe(key) }}>确定</Button>)
      notification.open({
        message: '确认删除',
        description: `是否删除所选中的层级：${data.label}`,
        btn,
        key,
      })

      const deleteMe = () => {
        dispatch({
          type: 'account/deleteMgrDepart',
          payload: {
            id: data.id,
          },
        })
        notification.close(key)
      }
    },
  }

  const SchoolTableProps = {
    dataSource: accountList,
    // loading: loading.effects['account/query'],
    count,
    pageNum,
    pageSize,

    shortName: user.shortName,
    dataLoading,
    accountSelected,
    onResetPwd (data) {
      dispatch({
        type: 'account/showModal',
        payload: {
          modalAccount: data,
          modalType: 'resetPwd',
        },
      })
    },
    onDataAccess  (data) {
      dispatch({
        type: 'account/showDataAccess',
        payload: {
          ...data
        },
      })
    },
    onDeleteUser (id) {
      dispatch({
        type: 'account/deleteMgrAccount',
        payload: {
          id,
        },
      })
    },
    onEditUser (data) {
      dispatch({
        type: 'account/showModal',
        payload: {
          modalAccount: data,
          modalType: 'update',
        },
      })
    },
    onChange (n, s) {
      dispatch({
        type: 'account/getMgrAccountList',
        payload: {
          pageNum: n,
          pageSize: s,
          departId: departSelected ? departSelected.id : '',
          key: searchName,
        },
      })
    },
    onSelectAccount (data) {
      message.success(`当前选择的是：${data.departName}/${data.loginName}@${user.shortName}`)
      dispatch({
        type: 'account/updateState',
        payload: {
          accountSelected: data,
        },
      })
    },
  }

  const ModalProps = {
    modalVisible,
    departTree,
    departMap,
    departSelected,
    schoolName: user.schoolName,
    shortName: user.shortName,
    modalAccount,
    modalDepart,
    modalType,
    userAttrList,
    userAttrMap,
    dataSource:mgrAttrList,
    dataLoading,
    onSubmit (data) {
      if (modalType == 'resetPwd') {
        dispatch({
          type: 'account/resetPwd',
          payload: {
            id: data.id,
            password: data.password,
          },
        })
        dispatch({
          type: 'account/hideModal',
        })
      } else if (modalType == 'add' || modalType == 'update') {
        dispatch({
          type: 'account/updateMgrAccount',
          payload: {
            ...data,
          },
        })
        dispatch({
          type: 'account/hideModal',
        })
      } else if (modalType == 'addDepart') {
        dispatch({
          type: 'account/updateMgrDepart',
          payload: {
            ...data,
          },
        })

        dispatch({
          type: 'account/hideModal',
        })
      } else if (modalType == 'editDepart') {
        dispatch({
          type: 'account/updateMgrDepart',
          payload: {
            ...data,
          },
        })

        dispatch({
          type: 'account/hideModal',
        })
      }
    },
    onClose () {
      dispatch({
        type: 'account/hideModal',
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'account/updateState',
        payload: {
          ...data
        }
      })
    },
    onGetAttrRelateList (record, key) {
      dispatch({
        type: 'account/getAttrRelateList',
        payload: {
          id:record.id,
          attrId: record.attrId,
          key,
        }
      })
    },
    onDeleteAttr (record) {
      dispatch({
        type: 'account/deleteMgrAttr',
        payload: {
          attrId:record.attrId,
          id:record.id,
          accountId:modalAccount.id
        }
      })
    },
    onUpdateAttr (record) {
      dispatch({
        type: 'account/updateMgrAttr',
        payload: {
          id:record.id=="_add"?"":record.id,
          attrId: record.attrId,
          relateName:record._idSelected.toString(),
          accountId:modalAccount.id
        }
      })
    },
  }

  const PrivilegeTreeProps = {
    privilegeTree,
    departSelected,
    accountSelected,
    shortName: user.shortName,
    editable,
    onChangeAccountPrivilege (keys, data) {
      // const departId = departSelected ? departSelected.id : ''
      // const id = accountSelected ? accountSelected.id : ''
      if (accountSelected) {
        accountSelected._privilegeList = keys
      } else if (departSelected) {
        departSelected._privilegeList = keys
      }
      dispatch({
        type: 'account/updateState',
        payload: {
        }
      })
      //const key = `open${Date.now()}`
      //const btn = (<Button type="primary" size="small" onClick={() => { deleteMe(key) }}>确定</Button>)
      // let desc = '是否修改'
      // if (accountSelected) {
      //   desc += `用户[${accountSelected.loginName}`
      // } else {
      //   desc += `部门[${departSelected.name}`
      // }
      // desc += ']的权限'
      // notification.open({
      //   message: '确认权限修改',
      //   description: desc,
      //   btn,
      //   key,
      // })

      // const deleteMe = () => {
      //   dispatch({
      //     type: 'account/updateMgrPrivilege',
      //     payload: {
      //       privilegeList: keys,
      //       departId,
      //       id,
      //     },
      //   })
      //   notification.close(key)
      // }
    },
    onEdit(){
      dispatch({
        type: 'account/updateState',
        payload: {
          editable: true
        }
      })
    },
    onCancel(){
      if (accountSelected) {
        accountSelected._privilegeList = undefined
      } else if (departSelected) {
        departSelected._privilegeList = undefined
      }
      dispatch({
        type: 'account/updateState',
        payload: {
          editable: false,
        }
      })
    },
    onSubmit(){
      let keys = []
      const departId = departSelected ? departSelected.id : ''
      const id = accountSelected ? accountSelected.id : ''
      if(accountSelected){
        keys = accountSelected._privilegeList
      }else if(departSelected){
        keys = departSelected._privilegeList
      }
      if(!keys){
        //没有任何改动
        dispatch({
          type: 'account/updateState',
          payload: {
            editable: false,
          }
        })
        return
      }
      dispatch({
        type: 'account/updateMgrPrivilege',
        payload: {
          privilegeList: keys,
          departId,
          id,
        },
      })
    }
  }

  const handleSearch = (name) => {
    if (name || searchName) {
      dispatch({
        type: 'account/getMgrAccountList',
        payload: {
          pageNum: 1,
          pageSize,
          departId: departSelected ? departSelected.id : '',
          key: name,
        },
      })
    }
  }

  const handleAddAccount = () => {
    dispatch({
      type: 'account/showModal',
      payload: {
        modalAccount: {},
        modalType: 'add',
      },
    })
  }

  return (
    <Page inner>
       {editable&&<div className={styles.masking}></div>}
      <div className={styles['table-panel']}>
        <div className={`${styles['table-cell']} ${styles['table-left']}`}>
          <Card bordered={false}
            bodyStyle={{
                padding: '0px',
              }}
          >
            <SchoolTree {...SchoolTreeProps} />
          </Card>
        </div>
        <div className={`${styles['table-cell']} ${styles['table-center']}`}>
          <Card bordered={false}
            bodyStyle={{
                padding: ' 0',
              }}
          >
            <Row>
              <Button icon="plus" onClick={() => { handleAddAccount() }} type="primary" style={{ marginBottom: '10px' }} >添加账号</Button>
              <Search enterButton placeholder="搜索" onSearch={value => handleSearch(value)} style={{ width: '250px', float: 'right' }} />
            </Row>
            <Row style={{ overflowY:'scroll' }}>
              <div style={{minWidth:'400px'}}><SchoolTable {...SchoolTableProps} /></div>
            </Row>
          </Card>
        </div>
        <div className={`${styles['table-cell']} ${styles['table-right']}`} style={{zIndex:'810',position:'relative'}}>
          <Card bordered
            bodyStyle={{
                padding: '0',

              }}
          >
            <PrivilegeTree {...PrivilegeTreeProps} />
          </Card>
        </div>
      </div>
      { modalVisible && <SchoolModal {...ModalProps} /> }
    </Page>
  )
}

Account.propTypes = {
  account: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default connect(({ account, app, loading }) => ({ account, app, loading }))(Account)
