import { Table, Pagination, Divider, Popconfirm } from "antd"
import styles from '../common.less'
import { TableCom } from 'components'

const UserTable = ({
	count,
	dataSource,
	userDisplayList,
	selectedUsers,
	selectedAll,
	pageNum, pageSize,
	dataLoading,
	onChangePage,
	onEditUser,
	onDelete,
	onUpdateState,
}) => {
	const handleChangePage = (num, size) => {
		onChangePage(num==0?1:num, size)
	}

	const handleChangeSize = (current, size) => {
		onChangePage(current==0?1:current, size)
	}

	const handleDelete = (record) => {
		onDelete(record)
	}

	const handelSelectChange = (selectedRowKeys) => {
		if(selectedRowKeys.length == 0){
			selectedAll = false
		}
		if(selectedAll){
			//不能修改
			return
		}
		onUpdateState({selectedUsers: selectedRowKeys, selectedAll})
	}

	const getFixed = () => {
		let width = document.body.clientWidth
    if (width > 769) {
      width -= 577
		}
    if (num - 1 > (width-40) / 80) {
      return 'right'
    }
    return ''
	}

	const columns = [];
	let num=2;
	for(let attr of userDisplayList){
		num++;
		columns.push({
			title: attr.name,
			dataIndex: attr.id,
			width:80
		})
	}
	columns.push({
		title: "操作",
		dataIndex: "id",
		width:80,
		fixed: getFixed(),
		render: (text, record) => {
			return (
					<div>
						<a onClick={() => onEditUser(record)}>详情</a>
						<Divider type="vertical" />
						<Popconfirm title="删除不可恢复，确认删除？" onConfirm={()=>handleDelete(record)} okText="确定" cancelText="取消"><a>删除</a></Popconfirm>
					</div>
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
					selectedUsers = []
					for(let node of dataSource){
						selectedUsers.push(node.id)
					}
					onUpdateState({selectedUsers,selectedAll:false})
				},
			},
			{
				key: 'all',
				text: '选择全部',
				onSelect: () => {
					selectedUsers = []
					for(let node of dataSource){
						selectedUsers.push(node.id)
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
			dataSource={dataSource}
			size="middle"
			bordered
			rowSelection={rowSelection}
	        columns={columns}
	        pagination={false}
			loading={dataLoading}
	        rowKey={record => record.id}
			className={styles.fixedTable}
			scroll={{x:num*80-40}} 
	      />
		  {count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
}

export default UserTable;
