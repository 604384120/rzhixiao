import { Table, Pagination } from "antd"
import styles from '../common.less'
import queryString from 'query-string'
import { getFormat,config, token } from 'utils'


const { api } = config

const UserTable = ({
	count,
	...tableProps,
	pageNum, pageSize,
	dataLoading,
	onChangePage,
	onShowDetail,
	timeType,
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
    if (width <= 900) {
      return 'right'
    }
    return ''
  }

	const getExportUrl = (record) => {
		let tempParam = {}
		tempParam.sence='statisticsTimeDisplay'
		tempParam.time = record.createDate
		tempParam.form = timeType
		if(token()){
      tempParam.token = token()
    }
		let url = `${api.exportDailyStatisticsFeeBill}?${queryString.stringify(tempParam)}`
    	return url
	}
	
	const columns = [];
	columns.push({
		title: "统计时间",
		dataIndex: "createDate",
		width:'100px'
	})
	columns.push({
		title: "缴费金额",
		dataIndex: "totalFee",
		width:'100px',
		render: (text, record) => {
			return getFormat(text)
		}
	})
	columns.push({
		title: "缴费笔数",
		dataIndex: "totalOrder",
		width:'100px',
	})
	columns.push({
		title: "退费金额",
		dataIndex: "refundFee",
		width:'100px',
		render: (text, record) => {
			return getFormat(parseInt(text))
		}
	})
	columns.push({
		title: "退费笔数",
		dataIndex: "refundOrder",
		width:'100px',
	})
	columns.push({
		title: "项目明细",
		dataIndex: "arrears",
		width:'100px',
		fixed: getFixed(),
		render: (text, record) => {
			return <a onClick={()=>onShowDetail(record, 1)}>查看详情</a>
		}
	})
	columns.push({
		title: "任务明细",
		dataIndex: "percent",
		width:'100px',
		fixed: getFixed(),
		render: (text, record) => {
			return <a onClick={()=>onShowDetail(record, 2)}>查看详情</a>
		}
	})
	columns.push({
		title: "收费方式",
		dataIndex: "subjectId",
		width: '100px',
		fixed: getFixed(),
		render: (text, record) => {
			return <a onClick={()=>onShowDetail(record, 3)}>查看详情</a>
		}
	})

	if(timeType!='year'){
		columns.push({
			title: "操作",
			dataIndex: "operationId",
			width: '100px',
			fixed: getFixed(),
			render: (text, record) => {
				return <a target="_blank" href={getExportUrl(record)}>{(timeType=='day'?'日':'月')+"账单下载"}</a>
			}
		})
	}
	
	return (
		<div>
		  <Table
			{...tableProps}
			bordered
			size="middle"
			columns={columns}
			pagination={false}
			loading={dataLoading}
			rowKey={record => record.subjectId}
			className={styles.fixedTable}
			scroll={{x:900}}
	      />
		  {count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
}

export default UserTable;
