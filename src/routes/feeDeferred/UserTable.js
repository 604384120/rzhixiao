import React from "react"
import { Table, Pagination } from "antd"
import styles from '../common.less'
import { getFormat, getYearFormat } from 'utils'
import { TableCom } from 'components'

const UserTable = ({
	count,
	selectedRecords,
	...tableProps,
	userDisplayList,
	pageNum, pageSize,
	dataLoading,
	onChangePage,
	onUpdateState,
	onEdit,
	selectedAll,
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
		onUpdateState({selectedRecords: selectedRowKeys})
	}

	const getFixed = () => {
		let width = document.body.clientWidth
    if (width > 769) {
      width -= 328
		}
    if (num-1 > (width-40) / 80) {
      return 'right'
    }
    return ''
  }

	const columns = [];
	let num = 9;
	for(let attr of userDisplayList){
		num ++;
		columns.push({
			title: attr.name,
			dataIndex: attr.id,
			width:80
		})
	}
	columns.push({
		title: "学年",
		dataIndex: "year",
		width:80,
		render: (text, record) => {
			return getYearFormat(text)
		}
	})
	columns.push({
		title: "任务名称",
		dataIndex: "missionName",
		width:80
	})
	columns.push({
		title: "项目名称",
		dataIndex: "subjectName",
		width:80
	})
	columns.push({
		title: "缓缴金额",
		dataIndex: "deferred",
		width:80,
		render: (text, record) => {
			return getFormat(text)
		}
	})
	columns.push({
		title: "缓缴原因",
		dataIndex: "defReason",
		width:80
	})
	columns.push({
		title: "截至时间",
		dataIndex: "defTimeEnd",
		width:80
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
		title: "操作",
		dataIndex: "id",
		width:80,
		fixed: getFixed(),
		render: (text, record) => {
			return (
				<a onClick={()=>onEdit(record)}>缓缴</a>
			)
		}
	})

	const rowSelection = {
		selectedRowKeys: selectedRecords,
		onChange: handelSelectChange,
		columnWidth:40,
		getCheckboxProps: record => ({
			disabled: selectedAll,
			// status: record.status,
		}),
		hideDefaultSelections: true,
		selections: [
			{
				key: 'page',
				text: '选择本页',
				onSelect: () => {
					let i = 0
					selectedRecords = []
					for(let node of tableProps.dataSource){
						selectedRecords.push(i++)
					}
					onUpdateState({selectedRecords,selectedAll:false})
				},
			},
			{
				key: 'all',
				text: '选择全部',
				onSelect: () => {
					let i = 0
					selectedRecords = []
					for(let node of tableProps.dataSource){
						selectedRecords.push(i++)
					}
					onUpdateState({selectedRecords,selectedAll:true})
				},
			},
			{
				key: 'node',
				text: '取消选择',
				onSelect: () => {
					selectedRecords = []
					onUpdateState({selectedRecords,selectedAll:false})
				},
			}
		]
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
			className={styles.fixedTable}
			scroll={{x:num*80-40}}
	      />
		  {count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
}

export default UserTable;
