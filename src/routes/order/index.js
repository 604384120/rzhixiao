import { Tree } from 'antd'
import React from 'react'
import Mock from 'mockjs'
import { Row, Col, Card, Button, Input, Select, DatePicker, Icon, Divider, Spin, InputNumber, message } from 'antd'
import { Page, Print } from 'components'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import OrderTable from './OrderTable'
import OrderDisplay from './OrderDisplay'
import OrderSort from './OrderSort'
import styles from './index.less'
import moment from 'moment'
import { config, token } from 'utils'

const { api } = config
const Search = Input.Search
const Option = Select.Option
const RangePicker = DatePicker.RangePicker

const Order = ({
  location,
  dispatch,
  order,
  loading,
  app,
}) => {
  const {
    count, list, pageNum, pageSize, dataLoading, missionList, missionIdSelected, structList,
    searchName, beginDate, endDate, payType, reBeginDate, reEndDate, receiptBeginNo, receiptEndNo, accountId,
    displayVisible, userAttrList, userAttrRelateMap, userDisplayList, userDisplayMap, userDisplayListTemp,
    sortVisible, userSortList, userSortMap, userSortListTemp, accountList, payTypeNameMap, settingData, textData, templateHeight,
  } = order
  const { user } = app

  const queryParam = {
    key: searchName,
    pageNum,
    pageSize,
    beginDate,
    endDate,
    missionId: missionIdSelected,
    sortList: userSortList,
    payType,
    reBeginDate,
    reEndDate,
    receiptBeginNo,
    receiptEndNo,
    accountId,
  }

  const missionSelect = []
  for (let mission of missionList) {
    missionSelect.push(<Option key={mission.id} value={mission.id}>{mission.name}</Option>)
  }

  const orderSortProps = {
    sortVisible,
    userAttrList,
    userAttrRelateMap,
    userSortList,
    userSortMap,
    userSortListTemp,
    structList,
    onUpdateState (data) {
      dispatch({
        type: 'order/updateState',
        payload: {
          ...data,
        },
      })
    },
    onReset () {
      dispatch({
        type: 'order/resetSort',
      })
    },
    onUpdate (data) {
      dispatch({
        type: 'order/updateSort',
        payload: {
          userSortListTemp,
        },
      })
    },
  }

  const orderDisplayProps = {
    displayVisible,
    userAttrList,
    userDisplayList,
    userDisplayMap,
    userDisplayListTemp,
    onUpdateState (data) {
      dispatch({
        type: 'order/updateState',
        payload: {
          ...data,
        },
      })
    },
    onReset () {
      dispatch({
        type: 'order/resetDisplay',
      })
    },
    onUpdate (data) {
      dispatch({
        type: 'order/updateDisplay',
        payload: {
          userDisplayListTemp,
        },
      })
    },
  }

  const orderTableProps = {
    dataSource: list,
    missionIdSelected,
    count,
    pageNum,
    pageSize,
    dataLoading,
    userDisplayList,
    payTypeNameMap,
    onChangePage (n, s) {
      dispatch({
        type: 'order/getOrderList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
        },
      })
    },
    onPrint: (orderId) => {
      dispatch({
        type: 'order/print',
        payload: {
          missionId: missionIdSelected,
          orderId,
        },
      })
      setTimeout(() => {
        const prnhtml = window.document.getElementById('prn').innerHTML
        window.document.body.innerHTML = prnhtml

        window.print()

        window.location.reload()
      }, 1500)
    },
  }

  const handleChangeMission = (value) => {
    dispatch({
      type: 'order/updateState',
      payload: {
        missionIdSelected: value,
      },
    })
  }

  const handleChangeDate = (value) => {
    if (value.length == 0) {
      dispatch({
        type: 'order/updateState',
        payload: {
          beginDate: '',
          endDate: '',
        },
      })
      return
    }
    dispatch({
      type: 'order/updateState',
      payload: {
        beginDate: value[0].format('YYYY-MM-DD HH:mm:ss'),
        endDate: value[1].format('YYYY-MM-DD HH:mm:ss'),
      },
    })
  }

  const handleChangeReDate = (value) => {
    if (value.length == 0) {
      dispatch({
        type: 'order/updateState',
        payload: {
          reBeginDate: '',
          reEndDate: '',
        },
      })
      return
    }
    dispatch({
      type: 'order/updateState',
      payload: {
        reBeginDate: value[0].format('YYYY-MM-DD HH:mm:ss'),
        reEndDate: value[1].format('YYYY-MM-DD HH:mm:ss'),
      },
    })
  }

  const handleChangePaytype = (value) => {
    dispatch({
      type: 'order/updateState',
      payload: {
        payType: value,
      },
    })
  }

  const handleClickSort = (attr) => {
    if (!attr._selectList || attr._selectList.length <= 0) {
      dispatch({
        type: 'order/getAttrRelateList',
        payload: {
          attrId: userAttrRelateMap[`2_${attr.id}`].id,
          id: attr.id,
        },
      })
    }
  }

  const handleChangeSort = (value, attr) => {
    userSortMap[attr.id]._idSelected = value
    dispatch({
      type: 'order/updateState',
      payload: {
        userSortMap,
      },
    })
  }

  const handleClickAccount = () => {
    if (!accountList || accountList.length <= 0) {
      dispatch({
        type: 'order/getMgrAccountList',
      })
    }
  }

  const handleChangeAccount = (value) => {
    dispatch({
      type: 'order/updateState',
      payload: {
        accountId: value,
      },
    })
  }

  const handleChangeReBeginNo = (value) => {
    dispatch({
      type: 'order/updateState',
      payload: {
        receiptBeginNo: value,
      },
    })
  }

  const handleChangeReEndNo = (value) => {
    dispatch({
      type: 'order/updateState',
      payload: {
        receiptEndNo: value,
      },
    })
  }

  const handleResetQueryOrder = () => {
    for (let sort of userSortList) {
      if (sort._idSelected) {
        sort._idSelected = []
      }
    }
    dispatch({
      type: 'order/updateState',
      payload: {
        userSortList,
        accountId: [],
        payType: null,
        reBeginDate: `${moment().format('YYYY-MM-DD')} 00:00:00`,
        reEndDate: `${moment().format('YYYY-MM-DD')} 23:59:59`,
        receiptBeginNo: null,
        receiptEndNo: null,
      },
    })
  }

  const handleQueryOrder = () => {
    dispatch({
      type: 'order/getOrderList',
      payload: {
        ...queryParam,
      },
    })
  }

  const handleChangeSearchName = (value) => {
    dispatch({
      type: 'order/updateState',
      payload: {
        searchName: value.target.value,
      },
    })
  }

  const handleOnSearch = (name) => {
    if (name || searchName) {
      dispatch({
        type: 'order/getOrderList',
        payload: {
          ...queryParam,
          key: name,
        },
      })
    }
  }

  const getExportUrl = () => {
    let tempParam = { ...queryParam }
    if (!tempParam.missionId) {
      return
    } else if (!tempParam.beginDate) {
      return
    } else if (!tempParam.endDate) {
      return
    } else if (tempParam.receiptBeginNo && tempParam.receiptEndNo && tempParam.receiptEndNo < tempParam.receiptBeginNo) {
      return
    }
    let tempList = []
    if (userSortList && userSortList.length > 0) {
      for (let sort of userSortList) {
        if (sort._idSelected && sort._idSelected.length > 0) {
          let tempSort = {}
          tempSort.attrId = sort.attrId
          tempSort.relateName = ''
          for (let select of sort._idSelected) {
            tempSort.relateName += `${select},`
          }
          tempList.push(tempSort)
        }
      }
    }
    if (tempList.length > 0) {
      tempParam.sortList = JSON.stringify(tempList)
    } else {
      tempParam.sortList = null
    }

    if (accountList) {
      let accountStr = ''
      for (let account of accountList) {
        if (tempParam.accountId.indexOf(`${account.loginName}(${account.name})`) >= 0) {
          accountStr += `${account.id},`
        }
      }
      if (accountStr) {
        tempParam.accountId = accountStr
      } else {
        tempParam.accountId = null
      }
    }
    if(token()){
      tempParam.token = token()
    }

    let url = `${api.exportOrder}?`
    for (let key of Object.keys(tempParam)) {
      url += `${key}=${tempParam[key]}&`
    }
    return url
  }

  const handleClickReceipitSetting = (name) => {
    dispatch(routerRedux.push({
      pathname: '/printSet',
      search: queryString.stringify({
        missionId: missionIdSelected,
      }),
    }))
  }

  const createAccountOption = (attr) => {
    const options = []
    if (accountList) {
      for (let select of accountList) {
        options.push(<Option key={select.id} value={`${select.loginName}(${select.name})`}>{`${select.loginName}(${select.name})`}</Option>)
      }
      return options
    }
    return null
  }

  const createSortOption = (attr) => {
    const options = []
    if (attr._selectList) {
      for (let select of attr._selectList) {
        options.push(<Option key={select.relateId} value={select.relateName}>{select.relateName}</Option>)
      }
      return options
    }
    return null
  }

  const createSort = () => {
    const sortCols = []
    let row = 0
    sortCols.push([])
    length = 1
    for (let attr of userSortList) {
      if (length > 4) {
        // 添加新行
        sortCols.push([])
        row++
        length = 1
      }
      if (attr.id == 'payType') {
        sortCols[row].push(<Col span={6} className={styles.sortCol} key={attr.id}>
          <div className={styles.sortText}>{attr.name}:</div>
          <Select value={payType}
            className={styles.sortSelect}
            placeholder={`选择${attr.name}`}
            onChange={handleChangePaytype}
          >
            <Option value="2">支付宝</Option>
            <Option value="1">微信</Option>
            <Option value="3">现金</Option>
            <Option value="4">POS机</Option>
          </Select>
        </Col>)
      } else if (attr.id == 'reDate') {
        if (length == 4) {
          sortCols.push([])
          row++
          length = 1
        }
        length++
        sortCols[row].push(<Col span={12} className={styles.sortCol} key={attr.id}>
          <div className={styles.sortTextW}>{attr.name}:</div>
          <RangePicker
            showTime={{ format: 'HH:mm:ss', defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }}
            format="YYYY-MM-DD HH:mm:ss"
            onChange={handleChangeReDate}
            placeholder={['开始时间', '结束时间']}
          />
        </Col>)
      } else if (attr.id == 'receiptNo') {
        if (length == 4) {
          sortCols.push([])
          row++
          length = 1
        }
        length++
        sortCols[row].push(<Col span={12} className={styles.sortCol} key={attr.id}>
          <div className={styles.sortTextW}>{attr.name}:</div>
          <InputNumber min={0} step={1} value={receiptBeginNo} onChange={handleChangeReBeginNo} style={{ width: '35%' }} />~<InputNumber min={0} step={1} value={receiptEndNo} onChange={handleChangeReEndNo} style={{ width: '35%' }} />
        </Col>)
      } else if (attr.id == 'accountId') {
        sortCols[row].push(<Col span={6} className={styles.sortCol} key={attr.id}>
          <div className={styles.sortText}>{attr.name}:</div>
          <Select mode="multiple"
            value={accountId}
            className={styles.sortSelectMuti}
            placeholder={`选择${attr.name}`}
            onFocus={handleClickAccount}
            onChange={handleChangeAccount}
            notFoundContent={!accountList ? <Spin size="small" /> : null}
          >
            {createAccountOption(attr)}
          </Select>
        </Col>)
      } else {
        sortCols[row].push(<Col span={6} className={styles.sortCol} key={attr.id}>
          <div className={styles.sortText}>{attr.name}:</div>
          <Select mode="multiple"
            value={userSortMap[attr.id]._idSelected}
            className={styles.sortSelectMuti}
            placeholder={`选择${attr.name}`}
            onFocus={() => handleClickSort(attr)}
            onChange={value => handleChangeSort(value, attr)}
            notFoundContent={!attr._selectList ? <Spin size="small" /> : null}
          >
            {createSortOption(attr)}
          </Select>
        </Col>)
      }
      length++
    }
    const rows = []
    let i = 0
    for (let cols of sortCols) {
      rows.push(<Row key={i++}>
        {cols}
      </Row>)
    }
    return rows
  }

  const getHeight = (value) => {
    dispatch({
      type: 'order/updateState',
      payload: {
        templateHeight: value,
      },
    })
  }

  return (
    <Page inner>
      <Row gutter={16}>
        <Col>
          <Card bordered={false} bodyStyle={{ padding: ' 0' }}>
            <Row>
              <Col span={6} className={styles.sortCol}>
                <div className={styles.sortText}>收费任务:</div>
                <Select value={missionIdSelected} placeholder="选择收费任务" className={styles.sortSelect} onChange={handleChangeMission}>
                  {missionSelect}
                </Select>
              </Col>
              <Col span={12} className={styles.sortCol}>
                <div className={styles.sortTextW}>收费时段:</div>
                <RangePicker
                  showTime={{ format: 'HH:mm:ss', defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }}
                  defaultValue={[beginDate?moment(beginDate):'', endDate?moment(endDate):'']}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['开始时间', '结束时间']}
                  onChange={handleChangeDate}
                />
              </Col>
              <Col span={6} style={{ padding: '6px 0 5px 0', textAlign: 'right' }}>
                <Button onClick={handleResetQueryOrder} style={{ float: 'right' }}>重置</Button>
                <Button type="primary" onClick={handleQueryOrder} style={{ float: 'right', marginRight: '15px' }}>查询</Button>
                <OrderSort {...orderSortProps} />
              </Col>
            </Row>
            <Row style={{ marginTop: '5px' }}>
              {createSort()}
            </Row>
            <Divider style={{ margin: '10px' }} />
            <Row style={{ paddingTop: '10px' }}>
              <Button type="primary" style={{ marginRight: '15px' }} onClick={handleClickReceipitSetting}>票据设置</Button>
              <Button style={{ marginRight: '15px' }}><a target="_blank" href={getExportUrl()}>导出</a></Button>
              <Search enterButton placeholder="搜索" value={searchName} onChange={(value) => { handleChangeSearchName(value) }} onSearch={value => handleOnSearch(value)} style={{ width: 250, float: 'right' }} />
              <OrderDisplay {...orderDisplayProps} />
            </Row>
            <Row style={{ paddingTop: '10px' }}>
              <OrderTable {...orderTableProps} />
            </Row>
          </Card>
        </Col>
      </Row>
      {textData.imgUrl ? <Print textData={textData} getHeight={getHeight} templateHeight={templateHeight} settingData={settingData} /> : ''}
    </Page>
  )
}

Order.propTypes = {
  order: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default connect(({ order, app, loading }) => ({ order, app, loading }))(Order)

