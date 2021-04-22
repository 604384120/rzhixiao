import React from "react"
import { Table, Pagination, Divider, Popconfirm, Badge, Switch, } from "antd"
import styles from "../common.less"
import { getFormat, getYearFormat } from 'utils'
import moment from 'moment';

const JoinAccountTable = ({
	...tableProps,
	dataLoading,
	count,
	pageNum,
	pageSize,
	onStatInfo,
	onChangePage,
	onLinks,
	OnSwitchStatus,
}) => {
		const { dataSource } = tableProps;

		const handleOnLinks = (record, type) => {
			onLinks (record, type)
		}

		const handleChangePage = (num, size) => {
			onChangePage(num==0?1:num, size)
		}

		const handleChangeSize = (current, size) => {
			onChangePage(current==0?1:current, size)
		}

		const handleStat = (record) => {
			onStatInfo(record)
		}

		const handeSwitchStatus = (record) => {
			let status = '1';
			if(record.status == '1'){
				status='2';
			}
			OnSwitchStatus(record, status);
		}

		const getFixed = () => {
			let width = document.body.clientWidth
			if (width > 769) {
				width -= 304
			}
			if (width < 600) {
				return 'right'
			}
			return ''
		}

    const columns = [{
			title: "账号",
			dataIndex: "loginName",
			width: 100,
		},{
			title: "姓名",
			dataIndex: "name",
			width: 100,
		},{
			title: "手机号",
			dataIndex: "phone",
			width: 100,
		},{
			title: "所属部门",
			dataIndex: "departName",
			width: 100,
		},{
			title: "状态",
			dataIndex: "status",
			width: 80,
			fixed: getFixed(),
			render: (text, record) => {
				return (
					<div>
						 <Switch checked={text=='1'?true:false} onChange={()=>{handeSwitchStatus(record)}} />
					</div>
				);
			}
		},{
			title: "操作",
			dataIndex: "id",
			width: 120,
			fixed: getFixed(),
			render: (text, record) => {
				return (
					<div>
						<div>
							<a onClick={() => handleStat(record)}>统计</a>
							<Divider type="vertical" />
							<a onClick={() => handleOnLinks(record)}>招生链接</a>
							<Divider type="vertical" />
							<a onClick={() => handleOnLinks(record, '2')}>意向招生链接</a>
						</div>
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
					scroll={{x:600}}
	       
	      />
		   {count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={pageNum} defaultPageSize={pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 total={count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
		</div>
		)
			
}

export default JoinAccountTable;
