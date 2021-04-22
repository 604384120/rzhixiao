import React from "react"
import { Table, message, Pagination, Popover, Input, Button, Row} from "antd"
import styles from "../common.less"
import { getFormat } from 'utils'
import { StatusList, TableCom } from 'components'

const TextArea = Input.TextArea

const RefundTable = ({
	count,
	pageNum,
	pageSize,
	user, menuMap,
	userDisplayList,
	payTypeNameMap,
	missionInfo,
	dataSource,
	dataLoading,
	onChangePage,
	onCancelOrderReturn,
	onUpdateStateOrderReturnList,
}) => {

	const handleChangePage = (num, size) => {
		onChangePage(num==0?1:num, size)
	}

	const handleChangeSize = (current, size) => {
		onChangePage(current==0?1:current, size)
	}

	const handleCancelOrderReturnVisibleChange = (visible, record) => {
		record._cancelOrderReturnVisible = visible
		onUpdateStateOrderReturnList(dataSource)
	}

	const handleChangeCancelReturnRemark = (e, record) => {
		record._cancelReturnRemark = e.target.value
		onUpdateStateOrderReturnList(dataSource)
	}

	const handleCancelOrderReturn = (record) => {
		if(!record._cancelReturnRemark){
			message.error("请输入作废理由")
			return
		}
		onCancelOrderReturn({orderNo:record.orderNo,remark:record._cancelReturnRemark})
	}

	// const details = (text,record) => {
	// 	const detailser = []
	// 	let i = 0
	// 	detailser.push(<div style={{marginBottom:'10px'}} key={i}><Row>{record.timeEnd+':'+record.accountName}</Row>
	// 								<Row>退款</Row></div>)
	// 	if(record.orderOperateList){
	// 		for(let node of record.orderOperateList){
	// 			i++
	// 			if(node.mask == '1'){
	// 				detailser.push(<div style={{marginBottom:'10px'}} key={i}><Row>{node.createDate+':'+node.accountName}</Row>
	// 										<Row>作废</Row>
	// 										<Row>{`作废理由：${node.remark?node.remark:''}`}</Row></div>)
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

	const renderCancelOrderReturn = (record) => {
		return(
			<div>
				<div>请输入作废理由：</div>
				<TextArea style={{marginTop:'5px'}} value={record._cancelReturnRemark} onChange={e=>handleChangeCancelReturnRemark(e, record)}/>
				<div style={{textAlign: 'center' }}>
					<div style={{marginTop:'5px', marginBottom:'5px',color:'red', textAlign:'center', fontSize:'8px'}}>对已开票据进行作废，作废后该笔订单可重新开票</div>
					<Button size="small" style={{ marginRight: '10px' }} onClick={()=>handleCancelOrderReturnVisibleChange(false, record)}>取消</Button>
					<Button type="primary" size="small" onClick={()=>handleCancelOrderReturn(record)}>确定</Button>
				</div>
			</div>
		)
	}

	const getFixed = () => {
		let width = document.body.clientWidth;
		if(width>769){
			width -= 300;
		}
		if(num+8 > width/100){
			return 'right'
		}
		return '';
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
		title: "退费时间",
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
			return <StatusList fee='0' status={text} user={user} orderOperateData={record}/>
		}
	})
	const columnsName = [
		{dataIndex: "subjectName", width: 80},
		{dataIndex: "paidFee", width: 80, render: (text, record) => {return getFormat(text)}}]
	columns.push({
		title: "项目名称",
		dataIndex: "subjectName",
		width: 80,
		subColumns: columnsName,
		subColSpan: 2,
		subDataSource: (record)=>{return record.feeBillLists},
		// render: (text, record) => {
		// 	return {
		// 		children: record.feeBillLists&&record.feeBillLists.length>0?<Table
		// 			dataSource={record.feeBillLists}
		// 			size="middle"
		// 			columns={columnsName}
		// 			bordered
		// 			showHeader={false}
		// 			pagination={false}
		// 			rowKey={re => re.id}
		// 			style={{width:'100%'}}
		// 	  	/>:'',
		// 		props: {
		// 		  colSpan: 2,
		// 			className:styles.childTablePanel,
		// 		  style:{padding:'0'}
		// 		},
		// 	};
		// }
	})
	columns.push({
		title: "本次实退",
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
		title: "实退合计",
		dataIndex: "fee",
		width:80,
		render: (text, record) => {
			return getFormat(record.fee)
		}
	})
	columns.push({
		title: "退费方式",
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
	columns.push({
		title: "操作",
			dataIndex: "id",
			width:80,
			render: (text, record) => {
				if(record.status != '2' && record.status != 4){
					return ""
				}
				return <Popover title="作废确认" trigger="click" placement="top"
					content={renderCancelOrderReturn(record)}
					visible={record._cancelOrderReturnVisible?record._cancelOrderReturnVisible:false}
					onVisibleChange={e=>handleCancelOrderReturnVisibleChange(e, record)}><a disabled={menuMap['/feeReturnCancel']==undefined}>作废</a></Popover>
			}
	})
	return (
		<div>
		  <TableCom
	        dataSource={dataSource}
					loading={dataLoading}
					size="middle"
	        bordered
	        columns={columns}
	        pagination={false}
	        rowKey={record => record.id}
			className={styles.fixedTable}
			scroll={{x:num*80}} 
			styles={styles}
	      />
		  {count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
}

export default RefundTable;
