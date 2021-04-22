import React from "react"
import { Table, Pagination, message, Button, Divider, Popconfirm, Popover, InputNumber } from "antd"
import styles from '../common.less'

const UserTable = ({
	count,
	structId,
	structList,
	...tableProps,
	pageNum, pageSize,
	selectedRules,
	dataLoading,
	onChangePage,
	onUpdateState,
	onSaveFee,
}) => {
	const {dataSource} = tableProps
	const handleChangePage = (num, size) => {
		onChangePage(num==0?1:num, size)
	}

	const handleChangeSize = (current, size) => {
		onChangePage(current==0?1:current, size)
	}

	const handleChangeFeeEditVisible = (visible, record) => {
		record._feeEditVisible = visible
		onUpdateState({dataList:dataSource})
	}

	const handleCloseFeeEdit = (record) => {
		record._feeEditVisible = false
		record._fee = record.fee
		onUpdateState({dataList:dataSource})
	}

	const handleSaveFee = (record) => {
		if(!record._fee){
			message.error("收费标准不能空");
			return
		}
		record._feeEditVisible = false
		onSaveFee(record)
	}

	const handleChangeFee = (value, record) => {
		record._fee = value
		onUpdateState({dataList:dataSource})
	}
	
	const handelSelectChange = (selectedRowKeys) => {
		onUpdateState({selectedRules: selectedRowKeys})
	}

	const getFixed = () => {
		let width = document.body.clientWidth
    if (width > 769) {
      width -= 327
		}
    if (num-1 > (width-40) / 100) {
      return 'right'
    }
    return ''
	}

	const columns = [];
	let num = 2;
	if(structId){
		for(let struct of structList){
			num++;
			columns.push({
				title: struct.label,
				dataIndex: struct.id,
				width:100,
			})
			if(struct.id==structId){
				break;
			}
		}
	}
	columns.push({
		title: "收费标准",
		dataIndex: "id",
		width: 100,
		fixed: getFixed(),
		render: (text, record) => {
			return (
			<div>
				{
					record.editable=='1'?
					<Popover
						content={
							<div style={{'width':"150px"}}>
								<InputNumber style={{width:'100%'}} min={0} value={record._fee} onChange={(value)=>{handleChangeFee(value, record)}}/>
								<div style={{marginTop:'10px'}}>
								<Button style={{marginLeft:'50px'}} size='small' onClick={()=>handleCloseFeeEdit(record)}>取消</Button>
								<Button style={{marginLeft:'5px'}} size='small' onClick={()=>handleSaveFee(record)} type="primary">保存</Button>
								</div>
							</div>
						}
						title={record.fee?"修改金额":"设置金额"}
						trigger="click"
						visible={record._feeEditVisible}
						onVisibleChange={(visible)=>{handleChangeFeeEditVisible(visible, record)}}
					>
					<a>{record.fee?record.fee:'未设置'}</a>
					</Popover>
					:<span style={{color:'#b5b5b5'}}>已设置不同标准</span>
				}
			</div>
			);
		}
	})

	const rowSelection = {
		selectedRowKeys: selectedRules,
		onChange: handelSelectChange,
		columnWidth:40,
		getCheckboxProps: record => ({
			disabled: record.editable === '0',
			name: record.name,
		}),
	};

	return (
		<div>
		  <Table
			{...tableProps}
			size="middle"
			bordered
			rowSelection={rowSelection}
			columns={columns}
			pagination={false}
			loading={dataLoading}
			rowKey={record => record.id}
			className={styles.fixedTable}
			scroll={{x:num*100-40}}
	      />
		  {count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
}

export default UserTable;
