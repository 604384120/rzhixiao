import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Card, Input, message, Divider, Select, Spin, Tabs, Checkbox, Icon } from 'antd'
import { Page, UserSort, UserDisplay, UserSortLayer, SortSelect } from 'components'
import UserTable from './UserTable'
import UserModal from './UserModal'
import styles from '../common.less'
import { getFormat,getYearFormat } from 'utils'

const Option = Select.Option
const { Search } = Input;
const TabPane = Tabs.TabPane

const FeeAdjust = ({
  location, dispatch, feeAdjust, loading, app
}) => {
  const { isNavbar } = app;
  const {
    modalVisible, modalType, modalImportData, modalEditData, userData,
    displaySence, sortSence, userSortExtra,
    searchName, missionId, subjectId, year, queryTime,
    sortFlag, selectedAll,
  } = feeAdjust

  const { user, userDisplaySence, userAttrList, userAttrMap, requestMap } = app
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}

  const missionList = requestMap['missionList']
  const subjectList = requestMap['subjectList']
  const subjectMap = requestMap['subjectMap']
  const yearList = requestMap['yearList']

  const queryParam = {
    key:searchName,
		missionId,
		sortList: userSortList,
    subjectId,
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
      dispatch({type: 'feeAdjust/updateSort'})  // 更多筛选加蒙版
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
    dataLoading:userData.dataLoading,
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
      dispatch({type: 'feeAdjust/updateSort'})  // 加蒙版
    },
  }

  const userTableProps = {
    data:userData,
    dataSelected: userData.dataSelected,
    userDisplayList,
    userDisplayMap,
    userAttrMap,
    subjectMap,
    selectedAll,
    onChangePage (n, s) {
      dispatch({
        type: 'feeAdjust/getUserList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
          queryTime
        },
      })
    },
    onUpdateState (data) {
      userData.dataSelected = data.dataSelected
      dispatch({
        type: 'feeAdjust/updateState',
        payload: {
          userData,
          selectedAll:data.selectedAll
        },
      })
    },
    onAdjust (data) {
      //根据列表生成表格
      let tempArr = [];
      for(let subject of userData.subjectList){
        if(subjectId && subjectId.length>0 && subjectId.indexOf(subject.subjectId)<0){
          continue
        }
        let addFlag = true;
        for (let node of data.feeBillListEntities) {
          if(subject.subjectId == node.subjectId && subject.missionId == node.missionId){
            node._totalFee = getFormat(node.totalFee)
            node._reason = node.reason
            node._status = node.status
            node._count = 1
            tempArr.push({...node})
            addFlag = false;
            break;
          }
        }
        if(addFlag){
          let tempNode = {
            subjectId:subject.subjectId,
            subjectName:subject.subjectName,
            year: subject.year,
            missionId: subject.missionId,
            missionName: subject.missionName,
            totalFee: 0,
            _totalFee: 0,
            status: '0',
            _status: '0',
            reason: '',
            _reason: '',
            _addUserId: [data.userId],
            _count: 1,
          }
          tempArr.push(tempNode);
        }
      }
      modalEditData.dataSource = tempArr
      modalEditData.userId = [data.userId]
      dispatch({
        type: 'feeAdjust/updateState',
        payload: {
          modalEditData,
          modalVisible: true,
          modalType: 'adjust'
        },
      })
    },
  }

  const userModalProps = {
    modalImportData, modalVisible, modalType, modalEditData,
    user,
    dataSource: subjectList,
    subjectMap,
    dataSelected:userData.dataSelected,
    selectedAll,
    count:userData.count,
    searchName,
    onClose () {
      dispatch({
        type: 'feeAdjust/updateState',
        payload: {
          modalVisible: false,
          modalType: '',
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'feeAdjust/updateState',
        payload: {
         ...data
        },
      })
    },
    onImportConfirm (data) {
      if(!modalImportData.excel){   // 调整导入 || 导入关闭账单
        message.error('请选择文件');
        return;
      }
      dispatch({
        type: 'feeAdjust/importBill',
        payload: modalType == 'import'?{
          file:modalImportData.excel.fileName,   // 调整导入
          type:modalImportData.importType==1?'totalFeeAdjust':null,
          timer: setInterval(() => {
            dispatch({
              type: 'feeAdjust/getImportBillPrs'
            })
          }, 1500)
        }:{
          type:modalImportData.value,
          file:modalImportData.excel.fileName,   // 导入关闭账单
          timer: setInterval(() => {
            dispatch({
              type: 'feeAdjust/getImportBillPrs'
            })
          }, 1500)
        },
      })
    },
    onImportCover (data) {
      dispatch({
        type: 'feeAdjust/coverBill',
        payload: {
          ...data,
          timer: setInterval(() => {
            dispatch({
              type: 'feeAdjust/getImportBillPrs'
            })
          }, 1500)
        },
      })
    },
    onUpdateBills (data) {
      if(data.params){
        data.params = queryParam
        delete data.params.accountId
        if(data.params.year) data.params.year = data.params.year.toString()
        if(data.params.missionId) data.params.missionId = data.params.missionId.toString()
        if(data.params.subjectId) data.params.subjectId = data.params.subjectId.toString()
        data.params.count = userData.count.toString()
      }
      dispatch({
        type: 'feeAdjust/updateBills',
        payload: {
          ...data,
        },
      })
    }
  }
  
  const handleChangeYear = (value) => {
    dispatch({type: 'feeAdjust/updateSort',payload:{year: value}})  //学年加蒙版
	}

  const handleChangeMission = (value) => {
    dispatch({type: 'feeAdjust/updateSort',payload:{missionId: value}})  //任务名称加蒙版
	}

	const handleChangeSubject = (value) => {
    dispatch({type: 'feeAdjust/updateSort',payload:{subjectId: value}})  //项目名称加蒙版
	}

  const handleResetQuery = () => {
    for (let sort of userSortList) {
      if (sort._idSelected) {
        sort._idSelected = []
      }
    }
    dispatch({type: 'feeAdjust/updateSort',
      payload:{
        userSortList,
        subjectId:undefined,
        missionId:undefined,
        year: undefined,
      }})
  }

  const handleChangeSearchName = (value) =>{
    dispatch({
      type: 'feeAdjust/updateState',
      payload: {
        searchName: value.target.value
      },
    })
  }
  
  const handleOnSearch = (name) => {
		if(name || searchName){
			queryParam.key = name;
      handleQueryData()
		}
	}

  const handleQueryData = (time) => {
      if(time && time==userData.queryTime){
        return
      }
      dispatch({
        type: 'feeAdjust/getUserList',
        payload: {
          ...queryParam,
          pageNum: userData.pageNum,
          pageSize: userData.pageSize,
          queryTime: time,
        },
      })
  }

  const handleShowImport = () => {
    dispatch({
      type: 'feeAdjust/updateState',
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

  const handleShowImportOff = () => {
    dispatch({
      type: 'feeAdjust/updateState',
      payload: {
        modalVisible: true,
        modalType: 'importOff',
        modalImportData:{
          step: 3,    // 为了和调整导入同步设为3，不对之前的做更改
          importing: false,
          covering: false,
          importType: 1,
          value: undefined
        }
      },
    })
  }

  const handleAdjust = () => {
    //根据列表生成表格
    let tempArr = [];
    let i = 0;
    for(let subject of userData.subjectList){
      if(subjectId && subjectId.length>0 && subjectId.indexOf(subject.subjectId)<0){
        continue
      }
      let tempNode = {
        id: undefined,
        subjectId:subject.subjectId,
        subjectName:subject.subjectName,
        missionId: subject.missionId,
        missionName: subject.missionName,
        year: subject.year,
        totalFee: 0,
        _totalFee: 0,
        status: '0',
        _status: '0',
        reason: '',
        _reason: '',
        _addUserId: undefined,
        _count: userData.dataSelected.length,
      }
      for(let index of userData.dataSelected){
        let data = userData.dataList[index]
        let addFlag = true
        for (let node of data.feeBillListEntities) {
          if(subject.subjectId == node.subjectId && subject.missionId == node.missionId){
            //存在对应的账单
            if(tempNode.id){
              tempNode.id.push(node.id)
            }else{
              //取第一个人的数据
              tempNode.totalFee = node.totalFee
              tempNode.reason = node.reason
              tempNode.status = node.status
              tempNode._totalFee = getFormat(node.totalFee)
              tempNode._reason = node.reason
              tempNode._status = node.status
              tempNode.id = [node.id]
            }
            addFlag = false
            break
          }
        }
        if(addFlag){
          if(tempNode._addUserId){
            tempNode._addUserId.push(data.userId)
          }else{
            tempNode._addUserId = [data.userId]
          }
        }
      }
      if(tempNode.id){
        tempNode.id = tempNode.id.toString()
      }
      tempArr.push(tempNode)
    }
    let modalEditData = {}
    if(!selectedAll && userData.dataSelected && userData.dataSelected.length>0){
      let userId = []
      for(let index of userData.dataSelected){
        userId.push(userData.dataList[index].userId)
      }
      modalEditData.userId = userId
    }
    modalEditData.dataSource = tempArr
    dispatch({
      type: 'feeAdjust/updateState',
      payload: {
        modalEditData,
        modalVisible: true,
        modalType: 'adjust'
      },
    })
  }

  const handleChangeType = (e) => {
    userData.type = e.target.checked?'1':'0'
    dispatch({
      type:'feeAdjust/updateState',
      payload: { userData }
    })
    handleQueryData('1')
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
            <Select disabled={userData.dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={year} className={styles.sortSelectMuti} placeholder={"选择学年"} onChange={handleChangeYear}>
            {createYearOption()}
            </Select>
          </div>
        ),
      },{
        id:i++,
        content:(
          <div className={styles.sortCol}>
             <div className={styles.sortText}>任务名称:</div>
              <Select disabled={userData.dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={missionId} className={styles.sortSelectMuti} placeholder={"选择任务"} onChange={handleChangeMission}>
              {createMissionOption()}
              </Select>
          </div>
        )
      },{
        id:i++,
        content:(
          <div className={styles.sortCol} >
            <div className={styles.sortText}>项目名称:</div>
                <Select disabled={userData.dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={subjectId} className={styles.sortSelectMuti} placeholder={"选择项目"} onChange={handleChangeSubject}>
                {createSubjectOption()}
                </Select>
          </div>
        )
      }
    ]
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
      <Button className={styles.inquery} type={sortFlag==undefined||sortFlag?"primary":''} loading={userData.dataLoading} onClick={()=>handleQueryData()} >{userData.dataLoading?'':'查询'}</Button>
	 		<Button className={styles.reset} onClick={handleResetQuery} disabled={userData.dataLoading} >重置</Button>
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
              <div>
                <Row>
                  <Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }} onClick={handleAdjust} disabled={userData.dataSelected.length==0}>应收调整</Button>
                  <Button style={{ marginRight: '10px' }} onClick={handleShowImport}>调整导入</Button>
                  <Button style={{ marginRight: '10px' }} onClick={handleShowImportOff}>导入关闭账单</Button>
                  <Checkbox style={{marginBottom:'5px'}} disabled={userData.dataLoading} checked={userData.type=='1'} onChange={handleChangeType}>仅显示欠费人员</Checkbox>
                  <div style={{width: isNavbar?'100%':'250px',display:'inline-blck',float: 'right'}}>
                    <Search enterButton placeholder="搜索" value={searchName} onChange={(value)=>{handleChangeSearchName(value)}} onSearch={(value) => handleOnSearch(value)} style={{ float: 'right', width: isNavbar?'calc(100% - 50px)':'200px', marginBottom:isNavbar?'5px':undefined }} />
                    <UserDisplay {...userDisplayProps} />
                  </div>
                </Row>
                <Row style={{color:'#1890ff', visibility:userData.dataSelected.length>0?'visible':'hidden',fontSize:'12px'}}>
                  <Icon type="check" style={{marginLeft:'5px'}}/> 当前已选择{selectedAll?userData.count:(userData.dataSelected.length?userData.dataSelected.length:'0')}条记录
                </Row>
                <Row><UserTable {...userTableProps} /></Row>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      { modalVisible && <UserModal {...userModalProps} /> }
    </Page>
  )
}

FeeAdjust.propTypes = {
  feeAdjust: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ feeAdjust, app, loading }) => ({ feeAdjust, app, loading }))(FeeAdjust)
