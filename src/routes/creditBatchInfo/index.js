import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Card, Input, message, Divider, Select, Spin, Popconfirm, Tabs } from 'antd'
import { Page, UserSort, UserDisplay, UserSortLayer, SortSelect } from 'components'
import UserTable from './UserTable'
import UserModal from './UserModal'
import StatTable from './StatTable'
import HisTable from './HisTable'
import styles from '../common.less'

const Option = Select.Option
const { TextArea, Search } = Input;
const TabPane = Tabs.TabPane

const CreditBatchInfo = ({
  location, dispatch, creditBatchInfo, loading, app
}) => {
  const {
    displaySence, sortSence, userSortExtra,
    searchName, batchId, queryTime,
    index, userData, modalImportData, modalVisible, modalType,
    statData, hisData, sortFlag,
  } = creditBatchInfo

  const { isNavbar , userDisplaySence, userAttrList, userAttrMap } = app
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}
  const queryParam = {
    key:searchName,
    sortList: userSortList,
    batchId,
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
        payload:{sence:displaySence}
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
    dataLoading: userData.dataLoading,
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
      dispatch({type: 'creditBatchInfo/updateSort'})  // 加蒙版
    },
  }

  const userTableProps = {
    data:userData,
    userDisplayList,
    onChangePage (n, s) {
      dispatch({
        type: 'creditBatchInfo/getUserList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
          queryTime
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'creditBatchInfo/updateState',
        payload: {
          ...data,
        },
      })
    },
    onDelete (data) {
      dispatch({
        type: 'creditBatchInfo/deleteUser',
        payload: {
          batchId: batchId,
          id: [data.id],
          sortList: userSortList,
        },
      })
    },
  }
  const userModalProps = {
    modalImportData, modalVisible, modalType,
    userDisplayList,
    onClose () {
      dispatch({
        type: 'creditBatchInfo/updateState',
        payload: {
          modalVisible: false,
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'creditBatchInfo/updateState',
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
          type: 'creditBatchInfo/importCreditBatch',
          payload: {
            file:modalImportData.excel.fileName,
            batchId,
            timer: setInterval(() => {
              dispatch({
                type: 'creditBatchInfo/getImportCreditBatchPrs'
              })
            }, 1500)
          },
        })
    },
    onImportCover (data) {
      dispatch({
        type: 'creditBatchInfo/coverCreditBatch',
        payload: {
          ...data,
          timer: setInterval(() => {
            dispatch({
              type: 'creditBatchInfo/getImportCreditBatchPrs'
            })
          }, 1500)
        },
      })
    },
    onChangeStatPage (n, s) {
      dispatch({
        type: 'creditBatchInfo/getStatDetail',
        payload: {
          userId: modalImportData.userInfo.userId,
          batchId,
          pageNum: n,
          pageSize: s,
        },
      })
    },
  }

  const statTableProps = {
    data:statData,
    userDisplayList,
    onChangePage (n, s) {
      dispatch({
        type: 'creditBatchInfo/getStatList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
          queryTime
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'creditBatchInfo/updateState',
        payload: {
          ...data,
        },
      })
    },
    onShowStatDetail (data) {
      dispatch({
        type: 'creditBatchInfo/showStatDetail',
        payload: {
          userInfo: data,
          batchId
        },
      })
    }
  }

  const hisTableProps = {
    data:hisData,
    userDisplayList,
    onChangePage (n, s) {
      dispatch({
        type: 'creditBatchInfo/getHisList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
          queryTime
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'creditBatchInfo/updateState',
        payload: {
          ...data,
        },
      })
    },
  }

  const handleChangeTabs = (value) => {
    dispatch({
      type: 'creditBatchInfo/updateState',
      payload: {
        index: value,
      },
    })
    if(queryTime){
      handleQuery(value, queryTime)
    }
    
  }

  const handleShowUserImport = () => {
    dispatch({
      type: 'creditBatchInfo/updateState',
      payload: {
        modalVisible: true,
        modalType: 'import',
        modalImportData:{
          step:0,
          importing: false,
          covering: false,
        }
      },
    })
  }
  const handleDeleteUser = () => {
    dispatch({
      type: 'creditBatchInfo/deleteUser',
      payload: {
        batchId: batchId,
        id: userData.dataSelected,
        sortList: userSortList,
      },
    })
  }

  const handleQuery = (value, time) => {
    if(value == '1'){
      if(time && time==userData.queryTime){
        return
      }
      dispatch({
        type: 'creditBatchInfo/getUserList',
        payload: {
          ...queryParam,
          pageNum: userData.pageNum,
          pageSize: userData.pageSize,
          queryTime: time,
        },
      })
    }else if(value == '2'){
      if(time && time==statData.queryTime){
        return
      }
      dispatch({
        type: 'creditBatchInfo/getStatList',
        payload: {
          ...queryParam,
          pageNum: statData.pageNum,
          pageSize: statData.pageSize,
          queryTime: time,
        },
      })
    }else if(value == '3'){
      if(time && time==hisData.queryTime){
        return
      }
      dispatch({
        type: 'creditBatchInfo/getHisList',
        payload: {
          ...queryParam,
          pageNum: hisData.pageNum,
          pageSize: hisData.pageSize,
          queryTime: time,
        },
      })
    }
  }

  const handleResetQuery = () => {
    for (let sort of userSortList) {
      if (sort._idSelected) {
        sort._idSelected = []
      }
    }
    dispatch({
      type: 'creditBatchInfo/updateState',
      payload: {
        searchName
      },
    })
  }

  const handleChangeSearchName = (value) => {
    dispatch({
      type: 'creditBatchInfo/updateState',
      payload: {
        searchName: value.target.value
      },
    })
  }
  
  const handleOnSearch = (name) => {
		if(name || searchName){
			queryParam.name = name;
      handleQuery(index)
		}
	}

  const createSort = () => {
    let i = 0
    const list = []
    for(let attr of userSortList){
      i++
      list.push({
        id:i,
        content:(<SortSelect {...{...structSelectProps, attr}}/>)
              })
    }
    return list
  }

  const layerProps = {
    list: createSort(),
    query:(	<div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', textAlign: 'center' }}>
    <Button type={sortFlag==undefined||sortFlag?"primary":''} loading={userData.dataLoading||statData.dataLoading||hisData.dataLoading} onClick={()=>handleQuery(index)} style={{ marginRight: '10px',verticalAlign:'middle',width:'62px' }}>{userData.dataLoading||statData.dataLoading||hisData.dataLoading?'':'查询'}</Button>
    <Button onClick={handleResetQuery} disabled={userData.dataLoading||statData.dataLoading||hisData.dataLoading} style={{ marginRight: '10px' }}>重置</Button>
    <UserSort {...userSortProps} />
  </div>),
  }

  return (
    <Page inner>
      <Row gutter={16}>
        <Col>
          <Card bordered={false} bodyStyle={{ padding: ' 0' }}>
            <div>
            <Divider style={{ margin: '5px' }} dashed />
            <UserSortLayer {...layerProps}/>
            <Divider style={{ margin: '5px' }} dashed />
            <Row style={{ marginTop: '10px' }}>
              <Tabs defaultActiveKey="1" activeKey={index} animated={false} onChange={handleChangeTabs}>
                <TabPane tab="选课详情" key="1">
                  <Row style={{ marginBottom: '10px' }}>
                    <Button icon="plus" style={{ marginRight: '5px',marginBottom:'10px' }} onClick={handleShowUserImport} type="primary">选课信息导入</Button>
                    <Popconfirm title="删除不可恢复，确认作废？" onConfirm={handleDeleteUser} okText="确定" cancelText="取消"><Button type="primary" style={{ marginRight: '15px' }} disabled={userData.dataSelected.length == 0}>删除</Button></Popconfirm>
                    <div style={{width: isNavbar?'100%':'240px',display:'inline-blck',float: 'right'}}>
                      <Search enterButton placeholder="搜索" value={searchName} onChange={(value)=>{handleChangeSearchName(value)}} onSearch={(value) => handleOnSearch(value)} style={{ float: 'right', width: 'calc(100% - 50px)' }} />
                      <UserDisplay {...userDisplayProps} />
                    </div>
                  </Row>
                  <UserTable {...userTableProps}  />
                </TabPane>
                <TabPane tab="学分统计" key="2">
                  <Row style={{ marginBottom: '10px' }}>
                    <div style={{width: isNavbar?'100%':'240px',display:'inline-blck',float: 'right'}}>
                      <Search enterButton placeholder="搜索" value={searchName} onChange={(value)=>{handleChangeSearchName(value)}} onSearch={(value) => handleOnSearch(value)} style={{ float: 'right', width: 'calc(100% - 50px)' }} />
                      <UserDisplay {...userDisplayProps} />
                    </div>
                  </Row>
                  <StatTable {...statTableProps}  />
                </TabPane>
                <TabPane tab="调整记录" key="3">
                  <Row style={{ marginBottom: '10px' }}>
                    <div style={{width: isNavbar?'100%':'240px',display:'inline-blck',float: 'right'}}>
                      <Search enterButton placeholder="搜索" value={searchName} onChange={(value)=>{handleChangeSearchName(value)}} onSearch={(value) => handleOnSearch(value)} style={{ float: 'right', width: '100%' }} />
                    </div>
                  </Row>
                  <HisTable {...hisTableProps}  />
                </TabPane>
              </Tabs>
            </Row>
            </div>
          </Card>
        </Col>
        { modalVisible && <UserModal {...userModalProps} /> }
      </Row>
    </Page>
  )
}

CreditBatchInfo.propTypes = {
  creditBatchInfo: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ creditBatchInfo, app, loading }) => ({ creditBatchInfo, app, loading }))(CreditBatchInfo)
