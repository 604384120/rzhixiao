import { Modal, Button, message, Row, InputNumber, Input, Spin, Icon,Switch, Upload,Popconfirm, Table, Tag, Divider, Checkbox, Col, Radio, } from "antd";
import { config, getFormat, getYearFormat, dowloadUrl } from 'utils'

const { api } = config
const Dragger = Upload.Dragger;
const UserModal = ({
	modalVisible, 
	modalImportData,
	// modalImportOffData,
	modalType,
	modalEditData,
	subjectMap,
	user,
	selectedAll,
	onClose,
	onUpdateState,
	onImportConfirm,
	onImportCover,
	onUpdateBills,
	}) => {
		const handleSubmitSort = () => {
			modalImportData.step = 0
			onUpdateState({modalImportData})
		}

		const handleRadioChange = (e) => {
			modalImportData.value = e.target.value
			onUpdateState({modalImportData})
		}

		const handleChageImpotType= (value) => {
			modalImportData.importType = value
			onUpdateState({modalImportData})
		}
		
		if(modalType == 'import' || modalType == 'importOff'){		// 调整导入
			const renderImportStep = () => {
				if(modalImportData.step == 3){		// 选择关闭类型
					return <Row style={{width:'100%'}}>
									<Col span={20} offset={3}><Radio.Group style={{width:'100%'}} onChange={handleRadioChange} value={modalImportData.value}>
										<Radio style={{display:'block',marginTop:'30px'}} value={'byUser'}>
											关闭全部<span style={{fontSize:'12px',color:'rgb(174,174,174)',marginLeft:'10px',whiteSpace:'initial'}}>关闭指定学生的全部订单</span>
										</Radio>
										<Radio style={{display:'block',marginTop:'30px'}} value={'byMission'}>
											按收费任务关闭<span style={{fontSize:'12px',color:'rgb(174,174,174)',marginLeft:'10px',whiteSpace:'initial'}}>关闭指定学生某个收费任务下的全部订单</span>
										</Radio>
										<Radio style={{display:'block',marginTop:'30px'}} value={'bySubject'}>
											按收费项目关闭<span style={{fontSize:'12px',color:'rgb(174,174,174)',marginLeft:'10px',whiteSpace:'initial'}}>关闭指定学生某个收费任务下某个收费项目的订单</span>
										</Radio>
									</Radio.Group></Col>
									<Button style={{float:'right',marginTop:'60px',marginRight:'40px'}} type="primary" disabled={!modalImportData.value} onClick={handleSubmitSort}>下一步</Button>
								</Row>
				}else if(modalImportData.step == 0){
					//选择文件上传
					const uploadProps = {
						name: 'file',
						action: api.importUserExcel,
						data: { sence: 'billExcel' },
						beforeUpload: (file) => {
							let upFileName = file.name
							let suffix = upFileName.substring(upFileName.lastIndexOf('.') + 1, upFileName.length)// 后缀名
							if (!suffix) {
								message.error('请上传xls或者xlsx文件')
								return
							}
							suffix = suffix.toLowerCase()
							if (suffix != 'xls' && suffix != 'xlsx') {
								message.error('请上传xls或者xlsx文件')
								return
							}
							modalImportData.fileList = [file];
							onUpdateState({modalImportData})
						},
						onChange: (info) => {
							if (info.file.status === 'done') {
								if(info.file.response.ret_code != "1"){
									message.error(info.file.response.ret_content)
									return;
								}
								message.success('上传成功')
								modalImportData.excel = info.file.response.ret_content;
								onUpdateState({modalImportData})
							} else if (info.file.status === 'error') {
								message.error('上传失败')
							}
							},
						fileList:modalImportData.fileList,
					}
					return (
						<div>
							{modalType == 'import'?<div><Row style={{padding:'0px 10px 10px 10px'}}>导入方式：
                <Tag id={1} color={modalImportData.importType==1?'#108ee9':''} onClick={()=>{handleChageImpotType(1)}}>导入调整金额</Tag>
                <Tag id={2} color={modalImportData.importType==2?'#108ee9':''} onClick={()=>{handleChageImpotType(2)}}>导入应收金额</Tag>
              </Row>
              <Divider style={{margin:'10px'}} /></div>:''}
							<Row  style={{margin: 'auto', textAlign:'center'}}>
								<div style={{fontSize:'12px', marginBottom:'30px'}}>请先<a target="_blank" href={modalImportData.importType==1?dowloadUrl(api.downloadBillAdjustTemp):dowloadUrl(api.downloadBillTemp)}>下载标准模板</a>并按照表格说明整理表格，否则可能导致上传失败</div>
								<div style={{width:'300px', margin: 'auto'}}>
								<Dragger {...uploadProps}>
									<p className="ant-upload-drag-icon">
									<Icon type="inbox" />
									</p>
									<p className="ant-upload-text">点击或将文件拖拽到这里导入数据</p>
									<p className="ant-upload-hint">支持扩展名：.xls .xlsx</p>
								</Dragger>
								</div>
								<div>
									<Button disabled={modalImportData.excel?false:true} style={{float:'right', marginRight:'40px', marginTop:'30px'}} type="primary" size="small" onClick={onImportConfirm}>确认导入</Button>
								</div>
							</Row>
						</div>
					)
				}else if(modalImportData.step == 2){
					//出错了显示错误信息
					return (
						<div style={{ margin: 'auto', textAlign:'center', paddingTop:'20px' }}>
							<Icon type="close-circle" style={{ fontSize: 50, color: 'red' }}/>
							<div style={{marginTop:'20px', fontSize:16, fontWeight:'bold'}}>导入失败</div>
							<div style={{marginTop:'20px'}}>{modalImportData.message}</div>
							<Button style={{marginTop:'40px'}} type="primary" onClick={onClose}>关闭</Button>
						</div>
					)
				}else{
					const renderCoverButton = () => {
						if (modalImportData.importing) {
							return ''
						} else if (modalImportData.covering && modalImportData.cfNum == '0') {
							return '覆盖完成'
						} else if (modalImportData.cfNum == '0') {
							return ''
						}
						return (
							<Popconfirm title="确认覆盖？" onConfirm={() => onImportCover()} okText="确定" cancelText="取消"><a style={{ marginLeft: '10px' }}>覆盖</a></Popconfirm>
						)
					}
					//上传进度和结果
					return (
						<div style={{ margin: 'auto', textAlign:'center', paddingTop:'20px' }}>
							<div>
							{
								modalImportData.importing ? <div><Spin indicator={(<Icon type="loading" style={{ fontSize: 18, marginRight: '10px' }} spin />)} /><span style={{ fontSize: 18 }}>{modalImportData.covering && modalType == 'import' ? '覆盖中' : '导入中'}</span></div>
								: <div><span style={{ fontSize: 18 }}>处理完成</span></div>
							}
							</div>
							<div style={{ marginTop: '30px' }}>{modalImportData.cgNum}条新数据导入成功</div>
							{
								modalImportData.covering && modalType == 'import' && <div style={{ marginTop: '30px' }}>{modalImportData.cgCoverNum}条数据覆盖成功</div>
							}
							<div style={{ marginTop: '30px' }}>
							<span>{modalImportData.wxNum}条无效数据导入失败 {modalImportData.importing || modalImportData.wxNum == '0' ? '' : <a target="_blank" href={dowloadUrl(api.exportErrorBill)}>下载</a>}</span>
							</div>
              {modalType == 'import'?(modalImportData.importType==2 && <div style={{ marginTop: '30px' }}>
                <span>{modalImportData.cfNum}条调整数据导入重复 {modalImportData.importing || modalImportData.cfNum == '0' ? '' : <a target="_blank" href={dowloadUrl(api.exportRepetitionBill)}>下载</a>} {renderCoverButton()}</span>
                </div>):''
              }
						</div>
					)
				}
			}
	
			return (
				<Modal
				visible={modalVisible}
				onCancel={()=>{onClose()}}
				closable={modalImportData.importing?false:true}
				title={modalType == 'import'?"调整导入":(modalImportData.step == 3?"选择关闭类型"
				:("导入关闭账单 "+`${modalImportData.value == 'byUser'?'（选择全部）'
				:modalImportData.value == 'byMission'?'（按收费任务关闭）':'（按收费项目关闭）'}`))}
				footer={null}
				width={'600px'}
				maskClosable={false}
				>
					<div style={{height:modalType == 'import'?'360px':'300px', overflowY: 'scorll'}}>
						{renderImportStep()}
					</div>
				</Modal>
			)
		}

		const handleStatusChange = (record) => {
			let status = '1';
			if(record._status == '1'){
				status='0';
			}
			record._status = status;
			onUpdateState({modalEditData})
    }
    const handlEditFeeChange = (record, value) => {
      record._editFee = value
      onUpdateState({modalEditData})
    }
    const handleEditFeeBlur = (record) => {
      if(!record._editFee){
        record._editFee = 0
      }
      record._totalFee = getFormat(Math.round(record._editFee*100) + parseInt(record.totalFee))
      
      onUpdateState({modalEditData})
    }
    const handlTotalFeeChange = (record, value) => {
      record._totalFee = value
      onUpdateState({modalEditData})
    }
    const handleTotalFeeBlur = (record) => {
      if(!record._totalFee){
        record._totalFee = 0
      }
      record._editFee = getFormat(Math.round(record._totalFee*100) - parseInt(record.totalFee))
      onUpdateState({modalEditData})
    }
		const handleStandChange = (record) => {
			if(record._stand != '1'){
				record._stand = '1';
			}else{
				record._stand = undefined
			}
			onUpdateState({modalEditData})
		}
		const handleSubmit = () => {
			let billList = []
			for(let record of modalEditData.dataSource){
        let totalFee = ''
        if(record._totalFee!=='' && record._totalFee!=undefined){
          totalFee = Math.round(record._totalFee*100).toString()
        }else{
          totalFee = undefined
        }
        if(modalEditData.userId && modalEditData.userId.length==1 && totalFee == record.totalFee 
          && record._reason == record.reason && record._status==record.status && !record._stand){
					//单个人没有改动的项目跳过
					continue;
				}
				if(subjectMap[record.subjectId] && subjectMap[record.subjectId].subType=="2"){
					//跳过学分学费
					continue
				}
				// if(record._addUserId && record._status != '0'){
				// 	//有需要添加的数据
				// 	billList.push({
				// 		missionId: record.missionId,
				// 		totalFee: (record._stand=='1'||user.isStand=='1')?'':totalFee.toString(),
				// 		reason: record._reason,
				// 		subjectId: record.subjectId,
				// 		status: record._status,
				// 		userId: record._addUserId.toString()
				// 	})
				// }
				//if(record.id){
					billList.push({
						missionId: record.missionId,
						totalFee: (record._stand=='1'||(user.isStand=='1' && user.isAdmin!='1'))?'':totalFee,
						reason: record._reason?record._reason:'',
						subjectId: record.subjectId,
						status: record._status
					})
				//}
			}
			if(billList.length <= 0){
				//未做任何改变
				onClose()
				return
			}
			if(modalEditData.userId && modalEditData.userId.length > 0){ // 选择单个或多选
				onUpdateBills({billList,userId: modalEditData.userId})
			}else if(selectedAll){ // 选择全部
				onUpdateBills({billList,params:{}})
			}
		}
		const columns = [
			{
				title: "学年",
				dataIndex: "year",
				width: '10%',
				render: (text, record) => { return getYearFormat(text) }
			},{
				title: "收费任务",
				dataIndex: "missionName",
				width: '10%',
			},{
				title: "项目名称",
				dataIndex: "subjectName",
				width: '10%',
			},{
				title: "原应收金额",
				dataIndex: "totalFee",
				width: '10%',
				render: (text, record) => { return getFormat(text) }
			},{
				title: "调整金额",
				dataIndex: "totalFeeEdit",
				width: '12%',
				render: (text, record) => {
					if((user.isStand=='1' && user.isAdmin!='1') || record._stand=='1'){
						//需要按照标准来设置
						return (<Input disabled={true} style={{width:'100%'}} defaultValue={"按照已有标准设置"} />)
					}
					return (
						<InputNumber disabled={(record._status!='1'||(subjectMap[record.subjectId]&&subjectMap[record.subjectId].subType=="2"))} 
						 style={{width:'100%'}} value={record._editFee} onChange={(value)=>handlEditFeeChange(record, value)} onBlur={()=>handleEditFeeBlur(record)}/>
					)
				}
			},{
				title: "应收金额",
				dataIndex: "totalFeeDist",
				width: '12%',
				render: (text, record) => {
					if((user.isStand=='1' && user.isAdmin!='1') || record._stand=='1'){
						//需要按照标准来设置
						return (<Input disabled={true} style={{width:'100%'}} defaultValue={"按照已有标准设置"} />)
					}
					return (
						<InputNumber disabled={(record._status!='1'||(subjectMap[record.subjectId]&&subjectMap[record.subjectId].subType=="2"))} 
						 style={{width:'100%'}} value={record._totalFee} onChange={(value)=>handlTotalFeeChange(record, value)} onBlur={()=>handleTotalFeeBlur(record)} />
					)
				}
			},{
				title: "调整原因",
				dataIndex: "reason",
				width: '20%',
				render: (text, record) => {
					return (
						<Input disabled={(record._status!='1'||(subjectMap[record.subjectId]&&subjectMap[record.subjectId].subType=="2"))} 
						style={{width:'100%'}} defaultValue={record._reason} onChange={(e)=>{record._reason=e.target.value}}/>
					)
				}
			},{
				title: "项目状态",
				dataIndex: "status",
				width: '10%',
				render: (text, record) => {return  <Switch disabled={subjectMap[record.subjectId]&&subjectMap[record.subjectId].subType=="2"} checked={record._status=='1'?true:false} onChange={()=>{handleStatusChange(record)}} />}
			},{
				title: "按标准设置",
				dataIndex: "_status",
				width: '10%',
				render: (text, record) => {return  <Switch disabled={(subjectMap[record.subjectId]&&subjectMap[record.subjectId].subType=="2")||(user.isStand=='1' && user.isAdmin!='1')||record._status!='1'} checked={record._stand=='1'||(user.isStand=='1' && user.isAdmin!='1')} onChange={()=>{handleStandChange(record)}} />}
			},
		]


		return (
			<Modal
			visible={modalVisible}
			onCancel={()=>{onClose()}}
			title={"应收调整"}
			footer={null}
			width={'1200px'}
			maskClosable={false}
			>
			
			<Table
				{...modalEditData}
				size="middle"
				bordered
				columns={columns}
				pagination={false}
				scroll={{y: 400, x:800}}
	      	/>
			<div style={{padding:'10px 10px', marginTop:'10px'}}>
				<Button type="primary" size='small' style={{float:'right'}} onClick={handleSubmit}>确定</Button>
				<Button size='small' style={{float:'right', marginRight:'10px'}} onClick={onClose}>取消</Button>
			</div>

			</Modal>
		)
		
}

export default UserModal