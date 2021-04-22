import { Table, Popconfirm, Input, Select, message, Divider, InputNumber } from "antd"
import styles from "../common.less"
const Option = Select.Option;

const UserTable = ({
	...tableProps,
	dataLoading,
	onUpdateDataSource,
	onSaveOrderPayType,
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
			// if(target._add){
			// 	dataSource.splice(0, 1);
			// }
			onUpdateDataSource(dataSource);
		}
	}

	const handleOnSave = (record) => {
		if(!record._tempSource.rate){
			message.error("请输入费率")
			return
		}
		const target = dataSource.filter(item => record.id === item.id)[0];
		if (target) {
			onSaveOrderPayType(record._tempSource);
		}
	}

	const handleChangeRate = (key, value, record) => {
		if(!value.replace(/[^\d]/g,'')){
			message.error('请输入数字');
			return;
		}else if(value && parseInt(value)>=100){
			message.error('费率必须小于100');
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
    if (width < 300) {
      return 'right'
    }
    return ''
	}

	const columns = [
		{
			title: "支付渠道",
			dataIndex: "name",
			width: 100,
		},{
			title: "费率（%）",
			dataIndex: "rate",
			width: 100,
			render: (text, record) => {
				return (
					<div>
					{
						record._editable ? 
						<Input style={{ margin: '-10x', width:'100%'}} defaultValue={text} onChange={(e)=>{handleChangeRate('rate',e.target.value, record)}}/>
						: text
					}
					</div>
				);
			}
		},{
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
								<a style={record.status == '2'?{color:'#bfbdbd'}:undefined} onClick={record.payType == '5'?undefined:() => handleOnEidt(record)}>编辑</a>
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
	        	dataSource={dataSource&&dataSource.filter((item)=>{return !item.code})}
						loading={dataLoading}
						size="middle"
	        	bordered
	        	columns={columns}
						pagination={false}
						className={styles.fixedTable}
	        	rowKey={record => record.id}
						scroll={{x:300}}
	      />
		</div>
		)
}

export default UserTable;
