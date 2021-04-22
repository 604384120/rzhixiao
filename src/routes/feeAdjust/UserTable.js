import React from "react"
import { Table, Pagination } from "antd"
import styles from '../common.less'
import { getFormat, getYearFormat } from 'utils'
import { TableCom } from 'components'

const UserTable = ({
	data,
	dataSelected,
	selectedAll,
	userDisplayList,
	onChangePage,
	onUpdateState,
	onAdjust,
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
		onUpdateState({dataSelected:selectedRowKeys,selectedAll})
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
	const columnsName = [
		{dataIndex: "year", width: '80px', render: (text, record) => {return getYearFormat(text)}},
		{dataIndex: "missionName", width: '80px'},
		{dataIndex: "subjectName", width: '80px'},
		{dataIndex: "totalFee", width: '80px', render: (text, record) => {return getFormat(text)}}]
	columns.push({
		title: "学年",
		dataIndex: "year",
		width: 80,
		subColumns: columnsName,
		subColSpan: 4,
		subDataSource:(record)=>{return record.feeBillListEntities?record.feeBillListEntities.filter(item => item.status=='1'):[]},
	})
	columns.push({
		title: "任务名称",
		dataIndex: "missionName",
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
		title: "项目名称",
		dataIndex: "subjectName",
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
		title: "应收金额",
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
		title: "操作",
		dataIndex: "id",
		width:80,
		render: (text, record) => {
			return (
				<a onClick={()=>onAdjust(record)}>调整</a>
			)
		}
	})

	// const rowSelection = {
	// 	selectedRowKeys: data.dataSelected,
	// 	onChange: handelSelectChange,
	// 	getCheckboxProps: record => ({
	// 		disabled: record.editable === '0',
	// 		name: record.name,
	// 	}),
	// };

	const rowSelection = {
		selectedRowKeys: dataSelected,
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
					dataSelected = []
					for(let node of data.dataList){
						dataSelected.push(i++)
					}
					onUpdateState({dataSelected,selectedAll:false})
				},
			},
			{
				key: 'all',
				text: '选择全部',
				onSelect: () => {
					let i = 0
					dataSelected = []
					for(let node of data.dataList){
						dataSelected.push(i++)
					}
					onUpdateState({dataSelected,selectedAll:true})
				},
			},
			{
				key: 'node',
				text: '取消选择',
				onSelect: () => {
					dataSelected = []
					onUpdateState({dataSelected,selectedAll:false})
				},
			}
		]
	};

	return (
		<div>
		  <TableCom
	      	dataSource={data.dataList}
			rowSelection={rowSelection}
			size="middle"
			bordered
			columns={columns}
			pagination={false}
			loading={data.dataLoading}
			className={styles.fixedTable}
			styles={styles}
			scroll={{x:num*80}}
	      />
		  {data.count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={data.pageNum} defaultPageSize={data.pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={data.count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
}

export default UserTable;
