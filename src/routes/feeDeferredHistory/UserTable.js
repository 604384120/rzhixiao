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
		title: "原缓缴金额",
		dataIndex: "srcFee",
		width:80,
		render: (text, record) => {
			return record.snapshot?getFormat(record.snapshot['deferred']):'0.00'
		}
	})
	columns.push({
		title: "缓缴金额",
		dataIndex: "dstFee",
		width:80,
		render: (text, record) => {
			return record.info?getFormat(record.info['deferred']):'0.00'
		}
	})
	columns.push({
		title: "缓缴原因",
		dataIndex: "defReason",
		width:80,
		render: (text, record) => {
			return record.info?record.info['defReason']:''
		}
	})
	columns.push({
		title: "截止时间",
		dataIndex: "defTimeEnd",
		width:80,
		render: (text, record) => {
			return record.info?record.info['defTimeEnd']:''
		}
	})
	columns.push({
		title: "缓缴状态",
		dataIndex: "status",
		width:80,
		render: (text, record) => {
			if(text == "0"){
				return "无缓缴"
			}
			return text=="2"?<span style={{color:'red'}}>已过期</span>:<span style={{color:'green'}}>正常</span>
		}
	})
	columns.push({
		title: "操作时间",
		dataIndex: "createDate",
		width:80,
		sorter: true,
		sortOrder: orderBy=="timeDesc"?'descend':(orderBy=="timeAsc"?'ascend':undefined)
	})
	columns.push({
		title: "经办人",
		dataIndex: "accountName",
		width:80,
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
