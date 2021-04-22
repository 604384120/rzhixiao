import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Dropdown, Card, Input, Menu, Divider, Select, Spin, Icon } from 'antd'
import { Page, UserSort, UserDisplay, UserSortLayer, SortSelect } from 'components'
import SchoolTree from './SchoolTree'
import UserTable from './UserTable'
import UserModal from './UserModal'
import DelModal from './DelModal'
import styles from '../common.less'
import queryString from 'query-string'
import { config, getSortParam, token } from 'utils'

const { api } = config
const Search = Input.Search
const Option = Select.Option

const User = ({
  location, dispatch, user, loading, app
}) => {
  const { isNavbar } = app
  const {
    modalVisible, modalData, modalType, tempTypeMap, typeMap, version, versionType,
    displaySence, sortSence, userSortExtra,
    pageNum,
    pageSize,
    count,
    userList,selectedUsers,selectedAll,
    searchName,
    dataLoading,
    disabledAttr,
    departTree, departMap,
    selectedDepart,
    depart,
    sortFlag,
    modalImpDelData,
  } = user


  const users = app.user
  const { userDisplaySence, userAttrList, userAttrMap } = app
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}

  const queryParam = {
    pageNum,
    pageSize,
    key: searchName,
    sortList: userSortList,
    version,
    depart,
  }
  const SchoolTreeProps = {
    departTree,
    schoolName: users.schoolName,
    selectedDepart,
    users,
    userSortMap,
    onSelectDepart (data) {
      if (data.id == '0') {
        dispatch({
          type: 'user/updateState',
          payload: {
            selectedDepart: []
          },
        })
        queryParam.depart = undefined
        dispatch({
          type: 'user/getUserList',
          payload: {
            ...queryParam
          },
        })
        return
      }
      
      dispatch({
        type: 'user/updateState',
        payload: {
          selectedDepart:[data.id]
        },
      })
      queryParam.depart = {
        attrId:data.attrId,
        relateId: data.id
      }
      dispatch({
        type: 'user/getUserList',
        payload: {
          ...queryParam
        },
      })
    },
    onLoadStructItem (data, callback) {
      dispatch({
        type: 'user/getStructItemList',
        payload: {
          pid: data.id,
          callback
        },
      })
    }
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
      dispatch({type: 'user/updateSort'})  // 加蒙版
    },
  }

  const handleSearchUser = (value) => {
    queryParam.pageNum = 1
    if (value || searchName) {
      dispatch({
        type: 'user/getUserList',
        payload: {
          ...queryParam,
          key: value,
        },
      })
    }
  }

  const handleChangeSearchName = (value) =>{
    dispatch({
      type: 'user/updateState',
      payload: {
        searchName: value.target.value
      },
    })
  }

  const userTableProps = {
    dataSource: userList,
    count,
    pageNum,
    pageSize,
    userDisplayList,
    userDisplayMap,
    userAttrMap,
    selectedUsers,
    selectedAll,
    dataLoading,
    onChangePage (n, s) {
      dispatch({
        type: 'user/getUserList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
        },
      })
    },
    onEditUser (data) {
      dispatch(routerRedux.push({
        pathname: '/userInfo',
        search: queryString.stringify({
          id: data.id,
        }),
      }))
    },
    onDelete (data) {
      dispatch({
        type: 'user/deleteUserInfo',
        payload: {
          id: data.id,
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'user/updateState',
        payload: {
          ...data,
        },
      })
    },
  }

  const userModalProps = {
    modalVisible,
    modalData,
    modalType,
    tempTypeMap,
    typeMap,
    attrMap: userAttrMap,
    disabledAttr,
    departTree,departMap,
    selectedUsers,
    selectedAll,
    queryParam,
    count,
    onSubmit (data) {
      dispatch({
        type: 'user/updateState',
        payload: {
          modalVisible:false,
          dataLoading: true
        },
      })
      dispatch({
        type: 'user/updateUserInfo',
        payload: {
          ...data,
        },
      })
    },

    onClose () {
      dispatch({
        type: 'user/hideModal',
      })
    },

    onUpdateState (data) {
      dispatch({
        type: 'user/updateState',
        payload: {
          ...data,
        },
      })
    },

    onGetUserAttrValue (data) {
      dispatch({
        type: 'user/getUserAttrValue',
        payload: {
          ...data,
        },
      })
    },

    onLoadStructItem (data) {
      dispatch({
        type: 'user/getStructItemList',
        payload: {
          pid: data.id
        },
      })
    }
  }

  const delModalProps = {
    modalImpDelData,
    onClose () {
      modalImpDelData.modalVisible = false
      dispatch({
        type: 'user/updateState',
        payload: {
          modalImpDelData
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'user/updateState',
        payload: {
          modalImpDelData:data
        },
      })
    },
    onImportConfirm (data) {
      if(!modalImpDelData.excel){
        message.error('请选择文件');
        return;
      }
      dispatch({
        type: 'user/importUserDelete',
        payload: {
          file:modalImpDelData.excel.fileName,
          timer: setInterval(() => {
            dispatch({
              type: 'user/getImportUserPrs'
            })
          }, 1500)
        },
      })
    },
  }

  const handleAddUser = () => {
    let modalData = {}
    dispatch({
      type: 'user/showModalAddUser',
      payload: {
        modalData,
      },
    })
  }

  const handleUpdateStruct = () => {
    let modalData = {}
    dispatch({
      type: 'user/showModalAddUser',
      payload: {
        modalData,
        modalType:'updateStruct'
      },
    })
  }

  const handleUpdateStatus = () => {
    let modalData = {}
    dispatch({
      type: 'user/showModalAddUser',
      payload: {
        modalData,
        modalType:'updateStatus'
      },
    })
  }

  const handleImportUser = () => {
    dispatch(routerRedux.push({
      pathname: '/userImport',
    }))
  }

  const getExportUrl = () => {
    let tempParam = {...queryParam};
    let tempList = getSortParam(tempParam.sortList)
    if(tempParam.depart){
      tempList.push(tempParam.depart)
    }
    if(tempList.length>0){
      tempParam.sortList = JSON.stringify(tempList);
    }else{
      tempParam.sortList = null;
    }
    if(token()){
      tempParam.token = token()
    }

    delete tempParam.pageNum
    delete tempParam.pageSize
    delete tempParam.version
    delete tempParam.depart
    tempParam.sence = "userDisplay"
    let url = api.exportUser + '?' + queryString.stringify(tempParam)
    return url
  }

  const handleResetQuery = () => {
    for (let sort of userSortList) {
      if (sort._idSelected) {
        sort._idSelected = []
      }
    }
    dispatch({
      type: 'user/updateSort',
      payload: {
        userSortList,
      },
    })
  }

  const handleQuery = () => {
    dispatch({
      type: 'user/getUserList',
      payload: {
        ...queryParam,
      },
    })
  }

  const handleShowImport = () => {
    modalImpDelData.modalVisible = true
    modalImpDelData.step = 0
    dispatch({
      type: 'user/updateState',
      payload: {
        modalImpDelData:{
          modalVisible : true,
          step : 0
        }
      },
    })
  }

  const nameMap = {
    2: '更新',
    3: '添加',
    4: '删除',
  }

  const createSort = () => {
    let i = 0
    const list = []
      for(let attr of userSortList){
        i++
        list.push({
          id:i,
          content:(<SortSelect {...{...structSelectProps, attr}}/>)})
        }
      return list
  }

  const layerProps = {
    list: createSort(),
    query:(<div className={styles.queryBox} >
        <Button className={styles.inquery} type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQuery} >{dataLoading?'':'查询'}</Button>
        <Button className={styles.reset} onClick={handleResetQuery} disabled={dataLoading} >重置</Button>
        <UserSort {...userSortProps} className={styles.more} />
    </div>),
  }

  return (
    <Page inner>
    {sortFlag&&<div className={styles.masking}></div>}
      <Row gutter={16}>
        <Col>
          <Card bordered={false} bodyStyle={{ padding: ' 0' }}>
            {
                version && <Row style={{ padding: '5px', fontSize: '14px' }}><span>学生{nameMap[versionType]}操作记录(操作时间：{version})</span></Row>
              }

            <Divider style={{ margin: '5px' }} dashed />
            <UserSortLayer {...layerProps}/>
            <Divider style={{ margin: '5px' }} dashed />
            <Row>
              <div style={{width:'240px',float:'left'}}>
                  <SchoolTree {...SchoolTreeProps} />
              </div>
              <div style={{width:"calc(100% - 240px)",float:'left'}}>
                <div style={{marginLeft: '10px'}}>
                <Row>
                  {!version && <Button icon="plus" type="primary" style={{ marginRight: '5px',marginBottom:'5px' }} onClick={handleAddUser}>添加学生</Button>}
                  {!version && <Dropdown
                  disabled={selectedUsers.length == 0}
					        overlay={
                  <Menu>
                    <Menu.Item key="1"><a onClick={(e)=>{e.stopPropagation();handleUpdateStruct()}}>批量修改班级</a></Menu.Item>
                    <Menu.Item key="2"><a onClick={(e)=>{e.stopPropagation();handleUpdateStatus()}}>批量修改状态</a></Menu.Item>
                  </Menu>}>
              <Button type="primary" style={{ marginRight: '5px',marginBottom:'5px' }} disabled={selectedUsers.length == 0&&!selectedAll}>批量修改学籍</Button></Dropdown>}
                  {!version && <Button style={{ marginRight: '5px',marginBottom:'5px' }} onClick={handleImportUser}>批量导入</Button>}
                  {!version && <Button style={{ marginRight: '5px',marginBottom:'5px' }} target="_blank" href={getExportUrl()}>导出</Button>}
                  {<Button style={{ marginRight: '5px',marginBottom:'5px' }} onClick={handleShowImport} >导入删除</Button>}
                  <div style={{width: isNavbar?'100%':'240px',display:'inline-blck',float: 'right'}}>
                    <Search enterButton placeholder="搜索" value={searchName} onChange={(value)=>{handleChangeSearchName(value)}} onSearch={value => handleSearchUser(value)} style={{ float: 'right', width: 'calc(100% - 50px)' }} />
                    <UserDisplay {...userDisplayProps} />
                  </div>
                </Row>
                <Row style={{color:'#1890ff', visibility:selectedUsers.length?'visible':'hidden',fontSize:'12px'}}>
                  <Icon type="check" style={{marginLeft:'5px'}}/> 当前已选择{selectedAll?count:(selectedUsers.length?selectedUsers.length:'0')}条记录
                </Row>
                <Row><UserTable {...userTableProps} /></Row>
                </div>
              </div>
            </Row>
          </Card>
        </Col>
      </Row>
      { modalVisible && <UserModal {...userModalProps} /> }
      { modalImpDelData.modalVisible && <DelModal {...delModalProps} /> }
    </Page>
  )
}

User.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ app, user, loading }) => ({ app, user, loading }))(User)
