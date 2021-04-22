import { Modal, Button, message, Table, Input, Divider, Popconfirm, Icon } from "antd";


const AttrValueModal = ({ 
	modalVisible,
	modalAttrId,
	modalAttrName,
	valueMap,
	attrMap,
	...tableProps,
	onClose,
	onUpdateState,
	onDelete,
	onAdd,
	onSave,
	}) => {
		const { dataSource } = tableProps;
		const handleAdd = (record) => {
			valueMap[record.id]._editable = true;
			valueMap[record.id].status = 1;
			valueMap[record.id].value = '';
			valueMap[record.id].code = '';
			valueMap[record.id]._value = '';
			valueMap[record.id]._code = '';
			onUpdateState({
				valueMap: valueMap,
			})
		}

		const handleChangeCode = (value, record) => {
			if(value && [...value].length>40){
				message.error('长度超过限制');
				return;
			}
			valueMap[record.id]._code = value;
			onUpdateState({
				valueMap: valueMap,
			})
		}

		const handleChangeName = (value, record) => {
			if(value && [...value].length>40){
				message.error('长度超过限制');
				return;
			}
			valueMap[record.id]._value = value;
			onUpdateState({
				valueMap: valueMap,
			})
		}

		const handleEidt = (record) => {
			valueMap[record.id]._editable = true;
			valueMap[record.id]._value = valueMap[record.id].value;
			valueMap[record.id]._code = valueMap[record.id].code;
			onUpdateState({
				valueMap: valueMap,
			})
		}

		const handleDelete = (record) => {
			onDelete({id:record.id});
		}

		const handleSave = (record) => {
			if(!record._code){
				message.error("请填写代码");
				return;
			}else{
				const target = dataSource.filter(item => record._code === item.code&&record.id != item.id)[0];
				if (target) {
					message.error("代码不能重复");
					return;
				}
			}
			if(!record._value){
				message.error("请填写名称");
				return;
			}else{
				const target = dataSource.filter(item => record._value === item.value&&record.id != item.id)[0];
				if (target) {
					message.error("名称不能重复");
					return;
				}
			}

			if(record._add){
				onAdd({attrId:modalAttrId, code:record._code, value:record._value});
			}else{

				onSave({attrId:modalAttrId, id:record.id, code:record._code, value:record._value});
			}
		}

		const handleCancel = (record) => {
			valueMap[record.id]._editable = false;
			onUpdateState({
				valueMap: valueMap,
			})
		}

		const columns = [
			{
				title: "代码",
				dataIndex: "code",
				width: '10%',
				render: (text, record) => {
					if(record._editable){
						return (
							<Input style={{ margin: '-10px 0'}} defaultValue={record._code} onChange={(e)=>{handleChangeCode(e.target.value, record)}}/>
						)
					}else if(record._add){
						return (
							<a href="javascript:;" onClick={(e)=>{handleAdd(record)}}><Icon type="plus" />添加</a>
						)
					}
			
					return text;
				}
			},{
				title: "名称",
				dataIndex: "value",
				width: '10%',
				render: (text, record) => {
					if(record._editable){
						return (
							<Input style={{ margin: '-10px 0'}} defaultValue={record.value} onChange={(e)=>{handleChangeName(e.target.value, record)}}/>
						)
					}else if(record._add){
						return '';
					}
			
					return text;
				}
			},
		]

		if(attrMap[modalAttrId].valueDefault != '1'){
			columns.push({
				title: "操作",
				dataIndex: "id",
				width: '10%',
				render: (text, record) => {
					if(record._add && !record._editable){
						return '';
					}
					return (
						<div>
							{
								record._editable ?
								<div>
									  <a onClick={() => handleSave(record)}>保存</a>
									  <Divider type="vertical" />
									  <a onClick={() => handleCancel(record)}>取消</a>
								</div>
								: 
								<div>
									<a onClick={() => handleEidt(record)}>编辑</a>
									<Divider type="vertical" />
									<Popconfirm title="删除不可恢复，确认删除？" onConfirm={()=>handleDelete(record)} okText="确定" cancelText="取消"><a>删除</a></Popconfirm>
								</div>
							}
						</div>
					);
				}
			})
		}

		return (
			<Modal
			visible={modalVisible}
			onCancel={()=>{onClose()}}
			title={modalAttrName}
			footer={null}
			width={'50%'}
			maskClosable={false}
			>
			<div style={{minHeight:'400px', overflowY:'scroll'}}>
			<Table
				{...tableProps}
				size="middle"
				bordered
				columns={columns}
				pagination={false}
				rowKey={record => record.id}
	      	/>
			</div>
			</Modal>
		)
	
}

export default AttrValueModal