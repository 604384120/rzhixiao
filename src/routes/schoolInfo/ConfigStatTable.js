import { Table, Popconfirm, Input, Select, message, Divider, InputNumber, Radio, Checkbox, Switch } from "antd"
import styles from "../common.less"
const Option = Select.Option;

const CheckboxGroup = Checkbox.Group;

const ConfigStatTable = ({
	...tableProps,
	editVisible,
	dataLoading,
	onUpdate,
}) => {
	const { dataSource } = tableProps;

	const handleChange = (record) => {
		record.status = !record.status
		onUpdate(dataSource)
	}

	const handleChangeTemp = (record,value) => {
		record.position = value
		onUpdate(dataSource)
	}

	const columns = [
		{
			title: "统计项名称",
			dataIndex: "name",
			width: 100,
		},{
			title: "调整顺序（数字小的放在左边）",
			dataIndex: "position",
			width: 150,
			render: (text, record) => {
				return (<div style={{ maxWidth: '200px', margin: '0 auto' }}>
					{
						editVisible ? 
						<InputNumber style={{margin:'-5px 0',width:'100%',}} min={0} max={8} defaultValue={text == 0?'':text} value={text == 0?'':text} disabled={!record.status} onChange={(value)=>{handleChangeTemp(record,value)}}/>
						: text == 0?'':text
					}
					</div>
				);
			}
		},{
			title: "是否显示",
			dataIndex: "status",
			width: 100,
			render: (text, record) => {
				return (<div>
						<Switch disabled={!editVisible} checked={text} onChange={()=>{handleChange(record)}} />
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
						scroll={{x:300}}
	      />
		</div>
		)
}

export default ConfigStatTable;
