import { Row, Col, Modal, Button, Input, Spin, Icon, Pagination, Divider, Table, Select } from "antd";
import { config, getFormat, getYearFormat } from 'utils'
import styles from '../common.less'
import { UserSort, UserDisplay, UserSortLayer, BillSum, SortSelect } from 'components'

const { statDataMap, statDataList } = config
const { Option } = Select
const { Search } = Input
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const UserModal = ({
	modalData, modalVisible, isNavbar,
	userSortProps, userDisplayProps, userSortMap, userSortList, userAttrMap, userDisplayList, userDisplaySence,
	yearList, missionList,
	displayUpdateState, displayReset, displayUpdate, sortSence,
	onClose,
	onGetAttrRelateList,
	onUpdateState,
	onGetDetail,
	}) => {
		if(!modalData){
			return
		}

		let {statSence}  = modalData
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
			statData: modalData.stat,
			statList: statList,
			dataLoading: modalData.dataLoading,
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
		const handleQueryData = () => {
			onGetDetail({
				subjectId: modalData.info.subjectId,
				sortList: userSortList,
				key: modalData.key,
				type: modalData.type,
				pageNum: modalData.pageNum,
				pageSize: modalData.pageSize,
				year: modalData.year,
				missionId: modalData.missionId
			})
		}
		const handleResetQuery = () => {
			for (let sort of userSortList) {
				if (sort._idSelected) {
					sort._idSelected = []
				}
			}
			onUpdateState({modalData})
		}
		const handleChangeYear = (value) => {
			modalData.year = value
			onUpdateState({modalData})
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
		const handleChangeMission = (value) => {
			modalData.missionId = value
			onUpdateState({modalData})
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
		const createSort = () => {
			let i = 0
			const list = [
				{
					id:i++,
					content:(
					  <div className={styles.sortCol} >
						<div className={styles.sortText}>学年:</div>
						<Select  mode="multiple" optionFilterProp="children" allowClear={true} value={modalData.year} className={styles.sortSelectMuti} placeholder={"选择学年"} onChange={handleChangeYear}>
						{createYearOption()}
						</Select>
					  </div>
					)
				},{
					id:i++,
					content:(
					  <div className={styles.sortCol} >
						<div className={styles.sortText}>任务名称:</div>
						<Select  mode="multiple" optionFilterProp="children" allowClear={true} value={modalData.missionId} className={styles.sortSelectMuti} placeholder={"选择任务"} onChange={handleChangeMission}>
						{createMissionOption()}
						</Select>
					  </div>
					)
				}
			]
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
			query:(	<div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', textAlign:'center' }}>
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
		const getDetailColumns = () => {
			let num = 0;
			const columns = [];
			for(let attr of userDisplayList){
				num++;
				columns.push({
					title: attr.name,
					dataIndex: attr.id,
					width: '80px',
				})
			}
			columns.push({title:"应收金额", dataIndex: "totalFee", width: '80px', render: (text, record) => {return getFormat(record.statisticsData?record.statisticsData.totalFee:0)}})
			columns.push({title:"减免金额", dataIndex: "discount", width: '80px', render: (text, record) => {return getFormat(record.statisticsData?record.statisticsData.discount:0)}})
			columns.push({title:"收费金额", dataIndex: "paidFee", width: '80px', render: (text, record) => {return getFormat(parseInt(record.statisticsData?record.statisticsData.paidFee:0)+parseInt(record.statisticsData?record.statisticsData.refund:0))}})
			columns.push({title:"退费金额", dataIndex: "refund", width: '80px', render: (text, record) => {return getFormat(record.statisticsData?record.statisticsData.refund:0)}})
			columns.push({title:"欠费金额", dataIndex: "arrears", width: '80px', render: (text, record) => {return getFormat(record.statisticsData?record.statisticsData.arrears:0)}})
			return columns
		}
		return (
			<Modal
			visible={modalVisible}
			onCancel={()=>{onClose()}}
			title={"查看详情【"+modalData.subjectName+"】"}
			footer={null}
			width={'1000px'}
			maskClosable={false}
			>
				<div style={{minHeight:'400px'}}>
					<UserSortLayer {...layerProps}/>
					<Divider style={{margin:'10px'}} />
					<Row>
						<div style={{ padding: '10px', textAlign: 'center' }}>
							<BillSum {...billSumProps}/>
						</div>
						<div>
							<Row>
								<div style={{width: isNavbar?'100%':'240px',display:'inline-blck',float: 'right', marginBottom:'10px'}}>
								<Search disabled={modalData.dataLoading} enterButton placeholder="搜索" value={modalData.key} onChange={(value) => { handleChangeKey(value) }} onSearch={value => handleQueryData(value)} style={{ width: 'calc(100% - 50px)', float: 'right' }} />
								<UserDisplay {...userDisplayProps} />
								</div>
							</Row>
						</div>
						<Row><Table
							dataSource={modalData.dataList}
							bordered
							size="middle"
							columns={getDetailColumns()}
							pagination={false}
							loading={modalData.dataLoading}
							scroll={{x:userDisplayList.length*80}}
							className={styles.fixedTable}
							/>
							 {modalData.count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={modalData.pageNum} defaultPageSize={modalData.pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  						 total={modalData.count} showTotal={count => `共 ${modalData.count} 条`} showSizeChanger showQuickJumper/>}
						</Row>
					</Row>
				</div>
			</Modal>
		)
}

export default UserModal