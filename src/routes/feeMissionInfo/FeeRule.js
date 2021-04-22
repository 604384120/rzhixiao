import React from 'react'
import { Row, Col, Button, Input, Select, message, Divider, Icon, Spin } from 'antd'
import FeeRuleTable from './FeeRuleTable'
import FeeRuleModal from './FeeRuleModal'
import styles from '../common.less'
import { UserSortLayer } from 'components'

const Option = Select.Option
const Search = Input.Search

const FeeRule = ({
  missionId,
  missionInfo,
  subjectMap,
  ruleData,
  user,
  menuMap,
  isNavbar,
  userAttrList,
  onUpdateState,
  onGetRuleList,
  onGetAllItemList,
  onChangeStructItemSort,
  onUpdateRule,
  onChangeStruct,
  onChangeSubject,
  onGetUserAttrList,
  onUpdateFeeRuleAttr,
  onGetAttrValueList,
  onUpdateFeeRule,
  onUpdateSort
}) => {
  const queryParam = {
    missionId,
    subjectId: ruleData.subjectIdSelected,
    structId: ruleData.structIdSelected,
    pageNum: ruleData.pageNum,
    pageSize: ruleData.pageSize,
    name: ruleData.searchName,
    pid: ruleData.structItemPidSelected?ruleData.structItemPidSelected._idSelected:'',
  }

  const feeRuleTableProps = {
    dataSource: ruleData.list,
    missionInfo,
    subjectMap,
    user,
    attrId: subjectMap[ruleData.subjectIdSelected]?subjectMap[ruleData.subjectIdSelected].attrId:undefined,
    attrName: subjectMap[ruleData.subjectIdSelected]?subjectMap[ruleData.subjectIdSelected].attrName:undefined,
    subjectName: subjectMap[ruleData.subjectIdSelected]?subjectMap[ruleData.subjectIdSelected].name:undefined,
    ...ruleData,
    onChangePage (n, s) {
      queryParam.pageNum = n
      queryParam.pageSize = s
      handleQueryRule()
    },
    onUpdateState (data) {
      onUpdateState({ ...ruleData, ...data })
    },
    onChangeDataSource (data) {
      ruleData.list = data
      onUpdateState(ruleData)
    },
    onSaveFee (data) {
      onUpdateRule([{
        subjectId: data.id,
        missionId,
        itemId: data._pnode.id,
        structId: ruleData.structIdSelected,
        fee: Math.round(data._fee * 100).toString(),
      }])
    },
  }

  const feeRuleModalProps = {
    ...ruleData,
    subjectMap,
    missionInfo,
    userAttrList,
    attrId: subjectMap[ruleData.subjectIdSelected]?subjectMap[ruleData.subjectIdSelected].attrId:undefined,
    attrName: subjectMap[ruleData.subjectIdSelected]?subjectMap[ruleData.subjectIdSelected].attrName:undefined,
    subjectName: subjectMap[ruleData.subjectIdSelected]?subjectMap[ruleData.subjectIdSelected].name:undefined,
    onClose () {
      ruleData.modalVisible = false
      onUpdateState(ruleData)
    },
    onGetUserAttrList(){
      onGetUserAttrList()
    },
    onUpdateState(data){
      onUpdateState({ ...ruleData, ...data })
    },
    onUpdateFeeRuleAttr(data){
      onUpdateFeeRuleAttr({
        ...data,
        subjectId: ruleData.subjectIdSelected,
        missionId
      })
    },
    onGetAttrValueList(){
      onGetAttrValueList({
        id: subjectMap[ruleData.subjectIdSelected].attrId
      })
    },
    onUpdateFeeRule(data) {
      onUpdateFeeRule(data)
    }
  }

  const createSubjectOption = () => {
    const options = []
    for (let subject in subjectMap) {
      if(subjectMap[subject].subType != '2'){
        options.push(<Option key={subject} value={subject} title={subjectMap[subject].name}>{subjectMap[subject].name}</Option>)
      }
    }
    return options
  }

  const handleChangeSubject = (value) => {
    ruleData.subjectIdSelected = value
    onChangeSubject(value)
    //onUpdateState(ruleData)
  }

  const createStructOption = () => {
    const options = []
    //统一设置
    options.push(<Option key={'0'} value={'0'}>统一标准</Option>)
    if (ruleData.structList) {
      for (let struct of ruleData.structList) {
        if (struct.status == '1') {
          options.push(<Option key={struct.id} value={struct.id} title={struct.label}>{struct.label}</Option>)
        }
      }
    }
    return options
  }

  const handleQueryRule = () => {
    if (!ruleData.subjectIdSelected) {
		  message.error('请选择收费项目!')
		  return
    }
    if (ruleData.structIdSelected == undefined) {
		  message.error('请选择层级!')
		  return
    }
    onGetRuleList(queryParam)
  }

  const handleSearch = (name) => {
    if (name || ruleData.searchName) {
		  queryParam.name = name
		  handleQueryRule()
    }
  }

  const handleClearQueryParam = () => {
    for (let node of ruleData.attrList) {
      delete node._idSelected
      delete node._selectList
    }

    for (let node of ruleData.structList) {
      delete node._idSelected
      delete node._selectList
    }

    ruleData.structItemPidSelected = {}
    ruleData.searchName = ''
    onUpdateState(ruleData)
    onUpdateSort()
  }

  const handleChangeStruct = (value) => {
    onChangeStruct(value)
  }

  const hanldeShowRuleAttr = () => {
    ruleData.ModalType = 'attr'
    ruleData.modalVisible = true
    ruleData.modalData = {}
    onUpdateState(ruleData)
  }

  const handleChangeSearchName = (value) => {
    ruleData.searchName = value.target.value
    onUpdateState(ruleData)
  }

  const handleClickBatch = () => {
    let relateList = []
    let relateMap = {}
    let itemList = []
    for(let index of ruleData.selectedRules){
      let itemId = ruleData.list[index].id
      itemList.push(itemId)
      for(let node of ruleData.list[index].feeList){
        if(!relateMap[node.relateId]){
          let temp = {
            fee: node.fee,
            subjectId: ruleData.subjectIdSelected,
            subjectName: subjectMap[ruleData.subjectIdSelected]?subjectMap[ruleData.subjectIdSelected].name:undefined,
            structId: ruleData.structIdSelected,
            relateId: node.relateId,
            relateName: node.relateName,
            _disabled: ruleData.selectedRules.length==1?((node.fee||ruleData.list[index].feeList.length>1)?true:false):false
          }
          //if(node.relateId != '0'){
          relateList.push(temp)
          //}
          relateMap[node.relateId] = temp
        }
      }
    }
    //relateList.unshift(relateMap['0'])
    if(subjectMap[ruleData.subjectIdSelected] && subjectMap[ruleData.subjectIdSelected].attrId){
      relateList.push({
        fee: 0,
        subjectId: ruleData.subjectIdSelected,
        subjectName: subjectMap[ruleData.subjectIdSelected]?subjectMap[ruleData.subjectIdSelected].name:undefined,
        structId: ruleData.structIdSelected,
        relateId: undefined,
        relateName: undefined,
        _add: 1
      })
    }

    ruleData.modalData = {
      relateList,
      relateMap,
      itemList
    }
    ruleData.ModalType = 'batch'
    ruleData.modalVisible = true
    onUpdateState(ruleData)
  }

  const handleClickSort = (struct) => {
    let data = {
      structId: struct.id,
      itemPid: ruleData.structItemPidSelected,
    }
    onGetAllItemList(data)
	}

  const handleChangeStructItemSort = (value, struct) => {
    onChangeStructItemSort({ structId: struct.id, id: value })
  }

  const createStructItemSortOption = (struct) => {
    const options = []
    if (struct._selectList) {
      for (let select of struct._selectList) {
        options.push(<Option key={select.id} value={select.id} title={select.name}>{select.name}</Option>)
      }
      return options
    }
    return null
  }

  const handleChangeAttrValueSort = (value, attr) => {
    ruleData.attrMap[attr.attrId]._idSelected = value
    onUpdateState(ruleData)
    onUpdateSort()    //类别加蒙版
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

  const createSort = () => {
    let i = 0
    const list = [
      {
        id:i++,
        content:(
          <div className={styles.sortCol}>
            <div className={styles.sortText}>收费项目:</div>
            <Select disabled={ruleData.dataLoading} showSearch optionFilterProp="children" value={ruleData.subjectIdSelected} placeholder="选择收费项目" className={styles.sortSelectMuti} onChange={handleChangeSubject}>
              {createSubjectOption()}
            </Select>
          </div>
        ),
      },{
        id:i++,
        content:ruleData.subjectIdSelected?<div className={styles.sortCol}>
            <span className={styles.sortNorm}>按</span>
            <Select disabled={ruleData.dataLoading} value={ruleData.structIdSelected} style={{ width: '50%' }} onChange={handleChangeStruct}>
              {createStructOption()}
            </Select>
            <span style={{ marginLeft: '6px' }}>设置</span>
          </div>:<div className={styles.sortCol}></div>
      },{
        id:i++,
        content:ruleData.subjectIdSelected?(subjectMap[ruleData.subjectIdSelected]&&subjectMap[ruleData.subjectIdSelected].attrId!=undefined?
          <div className={styles.sortCol} >
           <span className={styles.sortNorm}
              >按</span>
              <Select disabled={true} value={subjectMap[ruleData.subjectIdSelected].attrName} style={{ width: '50%' }}></Select>
              <span style={{ marginLeft: '6px' }}>设置</span>
          </div>
          :<div style={{textAlign: 'center', paddingTop:'5px', marginBottom:'13px'}}>
            <div style={{border:'1px dashed #1890ff', borderRadius:'5px', height:"30px", width:'210px', margin:'auto', padding:'4px 0 5px 0'}}>
            <a style={{fontSize:'13px'}} disabled={menuMap['/feeRuleStand']==undefined} onClick={hanldeShowRuleAttr}><Icon type="plus"/>添加设置方式</a>
            </div>
          </div>):<div className={styles.sortCol}></div>
      }
    ]
    
    if(ruleData.structIdSelected&&ruleData.structIdSelected!='0'){
      for(let struct of ruleData.structList){
        if (struct.id == ruleData.structIdSelected) {
          break
        }
        list.push({
          id:i++,
          content:(<div className={styles.sortCol}>
         <div className={styles.sortText}>{struct.label}:</div>
          <Select allowClear
            showSearch optionFilterProp="children"
            disabled={ruleData.dataLoading}
            value={struct._idSelected}
            className={styles.sortSelectMuti}
            placeholder={`选择${struct.label}`}
            onFocus={() => handleClickSort(struct)}
            onChange={value => handleChangeStructItemSort(value, struct)}
            notFoundContent={!struct._selectList ? <Spin size="small" /> : null}
          >
            {createStructItemSortOption(struct)}
          </Select>
        </div>)
        })
      }
    }

    if(ruleData.attrList&&ruleData.structIdSelected!='0'){
      for(let attr of ruleData.attrList){
        list.push({
          id:i++,
          content:(<div className={styles.sortCol}>
            <div className={styles.sortText}>{attr.attrName}:</div>
            <Select mode="multiple"
            disabled={ruleData.dataLoading}
            allowClear
            value={attr._idSelected}
            className={styles.sortSelectMuti}
            placeholder={`选择${attr.attrName}`}
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
        <Button type={ruleData.sortFlag==undefined||ruleData.sortFlag?"primary":''} loading={ruleData.dataLoading} style={{ marginRight: '20px',verticalAlign:'middle',width:'62px' }} onClick={handleQueryRule}>{ruleData.dataLoading?'':'查询'}</Button>
        <Button style={{ marginRight: '10px',verticalAlign:'middle' }} disabled={ruleData.dataLoading} onClick={handleClearQueryParam}>重置</Button>
      </div>),
  }

  return (
    <div>
      {ruleData.sortFlag&&<div style={{backgroundColor:"rgba(240, 242, 245, 0.5)", zIndex:800, position:'absolute', width:'120%', height:'100%', margin:'-24px'}}></div>}
      <UserSortLayer {...layerProps}/>
      <Divider style={{margin:'10px'}} />
      <Row style={{paddingTop:'10px'}}>
        {menuMap['/feeRuleStand']!=undefined&&<Button type="primary" style={{marginBottom:'10px'}} disabled={ruleData.selectedRules.length == 0} onClick={handleClickBatch}>设置标准</Button>}
        <Search enterButton placeholder="搜索" value={ruleData.searchName} onChange={(value) => { handleChangeSearchName(value) }} onSearch={value => handleSearch(value)} style={{  width:isNavbar?'100%':'200px', float: 'right'}} />
      </Row>
      <Row style={{paddingTop:'10px'}}>
        <Col span={24}>
          <FeeRuleTable {...feeRuleTableProps} />
        </Col>
      </Row>
      { ruleData.modalVisible && <FeeRuleModal {...feeRuleModalProps} />}
    </div>

  )
}

export default FeeRule
