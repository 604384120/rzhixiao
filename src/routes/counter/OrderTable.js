import React from "react"
import { Table, message, Button, Popover, Input,  Row, Icon } from "antd"
import { PrintOperate, StatusList } from 'components'
import styles from '../common.less'
import { getFormat } from 'utils'

const { TextArea } = Input;

const OrderTable = ({
	...tableProps,
	dataSource,
	dataLoading,
	missionCurrent,
	payTypeNameMap,
	userAttrList,
	subjectMap,
	menuMap,
	user,
	onPrintDelete,
	onPrintSuccess,
	onGetPrint,
	onUpdatePrint,
	onCancelOrder,
	onUpdateStateOrderList,
}) => {

	const filterData = (data) => {
		if(missionCurrent){
			const arr = data.filter(item => missionCurrent.id === item.missionId)
			return arr;
		}
		return data;
	}

	const handleCancelOrderVisibleChange = (visible, record) => {
		record._cancelOrderVisible = visible
		onUpdateStateOrderList(dataSource)
	}

	const handleChangeCancelRemark = (e, record) => {
		record._cancelRemark = e.target.value
		onUpdateStateOrderList(dataSource)
	}

	const handleCancelOrder = (record) => {
		if(!record._cancelRemark){
			message.error("请输入冲正理由")
			return
		}
		onCancelOrder({orderNo:record._order.orderNo,remark:record._cancelRemark})
	}

	const renderCancelOrder = (record) => {
		return(
			<div>
				<div>请输入冲正理由：</div>
				<TextArea style={{marginTop:'5px'}} value={record._cancelRemark} onChange={e=>handleChangeCancelRemark(e, record)}/>
				<div style={{textAlign: 'center' }}>
					<div style={{marginTop:'5px', marginBottom:'5px', color:'red', fontSize:'8px', maxWidth:'275px', textAlign:'left'}}>1.冲正：对线下收款记账错误的收费订单可进行冲正，冲正后该笔订单即被废除，不进入统计<br/>2.冲正结转订单时会将转入转出的两笔订单同时冲正</div>
					<Button size="small" style={{ marginRight: '10px' }} onClick={()=>handleCancelOrderVisibleChange(false, record)}>取消</Button>
					<Button type="primary" size="small" onClick={()=>handleCancelOrder(record)}>确定</Button>
				</div>
			</div>
		)
	}

	const columnsName = [
		{dataIndex: "subjectName", width: '80px'},
		{dataIndex: "paidFee", width: '80px', render: (text, record) => {return getFormat(text)}},
		{dataIndex: "receiptNo", width: '80px', render: (text, record) => {
				if(record.downUrl){
					//存在下载链接
					return <Popover content={<a target="_blank" href={record.downUrl}>下载电子票据</a>}>{text}</Popover>
				}
				return text
			},
		},
		{dataIndex: "id", width: '80px', render: (text, record) => {
				let param = {
					printData: record, 
					printType: record._order.printType,
					userAttrList,
					subjectMap,
					onUpdatePrint,
					onGetPrint,
					onPrintSuccess,
					onPrintDelete,
				}
				return (
					<div>
						{
							record._order.status=='0'?<span>已冲正&nbsp;</span>
							:<Popover title="冲正确认" trigger="click" placement="top"
							content={renderCancelOrder(record)}
							visible={record._cancelOrderVisible?record._cancelOrderVisible:false}
							onVisibleChange={e=>handleCancelOrderVisibleChange(e, record)}
						><a disabled={record._order.status=='5'||menuMap['/feeOrderCancel']==undefined}>冲正&nbsp;&nbsp;</a></Popover>
						}
					{menuMap['/feePrint']!=undefined&&<PrintOperate {...param}/>}
					</div>
				)
		}}]
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
				return <StatusList fee='1' status={text} user={user} orderOperateData={record}/>
			}
		},
		{
			title: "支付方式",
			dataIndex: "payType",
			width:'80px',
			render: (text, record) => {
				return payTypeNameMap[text]
			}
		},
		{
			title: "订单合计",
			dataIndex: "fee",
			width:'80px',
			render: (text, record) => {
        if(record.rateFee && record.rateFee!='0'){
          return <span>
          {getFormat(parseInt(record.fee)+parseInt(record.rateFee))}&nbsp;
          <Popover content={"含手续费"+getFormat(record.rateFee)+"元"}><Icon type='question-circle-o'/></Popover>
          </span>
        }
        return getFormat(text)
			}
		},
		{
			title: "收费时间",
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
						  colSpan: 4,
						  className:styles.childTablePanel,
							style:{padding:'0'}
						},
					};
				}
			
			}
		},
		{
			title: "本次实收",
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
			title: "票据单号",
			dataIndex: "receiptNo",
			width:'80px',
			render: (text, record) => {
				if(record.feeBillLists&&record.feeBillLists.length==1){
					if(record.feeBillLists[0].downUrl){
						//存在下载链接
						return <Popover content={<a target="_blank" href={record.feeBillLists[0].downUrl}>下载电子票据</a>}>{record.feeBillLists[0].receiptNo}</Popover>
					}
					return record.feeBillLists[0].receiptNo
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
			dataIndex: "id",
			width:'80px',
			render: (text, record) => {
				if(record.feeBillLists&&record.feeBillLists.length==1){
						let billNode = record.feeBillLists[0];
						let param = {
							printData: billNode, 
							printType: record.printType,
							userAttrList,
							subjectMap,
							onUpdatePrint,
							onGetPrint,
							onPrintSuccess,
							onPrintDelete,
						}
						return <div>
										{
											record.status=='0'?<span>已冲正&nbsp;</span>:<Popover title="冲正确认" trigger="click" placement="top"
											content={renderCancelOrder(billNode)}
											visible={billNode._cancelOrderVisible?billNode._cancelOrderVisible:false}
											onVisibleChange={e=>handleCancelOrderVisibleChange(e, billNode)}
										><a disabled={record.status=='5'||record.status=='6'||menuMap['/feeOrderCancel']==undefined}>冲正&nbsp;&nbsp;</a></Popover>
										}
										{menuMap['/feePrint']!=undefined&&<PrintOperate {...param}/>}
									</div>
						// return (
						// 	<div>
						// 	{
						// 		record.status==0?<span>已冲正&nbsp;</span>
						// 	:<Popover title="冲正确认" trigger="click" placement="top"
						// 			content={renderCancelOrder(billNode)}
						// 			visible={billNode._cancelOrderVisible?billNode._cancelOrderVisible:false}
						// 			onVisibleChange={e=>handleCancelOrderVisibleChange(e, billNode)}
						// 		><a disabled={menuMap['/feeOrder']==undefined}>冲正&nbsp;&nbsp;</a></Popover>
						// 	}
							{/* {
								!billNode.receiptNo&&<Popover title={<div>选择项目{user.printType!='bs'&&<a style={{marginLeft: '40px', fontSize: '1px'}} onClick={()=>onReceiptSetting(record.missionId)}>票据设置</a>}</div>}
								content={renderPrintItem(billNode)}
								trigger="click"
								placement="left"
								visible={billNode._printVisible?billNode._printVisible:false}
								onVisibleChange={e=>handlePrintVisibleChange(e, billNode)}
								><a disabled={record.status=='0' || !billNode.templateCode}>打印</a></Popover>
							}
							{
								billNode.receiptNo&&<Popconfirm title="作废不可恢复，确认作废？" onConfirm={()=>handlePrintDelete(billNode)} okText="确定" cancelText="取消"><a style={{color: 'red'}}>作废</a></Popconfirm>
							} */}
						// 	{menuMap['/feePrint']!=undefined&&<PrintOperate {...param}/>}
						// 	</div>
						// )
				}else{
					return {
						props: {
							colSpan: 0,
						},
					};
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
					scroll={{y: 240, x: 1078}}
	      />
		</div>
		)
}

export default OrderTable;
