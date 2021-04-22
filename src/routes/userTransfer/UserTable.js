import React from "react"
import { Table, Pagination } from "antd"
import styles from '../common.less'
import { getFormat } from 'utils'
import { TableCom } from 'components'

const UserTable = ({
	dataList,
    dataLoading,
    count,
    pageNum,
    pageSize,
	userDisplayList,
	onChangePage,
	onChangeSort,
	orderBy
}) => {
	const handleChangePage = (num, size) => {
		onChangePage(num==0?1:num, size)
	}

	const handleChangeSize = (current, size) => {
		onChangePage(current==0?1:current, size)
	}

	const handleTableChange = (pagination, filters, sorter) => {
		let sortMap = {
			createDate: {
				descend: "timeDesc",
				ascend: "timeAsc"
			},
			_default: {
				descend: "numberDesc",
				ascend: "numberAsc"
			}
		}
		if(sorter){
			onChangeSort(sortMap[sorter.columnKey]?sortMap[sorter.columnKey][sorter.order]:sortMap["_default"][sorter.order])			
		}
	}
	
	const columns = [];
	let num = 5;
	for(let attr of userDisplayList){
		num ++;
		columns.push({
			title: attr.name,
			dataIndex: attr.id,
			sorter: attr.name=='学号'?true:false,
			width:80,
			sortOrder: attr.name=='学号'&&orderBy=="numberDesc"?'descend':(attr.name=='学号'&&orderBy=="numberAsc"?'ascend':undefined)
		})
	}
	const columnsName = [
		{dataIndex: 'type', width: 80},
		{dataIndex: 'beforeRecord', width: 80},
		{dataIndex: 'afterRecord', width: 80}
	]
	columns.push({
		title: "异动类型",
		dataIndex: "type",
		width:80,
		render: (text, record) => {
			return {
				children: record.recordList&&record.recordList.length>0?<Table
					dataSource={record.recordList}
					size="middle"
					columns={columnsName}
					bordered
					showHeader={false}
					pagination={false}
					style={{width:'100%'}}
			  	/>:'',
				props: {
				  colSpan: 3,
				  className:styles.childTablePanel,
				  style:{padding:'0'}
				},
			};
		}
	})
	columns.push({
		title: "调整前记录",
		dataIndex: "beforeRecord",
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
		title: "调整后记录",
		dataIndex: "afterRecord",
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
		title: "经办人",
		dataIndex: "accountName",
		width:80,
	})
	columns.push({
		title: "调整时间",
		dataIndex: "createDate",
		width:80,
		sorter: true,
		sortOrder: orderBy=="timeDesc"?'descend':(orderBy=="timeAsc"?'ascend':undefined),
		//  render: (text, record) => {
		// 	record[dataIndex]
		// 	return <div>{record.recordList[0].createDate}</div>
		//  }
	})
	return (
		<div>
			<TableCom
			dataSource={dataList}
			size="middle"
			bordered
			columns={columns}
			pagination={false}
			loading={dataLoading}
			className={styles.fixedTable}
			scroll={{x:num*80}}
			onChange={handleTableChange}
			/>
		{count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
			 total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		
		</div>
		)
			
}

export default UserTable;
