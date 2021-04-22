import React from "react"
import { Table, Pagination, Divider, Popconfirm } from "antd"
import styles from "../common.less"
import { getFormat, getYearFormat } from 'utils'
import moment from 'moment';

const VerifySubjectTable = ({
	...tableProps,
	dataLoading,
	count,
	pageNum,
	pageSize,
	onEidt,
	onStatInfo,
	onDeleteVerfy,
	onChangePage,
}) => {
		const { dataSource } = tableProps;

		const handleChangePage = (num, size) => {
			onChangePage(num==0?1:num, size)
		}

		const handleChangeSize = (current, size) => {
			onChangePage(current==0?1:current, size)
		}
		
		const handleOnEidt = (record) => {
			onEidt (record)
		}

		const handleStat = (record) => {
			onStatInfo(record)
		}

		const handleDeleteVerfy = (record) => {
			onDeleteVerfy (record)
		}

		const getFixed = () => {
			let width = document.body.clientWidth
			if (width > 769) {
				width -= 304
			}
			if (width <= 600) {
				return 'right'
			}
			return ''
		}

    const columns = [
		{
			title: "学年",
			dataIndex: "year",
			width: 100,
			render: (text, record) => {
				return (
					record._editable ? 
					<Select style={{ margin: '-10px', width:'100%'}} defaultValue={text.toString()} onChange={(value)=>{handleChangeTemp('year',value, record)}}>
						  {createYearSelect()}
					</Select>
					: getYearFormat(text)
				)
			}
		},{
			title: "任务名称",
			dataIndex: "missionName",
			width: 100,
		},{
			title: "项目名称",
			dataIndex: "subjectName",
			width: 100,
		},{
			title: "核销人员",
			dataIndex: "accountName",
			width: 150,
		},{
			title: "操作",
			dataIndex: "id",
			width: 150,
			fixed: getFixed(),
			render: (text, record) => {
				return (
					<div>
						<div>
								<a onClick={() => handleOnEidt(record)}>编辑</a>
								<Divider type="vertical" />
								<a onClick={() => handleStat(record)}>核销统计</a>
								<Divider type="vertical" />
								<Popconfirm title="删除不可恢复确认删除?" onConfirm={()=>handleDeleteVerfy(record)} okText="确定" cancelText="取消"><a>删除</a></Popconfirm>
						</div>
					</div>
				);
			}
		}
	]

	return (
		<div>
		  <Table
					dataSource={dataSource}
					loading={dataLoading}
					size="middle"
					bordered
					columns={columns}
					pagination={false}
					className={styles.fixedTable}
					rowKey={record => record.id}
					scroll={{x:600}}
	      />
		   {count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
			
}

export default VerifySubjectTable;
