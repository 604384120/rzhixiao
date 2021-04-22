import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Card, Input, Popover, Divider, Select, Spin, Tag, Icon, Menu, Dropdown } from 'antd'
import { Page, UserSort, UserDisplay, UserSortLayer, BillSum, SortSelect, ExportTable } from 'components'
import UserTable from './UserTable'
import UserModal from './UserModal'
import styles from '../common.less'
import queryString from 'query-string'
import { getFormat, config, getYearFormat, getYearNew, getSortParam, token } from 'utils'

const Option = Select.Option
const { Search } = Input;
const { api, statDataMap, statDataList } = config
const antIcon = <Icon type="loading" style={{ fontSize: 20 }} spin />;

const StatisticsStudent = ({
  location, dispatch, statisticsStudent, loading, app
}) => {
  const {
    modalVisible, modalType, modalData, statData,
    dataList, pageNum, pageSize, count, dataLoading, dataType, dataTypeMap,
    displaySence, sortSence, userSortExtra, exportFormat, formatVisible,
    searchName, missionId, subjectId, year, queryTime,
    sortFlag,
    statSence, exceedFeeVisible,
  } = statisticsStudent

  const { userDisplaySence, userAttrList, userAttrMap, isNavbar, requestMap } = app
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}
  const statDisplayList = userDisplaySence[statSence]&&userDisplaySence[statSence].displayList?userDisplaySence[statSence].displayList:[]

  const payTypeNameMap = requestMap['payTypeMap']
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
    type:dataType,
    pageNum,
    pageSize,
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
      dispatch({type: 'statisticsStudent/updateSort'})  // 更多筛选加蒙版
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
      dispatch({type: 'statisticsStudent/updateSort'})  // 加蒙版
    },
  }

  let statList = []
  if(statDisplayList){
    for(let node of statDisplayList){
      if(statDataMap[node.id]){
        statList.push(statDataMap[node.id])
      }
    }
  }

  const billSumProps = {
    statData,
    statList,
    dataLoading,
    styles,
    getFormat,
    step: statList.length<6?statList.length+1:6,
    setting:{
      userAttrList:statDataList,
      ...userDisplaySence[statSence],
      onUpdateState (data) {
        userDisplaySence[statSence] = {...userDisplaySence[statSence], ...data}
        dispatch({
          type: 'app/updateState',
          payload: {
            userDisplaySence
          },
        })
      },
      onReset (displayExtra) {
        dispatch({
          type: 'app/resetDisplay',
          payload:{sence: statSence, displayExtra}
        })
      },
      onUpdate (data) {
        dispatch({
          type: 'app/updateDisplay',
          payload: {
            displayListTemp:data,
            sence: statSence
          },
        })
      },
    }
  }

  const exportTableProps ={
    sence: 'statisticsStudent',
    styles,
    isNavbar,
    formatVisible,
    exportFormat,
    onFormatVisibleChange (visible) {
      dispatch({
        type: 'statisticsStudent/updateState',
        payload: {
          formatVisible: visible
        },
      })
    },
    onChangeFormat (format) {
      dispatch({
        type: 'statisticsStudent/updateState',
        payload: {
          exportFormat: format
        },
      })
    },
    onGetExportUrl () {
      let tempParam = { ...queryParam }
      let tempList = getSortParam(tempParam.sortList)
      if (tempList && tempList.length>0) {
        tempParam.sortList = JSON.stringify(tempList)
      } else {
        tempParam.sortList = null
      }
      if(token()){
        tempParam.token = token()
      }
  
      delete tempParam.pageNum
      delete tempParam.pageSize
      tempParam.sence = 'statStudentDisplay'
      tempParam.form = exportFormat>=2?exportFormat:1;
      let url = `${api.exportStatBills}?${queryString.stringify(tempParam)}`
      return url
    }
  }

  const userTableProps = {
    dataList,
    count,
    pageNum,
    pageSize,
    dataLoading,
    userDisplayList,
    userDisplayMap,
    userAttrMap,
    subjectMap,
    exceedFeeVisible,
    onChangePage (n, s) {
      dispatch({
        type: 'statisticsStudent/getDataList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
          queryTime
        },
      })
    },
    onShowDetail (data) {
      dispatch({
        type: 'statisticsStudent/showDetail',
        payload: {
          userCurrent: data,
        },
      })
    },
  }

  const userModalProps = {
    modalVisible, modalType, modalData,
    subjectMap, payTypeNameMap,
    userDisplayList,
    exceedFeeVisible,
    onClose () {
      dispatch({
        type: 'statisticsStudent/updateState',
        payload: {
          modalVisible: false,
          modalType: '',
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'statisticsStudent/updateState',
        payload: {
         ...data
        },
      })
    },
    onChangeIndex (index) {
      dispatch({
        type: 'statisticsStudent/changeIndex',
        payload: {
          index
        },
      })
    },
  }
  
  const handleChangeYear = (value) => {
    dispatch({type: 'statisticsStudent/updateSort',payload:{year: value}})    //学年加蒙版
    // dispatch({
    //   type: 'statisticsStudent/updateState',
    //   payload:{
    //     year: value
    //   },
    // })
	}

  const handleChangeMission = (value) => {
    dispatch({type: 'statisticsStudent/updateSort',payload:{missionId: value}})    //任务名称加蒙版
    // dispatch({
    //   type: 'statisticsStudent/updateState',
    //   payload:{
    //     missionId: value
    //   },
    // })
	}

	const handleChangeSubject = (value) => {
    dispatch({type: 'statisticsStudent/updateSort',payload:{subjectId: value}})    //项目名称加蒙版
    // dispatch({
    //   type: 'statisticsStudent/updateState',
    //   payload:{
    //     subjectId: value
    //   },
    // })
	}

  const handleResetQuery = () => {
    for (let sort of userSortList) {
      if (sort._idSelected) {
        sort._idSelected = []
      }
    }
    dispatch({type: 'statisticsStudent/updateSort',    //重置加蒙版
      payload: {
        userSortList,
        subjectId:undefined,
        missionId:undefined,
        year: getYearFormat(getYearNew()),
      },
    })
    // dispatch({
    //   type: 'statisticsStudent/updateState',
    //   payload: {
    //     userSortList,
    //     subjectId:undefined,
    //     missionId:undefined,
    //     year: undefined,
    //   },
    // })
  }

  const handleChangeSearchName = (value) =>{
    dispatch({
      type: 'statisticsStudent/updateState',
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

  const handleQueryData = () => {
    dispatch({
      type: 'statisticsStudent/getDataList',
      payload: {
        ...queryParam,
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
  
  const handleChangeDataType = (e) => {
    queryParam.type = e.key
    dispatch({
      type: 'statisticsStudent/updateState',
      payload: {
        dataType: e.key
      },
    })
    handleQueryData()
  }

  const renderDataType = () => {
    let options = []
    for(let node in dataTypeMap){
      options.push(<Menu.Item key={node}>{dataTypeMap[node]}</Menu.Item>)
    }
    return (
      <Menu onClick={handleChangeDataType}>
      {options}
      </Menu>
    )
  }

  const createSort = () => {
    let i = 0
    const list = [
      {
        id:i++,
        content:(<div className={styles.sortCol}>
          <div className={styles.sortText}>学年:</div>
            <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={year} className={styles.sortSelectMuti} placeholder={"选择学年"} onChange={handleChangeYear}>
            {createYearOption()}
            </Select>
          </div>)
      },{
        id:i++,
        content:(<div className={styles.sortCol}>
           <div className={styles.sortText}>任务名称:</div>
            <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={missionId} className={styles.sortSelectMuti} placeholder={"选择任务"} onChange={handleChangeMission}>
            {createMissionOption()}
            </Select>
        </div>)
      },{
        id:i++,
        content:(<div className={styles.sortCol}>
          <div className={styles.sortText}>项目名称:</div>
          <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={subjectId} className={styles.sortSelectMuti} placeholder={"选择项目"} onChange={handleChangeSubject}>
          {createSubjectOption()}
          </Select>
        </div>)
      }
    ]

    for(let attr of userSortList){
      list.push({
        id:i++,
        content:(<SortSelect {...{...structSelectProps, attr}}/>)})
      }
    return list
  }

  const layerProps = {
    list: createSort(),
    query:(<div className={styles.queryBox} >
        <Button className={styles.inquery} type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={()=>handleQueryData()} >{dataLoading?'':'查询'}</Button>
				<Button className={styles.reset} onClick={handleResetQuery} disabled={dataLoading} >重置</Button>
				<UserSort {...userSortProps} className={styles.more} />
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
            <div style={{ padding: '10px', textAlign: 'center' }}>
              <BillSum {...billSumProps}/>
            </div>
            <Row style={{ marginBottom: '20px' }}>
              <ExportTable {...exportTableProps}/>
              {
                dataLoading?<a disabled={true} className="ant-dropdown-link">{dataTypeMap[dataType]} <Icon type="down" /></a>:
                <Dropdown overlay={renderDataType()} trigger={['click']}>
                <a disabled={dataLoading} className="ant-dropdown-link">{dataTypeMap[dataType]} <Icon type="down" /></a></Dropdown>
              }
              <div style={{width: isNavbar?'100%':'240px',display:'inline-blck',float: 'right'}}>
                <Search enterButton placeholder="搜索" value={searchName} onChange={(value)=>{handleChangeSearchName(value)}} onSearch={(value) => handleOnSearch(value)} style={{ float: 'right', width: 'calc(100% - 50px)' }} />
                <UserDisplay {...userDisplayProps} />
              </div>
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

StatisticsStudent.propTypes = {
  statisticsStudent: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ statisticsStudent, app, loading }) => ({ statisticsStudent, app, loading }))(StatisticsStudent)
