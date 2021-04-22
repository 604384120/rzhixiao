import { Table, Pagination, Popconfirm } from "antd"
import styles from '../common.less'
import { TableCom } from 'components'

const UserTable = ({
	data,
	userDisplayList,
	onChangePage,
	onUpdateState,
	onDelete,
}) => {
	const handleChangePage = (num, size) => {
		onChangePage(num==0?1:num, size)
	}

	const handleChangeSize = (current, size) => {
		onChangePage(current==0?1:current, size)
	}

	const handelSelectChange = (selectedRowKeys) => {
		data.dataSelected = selectedRowKeys
		onUpdateState({userData: data})
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
	let num = 3;
	for(let attr of userDisplayList){
		num ++;
		columns.push({
			title: attr.name,
			dataIndex: attr.id,
			width:80
		})
	}
	columns.push({
		title: "所选课程",
		dataIndex: "className",
		width:80
	})
	columns.push({
		title: "操作",
		dataIndex: "id",
		width:80,
		fixed: getFixed(),
		render: (text, record) => {
			return (
				<div>
					<Popconfirm title="删除不可恢复确认删除?" onConfirm={()=>onDelete(record)} okText="确定" cancelText="取消"><a>删除</a></Popconfirm>
				</div>
			);
		}
	})

	const rowSelection = {
		selectedRowKeys: data.dataSelected,
		onChange: handelSelectChange,
		columnWidth:40,
		getCheckboxProps: record => ({
			disabled: record.editable === '0',
			name: record.name,
		}),
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
			rowKey={record => record.id}
			className={styles.fixedTable}
			scroll={{x:num*80-40}}
	      />
		  {data.count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={data.pageNum} defaultPageSize={data.pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={data.count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
}

export default UserTable;
