import React from "react"
import { Table, Pagination } from "antd"
import styles from '../common.less'
import { getFormat,getYearFormat } from 'utils'
import { TableCom } from 'components'

const UserTable = ({
	dataSource,
	count,
	pageNum,
	pageSize,
	dataLoading,
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
	let num = 10;
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
	columns.push({
		title: "学年",
		dataIndex: "year",
		width: 80,
		render: (text, record) => {
			return getYearFormat(text)
		}
	})
	columns.push({
		title: "任务名称",
		dataIndex: "missionName",
		width:80,
	})
	columns.push({
		title: "项目名称",
		dataIndex: "subjectName",
		width:80,
	})
	columns.push({
		title: "原应收金额",
		dataIndex: "srcFee",
		width:80,
		render: (text, record) => {
			return record.snapshot?getFormat(record.snapshot['totalFee']):'0.00'
		}
	})
	columns.push({
		title: "调整金额",
		dataIndex: "updateFee",
		width:80,
		render: (text, record) => {
			return getFormat(text)
		}
	})
	columns.push({
		title: "应收金额",
		dataIndex: "dstFee",
		width:80,
		render: (text, record) => {
			return record.info?getFormat(record.info['totalFee']):'0.00'
		}
	})
	columns.push({
		title: "调整事项",
		dataIndex: "snapshot",
		width:80,
		render: (text, record) => {
			if(!record.snapshot){
				return "账单添加"
			}
			if(record.snapshot['status'] == 0 && record.info['status'] == 1){
				return "账单开启"
			}
			if(record.snapshot['status'] == 1 && record.info['status'] == 0){
				return "账单关闭"
			}
			if(record.info['totalFee']){
				return "金额修改"
			}
			if(record.info['reason']){
				return "原因修改"
			}
			return "-"
		}
	})
	columns.push({
		title: "调整人",
		dataIndex: "accountName",
		width:80,
	})
	columns.push({
		title: "调整原因",
		dataIndex: "reason",
		width:80,
		render: (text, record) => {
			return record.info?record.info['reason']:''
		}
	})
	columns.push({
		title: "调整时间",
		dataIndex: "createDate",
		width:80,
		sorter: true,
		sortOrder: orderBy=="timeDesc"?'descend':(orderBy=="timeAsc"?'ascend':undefined)
	})

	return (
		<div>
		  <TableCom
			dataSource={dataSource}
			size="middle"
			bordered
			columns={columns}
			pagination={false}
			loading={dataLoading}
			className={styles.fixedTable}
			scroll={{x:num*80}}
			onChange={handleTableChange}
			styles={styles}
	      />
		  {count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
}

export default UserTable;
