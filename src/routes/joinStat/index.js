import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Card, Input, Popover, Divider, Select, Spin, Tag, Icon, Menu, Dropdown, DatePicker } from 'antd'
import { Page, UserSort, UserDisplay, UserSortLayer } from 'components'
import queryString from 'query-string'
import { getFormat, config, getYearFormat, token } from 'utils'
import styles from '../common.less'
import JoinStatTable from './JoinStatTable'
import moment from 'moment'
import { routerRedux } from 'dva/router'

const Option = Select.Option
const { Search } = Input;
const RangePicker = DatePicker.RangePicker;
const { api } = config

const JoinStat = ({
  location, dispatch, joinStat, loading, app
}) => {
const {
  accountList, accountId, pageNum, pageSize, count, sortFlag, dataLoading, searchName, beginDate, endDate,
  dataList,
} = joinStat
  const { isNavbar } = app
  const queryParam = {
    accountId,
    key:searchName,
    pageNum,
    pageSize,
    beginDate,
		endDate,
  }

const userTableProps = {
  dataSource: dataList,
  dataLoading,
  count,
  pageNum,
  pageSize,
  onChangePage (n, s) {
    dispatch({
      type: 'joinStat/getDataList',
      payload: {
        ...queryParam,
        pageNum: n,
        pageSize: s,
      },
    })
  },

  onViewJoinUser (data) {
    dispatch(routerRedux.push({
      pathname: '/joinAdminister',
      search: queryString.stringify({
        accountId: data.accountId,
      }),
    }))
  },

}

const handleChangeDate = (value) => {
  dispatch({
    type: 'joinStat/updateSort',
    payload:{
      beginDate: value.length == 0?'':value[0].format('YYYY-MM-DD HH:mm:ss'),
      endDate: value.length == 0?'':value[1].format('YYYY-MM-DD HH:mm:ss'),
    },
  })
}

const handleQueryData = () => {
  dispatch({
    type: 'joinStat/getDataList',
    payload: {
        ...queryParam
    },
  })
}

const handleResetQuery = () => {
  dispatch({type: 'joinStat/updateSort',
    payload: {
      accountId: undefined,
    },
  })
}

const handleOnSearch = (name) => {
  if(searchName){
    dispatch({
      type: 'joinStat/getDataList',
      payload: {
        ...queryParam,
      },
    })
  }
}

const handleChangeSearchName = (value) => {
  dispatch({
    type: 'joinStat/updateState',
    payload: {
      searchName: value.target.value
    },
  })
}

const handleChangeAccount = (value) => {
  dispatch({
    type: 'joinStat/updateSort',
    payload: {
      accountId: value
    },
  })
}

const getExportUrl = () => {
  let tempParam = {...queryParam};
  if(token()){
    tempParam.token = token()
  }
  delete tempParam.pageNum
  delete tempParam.pageSize
  let url = api.exportJoinAccountStat + '?' + queryString.stringify(tempParam);
  return url
}

const createAccountOption = () => {
  const options = [];
    if(accountList){
      for(let index of accountList){
        options.push(<Option key={index.id} value={index.id} title={index.loginName}>{index.loginName}</Option>)
      }
    }
		return options;
}

const createSort = () => {
  let i = 0
  const list = [{
    id:i++,
    content:(
      <div className={styles.sortCol}>
        <div className={styles.sortTextW}>招生日期:</div>
            <RangePicker
              disabled={dataLoading}
              showTime={{ format: 'HH:mm:ss',defaultValue:[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}}
              defaultValue={[beginDate?moment(beginDate):'', endDate?moment(endDate):'']}
              disabledDate={current=>{return current && current > moment().endOf('day')}}
              format="YYYY-MM-DD HH:mm:ss" 
              placeholder={['开始时间', '结束时间']}
              onChange={handleChangeDate}
              style={{width: 'calc(100% - 100px)'}}
            />
      </div>
    ),
    length: 2,
  },{
    id:i++,
    content:(
      <div className={styles.sortCol} >
      <div className={styles.sortText}>招生人员:</div>
          <Select showSearch optionFilterProp="children" className={styles.sortSelectMuti} disabled={dataLoading} optionFilterProp="children" allowClear value={accountId} placeholder={"选择账号"} onChange={handleChangeAccount}>
              {createAccountOption()}
          </Select>
      </div>
      )
    },
  ]
  return list
}

const layerProps = {
  list: createSort(),
  query:(<div className={styles.queryBox} style={{textAlign:'right',paddingRight:'3%'}}>
      <Button className={styles.inquery} type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQueryData} >{dataLoading?'':'查询'}</Button>
      <Button className={styles.reset} onClick={handleResetQuery} disabled={dataLoading} >重置</Button>
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
              <Row>
                <Button style={{textIndent: 'initial',marginBottom:'10px'}} target="_blank" href={getExportUrl()} >导出</Button>
                <div style={{width: isNavbar?'100%':'240px',display:'inline-blck',float: 'right',marginBottom:'10px'}}>
                  <Search enterButton placeholder="搜索" value={searchName} onChange={handleChangeSearchName} onSearch={value => handleOnSearch(value)} style={{ width: isNavbar?'100%':200, float: 'right' }} />
                </div>
              </Row>
              <JoinStatTable {...userTableProps} />
            </div>
          </Card>
        </Col>
      </Row>
    </Page>
    )
  }


  JoinStat.propTypes = {
    joinStat: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.object,
  }

export default connect(({ joinStat, app, loading }) => ({ joinStat, app, loading }))(JoinStat)
