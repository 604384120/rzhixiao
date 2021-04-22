import { Row, Col, Button, Input, Select, message, Tag, Divider, Popover, InputNumber, Spin, DatePicker } from "antd"
import OrderTable from './OrderTable'
import OrderModal  from './OrderModal'
import styles from '../common.less'
import moment from 'moment';
import { getFormat, config, getSortParam, token } from 'utils'
import { PrintOperate, UserSortLayer, UserSort, UserDisplay, SortSelect, ExportTable } from 'components'
import queryString from 'query-string'

const { api } = config
const Option = Select.Option
const Search = Input.Search
const RangePicker = DatePicker.RangePicker;

const Order = ({
	missionId, missionInfo, subjectMap, payTypeList, payTypeNameMap, orderData, user, isNavbar, userDisplaySence, userAttrList, menuMap, userAttrMap,
  onUpdateState, opUpdateSubjectMap,  displayUpdateState, displayReset, displayUpdate, displayAttrRelateList,
  onGetOrderList, onGetMgrAccountList, onGetPrint, onUpdatePrint,
	onPrintSuccess, onPrintDelete, onImportConfirm, onGetImportPrs, onImportCover, onCancelOrder,onUpdateSort,
	onhandleFormatVisibleChange,onhandleChangeFormat,onPrintSet
}) => {
  const {sortSence, displaySence, userSortExtra}  = orderData
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}

	const queryParam = {
		key:orderData.searchName,
		pageNum: orderData.pageNum,
		pageSize: orderData.pageSize,
		beginDate: orderData.beginDate,
		endDate: orderData.endDate,
		missionId: missionId,
		sortList: userSortList,
		payType: userSortMap['payType']?userSortMap['payType']._idSelected:undefined,
		reBeginDate: orderData.reBeginDate,
		reEndDate: orderData.reEndDate,
		receiptBeginNo: orderData.receiptBeginNo,
		receiptEndNo: orderData.receiptEndNo,
		accountId: userSortMap['accountId']?userSortMap['accountId']._idSelected:undefined,
		subjectId: orderData.sortSubjectSelected,
		status: orderData.status,
		printStatus: orderData.printStatus,
		orderNo: orderData.orderNo,
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
    dataLoading: orderData.dataLoading,
		userSortMap,
		payType: orderData.payType,
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
    sence: 'order',
    styles,
    formatVisible: orderData.formatVisible,
		exportFormat: orderData.exportFormat,
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
		
			if(orderData.accountList){
				let accountStr = '';
				for(let account  of orderData.accountList){
				if(tempParam.accountId&&tempParam.accountId.indexOf(account.loginName+'('+account.name+')')>=0){
					accountStr += account.id + ',';
				}
				}
				if(accountStr){
				tempParam.accountId = accountStr
				}else{
				tempParam.accountId = null;
				}
			}
			delete tempParam.pageNum;
			delete tempParam.pageSize;
			tempParam.sence = "orderDisplay";
			tempParam.form = orderData.exportFormat>=2?orderData.exportFormat:1;
			if(tempParam.subjectId){
				tempParam.subjectId = tempParam.subjectId.toString();
			}
			if(token()){
				tempParam.token = token()
			}
			let url = api.exportOrderList + '?' + queryString.stringify(tempParam);
			return url
		}
	}
	
	const orderTableProps = {
		user, menuMap,
		dataSource: orderData.list,
		missionInfo,
		payTypeNameMap,
		userAttrList,
    subjectMap,
    userDisplayList,
		...orderData,
		onChangePage: function(n, s){
			queryParam.pageNum = n;
			queryParam.pageSize = s
			onGetOrderList(queryParam)
		},
		onPrintDelete: (data)=>{
			onPrintDelete(data)
		},
		onPrintSuccess: (data)=>{
			onPrintSuccess(data)
		},
		onGetPrint: (data)=>{
			onGetPrint(data)
		},
		onUpdatePrint: (data)=>{
			onUpdatePrint(data)
		},
		onUpdateStateOrderList: (data)=>{
			orderData.list = data
			onUpdateState(orderData)
		},
		onCancelOrder: (data) => {
			data.queryParam = queryParam
			onCancelOrder(data)
		},
		onSelectChange: (data)=>{
			//修改printData
			orderData.printData._list = []
			for(let index of data){
				orderData.printData._list.push(orderData.list[index])
			}
			orderData.selectedOrders = data
			onUpdateState(orderData)
		}
	}

	const orderModalProps = {
		...orderData,
		subjectMap,
		userAttrList,
		missionInfo,
		onClose () {
		  orderData.modalVisible = false
		  orderData.modalType = ''
		  onUpdateState(orderData)
		},
		onUpdateState (data) {
		  onUpdateState({ ...orderData, ...data })
		},
		onImportConfirm () {
		  if(!orderData.modalImportData.excel){
			message.error('请选择文件');
			return;
		  }
		  onImportConfirm({
			missionId,
			file:orderData.modalImportData.excel.fileName,
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
			orderData.beginDate = '';
			orderData.endDate = '';
		}else{
			orderData.beginDate = value[0].format('YYYY-MM-DD HH:mm:ss');
			orderData.endDate = value[1].format('YYYY-MM-DD HH:mm:ss');
		}
		onUpdateState(orderData)
		onUpdateSort()		//收费时段加蒙版
	}

	const handleChangeReDate = (value) => {
		if(value.length == 0){
			orderData.reBeginDate = '';
			orderData.reEndDate = '';
		}else{
			orderData.reBeginDate = value[0].format('YYYY-MM-DD HH:mm:ss');
			orderData.reEndDate = value[1].format('YYYY-MM-DD HH:mm:ss');
		}
		onUpdateState(orderData)
		onUpdateSort()		//开票时段加蒙版
	}

	const handleChangeOrderNo = (value) => {
		orderData.orderNo = value
		onUpdateState(orderData);
		onUpdateSort()		//订单号加蒙版
	}

	const handleChangeSubject = (value) => {
		orderData.sortSubjectSelected = value;
		onUpdateState(orderData);
		onUpdateSort()		//项目名称加蒙版
	}
	
	const handleChangeReBeginNo = (value) => {
		orderData.receiptBeginNo = value;
		onUpdateState(orderData);
		onUpdateSort()		//票据加蒙版
	}

	const handleChangeReEndNo = (value) => {
		orderData.receiptEndNo = value;
		onUpdateState(orderData);
	}

	const handleChangeStatus = (value) => {
		orderData.status = value;
		onUpdateState(orderData);
		onUpdateSort()		//状态加蒙版
	}

	const handleChangePrintStatus = (value) => {
		orderData.printStatus = value;
		onUpdateState(orderData);
		onUpdateSort()		//打印状态加蒙版
	}
	
	const handleResetQueryOrder = () => {
		for(let sort of userSortList){
			if(sort._idSelected){
				sort._idSelected = [];
			}
		}
		orderData.accountId = [];
		orderData.payType = undefined,
		orderData.reBeginDate = undefined,
		orderData.reEndDate = undefined,
		orderData.receiptBeginNo = undefined,
		orderData.receiptEndNo = undefined,
		orderData.printStatus = undefined,
		orderData.status = undefined,
		orderData.sortSubjectSelected = undefined,
		onUpdateState(orderData);
		onUpdateSort()
	}
	
	const handleQueryOrder = () => {
		onGetOrderList(queryParam);
		//修改对应的打印选择框
		if(orderData.sortSubjectSelected && orderData.sortSubjectSelected.length>0){
			for(let index in subjectMap){
				subjectMap[index]._checked = false;
			}
			for(let index of orderData.sortSubjectSelected){
				subjectMap[index]._checked = true;
			}
			onUpdateState(orderData);
			opUpdateSubjectMap(subjectMap);
		}
	}
	
	const handleChangeSearchName = (value) =>{
		orderData.searchName = value.target.value;
		onUpdateState(orderData);
	}

	const handleOnSearch = (name) => {
		if(name || orderData.searchName){
			queryParam.key = name;
			onGetOrderList(queryParam);
		}
  }
  
	const handleShowImport = () => {
		orderData.modalVisible = true
		orderData.modalType = 'bilImport'
		orderData.modalImportData = {
			step:0,
			importing: false,
			importType: 1
		};
		onUpdateState(orderData)
	}

	const createSubjectOption = () => {
		const options = [];
		for(let index in subjectMap){
			options.push(<Option key={subjectMap[index].id} value={subjectMap[index].id} title={subjectMap[index].name}>{subjectMap[index].name}</Option>)
		}
		return options;
	}

	const renderOrderSum = () => {
    let sum = []
    sum.push(<Col span={12} >{'缴费总额：'+getFormat(orderData.orderFeeSum?orderData.orderFeeSum.feeSum:0)+'元'}</Col>)
    sum.push(<Col span={12} >{'缴费笔数：'+(orderData.orderFeeSum?orderData.orderFeeSum.count:'0')+'笔'}</Col>)
    return sum
  }

	const createSort = () => {
		let i = 0
		const list = [
		  {
			id:i++,
			content:(
			  <div className={styles.sortCol}>
				<div className={styles.sortText}>收费时段:</div>
				<RangePicker
					disabled={orderData.dataLoading}
					showTime={{ format: 'HH:mm:ss',defaultValue:[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}}
					defaultValue={[orderData.beginDate?moment(orderData.beginDate):'', orderData.endDate?moment(orderData.endDate):'']}
					disabledDate={current=>{return current && current > moment().endOf('day')}}
					format="YYYY-MM-DD HH:mm:ss" 
					placeholder={['开始时间', '结束时间']}
					onChange={handleChangeDate}
					style={{width:'calc(100% - 100px)'}}
				/>
			  </div>
			),
			length:2
		  },{
			id:i++,
			content:(<div className={styles.sortCol}>
				<div className={styles.sortText}>项目名称:</div>
				<Select disabled={orderData.dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={orderData.sortSubjectSelected} className={styles.sortSelectMuti} placeholder={"选择项目"} onChange={handleChangeSubject}>
				{createSubjectOption()}
				</Select>
			  </div>)
		  }
		]
		
		for(let attr of userSortList){
			if(attr.id == 'reDate'){
				list.push({
					id:i++,
					content:(<div className={styles.sortCol}>
					<div className={styles.sortText}>{attr.name}:</div>
					<RangePicker
						disabled={orderData.dataLoading}
						showTime={{ format: 'HH:mm:ss',defaultValue:[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}}
						disabledDate={current=>{return current && current > moment().endOf('day')}}
						format="YYYY-MM-DD HH:mm:ss"
						onChange={handleChangeReDate}
						style={{width:'calc(100% - 100px)'}}
						placeholder={['开始时间', '结束时间']}/>
					</div>),
					length:2,
				})
			}else if(attr.id == 'receiptNo'){
				list.push({
					id:i++,
					content:(<div className={styles.sortCol}>
					<div className={styles.sortText}>{attr.name}:</div>
					<div style={{width:'calc(100% - 100px)',display:'inline-block'}}>
						<InputNumber min={0}  step={1} disabled={orderData.dataLoading} value={orderData.receiptBeginNo} onChange={handleChangeReBeginNo} style={{width:'calc(50% - 5px)'}}/>~<InputNumber min={0} step={1} disabled={orderData.dataLoading} value={orderData.receiptEndNo} onChange={handleChangeReEndNo} style={{width:'calc(50% - 5px)'}}/>
					</div>
					</div>),
				})
			}else if(attr.id == 'orderNo'){
				list.push({
					id:i++,
					content:(<div className={styles.sortCol}>
					<div className={styles.sortText}>{attr.name}:</div>
						<Input disabled={orderData.dataLoading} value={orderData.orderNo} className={styles.sortSelectMuti} onChange={(e) => handleChangeOrderNo(e.target.value)}></Input>
					</div>)
				})
			}else if(attr.id == 'status'){
				list.push({
					id:i++,
					content:(<div className={styles.sortCol}>
					<div className={styles.sortText}>{attr.name}:</div>
					<Select disabled={orderData.dataLoading} allowClear={true} value={orderData.status} className={styles.sortSelectMuti} placeholder={"选择"+attr.name} onChange={handleChangeStatus}>
						<Option key={2} value={2} title={'正常'}>正常</Option>
						<Option key={0} value={0} title={'已冲正'}>已冲正</Option>
						<Option key={6} value={6} title={'已对账'}>已对账</Option>
						{user.isReview == '1'&&<Option key={5} value={5} title={'已驳回'}>已驳回</Option>}
            			{user.isReview == '1'&&<Option key={4} value={4} title={'审核中'}>审核中</Option>}
					</Select>
					</div>)
				})
			}else if(attr.id == 'printStatus'){
				list.push({
					id:i++,
					content:(<div className={styles.sortCol}>
					<div className={styles.sortText}>{attr.name}:</div>
					<Select disabled={orderData.dataLoading} allowClear={true} value={orderData.printStatus} className={styles.sortSelectMuti} placeholder={"选择"+attr.name} onChange={handleChangePrintStatus}>
						<Option key={1} value={1} title={'已打印'}>已打印</Option>
						<Option key={0} value={0} title={'未打印'}>未打印</Option>
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
			<Button className={styles.inquery} type={orderData.sortFlag==undefined||orderData.sortFlag?"primary":''} loading={orderData.dataLoading} onClick={handleQueryOrder}>{orderData.dataLoading?'':'查询'}</Button>
			<Button className={styles.reset} onClick={handleResetQueryOrder} disabled={orderData.dataLoading}>重置</Button>
			<UserSort {...userSortProps} className={styles.more}/>
		  </div>),
	  }

	const printProps = {
		isBatch: true,
		printData: orderData.printData,
		printType: missionInfo.printType,
		userAttrList,
		subjectMap,
		onUpdatePrint,
		onGetPrint,
		onPrintSuccess,
		onPrintDelete,
	}

	return (
	<div>
		{orderData.sortFlag&&<div className={styles.masking} style={{width:'120%'}}></div>}
			<UserSortLayer {...layerProps} />
			<Divider style={{margin:'10px'}} />
			<div style={{ padding: '5px', textAlign: 'center' }}>
              <Row style={{fontSize: '15px'}}>
                {renderOrderSum()}
              </Row>
            </div>
            <Divider style={{ margin: '5px' }} dashed />
			<Row style={{paddingTop:'10px'}}>
        {menuMap['/feePrint']!=undefined&&missionInfo.templateId!=null&&<PrintOperate {...printProps} style={{marginRight: '5px',marginBottom:'10px'}}/>}
        {menuMap['/feePrint']!=undefined&&missionInfo.templateId!=null&&<Button style={{ marginRight: '5px',marginBottom:'10px' }} onClick={onPrintSet} >打印设置</Button>}
				{menuMap['/feeOrder']!=undefined&&<Button style={{ marginRight: '5px',marginBottom:'10px' }} onClick={handleShowImport} >导入收费</Button>}
				<ExportTable {...exportTableProps}/>
			  <div style={{width: isNavbar?'100%':'250px',display:'inline-blck',float: 'right'}}>
				<Search enterButton placeholder="搜索" value={orderData.searchName} onChange={(value)=>{handleChangeSearchName(value)}} onSearch={(value) => handleOnSearch(value)} style={{ width: "calc(100% - 50px)", float: 'right' }} />
				<UserDisplay {...userDisplayProps}/>
				</div>
			</Row>
			<Row style={{paddingTop:'10px'}}>
				<OrderTable {...orderTableProps} />
			</Row>
		{ orderData.modalVisible && <OrderModal {...orderModalProps} /> }
	</div>
	)
}

export default Order;
