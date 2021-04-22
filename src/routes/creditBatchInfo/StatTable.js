import { Table, Pagination } from "antd"
import styles from '../common.less'
import { getFormat } from 'utils'
import { TableCom } from 'components'

const StatTable = ({
	data,
	userDisplayList,
	onChangePage,
	onUpdateState,
	onShowStatDetail,
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
      width -= 327
		}
    if (num > width / 80) {
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
		title: "学分总数",
		dataIndex: "credit",
		width:80
	})
	columns.push({
		title: "学分学费",
		dataIndex: "fee",
		width:80,
		render: (text, record) => {
			return  getFormat(text)
		}
	})
	columns.push({
		title: "操作",
		dataIndex: "id",
		width:80,
		fixed: getFixed(),
		render: (text, record) => {
			return (
				<a onClick={()=>onShowStatDetail(record)}>详情</a>
			);
		}
	})

	return (
		<div>
		  <TableCom
			dataSource={data.dataList}
			size="middle"
			bordered
			columns={columns}
			pagination={false}
			loading={data.dataLoading}
			className={styles.fixedTable}
			scroll={{x:num*80}}
	      />
		  {data.count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={data.pageNum} defaultPageSize={data.pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={data.count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
}

export default StatTable;
