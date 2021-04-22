import React from "react"
import { Table, message,Pagination } from "antd"
import { getFormat } from 'utils'

const OrderTable = ({
	count,
	pageNum,
	pageSize,
	userDisplayList,
	payTypeNameMap,
	...tableProps,
	dataLoading,
	onChangePage,
	onPrint
}) => {

	const handleChangePage = (num, size) => {
		onChangePage(num, size)
	}

	const handleChangeSize = (current, size) => {
		onChangePage(current, size)
	}

	const handlePrint = (orderId) => {
		onPrint(orderId)
	}

	const columns = [
		{
			title: "收费时间",
			dataIndex: "timeEnd",
		},{
			title: "订单号",
			dataIndex: "orderNo",
		},{
			title: "本次实收",
			dataIndex: "fee",
			render: (text, record) => {
				return getFormat(record.fee)
			}
		},{
			title: "支付方式",
			dataIndex: "payType",
			render: (text, record) => {
				return payTypeNameMap[text]
			}
		}
	]
	for(let attr of userDisplayList){
		columns.push({
			title: attr.name,
			dataIndex: attr.id,
		})
	}
	columns.push({
		title: "票据单号",
		dataIndex: "receiptNo",
	})
	columns.push({
		title: "操作",
		dataIndex: "id",
		render: (text, record) => {
			return (<a disabled={record.receiptNo?true:false} onClick={()=>handlePrint(record.orderNo)}>打印</a>)
		}
	})
	return (
		<div>
		  <Table
	        {...tableProps}
			loading={dataLoading}
	        bordered
	        columns={columns}
	        pagination={false}
	        rowKey={record => record.id}
	      />
		  <Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	total={count} showSizeChanger showQuickJumper/>
		</div>
		)
}

export default OrderTable;
