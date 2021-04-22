import { Table, Pagination } from "antd"
import styles from '../common.less'

const HisTable = ({
	data,
	userDisplayList,
	onChangePage,
	onUpdateState,
}) => {
	const handleChangePage = (num, size) => {
		onChangePage(num==0?1:num, size)
	}

	const handleChangeSize = (current, size) => {
		onChangePage(current==0?1:current, size)
	}
	
	const columns = [];
	let num = 4;
	for(let attr of userDisplayList){
		num ++;
		columns.push({
			title: attr.name,
			dataIndex: attr.id,
			width:'80px'
		})
	}
	columns.push({
		title: "调整前学分",
		dataIndex: "srcCredit",
		width:'80px'
	})
	columns.push({
		title: "调整后学分",
		dataIndex: "dstCredit",
		width:'80px',
	})
	columns.push({
		title: "调整人",
		dataIndex: "accountName",
		width:'80px',
	})
	columns.push({
		title: "调整时间",
		dataIndex: "createDate",
		width:'80px',
	})

	return (
		<div>
		  <Table
			dataSource={data.dataList}
			size="middle"
			bordered
			columns={columns}
			pagination={false}
			loading={data.dataLoading}
			className={styles.fixedTable}
			// scroll={{x:num*80}}
			scroll={{x:1062}}
	      />
		  {data.count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={data.pageNum} defaultPageSize={data.pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={data.count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
}

export default HisTable;
