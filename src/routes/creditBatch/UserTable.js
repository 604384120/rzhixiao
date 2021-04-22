import React from "react"
import { Table, Popconfirm, Input, Select, message, Divider } from "antd"
import styles from "../common.less"
import moment from 'moment';
import { getYearFormat } from 'utils'

const Option = Select.Option;

const UserTable = ({
	...tableProps,
	count, pageNum, pageSize,
	dataLoading,
	onAddCreditBatch,
	onUpdateDataSource,
	onSaveCreditBatch,
	onDeleteCreditBatch,
	onCreditBatchInfo,
}) => {
	const { dataSource } = tableProps;
	const handleOnEidt = (record) => {
		const target = dataSource.filter(item => record.id === item.id)[0];
		if (target) {
			target._editable = true;
			target._tempSource = {...target}
			onUpdateDataSource(dataSource);
		}
	}

	const handleOnCancel = (record) => {
		const target = dataSource.filter(item => record.id === item.id)[0];
		if (target) {
			target._editable = false;
			if(target._add){
				dataSource.splice(0, 1);
			}
			onUpdateDataSource(dataSource);
		}
	}

	const getFixed = () => {
		let width = document.body.clientWidth
    if (width > 769) {
      width -= 304
		}
    if (width < 550) {
      return 'right'
    }
    return ''
	}

	const handleOnSave = (record) => {
		if(!record._tempSource.name){
			message.error("请输入批次名称")
			return
		}
		if(!record._tempSource.year){
			message.error("请选择学年")
			return
		}
		if(record._add){
			onAddCreditBatch(record._tempSource);
		}else{
			const target = dataSource.filter(item => record.id === item.id)[0];
			if (target) {
				onSaveCreditBatch(record._tempSource);
			}
		}
	}

	const handleOnDelete = (record) => {
		onDeleteCreditBatch(record);
	}

	const handleChangeTemp = (key, value, record) => {
		if(value && [...value].length>40){
			message.error('长度超过限制');
			return;
		}
		const target = dataSource.filter(item => record.id === item.id)[0];
		if (target) {
			target._tempSource[key] = value;
			onUpdateDataSource(dataSource);
		}
	}
	const createYearSelect = () => {
		const option = [];
		let yearNow = moment().format("YYYY") - 10;
		for(let i=0;i<20;i++){
		  option.push(<Option key={i} value={(yearNow+i).toString()} title={(yearNow+i)+"-"+(yearNow+i+1)}>{(yearNow+i)+"-"+(yearNow+i+1)}</Option>)
		}
		return option;
	  }

	const columns = [
		{
			title: "批次名称",
			dataIndex: "name",
			width: 150,
			render: (text, record) => {
				return (
					<div>
					{
						record._editable ? 
						<Input style={{ margin: '-10x', width:'100%'}} defaultValue={text} onChange={(e)=>{handleChangeTemp('name',e.target.value, record)}}/>
						: text
					}
					</div>
				);
			}
		},{
			title: "学年",
			dataIndex: "year",
			width: 100,
			render: (text, record) => {
				return (
					record._editable ? 
					<Select style={{ margin: '-10px', width:'100%'}} showSearch optionFilterProp="children" defaultValue={text.toString()} onChange={(value)=>{handleChangeTemp('year',value, record)}}>
						  {createYearSelect()}
					</Select>
					: getYearFormat(text)
				)
			}
		},{
			title: "生成时间",
			dataIndex: "createDate",
			width: 150,
		},{
			title: "操作",
			dataIndex: "id",
			width: 150,
			fixed: getFixed(),
			render: (text, record) => {
				return (
					<div>
						{
							record._editable ?
							<div>
								  <a onClick={() => handleOnSave(record)}>保存</a>
								  <Divider type="vertical" />
								  <a onClick={() => handleOnCancel(record)}>取消</a>
							</div>
							: 
							<div>
								<a onClick={() => onCreditBatchInfo(record)}>详情</a>
								<Divider type="vertical" />
								<a onClick={() => handleOnEidt(record)}>编辑</a>
								<Divider type="vertical" />
								<Popconfirm title="删除不可恢复确认删除?" onConfirm={()=>handleOnDelete(record)} okText="确定" cancelText="取消"><a>删除</a></Popconfirm>
							</div>
						}
					</div>
				);
			}
		}
	]


	return (
		<div>
		  <Table
				dataSource={dataSource}
				loading={dataLoading}
				size="middle"
				bordered
				columns={columns}
				pagination={false}
				className={styles.fixedTable}
				rowKey={record => record.id}
				scroll={{x:550}}
	      />
		   {count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
}

export default UserTable;
