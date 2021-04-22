import { Modal, Row, Popover, Table, Tabs } from "antd";
import { getFormat, getYearFormat } from 'utils'
import styles from '../common.less'

const TabPane = Tabs.TabPane

const UserModal = ({
	modalVisible, 
	exceedFeeVisible,
	modalData,
	userDisplayList,
	payTypeNameMap,
	onClose,
	onChangeIndex,
	}) => {
		const columnsUser = [];
		let num=1;
		for(let attr of userDisplayList){
			num++;
			columnsUser.push({
				title: attr.name,
				dataIndex: attr.id,
				width:'100px',
				render: (text, record) => {
					return text
				}
			})
		}
		const columnsMissionSub = [
			{dataIndex: "subjectName", width: '100px'},
			{dataIndex: "totalFee", width: '100px', render: (text, record) => {return getFormat(text)}},
			{dataIndex: "discount", width: '100px', render: (text, record) => {return getFormat(text)}},
			{dataIndex: "paidFee", width: '100px', render: (text, record) => {return getFormat(parseInt(text)+parseInt(record.refund))}},
			{dataIndex: "refund", width: '100px', render: (text, record) => {return getFormat(text)}},
			{dataIndex: "arrears", width: '100px', render: (text, record) => {return getFormat(text)}},
		]
		const columnsMission = [
			{
				title: "收费任务",
				dataIndex: "name",
				width:'100px',
			},
			{
				title: "项目名称",
				dataIndex: "subjectName",
				width:'100px',
				render: (text, record) => {
					return {
						children: record.feeBillLists&&record.feeBillLists.length>0?<Table
							dataSource={record.feeBillLists}
							columns={columnsMissionSub}
							bordered
							showHeader={false}
							pagination={false}
							rowKey={re => re.id}
							style={{width:'100%'}}
						  />:'',
						props: {
						  colSpan: 6,
						  className:styles.childTablePanel,
						  style:{padding:'0'}
						},
					};
				}
			},
			{
				title: "应收金额",
				dataIndex: "totalFee",
				width:'100px',
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
				width:'100px',
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
				width:'100px',
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
				width:'100px',
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
				width:'100px',
				render: (text, record) => {
					return {
						props: {
							colSpan: 0,
						},
					};
				}
			},
		]
		if(exceedFeeVisible){
			columnsMission.push({
				title: "超收金额",
				dataIndex: "exceedFee",
				width:'100px',
				render: (text, record) => {
					return getFormat(record.exceedFee)
				}
			})
		}

		const columnsOrderSub = [
			{dataIndex: "subjectName", width: '100px'},
			{dataIndex: "paidFee", width: '100px', render: (text, record) => {return getFormat(text)}},
			{dataIndex: "receiptNo", width: '100px'}]
		const columnsOrder = [
			{
				title: "订单号",
				dataIndex: "orderNo",
				width:'100px',
			},
			{
				title: "支付方式",
				dataIndex: "payType",
				width:'100px',
				render: (text, record) => {
					return payTypeNameMap[text]
				}
			},
			{
				title: "状态",
				dataIndex: "status",
				width:'100px',
				render: (text, record) => {
          if(text=='0'){
            return <Popover content={record.remark} title="冲正理由"><span style={{color:'red'}}>已冲正</span></Popover>
          }else if(text=='5'){
            return <Popover content={record.remark} title="驳回理由"><span style={{color:'red'}}>已驳回</span></Popover>
          }else if(text=='4'){
            return <span style={{color:'#FF9900'}}>审核中</span>
          }else if(text=='2'){
            return <span style={{color:'green'}}>正常</span>
          }
				}
			},
			{
				title: "实收合计",
				dataIndex: "fee",
				width:'100px',
				render: (text, record) => {
					return <span>{getFormat(text)}</span>
				}
			},
			{
				title: "收费时间",
				dataIndex: "timeEnd",
				width:'100px',
			},
			{
				title: "项目名称",
				dataIndex: "subjectName",
				width:'100px',
				render: (text, record) => {
					if(record.feeBillLists&&record.feeBillLists.length==1){
						return record.feeBillLists[0].subjectName;
					}else{
						return {
							children: record.feeBillLists&&record.feeBillLists.length>0?<Table
								dataSource={record.feeBillLists}
								columns={columnsOrderSub}
								bordered
								showHeader={false}
								pagination={false}
								rowKey={re => re.id}
								style={{width:'100%'}}
							  />:'',
							props: {
							  colSpan: 3,
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
				width:'100px',
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
				width:'100px',
				render: (text, record) => {
					if(record.feeBillLists&&record.feeBillLists.length==1){
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
		]

		const columnsOrderReturnSub = [
			{dataIndex: "subjectName", width: '100px'},
			{dataIndex: "paidFee", width: '100px', render: (text, record) => {return getFormat(text)}}]
		const columnsOrderReturn = [
			{
				title: "订单号",
				dataIndex: "orderNo",
				width:'100px',
			},
			{
				title: "退费方式",
				dataIndex: "payType",
				width:'100px',
				render: (text, record) => {
					return payTypeNameMap[text]
				}
			},
			{
				title: "状态",
				dataIndex: "status",
				width:'100px',
				render: (text, record) => {
          if(text=='0'){
            return <Popover content={record.remark} title="作废理由"><span style={{color:'red'}}>已作废</span></Popover>
          }else if(text=='5'){
            return <Popover content={record.remark} title="驳回理由"><span style={{color:'red'}}>已驳回</span></Popover>
          }else if(text=='4'){
            return <span style={{color:'#FF9900'}}>审核中</span>
          }else if(text=='2'){
            return <span style={{color:'green'}}>正常</span>
          }
				}
			},
			{
				title: "实退合计",
				dataIndex: "fee",
				width:'100px',
				render: (text, record) => {
					return <span>{getFormat(text)}</span>
				}
			},
			{
				title: "退费时间",
				dataIndex: "timeEnd",
				width:'100px',
			},
			{
				title: "项目名称",
				dataIndex: "subjectName",
				width:'100px',
				render: (text, record) => {
					if(record.feeBillLists&&record.feeBillLists.length==1){
						return record.feeBillLists[0].subjectName;
					}else{
						return {
							children: record.feeBillLists&&record.feeBillLists.length>0?<Table
								dataSource={record.feeBillLists}
								columns={columnsOrderReturnSub}
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
				width:'100px',
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
    ]
    
    const columnsBillAdjust = [
      {
        title: "学年",
        dataIndex: "year",
        width:'80px',
        render: (text, record) => {
          return getYearFormat(text)
        }
      },
      {
        title: "任务名称",
        dataIndex: "missionName",
        width:'80px'
      },{
        title: "项目名称",
        dataIndex: "subjectName",
        width:'80px'
      },
      {
        title: "原应收金额",
        dataIndex: "srcFee",
        width:'80px',
        render: (text, record) => {
          return record.snapshot?getFormat(record.snapshot['totalFee']):'0.00'
        }
      },
      {
        title: "调整金额",
        dataIndex: "updateFee",
        width:'80px',
        render: (text, record) => {
          return getFormat(text)
        }
      },
      {
        title: "应收金额",
        dataIndex: "dstFee",
        width:'80px',
        render: (text, record) => {
          return record.info?getFormat(record.info['totalFee']):'0.00'
        }
      },{
        title: "调整事项",
        dataIndex: "snapshot",
        width:'80px',
        render: (text, record) => {
          if(!record.snapshot){
            return "账单添加"
          }
          if(record.snapshot['status'] == 0 && record.info['status'] == 1){
            return "账单开启"
          }
          if(record.snapshot['status'] == 1 && record.info['status'] == 0){
            return "账单关闭"
          }
          if(record.info['totalFee']){
            return "金额修改"
          }
          if(record.info['reason']){
            return "原因修改"
          }
          return "-"
        }
      },{
        title: "调整人",
        dataIndex: "accountName",
        width:'80px',
      },{
        title: "调整原因",
        dataIndex: "reason",
        width:'80px',
        render: (text, record) => {
          return record.info?record.info['reason']:''
        }
      },{
        title: "调整时间",
        dataIndex: "createDate",
        width:'80px',
      },
    ];

    const columnsBillDiscount = [
      {
        title: "学年",
        dataIndex: "year",
        width:'80px',
        render: (text, record) => {
          return getYearFormat(text)
        }
      },
      {
        title: "任务名称",
        dataIndex: "missionName",
        width:'80px'
      },{
        title: "项目名称",
        dataIndex: "subjectName",
        width:'80px'
      },
      {
        title: "原减免金额",
        dataIndex: "srcFee",
        width:'80px',
        render: (text, record) => {
          return record.snapshot?getFormat(record.snapshot['discount']):'0.00'
        }
      },
      {
        title: "调整金额",
        dataIndex: "updateFee",
        width:'80px',
        render: (text, record) => {
          return getFormat(text)
        }
      },
      {
        title: "减免金额",
        dataIndex: "dstFee",
        width:'80px',
        render: (text, record) => {
          return record.info?getFormat(record.info['discount']):'0.00'
        }
      },{
        title: "调整人",
        dataIndex: "accountName",
        width:'80px',
      },{
        title: "调整原因",
        dataIndex: "reason",
        width:'80px',
        render: (text, record) => {
          return record.info?record.info['disReason']:''
        }
      },{
        title: "调整时间",
        dataIndex: "createDate",
        width:'80px',
      },
    ];

    const columnsBillDeferred = [
      {
        title: "学年",
        dataIndex: "year",
        width:'80px',
        render: (text, record) => {
          return getYearFormat(text)
        }
      },
      {
        title: "任务名称",
        dataIndex: "missionName",
        width:'80px'
      },{
        title: "项目名称",
        dataIndex: "subjectName",
        width:'80px'
      },
      {
        title: "原缓缴金额",
        dataIndex: "srcFee",
        width:'80px',
        render: (text, record) => {
          return record.snapshot?getFormat(record.snapshot['deferred']):'0.00'
        }
      },
      {
        title: "缓缴金额",
        dataIndex: "dstFee",
        width:'80px',
        render: (text, record) => {
          return record.info?getFormat(record.info['deferred']):'0.00'
        }
      },{
        title: "截至时间",
        dataIndex: "defTimeEnd",
        width:'80px',
         render: (text, record) => {
          return record.info?record.info['defTimeEnd']:''
        }
      },{
        title: "调整人",
        dataIndex: "accountName",
        width:'80px',
      },{
        title: "调整原因",
        dataIndex: "reason",
        width:'80px',
        render: (text, record) => {
          return record.info?record.info['defReason']:''
        }
      },{
        title: "调整时间",
        dataIndex: "createDate",
        width:'80px',
      },
    ];

		return (
			<Modal
			visible={modalVisible}
			onCancel={()=>{onClose()}}
			title="查看明细"
			footer={null}
			width={'1100px'}
			maskClosable={false}
			>
			 <div style={{ height: '60vh', overflow: 'scroll' }}>
				<Row>
					<Table
						dataSource={[modalData.userCurrent]}
						size="middle"
						bordered
						columns={columnsUser}
						pagination={false}
						className={styles.fixedTable}
						scroll={{x:240}}
					/>
				</Row>
				<Row style={{marginTop:'20px'}}>
				<Tabs defaultActiveKey="1" animated={false} onChange={onChangeIndex}>
					<TabPane tab="收费任务" key="1">
						<Table
							dataSource={modalData.missionList}
							bordered
							size="middle"
							columns={columnsMission}
							pagination={false}
							className={styles.fixedTable}
							scroll={{x:240}}
						/>
					</TabPane>
					<TabPane tab="收费订单" key="2">
					<Table
							dataSource={modalData.orderList}
							bordered
							size="middle"
							columns={columnsOrder}
							pagination={false}
							className={styles.fixedTable}
							scroll={{x:240}}
						/>
					</TabPane>
					<TabPane tab="退费订单" key="3">
						<Table
							dataSource={modalData.orderReturnList}
							bordered
							size="middle"
							columns={columnsOrderReturn}
							pagination={false}
							className={styles.fixedTable}
							scroll={{x:240}}
						/>
					</TabPane>
          <TabPane tab="应收调整记录" key="4">
						<Table
							dataSource={modalData.billAdjustList}
							bordered
							size="middle"
							columns={columnsBillAdjust}
							pagination={false}
							className={styles.fixedTable}
							scroll={{x:240}}
						/>
					</TabPane>
          <TabPane tab="减免调整记录" key="5">
						<Table
							dataSource={modalData.billDiscountList}
							bordered
							size="middle"
							columns={columnsBillDiscount}
							pagination={false}
							className={styles.fixedTable}
							scroll={{x:240}}
						/>
					</TabPane>
          <TabPane tab="缓缴调整记录" key="6">
						<Table
							dataSource={modalData.billDeferredList}
							bordered
							size="middle"
							columns={columnsBillDeferred}
							pagination={false}
							className={styles.fixedTable}
							scroll={{x:240}}
						/>
					</TabPane>
				</Tabs>
				</Row>
				</div>
			</Modal>
		)
		
		
}

export default UserModal