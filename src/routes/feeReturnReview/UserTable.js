import React from "react"
import { Table, Pagination, message, Button, Divider, Popconfirm, Popover, Checkbox } from "antd"
import styles from '../common.less'
import { getFormat } from 'utils'
import { TableCom } from 'components'

const UserTable = ({
	count,
	selectedAll,
	selectedOrders,
	...tableProps,
	userDisplayList,
	pageNum, pageSize,
	dataLoading,
	payTypeNameMap,
	onChangePage,
	onUpdateState,
}) => {
	const handleChangePage = (num, size) => {
		onChangePage(num==0?1:num, size)
	}

	const handleChangeSize = (current, size) => {
		onChangePage(current==0?1:current, size)
	}

	const handelSelectChange = (selectedRowKeys) => {
		if(selectedRowKeys.length == 0){
			selectedAll = false
		}
		if(selectedAll){
			//不能修改
			return
		}
		onUpdateState({selectedOrders: selectedRowKeys})
	}

	const columns = [];
	let num = 8;
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
		title: "任务名称",
		dataIndex: "missionName",
		width:80,
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
		title: "退费时间",
		dataIndex: "timeEnd",
		width:80
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
	const columnsName = [
		{dataIndex: "subjectName", width: 80},
		{dataIndex: "paidFee", width: 80, render: (text, record) => {return getFormat(text)}},
	]
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
		// 		  className:styles.childTablePanel,
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

	// const rowSelection = {
	// 	selectedRowKeys: selectedOrders,
	// 	onChange: handelSelectChange,
	// 	columnWidth:40,
	// 	getCheckboxProps: record => ({
	// 		disabled: record.editable === '0',
	// 		name: record.name,
	// 	}),
	// };

	const rowSelection = {
		selectedRowKeys: selectedOrders,
		onChange: handelSelectChange,
		columnWidth:40,
		getCheckboxProps: record => ({
			disabled: selectedAll || record.editable === '0',
			// name: record.name,
		}),
		hideDefaultSelections: true,
		selections: [
			{
				key: 'page',
				text: '选择本页',
				onSelect: () => {
					let i = 0
					selectedOrders = []
					for(let node of tableProps.dataSource){
						selectedOrders.push(i++)
					}
					onUpdateState({selectedOrders,selectedAll:false})
				},
			},
			{
				key: 'all',
				text: '选择全部',
				onSelect: () => {
					let i = 0
					selectedOrders = []
					for(let node of tableProps.dataSource){
						selectedOrders.push(i++)
					}
					onUpdateState({selectedOrders,selectedAll:true})
				},
			},
			{
				key: 'node',
				text: '取消选择',
				onSelect: () => {
					selectedOrders = []
					onUpdateState({selectedOrders,selectedAll:false})
				},
			}
		]
	}

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
	      	// rowKey={record => record.orderNo}
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
