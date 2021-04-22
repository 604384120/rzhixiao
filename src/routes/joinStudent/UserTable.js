import React from "react"
import { Popconfirm , Pagination, Divider, Input, Popover, Button } from "antd"
import styles from '../common.less'
import { getFormat, getYearFormat } from 'utils'
import { TableCom } from 'components'

const { TextArea, Search } = Input;

const UserTable = ({
	count,
	...tableProps,
	pageNum, pageSize,
	dataLoading,
	userDisplayList,
	payTypeNameMap,
	onChangePage,
	onUpdateState,
	onOperate,
	onReviewJoinUser,
}) => {
	const handleChangePage = (num, size) => {
		onChangePage(num==0?1:num, size)
	}

	const handleChangeSize = (current, size) => {
		onChangePage(current==0?1:current, size)
	}

	const getFixed = () => {
		let width = document.body.clientWidth
    if (width > 769) {
      width -= 328
		}
    if (num > (width-60) / 80) {
      return 'right'
    }
    return ''
	}
	
	const handleChangeCancelRemark = (e, record) => {
		record._cancelRemark = e.target.value
		onUpdateState({...tableProps})
	}
	
	const handleCancelJoinVisibleChange = (value, record) => {
		record._visible = value
		onUpdateState({...tableProps})
	}
	
	const handleCancelJoin = (record) => {
		if(!record._cancelRemark){
			message.error("请输入退款理由")
			return
    }
    if(dataLoading){
      message.error("请不要重复提交")
			return
		}
		let param = {}
		param.status='7',
		param.joinUserId=record.id,
		param.remark=record._cancelRemark
		onOperate(param)
  }
	
	const renderCancelJoin = (record) => {
		return(
			<div>
				<div>退款理由：</div>
				<TextArea style={{marginTop:'5px'}} value={record._cancelRemark} onChange={e=>handleChangeCancelRemark(e, record)}/>
				<div style={{ marginTop: '20px', textAlign: 'center' }}>
				<Button size="small" style={{ marginRight: '10px' }} onClick={()=>handleCancelJoinVisibleChange(false, record)}>取消</Button>
				<Button type="primary" size="small" onClick={()=>handleCancelJoin(record)}>确定</Button>
				</div>
			</div>
		)
	}

	const columns = [];
	let num = 6;
	for(let attr of userDisplayList){
		num ++;
		columns.push({
			title: attr.name,
			dataIndex: attr.id,
			width:80
		})
	}
	columns.push({
		title: "预约金",
		dataIndex: "fee",
		width:80,
		render: (text, record) => {
			return getFormat(text)
		}
	})
	columns.push({
		title: "支付方式",
		dataIndex: "payType",
		width:80,
		render: (text, record) => {
			return payTypeNameMap[text]
		}
	})
	columns.push({
		title: "报名时间",
		dataIndex: "createDate",
		width:100,
	})
	columns.push({
		title: "招生人员",
		dataIndex: "accountName",
		width:80,
	})
	columns.push({
		title: "状态",
		dataIndex: "status",
		width:80,
		render: (text, record) => {
			if(text=='3'){
				return <Popover content={record.remark} title="驳回理由"><span style={{color:'red'}}>已驳回</span></Popover>
			}else if(text=='1'){
				return <span style={{color:'#FF9900'}}>审核中</span>
			}else if(text=='2'){
				return <span style={{color:'green'}}>已入学</span>
			}else if(text=='4'){
				return <span style={{color:'#EE00EE'}}>已预约</span>
			}else if(text=='5'){
				return <span style={{color:'blue'}}>推荐入学</span>
			}else if(text=='6'){
				return <span style={{color:'#8B8B00'}}>招生填报</span>
			}else if(text=='7'){
				return <Popover content={record.remark} title="退款理由"><span style={{color:'#FFA500'}}>退款</span></Popover>
			}
		}
	})
	columns.push({
		title: "操作",
		dataIndex: "id",
		width:120,
		// fixed: getFixed(),
		render: (text, record) => {
			let disabl = true
			if(record.status == '1' || record.status == '6' || record.status == '4'){
				disabl = false
			}
			return (
				<div>
					<Popconfirm title="确认推荐?" onConfirm={()=>onOperate({joinUserId:record.id, status:'5'})} okText="确定" cancelText="取消"><a disabled={disabl}>推荐入学</a></Popconfirm>
					<Divider type="vertical" />
					{/* <Popconfirm title="退款后不可恢复，确认退款?" onConfirm={()=>onOperate(record, '7')} okText="确定" cancelText="取消"><a disabled={disabl}>退款</a></Popconfirm> */}
					<Popover trigger="click" placement="top"
                  content={renderCancelJoin(record)}
                  visible={record._visible?record._visible:false}
                  onVisibleChange={e=>handleCancelJoinVisibleChange(e, record)}
                ><a disabled={disabl}>退款</a></Popover>
				</div>
			)
		}
	})

	return (
		<div>
		  <TableCom
	      	{...tableProps}
			size="middle"
			bordered
			columns={columns}
			pagination={false}
			loading={dataLoading}
			className={styles.fixedTable}
			scroll={{x:num*80+60}}
	      />
		  {count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
}

export default UserTable;
