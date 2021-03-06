import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Card, message, Divider, Select, Spin,  Menu, Input, Popover, Tabs, Popconfirm, Icon} from 'antd'
import { Page, UserSortLayer } from 'components'
import UserTable from './UserTable'
import UserModal from './UserModal'
import styles from '../common.less'
import { getFormat, getYearFormat } from 'utils'

const Option = Select.Option
const Search = Input.Search

const FeeRuleStand = ({
  location, dispatch, feeRuleStand, loading, app
}) => {
  const { isNavbar } = app
  const {
    modalVisible, modalType, modalData,
    pageNum, pageSize, subjectId, structId, structItemPid, departId, year, attrList, attrMap, departTreeList,
    dataList, count, dataLoading, selectedRules, batchData, copyData,
    subjectList, subjectMap, structList, yearList, searchName, userAttrList,
    selectedRelateId, 
    sortFlag
  } = feeRuleStand

  const queryParam = {
		pageNum,
		pageSize,
    subjectId,
    year,
    structId,
    pid: structItemPid._idSelected,
    name: searchName,
    selectedRelateId,
  }

  const userTableProps = {
    dataSource: dataList,
    count,
    pageNum,
    pageSize,
    dataLoading,
    structId,
    structList,
    attrId: subjectMap[subjectId]?subjectMap[subjectId].attrId:undefined,
    attrName: subjectMap[subjectId]?subjectMap[subjectId].attrName:undefined,
    subjectName: subjectMap[subjectId]?subjectMap[subjectId].name:undefined,
    selectedRules,
    onChangePage (n, s) {
      dispatch({
        type: 'feeRuleStand/getDataList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'feeRuleStand/updateState',
        payload: {
          ...data,
        },
      })
    },
    onSaveFee (data) {
      dispatch({
        type: 'feeRuleStand/updateRule',
        payload: [{
          subjectId,
          itemId: data.id,
          structId: structId,
          fee: Math.round(data._fee * 100).toString(),
          year: year
        }]
      })
    }
  }

  const userModalProps = {
    modalVisible,
    modalType,
    modalData,
    userAttrList,
    attrId: subjectMap[subjectId]?subjectMap[subjectId].attrId:undefined,
    attrName: subjectMap[subjectId]?subjectMap[subjectId].attrName:undefined,
    onSubmit (data) {
      dispatch({
        type: 'user/updateUserInfo',
        payload: {
          ...data,
        },
      })
      dispatch({
        type: 'user/hideModal',
      })
    },

    onClose () {
      dispatch({
        type: 'feeRuleStand/updateState',
        payload:{
          modalVisible: false
        }
      })
    },

    onUpdateState (data) {
      dispatch({
        type: 'feeRuleStand/updateState',
        payload: {
          ...data,
        },
      })
    },

    onGetUserAttrList () {
      dispatch({
        type: 'feeRuleStand/getUserAttrList',
        payload: {
        },
      })
    },

    onUpdateFeeRuleAttr(data) {
      dispatch({
        type: 'feeRuleStand/updateFeeRuleAttr',
        payload: {
          ...data,
          subjectId: subjectId,
          year,
          structId,
        },
      })
    },

    onGetAttrValueList() {
      dispatch({
        type: 'feeRuleStand/getAttrValueList',
        payload: {
          id: subjectMap[subjectId].attrId
        },
      })
    },

    onUpdateFeeRule(data) {
      dispatch({
        type: 'feeRuleStand/updateFeeRule',
        payload: {
          ...data,
        },
      })
    }
  }

  const handleAttrValueList = () => {
    dispatch({
      type: 'feeRuleStand/getAttrValueList',
      payload: {
        id: subjectMap[subjectId].attrId
      },
    })
  }

  const handleResetQuery = () => {
    let sort = null
    if(structList){
      for (let node of structList) {
        delete node._idSelected
        delete node._selectList
      }
    }
    if(attrList){
      for (let node of attrList) {
        if(node._idSelected){
          sort = true
        }
        delete node._idSelected
        delete node._selectList
      }
    }
    if(sort){
      dispatch({type: 'feeRuleStand/updateSort',payload:{structList}})  // ???????????????
    }else{
        dispatch({
        type: 'feeRuleStand/updateState',
        payload: {
          structList,
        },
      })
    }
  }

  const handleResetTable = () => {
      dispatch({
        type: 'feeRuleStand/delectRuleStand',
        payload: {
          year:year,
          subjectId:subjectId,
        },
      })
  }

  const handleQueryData = () => {
    if(!subjectId){
      message.error("???????????????")
      return
    }
    if(!structId){
      message.error("?????????????????????")
      return
    }
    dispatch({
      type: 'feeRuleStand/getDataList',
      payload: {
        ...queryParam,
        selectedRelateId
      },
    })
  }

  const handleFiltrateData = (value) => {
    dispatch({
      type: 'feeRuleStand/updateState',
      payload: {
        selectedRelateId : value
      },
    })
    if(!dataList){
      return
    }else{
      dispatch({
        type: 'feeRuleStand/getFiltrateDataList',
        payload: {
          ...queryParam,
          value
        },
      })
    }
  }
  
  const handleChangeSearchName = (value) => {
    dispatch({type: 'feeRuleStand/updateState',payload:{searchName: value.target.value}})
  }
  const handleSearch = (name) => {
		queryParam.name = name
		handleQueryData()
  }

  const handleChangeStruct = (value) => {
    dispatch({type: 'feeRuleStand/changeStruct',payload:{structId: value}})
  }
  const createStructOption = () => {
    const options = []
    options.push(<Option key={'0'} value={'0'} title={'????????????'}>????????????</Option>)
    if (structList) {
      for (let struct of structList) {
        if (struct.status == '1') {
          options.push(<Option key={struct.id} value={struct.id} title={struct.label}>{struct.label}</Option>)
        }
      }
    }
    return options
  }

  const handleClickSort = () => {
    if(!departTreeList || departTreeList.length<=0){
      dispatch({
        type: 'feeRuleStand/getDepartTreeList',
      })
    }
  }

  const handleChangeDepart = (value) => {
    dispatch({
      type: 'feeRuleStand/getSubjectList',
      payload:{
        departId: value,
      },
    })
  }

  const handleChangeYear = (value) => {
    dispatch({type: 'feeRuleStand/updateState',payload:{year: value}})
    queryParam.year = value
    queryParam.pageNum = 1
    dispatch({
      type: 'feeRuleStand/changeSubject',
      payload:{
        ...queryParam
      },
    })
  }
  
  const createDepartOption = () => {
    const options = [];
    if(departTreeList){
      for(let index of departTreeList){
        options.push(<Option key={index.id} value={index.id} title={index.label}>{index.label}</Option>)
      }
    }
		return options;
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

  const handleChangeSubject = (index) => {
    queryParam.subjectId = index
    queryParam.pageNum = 1
    dispatch({
      type: 'feeRuleStand/changeSubject',
      payload:{
        ...queryParam
      },
    })
	}

  const clickStructItem = (struct) => {
    dispatch({
      type: 'feeRuleStand/getAllItemList',
      payload: {
        structId: struct.id,
        itemPid: structItemPid,
      },
    })
  }
  const handleChangeStructItem = (value, struct) => {
    dispatch({
      type: 'feeRuleStand/changeStructItem',
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
  
  const handleChangeCopyVisible = (visible) => {
    if(visible == false){
      return
    }
    copyData.visible = visible
    dispatch({
      type: 'feeRuleStand/updateState',
      payload: {
        copyData
      },
    })
	}

	const handleCloseCopy = () => {
		copyData.visible = false
		copyData.year = undefined
		dispatch({
      type: 'feeRuleStand/updateState',
      payload: {
        copyData
      },
    })
  }

  const handleSaveCopy = () => {
    if(!copyData.year){
      message.error("???????????????");
			return
    }
    dispatch({
      type: 'feeRuleStand/copyRuleStand',
      payload: {
        srcYear: copyData.year,
        dstYear: year
      },
    })
  }
  
  const handleChangeCopyYear = (value) => {
    copyData.year = value
    dispatch({type: 'feeRuleStand/updateState',payload:{copyData}})
	}
  const createCopyYearOption = () => {
    const options = [];
    if(yearList){
      for(let index of yearList){
        if(index.year != year){
          options.push(<Option key={index.year} value={index.year} title={getYearFormat(index.year)}>{getYearFormat(index.year)}</Option>)
        }
      }
    }
		return options;
  }

  const hanldeShowRuleAttr = () => {
    dispatch({
      type: 'feeRuleStand/updateState',
      payload: {
        modalVisible:true,
        modalType:'attr',
        modalData:{}
      },
    })
  }

  const handleChangeAttrValueSort = (value, attr) => {
    attrMap[attr.attrId]._idSelected = value
    dispatch({type: 'feeRuleStand/updateSort',payload:{attrMap}})  //??????????????????????????????
  }

  const createAttrValueSortOption = (attr) => {
    const options = []
    if (attr.userAttrValueEntities) {
		  for (let select of attr.userAttrValueEntities) {
        options.push(<Option key={select.id} value={select.value} title={select.value}>{select.value}</Option>)
		  }
		  return options
    }
    return null
  }

  const handleShowBatch = () => {
    let relateList = []
    let relateMap = {}
    let itemList = []
    for(let index of selectedRules){
      let itemId = dataList[index].id
      itemList.push(itemId)
      for(let node of dataList[index].feeList){
          if(!relateMap[node.relateId]){
            let temp = {
              fee: node.fee,
              subjectId,
              subjectName: subjectMap[subjectId]?subjectMap[subjectId].name:undefined,
              structId,
              year,
              relateId: node.relateId,
              relateName: node.relateName
            }
              relateList.push(temp)
            relateMap[node.relateId] = temp
          }
      }
    }
    if(subjectMap[subjectId] && subjectMap[subjectId].attrId &&(!selectedRelateId || selectedRelateId.length==0) ){
      relateList.push({
        fee: '',
        subjectId,
        subjectName: subjectMap[subjectId]?subjectMap[subjectId].name:undefined,
        structId,
        year,
        relateId: undefined,
        relateName: undefined,
        _add: 1
      })
    }
    modalData.relateList = relateList
    modalData.relateMap = relateMap
    modalData.itemList = itemList
    dispatch({
      type: 'feeRuleStand/updateState',
      payload: {
        modalType: 'fee',
        modalVisible: true,
        modalData,
      },
    })
  }

  const createSort = () => {
    let i = 0
    const list = [
      {
        id:i++,
        content:(
          <div className={styles.sortCol} >
            <div className={styles.sortText}>??????:</div>
                <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} defaultValue={departId} value={departId} className={styles.sortSelectMuti} placeholder={"????????????"} onFocus={handleClickSort} onChange={handleChangeDepart}>
                {createDepartOption()}
                </Select>
          </div>
        )
      },{
        id:i++,
        content:(
          <div className={styles.sortCol}>
            <div className={styles.sortText}>??????:</div>
            <Select disabled={dataLoading || (subjectId?false:true)} value={year} className={styles.sortSelectMuti} placeholder={"????????????"} showSearch
              optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={handleChangeYear}>
            {createYearOption()}
            </Select>
          </div>
        ),
      },{
        id:i++,
        content:(
          <div className={styles.sortCol}>
             <span className={styles.sortNorm}
                >???</span>
              <Select disabled={dataLoading || (subjectId?false:true)} value={structId} style={{ width: '55%', marginBottom: '5px' }} onChange={handleChangeStruct}>
                {createStructOption()}
              </Select>
            <span style={{ marginLeft: '6px' }}>??????</span>
          </div>
        )
      },{
        id:i++,
        content:subjectMap[subjectId]&&subjectMap[subjectId].attrId!=undefined?
          <div className={styles.sortCol} >
            <span className={styles.sortNorm}
            >???</span>
            <Select disabled={true} value={subjectMap[subjectId].attrName} style={{ width: 'calc(100% - 140px)', marginBottom: '5px' }}></Select>
            <span style={{ marginLeft: '6px' }}>??????</span>
            <Popover content={<div style={{width:'170px'}}>????????????????????????????????????????????????????????????</div>} placement="bottom"><Icon style={{marginLeft:'5px'}} type='question-circle-o'/></Popover>
          </div>
          :<div style={{textAlign: 'center', paddingTop:'5px', marginBottom:'13px'}}>
            <div style={{border:'1px dashed #1890ff', borderRadius:'5px', height:"30px", width:'210px', margin:'auto', padding:'4px 0 5px 0'}}>
            <a style={{fontSize:'13px'}} disabled={subjectId?false:true} onClick={hanldeShowRuleAttr}><Icon type="plus"/>??????????????????</a>
            </div>
          </div>
      }
    ]
    
    if(subjectId&&structId&&structId!="0"){
      for(let struct of structList){
        if (struct.id == structId) {
          break
        }
        list.push({
          id:i++,
          content:(<div className={styles.sortCol}>
          <div className={styles.sortText}>{struct.label}:</div>
          <Select allowClear
            disabled={dataLoading}
            value={struct._idSelected}
            className={styles.sortSelectMuti}
            placeholder={`??????${struct.label}`}
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
    }

    if(subjectId&&attrList&&structId!="0"){
      for(let attr of attrList){
        list.push({
          id:i++,
          content:(<div className={styles.sortCol}>
          <div className={styles.sortText}>{attr.attrName}:</div>
          <Select mode="multiple"
            disabled={dataLoading}
            allowClear
            optionFilterProp="children"
            value={attr._idSelected}
            className={styles.sortSelectMuti}
            placeholder={`??????${attr.attrName}`}
            onChange={value => handleChangeAttrValueSort(value, attr)}
          >
            {createAttrValueSortOption(attr)}
          </Select>
        </div>)
        })
      }
    }

    return list
    
  }
  const layerProps = {
    list: createSort(),
    query:(<div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden',textAlign: 'right' }}>
      <Button disabled={subjectId?false:true} type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQueryData} style={{ marginRight: '10px',verticalAlign:'middle',width:'62px' }}>{dataLoading?'':'??????'}</Button>
      <Button onClick={handleResetQuery} disabled={dataLoading} style={{ marginRight: '10px',verticalAlign:'middle' }}>??????</Button>
      <Popover
        content={
          <div style={{'width':"250px"}}>
            <div className={styles.sortText}>??????:</div>
            <Select disabled={dataLoading} value={copyData.year} className={styles.sortSelectMuti} placeholder={"????????????"} showSearch
              optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={handleChangeCopyYear}>
              {createCopyYearOption()}
            </Select>
            <div style={{marginTop:'10px', color:'red', textAlign:'center', fontSize:'12px'}}>*????????????????????????{year}-{parseInt(year)+1}????????????????????????????????????</div>
            <div style={{marginTop:'10px'}}>
              <Button style={{marginLeft:'60px'}} size='small' onClick={()=>handleCloseCopy()}>??????</Button>
              <Button style={{marginLeft:'40px'}} size='small' onClick={()=>handleSaveCopy()} type="primary">??????</Button>
            </div>
          </div>
        }
        title={"?????????????????????????????????"}
        trigger="click"
        placement="left"
        visible={copyData.visible}
        onVisibleChange={(visible)=>{handleChangeCopyVisible(visible)}}
      ><Button disabled={dataLoading} style={{ marginRight: '8%',verticalAlign:'middle' }}>??????</Button></Popover>
    </div>),
  }

  const renderSubjectList = () => {
    const menuList = []
    if(subjectList){
      for(let subject of subjectList){
        if(isNavbar){
          menuList.push(
            <Tabs.TabPane key={subject.id} tab={subject.name}/>
          )
        }else{
          menuList.push(
            <Menu.Item key={subject.id}>{subject.name}</Menu.Item>
          )
        }
      }
      return menuList
    }
    return null
  }

  const createRelateOption = () => {
    const options = []
    if (modalData._attrValueList) {
      for (let select of modalData._attrValueList) {
          options.push(<Option key={select.id} style={{ width: 'auto' }} value={select.id} title={select.value}>{select.value}</Option>)
      }
      return options
    }
    return null
  }

  return (
    <Page inner>
      {sortFlag&&<div style={{backgroundColor:"rgba(240, 242, 245, 0.5)", zIndex:800, position:'absolute', width:'120%', height:'100%', margin:'-24px'}}></div>}
      <Row gutter={16}>
        <Col>
          <Card bordered={false} bodyStyle={{ padding: ' 0' }}>
            <div>
            <Divider style={{ margin: '5px' }} dashed />
            <UserSortLayer {...layerProps}/>
            <Divider style={{ margin: '5px' }} dashed />
            <Row>
              {
                isNavbar? <div style={{width:'100%'}}>
                <div><Tabs defaultActiveKey="1" activeKey={subjectId} animated={false} onChange={handleChangeSubject}>{renderSubjectList()}</Tabs>
                </div>
                </div>: <div style={{width:'200px',minHeight:'200px',float:'left'}}>
              <div><Menu style={{width:'92%'}} mode={"inline"} selectedKeys={[subjectId]} onClick={(e)=>handleChangeSubject(e.key)}>{renderSubjectList()}</Menu>
              </div>
              </div>
              }
              <div style={isNavbar?{width:"100%", marginTop:'10px'}:{float:'left',width:'calc(100% - 200px)'}}>
              <Row>
                    <Button type="primary" style={{ marginBottom: '10px' }} disabled={selectedRules.length == 0} onClick={handleShowBatch}>????????????</Button>
                    <Popconfirm title="????????????????????????????????????" onConfirm={handleResetTable} okText="??????" cancelText="??????"><Button style={{ margin: '0px 10px 10px 10px' }}>????????????</Button></Popconfirm>
                  {subjectMap[subjectId]&&subjectMap[subjectId].attrId!=undefined?
                 <Select style={{width:isNavbar?'100%':'300px',marginBottom: '10px'}}
                    mode="multiple"
                    labelInValue
                    allowClear
                    value={selectedRelateId?selectedRelateId:undefined}
                    showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    placeholder={`??????${subjectMap[subjectId].attrName}`}
                    notFoundContent={!modalData._attrValueList ? <Spin size="small" /> : "?????????"}
                    onFocus={() => handleAttrValueList()}
                    onChange={(value)=>handleFiltrateData(value)}
                  >
                    {createRelateOption()}
                  </Select>:''}
                  <Search disabled={subjectId?false:true} enterButton placeholder="??????" value={searchName} onChange={(value) => { handleChangeSearchName(value) }} onSearch={value => handleSearch(value)} style={{ width: isNavbar?'100%':'200px', float: 'right', marginBottom: '10px' }} />
              </Row>
              <Row><UserTable {...userTableProps} /></Row>
              </div>
            </Row>
            </div>
          </Card>
        </Col>
        { modalVisible && <UserModal {...userModalProps} /> }
      </Row>
    </Page>
  )
}

FeeRuleStand.propTypes = {
  feeRuleStand: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ feeRuleStand, app, loading }) => ({ feeRuleStand, app, loading }))(FeeRuleStand)
