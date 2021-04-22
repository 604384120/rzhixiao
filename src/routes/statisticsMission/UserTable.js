import React from "react"
import { Table, Pagination, message, Button, Divider, Popconfirm, Popover, Checkbox, Row } from "antd"
import styles from './index.less'
import { getFormat } from 'utils'

const UserTable = ({
	count,
	...tableProps,
	pageNum, pageSize,
	dataLoading,
	onChangePage,
	onShowDetail,
	type,
}) => {
	const handleChangePage = (num, size) => {
		onChangePage(num==0?1:num, size)
	}

	const handleChangeSize = (current, size) => {
		onChangePage(current==0?1:current, size) 
	}

	const getFixed = () => {
		let width = document.body.clientWidth
    if (width > 769) {
      width -= 304
		}
    if (width <= 800) {
      return 'right'
    }
    return ''
  }

	const columns = [];
	columns.push({
		title: "任务名称",
		dataIndex: "missionName",
		width:'100px'
	})
	columns.push({
		title: "应收金额",
		dataIndex: "totalFee",
		width:'100px',
		render: (text, record) => {
			return <div>{getFormat(text)}
				<Row className={styles.peopleNums}>{type=='1'?(record.totalFeeCount+'/人'):''}</Row></div>
		}
	})
	columns.push({
		title: "减免金额",
		dataIndex: "discount",
		width:'100px',
		render: (text, record) => {
			return <div>{getFormat(text)}
				<Row className={styles.peopleNums}>{type=='1'?(record.discountCount+'/人'):''}</Row></div>
		}
	})
	columns.push({
		title: "收费金额",
		dataIndex: "receivedFee",
		width:'100px',
		render: (text, record) => {
			// return <div>{getFormat(parseInt(text)+parseInt(record.refund))}
			return <div>{getFormat(text)}
				<Row className={styles.peopleNums}>{type=='1'?(record.paidFeeCount+'/人'):''}</Row></div>
		}
	})
	columns.push({
		title: "退费金额",
		dataIndex: "refund",
		width:'100px',
		render: (text, record) => {
			return <div>{getFormat(text)}
				<Row className={styles.peopleNums}>{type=='1'?(record.refundCount+'/人'):''}</Row></div>
		}
	})
	columns.push({
		title: "欠费金额",
		dataIndex: "arrears",
		width:'100px',
		render: (text, record) => {
			return <div>{getFormat(text)}
				<Row className={styles.peopleNums}>{type=='1'?(record.arrearsCount+'/人'):''}</Row></div>
		}
	})
	columns.push({
		title: "完成度",
		dataIndex: "percent",
		width:'100px',
		render: (text, record) => {
			return record.totalFee!='0'&&record.totalFee!=null&&record.totalFee!=0?Math.round((record.totalFee-record.arrears)/record.totalFee*100)+'%':'0%'
		}
	})
	columns.push({
		title: "操作",
		dataIndex: "missionId",
		width: '100px',
		fixed: getFixed(),
		render: (text, record) => {
			return <div><a onClick={()=>onShowDetail(record, 2)}>统计</a><Divider type="vertical" /><a onClick={()=>onShowDetail(record, 1)}>详情</a></div>
		}
	})

	return (
		<div>
		  <Table
			{...tableProps}
			bordered
			size="middle"
			columns={columns}
			pagination={false}
			loading={dataLoading}
			rowKey={record => record.missionId}
			className={styles.fixedTable}
			scroll={{x:800}}
	      />
		  {count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
}

export default UserTable;
