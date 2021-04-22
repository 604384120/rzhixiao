import React from "react"
import { Table, Popconfirm, Input, Select, message, Divider, Badge, Cascader, Spin, Pagination } from "antd"
import styles from "../common.less"
const Option = Select.Option;

const FeeSubjectTable = ({
	count,
	...tableProps,
	schoolName,
	isAdmin,
	departTree, 
	departMap,
	templateList,
	pageNum, pageSize,
	mchList,
	dataLoading,
	onAddSubject,
	onUpdateDataSource,
	onSaveSubject,
	onDeleteSubject,
	onChangePage,
	onShowModal,
}) => {
	const { dataSource } = tableProps;

	const handleChangePage = (num, size) => {
		onChangePage(num==0?1:num, size)
	}

	const handleChangeSize = (current, size) => {
		onChangePage(current==0?1:current, size)
	}

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

	const handleOnSave = (record) => {
		if(!record._tempSource.code){
			message.error("项目编码不能为空")
			return
		}
		if(!record._tempSource.name){
			message.error("项目名称不能为空")
			return
		}
		if(!record._tempSource.departId){
			message.error("请选择业务部门")
			return
		}
		if(record._add){
			onAddSubject(record._tempSource);
		}else{
			const target = dataSource.filter(item => record.id === item.id)[0];
			if (target) {
				onSaveSubject(record._tempSource);
			}
		}
	}

	const handleOnDelete = (record) => {
		onDeleteSubject(record);
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

	const getDepartArr = (departId) => {
		if(departId!=undefined){
			var departArr = [];
			const unshiftDepart = (data) => {
				if(data){
					departArr.unshift(data.id)
					if(data.pid && data.pid!='0'){
						unshiftDepart(departMap[data.pid])
					}
				}
			}
			unshiftDepart(departMap[departId]);
			departArr.unshift('0');
			return departArr;
		}
		
		return undefined
	}

	const getOptions = () => {
		let temp = [{
			value: '0',
			label: schoolName,
			children: departTree
		}]
		return temp;
	}

	const createTemplateOption = () => {
		const options = []
		if(templateList){
			for (let select of templateList) {
				if(select.status == '1'){//票据类型显示控制
					options.push(<Option key={select.id} value={select.id} title={select.name}>{select.name}</Option>)
				}
			}
			return options
		}
		return null;
	}

	const createMchOption = () => {
		const options = []
		if(mchList){
			for (let select of mchList) {
				options.push(<Option key={select.id} value={select.id} title={select.name}>{select.name}</Option>)
			}
			return options
		}
		return null;
	}

	const getFixed = () => {
		let width = document.body.clientWidth
    if (width > 769) {
      width -= 577
		}
    if (width < 812) {
      return 'right'
    }
    return ''
	}

	const columns = [
		{
			title: "项目编码",
			dataIndex: "code",
			width: '12%',
			render: (text, record) => {
				return (
					<div>
					{
						record._editable ? 
						<Input style={{ margin: '-10px'}} defaultValue={text} onChange={(e)=>{handleChangeTemp('code',e.target.value, record)}}/>
						: text
					}
					</div>
				);
			}
		},{
			title: "项目名称",
			dataIndex: "name",
			width: '15%',
			render: (text, record) => {
				return (
					<div>
					{
						record._editable ? 
						<Input disabled={record.subType=='2'} style={{ margin: '-10x', width:'100%'}} defaultValue={text} onChange={(e)=>{handleChangeTemp('name',e.target.value, record)}}/>
						: text
					}
					</div>
				);
			}
		},{
			title: "业务部门",
			dataIndex: "departName",
			width: '16%',
			render: (text, record) => {
				return (
						record._editable ? 
						<Cascader style={{ margin: '-10px', width:'100%'}}  options={getOptions()} defaultValue={getDepartArr(record.departId)} placeholder="请选择所属部门" changeOnSelect onChange={(value)=>{handleChangeTemp('departId',value[value.length-1], record)}}/>
						: text
				)
			}
		},{
			title: "收费性质",
			dataIndex: "type",
			width: '20%',
			render: (text, record) => {
				return (
						record._editable ? 
						<Select style={{ margin: '-10px', width:'100%'}} defaultValue={text.toString()} onChange={(value)=>{handleChangeTemp('type',value, record)}}>
							<Option value="1" title={'行政事业性收费'}>行政事业性收费</Option>
      						<Option value="2" title={'非行政事业性收费'}>非行政事业性收费</Option>
						</Select>
						: text=='1'?'行政事业性收费':'非行政事业性收费'
				)
			}
		},{
			title: "票据类型",
			dataIndex: "templateId",
			width: '20%',
			render: (text, record) => {
				return (
						record._editable ? 
						<Select style={{ margin: '-10px', width:'100%' }} defaultValue={record.templateName} onChange={(value)=>{handleChangeTemp('templateId',value, record)}}
							allowClear
							showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
							notFoundContent={!templateList ? <Spin size="small" /> : null}>
							{createTemplateOption()}
						</Select>
						: record.templateName
				)
			}
		},{
			title: "收款账户",
			dataIndex: "mchId",
			width: '20%',
			render: (text, record) => {
				return (
						record._editable ? 
						<Select style={{ margin: '-10px', width:'100%' }} defaultValue={record.mchName} onChange={(value)=>{handleChangeTemp('mchId',value, record)}}
							showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
							notFoundContent={!mchList ? <Spin size="small" /> : null}>
							{createMchOption()}
						</Select>
						: record.mchName
				)
			}
		},{
			title: "状态",
			dataIndex: "status",
			width: '15%',
			render: (text, record) => {
				return (
						record._editable ? 
						<Select style={{ margin: '-10px', width:'100%'}} defaultValue={text.toString()} onChange={(value)=>{handleChangeTemp('status',value, record)}}>
							<Option value="1" title={'启用'}>启用</Option>
      						<Option value="2" title={'停用'}>停用</Option>
						</Select>
						: <Badge status={text=='1'?'success':'error'}  text={text=='1'?'启用':'停用'} />
				)
			}
		},{
			title: "创建时间",
			dataIndex: "createDate",
			width: '15%'
		}
	]

	if(isAdmin == '1'){
		columns.push({
			title: "操作",
			dataIndex: "id",
			width: '18%',
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
								<a onClick={() => handleOnEidt(record)}>编辑</a>
								<Divider type="vertical" />
								<Popconfirm title="删除不可恢复确认删除?" onConfirm={()=>handleOnDelete(record)} okText="确定" cancelText="取消"><a>删除</a></Popconfirm>
								{record.info && <Divider type="vertical" />}
								{record.info && <a onClick={() => onShowModal(true,text,record)}>配置</a>}
							</div>
						}
					</div>
				);
			}
		})
	}


	return (
		<div>
		  <Table
					{...tableProps}
					size="middle"
					loading={dataLoading}
	        bordered
	        columns={columns}
					pagination={false}
					className={styles.fixedTable}
	        rowKey={record => record.id}
					scroll={{x:812}}
	      />
				{count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
}

export default FeeSubjectTable;
