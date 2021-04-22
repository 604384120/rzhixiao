import { Table, Pagination, Dropdown, Menu, Icon, } from "antd"
import styles from "../common.less"
import { getFormat } from 'utils'
import { TableCom } from 'components'

const UserBillTable = ({
	count,
	user,menuMap,
	missionInfo,
	...tableProps,
	dataLoading,
	userDisplayList,
	pageNum, pageSize,
	selectedBills,
	selectedAll,
	onChangePage,
	onAdjust,
	onDiscount,
	onDeferred,
	onUpdateState,
	onTableOperateHistory,
}) => {
	const { dataSource } = tableProps;
	const handleChangePage = (num, size) => {
		onChangePage(num==0?1:num, size)
	}

	const handleChangeSize = (current, size) => {
		onChangePage(current==0?1:current, size)
	}

	const handelSelectChange = (selectedRowKeys) => {
		if(selectedRowKeys.length == 0){
			selectedAll = false
		}
		if(selectedAll){
			//不能修改
			return
		}
		onUpdateState({selectedBills: selectedRowKeys})
	}

	const renderAdjust = (text, record) => {
		if(menuMap['/feeAdjust']==undefined&&menuMap['/feeDiscount']==undefined&&menuMap['/feeDeferred']==undefined){
			return <a disabled={true}>调整</a>
		}
		return (
			record.feeBillListEntities&&record.feeBillListEntities.length>0?
			<Dropdown 
			overlay={
				<Menu>
					{menuMap['/feeAdjust']!=undefined&&<Menu.Item key="1"><a onClick={(e)=>{e.stopPropagation();onAdjust(record)}}>应收调整</a></Menu.Item>}
					{menuMap['/feeDiscount']!=undefined&&<Menu.Item key="2"><a onClick={(e)=>{e.stopPropagation();onDiscount(record)}}>减免调整</a></Menu.Item>}
					{menuMap['/feeDeferred']!=undefined&&<Menu.Item key="3"><a onClick={(e)=>{e.stopPropagation();onDeferred(record)}}>缓缴调整</a></Menu.Item>}
				</Menu>}><a>调整</a></Dropdown>:''
		);
	}

	const columns = [];
	let num = 6;
	for(let attr of userDisplayList){
		num++;
		columns.push({
			title: attr.name,
			dataIndex: attr.id,
			width: 80,
		})
	}
	const columnsName = [
		{dataIndex: "subjectName", width: '80px'},
		{dataIndex: "totalFee", width: '80px', render: (text, record) => {return getFormat(text)}},
		{dataIndex: "discount", width: '80px', render: (text, record) => {return getFormat(text)}},
		{dataIndex: "deferred", width: '80px', render: (text, record) => {return getFormat(text)}}]
	columns.push({
		title: "项目名称",
		dataIndex: "subjectName",
		width: 80,
		subColumns: columnsName,
		subColSpan: 4,
		subDataSource:(record)=>{return record.feeBillListEntities?record.feeBillListEntities.filter(item => item.status=='1'):[]},
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
		title: "缓缴金额",
		dataIndex: "deferred",
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
		title: "操作",
		dataIndex: "idsss",
		width: 60,
		render: (text, record) => {
			return <div>
				{renderAdjust(text, record)}
				<Dropdown 
					overlay={
						<Menu>
							{menuMap['/feeAdjust']!=undefined&&<Menu.Item key="1"><a onClick={(e)=>{e.stopPropagation();onTableOperateHistory(record,'1')}}>应收调整记录</a></Menu.Item>}
							{menuMap['/feeDiscount']!=undefined&&<Menu.Item key="2"><a onClick={(e)=>{e.stopPropagation();onTableOperateHistory(record,'2')}}>减免调整记录</a></Menu.Item>}
							{menuMap['/feeDeferred']!=undefined&&<Menu.Item key="3"><a onClick={(e)=>{e.stopPropagation();onTableOperateHistory(record,'3')}}>缓缴调整记录</a></Menu.Item>}
					</Menu>}>
					<Icon type="ellipsis" style={{fontWeight:'bold', fontSize:'14px', marginLeft:'10px'}}/>
				</Dropdown>
				<span> </span>
			</div>
		}
	})

	// const rowSelection = {
	// 	selectedRowKeys: selectedBills,
	// 	onChange: handelSelectChange,
	// 	getCheckboxProps: record => ({
	// 		disabled: record.editable === '0',
	// 		name: record.name,
	// 	}),
	// };

	const rowSelection = {
		selectedRowKeys: selectedBills,
		onChange: handelSelectChange,
		getCheckboxProps: record => ({
			disabled: selectedAll,
			status: record.status,
		}),
		hideDefaultSelections: true,
		selections: [
			{
				key: 'page',
				text: '选择本页',
				onSelect: () => {
					selectedBills = []
					let i = 0
					for(let node of tableProps.dataSource){
						selectedBills.push(i++)
					}
					onUpdateState({selectedBills,selectedAll:false})
				},
			},
			{
				key: 'all',
				text: '选择全部',
				onSelect: () => {
					selectedBills = []
					let i = 0
					for(let node of tableProps.dataSource){
						selectedBills.push(i++)
					}
					onUpdateState({selectedBills,selectedAll:true})
				},
			},
			{
				key: 'node',
				text: '取消选择',
				onSelect: () => {
					selectedBills = []
					onUpdateState({selectedBills,selectedAll:false})
				},
			}
		]
	};

	return (
		<div>
		  <TableCom
					{...tableProps}
					size="middle"
					rowSelection={rowSelection}
					bordered
					columns={columns}
					pagination={false}
					loading={dataLoading}
					scroll={{x:num*100}}
					className={styles.fixedTable}
					styles={styles}
	      />
		  {count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
}

export default UserBillTable;
