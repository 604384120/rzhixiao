import React from "react"
import { Table, Dropdown, message, Menu, Divider, Icon } from "antd"
import styles from '../common.less'
import { getFormat, getYearFormat } from 'utils'

const MissionTable = ({
	...tableProps,
	dataLoading,
	missionCurrent,
	menuMap,
	onChooseMission,
	onCharge,
	onRefund,
	onAdjust,
	onDiscount,
  onDeferred,
  onConvert,
}) => {
	const { dataSource } = tableProps;

	const handleSetRowClassName = (record) => {
		return missionCurrent&&missionCurrent.id==record.id?styles.clickRowStyl:''
	}

	const columnsName = [
		{dataIndex: "subjectName", width: '80px'},
		{dataIndex: "totalFee", width: '80px', render: (text, record) => {return getFormat(text)}},
		{dataIndex: "discount", width: '80px', render: (text, record) => {return getFormat(text)}},
		{dataIndex: "paidFee", width: '80px', render: (text, record) => {return getFormat(text)}},
		{dataIndex: "refund", width: '80px', render: (text, record) => {return getFormat(text)}},
    {dataIndex: "arrears", width: '80px', render: (text, record) => {return getFormat(text)}},
    {dataIndex: "deferred", width: '80px', render: (text, record) => {return record.defPast=='1'?'0.00':getFormat(text)}},
		]
	const columns = [
		{
			title: "收费任务",
			dataIndex: "name",
			width:'80px',
			render: (text, record) => {
				return <span style={missionCurrent&&missionCurrent.id==record.id?{fontWeight:'bolder',color:'#1890ff'}:{}}>{text}</span>
			}
		},
		{
			title: "学年",
			dataIndex: "year",
			width:'80px',
			sorter: (a, b) => a.year - b.year,
			render: (text, record) => {
				return getYearFormat(text)
			}
		},
		{
			title: "项目名称",
			dataIndex: "subjectName",
			width:'80px',
			render: (text, record) => {
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
					  colSpan: 7,
						className:styles.childTablePanel,
						style:{padding:'0'}
					},
				};
			}
		},
		{
			title: "应收金额",
			dataIndex: "totalFee",
			width:'80px',
			render: (text, record) => {
				return {
					props: {
						colSpan: 0,
					},
				};
			}
		},
		{
			title: "减免金额",
			dataIndex: "discount",
			width:'80px',
			render: (text, record) => {
				return {
					props: {
						colSpan: 0,
					},
				};
			}
		},
		{
			title: "收费金额",
			dataIndex: "paidFee",
			width:'80px',
			render: (text, record) => {
				return {
					props: {
						colSpan: 0,
					},
				};
			}
		},{
			title: "退费金额",
			dataIndex: "refund",
			width:'80px',
			render: (text, record) => {
				return {
					props: {
						colSpan: 0,
					},
				};
			}
		},
		{
			title: "欠费金额",
			dataIndex: "arrears",
			width:'80px',
			render: (text, record) => {
				return {
					props: {
						colSpan: 0,
					},
				};
			}
		},{
			title: "缓缴金额",
			dataIndex: "deferred",
			width:'80px',
			render: (text, record) => {
				return {
					props: {
						colSpan: 0,
					},
				};
			}
		},
		{
			title: "操作",
			dataIndex: "id",
			width:'80px',
			render: (text, record) => {
				return (
				<div><a disabled={menuMap['/feeOrder']==undefined} onClick={(e) => { e.stopPropagation();onCharge(record)}}><span style={missionCurrent&&missionCurrent.id==record.id?{fontWeight:'bolder'}:{}}>收费</span></a>
				<Divider type="vertical" />
				<Dropdown 
					overlay={
						<Menu>
              {menuMap['/feeReturn']!=undefined&&<Menu.Item key="0"><a onClick={(e)=>{e.stopPropagation();onRefund(record)}}>退费</a></Menu.Item>}
              {menuMap['/feeConvert']!=undefined&&<Menu.Item key="4"><a onClick={(e)=>{e.stopPropagation();onConvert(record)}}>结转</a></Menu.Item>}
							{menuMap['/feeAdjust']!=undefined&&<Menu.Item key="1"><a onClick={(e)=>{e.stopPropagation();onAdjust(record)}}>应收调整</a></Menu.Item>}
							{menuMap['/feeDiscount']!=undefined&&<Menu.Item key="2"><a onClick={(e)=>{e.stopPropagation();onDiscount(record)}}>减免调整</a></Menu.Item>}
              {menuMap['/feeDeferred']!=undefined&&<Menu.Item key="3"><a onClick={(e)=>{e.stopPropagation();onDeferred(record)}}>缓缴调整</a></Menu.Item>}
						</Menu>}>
				<Icon type="ellipsis" style={{fontWeight:'bold', fontSize:'14px'}}/>
				</Dropdown>
				{/* <a onClick={(e) => { e.stopPropagation();onRefund(record)}}><span style={missionCurrent&&missionCurrent.id==record.id?{fontWeight:'bolder'}:{}}>更多操作</span></a> */}
				</div>)
			}
		},

	];

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
					className={styles.fixedTable}
					scroll={{x:1078}}
					rowClassName={(record)=>handleSetRowClassName(record)}
					onRow={(record) => {
						return {
							onClick: () => {onChooseMission(record)},       // 点击行
						};
					}}
	      />
		</div>
		)
}

export default MissionTable;
