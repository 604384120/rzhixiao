import { Table, Pagination, message } from "antd"
import styles from "../common.less"

const FeeRuleTable = ({
	count,
	...tableProps,
	structList, structIdSelected, displayStructId,
	attrId,
	attrName,
	attrList,
	subjectName,
	user,
	missionInfo,
	pageNum, pageSize,
	dataLoading,
	selectedRules,
	onChangePage,
	onChangeDataSource,
	onUpdateState,
	onSaveFee,
}) => {
	const { dataSource } = tableProps;
	const handleChangePage = (num, size) => {
		onChangePage(num==0?1:num, size)
	}

	const handleChangeSize = (current, size) => {
		onChangePage(current==0?1:current, size)
	}

	const handleChangeFeeEditVisible = (visible, record) => {
		record._feeEditVisible = visible
		onChangeDataSource(dataSource)
	}

	const handleCloseFeeEdit = (record) => {
		record._feeEditVisible = false
		record._fee = record.fee
		onChangeDataSource(dataSource)
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
		onChangeDataSource(dataSource)
	}
	
	const handelSelectChange = (selectedRowKeys) => {
		onUpdateState({selectedRules: selectedRowKeys})
	}

	let num = 2;
	const columns = [];
	if(structIdSelected == "0"){
		num++
		columns.push({
			title: "标准维度",
			dataIndex: "stand",
			width:'200px',
			render: (text, record) => { return "统一标准"}
		})
	}else{
		for(let struct of structList){
			num++;
			columns.push({
				title: struct.label,
				dataIndex: struct.id,
				width:'80px',
			})
			if(struct.id==displayStructId){
				break;
			}
		}
		
		if(attrList){
			for(let attr of attrList){
				num++;
				//获取层级关联字段
				columns.push({
					title: attr.attrName,
					dataIndex: "attrId_"+attr.attrId,
					width:'80px',
				})
			}
		}
	}

	columns.push({
		title: "项目名称",
		dataIndex: "subjectName",
		width:'80px',
		render: (text, record) => {
			return subjectName
		}
	})

	const columnsName = []
	if(attrId){
		columnsName.push({dataIndex: "relateName", width: '80px',render: (text, record) => {
			if(record.relateId=='0'){
				return <span style={{fontWeight:'500'}}>默认标准</span>
			}else{
				return text
			}
		}})
	}
	columnsName.push({dataIndex: "fee", width: '80px', render: (text, record) => {
		return record.editable=='1'?<span>{record.fee?record.fee:'未设置'}</span>:<span style={{color:'#b5b5b5'}}>{record.fee?record.fee:"已设置不同标准"}</span>
	}})
	if(attrId){
		columns.push({
			title: attrName,
			dataIndex: "relateId",
			width: '80px',
			render: (text, record) => {
				return {
					children: record.feeList&&record.feeList.length>0?<Table
						dataSource={record.feeList}
						size="middle"
						columns={columnsName}
						bordered
						showHeader={false}
						pagination={false}
						rowKey={re => re.relateId}
						style={{width:'100%'}}
					  />:'',
					props: {
					  colSpan: 2,
					  className:styles.childTablePanel,
					  style:{padding:'0'}
					},
				};
			}
		})
		columns.push({
			title: "收费标准",
			dataIndex: "fee",
			width: '80px',
			render: (text, record) => {
				return {
					props: {
					  colSpan: 0,
					},
				};
			}
		})
	}else{
		columns.push({
			title: '收费标准',
			dataIndex: "fee",
			width: '80px',
			render: (text, record) => {
				return {
					children: record.feeList&&record.feeList.length>0?<Table
						dataSource={record.feeList}
						size="middle"
						columns={columnsName}
						bordered
						showHeader={false}
						pagination={false}
						rowKey={re => re.relateId}
						style={{width:'100%'}}
					  />:'',
					props: {
					  colSpan: 1,
					  className:styles.childTablePanel,
					  style:{padding:'0'}
					},
				};
			}
		})
	}

	const rowSelection = {
		selectedRowKeys: selectedRules,
		onChange: handelSelectChange,
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
					rowSelection={rowSelection}
					bordered
					columns={columns}
					pagination={false}
					loading={dataLoading}
					rowKey={record => record._index}
					className={styles.fixedTable}
					scroll={{x:num*80}} 
	      />
		  {count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
}

export default FeeRuleTable;
