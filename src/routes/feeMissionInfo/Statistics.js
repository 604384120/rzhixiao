import { Row, Col, Button, Input, Select, Tag, Divider, Icon, Popover, Spin, Checkbox, Dropdown, Menu, } from 'antd'
// import UserBillSort from './UserBillSort'
// import UserBillDisplay from './UserBillDisplay'
import StatisticsTable from './StatisticsTable'
import styles from '../common.less'
import { config } from 'utils'
import queryString from 'query-string'
import { getFormat, getSortParam, token } from 'utils'
import { UserSortLayer, BillSum, UserSort, UserDisplay, SortSelect, ExportTable } from 'components'

const { api, statDataMap, statDataList } = config
const Option = Select.Option
const Search = Input.Search
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const Statistics = ({
  missionId,
  missionInfo,
  statData,
  userDisplaySence,
  userAttrList,
  userAttrMap,
  isNavbar,
  displayUpdateState, displayReset, displayUpdate, displayAttrRelateList,
  //onGetAttrRelateList,
  onUpdateState,
  onGetBillList,
  // onResetUserAttr,
  // onUpdateUserAttr,
  onUpdateBills,
  onUpdateSort,
}) => {
  let {sortSence, displaySence, userSortExtra, statSence}  = statData
  statSence += "_" + missionId
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}
  const statDisplayList = userDisplaySence[statSence]&&userDisplaySence[statSence].displayList?userDisplaySence[statSence].displayList:[]

  const billQueryParam = {
    missionId,
    pageNum: statData.pageNum,
    pageSize: statData.pageSize,
    key: statData.searchName,
    sortList: userSortList,
    type: statData.type,
  }

  const userDisplayProps = {
    userAttrList,
    ...userDisplaySence[displaySence],
    onUpdateState (data) {
      displayUpdateState(data, displaySence)
    },
    onReset () {
      displayReset(displaySence)
    },
    onUpdate (data) {
      displayUpdate(data, displaySence)
    },
  }

  const userSortProps = {
    userAttrList,
    ...userDisplaySence[sortSence],
    displayExtra: userSortExtra,
    onUpdateState (data) {
      displayUpdateState(data, sortSence)
    },
    onReset () {
      displayReset(sortSence, userSortExtra)
    },
    onUpdate (data) {
      displayUpdate(data, sortSence)
    },
  }

  const structSelectProps = {
    dataLoading: statData.dataLoading,
		userSortMap,
    userAttrMap,
		styles,
		onGetSelectList (data) {
      displayAttrRelateList({ ...data }, sortSence,)
    },

    onChangeSort (value, attr) {
      onUpdateSort()  // 加蒙版
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
    totalBegin: statData.totalBegin,
    statData: statData.billStat,
    statList: statList,
    dataLoading: statData.spinning,
    styles,
    getFormat,
    type: '1',
    setting:{
      userAttrList:statDataList,
      ...userDisplaySence[statSence],
      onUpdateState (data) {
        displayUpdateState(data, statSence)
      },
      onReset () {
        displayReset(statSence)
      },
      onUpdate (data) {
        displayUpdate(data, statSence)
      },
    },
    step: statList.length<6?statList.length+1:6
  }

  const exportTableProps ={
    sence: 'statisticsMission',
    styles,
    formatVisible: statData.formatVisible,
    exportFormat: statData.exportFormat,
    onFormatVisibleChange (visible) {
      statData.formatVisible = visible;
      onUpdateState(statData)
    },
    onChangeFormat (format) {
      statData.exportFormat = format;
      onUpdateState(statData)
    },
    onGetExportUrl () {
      let tempParam = { ...billQueryParam }
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
      tempParam.sence = 'statisticsDisplay'
      tempParam.form = statData.exportFormat==2?2:1;
      let url = `${api.exportBills}?${queryString.stringify(tempParam)}`
      return url
    }
  }

  const statisticsTableProps = {
    dataSource: statData.list,
    userDisplayList,
    ...statData,
    onChangePage (n, s) {
      billQueryParam.pageNum = n
      billQueryParam.pageSize = s
      handleQueryBill()
    },
    onShowDerate (data) {
      statData.modalData = data
      for (let node of statData.modalData.feeBillListEntities) {
        node._discount = node.discount
        node._totalFee = node.totalFee
        node._fee = node.totalFee - node.discount
      }

      statData.modalVisible = true
     	onUpdateState(statData)
    },
  }

  // const onChangeType = (value) => {
  //   billQueryParam.type = value.target.checked ? '1' : ''
  //   billQueryParam.pageNum = 1
  //   handleQueryBill()
  // }

  const onChangeShowSum = (value) => {
    statData.showSum = value.target.checked
    onUpdateState(statData)
  }

  const handleQueryBill = () => {
    onGetBillList(billQueryParam)
  }

  const handleChangeSearchName = (value) => {
    statData.searchName = value.target.value
    onUpdateState(statData)
  }

  const handleResetQueryBill = () => {
    for (let sort of userSortList) {
      if (sort._idSelected) {
        delete sort._idSelected
      }
    }
    onUpdateState(statData)
    onUpdateSort()
  }

  const handleBillSearch = (name) => {
    if (name || statData.searchName) {
      billQueryParam.key = name
      handleQueryBill()
    }
  }

  const handleChangeDataType = (e) => {
    billQueryParam.type = e.key
    billQueryParam.pageNum = 1
    handleQueryBill()
  }

  const renderDataType = () => {
    let options = []
    for(let node in statData.dataTypeMap){
      options.push(<Menu.Item key={node}>{statData.dataTypeMap[node]}</Menu.Item>)
    }
    return (
      <Menu onClick={handleChangeDataType}>
      {options}
      </Menu>
    )
  }

  const createSort = () => {
		let i = 0
		const list = []
		
		for(let attr of userSortList){
      list.push({
        id:i++,
        content:(<SortSelect {...{...structSelectProps, attr}}/>)
      })
    }
	
		return list
  }

  const layerProps = {
    list: createSort(),
    query:(<div className={styles.queryBox}>
      <Button className={styles.inquery} type={statData.sortFlag==undefined||statData.sortFlag?"primary":''} loading={statData.dataLoading} onClick={handleQueryBill}>{statData.dataLoading?'':'查询'}</Button>
      <Button className={styles.reset} onClick={handleResetQueryBill} disabled={statData.dataLoading}>重置</Button>
      <UserSort {...userSortProps} className={styles.more}/>
      </div>),
  }
  return (
    <div>
      {statData.sortFlag&&<div className={styles.masking} style={{width:'120%'}}></div>}
      <UserSortLayer {...layerProps} />
      <Divider style={{ margin: '0 0 5px 0' }} />
      <div style={{ padding: '10px', textAlign: 'center' }}>
        <BillSum {...billSumProps}/>
      </div>
      <div style={{ padding: '10px 0px' }}>
        <Row>
          <ExportTable {...exportTableProps}/>
            {/* <Checkbox style={{ marginBottom:'10px' }} onChange={onChangeType}>仅显示欠费</Checkbox> */}
            {
                statData.dataLoading?<a disabled={true} className="ant-dropdown-link">{statData.dataTypeMap[statData.type]} <Icon type="down" /></a>:
                <Dropdown overlay={renderDataType()} trigger={['click']} style={{marginRight:'10px'}}>
                <a disabled={statData.dataLoading} className="ant-dropdown-link">{statData.dataTypeMap[statData.type]} <Icon type="down" /></a></Dropdown>
              }
            <Checkbox style={{ marginBottom:'10px',marginLeft:'10px' }} onChange={onChangeShowSum}>显示项目小计</Checkbox>
            <div style={{width: isNavbar?'100%':'250px',display:'inline-blck',float: 'right'}}>
            <Search enterButton placeholder="搜索" value={statData.searchName} onChange={(value) => { handleChangeSearchName(value) }} onSearch={value => handleBillSearch(value)} style={{ width: 'calc(100% - 50px)', float: 'right' }} />
            <UserDisplay {...userDisplayProps} />
            </div>
        </Row>
      </div>
      <div>
        <Col span={24}>
          <StatisticsTable {...statisticsTableProps} />
        </Col>
      </div>
    </div>
  )
}

export default Statistics
