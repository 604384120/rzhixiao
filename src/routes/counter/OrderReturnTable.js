import React from "react"
import { Table, Input, message, Button, Row, Popover } from "antd"
import styles from '../common.less'
import { getFormat } from 'utils'
import { StatusList } from 'components'

const { TextArea } = Input;

const OrderReturnTable = ({
	...tableProps,
	dataSource,
	dataLoading,
	missionCurrent,
	payTypeNameMap,
	menuMap,
	user,
	onUpdateStateOrderReturnList,
	onCancelOrderReturn
}) => {

	const filterData = (data) => {
		if(missionCurrent){
			const arr = data.filter(item => missionCurrent.id === item.missionId)
			return arr;
		}
		return data;
	}

	const handleCancelOrderReturnVisibleChange = (visible, record) => {
		record._cancelOrderReturnVisible = visible
		onUpdateStateOrderReturnList(dataSource)
	}

	const handleChangeCancelReturnRemark = (e, record) => {
		record._cancelReturnRemark = e.target.value
		onUpdateStateOrderReturnList(dataSource)
	}

	const handleCancelOrderReturn = (record) => {
		if(!record._cancelReturnRemark){
			message.error("请输入作废理由")
			return
		}
		onCancelOrderReturn({orderNo:record.orderNo,remark:record._cancelReturnRemark})
	}

	const renderCancelOrderReturn = (record) => {
		return(
			<div>
				<div>请输入作废理由：</div>
				<TextArea style={{marginTop:'5px'}} value={record._cancelReturnRemark} onChange={e=>handleChangeCancelReturnRemark(e, record)}/>
				<div style={{textAlign: 'center' }}>
					<div style={{marginTop:'5px', marginBottom:'5px',color:'red', textAlign:'center', fontSize:'8px'}}>对已开票据进行作废，作废后该笔订单可重新开票</div>
					<Button size="small" style={{ marginRight: '10px' }} onClick={()=>handleCancelOrderReturnVisibleChange(false, record)}>取消</Button>
					<Button type="primary" size="small" onClick={()=>handleCancelOrderReturn(record)}>确定</Button>
				</div>
			</div>
		)
	}

	const columnsName = [
		{dataIndex: "subjectName", width: '80px'},
		{dataIndex: "paidFee", width: '80px', render: (text, record) => {return getFormat(text)}}]
	const columns = [
		{
			title: "订单号",
			dataIndex: "orderNo",
			width:'80px',
		},
		{
			title: "订单状态",
			dataIndex: "status",
			width:'80px',
			render: (text, record) => {
				return <StatusList fee='0' status={text} user={user} orderOperateData={record}/>
			}
		},
		{
			title: "退费方式",
			dataIndex: "payType",
			width:'80px',
			render: (text, record) => {
				return payTypeNameMap[text]
			}
		},
		{
			title: "实退合计",
			dataIndex: "fee",
			width:'80px',
			render: (text, record) => {
				return <span>{getFormat(text)}</span>
			}
		},
		{
			title: "退费时间",
			dataIndex: "timeEnd",
			width:'80px',
		},
		{
			title: "项目名称",
			dataIndex: "subjectName",
			width:'80px',
			render: (text, record) => {
				if(record.feeBillLists&&record.feeBillLists.length==1){
					return record.feeBillLists[0].subjectName;
				}else{
					return {
						children: record.feeBillLists&&record.feeBillLists.length>0?<Table
							dataSource={record.feeBillLists}
							columns={columnsName}
							bordered
							showHeader={false}
							pagination={false}
							rowKey={re => re.id}
							style={{width:'100%'}}
						  />:'',
						props: {
						  colSpan: 2,
						  className:styles.childTablePanel,
						  style:{padding:'0'}
						},
					};
				}
			
			}
		},
		{
			title: "本次实退",
			dataIndex: "paidFee",
			width:'80px',
			render: (text, record) => {
				if(record.feeBillLists&&record.feeBillLists.length==1){
					return getFormat(record.feeBillLists[0].paidFee);
				}else{
					return {
						props: {
							colSpan: 0,
						},
					};
				}
			}
		},
		{
			title: "操作",
			dataIndex: "status",
			width:'80px',
			render: (text, record) => {
				if(text == '0'){
					return <span style={{color:'red'}}>已作废</span>
				}else if(text == '5'){
					return <span style={{color:'red'}}>已驳回</span>
				}else{
					return <Popover title="作废确认" trigger="click" placement="top"
					content={renderCancelOrderReturn(record)}
					visible={record._cancelOrderReturnVisible?record._cancelOrderReturnVisible:false}
					onVisibleChange={e=>handleCancelOrderReturnVisibleChange(e, record)}><a disabled={menuMap['/feeReturnCancel']==undefined}>作废</a></Popover>
				}
			}
		},

	];

	return (
		<div>
		  <Table
			{...tableProps}
			size="middle"
			dataSource={filterData(dataSource)}
			bordered
			columns={columns}
			pagination={false}
			loading={dataLoading}
			rowKey={record => record.id}
			className={styles.fixedTable}
			scroll={{y: 240, x:1078}}
	      />
		</div>
		)
}

export default OrderReturnTable;
