import { Modal, Button, message, Table, InputNumber, Input, Spin, Icon,Switch,Popconfirm  } from "antd";
import { getFormat } from 'utils'

const UserBillModal = ({ 
	modalVisible, 
	modalType,
	modalPrsNum,
	modalClosable,
	modalImportData,
	user,
	...tableProps,
	onClose,
	onUpdateState,
	onUpdateBills,
	}) => {
		const {dataSource} = tableProps;
		let totalFee = 0;
		for(let subject of dataSource){
			if(subject._status == "1"){
				totalFee += parseInt(subject._fee);
			}
		}

		const handleDiscountChange = (value, record) => {
			if(!value){
				value = 0
			}
			let fee = Math.round(value * 100);
			let totalFee = parseInt(record._totalFee);
			let loansFee = parseInt(record._loans);
			if(fee > totalFee){
				message.error("输入金额不能大于缴费标准");
				return
			}

			const target = dataSource.filter(item => record.id === item.id)[0];
			if (target) {
				target._discount = fee;
				target._fee = totalFee - fee - loansFee;
			}

			onUpdateState({subjectList:dataSource})
		}

		const handleLoansChange = (value, record) => {
			if(!value){
				value = 0
			}
			let fee = Math.round(value * 100);
			let totalFee = parseInt(record._totalFee);
			let discountFee = parseInt(record._discount);
			if(fee > totalFee){
				message.error("输入金额不能大于缴费标准");
				return
			}

			const target = dataSource.filter(item => record.id === item.id)[0];
			if (target) {
				target._loans = fee;
				target._fee = totalFee - discountFee - fee;
			}

			onUpdateState({subjectList:dataSource})
		}

		const handleStatusChange = (record) => {
			let status = '1';
			if(record._status == '1'){
				status='0';
			}

			const target = dataSource.filter(item => record.id === item.id)[0];
			if (target) {
				target._status = status;
			}

			onUpdateState({subjectList:dataSource})
		}

		const handleStandChange = (record) => {
			let status = '1';
			if(record._stand == '1'){
				status = undefined
			}

			const target = dataSource.filter(item => record.id === item.id)[0];
			if (target) {
				target._stand = status;
			}

			onUpdateState({subjectList:dataSource})
		}

		const handleTotalFeeChange = (value, record) => {
      let fee = ''
			if(value!=='' && value!=undefined){
        fee = Math.round(value * 100);
			}
			// let discount = parseInt(record._discount);
			// let loans = parseInt(record._loans);

			const target = dataSource.filter(item => record.id === item.id)[0];
			if (target) {
				target._totalFee = fee;
				// target._fee = fee - discount - loans;
      }

			onUpdateState({subjectList:dataSource})
		}

		const handleCancel = () => {
			for(let subject of dataSource){
				subject._discount = subject.disReason;
				subject._fee = subject.fee;
				subject._disReason = subject.disReason;
			}

			onUpdateState({subjectList:dataSource, modalVisible: false})
		}

		const handleSubmit = () => {
			onUpdateBills(dataSource)
		}

		const columns = [
			{
				title: "收费项目",
				dataIndex: "name",
				width: '10%',
			},{
				title: "收费标准",
				dataIndex: "totalFee",
				width: '15%',
				render: (text, record) => {
					if((user.isStand=='1' && user.isAdmin!='1') || record._stand=='1'){
						//需要按照标准来设置
						return (<Input disabled={true} style={{width:'100%'}} defaultValue={"按照已有标准设置"} />)
					}
					return (
						<InputNumber disabled={(record._status!='1'||record.subType=="2")} 
							style={{width:'100%'}} min={0} defaultValue={getFormat(record._totalFee)} onChange={(value)=>{handleTotalFeeChange(value, record)}}/>
					)
				}
			},{
				title: "项目状态",
				dataIndex: "status",
				width: '10%',
				render: (text, record) => {return  <Switch disabled={record.subType=="2"} checked={record._status=='1'?true:false} onChange={()=>{handleStatusChange(record)}} />}
			},{
				title: "按标准设置",
				dataIndex: "stand",
				width: '10%',
				render: (text, record) => {return  <Switch disabled={record.subType=="2"||(user.isStand=='1' && user.isAdmin!='1')||record._status!='1'} checked={record._stand=='1'||(user.isStand=='1' && user.isAdmin!='1')} onChange={()=>{handleStandChange(record)}} />}
			},
		]


		return (
			<Modal
			visible={modalVisible}
			onCancel={()=>{onClose()}}
			title={modalType=="batch"?"批量调整":"账单添加"}
			footer={null}
			width={'900px'}
			maskClosable={false}
			>

			<Table
				{...tableProps}
				bordered
				columns={columns}
				pagination={false}
				scroll={{y: 400}}
				rowKey={record => record.id}
	      	/>
			<div style={{padding:'10px 10px'}}>
				<Button type="primary" size='small' style={{float:'right'}} onClick={handleSubmit}>确定</Button>
				<Button size='small' style={{float:'right', marginRight:'10px'}} onClick={handleCancel}>取消</Button>
			</div>

			</Modal>
		)
	
}

export default UserBillModal