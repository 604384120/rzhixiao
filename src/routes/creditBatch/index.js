import { Tree } from 'antd'
import React from 'react'
import { Row, Col, Card, Button, Input, DatePicker, Select, Divider } from 'antd'
import { Page, UserSortLayer } from 'components'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import UserTable from './UserTable'
import moment from 'moment';
import styles from '../common.less'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import { getYearFormat } from 'utils'

const Search = Input.Search
const RangePicker = DatePicker.RangePicker
const Option = Select.Option

const CreditBatch = ({
  location,
  dispatch,
  creditBatch,
  loading,
  app,
}) => {
  const { isNavbar, requestMap } = app
  const {
    list, searchName, dataLoading, count, pageNum, pageSize,
    year, beginDate, endDate,
    sortFlag
  } = creditBatch

  const yearList = requestMap['yearList']

  const queryParam = {
    year,
    name:searchName,
    beginDate,
    endDate
  }

  const userTableProps = {
    dataSource: list,
    dataLoading,
    count, pageNum, pageSize,
    onUpdateDataSource (data) {
      dispatch({
        type: 'creditBatch/updateState',
        payload: {
          list: data,
        },
      })
    },
    onAddCreditBatch (data) {
      dispatch({
        type: 'creditBatch/addCreditBatch',
        payload: {
          data
        },
      })
    },
    onSaveCreditBatch (data) {
      dispatch({
        type: 'creditBatch/updateCreditBatch',
        payload: {
          data
        },
      })
    },
    onDeleteCreditBatch (data) {
      dispatch({
        type: 'creditBatch/deleteCreditBatch',
        payload: {
          data
        },
      })
    },
    onCreditBatchInfo (data) {
      dispatch(routerRedux.push({
        pathname: '/creditBatchInfo',
        search: queryString.stringify({
          batchId: data.id,
        }),
      }))
    },
  }


  const handleOnAdd = () => {
    if (list.length == 0 || !list[0]._add) {
      const newSub = {
        id: '',
        name: '',
        status: '1',
        year: '',
        _editable: true,
        _add: true,
        _tempSource: {
          id: '',
          name: '',
          year: '1',
        },
      }
      list.unshift(newSub)
      dispatch({
        type: 'creditBatch/updateState',
        payload: {
          list,
        },
      })
    }
  }

  const handleQueryData = () => {
    dispatch({
      type: 'creditBatch/getDataList',
      payload: {
        ...queryParam
      },
    })
  }
  const handleResetQuery = () => {
    dispatch({type: 'creditBatch/updateSort',   //重置加蒙版
      payload: {
        beginDate: undefined,
        endDate: undefined,
        year: undefined
      },
    })
    // dispatch({
    //   type: 'creditBatch/update',
    //   payload: {
    //     beginDate: undefined,
    //     endDate: undefined,
    //     year: undefined
    //   },
    // })
  }

  const handleOnSearch = (value) => {
    queryParam.name = value
    handleQueryData()
  }
  const handleChangeSearchName = (value) => {
    dispatch({
      type: 'creditBatch/updateState',
      payload: {
        searchName: value.target.value
      },
    })
  }

  const handleChangeDate =  (value) => {
    dispatch({type: 'creditBatch/updateSort',   //生成日期加蒙版
      payload:{
        beginDate: value.length == 0?'':value[0].format('YYYY-MM-DD HH:mm:ss'),
        endDate: value.length == 0?'':value[1].format('YYYY-MM-DD HH:mm:ss'),
      },
    })
    // dispatch({
    //   type: 'creditBatch/updateState',
    //   payload:{
    //     beginDate: value.length == 0?'':value[0].format('YYYY-MM-DD HH:mm:ss'),
    //     endDate: value.length == 0?'':value[1].format('YYYY-MM-DD HH:mm:ss'),
    //   },
    // })
  }

  const handleChangeYear = (value) => {
    dispatch({type: 'creditBatch/updateSort', payload:{year: value},})    //学年加蒙版
    // dispatch({
    //   type: 'creditBatch/updateState',
    //   payload: {
    //     year: value
    //   },
    // })
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

  const createSort = () => {
    let i = 0
    const list = [
      {
        id:i++,
        content:(
          <div className={styles.sortCol}>
            <div className={styles.sortTextW}>生成日期:</div>
              <RangePicker
                disabled={dataLoading}
                showTime={{ format: 'HH:mm:ss',defaultValue:[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}}
                disabledDate={(current)=>{return current && current > moment().endOf('day')}}
                format="YYYY-MM-DD HH:mm:ss" 
                placeholder={['开始时间', '结束时间']}
                onChange={handleChangeDate}
                style={{width:'calc( 100% - 100px )',maxWidth:'500px'}}
              />
          </div>
        ),
        length: 2,
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
      }
    ]
      return list
  }

  const layerProps = {
    list: createSort(),
    query:(<div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden',textAlign: 'right' }}>
      <Button type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQueryData} style={{ marginRight: '10px',verticalAlign:'middle',width:'62px' }}>{dataLoading?'':'查询'}</Button>
      <Button onClick={handleResetQuery} disabled={dataLoading} style={{ marginRight: '10px' }}>重置</Button>
    </div>),
  }

  return (
    <Page inner>
      {sortFlag&&<div style={{backgroundColor:"rgba(240, 242, 245, 0.5)", zIndex:800, position:'absolute', width:'100%', height:'100%', margin:'-24px'}}></div>}
      <Row gutter={16}>
        <Col>
          <Card bordered={false} bodyStyle={{ padding: ' 0' }}>
            <UserSortLayer {...layerProps}/>
            <Divider style={{ margin: '5px' }} dashed />
            <Row style={{marginBottom:'10px'}}>
              <Button icon="plus" onClick={() => { handleOnAdd() }} type="primary" style={{marginBottom:isNavbar?'10px':undefined}}>新增批次</Button>
              <div style={{width: isNavbar?'100%':'240px',display:'inline-blck',float: 'right'}}>
                <Search enterButton placeholder="搜索" value={searchName} onChange={handleChangeSearchName} onSearch={value => handleOnSearch(value)} style={{ width: isNavbar?'100%':200, float: 'right' }} />
              </div>
            </Row>
            <UserTable {...userTableProps} />
          </Card>
        </Col>
      </Row>
    </Page>
  )
}

CreditBatch.propTypes = {
  creditBatch: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default connect(({ creditBatch, app, loading }) => ({ creditBatch, app, loading }))(CreditBatch)

