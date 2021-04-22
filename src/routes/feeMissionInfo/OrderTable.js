import React from "react"
import { Table, message, Pagination, Popover, Button, Input, Row } from "antd"
import styles from "../common.less"
import { getFormat } from 'utils'
import { PrintOperate, StatusList, TableCom } from 'components'

const { TextArea } = Input;

const OrderTable = ({
	user, menuMap,
	count,
	pageNum,
	pageSize,
	userDisplayList,
	payTypeNameMap,
	userAttrList,
	missionInfo,
	selectedOrders,
	printData,
	...tableProps,
	dataLoading,
	subjectMap,
	onChangePage,
	onPrintDelete,
	onPrintSuccess,
	onGetPrint,
	onUpdatePrint,
	onUpdateStateOrderList,
	onSelectChange,
	onCancelOrder,
}) => {
	let { dataSource } = tableProps;
	const handleChangePage = (num, size) => {
		onChangePage(num==0?1:num, size)
	}

	const handleChangeSize = (current, size) => {
		onChangePage(current==0?1:current, size)
	}

	const handelSelectChange = (selectedRowKeys) => {
		onSelectChange(selectedRowKeys)
	}

	const handleCancelOrderVisibleChange = (visible, record) => {
		record._cancelOrderVisible = visible
		onUpdateStateOrderList(dataSource)
	}

	const handleChangeCancelRemark = (e, record) => {
		record._cancelRemark = e.target.value
		onUpdateStateOrderList(dataSource)
	}

	const handleCancelOrder = (record) => {
		if(!record._cancelRemark){
			message.error("请输入冲正理由")
			return
		}
		onCancelOrder({orderNo:record._order.orderNo,remark:record._cancelRemark})
	}

	// const details = (text,record) => {
	// 	const detailser = []
	// 	let i = 0
	// 	let orderOperateList = null
	// 	detailser.push(<div style={{marginBottom:'10px'}} key={i}><Row>{(record.orderOperateList?record.timeEnd:record._order.timeEnd)+':'+(record.orderOperateList?record.accountName:record._order.accountName)}</Row>
	// 								<Row>收款</Row></div>)
	// 	if(record.orderOperateList || record._order){
	// 		orderOperateList = record.orderOperateList?record.orderOperateList:record._order.orderOperateList
	// 		for(let node of orderOperateList){
	// 			i++
	// 			if(node.mask == '1'){
	// 				detailser.push(<div style={{marginBottom:'10px'}} key={i}><Row>{node.createDate+':'+node.accountName}</Row>
	// 										<Row>冲正</Row>
	// 										<Row>{`冲正理由：${node.remark?node.remark:''}`}</Row></div>)
	// 			}else if(node.mask == '2' && text == '5'){
	// 				detailser.push(<div style={{marginBottom:'10px'}} key={i}><Row>{node.createDate+':'+node.accountName}</Row>
	// 										<Row>驳回</Row>
	// 										<Row>{`驳回理由：${node.remark?node.remark:''}`}</Row></div>)
	// 			}else if(node.mask == '2' && text != '5'){
	// 				detailser.push(<div style={{marginBottom:'10px'}} key={i}><Row>{node.createDate+':'+node.accountName}</Row>
	// 										<Row>审核</Row>
	// 										<Row>审核成功</Row></div>)
	// 			}else if(node.mask == '4'){
	// 				detailser.push(<div style={{marginBottom:'10px'}} key={i}><Row>{node.createDate+':'+node.accountName}</Row>
	// 										<Row>对账</Row></div>)
	// 			}
	// 		}
	// 	}
	// 	return detailser
	// }

	const renderCancelOrder = (record) => {
		return(
			<div>
				<div>请输入冲正理由：</div>
				<TextArea style={{marginTop:'5px'}} value={record._cancelRemark} onChange={e=>handleChangeCancelRemark(e, record)}/>
				<div style={{textAlign: 'center' }}>
					<div style={{marginTop:'5px', marginBottom:'5px', color:'red', fontSize:'8px', maxWidth:'275px', textAlign:'left'}}>1.冲正：对线下收款记账错误的收费订单可进行冲正，冲正后该笔订单即被废除，不进入统计<br/>2.冲正结转订单时会将转入转出的两笔订单同时冲正</div>
					<Button size="small" style={{ marginRight: '10px' }} onClick={()=>handleCancelOrderVisibleChange(false, record)}>取消</Button>
					<Button type="primary" size="small" onClick={()=>handleCancelOrder(record)}>确定</Button>
				</div>
			</div>
		)
	}

	
	const columns = [];
	let num = 8;
	if(user.isReview == '1'){
		num = 10
	}
	for(let attr of userDisplayList){
		num ++;
		columns.push({
			title: attr.name,
			dataIndex: attr.id,
			width:80
		})
	}
	columns.push({
		title: "收费时间",
		dataIndex: "timeEnd",
		width:80
	})
	columns.push({
		title: "订单号",
		dataIndex: "orderNo",
		width:80
	})
	columns.push({
		title: "订单状态",
		dataIndex: "status",
		width:80,
		render: (text, record) => {
			return <StatusList fee='1' status={text} user={user} orderOperateData={record}/>
		}
	})
	columns.push({
		title: "实收合计",
		dataIndex: "fee",
		width:80,
		render: (text, record) => {
			return getFormat(record.fee)
		}
	})
	columns.push({
		title: "支付方式",
		dataIndex: "payType",
		width:80,
		render: (text, record) => {
			return payTypeNameMap[text]
		}
	})
	columns.push({
		title: "经办人",
		dataIndex: "accountName",
		width:80,
		render: (text, record) => {
			return record.status=='0'?record.cancelAccountName:text
		}
	})
	if(user.isReview == '1'){
		columns.push({
			title:'审核人',
			dataIndex:'reviewAccountName',
			width:80,
		})
		columns.push({
			title:'审核时间',
			dataIndex:'reviewDate',
			width:80,
		})
	}
	const columnsName = [
		{dataIndex: "subjectName", width: 80},
		{dataIndex: "paidFee", width: 80, render: (text, record) => {return getFormat(text)}},
		{dataIndex: "receiptNo", width: 80, render: (text, record) => {
			if(record.downUrl){
				//存在下载链接
				return <Popover content={<a target="_blank" href={record.downUrl}>下载电子票据</a>}>{text}</Popover>
			}
			return text
		}}]
		columnsName.push(
		{dataIndex: "id", width:80, render: (text, record) => {
			let param = {
				printData: record, 
				printType: record._order.printType,
				userAttrList,
				subjectMap,
				onUpdatePrint,
				onGetPrint,
				onPrintSuccess,
				onPrintDelete,
			}
			return (
			<div style={{display:"inline"}}>
			{
				record._order.status=='0'?<span>已冲正&nbsp;</span>:
				(menuMap['/feeOrderCancel']==undefined?<a disabled={true}>冲正&nbsp;</a>:<Popover title="冲正确认" trigger="click" placement="top"
					content={renderCancelOrder(record)}
					visible={record._cancelOrderVisible?record._cancelOrderVisible:false}
					onVisibleChange={record._order.status=='5'||record._order.status=='6'?undefined:e=>handleCancelOrderVisibleChange(e, record)}
					><a disabled={record._order.status=='5'||record._order.status=='6'}>冲正</a>&nbsp;&nbsp;</Popover>)
			}
			{missionInfo.templateId&&menuMap['/feePrint']!=undefined?<PrintOperate {...param}/>:""}
			</div>)
		}}
	)
	columns.push({
		title: "项目名称",
		dataIndex: "subjectName",
		width: 80,
		subColumns: columnsName,
		subColSpan: 4,
		subDataSource: (record)=>{return record.feeBillLists}
		// render: (text, record) => {
		// 	return {
		// 		children: record.feeBillLists&&record.feeBillLists.length>0?<Table
		// 			dataSource={record.feeBillLists}
		// 			columns={columnsName}
		// 			size="middle"
		// 			bordered
		// 			showHeader={false}
		// 			pagination={false}
		// 			rowKey={re => re.id}
		// 			style={{width:'100%'}}
		// 	  	/>:'',
		// 		props: {
		// 		  colSpan: 4,
		// 		  className:styles.childTablePanel,
		// 		  style:{padding:'0'}
		// 		},
		// 	};
		// }
	})
	columns.push({
		title: "本次实收",
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
		title: "票据单号",
		dataIndex: "receiptNo",
		width:80,
		render: (text, record) => {
			return {
				props: {
				  colSpan: 0,
				},
			};
		}
	})
	columns.push({
		title: "操作",
		dataIndex: "id",
		width:80,
		render: (text, record) => {
			return {
				props: {
					colSpan: 0,
				},
			};
		}
	})
	const rowSelection = {
		selectedRowKeys: selectedOrders,
		onChange: handelSelectChange,
		columnWidth:60,
		getCheckboxProps: record => ({
			disabled: record.status !== '2',
			name: record.name,
		}),
	};
	return (
		<div>
		  <TableCom
			{...tableProps}
			size="middle"
		  	rowSelection={rowSelection}
			loading={dataLoading||printData._isPrinting>0}
			bordered
			columns={columns}
			rowKey={record => record._position}
			pagination={false}
			className={styles.fixedTable}
			scroll={{x:num*80}}
			styles={styles}
	      />
		  {count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
}

export default OrderTable;
