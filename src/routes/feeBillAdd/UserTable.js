import React from "react"
import { Table, Pagination, message, Button, Divider, Popconfirm } from "antd"
import styles from '../common.less'
import { TableCom } from 'components'

const UserTable = ({
	count,
	selectedUsers,
	selectedAll,
	...tableProps,
	userDisplayList,
	pageNum, pageSize,
	dataLoading,
	onChangePage,
	onUpdateState,
	onShowModal,
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
		onUpdateState({selectedUsers: selectedRowKeys})
	}

	const handleShowModal = (record) => {
		onShowModal(record.id)
	}

	const getFixed = () => {
		let width = document.body.clientWidth
    if (width > 769) {
      width -= 327
		}
    if (num-1 > (width-40) / 80) {
      return 'right'
    }
    return ''
	}

	const columns = [];
	let num=1;
	for(let attr of userDisplayList){
		num++;
		columns.push({
			title: attr.name,
			dataIndex: attr.id,
			width:80,
		})
	}
	columns.push({
		title: "操作",
		dataIndex: "idsss",
		width: 80,
		fixed: getFixed(),
		render: (text, record) => {
			return (
				<a onClick={() => handleShowModal(record)}>调整</a>
			);
		}
	})
	const rowSelection = {
		selectedRowKeys: selectedUsers,
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
					selectedUsers = []
					for(let node of tableProps.dataSource){
						selectedUsers.push(i++)
					}
					onUpdateState({selectedUsers,selectedAll:false})
				},
			},
			{
				key: 'all',
				text: '选择全部',
				onSelect: () => {
					let i = 0
					selectedUsers = []
					for(let node of tableProps.dataSource){
						selectedUsers.push(i++)
					}
					onUpdateState({selectedUsers,selectedAll:true})
				},
			},
			{
				key: 'node',
				text: '取消选择',
				onSelect: () => {
					selectedUsers = []
					onUpdateState({selectedUsers,selectedAll:false})
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
		  	 total={count} showSizeChanger showTotal={count => `共 ${count} 条`} showQuickJumper/>}
		</div>
		)
}

export default UserTable;
