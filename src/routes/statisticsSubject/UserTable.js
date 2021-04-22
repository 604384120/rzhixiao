import { Table, Pagination, message, Button, Divider, Popconfirm, Popover, Checkbox, Row } from "antd"
import styles from '../common.less'
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
		title: "项目名称",
		dataIndex: "subjectName",
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
		dataIndex: "paidFee",
		width:'100px',
		render: (text, record) => {
			return <div>{getFormat(parseInt(text)+parseInt(record.refund))}
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
			return record.totalFee!='0'&&record.totalFee!=null?Math.round((record.totalFee-record.arrears)/record.totalFee*100)+'%':'0%'
		}
	})
	columns.push({
		title: "操作",
		dataIndex: "subjectId",
		width: '100px',
		fixed: getFixed(),
		render: (text, record) => {
			return <a onClick={()=>onShowDetail(record)}>查看详情</a>
		}
	})

	return (
		<div>
		  <Table
			{...tableProps}
			bordered
			size='middle'
			columns={columns}
			pagination={false}
			loading={dataLoading}
			rowKey={record => record.subjectId}
			className={styles.fixedTable}
			scroll={{x:800}}
	      />
		  {count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
}

export default UserTable;
