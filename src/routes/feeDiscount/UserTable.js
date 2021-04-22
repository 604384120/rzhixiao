import React from "react"
import { Table, Pagination } from "antd"
import styles from '../common.less'
import { getFormat,getYearFormat } from 'utils'
import { TableCom } from 'components'

const UserTable = ({
	count,
	selectedAll,
	selectedRecords,
	...tableProps,
	userDisplayList,
	pageNum, pageSize,
	dataLoading,
	onChangePage,
	onUpdateState,
	onEdit,
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
	let num = 5;
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
		title: "减免金额",
		dataIndex: "discount",
		width:80,
		render: (text, record) => {
			return getFormat(text)
		}
	})
	columns.push({
		title: "操作",
		dataIndex: "id",
		width:80,
		fixed: getFixed(),
		render: (text, record) => {
			return (
				<a onClick={()=>onEdit(record)}>减免</a>
			)
		}
	})

	const rowSelection = {
		selectedRowKeys: selectedRecords,
		onChange: handelSelectChange,
		columnWidth:40,
		getCheckboxProps: record => ({
			disabled: selectedAll,
			status: record.status,
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
