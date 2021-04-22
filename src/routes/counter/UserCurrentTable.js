import React from "react"
import { Table } from "antd"
import styles from '../common.less'
import { TableCom } from 'components'

const UserCurrentTable = ({
	userDisplayList,
	userCurrent,
	onCancelUser,
	dataLoading,
}) => {
	const handleRowClick = (record) => {
		onCancelUser({userCurrent:record})
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
				dataSource={[userCurrent]}
				size="middle"
				bordered
				columns={columns}
				loading={dataLoading}
				pagination={false}
				rowKey={record => record.id}
				className={styles.fixedTable}
				scroll={{x:240}}
				onRow={(record) => {
					return {
						onClick: () => {handleRowClick(record)},       // 点击行
					};
				}}
	      />
		</div>
		)
}

export default UserCurrentTable;
