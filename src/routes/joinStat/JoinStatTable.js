import React from "react"
import { Table, Pagination, Divider, Popconfirm } from "antd"
import styles from "../common.less"
import { getFormat, getYearFormat } from 'utils'
import moment from 'moment';

const JoinStatTable = ({
	...tableProps,
	dataLoading,
	count,
	pageNum,
	pageSize,
	onChangePage,
	onViewJoinUser,
}) => {

	const handleChangePage = (num, size) => {
		onChangePage(num==0?1:num, size)
	}

	const handleChangeSize = (current, size) => {
		onChangePage(current==0?1:current, size)
	}

	const handleViewJoinUser = (record) => {
		onViewJoinUser (record)
	}

	const getFixed = () => {
		let width = document.body.clientWidth
    if (width > 769) {
      width -= 304
		}
    if (width < 560) {
      return 'right'
    }
    return ''
	}

	const columns = [];
	columns.push({
		title: "账号",
		dataIndex: "loginName",
		width:'80px',
	})
	columns.push({
		title: "姓名",
		dataIndex: "name",
		width:'80px',
	})
	columns.push({
		title: "手机号",
		dataIndex: "phone",
		width:'80px',
	})
	columns.push({
		title: "所属部门",
		dataIndex: "departName",
		width:'80px',
	})
	columns.push({
		title: "招生人数",
		dataIndex: "sumCount",
		width:'80px',
	})
	columns.push({
		title: "通过人数",
		dataIndex: "passCount",
		width:'80px',
	})
	columns.push({
		title: "操作",
		dataIndex: "",
		width:'80px',
		fixed: getFixed(),
		render: (text, record) => {
			return (
				<div>
						<a onClick={() => handleViewJoinUser(record)}>查看</a>
				</div>
			);
		}
	})

	return (
		<div>
		  <Table
					{...tableProps}
					loading={dataLoading}
					size="middle"
					bordered
					columns={columns}
					pagination={false}
					className={styles.fixedTable}
					rowKey={record => record.id}
					scroll={{x:560}}
	      />
		   {count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
			
}

export default JoinStatTable;
