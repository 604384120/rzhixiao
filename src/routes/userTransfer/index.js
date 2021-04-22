import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Card, Input, Popover, Divider, Select, Spin, Tag, Icon, Menu, Dropdown } from 'antd'
import { Page, UserSort, UserDisplay, UserSortLayer, SortSelect } from 'components'
import UserTable from './UserTable'
import styles from '../common.less'
import queryString from 'query-string'
import { getFormat, config, getYearFormat } from 'utils'

const Option = Select.Option
const { Search } = Input;
const { api } = config
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const UserTransfer = ({
  location, dispatch, userTransfer, loading, app
}) => {
  const { isNavbar } = app
  const {
    dataList, pageNum, pageSize, count, dataLoading,
    displaySence, sortSence, userSortExtra,
    searchName, 
    orderBy,
    typeMask,
    sortFlag
  } = userTransfer

  const { userDisplaySence, userAttrList, userAttrMap } = app
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}
  const queryParam = {
    pageSize,
    pageNum,
    key:searchName,
		sortList: userSortList,
    orderBy,
    typeMask
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
      dispatch({type: 'userTransfer/updateSort'})  // 更多筛选加蒙版
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
      dispatch({type: 'userTransfer/updateSort'})  // 加蒙版
    },
  }

  const userTableProps = {
    dataList,
    dataLoading,
    count,
    pageNum,
    pageSize,
    userDisplayList,
    userDisplayMap,
    userAttrMap,
    orderBy,
    onChangePage (n, s) {
      dispatch({
        type: 'userTransfer/getDataList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
        },
      })
    },
    onChangeSort(type) {
      dispatch({
        type: 'userTransfer/getDataList',
        payload: {
          ...queryParam,
          orderBy: type
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
    dispatch({type: 'userTransfer/updateSort',    //重置加蒙版
      payload: {
        userSortList,
        typeMask:undefined
      },
    })
    // dispatch({
    //   type: 'userTransfer/updateState',
    //   payload: {
    //     userSortList,
    //     typeMask:undefined
    //   },
    // })
  }

  const handleChangeSearchName = (value) =>{
    dispatch({
      type: 'userTransfer/updateState',
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
      type: 'userTransfer/getDataList',
      payload: {
        ...queryParam,
      },
    })
  }

  const handleChangeTypeMask = (value) => {
    dispatch({type: 'userTransfer/updateSort',payload:{typeMask: value}})    //异动类型加蒙版
    // dispatch({
    //   type: 'userTransfer/updateState',
    //   payload:{
    //     typeMask: value
    //   },
    // })
  }

  const createSort = () => {
    let i = 0
    const list = []
      for(let attr of userSortList){
        i++
        if(attr.id == 'typeMask'){
          list.push({
            id:i,
            content:(<div className={styles.sortCol}>
                      <div className={styles.sortText}>{attr.name}:</div>
                      <Select disabled={dataLoading} allowClear={true} value={typeMask} className={styles.sortSelectMuti} placeholder={"选择"+attr.name} onChange={handleChangeTypeMask}>
                        <Option key={1} value={1} title={'状态异动'}>状态异动</Option>
                        <Option key={2} value={2} title={'班级异动'}>班级异动</Option>
                      </Select>
                    </div>)
                  })
          }else{
            list.push({
              id:i,
              content:(<SortSelect {...{...structSelectProps, attr}}/>)})
                } 
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
            <Row style={{ marginBottom: '20px', }}>
              <Search enterButton placeholder="搜索" value={searchName} onChange={(value)=>{handleChangeSearchName(value)}} onSearch={(value) => handleOnSearch(value)} style={{ float: 'right', width: isNavbar?'84%':'200px' }} />
              <UserDisplay {...userDisplayProps} />
            </Row>
            <Row><UserTable {...userTableProps} /></Row>
            </div>
          </Card>
        </Col>
      </Row>
    </Page>
  )
}


UserTransfer.propTypes = {
  userTransfer: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ userTransfer, app, loading }) => ({ userTransfer, app, loading }))(UserTransfer)
