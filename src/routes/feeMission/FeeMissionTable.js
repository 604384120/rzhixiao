import React from "react"
import { Row, Table, Popconfirm, Pagination, Switch, Divider, Badge } from "antd"
import { getYearFormat } from "utils"

const FeeMissionTable = ({
	count,
	OnSwitchMissionStatus,
	onEditMission,
	onDeleteMission,
	...tableProps,
	onChangePage,
	pageNum,
	user,
	pageSize,
	dataLoading,
}) => {
	const handleChangePage = (num, size) => {
		onChangePage(num==0?1:num, size)
	}

	const handleChangeSize = (current, size) => {
		onChangePage(current==0?1:current, size)
	}

	const handleDelete = (record) => {
		onDeleteMission(record);
	}

	const handeSwitchStatus = (record) => {
		let status = 1;
		if(record.status == 1){
			status=2;
		}
		OnSwitchMissionStatus(record, status);
	}

	const getFixed = () => {
    let width = document.body.clientWidth
    if (width > 769) {
      width -= 553
		}
    if (width <= 780) {
      return 'right'
    }
    return ''
  }

	const handleEidt = (record) => {
		onEditMission(record);
	}
	const columns = [
		{
			title: "任务名称",
			dataIndex: "name",
			width: '100px',
		},{
			title: "学年",
			dataIndex: "year",
			width: '80px',
			render: (text, record) => { return getYearFormat(text) }
		},{
			title: "部门",
			dataIndex: "departmentsName",
			width: '100px',
		},{
			title: "开始日期",
			dataIndex: "beginDate",
			width: '80px',
		},{
			title: "结束日期",
			dataIndex: "endDate",
			width: '80px',
		},{
			title: "负责人",
			dataIndex: "chargeName",
			width: '80px'
		},{
			title: "创建日期",
			dataIndex: "createDate",
			width: '80px'
		},{
			title: "任务状态",
			dataIndex: "status",
			width: '80px',
			fixed: getFixed(),
			render: (text, record) => {
				if(text == '4'){
					return (
						<div>
							<Badge status='error'  text="未上线" />
						</div>
					)
				}
				return (
					<div>
						 <Switch checked={text=='1'?true:false} onChange={()=>{handeSwitchStatus(record)}} />
					</div>
				);
			}
		},{
			title: "操作",
			dataIndex: "id",
			width: '100px',
			fixed: getFixed(),
			render: (text, record) => {
				return (
					<div>
					<a onClick={() => handleEidt(record)}>详情</a>
					<Divider type='vertical'/>
					{record.chargeId==user.id||user.isAdmin=='1'?<Popconfirm title="删除不可恢复确认删除？" onConfirm={()=>handleDelete(record)} okText="确定" cancelText="取消"><a>删除</a></Popconfirm>:''}
					</div>
				);
			}
		}
	]

	return (
		<div>
			<Table
					{...tableProps}
					size="middle"
					bordered
					columns={columns}
					pagination={false}
					loading={dataLoading}
					rowKey={record => record.id}
					scroll={{x:780}}
				/>
			{count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
				total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
}

export default FeeMissionTable;
