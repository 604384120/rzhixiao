import { Row, Col, Button, Input, Select, message, Tag, Divider, Popover, Spin, DatePicker } from "antd"
import RefundTable from './RefundTable'
// import RefundDisplay from './RefundDisplay'
// import RefundSort  from './RefundSort'
import RefundModal  from './RefundModal'
import styles from '../common.less'
import moment from 'moment';
import { getFormat, config, getSortParam, token } from 'utils'
import { UserSortLayer, UserSort, UserDisplay, SortSelect, ExportTable } from 'components'
import queryString from 'query-string'

const { api } = config
const Option = Select.Option
const Search = Input.Search
const RangePicker = DatePicker.RangePicker;

const Refund = ({
	missionId,
	missionInfo,
	subjectMap,
	payTypeList,
	payTypeNameMap,
	refundData,
  user, menuMap, isNavbar,
  userDisplaySence,
	userAttrList,
	userAttrMap,
  displayUpdateState,
  displayReset,
  displayUpdate,
  displayAttrRelateList,
	onUpdateState,
	opUpdateSubjectMap,
	onGetOrderReturnList,
	onGetMgrAccountList,
	onImportConfirm, onGetImportPrs, onImportCover, onCancelOrderReturn,onUpdateSort,onhandleFormatVisibleChange,onhandleChangeFormat
}) => {
  const {sortSence, displaySence, userSortExtra}  = refundData
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}

	const queryParam = {
		key:refundData.searchName,
		pageNum: refundData.pageNum,
		pageSize: refundData.pageSize,
		beginDate: refundData.beginDate,
		endDate: refundData.endDate,
		missionId: missionId,
		sortList: userSortList,
		payType: userSortMap['payType']?userSortMap['payType']._idSelected:undefined,
		reBeginDate: refundData.reBeginDate,
		reEndDate: refundData.reEndDate,
		receiptBeginNo: refundData.receiptBeginNo,
		receiptEndNo: refundData.receiptEndNo,
		accountId: userSortMap['accountId']?userSortMap['accountId']._idSelected:undefined,
		subjectId: refundData.sortSubjectSelected,
		status: refundData.status,
		orderNo: refundData.orderNo,
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
    dataLoading: refundData.dataLoading,
		userSortMap,
		payType: refundData.payType,
    userAttrMap,
		styles,
		onGetSelectList (data) {
      displayAttrRelateList({ ...data }, sortSence,)
    },

    onChangeSort (value, attr) {
      onUpdateSort()  // 加蒙版
    },
	}
	
	const exportTableProps ={
    sence: 'return',
    styles,
    formatVisible: refundData.formatVisible,
		exportFormat: refundData.exportFormat,
		onFormatVisibleChange (visible) {
			onhandleFormatVisibleChange(visible)
		},
		onChangeFormat (format) {
			onhandleChangeFormat(format)
		},
		onGetExportUrl () {
			let tempParam = {...queryParam};
			if(!tempParam.missionId){
				return;
			}
			else if(!tempParam.beginDate){
				return;
			}
			else if(!tempParam.endDate){
				return;
			}
			else if(tempParam.receiptBeginNo && tempParam.receiptEndNo && tempParam.receiptEndNo < tempParam.receiptBeginNo){
				return;
			}
			let tempList = getSortParam(tempParam.sortList)
			if(tempList.length>0){
				tempParam.sortList = JSON.stringify(tempList);
			}else{
				tempParam.sortList = null;
			}
		
			if(refundData.accountList){
				let accountStr = '';
				for(let account  of refundData.accountList){
				if(tempParam.accountId.indexOf(account.loginName+'('+account.name+')')>=0){
					accountStr += account.id + ',';
				}
				}
				if(accountStr){
				tempParam.accountId = accountStr
				}else{
				tempParam.accountId = null;
				}
			}
			if(token()){
				tempParam.token = token()
			}
			delete tempParam.pageNum;
			delete tempParam.pageSize;
			tempParam.sence = "refundDisplay";
			tempParam.form = refundData.exportFormat>=2?refundData.exportFormat:1;
			let url = api.exportOrderReturnList + '?' + queryString.stringify(tempParam);
			return url
		}
	}
	
	const refundTableProps = {
    dataSource: refundData.list,
    userDisplayList,
		missionInfo,
		payTypeNameMap,
		user, menuMap,
		...refundData,
		onChangePage: function(n, s){
			queryParam.pageNum = n;
			queryParam.pageSize = s
			onGetOrderReturnList(queryParam)
		},
		onUpdateStateOrderReturnList: function(data){
			refundData.list = data
			onUpdateState(refundData)
		},
		onCancelOrderReturn: function(data){
			onCancelOrderReturn(data)
		},
	}

	const refundModalProps = {
		...refundData,
		subjectMap,
		missionInfo,
		onClose () {
		  refundData.modalVisible = false
		  refundData.modalType = ''
		  onUpdateState(refundData)
		},
		onUpdateState (data) {
		  onUpdateState({ ...refundData, ...data })
		},
		onImportConfirm () {
		  if(!refundData.modalImportData.excel){
			message.error('请选择文件');
			return;
		  }
		  onImportConfirm({
			missionId,
			file:refundData.modalImportData.excel.fileName,
			timer: setInterval(() => {
				onGetImportPrs({ missionId })
			}, 1500)
		  })
		},
		onImportCover () {
		  onImportCover({
			missionId,
			timer: setInterval(() => {
				onGetImportPrs({ missionId })
			  }, 1500)
		  })
		},
	
	}

	const handleChangeDate = (value) => {
		if(value.length == 0){
			refundData.beginDate = '';
			refundData.endDate = '';
		}else{
			refundData.beginDate = value[0].format('YYYY-MM-DD HH:mm:ss');
			refundData.endDate = value[1].format('YYYY-MM-DD HH:mm:ss');
		}
		onUpdateState(refundData)
		onUpdateSort()		//退费时段加蒙版
	}

	const handleChangeOrderNo = (value) => {
		refundData.orderNo = value
		onUpdateState(refundData);
		onUpdateSort()		//订单号加蒙版
	}

	const handleChangeStatus = (value) => {
		refundData.status = value;
		onUpdateState(refundData);
		onUpdateSort()		//状态加蒙版
	}

	const handleChangeSubject = (value) => {
		refundData.sortSubjectSelected = value;
		onUpdateState(refundData);
		onUpdateSort()		//项目名称加蒙版
	}

	const handleResetQueryRefund = () => {
		for(let sort of userSortList){
			if(sort._idSelected){
				sort._idSelected = [];
			}
		}
		refundData.accountId = [];
		refundData.payType = null,
		refundData.status = null,
		refundData.sortSubjectSelected = undefined,
		onUpdateState(refundData);
		onUpdateSort()
	}
	
	const handleQueryRefund = () => {
	onGetOrderReturnList(queryParam);
	}

	const handleChangeSearchName = (value) =>{
		refundData.searchName = value.target.value;
		onUpdateState(refundData);
	}

	const handleOnSearch = (name) => {
		if(name || refundData.searchName){
			queryParam.key = name;
			onGetOrderReturnList(queryParam);
		}
	}

	const handleShowImport = () => {
		refundData.modalVisible = true
		refundData.modalType = 'bilImport'
		refundData.modalImportData = {
			step:0,
			importing: false,
		};
		onUpdateState(refundData)
	}

	const createSubjectOption = () => {
		const options = [];
		for(let index in subjectMap){
			options.push(<Option key={subjectMap[index].id} value={subjectMap[index].id} title={subjectMap[index].name}>{subjectMap[index].name}</Option>)
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
				<div className={styles.sortText}>退费时段:</div>
				<RangePicker
					disabled={refundData.dataLoading}
					showTime={{ format: 'HH:mm:ss',defaultValue:[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}}
					defaultValue={[refundData.beginDate?moment(refundData.beginDate):'', refundData.endDate?moment(refundData.endDate):'']}
					disabledDate={current=>{return current && current > moment().endOf('day')}}
					format="YYYY-MM-DD HH:mm:ss" 
					placeholder={['开始时间', '结束时间']}
					style={{width:'calc(100% - 100px)'}}
					onChange={handleChangeDate}
				/>
				</div>
			),
			length:2
		  },{
			id:i++,
			content:(<div className={styles.sortCol}>
				<div className={styles.sortText}>项目名称:</div>
				<Select disabled={refundData.dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={refundData.sortSubjectSelected} className={styles.sortSelectMuti} placeholder={"选择项目"} onChange={handleChangeSubject}>
				{createSubjectOption()}
				</Select>
			  </div>)
		  }
		]
		
		for(let attr of userSortList){
			if(attr.id == 'orderNo'){
				list.push({
					id:i++,
					content:(<div className={styles.sortCol}>
					<div className={styles.sortText}>{attr.name}:</div>
						<Input disabled={refundData.dataLoading} value={refundData.orderNo} className={styles.sortSelectMuti} onChange={(e) => handleChangeOrderNo(e.target.value)}></Input>
					</div>)
				})
			}else if(attr.id == 'status'){
				list.push({
					id:i++,
					content:(<div className={styles.sortCol}>
					<div className={styles.sortText}>{attr.name}:</div>
					<Select disabled={refundData.dataLoading} allowClear={true} value={refundData.status} className={styles.sortSelectMuti} placeholder={"选择"+attr.name} onChange={handleChangeStatus}>
						<Option key={2} value={2} title={'正常'}>正常</Option>
						<Option key={0} value={0} title={'已作废'}>已作废</Option>
						<Option key={6} value={6} title={'已对账'}>已对账</Option>
						{user.isReview == '1'&&<Option key={5} value={5} title={'已驳回'}>已驳回</Option>}
						{user.isReview == '1'&&<Option key={4} value={4} title={'审核中'}>审核中</Option>}
					</Select>
					</div>)
				})
			}else{
				list.push({
					id:i++,
					content:(<SortSelect {...{...structSelectProps, attr}}/>)
				})
		 	}
		}
		return list
	}
	const layerProps = {
		list: createSort(),
		query:(<div className={styles.queryBox}>
			<Button className={styles.inquery} type={refundData.sortFlag==undefined||refundData.sortFlag?"primary":''} loading={refundData.dataLoading} onClick={handleQueryRefund}>{refundData.dataLoading?'':'查询'}</Button>
	 		<Button className={styles.reset} onClick={handleResetQueryRefund} disabled={refundData.dataLoading}>重置</Button>
	 		<UserSort {...userSortProps} className={styles.more}/>
		  </div>),
	}
	return (
	<div>
		{refundData.sortFlag&&<div className={styles.masking} style={{width:'120%'}}></div>}
		<UserSortLayer {...layerProps} />
		<Divider style={{margin:'10px'}} />
		<div style={{ padding: '5px', textAlign: 'center' }}>
			<Row style={{fontSize: '15px'}}>
				<Col span={12} >{'退费总额：'+getFormat(refundData.returnFeeSum?refundData.returnFeeSum.feeSum:0)+'元'}</Col>
				<Col span={12} >{'退费笔数：'+(refundData.returnFeeSum?refundData.returnFeeSum.count:0)+'笔'}</Col>
			</Row>
		</div>
		<Divider style={{ margin: '5px' }} dashed />
		<Row style={{paddingTop:'10px'}}>
			{menuMap['/feeReturn']!=undefined&&<Button style={{ marginRight: '5px',marginBottom:'10px' }} onClick={handleShowImport} >导入退费</Button>}
			<ExportTable {...exportTableProps}/>
			<div style={{width: isNavbar?'100%':'250px',display:'inline-blck',float: 'right'}}>
				<Search enterButton placeholder="搜索" value={refundData.searchName} onChange={(value)=>{handleChangeSearchName(value)}} onSearch={(value) => handleOnSearch(value)} style={{ width: "calc(100% - 50px)", float: 'right' }} />
				<UserDisplay {...userDisplayProps}/>
			</div>
		</Row>
		<Row style={{paddingTop:'10px'}}>
			<RefundTable {...refundTableProps} />
		</Row>
		{ refundData.modalVisible && <RefundModal {...refundModalProps} /> }
	</div>
	)
}

export default Refund;
