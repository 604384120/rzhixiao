import { Table, Pagination } from "antd"
import styles from "../common.less"
import { getFormat } from 'utils'
import { TableCom } from 'components'

const StatisticsTable = ({
	count,
	...tableProps,
	dataLoading,
	userDisplayList,
	showSum,
	pageNum, pageSize,
	exceedFeeVisible,
	onChangePage,
	onShowDerate,
}) => {
	const { dataSource } = tableProps;
	const handleChangePage = (num, size) => {
		onChangePage(num==0?1:num, size)
	}

	const handleChangeSize = (current, size) => {
		onChangePage(current==0?1:current, size)
	}

	let num = 0;
	const columns = [];
	for(let attr of userDisplayList){
		num++;
		columns.push({
			title: attr.name,
			dataIndex: attr.id,
			width: 80,
		})
	}
	const columnsName = [
		{dataIndex: "subjectName", width: 80},
		{dataIndex: "totalFee", width: 80, render: (text, record) => {return getFormat(text)}},
		{dataIndex: "discount", width: 80, render: (text, record) => {return getFormat(text)}},
		{dataIndex: "paidFee", width: 80, render: (text, record) => {return getFormat(parseInt(text)+parseInt(record.refund))}},
		{dataIndex: "refund", width: 80, render: (text, record) => {return getFormat(text)}},
		{dataIndex: "arrears", width: 80, render: (text, record) => {return getFormat(text)}},
	]

	if(exceedFeeVisible){
		columnsName.push({dataIndex: "exceedFee", width: 80, render: (text, record) => {return getFormat(text)}})
	}

	const filterBill = (record) => {
		let arr = []
		if(record.feeBillListEntities){
			for(let node of record.feeBillListEntities){
				if(node.status == '1'){
					arr.push(node)
				}
				if(showSum && node.id=='_totalSum'){
					arr.push(node)
				}
			}
		}
		return arr
	}

	columns.push({
		title: "项目名称",
		dataIndex: "subjectName",
		width: 80,
		subColumns: columnsName,
		subColSpan: exceedFeeVisible?7:6,
		subDataSource: (record)=>{return filterBill(record)},
		// render: (text, record) => {
			// return {
			// 	children: record.feeBillListEntities&&record.feeBillListEntities.length>0?<Table
			// 		dataSource={filterBill(record)}
			// 		size="middle"
			// 		columns={columnsName}
			// 		bordered
			// 		showHeader={false}
			// 		pagination={false}
			// 		rowKey={re => re.id}
			// 		style={{width:'100%'}}
			//   	/>:'',
			// 	props: {
			// 	  colSpan: 6,
			// 	  className:styles.childTablePanel,
			// 	  style:{padding:'0'}
			// 	},
			// };
		// }
	})
	columns.push({
		title: "应收金额",
		dataIndex: "totalFee",
		width: 80,
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
		width: 80,
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
		width: 80,
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
		width: 80,
		render: (text, record) => {
			return {
				props: {
				  colSpan: 0,
				},
			};
		}
	})
	columns.push({
		title: "剩余欠费",
		dataIndex: "arrears",
		width: 80,
		render: (text, record) => {
			return {
				props: {
				  colSpan: 0,
				},
			};
		}
	})
	if(exceedFeeVisible){
		columns.push({
			title: "超收金额",
			dataIndex: "exceedFee",
			width: 80,
			render: (text, record) => {
				return {
					props: {
						colSpan: 0,
					},
				};
			}
		})
	}
	return (
		<div>
		  <TableCom
				{...tableProps}
				size="middle"
				bordered
				columns={columns}
				pagination={false}
				loading={dataLoading}
				rowKey={record => record.id}
				scroll={{x:num*80}}
				className={styles.fixedTable}
				styles={styles}
			/>
		  {count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
}

export default StatisticsTable;
