import { Table, Pagination, Row } from "antd"
import styles from '../common.less'
import { getFormat } from 'utils'

const UserTable = ({
	count,
	structId,
	structList,
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
    if (num > width / 100) {
      return 'right'
    }
    return ''
  }

	const columns = [];
	let num = 8;
	if(structId){
		for(let struct of structList){
			num++;
			columns.push({
				title: struct.label,
				dataIndex: struct.id,
				width:'100px',
			})
			if(struct.id==structId){
				break;
			}
		}
	}
	const columnsName = [
		{dataIndex: "name", width: '100px'},
		{dataIndex: "totalFee", width: '100px', render: (text, record) => {return <div>{getFormat(text)}
			<Row className={styles.peopleNums}>{type=='1'?(record.totalFeeCount+'/人'):''}</Row></div>}},
		{dataIndex: "discount", width: '100px', render: (text, record) => {return <div>{getFormat(text)}
			<Row className={styles.peopleNums}>{type=='1'?(record.discountCount+'/人'):''}</Row></div>}},
		{dataIndex: "paidFee", width: '100px', render: (text, record) => {return <div>{getFormat(text)}
			<Row className={styles.peopleNums}>{type=='1'?(record.paidFeeCount+'/人'):''}</Row></div>}},
		{dataIndex: "refund", width: '100px', render: (text, record) => {return <div>{getFormat(text)}
			<Row className={styles.peopleNums}>{type=='1'?(record.refundCount+'/人'):''}</Row></div>}},
		{dataIndex: "arrears", width: '100px', render: (text, record) => {return <div>{getFormat(text)}
			<Row className={styles.peopleNums}>{type=='1'?(record.arrearsCount+'/人'):''}</Row></div>}},
		{dataIndex: "percent", width: '100px', render: (text, record) => {return text}},
	]
	columns.push({
		title: "年级",
		dataIndex: "gradeList",
		width:'100px',
		render: (text, record) => {
			return {
				children: record.gradeList&&record.gradeList.length>0?<Table
					dataSource={record.gradeList}
					size="middle"
					columns={columnsName}
					bordered
					showHeader={false}
					pagination={false}
					style={{width:'100%'}}
					/>:'',
				props: {
					colSpan: 7,
					className:styles.childTablePanel,
					style:{padding:'0'}
				},
			};
		}
	})
	columns.push({
		title: "应收金额",
		dataIndex: "totalFee",
		width:'100px',
		// render: (text, record) => {
		// 	return <div>{getFormat(text)}
		// 		<Row className={styles.peopleNums}>{type=='1'?(record.totalFeeCount+'/人'):''}</Row></div>
		// }
		render: (text, record) => {
			return {
				props: {
					colSpan: 0,
				},
			};
		}
	})
	columns.push({
		title: "减免金额",
		dataIndex: "discount",
		width:'100px',
		// render: (text, record) => {
		// 	return <div>{getFormat(text)}
		// 		<Row className={styles.peopleNums}>{type=='1'?(record.discountCount+'/人'):''}</Row></div>
		// }
		render: (text, record) => {
			return {
				props: {
					colSpan: 0,
				},
			};
		}
	})
	columns.push({
		title: "收费金额",
		dataIndex: "paidFee",
		width:'100px',
		// render: (text, record) => {
		// 	return <div>{getFormat(parseInt(text))}
		// 		<Row className={styles.peopleNums}>{type=='1'?(record.paidFeeCount+'/人'):''}</Row></div>
		// }
		render: (text, record) => {
			return {
				props: {
					colSpan: 0,
				},
			};
		}
	})
	columns.push({
		title: "退费金额",
		dataIndex: "refund",
		width:'100px',
		// render: (text, record) => {
		// 	return <div>{getFormat(text)}
		// 		<Row className={styles.peopleNums}>{type=='1'?(record.refundCount+'/人'):''}</Row></div>
		// }
		render: (text, record) => {
			return {
				props: {
					colSpan: 0,
				},
			};
		}
	})
	columns.push({
		title: "欠费金额",
		dataIndex: "arrears",
		width:'100px',
		padding:'3px 1px',
		// render: (text, record) => {
		// 	return <div>{getFormat(text)}
		// 		<Row className={styles.peopleNums}>{type=='1'?(record.arrearsCount+'/人'):''}</Row></div>
		// }
		render: (text, record) => {
			return {
				props: {
					colSpan: 0,
				},
			};
		}
	})
	columns.push({
		title: "完成度",
		dataIndex: "percent",
		width:'100px',
		// render: (text, record) => {
		// 	return record.totalFee!='0'&&record.totalFee!=null?Math.round((record.totalFee-record.arrears)/record.totalFee*100)+'%':'0%'
		// }
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
		width: '100px',
		render: (text, record) => {
			return <a onClick={()=>onShowDetail(record)}>查看明细</a>
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
			className={styles.fixedTable}
			scroll={{x:num*100}}
	      />
		  {count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
}

export default UserTable;
