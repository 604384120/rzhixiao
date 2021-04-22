import { Modal, message, Table, Popconfirm, Icon, Select, Spin} from "antd";

const Option = Select.Option
const StructAttrModal = ({ 
	modalVisible,
	structSelected,
	attrMap,
	modalData,
	modalAttrList,
	...tableProps,
	onClose,
	onUpdateState,
	onGetModalAttrList,
	onDelete,
	onAdd,
	}) => {
		const { dataSource } = tableProps;
		let tempDataSource = [...dataSource];
		tempDataSource.push(modalData);
		const handleAdd = (record) => {
			modalData._editable = true;
			onUpdateState({
				modalData: modalData,
			})
		}

		const handleDelete = (record) => {
			onDelete({id:record.id,structId:structSelected.id});
		}

		const handleSave = (record) => {
			if(!record.attrName){
				message.error("请选择字段");
				return;
			}

			onAdd({structId:structSelected.id, attrId:record.attrName});
		}

		const handleClickAttrSelect = () => {
			if(!modalAttrList){
				onGetModalAttrList();
			}
		}
		
		const handleChangeAttrSelect = (value) => {
			modalData.attrName = value;
			onUpdateState({
				modalData: modalData,
			})
		}

		const createAttrOption = () => {
			const options = [];
			if(modalAttrList){
			  for(let select of modalAttrList){
				if(!attrMap[select.id]){
					options.push(
						<Option key={select.id} style={{width: 'auto'}} value={select.id} title={select.name}>{select.name}</Option>
					  )
				}
			  }
			  return options;
			}
			return null;
		}

		const columns = [
			{
				title: "字段",
				dataIndex: "attrName",
				width: '10%',
				render: (text, record) => {
					if(record._editable){
						return (
							<div style={{width:'150px', margin: "0 auto"}}>
							<Select style={{ margin: '-10px', width:'100%'}} showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								value={text} onChange={(value)=>{handleChangeAttrSelect(value)}}
								notFoundContent={!modalAttrList?<Spin size="small" />:null}  onFocus={()=>handleClickAttrSelect()} >
								{createAttrOption()}
							</Select>
							</div>
						)
					}else if(record._add){
						return (
							<div style={{width:'150px', margin: "0 auto"}}>
							<a href="javascript:;" onClick={(e)=>{handleAdd(record)}}><Icon type="plus" />添加</a>
							</div>
						)
					}
			
					return (<div style={{width:'150px', margin: "0 auto"}}>{text}</div>)
				}
			},{
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
								</div>
								: 
								<div>
									<Popconfirm title="删除不可恢复确认删除吗？" onConfirm={()=>handleDelete(record)} okText="确定" cancelText="取消"><a>删除</a></Popconfirm>
								</div>
							}
						</div>
					);
				}
			}
		]


		return (
			<Modal
			visible={modalVisible}
			onCancel={()=>{onClose()}}
			title={structSelected.label}
			footer={null}
			width={'500px'}
			maskClosable={false}
			>
			<div style={{height:'500px', overflowY:'scroll'}}>
			<Table
				dataSource={tempDataSource}
				bordered
				columns={columns}
				pagination={false}
				rowKey={record => record.attrId}
	      	/>
			</div>
			</Modal>
		)
	
}

export default StructAttrModal