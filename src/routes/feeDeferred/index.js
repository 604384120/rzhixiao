import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Card, Input, message, Divider, Select, Spin, Icon } from 'antd'
import { Page, UserSort, UserDisplay, UserSortLayer, SortSelect } from 'components'
import UserTable from './UserTable'
import UserModal from './UserModal'
import styles from '../common.less'
import { getYearFormat } from 'utils'

const Option = Select.Option
const { TextArea, Search } = Input;

const FeeDeferred = ({
  location, dispatch, feeDeferred, loading, app
}) => {
  const { isNavbar } = app;
  const {
    modalVisible, modalType, modalImportData, modalEditData,
    displaySence, sortSence, userSortExtra,
    searchName, pageNum, pageSize, accountId, missionId, subjectId, status, year,
    deferredList, count, dataLoading, selectedRecords, defStandMap,
    cancelReturnData,
    sortFlag, selectedAll,
  } = feeDeferred

  const { user, userDisplaySence, userAttrList, userAttrMap, requestMap } = app
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}

  const missionList = requestMap['missionList']
  const yearList = requestMap['yearList']
  const subjectList = requestMap['subjectList']
  const subjectMap = requestMap['subjectMap']
  const accountList = requestMap['accountList']

  const queryParam = {
    key:searchName,
		pageNum,
		pageSize,
		missionId,
		sortList: userSortList,
		accountId: userSortMap['accountId']?userSortMap['accountId']._idSelected:undefined,
    subjectId,
    status,
    year,
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
      dispatch({type: 'feeDeferred/updateSort'})  // 更多筛选加蒙版
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
      dispatch({type: 'feeDeferred/updateSort'})  // 加蒙版
    },
  }

  const userTableProps = {
    dataSource: deferredList,
    count,
    pageNum,
    pageSize,
    userDisplayList,
    userDisplayMap,
    userAttrMap,
    dataLoading,
    subjectMap,
    selectedRecords,
    selectedAll,
    onChangePage (n, s) {
      dispatch({
        type: 'feeDeferred/getDeferredList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'feeDeferred/updateState',
        payload: {
          ...data,
        },
      })
    },
    onEdit (data) {
      //缓缴处理
      let arr = [];
      arr.push({
        ...data,
        ids: [data.id],
      })
      let modalEditData = {}
      modalEditData.dataSource = arr;
      modalEditData.id = [data.id];
      dispatch({
        type: 'feeDeferred/getDeferredStandList',
        payload: {
          modalVisible:true,
          modalType:'edit',
          modalEditData,
          defStandMap
        },
      })
    }
  }

  const userModalProps = {
    modalImportData, modalVisible, modalType, modalEditData,
    dataSource: subjectList,
    subjectMap,
    defStandMap,
    selectedAll,
    onClose () {
      dispatch({
        type: 'feeDeferred/updateState',
        payload: {
          modalVisible: false,
          modalType: '',
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'feeDeferred/updateState',
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
          type: 'feeDeferred/importDeferred',
          payload: {
            file:modalImportData.excel.fileName,
            timer: setInterval(() => {
              dispatch({
                type: 'feeDeferred/getImportDeferredPrs'
              })
            }, 1500)
          },
        })
    },
    onImportCover (data) {
      dispatch({
        type: 'feeDeferred/coverDeferred',
        payload: {
          ...data,
          timer: setInterval(() => {
            dispatch({
              type: 'feeDeferred/getImportDeferredPrs'
            })
          }, 1500)
        },
      })
    },
    onSubmitDefrred (data) {
      if(data.params){
        data.params = queryParam
        delete data.params.pageNum
        delete data.params.pageSize
        if(data.params.year) data.params.year = data.params.year.toString()
        if(data.params.missionId) data.params.missionId = data.params.missionId.toString()
        if(data.params.subjectId) data.params.subjectId = data.params.subjectId.toString()
        if(data.params.accountId) data.params.accountId = data.params.accountId.toString()
        if(data.params.status) data.params.status = data.params.status.toString()
        data.params.count = count.toString()
      }
      dispatch({
        type: 'feeDeferred/updateBills',
        payload: {
          ...data,
        },
      })
    }
  }

  const handleChangeStatus = (value) => {
    dispatch({type: 'feeDeferred/updateSort',payload:{status: value}})    //状态加蒙版
    // dispatch({
    //   type: 'feeDeferred/updateState',
    //   payload:{
    //     status: value
    //   },
    // })
  }
  
  const handleChangeYear = (value) => {
    dispatch({type: 'feeDeferred/updateSort',payload:{year: value}})    //学年加蒙版
    // dispatch({
    //   type: 'feeDeferred/updateState',
    //   payload:{
    //     year: value
    //   },
    // })
	}

  const handleChangeMission = (value) => {
    dispatch({type: 'feeDeferred/updateSort',payload:{missionId: value}})    //任务名称加蒙版
    // dispatch({
    //   type: 'feeDeferred/updateState',
    //   payload:{
    //     missionId: value
    //   },
    // })
	}

	const handleChangeSubject = (value) => {
    dispatch({type: 'feeDeferred/updateSort',payload:{subjectId: value}})    //项目名称加蒙版
    // dispatch({
    //   type: 'feeDeferred/updateState',
    //   payload:{
    //     subjectId: value
    //   },
    // })
	}

  const handleResetQueryOrder = () => {
    for (let sort of userSortList) {
      if (sort._idSelected) {
        sort._idSelected = []
      }
    }
    dispatch({type: 'feeDeferred/updateSort',   //重置加蒙版
      payload: {
        userSortList,
        accountId: [],
        payType: undefined,
        subjectId:undefined,
        missionId:undefined,
        status: undefined,
      },
    })
    // dispatch({
    //   type: 'feeDeferred/updateState',
    //   payload: {
    //     userSortList,
    //     accountId: [],
    //     payType: undefined,
    //     subjectId:undefined,
    //     missionId:undefined,
    //     status: undefined,
    //   },
    // })
  }

  const handleChangeSearchName = (value) =>{
    dispatch({
      type: 'feeDeferred/updateState',
      payload: {
        searchName: value.target.value
      },
    })
  }
  
  const handleOnSearch = (name) => {
		if(name || searchName){
			queryParam.key = name;
      dispatch({
        type: 'feeDeferred/getDeferredList',
        payload: {
          ...queryParam,
        },
      })
		}
	}

  const handleQueryOrder = () => {
    dispatch({
      type: 'feeDeferred/getDeferredList',
      payload: {
        ...queryParam,
      },
    })
  }

  const handleShowImport = () => {
    dispatch({
      type: 'feeDeferred/updateState',
      payload: {
        modalVisible: true,
        modalType: 'import',
        modalImportData:{
          step:0,
          importing: false,
          covering: false,
          importType: 1
        }
      },
    })
  }

  const handleBatch = () => {
    let tempMap = {}
    let tempArr = []
    let id = []
    let modalEditData = {}
    for(let pos of selectedRecords){
      const node = deferredList[pos]
      let index = node.missionId+'_'+node.subjectId
      if(tempMap[index]){
        tempMap[index].ids.push(node.id)
      }else{
        let tempNode = {
          ...node,
          ids: [node.id],
        }
        tempArr.push(tempNode)
        tempMap[index] = tempNode
      }
      id.push(deferredList[pos].id)
    }
    if(!selectedAll && selectedRecords && selectedRecords.length>0){
      modalEditData.id = id
    }
    modalEditData.dataSource = tempArr;
    dispatch({
      type: 'feeDeferred/updateState',
      payload: {
        modalVisible:true,
        modalType:'batch',
        modalEditData
      },
    })
  }

  const createYearOption = () => {
    const options = [];
    if(yearList){
      for(let index of yearList){
        options.push(<Option key={index.year} value={index.year} title={getYearFormat(index.year)}>{getYearFormat(index.year)}</Option>)
      }
    }
		return options;
  }

  const createMissionOption = () => {
    const options = [];
    if(missionList){
      for(let index of missionList){
        options.push(<Option key={index.id} value={index.id} title={index.name}>{index.name}</Option>)
      }
    }
		return options;
	}

  const createSubjectOption = () => {
    const options = [];
    if(subjectList){
      for(let index of subjectList){
        options.push(<Option key={index.id} value={index.id} title={index.name}>{index.name}</Option>)
      }
    }
		return options;
	}

  const createSort = () => {
    let i = 0
    const list = [
      {
        id:i++,
        content:(
          <div className={styles.sortCol}>
            <div className={styles.sortText}>学年:</div>
                <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={year} className={styles.sortSelectMuti} placeholder={"选择学年"} onChange={handleChangeYear}>
                {createYearOption()}
                </Select>
          </div>
        ),
      },{
        id:i++,
        content:(
          <div className={styles.sortCol}>
             <div className={styles.sortText}>任务名称:</div>
                <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={missionId} className={styles.sortSelectMuti} placeholder={"选择任务"} onChange={handleChangeMission}>
                {createMissionOption()}
                </Select>
          </div>
        )
      },{
        id:i++,
        content:(
          <div className={styles.sortCol} >
            <div className={styles.sortText}>项目名称:</div>
                <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={subjectId} className={styles.sortSelectMuti} placeholder={"选择项目"} onChange={handleChangeSubject}>
                {createSubjectOption()}
                </Select>
          </div>
        )
      },{
        id:i++,
        content:(
          <div className={styles.sortCol} >
            <div className={styles.sortText}>状态:</div>
                <Select disabled={dataLoading} allowClear={true} value={status} className={styles.sortSelectMuti} placeholder={"选择状态"} onChange={handleChangeStatus}>
                  <Option key={0} value={0} title={'无缓缴'}>无缓缴</Option>
                  <Option key={1} value={1} title={'正常'}>正常</Option>
                  <Option key={2} value={2} title={'已过期'}>已过期</Option>
                </Select>
          </div>
        )
      }
    ]
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
    query:(<div className={styles.queryBox} >
        <Button className={styles.inquery} type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQueryOrder} >{dataLoading?'':'查询'}</Button>
				<Button className={styles.reset} onClick={handleResetQueryOrder} disabled={dataLoading} >重置</Button>
				<UserSort {...userSortProps} className={styles.more}/>
    </div>),
  }
  return (
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
              <Button type="primary" style={{ marginRight: '15px', marginBottom:isNavbar?'5px':undefined }} onClick={handleShowImport}>缓缴导入</Button>
              <Button type="primary" style={{ marginRight: '15px' }} disabled={selectedRecords.length == 0} onClick={handleBatch}>批量缓缴</Button>
              <div style={{width: isNavbar?'100%':'250px',display:'inline-blck',float: 'right'}}>
                <Search enterButton placeholder="搜索" value={searchName} onChange={(value)=>{handleChangeSearchName(value)}} onSearch={(value) => handleOnSearch(value)} style={{ float: 'right', width: isNavbar?'calc(100% - 50px)':'200px' }} />
                <UserDisplay {...userDisplayProps} />
              </div>
            </Row>
            <Row style={{color:'#1890ff', visibility:selectedRecords.length>0?'visible':'hidden',fontSize:'12px'}}>
              <Icon type="check" style={{marginLeft:'5px'}}/> 当前已选择{selectedAll?count:(selectedRecords.length?selectedRecords.length:'0')}条记录
            </Row>
            <Row><UserTable {...userTableProps} /></Row>
            </div>
          </Card>
        </Col>
      </Row>
      { modalVisible && <UserModal {...userModalProps} /> }
    </Page>
  )
}

FeeDeferred.propTypes = {
  feeDeferred: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ feeDeferred, app, loading }) => ({ feeDeferred, app, loading }))(FeeDeferred)
