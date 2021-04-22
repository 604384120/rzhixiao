import { Table, Pagination, Row } from "antd"
import styles from '../common.less'
import { getFormat } from 'utils'

const UserTable = ({
	dataList,
	...tableProps,
	dataLoading,
	type,
}) => {

	const getFixed = () => {
		let width = document.body.clientWidth
    if (width > 769) {
      width -= 304
		}
    if (num > width / 100) {
      return 'right'
    }
    return ''
  }

	const columns = [];
	let num = 7;
	
	columns.push({
		title: "学校",
		dataIndex: "name",
		width:'290px',
		className: styles.treeLeft,
	})
	columns.push({
		title: "应收金额",
		dataIndex: "totalFee",
		width:'70px',
		render: (text, record) => {
			return <div>{getFormat(text)}
				<Row className={styles.peopleNums}>{type=='1'?(record.totalFeeCount+'/人'):''}</Row></div>
		}
	})
	columns.push({
		title: "减免金额",
		dataIndex: "discount",
		width:'70px',
		render: (text, record) => {
			return <div>{getFormat(parseInt(text))}
				<Row className={styles.peopleNums}>{type=='1'?(record.discountCount+'/人'):''}</Row></div>
		}
	})
	columns.push({
		title: "收费金额",
		dataIndex: "paidFee",
		width:'70px',
		render: (text, record) => {
			return <div>{getFormat(text)}
				<Row className={styles.peopleNums}>{type=='1'?(record.paidFeeCount+'/人'):''}</Row></div>
		}
	})
	columns.push({
		title: "欠费金额",
		dataIndex: "arrears",
		width:'70px',
		padding:'3px 1px',
		render: (text, record) => {
			return <div>{getFormat(text)}
				<Row className={styles.peopleNums}>{type=='1'?(record.arrearsCount+'/人'):''}</Row></div>
		}
	})
	columns.push({
		title: "退费金额",
		dataIndex: "refund",
		width:'70px',
		render: (text, record) => {
			return <div>{getFormat(text)}
			<Row className={styles.peopleNums}>{type=='1'?(record.refundCount+'/人'):''}</Row></div>
		}
	})
	columns.push({
		title: "完成度",
		dataIndex: "token",
		width: '60px',
		render: (text, record) => {
			return record.totalFee!='0'&&record.totalFee!=null?Math.round((record.totalFee-record.arrears)/record.totalFee*100)+'%':'0%'
		}
	})
	// columns.push({
	// 	title: "操作",
	// 	dataIndex: "id",
	// 	width: '100px',
	// 	fixed: getFixed(),
	// 	render: (text, record) => {
	// 		return <a onClick={()=>onShowDetail(record)}>查看明细</a>
	// 	}
	// })

	return (
		<div>
		  <Table
			dataSource={dataList}
			bordered
			size="middle"
			columns={columns}
			pagination={false}
			loading={dataLoading}
			rowKey={record => record._value}
			className={styles.treeLeft}
			scroll={{x:num*100}}
	      />
		</div>
		)
}

export default UserTable;
