import React from "react"
import { Table, Popconfirm, Pagination, Divider, Menu, Dropdown, Breadcrumb } from "antd"
import styles from '../common.less'

const SchoolTable = ({
	selectedOrders,
	selectedAll,
	shortName,
	dataLoading,
	departMap,
	departTreeMap,
	onEditUser,
	onDeleteUser,
	onResetPwd,
	onUpdateState,
	count,
	...tableProps,
	onChange,
	pageNum,
	pageSize
}) => {

	const handleChangePage = (num, size) => {
		onChange(num==0?1:num, size)
	}

	const handleChangeSize = (current, size) => {
		onChange(current==0?1:current, size)
	}

	const handelSelectChange = (selectedRowKeys) => {
		if(selectedRowKeys.length == 0){
			selectedAll = false
		}
		if(selectedAll){
			//不能修改
			return
		}
		onUpdateState({selectedOrders: selectedRowKeys})
	}

	const creatDepart = (dataList) => {
		let path = null
		let text = ''
		const getText = () => {
			for(let node of path){
				text += departTreeMap[node].name+'/'
			}
		}
		if(dataList){
			for(let index of dataList){
				if(index.departId && index.departId != '0' && departTreeMap['3_'+index.departId]){
					path = departTreeMap['3_'+index.departId]._path
					getText(path)
					text += departTreeMap['3_'+index.departId].name+'；'
				}else if(departMap[index.token] && (!index.departId || index.departId == '0')){
					path = departMap[index.token]._path
					getText(path)
					text += departMap[index.token].name+'；'
				}
			}
		}
		return text
	}

	const columns = [
		{
			title: "账号",
			dataIndex: "loginName",
			key: "loginName",
			width: 100,
			render: (text, record) => {
				return <a>{text+'@'+shortName}</a>
			}
		},{
			title: "姓名",
			dataIndex: "name",
			key: "name",
			width: 100,
		},{
			title: "手机号码",
			dataIndex: "phone",
			key: "phone",
			width: 100,
		},{
			title: "所属部门",
			dataIndex: "departList",
			key: "departList",
			render: (text, record) => {
				return creatDepart(text)
			}
		},{
			title: "状态",
			dataIndex: "status",
			key: "status",
			width: 60,
			render: (text, record) => {
				return <span>{text == '1'?'启用':'禁用'}</span>
			}
		},{
			title: "操作",
			dataIndex: "id",
			key: "id",
			width: 160,
			render: (text, record) => {
				return <div><a onClick={()=>{onEditUser(record)}}>编辑</a>
					<Divider type="vertical" /><Popconfirm title="删除不可恢复确认删除？" onConfirm={()=>{onDeleteUser(record)}} okText="Yes" cancelText="No">
						<a>删除</a>
					</Popconfirm><Divider type="vertical" />
					<a onClick={()=>{onResetPwd(record)}}>重置密码</a>
				</div>
			}
		}
	]

	const rowSelection = {
		selectedRowKeys: selectedOrders,
		onChange: handelSelectChange,
		columnWidth:40,
		getCheckboxProps: record => ({
			disabled: selectedAll || record.editable === '0',
			// name: record.name,
		}),
		hideDefaultSelections: true,
		selections: [
			{
				key: 'page',
				text: '选择本页',
				onSelect: () => {
					let i = 0
					selectedOrders = []
					for(let node of tableProps.dataSource){
						selectedOrders.push(i++)
					}
					onUpdateState({selectedOrders,selectedAll:false})
				},
			},
			{
				key: 'all',
				text: '选择全部',
				onSelect: () => {
					let i = 0
					selectedOrders = []
					for(let node of tableProps.dataSource){
						selectedOrders.push(i++)
					}
					onUpdateState({selectedOrders,selectedAll:true})
				},
			},
			{
				key: 'node',
				text: '取消选择',
				onSelect: () => {
					selectedOrders = []
					onUpdateState({selectedOrders,selectedAll:false})
				},
			}
		]
	}

	return (
		<div>
		  <Table
				{...tableProps}
				rowSelection={rowSelection}
				size="middle"
				bordered
				columns={columns}
				simple
				pagination={false}
				loading={dataLoading}
				// rowKey={record => record.id}
				// rowClassName={(record)=>handleSetRowClassName(record)}
				scroll={{x:800}}
			/>
		  {
			  count>1&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={count} showTotal={count => `共 ${count} 条`} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>
		  }
		</div>
		)
}

export default SchoolTable;
