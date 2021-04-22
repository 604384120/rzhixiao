import React from "react"
import { Table, Pagination, message, Button, Divider, Popconfirm, Popover, Checkbox } from "antd"
import styles from '../common.less'
import { getFormat } from 'utils'
import { TableCom } from 'components'

const UserTable = ({
	count,
	selectedLoans,
	...tableProps,
	userDisplayList,
	pageNum, pageSize,
	dataLoading,
	loanTypeMap,
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
		onUpdateState({selectedLoans: selectedRowKeys})
	}


	const columns = [];
	let num = 7;
	for(let attr of userDisplayList){
		num ++;
		columns.push({
			title: attr.name,
			dataIndex: attr.id,
			width:80
		})
	}
	columns.push({
		title: "收费任务",
		dataIndex: "missionName",
		width:80
	})
	const columnsName = [
		{dataIndex: "subjectName", width: 80},
		{dataIndex: "totalFee", width: 80, render: (text, record) => {return getFormat(text)}}
	]
	columns.push({
		title: "收费项目",
		dataIndex: "subjectName",
		width:80,
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
		title: "贷款金额",
		dataIndex: "totalFee",
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
		title: "订单号",
		dataIndex: "orderNo",
		width:120,
	})
	columns.push({
		title: "贷款类型",
		dataIndex: "loanType",
		width:80,
		render: (text, record) => {
			return loanTypeMap[text]
		}
	})
	columns.push({
		title: "状态",
		dataIndex: "status",
		width:80,
		render: (text, record) => {
			if(text=='0'){
				return <Popover content={record.remark} title="作废理由"><span style={{color:'red'}}>已作废</span></Popover>
			}else if(text=='5'){
				return <Popover content={record.remark} title="驳回理由"><span style={{color:'red'}}>已驳回</span></Popover>
			}else if(text=='4'){
				return <span style={{color:'rgb(255, 153, 0)'}}>审核中</span>
			}else if(text=='2'){
				return <span style={{color: 'green'}}>正常</span>
			}
		}
	})
	columns.push({
		title: "贷款时间",
		dataIndex: "timeEnd",
		width:80
	})
	columns.push({
		title: "经办人",
		dataIndex: "accountName",
		width:80,
		render: (text, record) => {
			return record.status=="1"?text:record.cancelAccountName
		}
	})

	const rowSelection = {
		selectedRowKeys: selectedLoans,
		onChange: handelSelectChange,
		columnWidth:40,
		getCheckboxProps: record => ({
			disabled: record.editable === '0',
			name: record.name,
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
