import React from "react"
import { Table, Pagination, Popover, Row } from "antd"
import { PrintOperate } from 'components'
import styles from '../common.less'
import { getFormat } from 'utils'
import { StatusList, TableCom } from 'components'

const UserTable = ({
	count,
	user,menuMap,
	selectedOrders,
	...tableProps,
	userDisplayList,
	pageNum, pageSize,
	dataLoading,
	payTypeNameMap,
	userAttrList,
	subjectMap,
	onChangePage,
	onUpdateState,
	onGetPrint,
	onPrintDelete,
	onPrintSuccess,
	onUpdatePrint,
}) => {
	const handleChangePage = (num, size) => {
		onChangePage(num==0?1:num, size)
	}

	const handleChangeSize = (current, size) => {
		onChangePage(current==0?1:current, size)
	}

	const handelSelectChange = (selectedRowKeys) => {
		onUpdateState({selectedOrders: selectedRowKeys})
	}

	const columns = [];
	let num = user.isReview?13:11
	for(let attr of userDisplayList){
		num ++;
		columns.push({
			title: attr.name,
			dataIndex: attr.id,
			width:80
		})
	}
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
		title: "任务名称",
		dataIndex: "missionName",
		width:80
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
		title: "收费时间",
		dataIndex: "timeEnd",
		width:80
	})
	columns.push({
		title: "支付方式",
		dataIndex: "payType",
		width:80,
		render: (text, record) => {
			return payTypeNameMap[text]
		}
	})
	const columnsName = [
		{dataIndex: "subjectName", width: 80},
		{dataIndex: "paidFee", width: 80, render: (text, record) => {return getFormat(text)}},
		{dataIndex: "receiptNo", width: 80,render: (text, record) => {
			if(record.downUrl){
				//存在下载链接
				return <Popover content={<a target="_blank" href={record.downUrl}>下载电子票据</a>}>{text}</Popover>
			}
			return text
		}},
		{dataIndex: "id", width:80, render: (text, record) => {
			if(menuMap['/feePrint']==undefined){
				return ""
			}
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
				<PrintOperate {...param}/>
			)
		}}
	]
	columns.push({
		title: "项目名称",
		dataIndex: "subjectName",
		width: 80,
		subColumns: columnsName,
		subColSpan: 4,
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
		getCheckboxProps: record => ({
			disabled: record.status === '0' || record.status === '5' || record.status === '6',
			status: record.status,
		}),
	};

	return (
		<div>
		  <TableCom
			{...tableProps}
			rowSelection={rowSelection}
			size="middle"
			bordered
			columns={columns}
			pagination={false}
			loading={dataLoading}
			rowKey={record => record.orderNo}
			className={styles.fixedTable}
			scroll={{x:num*80}}
			styles={styles}
	      />
		  {count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
}

export default UserTable;
