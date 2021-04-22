import React from "react"
import { Table, Pagination, message, Button, Divider, Popconfirm } from "antd"
import styles from '../common.less'
import { TableCom } from 'components'

const UserTable = ({
	count,
	...tableProps,
	userDisplayList,
	pageNum, pageSize,
	dataLoading,
	userCurrent,
	onChangePage,
	onSelectUser,
}) => {
	const { dataSource } = tableProps;
	const handleChangePage = (num, size) => {
		onChangePage(num==0?1:num, size)
	}

	const handleChangeSize = (current, size) => {
		onChangePage(current==0?1:current, size)
	}

	const handleRowClick = (record) => {
		onSelectUser({userCurrent:record})
	}

	const columns = [];
	let num=1;
	for(let attr of userDisplayList){
		num++;
		columns.push({
			title: attr.name,
			dataIndex: attr.id,
			width:80,
			render: (text, record) => {
				return <span style={userCurrent&&userCurrent.id==record.id?{fontWeight:'bolder'}:{}}>{text}</span>
			}
		})
	}

	return (
		<div>
		  <TableCom
			{...tableProps}
			size="middle"
	        bordered
	        columns={columns}
	        pagination={false}
			loading={dataLoading}
	        rowKey={record => record.id}
			className={styles.fixedTable}
			scroll={{x:240,y: 240}}
			onRow={(record) => {
				return {
					onClick: () => {handleRowClick(record)},       // 点击行
				};
			}}
	      />
		  {count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
}

export default UserTable;
