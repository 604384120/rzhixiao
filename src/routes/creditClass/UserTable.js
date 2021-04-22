import { Table, Popconfirm, Input, Select, message, Divider, InputNumber } from "antd"
import styles from "../common.less"
const Option = Select.Option;

const UserTable = ({
	searchName,
	...tableProps,
	isAdmin,
	dataLoading,
	onAddCreditClass,
	onUpdateDataSource,
	onSaveCreditClass,
	onDeleteCreditClass,
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

	const classType = {
		1:"公共基础课",
		2:"专业课",
		3:"学科基础课",
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
			message.error("请输入课程代码")
			return
		}
		if(!record._tempSource.name){
			message.error("请输入课程名称")
			return
		}
		if(!record._tempSource.type){
			message.error("请选择课程类型")
			return
		}
		if(!record._tempSource.property){
			message.error("请选择课程性质")
			return
		}
		if(!record._tempSource.credit){
			message.error("请输入学分")
			return
		}
		if(record._add){
			onAddCreditClass(record._tempSource);
		}else{
			const target = dataSource.filter(item => record.id === item.id)[0];
			if (target) {
				onSaveCreditClass(record._tempSource);
			}
		}
	}

	const handleOnDelete = (record) => {
		onDeleteCreditClass(record);
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

	const getFixed = () => {
		let width = document.body.clientWidth
    if (width > 769) {
      width -= 304
		}
    if (width < 600) {
      return 'right'
    }
    return ''
	}

	const columns = [
		{
			title: "课程代码",
			dataIndex: "code",
			width: 100,
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
			title: "课程名称",
			dataIndex: "name",
			width: 100,
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
			title: "课程性质",
			dataIndex: "type",
			width: 100,
			render: (text, record) => {
				return (
					record._editable ? 
					<Select style={{ margin: '-10px', width:'100%'}} defaultValue={text.toString()} onChange={(value)=>{handleChangeTemp('type',value, record)}}>
						<Option value="1" title={'公共基础课'}>公共基础课</Option>
						<Option value="2" title={'专业课'}>专业课</Option>
						<Option value="3" title={'学科基础课'}>学科基础课</Option>
					</Select>
					: classType[text]
				)
			}
		},{
			title: "课程属性",
			dataIndex: "property",
			width: 100,
			render: (text, record) => {
				return (
						record._editable ? 
						<Select style={{ margin: '-10px', width:'100%'}} defaultValue={text.toString()} onChange={(value)=>{handleChangeTemp('property',value, record)}}>
							<Option value="1" title={'必修课'}>必修课</Option>
      						<Option value="2" title={'非必修课'}>非必修课</Option>
						</Select>
						: record.property==null? '非必修课' : '必修课'
				)
			}
		},{
			title: "学分",
			dataIndex: "credit",
			width: 100,
			render: (text, record) => {
				return (
						record._editable ? 
						<InputNumber style={{ margin: '-10x', width:'100%'}} defaultValue={text} onChange={(value)=>{handleChangeTemp('credit',value, record)}}/>
						: text
				)
			}
		}
	]

	if(isAdmin == '1'){
		columns.push({
			title: "操作",
			dataIndex: "id",
			width: 100,
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
	        	dataSource={dataSource&&searchName?dataSource.filter(item => item._add||item.name.toLowerCase().indexOf(searchName.toLowerCase())>=0):dataSource}
						loading={dataLoading}
						size="middle"
	        	bordered
	        	columns={columns}
						pagination={false}
						className={styles.fixedTable}
	        	rowKey={record => record.id}
						scroll={{x:600}}
	      />
		</div>
		)
}

export default UserTable;
