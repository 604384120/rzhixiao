import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, InputNumber, Card, Input, message, Divider, Select, Spin, Popover } from 'antd'
import { Page, UserSortLayer } from 'components'
import UserTable from './UserTable'
import styles from '../common.less'

const Option = Select.Option
const Search = Input.Search
const CreditRule = ({
  location, dispatch, creditRule, loading, app
}) => {
  const { isNavbar } = app
  const {
    pageNum, pageSize, structId, structItemPid,
    dataList, count, dataLoading, selectedRules, searchName, batchVisible, batchFee,
    structList,
    sortFlag
  } = creditRule


  const queryParam = {
	  pageNum,
    pageSize,
    name: searchName,
    structId,
    pid: structItemPid._idSelected,
  }

  const userTableProps = {
    dataSource: dataList,
    count,
    pageNum,
    pageSize,
    dataLoading,
    structId,
    structList,
    selectedRules,
    onChangePage (n, s) {
      dispatch({
        type: 'creditRule/getDataList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'creditRule/updateState',
        payload: {
         ...data
        },
      })
    },
    onSaveFee (data) {
      dispatch({
        type: 'creditRule/updateRule',
        payload: {
          structId: structId,
          structItemId: [data.id],
          fee: data._fee
        },
      })
    },
  }

  const handleResetQuery = () => {
    for (let node of structList) {
      delete node._idSelected
      delete node._selectList
    }
    dispatch({type: 'creditRule/updateSort',payload:{structList}})    //重置加蒙版
    // dispatch({
    //   type: 'creditRule/updateState',
    //   payload: {
    //     structList,
    //   },
    // })
  }

  const handleQueryData = () => {
    if(!structId){
      message.error("请选择统计类型")
      return
    }
    dispatch({
      type: 'creditRule/getDataList',
      payload: {
        ...queryParam,
      },
    })
  }
  
  const handleChangeStruct = (value) => {
    dispatch({type: 'creditRule/changeStruct',payload:{structId: value}})
	}
  const createStructOption = () => {
    const options = []
    if (structList) {
      for (let struct of structList) {
        if (struct.status == '1') {
          options.push(<Option key={struct.id} value={struct.id} title={struct.label}>{struct.label}</Option>)
        }
      }
    }
    return options
  }

  const handleChangeFeeEditVisible = (value) => {
    dispatch({
      type: 'creditRule/updateState',
      payload: {
        batchVisible: value,
      },
    })
  }
  const handleCloseFeeEdit = () => {
    dispatch({
      type: 'creditRule/updateState',
      payload: {
        batchVisible: false,
      },
    })
  }
  const handleChangeFee = (value) => {
    dispatch({
      type: 'creditRule/updateState',
      payload: {
        batchFee: value,
      },
    })
  }
  const handleSaveFee = () => {
    dispatch({
      type: 'creditRule/updateRule',
      payload: {
        structId: structId,
        structItemId: selectedRules,
        fee: batchFee
      },
    })
  }

  const handleSearch = (name) => {
		if(name || searchName){
			queryParam.name = name;
      handleQueryData()
		}
	}

  const handleChangeSearchName = (value) => {
    dispatch({
      type: 'creditRule/updateState',
      payload: {
        searchName: value.target.value
      },
    })
  }

  const clickStructItem = (struct) => {
    dispatch({
      type: 'creditRule/getAllItemList',
      payload: {
        structId: struct.id,
        itemPid: structItemPid,
      },
    })
  }
  const handleChangeStructItem = (value, struct) => {
    dispatch({
      type: 'creditRule/changeStructItem',
      payload: {
        structId: struct.id,
        id: value,
      },
    })
  }
  const createStructItemOption = (struct) => {
    const options = []
    if (struct._selectList) {
      for (let select of struct._selectList) {
        options.push(<Option key={select.id} value={select.id} title={select.name}>{select.name}</Option>)
      }
      return options
    }
    return null
  }

  const createSort = () => {
    let i = 0
    const list = [
      {
        id:i++,
        content:(
          <div className={styles.sortCol}>
            <span className={styles.sortNorm}>按</span>
            <Select disabled={dataLoading} value={structId} style={{ width: '50%' }} onChange={handleChangeStruct}>
              {createStructOption()}
            </Select>
            <span style={{ marginLeft: '6px' }}>设置</span>
          </div>
        ),
      }
    ]
    for(let struct of structList){
      if (!structId || struct.id == structId) {
        break
      }
      i++
      list.push({
        id:i,
        content:(<div className={styles.sortCol}>
                  <div className={styles.sortText}>{struct.label}:</div>
                  <Select allowClear
                    disabled={dataLoading}
                    value={struct._idSelected}
                    className={styles.sortSelectMuti}
                    placeholder={`选择${struct.label}`}
                    showSearch optionFilterProp="children"
                    onFocus={() => clickStructItem(struct)}
                    onChange={value => handleChangeStructItem(value, struct)}
                    notFoundContent={!struct._selectList ? <Spin size="small" /> : null}
                  >
                  {createStructItemOption(struct)}
                  </Select>
                </div>)
              })
      }
      return list
  }

  const layerProps = {
    list: createSort(),
    query:(<div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden',textAlign: 'right' }}>
      <Button type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQueryData} style={{ marginRight: '10px',verticalAlign:'middle',width:'62px' }}>{dataLoading?'':'确定'}</Button>
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
            <Row style={{ marginTop: '20px' }}>
              <Col span={10}>
              <Popover
                content={
                  <div style={{'width':"150px"}}>
                    <InputNumber style={{width:'100%'}} min={0} value={batchFee} onChange={(value)=>{handleChangeFee(value)}}/>
                    <div style={{marginTop:'10px'}}>
                    <Button style={{marginLeft:'50px'}} size='small' onClick={()=>handleCloseFeeEdit()}>取消</Button>
                    <Button style={{marginLeft:'5px'}} size='small' onClick={()=>handleSaveFee()} type="primary">保存</Button>
                    </div>
                  </div>
                }
                title={"批量设置金额"}
                trigger="click"
                visible={batchVisible}
                onVisibleChange={(visible)=>{handleChangeFeeEditVisible(visible)}}
              >
              <Button type="primary" style={{ marginBottom: '10px' }} disabled={selectedRules.length == 0}>批量设置</Button>
              </Popover>
              </Col>
              <Col span={isNavbar?24:6} style={{float:'right'}}>
                <Search enterButton placeholder="搜索" value={searchName} onChange={(value) => { handleChangeSearchName(value) }} onSearch={value => handleSearch(value)} style={{ width: '100%', float: 'right', marginBottom: '10px' }} />
              </Col>
            </Row>
            <Row><UserTable {...userTableProps} /></Row>
            </div>
          </Card>
        </Col>
      </Row>
    </Page>
  )
}

CreditRule.propTypes = {
  creditRule: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ creditRule, app, loading }) => ({ creditRule, app, loading }))(CreditRule)
