import React from "react"
import { Table } from "antd"
import styles from '../common.less'
import { getFormat } from 'utils'

const DateTable = ({
	...tableProps,
	dataLoading,
  payTypeNameMap,
  showSubject
}) => {
	const { dataSource } = tableProps;
	const columns = [{
		title: "日期",
		dataIndex: "date",
		width: 100,
		render: (text, record) => {
			const obj = {
				children: text,
				props: {},
			};
			obj.props.rowSpan = record.rowSpan
			return obj;
		}
	},{
		title: "支付方式",
		dataIndex: "payType",
		width: 100,
		render: (text, record) => {
			if(text=='0'){
				return '总计'
      }
      if(showSubject){
        const obj = {
          children: payTypeNameMap[text],
          props: {},
        };
        obj.props.rowSpan = record.subRowSpan
        return obj;
      }
			return payTypeNameMap[text]
		}
  }]
  if(showSubject){
    columns.push({
      title: "收费项目",
      dataIndex: "name",
      width: 100,
    })
  }
  columns.push({
		title: "订单总额",
		dataIndex: "paidFee",
		width: 100,
		render: (text, record) => {
			return getFormat(text)
		}
  })
  columns.push({
		title: "订单笔数",
		dataIndex: "paidFeeCount",
		width: 100,
  })
  columns.push({
		title: "退款总额",
		dataIndex: "refund",
		width: 100,
		render: (text, record) => {
			return getFormat(text)
		}
  })
  columns.push({
		title: "退款笔数",
		dataIndex: "refundCount",
		width: 100,
  })
  columns.push({
		title: "实收总额",
		dataIndex: "realFee",
		width: 100,
		render: (text, record) => {
			return getFormat(text)
		}
	})

	return (
		<div>
		  <Table
			{...tableProps}
			size="middle"
	        bordered
	        columns={columns}
	        pagination={false}
			loading={dataLoading}
	        rowKey={record => record.id}
			className={styles.fixedTable}
			scroll={{x:1062}}
	      />
		</div>
		)
}

export default DateTable;
