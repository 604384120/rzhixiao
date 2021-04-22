import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Card, Divider, Select, Spin, Icon, Checkbox } from 'antd'
import { Page, UserStatusSelect, UserSortLayer, BillSum } from 'components'
import UserTable from './UserTable'
import UserModal from './UserModal'
import styles from './index.less'
import queryString from 'query-string'
import { getFormat, getYearFormat, getYearNew, config, token } from 'utils'

const Option = Select.Option
const antIcon = <Icon type="loading" style={{ fontSize: 20 }} spin />;
const { api, statDataMap, statDataList } = config;

const StatisticsMission = ({
  location, dispatch, statisticsMission, loading, app
}) => {
  const {
    modalVisible, modalData, modalType,
    displaySence, sortSence, 
    pageNum, pageSize, subjectId, year, missionId,
    dataList, count, dataLoading, statData,
    userStatus,
    type, sortFlag, statSence
  } = statisticsMission
  const { isNavbar, userDisplaySence, userAttrList, userAttrMap, requestMap } = app
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}
  const statDisplayList = userDisplaySence[statSence]&&userDisplaySence[statSence].displayList?userDisplaySence[statSence].displayList:[]

  const missionList = requestMap['missionList']
  const subjectList = requestMap['subjectList']
  const yearList = requestMap['yearList']

  const queryParam = {
		pageNum,
		pageSize,
    subjectId,
    year,
    type,
    userStatus,
    missionId,
  }

  const displayUpdateState = (data, sence) => {
    userDisplaySence[sence] = {...userDisplaySence[sence], ...data}
    dispatch({
      type: 'app/updateState',
      payload: {
        userDisplaySence
      },
    })
  }
  const displayReset = (sence, displayExtra) => {
    dispatch({
      type: 'app/resetDisplay',
      payload:{sence, displayExtra}
    })
  }
  const displayUpdate = (data, sence) => {
    dispatch({
      type: 'app/updateDisplay',
      payload: {
        displayListTemp:data,
        sence
      },
    })
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
    type,
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

  const userTableProps = {
    dataSource: dataList,
    count,
    pageNum,
    pageSize,
    dataLoading,
    type,
    onChangePage (n, s) {
      dispatch({
        type: 'statisticsMission/getDataList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
        },
      })
    },
    onShowDetail (data, add) {
      dispatch({
        type: 'statisticsMission/showDetail',
        payload: {
          ...data,
          modalType: add,
          type:type,
          userStatus
        },
      })
    },
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
    displayExtra: {},
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
        payload:{sence:sortSence, displayExtra:{}}
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

  const userModalProps = {
    modalVisible, modalData, modalType, isNavbar,
    userSortProps, userDisplayProps, userSortMap, userSortList, userAttrMap, userDisplayList, userDisplaySence,
    displayUpdateState, displayReset, displayUpdate, sortSence,
    onClose () {
      dispatch({
        type: 'statisticsMission/updateState',
        payload: {
          modalVisible: false,
        },
      })
    },

    onGetAttrRelateList (data) {
      dispatch({
				type: 'app/getAttrRelateList',
				payload: {
          ...data,
          sence: sortSence
				},
			})
    },
    onUpdateState (data) {
      dispatch({
        type: 'statisticsMission/updateState',
        payload: {
         ...data
        },
      })
    },
    onGetDetail (data) {
      dispatch({
        type: 'statisticsMission/getDetailBillList',
        payload: {
         ...data
        },
      })
    },
    onGetStatistics (data) {
      dispatch({
        type: 'statisticsMission/getStatistics',
        payload: {
         ...data
        },
      })
    },
  }

  const handleResetQuery = () => {
    dispatch({type: 'statisticsMission/updateSort',   //重置加蒙版
      payload: {
        subjectId: undefined,
        year: getYearFormat(getYearNew()),
        missionId: undefined,
      },
    })
    // dispatch({
    //   type: 'statisticsMission/updateState',
    //   payload: {
    //     subjectId: undefined,
    //     year: undefined,
    //   },
    // })
  }

  const handleQueryData = () => {
    dispatch({
      type: 'statisticsMission/getDataList',
      payload: {
        ...queryParam,
      },
    })
  }

  const handleChangeYear = (value) => {
    dispatch({type: 'statisticsMission/updateSort',payload:{year: value}})    //学年加蒙版
    // dispatch({type: 'statisticsMission/updateState',payload:{year: value}})
  }
  
  const getExportUrl = () => {
		let tempParam = {...queryParam};
    if(tempParam.subjectId){
      tempParam.subjectId = tempParam.subjectId.toString()
    }
    if(tempParam.missionId){
      tempParam.missionId = tempParam.missionId.toString()
    }
    if(tempParam.year){
      tempParam.year = tempParam.year.toString()
    }
    if(tempParam.userStatus){
      tempParam.userStatus = tempParam.userStatus.toString()
    }
    if(token()){
      tempParam.token = token()
    }
    delete tempParam.pageNum
    delete tempParam.pageSize
		let url = api.exportMissionStatistics + '?' + queryString.stringify(tempParam);
		return url
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

  const handleChangeUserStatus = (value) => {
    dispatch({type: 'statisticsMission/updateSort',payload:{userStatus: value}})    //学生状态加蒙版
  }
  
  const handleChangeMission = (value) => {
    dispatch({type: 'statisticsMission/updateSort',payload:{missionId: value}})    //任务名称加蒙版
	}

  const handleChangeSubject = (value) => {
    dispatch({type: 'statisticsMission/updateSort',payload:{subjectId: value}})    //项目名称加蒙版
  }
  
  const handleChangeType = (e) => {
    queryParam.type = e.target.checked?'1':'0'
    handleQueryData()
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
            <div className={styles.sortText}>学生状态:</div>
            <UserStatusSelect disabled={dataLoading} value={userStatus} className={styles.sortSelectMuti} placeholder={"选择学生状态"} onChange={handleChangeUserStatus} />
          </div>
        ),
      },{
        id:i++,
        content:(
          <div className={styles.sortCol}>
             <div className={styles.sortText}>学年:</div>
              <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={year} className={styles.sortSelectMuti} placeholder={"选择学年"} onChange={handleChangeYear}>
              {createYearOption()}
              </Select>
          </div>
        )
      },{
        id:i++,
        content:(
          <div className={styles.sortCol} >
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
      }
    ]
      return list
  }

  const layerProps = {
    list: createSort(),
    query:(<div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden',textAlign: 'right' }}>
      <Button type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQueryData} style={{ marginRight: '10px',verticalAlign:'middle',width:'62px' }}>{dataLoading?'':'统计'}</Button>
      <Button onClick={handleResetQuery} disabled={dataLoading} style={{ marginRight: '8%',verticalAlign:'middle' }}>重置</Button>
    </div>),
  }

  return (
    <Page inner>
      {sortFlag&&<div style={{backgroundColor:"rgba(240, 242, 245, 0.5)", zIndex:800, position:'absolute', width:'100%', height:'100%', margin:'-24px'}}></div>}
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
            <Row style={{ marginBottom:'10px',textIndent:'20px' }}>
              <Button style={{textIndent: 'initial'}} target="_blank" href={getExportUrl()}>导出</Button>
              <Checkbox disabled={dataLoading} checked={type=='1'} onChange={handleChangeType}>显示人数统计</Checkbox>
            </Row>
            <Row><UserTable {...userTableProps} /></Row>
            </div>
            { modalVisible && <UserModal {...userModalProps} /> }
          </Card>
        </Col>
      </Row>
    </Page>
  )
}

StatisticsMission.propTypes = {
  statisticsMission: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ statisticsMission, app, loading }) => ({ statisticsMission, app, loading }))(StatisticsMission)
