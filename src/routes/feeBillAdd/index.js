import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm, Card, Input, message, Divider, Select, Spin, Message, Modal, Icon } from 'antd'
import QueueAnim from 'rc-queue-anim'
import { Page, Print, UserSort, UserDisplay, UserSortLayer, SortSelect } from 'components'
import UserTable from './UserTable'
import UserBillModal from './UserBillModal'
import styles from '../common.less'
import queryString from 'query-string'
import qs from 'qs'
import { getFormat } from 'utils'
import Error from './../error'

const Search = Input.Search
const Option = Select.Option

const FeeBillAdd = ({
  location, dispatch, feeBillAdd, loading, app
}) => {
  const {
    modalVisible,  modalPayType, subjectList, modalEditData,
    sortSence, displaySence, userSortExtra,
    missionId,
    pageNum,
    pageSize,
    count,
    userList,
    searchName,
    dataLoading,
    feeBillError,
    selectedUsers,
    selectedAll,
    sortFlag,
  } = feeBillAdd

  const { user,userAttrList, userAttrMap, userDisplaySence } = app
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}

  const queryParam = {
    pageNum,
    pageSize,
    key: searchName,
    sortList: userSortList,
  }

  const userDisplayProps = {
    userAttrList,
    ...userDisplaySence[displaySence],
    onUpdateState (data) {
      userDisplaySence[displaySence] = {...userDisplaySence[displaySence], ...data}
      dispatch({
        type: 'app/updateState',
        payload: {
          userDisplaySence
        },
      })
    },
    onReset () {
      dispatch({
        type: 'app/resetDisplay',
        payload:{sence:displaySence, displayExtra:userSortExtra}
      })
    },
    onUpdate (data) {
      dispatch({
        type: 'app/updateDisplay',
        payload: {
          displayListTemp:data,
          sence: displaySence,
        },
      })
    },
  }

  const userSortProps = {
    userAttrList,
    ...userDisplaySence[sortSence],
    displayExtra: userSortExtra,
    onUpdateState (data) {
      const {userDisplaySence} = app
      userDisplaySence[sortSence] = {...userDisplaySence[sortSence], ...data}
      dispatch({
        type: 'app/updateState',
        payload: {
          userDisplaySence
        },
      })
    },
    
    onReset () {
      dispatch({
        type: 'app/resetDisplay',
        payload:{sence:sortSence, displayExtra:userSortExtra}
      })
    },
    onUpdate (data) {
      dispatch({
        type: 'app/updateDisplay',
        payload: {
          displayListTemp:data,
          sence: sortSence,
        },
      })
    },
  }
  
  const structSelectProps = {
    dataLoading,
    userSortMap,
    userAttrMap,
    styles,
    onGetSelectList (data) {
      dispatch({
        type: 'app/getAttrRelateList',
        payload: {
          ...data
        },
      })
    },

    onChangeSort (value, attr) {
      dispatch({type: 'feeBillAdd/updateSort'})  // 加蒙版
    },
  }

  const handleSearchUser = (value) => {
    queryParam.pageNum = 1
    if (value || searchName) {
      dispatch({
        type: 'feeBillAdd/getUserList',
        payload: {
          ...queryParam,
          key: value,
        },
      })
    }
  }

  const userTableProps = {
    dataSource: userList,
    count,
    pageNum,
    pageSize,
    userDisplayList,
    userDisplayMap,
    userAttrMap,
    dataLoading,
    selectedUsers,
    selectedAll,
    onChangePage (n, s) {
      dispatch({
        type: 'feeBillAdd/getUserList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'feeBillAdd/updateState',
        payload: {
          ...data,
        },
      })
    },
    onShowModal (id) {
      let modalEditData = {}
      modalEditData.userId = [id]
      dispatch({
        type: 'feeBillAdd/showModal',
        payload: {
          modalEditData
        },
      })
    },
  }

  const userBillModalProps = {
    modalEditData,  modalPayType, modalVisible,
    dataSource: subjectList,user,
    onClose () {
      dispatch({
        type: 'feeBillAdd/updateState',
        payload: {
          modalVisible: false,
          modalType: '',
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'feeBillAdd/updateState',
        payload: {
         ...data
        },
      })
    },
    onUpdateBills (data) {
      dispatch({
        type: 'feeBillAdd/updateBills',
        payload: {
          ...queryParam,
          selectedUsers:modalEditData.userId,
          subjectList: data,
        },
      })
    },
  }

  const handleChangeSearchName = (value) => {
    dispatch({
      type: 'feeBillAdd/updateState',
      payload: {
        searchName: value.target.value
      },
    })
  }

  const handleResetQuery = () => {
    for (let sort of userSortList) {
      if (sort._idSelected) {
        sort._idSelected = []
      }
    }
    dispatch({type: 'feeBillAdd/updateState'})
  }

  const handleQuery = () => {
    dispatch({
      type: 'feeBillAdd/getUserList',
      payload: {
        ...queryParam,
      },
    })
  }

  const handleShowDerateBatch = () => {
    let modalEditData = {}
    if(!selectedAll && selectedUsers && selectedUsers.length>0){
      let userId = []
      for(let index of selectedUsers){
        userId.push(userList[index].id)
      }
      modalEditData.userId = userId
    }
    dispatch({
      type: 'feeBillAdd/showModal',
      payload: {
        modalEditData
      },
    })
  }

  const createSort = () => {
    let i = 0
    const list = []
    for(let attr of userSortList){
      list.push({
        id:i++,
        content:(<SortSelect {...{...structSelectProps, attr}}/>)})
      }
      return list
  }
  const layerProps = {
    list: createSort(),
    query:(<div className={styles.queryBox}>
        <Button className={styles.inquery} type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQuery}>{dataLoading?'':'查询'}</Button>
				<Button className={styles.reset} onClick={handleResetQuery} disabled={dataLoading}>重置</Button>
				<UserSort {...userSortProps} className={styles.more}/>
    </div>),
  }
  return (
    feeBillError ? <Error /> :
    <Page inner>
      {sortFlag&&<div className={styles.masking} ></div>}
      <Row gutter={16}>
        <Col>
          <Card bordered={false} bodyStyle={{ padding: ' 0' }}>
            <div>
            <Divider style={{ margin: '5px' }} dashed />
            <UserSortLayer {...layerProps}/>
            <Divider style={{ margin: '5px' }} dashed />
            <Row style={{ marginBottom: '5px' }}>
              <Button type="primary" style={{ marginRight: '15px' }} disabled={selectedUsers.length == 0} onClick={handleShowDerateBatch}>批量调整</Button>
              <Search enterButton placeholder="搜索" value={searchName} onSearch={value => handleSearchUser(value)} onChange={(value)=>{handleChangeSearchName(value)}} style={{ float: 'right', width: '200px' }} />
              <UserDisplay {...userDisplayProps} />
            </Row>
            <Row style={{color:'#1890ff', visibility:selectedUsers.length>0?'visible':'hidden',fontSize:'12px'}}>
              <Icon type="check" style={{marginLeft:'5px'}}/> 当前已选择{selectedAll?count:(selectedUsers.length?selectedUsers.length:'0')}条记录
            </Row>
            <Row><UserTable {...userTableProps} /></Row>
            </div>
          </Card>
        </Col>
      </Row>
      { modalVisible && <UserBillModal {...userBillModalProps} /> }
    </Page>
  )
}

FeeBillAdd.propTypes = {
  feeBillAdd: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ feeBillAdd, app, loading }) => ({ feeBillAdd, app, loading }))(FeeBillAdd)
