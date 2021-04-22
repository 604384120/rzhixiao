import { Table, Pagination } from "antd"
import styles from '../common.less'
import { getFormat } from 'utils'
import { TableCom } from 'components'

const UserTable = ({
	dataList,
	pageNum,
	pageSize,
	count,
	dataLoading,
	userDisplayList,
	exceedFeeVisible,
	onShowDetail,
	onChangePage
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
    if (num > width / 80) {
      return 'right'
    }
    return ''
	}
	
	const columns = [];
	let num = 7;
	for(let attr of userDisplayList){
		num++;
		columns.push({
			title: attr.name,
			dataIndex: attr.id,
			width:80
		})
	}
	columns.push({
		title: "应收金额",
		dataIndex: "totalFee",
		width:80,
		render: (text, record) => {
			return getFormat(record.statisticsData.totalFee)
		}
	})
	columns.push({
		title: "减免金额",
		dataIndex: "discount",
		width:80,
		render: (text, record) => {
			return getFormat(record.statisticsData.discount)
		}
	})
	columns.push({
		title: "收费金额",
		dataIndex: "paidFee",
		width:80,
		render: (text, record) => {
			return getFormat(parseInt(record.statisticsData.paidFee)+parseInt(record.statisticsData.refund))
		}
	})
	columns.push({
		title: "退费金额",
		dataIndex: "refund",
		width:80,
		render: (text, record) => {
			return getFormat(record.statisticsData.refund)
		}
	})
	columns.push({
		title: "欠费金额",
		dataIndex: "arrears",
		width:80,
		render: (text, record) => {
			return getFormat(record.statisticsData.arrears)
		}
	})
	if(exceedFeeVisible){
		columns.push({
			title: "超收金额",
			dataIndex: "exceedFee",
			width:80,
			render: (text, record) => {
				return getFormat(record.statisticsData.exceedFee)
			}
		})
	}
	columns.push({
		title: "完成度",
		dataIndex: "percent",
		width:80,
		render: (text, record) => {
			return record.statisticsData.totalFee!='0'&&record.statisticsData.totalFee!=null?((record.statisticsData.totalFee-record.statisticsData.arrears)/record.statisticsData.totalFee*100).toFixed(2)+'%':'0%'
		}
	})
	columns.push({
		title: "操作",
		dataIndex: "id",
		width:80,
		fixed: getFixed(),
		render: (text, record) => {
			return (
				<a onClick={()=>onShowDetail(record)}>显示明细</a>
			)
		}
	})

	return (
		<div>
		  <TableCom
	      	dataSource={dataList}
			bordered
			size="middle"
			columns={columns}
			pagination={false}
			loading={dataLoading}
			className={styles.fixedTable}
			scroll={{x:num*80}}
	      />
		  {count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
}

export default UserTable;
