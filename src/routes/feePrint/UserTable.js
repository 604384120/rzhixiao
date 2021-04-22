import React from "react"
import { Table, Pagination, message, Button, Divider, Popconfirm, Popover, Checkbox } from "antd"
import styles from '../common.less'
import { getFormat } from 'utils'
import { TableCom } from 'components'

const UserTable = ({
	count,
	selectedPrints,
	dataSource,
	userDisplayList,
	pageNum, pageSize,
	dataLoading,
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
		onUpdateState({selectedPrints: selectedRowKeys})
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
		title: "票据类型",
		dataIndex: "templateName",
		width:80
	})
	columns.push({
		title: "票据编号",
		dataIndex: "receiptNo",
		width:80,
		render: (text, record) => {
			if(record.downUrl){
				//存在下载链接
				return <Popover content={<a target="_blank" href={record.downUrl}>下载电子票据</a>}>{text}</Popover>
			}
			return text
		},
	})
	columns.push({
		title: "打印时间",
		dataIndex: "createDate",
		width:80
	})
	columns.push({
		title: "经办人",
		dataIndex: "accountName",
		width:80
	})
	columns.push({
		title: "打印状态",
		dataIndex: "status",
		width:80,
		render: (text, record) => {
			return text=="0"?<span style={{color:'red'}}>已作废</span>:<span style={{color:'green'}}>正常</span>
		}
	})
	columns.push({
		title: "任务名称",
		dataIndex: "missionName",
		width:80
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
		// 			columns={columnsName}
		// 			size="middle"
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
		title: "实收金额",
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

	const rowSelection = {
		selectedRowKeys: selectedPrints,
		onChange: handelSelectChange,
		columnWidth:40,
		getCheckboxProps: record => ({
			disabled: record.status !== '1',
			name: record.name,
		}),
	};

	return (
		<div>
		  <TableCom
			dataSource={dataSource}
			rowSelection={rowSelection}
			size="middle"
			bordered
			columns={columns}
			pagination={false}
			loading={dataLoading}
			rowKey={record => record._index}
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
