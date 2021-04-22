import { Row, Col, Modal, Button, message, InputNumber, Input, Spin, Icon, Progress,Checkbox, Pagination, Popover, Tag, Divider, Table, DatePicker, Select, Dropdown, Menu, } from "antd";
import { config, getFormat, getSortParam, token } from 'utils'
import styles from './index.less'
import { UserSort, UserDisplay, UserSortLayer, BillSum, TableCom, SortSelect, ExportTable } from 'components'
import queryString from 'query-string'

const { api, statDataMap, statDataList  } = config
const { Option } = Select
const { Search } = Input
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const UserModal = ({
	modalData, modalVisible, modalType, isNavbar,
	userSortProps, userDisplayProps, userSortMap, userSortList, userAttrMap, userDisplayList, userDisplaySence,
	displayUpdateState, displayReset, displayUpdate, sortSence,
	onClose,
	onGetAttrRelateList,
	onUpdateState,
	onGetDetail,
	onGetStatistics,
	}) => {
		if(!modalData){
			return
		}

		let {statSence}  = modalData
		statSence += "_" + modalData.missionId
		const statDisplayList = userDisplaySence[statSence]&&userDisplaySence[statSence].displayList?userDisplaySence[statSence].displayList:[]
	
		let statList = []
		if(statDisplayList){
			for(let node of statDisplayList){
				if(statDataMap[node.id]){
					statList.push(statDataMap[node.id])
				}
			}
		}

		const structSelectProps = {
			dataLoading: modalData.dataLoading,
			userSortMap,
			userAttrMap,
			styles,
			onGetSelectList (data) {
				onGetAttrRelateList (data)
			},

			onChangeSort (value, attr) {
				onUpdateState()
			},
		}

		const billSumProps = {
			totalBegin: modalData.totalBegin,
			statData: modalData.stat,
			statList: statList,
			dataLoading: modalData.spinning,
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

		const exportTableProps = {
			sence: 'statisticsMission',
			styles,
			formatVisible: modalData.formatVisible,
			exportFormat: modalData.exportFormat,
			onFormatVisibleChange (value) {
				modalData.formatVisible = value
				onUpdateState({modalData})
			},
			onChangeFormat (value) {
				modalData.exportFormat = value
				onUpdateState({modalData})
			},
			onGetExportUrl () {
				let tempParam = {
					missionId: modalData.info.missionId,
					sortList: userSortList,
					key: modalData.key,
					type: modalData.type
				}
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
				tempParam.form = modalData.exportFormat==2?2:1;
				tempParam.type = modalData.type
				let url = `${api.exportBills}?${queryString.stringify(tempParam)}`
				return url
			}
		}
		  
		const handleQueryData = (data) => {
			if(modalType == 1){
				onGetDetail({
					missionId: modalData.info.missionId,
					sortList: userSortList,
					key: modalData.key,
					pageNum: modalData.pageNum,
          pageSize: modalData.pageSize,
          type:data.dataType?data.dataType:modalData.dataType
				})
			}else{
				onGetStatistics({
					missionId: modalData.info.missionId,
					sortList: userSortList,
					type: modalData.type,
				})
			}
		}
		const handleResetQuery = () => {
			for (let sort of userSortList) {
				if (sort._idSelected) {
					sort._idSelected = []
				}
			}
			onUpdateState({modalData})
		}

		const handleChangeDataType = (e) => {
			modalData.dataType = e.key
			modalData.pageNum = 1
			handleQueryData(modalData)
		}

		const renderDataType = () => {
			let options = []
			for(let node in modalData.dataTypeMap){
				options.push(<Menu.Item key={node}>{modalData.dataTypeMap[node]}</Menu.Item>)
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
			query:(<div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', textAlign:'center' }}>
					<Button disabled={modalData.dataLoading} onClick={handleQueryData} style={{ marginRight: '10px' }}>查询</Button>
					<Button disabled={modalData.dataLoading} onClick={handleResetQuery} style={{ marginRight: '10px' }}>重置</Button>
					<UserSort {...userSortProps} />
				</div>),
		  }
		const handleChangeKey = (value) => {
			modalData.key = value.target.value
			onUpdateState({modalData})
		}
		const handleChangePage = (num, size) => {
			modalData.pageNum = num==0?1:num
			modalData.pageSize = size
			handleQueryData()
		}
		const handleChangeSize = (current, size) => {
			modalData.pageNum = current==0?1:current
			modalData.pageSize = size
			handleQueryData()
		}
		const onChangeType = (value) => {
			modalData.type = value.target.checked ? '1' : undefined
			modalData.pageNum = 1
			handleQueryData()
		  }
		const onChangeShowSum = (value) => {
			modalData.showSum = value.target.checked
			onUpdateState({modalData})
		}

		const getDetailColumns = () => {
			let num = 0;
			const columns = [];
			for(let attr of userDisplayList){
				num++;
				columns.push({
					title: attr.name,
					dataIndex: attr.id,
					width: 80,
				})
			}
			const columnsName = [
				{dataIndex: "subjectName", width: 80},
				{dataIndex: "totalFee", width: 80, render: (text, record) => {return getFormat(text)}},
				{dataIndex: "discount", width: 80, render: (text, record) => {return getFormat(text)}},
				{dataIndex: "paidFee", width: 80, render: (text, record) => {return getFormat(parseInt(text)+parseInt(record.refund))}},
				{dataIndex: "refund", width: 80, render: (text, record) => {return getFormat(text)}},
				{dataIndex: "arrears", width: 80, render: (text, record) => {return getFormat(text)}},
			]
			const filterBill = (record) => {
				let arr = []
				if(record.feeBillListEntities){
					for(let node of record.feeBillListEntities){
						if(node.status == '1'){
							arr.push(node)
						}
						if(modalData.showSum && node.id=='_totalSum'){
							arr.push(node)
						}
					}
				}
				return arr
			}
			columns.push({
				title: "项目名称",
				dataIndex: "subjectName",
				width: 80,
				subColumns: columnsName,
				subColSpan: 6,
				subDataSource: (record)=>{return filterBill(record)},
				// render: (text, record) => {
				// 	return {
				// 		children: record.feeBillListEntities&&record.feeBillListEntities.length>0?<Table
				// 			dataSource={filterBill(record)}
				// 			size="middle"
				// 			columns={columnsName}
				// 			bordered
				// 			showHeader={false}
				// 			pagination={false}
				// 			rowKey={re => re.id}
				// 			style={{width:'100%'}}
				// 		/>:'',
				// 		props: {
				// 		colSpan: 6,
				// 		className:styles.childTablePanel,
				// 		style:{padding:'0'}
				// 		},
				// 	};
				// }
			})
			columns.push({
				title: "应收金额",
				dataIndex: "totalFee",
				width: 80,
				render: (text, record) => {
					return {
						props: {
						colSpan: 0,
						},
					};
				}
			})
			columns.push({
				title: "减免金额",
				dataIndex: "discount",
				width: 80,
				render: (text, record) => {
					return {
						props: {
						colSpan: 0,
						},
					};
				}
			})
			columns.push({
				title: "收费金额",
				dataIndex: "paidFee",
				width: 80,
				render: (text, record) => {
					return {
						props: {
						colSpan: 0,
						},
					};
				}
			})
			columns.push({
				title: "退费金额",
				dataIndex: "refund",
				width: 80,
				render: (text, record) => {
					return {
						props: {
						colSpan: 0,
						},
					};
				}
			})
			columns.push({
				title: "剩余欠费",
				dataIndex: "arrears",
				width: 80,
				render: (text, record) => {
					return {
						props: {
						colSpan: 0,
						},
					};
				}
			})
			return columns
		}
		const getStatisticsColumns = () => {
			return [
				{title:'项目名称',dataIndex: "subjectName", width: '100px'},
				{title:'应收金额',dataIndex: "totalFee", width: '100px', render: (text, record) => {return <div>{getFormat(text)}
				<Row className={styles.peopleNums}>{modalData.type=='1'?(record.totalFeeCount+'/人'):''}</Row></div>}},
				{title:'减免金额',dataIndex: "discount", width: '100px', render: (text, record) => {return <div>{getFormat(text)}
				<Row className={styles.peopleNums}>{modalData.type=='1'?(record.discountCount+'/人'):''}</Row></div>}},
				{title:'收费金额',dataIndex: "paidFee", width: '100px', render: (text, record) => {return <div>{getFormat(parseInt(text)+parseInt(record.refund))}
				<Row className={styles.peopleNums}>{modalData.type=='1'?(record.paidFeeCount+'/人'):''}</Row></div>}},
				{title:'退费金额',dataIndex: "refund", width: '100px', render: (text, record) => {return <div>{getFormat(text)}
				<Row className={styles.peopleNums}>{modalData.type=='1'?(record.refundCount+'/人'):''}</Row></div>}},
				{title:'欠费金额',dataIndex: "arrears", width: '100px', render: (text, record) => {return <div>{getFormat(text)}
				<Row className={styles.peopleNums}>{modalData.type=='1'?(record.arrearsCount+'/人'):''}</Row></div>}},
			]
		}
		const handleChangeType = (e) => {
			modalData.type=e.target.checked?'1':'0'
			handleQueryData()
			}
	
		return (
			<Modal
			visible={modalVisible}
			onCancel={()=>{onClose()}}
			title={(modalType==1?"查看详情":"任务统计")+"【"+modalData.missionName+"】"}
			footer={null}
			width={'1100px'}
			maskClosable={false}
			>
				<div style={{minHeight:'400px'}}>
					<UserSortLayer {...layerProps}/>
					<Divider style={{margin:'10px'}} />
					{
						modalType == 1?<Row>
						<div style={{ padding: '10px', textAlign: 'center' }}>
							<BillSum {...billSumProps}/>
						</div>
						<div>
							<Row>
							<ExportTable {...exportTableProps}/>
							{/* <Checkbox disabled={modalData.dataLoading} style={{ marginRight: '5px',marginBottom:'10px' }} onChange={onChangeType}>仅显示欠费</Checkbox> */}
							{
                modalData.dataLoading?<a disabled={true} className="ant-dropdown-link">{modalData.dataTypeMap[modalData.dataType]} <Icon type="down" /></a>:
                <Dropdown overlay={renderDataType()} trigger={['click']} style={{marginRight:'10px'}}>
                <a disabled={modalData.dataLoading} className="ant-dropdown-link">{modalData.dataTypeMap[modalData.dataType]} <Icon type="down" /></a></Dropdown>
              }
							<Checkbox disabled={modalData.dataLoading} style={{ marginBottom:'10px',marginLeft:'10px' }} onChange={onChangeShowSum}>显示项目小计</Checkbox>
							<div style={{width: isNavbar?'100%':'240px',display:'inline-blck',float: 'right',marginBottom:'10px'}}>
							<Search disabled={modalData.dataLoading} enterButton placeholder="搜索" value={modalData.key} onChange={(value) => { handleChangeKey(value) }} onSearch={value => handleQueryData(value)} style={{ width: 'calc(100% - 50px)', float: 'right' }} />
							<UserDisplay {...userDisplayProps} />
							</div>
							</Row>
						</div>
						<Row><TableCom
							dataSource={modalData.dataList}
							size="middle"
							bordered
							columns={getDetailColumns()}
							pagination={false}
							loading={modalData.dataLoading}
							scroll={{x:userDisplayList.length*80}}
							className={styles.fixedTable}
							styles={styles}
							/>
							 {modalData.count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={modalData.pageNum} defaultPageSize={modalData.pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  						 total={modalData.count} showTotal={count => `共 ${modalData.count} 条`} showSizeChanger showQuickJumper/>}
						</Row>
						</Row>:<Row>
						<Row style={{textAlign:'center',fontSize:'18px',fontWeight:'bolder',marginBottom:'10px'}}>{modalData.info.missionName}收费统计</Row>
						<Row style={{ marginBottom:'10px',textIndent:'20px' }}><Checkbox disabled={modalData.dataLoading} checked={modalData.type=='1'} onChange={handleChangeType}>显示人数统计</Checkbox></Row>
						<Row><Table
							dataSource={modalData.dataList}
							size="middle"
							bordered
							columns={getStatisticsColumns()}
							pagination={false}
							loading={modalData.dataLoading}
							scroll={{x:600}}
							className={styles.fixedTable}
							/>
						</Row>
						</Row>
					}
				</div>
			</Modal>
		)
}

export default UserModal