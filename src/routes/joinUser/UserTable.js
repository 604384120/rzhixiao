import React from "react"
import { Table, Pagination, message, Button, Divider, Popconfirm, Popover, Checkbox } from "antd"
import styles from '../common.less'
import { getFormat } from 'utils'
import { TableCom } from 'components'
import { get } from "http"

const UserTable = ({
	count,
	selectedData,
	...tableProps,
	userDisplayList,
	pageNum, pageSize,
	dataLoading,
	onEditUser,
	onChangePage,
	onUpdateState,
}) => {
	const handleChangePage = (num, size) => {
		onChangePage(num==0?1:num, size)
	}

	const handleChangeSize = (current, size) => {
		onChangePage(current==0?1:current, size)
	}

	const handelSelectChange = (selectedRowKeys) => {
		onUpdateState({selectedData: selectedRowKeys})
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
	let num = 7;
	for(let attr of userDisplayList){
		num ++;
		columns.push({
			title: attr.name,
			dataIndex: attr.id,
			width:80,
		})
	}
	columns.push({
		title: "建档时间",
		dataIndex: "createDate",
		width:80
	})
	columns.push({
		title: "招生人员",
		dataIndex: "accountName",
		width:80,
  })
  columns.push({
		title: "更新时间",
		dataIndex: "updateDate",
		width:80
	})
	columns.push({
		title: "审核人员",
		dataIndex: "reviewName",
		width:80,
	})
	columns.push({
		title: "状态",
		dataIndex: "status",
		width:80,
		render: (text, record) => {
      if(text=='3'){
				return <Popover content={record.remark} title="驳回理由"><span style={{color:'red'}}>已驳回</span></Popover>
			}else if(text=='1'){
				return <span style={{color:'#FF9900'}}>审核中</span>
			}else if(text=='2'){
				return <span style={{color:'green'}}>正常</span>
			}
		}
  })
  columns.push({
		title: "操作",
		dataIndex: "op",
		width:80,
		fixed: getFixed(),
		render: (text, record) => {
			return <a disabled={record.status != '1'} onClick={() => onEditUser(record)}>详情</a>
		}
	})

	const rowSelection = {
		selectedRowKeys: selectedData,
		onChange: handelSelectChange,
		columnWidth:40,
		getCheckboxProps: record => ({
			disabled: record.status !== '1',
			name: record.name,
		}),
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
