import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Card, Input, Divider, Select, Spin, DatePicker } from 'antd'
import { Page, Print, UserSort, UserDisplay, UserSortLayer, SortSelect } from 'components'
import UserTable from './UserTable'
import styles from '../common.less'
import { getYearFormat, config, getFormat, getSortParam, token } from 'utils'
import moment from 'moment'
import queryString from 'query-string'

const Option = Select.Option
const { Search } = Input;
const RangePicker = DatePicker.RangePicker;
const { api } = config;

const FeeAdjustHistory = ({
  location, dispatch, feeAdjustHistory, loading, app
}) => {
  const { isNavbar } = app;
  const {
    displaySence, sortSence, userSortExtra, sortFlag,
    searchName, pageNum, pageSize, accountId, missionId, subjectId, year, beginDate, endDate, count, dataLoading,
    dataList, feeAdjustSum, feeAdjustCount, orderBy,
  } = feeAdjustHistory

  const { userDisplaySence, userAttrList, userAttrMap, requestMap } = app
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}

  const missionList = requestMap['missionList']
  const subjectList = requestMap['subjectList']
  const accountList = requestMap['accountList']
  const yearList = requestMap['yearList']

  const queryParam = {
    key:searchName,
		pageNum,
		pageSize,
		missionId,
		sortList: userSortList,
		accountId: userSortMap['accountId']?userSortMap['accountId']._idSelected:undefined,
    subjectId,
    year,
    beginDate,
    endDate,
    count,
    orderBy,
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
      dispatch({type: 'feeAdjustHistory/updateSort'})  // ?????????????????????
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
      dispatch({type: 'feeAdjustHistory/updateSort'})  // ?????????
    },
  }

  const userTableProps = {
    dataSource: dataList,
    count,
    pageNum,
    pageSize,
    userDisplayList,
    userDisplayMap,
    userAttrMap,
    dataLoading,
    orderBy,
    onChangePage (n, s) {
      dispatch({
        type: 'feeAdjustHistory/getFeeAdjustHistory',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
        },
      })
    },
    onChangeSort(type) {
      dispatch({
        type: 'feeAdjustHistory/getFeeAdjustHistory',
        payload: {
          ...queryParam,
          orderBy: type,
        },
      })
    }
    
  }

  const handleChangeYear  = (value) => {
    dispatch({type: 'feeAdjustHistory/updateSort',payload:{year: value}})    //???????????????
  }

  const handleChangeDate = (value) => {
    dispatch({
      type: 'feeAdjustHistory/updateSort',
      payload:{
        beginDate: value.length == 0?'':value[0].format('YYYY-MM-DD HH:mm:ss'),
        endDate: value.length == 0?'':value[1].format('YYYY-MM-DD HH:mm:ss'),
      },
    })
	}

  const handleChangeMission = (value) => {
    dispatch({type: 'feeAdjustHistory/updateSort',payload:{missionId: value}})    //?????????????????????
	}

	const handleChangeSubject = (value) => {
    dispatch({type: 'feeAdjustHistory/updateSort',payload:{subjectId: value}})    //?????????????????????
	}

  const handleResetQuery = () => {
    for (let sort of userSortList) {
      if (sort._idSelected) {
        sort._idSelected = []
      }
    }
    dispatch({type: 'feeAdjustHistory/updateSort',    //???????????????
      payload: {
        userSortList,
        accountId: [],
        subjectId:undefined,
        missionId:undefined,
        missionId:undefined,
        year: undefined,
      },
    })
  }

  const handleChangeSearchName = (value) =>{
    dispatch({
      type: 'feeAdjustHistory/updateState',
      payload: {
        searchName: value.target.value
      },
    })
  }
  
  const handleOnSearch = (name) => {
		if(name || searchName){
			queryParam.key = name;
      dispatch({
        type: 'feeAdjustHistory/getFeeAdjustHistory',
        payload: {
          ...queryParam,
        },
      })
		}
	}

  const handleQuery = () => {
    dispatch({
      type: 'feeAdjustHistory/getFeeAdjustHistory',
      payload: {
        ...queryParam,
      },
    })
  }

  const getExportUrl = () => {
    let tempParam = {...queryParam};
    let tempList = getSortParam(tempParam.sortList)
    if (tempList && tempList.length>0) {
      tempParam.sortList = JSON.stringify(tempList)
    } else {
      tempParam.sortList = null
    }
    if(tempParam.subjectId){
      tempParam.subjectId = tempParam.subjectId.toString()
    }
    if(tempParam.year){
      tempParam.year = tempParam.year.toString()
    }
    if(token()){
      tempParam.token = token()
    }
    delete tempParam.pageNum
    delete tempParam.pageSize
    tempParam.mask = '1'
    tempParam.sence = displaySence
		let url = api.exportFeeBillOperateHistory + '?' + queryString.stringify(tempParam);
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
            <div className={styles.sortTextW}>????????????:</div>
                <RangePicker
                  disabled={dataLoading}
                  showTime={{ format: 'HH:mm:ss',defaultValue:[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}}
                  defaultValue={[beginDate?moment(beginDate):'', endDate?moment(endDate):'']}
                  disabledDate={current=>{return current && current > moment().endOf('day')}}
                  format="YYYY-MM-DD HH:mm:ss" 
                  placeholder={['????????????', '????????????']}
                  onChange={handleChangeDate}
                  style={{width: 'calc(100% - 100px)'}}
                />
          </div>
        ),
        length: 2,
      },{
        id:i++,
        content:(
          <div className={styles.sortCol}>
            <div className={styles.sortText}>??????:</div>
                  <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={year} className={styles.sortSelectMuti} placeholder={"????????????"} onChange={handleChangeYear}>
                  {createYearOption()}
                  </Select>
          </div>
        ),
      },{
        id:i++,
        content:(
          <div className={styles.sortCol}>
             <div className={styles.sortText}>????????????:</div>
                  <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={missionId} className={styles.sortSelectMuti} placeholder={"????????????"} onChange={handleChangeMission}>
                  {createMissionOption()}
                  </Select>
          </div>
        )
      },{
        id:i++,
        content:(
          <div className={styles.sortCol} >
            <div className={styles.sortText}>????????????:</div>
                  <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={subjectId} className={styles.sortSelectMuti} placeholder={"????????????"} onChange={handleChangeSubject}>
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
        <Button className={styles.inquery} type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQuery} >{dataLoading?'':'??????'}</Button>
				<Button className={styles.reset} onClick={handleResetQuery} disabled={dataLoading} >??????</Button>
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
            <div style={{ padding: '5px', textAlign: 'center' }}>
              <Row style={{fontSize: '15px'}}>
                <Col span={12} >{'?????????????????????'+getFormat(feeAdjustSum?feeAdjustSum:0)+'???'}</Col>
                <Col span={12} >{'?????????????????????'+(feeAdjustCount?feeAdjustCount:0)+'???'}</Col>
              </Row>
            </div>
            <Divider style={{ margin: '5px' }} dashed />
            <Row style={{ marginBottom: '10px' }}>
              <Button style={{textIndent: 'initial'}} target="_blank" href={getExportUrl()}>??????</Button>
              <div style={{width: isNavbar?'100%':'250px',display:'inline-blck',float: 'right'}}>
                <Search enterButton placeholder="??????" value={searchName} onChange={(value)=>{handleChangeSearchName(value)}} onSearch={(value) => handleOnSearch(value)} style={{ float: 'right', width: isNavbar?'calc(100% - 50px)':'200px' }} />
                <UserDisplay {...userDisplayProps} />
              </div>
            </Row>
            <Row><UserTable {...userTableProps} /></Row>
            </div>
          </Card>
        </Col>
      </Row>
    </Page>
  )
}

FeeAdjustHistory.propTypes = {
  feeAdjustHistory: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ feeAdjustHistory, app, loading }) => ({ feeAdjustHistory, app, loading }))(FeeAdjustHistory)
