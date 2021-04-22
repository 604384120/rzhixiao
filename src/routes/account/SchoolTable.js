import React from "react"
import { Table, Popconfirm, Pagination, Divider, Menu, Dropdown, Icon } from "antd"
import styles from '../common.less'

const SchoolTable = ({
	shortName,
	dataLoading,
	accountSelected,
	onEditUser,
	onDeleteUser,
	onResetPwd,
	onDataAccess,
	onSelectAccount,
	count,
	...tableProps,
	onChange,
	pageNum,
	pageSize
}) => {

	const handleChangePage = (num, size) => {
		onChange(num==0?1:num, size)
	}

	const handleChangeSize = (current, size) => {
		onChange(current==0?1:current, size)
	}

	const handleSetRowClassName = (record) => {
		return accountSelected&&accountSelected.id==record.id?styles.clickRowStyl:''
	}

	const columns = [
		{
			title: "账号",
			dataIndex: "loginName",
			key: "loginName",
			width: 60,
			render: (text, record) => {
				return <a onClick={()=>{onSelectAccount(record)}}><span style={accountSelected&&accountSelected.id==record.id?{fontWeight:'bolder'}:{}}>{text+'@'+shortName}</span></a>
			}
		},{
			title: "姓名",
			dataIndex: "name",
			key: "name",
			width: 60,
			render: (text, record) => {
				return <span style={accountSelected&&accountSelected.id==record.id?{fontWeight:'bolder'}:{}}>{text}</span>
			}
		},{
			title: "手机号码",
			dataIndex: "phone",
			key: "phone",
			width: 80,
			render: (text, record) => {
				return <span style={accountSelected&&accountSelected.id==record.id?{fontWeight:'bolder'}:{}}>{text}</span>
			}
		},{
			title: "所属部门",
			dataIndex: "departName",
			key: "departName",
			width: 70,
			render: (text, record) => {
				return <span style={accountSelected&&accountSelected.id==record.id?{fontWeight:'bolder'}:{}}>{text}</span>
			}
		},{
			title: "操作",
			dataIndex: "id",
			key: "id",
			width: 100,
			render: (text, record) => {
				return <div><a onClick={()=>{onEditUser(record)}}>编辑</a><Divider type="vertical" /><Popconfirm title="删除不可恢复确认删除？" onConfirm={()=>{onDeleteUser(text)}} okText="Yes" cancelText="No">
    <a>删除</a>
  </Popconfirm><Divider type="vertical" />
  <Dropdown overlay={<Menu><Menu.Item key="0"><a onClick={()=>{onResetPwd(record)}}>重置密码</a></Menu.Item><Menu.Item key="1"><a onClick={()=>{onDataAccess(record)}}>数据权限</a></Menu.Item></Menu>}>
  <Icon type="ellipsis" style={{fontWeight:'bold', fontSize:'14px'}}/>
  </Dropdown>
  </div>
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
	        simple
	        pagination={false}
					loading={dataLoading}
					rowKey={record => record.id}
					rowClassName={(record)=>handleSetRowClassName(record)}
	      />
		  {
			  count>1&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={count} showTotal={count => `共 ${count} 条`} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>
		  }
		</div>
		)
}

export default SchoolTable;
