import React from "react"
import { Table, Pagination, Popconfirm } from "antd"
import styles from "../common.less"
import { getFormat } from 'utils'
import { TableCom } from 'components'

const VerifySubjectStatTable = ({
	...tableProps,
	dataLoading,
	count,
	pageNum,
	pageSize,
	userDisplayList,
	selectedVerifys,
	onCancel,
	onConfirm,
	onChangePage,
  onUpdateState,
  onShowInfo
}) => {

	const handleChangePage = (num, size) => {
		onChangePage(num==0?1:num, size)
	}

	const handleChangeSize = (current, size) => {
		onChangePage(current==0?1:current, size)
	}

	const handleCancel = (record) => {
		onCancel (record)
	}

	const handleConfirm = (record) => {
		onConfirm (record)
	}

	const handelSelectChange = (selectedRowKeys) => {
		onUpdateState({selectedVerifys: selectedRowKeys})
	}

	const getFixed = () => {
		let width = document.body.clientWidth
    if (width > 769) {
      width -= 328
		}
    if (num-1 > (width-40) / 80) {
      return 'right'
    }
    return ''
  }

	const columns = [];
	let num = 8;
	for(let attr of userDisplayList){
		num ++;
		columns.push({
			title: attr.name,
			dataIndex: attr.id,
			width:80
		})
	}
	columns.push({
		title: "任务名称",
		dataIndex: "missionName",
		width:80,
	})
	columns.push({
		title: "项目名称",
		dataIndex: "subjectName",
		width:80,
	})
	columns.push({
		title: "剩余欠费",
		dataIndex: "fee",
    width:80,
    render: (text, record) => {
			return getFormat(record.fee)
		}
  })
  columns.push({
		title: "核销状态",
		dataIndex: "status",
    width:80,
    render: (text, record) => {
      if(text == '1'){
        return (<span style={{color:'green'}}>已核销</span>)
      }else{
        return (<span style={{color:'red'}}>未核销</span>)
      }
		}
	})
	columns.push({
		title: "核销时间",
		dataIndex: "date",
		width:80,
	})
	columns.push({
		title: "核销人员",
		dataIndex: "accountName",
		width:80,
	})
	columns.push({
		title: "操作",
		dataIndex: "id",
		width:80,
		fixed: getFixed(),
		render: (text, record) => {
			return (
				<div>
					<div>
          <a onClick={()=>onShowInfo(record)}>详情</a>&nbsp;
					{record.status=='1'?
						<Popconfirm title="确定取消核销?" onConfirm={()=>handleCancel(record)} okText="确定" cancelText="取消"><a>取消核销</a></Popconfirm>
						:<Popconfirm title="确定核销?" onConfirm={()=>handleConfirm(record)} okText="确定" cancelText="取消"><a>核销</a></Popconfirm>}
					</div>
				</div>
			);
		}
	})

	const rowSelection = {
		selectedRowKeys: selectedVerifys,
		onChange: handelSelectChange,
		columnWidth:40,
		getCheckboxProps: record => ({
			disabled: record.status === '1',
			status: record.status,
		}),
	};

	return (
		<div>
		  <TableCom
					{...tableProps}
					rowSelection={rowSelection}
					loading={dataLoading}
					size="middle"
					bordered
					columns={columns}
					pagination={false}
					className={styles.fixedTable}
					rowKey={record => record.billId}
					scroll={{x:num*80-40}}
	      />
		   {count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
			
}

export default VerifySubjectStatTable;
