import { Modal, Row, Popover, Table, Tabs, Icon, Popconfirm, Button } from "antd";
import { getFormat } from 'utils'
import styles from '../common.less'

const TabPane = Tabs.TabPane

const UserModal = ({
	modalVisible, 
  modalData,
  modalType,
  userDisplayList,
  payTypeNameMap,
  onScanClose,
  onScanCancel,
	onClose,
  onChangeIndex,
	}) => {

    if(modalType=="scan"){
      const renderUserInfo = () => {
        let list = []
        let num = 0
        for(let attr of userDisplayList){
          list.push(
            <Row key={num++} style={{marginTop:'10px'}}>{attr.name}：{modalData[attr.id]}</Row>
          )
        }
        return list
      }

      
      return (<Modal	visible={modalVisible}
      onCancel={onScanClose}
      title={"核销结果"}
      footer={null}
      width={'600px'}
      maskClosable={false}>
        <div style={{minHeight:'300px', overflowY:'scroll'}}>
        {
          modalData?
        <div style={{padding:'0 20px 0 20px'}}>
          {modalData.error?<Row style={{fontSize:'20px', color:'red', textAlign:"center", margin:'auto 0'}}>
            {modalData.error}
            </Row>:<div>
          <Row style={{fontSize:'20px', color:'#3eb94e'}}>
            核销成功
          </Row>
          <Row style={{marginTop:'20px'}}>收费任务：{modalData.missionName}</Row>
          <Row style={{marginTop:'10px'}}>收费项目：{modalData.subjectName}</Row>
          {renderUserInfo()}
            <Row style={{marginTop:"30px", textAlign:'center'}}>
            <Popconfirm title="确定取消核销?" onConfirm={onScanCancel} okText="确定" cancelText="取消"><Button type="danger" ghost>取消核销</Button></Popconfirm>
            <Button type="primary" ghost style={{marginLeft:'20px'}} onClick={onScanClose}>关闭窗口</Button>
            </Row>
          </div>
          }
          
        </div>
        :<Icon type="loading" style={{position: 'absolute', left: 'calc(50% - 20px)', top: '50%', fontSize:'50px'}}></Icon>
        }
        </div>
      </Modal>)
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
					return payTypeNameMap?payTypeNameMap[text]:''
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
					return payTypeNameMap?payTypeNameMap[text]:''
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
    
    const columnsOperate = [
			{
				title: "操作类型",
				dataIndex: "type",
        width:'100px',
        render: (text, record) => {
          if(text == '1'){
            return "核销"
          }else{
            return "取消核销"
          }
        }
			},
			{
				title: "操作时间",
				dataIndex: "createDate",
				width:'100px',
      },
      {
				title: "操作人",
				dataIndex: "accountName",
				width:'100px',
      },
    ]

		return (
			<Modal
			visible={modalVisible}
			onCancel={()=>{onClose()}}
			title="查看详情"
			footer={null}
			width={'1100px'}
			maskClosable={false}
			>
			 <div style={{ height: '60vh', overflow: 'scroll' }}>
				<Row style={{marginTop:'20px'}}>
				<Tabs defaultActiveKey="1" animated={false} onChange={onChangeIndex}>
					<TabPane tab="收费订单" key="1">
					<Table
              dataSource={modalData.orderList}
              loading={modalData.dataLoading}
							bordered
							size="middle"
							columns={columnsOrder}
							pagination={false}
							className={styles.fixedTable}
							scroll={{x:240}}
						/>
					</TabPane>
					<TabPane tab="退费订单" key="2">
						<Table
              dataSource={modalData.orderReturnList}
              loading={modalData.dataLoading}
							bordered
							size="middle"
							columns={columnsOrderReturn}
							pagination={false}
							className={styles.fixedTable}
							scroll={{x:240}}
						/>
					</TabPane>
          <TabPane tab="操作历史" key="3">
						<Table
              dataSource={modalData.operateList}
              loading={modalData.dataLoading}
							bordered
							size="middle"
							columns={columnsOperate}
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