import { Col, Modal, Button, message, Table, InputNumber, Input, Spin, Icon, Progress,Switch, Upload, Popconfirm,Tag,DatePicker, Select  } from "antd";
import { getFormat } from 'utils'
import { config, dowloadUrl } from 'utils'
import styles from "../common.less"
import moment from 'moment'

const { api } = config
const Dragger = Upload.Dragger;
const Option = Select.Option
const FeeDerateModal = ({ 
	modalVisible, 
	modalType,
	modalPrsNum,
	modalClosable,
	modalImportData,
	modalData,
	missionId,
	subjectMap,
	user,
	selectedAll,
	...tableProps,
	onClose,
	onUpdateState,
	onUpdateBills,
	onImportConfirm,
	onImportCover,
	}) => {
		const handleClose = () => {
			//重置所有项目
			const {dataSource} = tableProps;
			if(dataSource){
				for(let node of dataSource){
					delete node._defReason
					delete node._defStandId
					delete node._defTimeEnd
					delete node._deferred
					delete node._disReason
					delete node._disStandId
					delete node._discount
				}
			}
			onClose()
		}
		const handleChangeTemp = (value, key, record) => {
			if(value==undefined){
				record[key] = ''
			}else{
				record[key] = value
			}
			onUpdateState()
		}
		if(modalType == 'bilCreateProc'){
			return (<Modal
			visible={modalVisible}
			onCancel={()=>{onClose()}}
			title="账单生成进度"
			footer={null}
			width={'400px'}
			closable={modalClosable}
			maskClosable={modalClosable}
			>
				<div style={{width: '40%',margin: 'auto', textAlign:'center'}}> <Progress type="circle" percent={modalPrsNum} width={80} /></div>
			</Modal>)
		}else if(modalType == "bilImport"){
			const handleImportConfirm = () => {
				onImportConfirm()
			}
			const handleChangeFormat = (value) => {
				modalImportData.importFormat = value
				onUpdateState({modalImportData})
			}
			const handleConfirmImportType = () => {
				modalImportData.importType =  modalImportData.importFormat?modalImportData.importFormat:1
				onUpdateState({modalImportData})
			}
			const renderImportStep = () => {
				if(!modalImportData.importType){
					//选择导入方式
					return (
						<div>
							<Col span={3} style={{textAlign:'center'}}>
								<div><Tag color={modalImportData.importFormat==2?"":"blue"} onClick={()=>handleChangeFormat(1)}>&nbsp;&nbsp;格式1&nbsp;&nbsp;</Tag></div>
								<div style={{marginTop:'15px'}}><Tag color={modalImportData.importFormat==2?"blue":""} onClick={()=>handleChangeFormat(2)}>&nbsp;&nbsp;格式2&nbsp;&nbsp;</Tag></div>
							</Col>
							<Col span={21} style={{borderLeft:"1px solid rgb(240,240,240)"}}>
							<div style={{marginLeft:'10px',marginBottom:'5px'}}>示例：</div>
							{
							modalImportData.importFormat==2?
							<table border="1px" borderColor="#ddd" className={styles.formatTable} style={{marginLeft:'10px',textAlign:'center',verticalAlign:'middle',width:'450px'}}>
								<thead style={{background:"rgb(245,245,245)"}}>
								<tr>
								<td>姓名</td>
								<td>身份证件号</td>
								<td>学费</td>
								<td>住宿费</td>
								</tr>
								</thead>
								<tbody>
								<tr>
									<td>学生1</td>
									<td>331990999888778888</td>
									<td>100.00</td>
									<td>50.00</td>
								</tr>
								<tr>
									<td>学生2</td>
									<td>331990999888778881</td>
									<td>100.00</td>
									<td>50.00</td>
								</tr>
								<tr>
									<td>学生3</td>
									<td>331990999888778882</td>
									<td>100.00</td>
									<td>50.00</td>
								</tr>
								<tr>
									<td>学生4</td>
									<td>331990999888778883</td>
									<td>100.00</td>
									<td>50.00</td>
								</tr>
								</tbody>
							</table>
							:<table border="1px" borderColor="#ddd" className={styles.formatTable} style={{marginLeft:'10px',textAlign:'center',verticalAlign:'middle',width:'450px'}}>
								<thead style={{background:"rgb(245,245,245)"}}>
								<tr>
									<td>姓名</td>
									<td>身份证件号</td>
									<td>项目名称</td>
									<td>应收金额</td>
								</tr>
								</thead>
								<tbody>
									<tr>
										<td>学生1</td>
										<td>331990999888778888</td>
										<td>学费</td>
										<td>100.00</td>
									</tr>
									<tr>
										<td>学生1</td>
										<td>331990999888778888</td>
										<td>住宿费</td>
										<td>50.00</td>
									</tr>
									<tr>
										<td>学生2</td>
										<td>331990999888778880</td>
										<td>学费</td>
										<td>100.00</td>
									</tr>
									<tr>
										<td>学生2</td>
										<td>331990999888778880</td>
										<td>住宿费</td>
										<td>50.00</td>
									</tr>
								</tbody>
							</table>
							}
							<Button type="primary" size="small" style={{marginTop:'40px', float:"right", marginRight:'20px'}} onClick={handleConfirmImportType} >下一步</Button>
							</Col>
						</div>)
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
						<div  style={{margin: 'auto', textAlign:'center'}}>
						<div style={{fontSize:'12px', marginBottom:'30px'}}>请先<a target="_blank" href={modalImportData.importType==2?dowloadUrl(api.downloadBillBySubjectTemp):dowloadUrl(api.downloadBillTemp)}>下载标准模板</a>并按照表格说明整理表格，否则可能导致上传失败</div>
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
							<Button disabled={modalImportData.excel?false:true} style={{float:'right', marginRight:'126px', marginTop:'20px'}} type="primary" size="small" onClick={handleImportConfirm}>确认导入</Button>
						</div>
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
								modalImportData.importing ? <div><Spin indicator={(<Icon type="loading" style={{ fontSize: 18, marginRight: '10px' }} spin />)} /><span style={{ fontSize: 18 }}>{modalImportData.covering ? '覆盖中' : '导入中'}</span></div>
								: <div><span style={{ fontSize: 18 }}>处理完成</span></div>
							}
							</div>
							<div style={{ marginTop: '30px' }}>{modalImportData.cgNum}条新数据导入成功</div>
							{
								modalImportData.covering && <div style={{ marginTop: '30px' }}>{modalImportData.cgCoverNum}条数据覆盖成功</div>
							}
							<div style={{ marginTop: '30px' }}>
							<span>{modalImportData.wxNum}条无效数据导入失败 {modalImportData.importing || modalImportData.wxNum == '0' ? '' : <a target="_blank" href={dowloadUrl(api.exportErrorBill)}>下载</a>}</span>
							</div>
							<div style={{ marginTop: '30px' }}>
							<span>{modalImportData.cfNum}条重复数据导入失败 {modalImportData.importing || modalImportData.cfNum == '0' ? '' : <a target="_blank" href={dowloadUrl(api.exportRepetitionBill)}>下载</a>} {renderCoverButton()}</span>
							</div>
						</div>
					)
				}
			}

			return (
				<Modal
				visible={modalVisible}
				onCancel={()=>{onClose()}}
				closable={modalImportData.importing?false:true}
				title="导入账单"
				footer={null}
				width={'600px'}
				maskClosable={false}
				>
					<div style={{height:'280px'}}>
						{renderImportStep()}
					</div>
				</Modal>
			)
		}else if(modalType == "adjust"){
			const {dataSource} = tableProps;
			const handleStatusChange = (record) => {
				let status = '1';
				if(record._status == '1'){
					status='0';
				}
				record._status = status
				onUpdateState({modalData})
			}
			const handleStandChange = (record) => {
				if(record._stand != '1'){
					record._stand = '1';
				}else{
					record._stand = undefined
				}
				onUpdateState({modalData})
			}
			const handleSubmit = () => {
				let billList = []
				for(let record of dataSource){
          let totalFee = ''
          if(record._totalFee!=='' && record._totalFee!=undefined){
            totalFee = Math.round(record._totalFee*100).toString()
          }else{
            totalFee = undefined
          }
					if(modalData.userId && modalData.userId.length==1 && totalFee == record.totalFee && record._reason == record.reason && record._status==record.status && !record._stand){
						//单个人没有改动的项目跳过
						continue
					}else if(record._count==1 && record._addUserId && record._status == '0'){
						//单个人没有打开的项目跳过
						continue
					}
					if(subjectMap[record.subjectId] && subjectMap[record.subjectId].subType=="2"){
						//跳过学分学费
						continue
					}
					// if(record._addUserId && record._status != '0'){
					// 	//有需要添加的数据
					// 	billList.push({
					// 		missionId: missionId,
					// 		totalFee: (user.isStand!='1'&&record._stand!='1')?totalFee.toString():'',
					// 		reason: record._reason,
					// 		subjectId: record.subjectId,
					// 		status: record._status,
					// 		userId: record._addUserId.toString()
					// 	})
					// }
					// if(record.id){
						billList.push({
							missionId: missionId,
							totalFee: ((user.isStand!='1'||user.isAdmin=='1')&&record._stand!='1')?totalFee:'',
							reason: record._reason?record._reason:'',
							subjectId: record.subjectId,
							status: record._status
						})
					// }
				}
				if(billList.length <= 0){
					//未做任何改变
					onClose()
					return
				}

				if(modalData.userId && modalData.userId.length > 0){
					onUpdateBills({billList,userId: modalData.userId})
				}else if(selectedAll){
					onUpdateBills({billList,params:{}})
				}
      }
      const handlEditFeeChange = (record, value) => {
        record._editFee = value
        onUpdateState({modalData})
      }
      const handleEditFeeBlur = (record) => {
        if(!record._editFee){
          record._editFee = 0
        }
        record._totalFee = getFormat(Math.round(record._editFee*100) + parseInt(record.totalFee))
        
        onUpdateState({modalData})
      }
      const handlTotalFeeChange = (record, value) => {
        record._totalFee = value
        onUpdateState({modalData})
      }
      const handleTotalFeeBlur = (record) => {
        if(!record._totalFee){
          record._totalFee = 0
        }
        record._editFee = getFormat(Math.round(record._totalFee*100) - parseInt(record.totalFee))
        onUpdateState({modalData})
      }
			const columns = [
				{
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
					width: '15%',
					render: (text, record) => {
						if((user.isStand=='1' && user.isAdmin!='1') || record._stand == '1'){
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
					dataIndex: "disReason",
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
					render: (text, record) => {return <Switch disabled={subjectMap[record.subjectId]&&subjectMap[record.subjectId].subType=="2"} checked={record._status=='1'} onChange={()=>{handleStatusChange(record)}} />}
				},
				{
					title: "按标准设置",
					dataIndex: "stand",
					width: '10%',
					render: (text, record) => {return <Switch disabled={(subjectMap[record.subjectId]&&subjectMap[record.subjectId].subType=="2")||(user.isStand=='1' && user.isAdmin!='1')||record._status!='1'} checked={(record._stand=='1'||(user.isStand=='1' && user.isAdmin!='1'))?true:false} onChange={()=>{handleStandChange(record)}} />}
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
					{...tableProps}
					size="middle"
					bordered
					columns={columns}
					pagination={false}
					scroll={{y: 400,x:800}}
				  />
				<div style={{padding:'10px 10px'}}>
					<Button type="primary" size='small' style={{float:'right'}} onClick={handleSubmit}>确定</Button>
					<Button size='small' style={{float:'right', marginRight:'10px'}} onClick={onClose}>取消</Button>
				</div>
				</Modal>
			)
		}else if(modalType == "discount"){
			//减免调整
			const {dataSource} = tableProps;
			const handleSubmit = () => {
        let billList = []
        let i = 0
				for(let record of dataSource){
          i++
          if(record._add){
            continue
          }
          if(!record.subjectId || !record._disReason || !record._discount){
            message.error("请完善第"+i+"行调整信息")
            return
          }
          let discount = Math.round(record._discount*100).toString()
          
					billList.push({
						missionId: missionId,
						discount,
						disReason: record._disReason!=undefined?record._disReason:(record.disReason==null?undefined:record.disReason),
						subjectId: record.subjectId,
						disStandId: record._disStandId!=undefined?record._disStandId:(record.disStandId==null?undefined:record.disStandId),
					})
				}
				if(billList.length <= 0){
					//未做任何改变
					onClose()
					return
				}
				if(modalData.userId && modalData.userId.length > 0){
					onUpdateBills({billList,userId: modalData.userId})
				}else if(selectedAll){
					onUpdateBills({billList,params:{}})
				}
			}
			const handleChangeStand = (value, record) => {
				if(value == undefined){
					record._disStandId = ''
					record._discount = getFormat(record.lastDeferred)
					record._disReason = record.disReason
				}else{
					record._disStandId = value
					let stand = subjectMap[record.subjectId]._disStandMap[value]
					record._discount = getFormat(stand.fee)
					record._disReason = stand.reason
				}
				onUpdateState()
      }
      const handleAdd = () => {
        let dataSource = modalData.dataSource
        let temp = {subjectName:undefined,disStandId:undefined,_id:dataSource.length-1}
        if(modalData.feeBillListEntities&&modalData.feeBillListEntities.length == 1){
          temp.subjectId = modalData.feeBillListEntities[0].subjectId
          temp.subjectName = modalData.feeBillListEntities[0].subjectName
        }
        dataSource[dataSource.length-1] = temp
        dataSource.push({_add:true})
        onUpdateState()
      }
  
      const handleChangeMission = (value, record) => {
        if(record.missionId != value){
          //清空其他数据
          record._disStandId = undefined
          record._discount = undefined
          record._disReason = undefined
          record.subjectId = undefined
          record.subjectName = undefined
        }
        for(let node of modalData.feeBillListEntities){
          if(node.missionId == value){
            record.year = node.year
            break
          }
        }
        record.missionId = value
        onUpdateState()
      }
  
      const handleChangeSubject = (value, record) => {
        if(record.subjectId != value){
          //清空其他数据
          record._disStandId = undefined
          record._discount = undefined
          record._disReason = undefined
        }
        record.subjectId = value
        onUpdateState()
      }
  
      const handleDelete = (record) => {
        let temp = []
        let i = 0
        for(let node of modalData.dataSource){
          if(node._id != record._id){
            node._id = i++
            temp.push(node)
          }
        }
        modalData.dataSource = temp
        onUpdateState()
      }
			const columns = [
				{
					title: "项目名称",
					dataIndex: "subjectName",
          width: '10%',
          render: (text, record) => {
            if(record._add){
              return <a href="javascript:;" onClick={(e) => { handleAdd(record) }}><Icon type="plus" />添加</a>
            }
            let options = []
            if(modalData.feeBillListEntities){
              for(let node of modalData.feeBillListEntities){
                options.push(
                  <Option key={node.subjectId} value={node.subjectId} title={node.subjectName}>{node.subjectName}</Option>
                )
              }
            }
            return <Select placeholder={"选择项目"} style={{width:"100%"}} showSearch
              value={record.subjectId} allowClear
              optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={(value)=>handleChangeSubject(value, record)}>{options}</Select>
          }
				},{
					title: "减免标准",
					dataIndex: "disStandId",
					width: '15%',
					render: (text, record) => {
            if(record._add){
              return ""
            }
						let options = []
						let disabled = true
						if(subjectMap[record.subjectId] && subjectMap[record.subjectId]._disStandMap){
							let stanMap = subjectMap[record.subjectId]._disStandMap
							for(let index in stanMap){
								options.push(
									<Option key={stanMap[index].id} value={stanMap[index].id} title={stanMap[index].name}>{stanMap[index].name}</Option>
								)
							}
							disabled = false
						}
						return(
							<Select placeholder={disabled?"暂无标准":"选择标准"} showSearch style={{width:"100%"}} disabled={disabled} defaultValue={text}
							value={record._disStandId==undefined?text:record._disStandId} allowClear
							optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
							onChange={(value)=>handleChangeStand(value, record)}>
							{options}
							</Select>
						)
					}
				},{
					title: "调整金额",
					dataIndex: "editDiscount",
					width: '12%',
					render: (text, record) => {
            if(record._add){
              return ""
            }
						return (
							<InputNumber style={{width:'100%'}} disabled={!record.subjectId || record._disStandId} value={record._discount==undefined?getFormat(record.discount):record._discount}
							onChange={(value)=>handleChangeTemp(value, "_discount", record)}/>
						)
					}
				},{
					title: "减免原因",
					dataIndex: "disReason",
					width: '20%',
					render: (text, record) => {
            if(record._add){
              return ""
            }
						return (
							<Input style={{width:'100%'}} value={record._disReason==undefined?text:record._disReason} disabled={!record.subjectId}
							onChange={(e)=>handleChangeTemp(e.target.value, "_disReason", record)}/>
						)
					}
				},{
          title: "操作",
          dataIndex: "id",
          width: '10%',
          render: (text, record) => {
            if(record._add){
              return ""
            }
            return <a onClick={()=>handleDelete(record)}>删除</a>
          }
        }
			]
			return (
				<Modal
				visible={modalVisible}
				onCancel={()=>{handleClose()}}
				title={"减免调整"}
				footer={null}
				width={'1000px'}
				maskClosable={false}
				>
	
				<Table
					{...tableProps}
					size="middle"
					bordered
					columns={columns}
					pagination={false}
					scroll={{y: 400,x:700}}
					rowKey={record => record.id}
				  />
				<div style={{padding:'10px 10px', marginTop:'10px'}}>
					<Button type="primary" size='small' style={{float:'right'}} onClick={handleSubmit}>确定</Button>
					<Button size='small' style={{float:'right', marginRight:'10px'}} onClick={handleClose}>取消</Button>
				</div>
				</Modal>
			)
		}else if(modalType == 'deferred'){
			//缓缴调整
			const {dataSource} = tableProps;
			const handleSubmit = () => {
				let billList = []
				for(let record of dataSource){
					if((!record.ids||record.ids.length==1) && record._deferred==undefined && record._defReason==undefined && record._defTimeEnd==undefined){
						continue
					}
          let deferred = ""
          if(record._deferred!=='' && record._deferred!=undefined){
            deferred =  Math.round(record._deferred*100).toString()
          }else if(record._deferred == undefined){
            deferred = Math.round(record.deferred).toString()
          }
          
					let defTimeEnd = record._defTimeEnd!=undefined?(record._defTimeEnd?record._defTimeEnd.format('YYYY-MM-DD HH:mm:ss'):''):(record.defTimeEnd==null?undefined:record.defTimeEnd)
					if(deferred == '0'){
						defTimeEnd = ""
					}else if(!defTimeEnd || !deferred){
						message.error('请输入正确的金额和结束时间')
						return
					}
					billList.push({
						missionId: missionId,
						deferred,
						defReason: record._defReason!=undefined?record._defReason:(record.defReason==null?undefined:record.defReason),
						subjectId: record.subjectId,
						defTimeEnd,
						defStandId: record._defStandId!=undefined?record._defStandId:(record.defStandId==null?undefined:record.defStandId),
					})
				}
				if(billList.length == 0){
					onClose()
					return
				}

				if(modalData.userId && modalData.userId.length > 0){
					onUpdateBills({billList,userId: modalData.userId})
				}else if(selectedAll){
					onUpdateBills({billList,params:{}})
				}
			}

			const handleChangeStand = (value, record) => {
				if(value == undefined){
					record._defStandId = ''
					record._deferred = getFormat(record.lastDeferred)
					record._defReason = record.defReason
					record._defTimeEnd = record.defTimeEnd?moment(record.defTimeEnd):''
				}else{
					record._defStandId = value
					let stand = subjectMap[record.subjectId]._defStandMap[value]
					record._deferred = getFormat(stand.fee)
					record._defReason = stand.reason
					record._defTimeEnd = stand.timeEnd?moment(stand.timeEnd):''
				}
				onUpdateState()
			}
	
			const columns = [
				{
					title: "项目名称",
					dataIndex: "subjectName",
					width: '10%',
				},{
					title: "原缓缴金额",
					dataIndex: "deferred",
					width: '10%',
					render: (text, record) => {return getFormat(text)}
				},{
					title: "缓缴标准",
					dataIndex: "defStandId",
					width: '15%',
					render: (text, record) => {
						let options = []
						let disabled = true
						if(subjectMap[record.subjectId] && subjectMap[record.subjectId]._defStandMap){
							let stanMap = subjectMap[record.subjectId]._defStandMap
							for(let index in stanMap){
								options.push(
									<Option key={stanMap[index].id} value={stanMap[index].id} title={stanMap[index].name}>{stanMap[index].name}</Option>
								)
							}
							disabled = false
						}
						return(
							<Select placeholder={disabled?"暂无标准":"选择标准"} showSearch style={{width:"100%"}} disabled={disabled} defaultValue={text}
							value={record._defStandId==undefined?text:record._defStandId} allowClear
							optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
							onChange={(value)=>handleChangeStand(value, record)}>
							{options}
							</Select>
						)
					}
				},{
					title: "缓缴金额",
					dataIndex: "deferredEdit",
					width: '12%',
					render: (text, record) => {
						return (
							<InputNumber style={{width:'100%'}} min={0} disabled={record._defStandId} min={0} value={record._deferred==undefined?getFormat(record.deferred):record._deferred}
							onChange={(value)=>handleChangeTemp(value, "_deferred", record)}/>
						)
					}
				},{
					title: "缓缴原因",
					dataIndex: "defReason",
					width: '20%',
					render: (text, record) => {
						return (
							<Input style={{width:'100%'}} value={record._defReason==undefined?text:record._defReason}
							onChange={(e)=>handleChangeTemp(e.target.value, "_defReason", record)}/>
						)
					}
				},{
					title: "截至时间",
					dataIndex: "defTimeEnd",
					width: '20%',
					render: (text, record) => {
						return  <DatePicker format="YYYY-MM-DD HH:mm:ss"
							value={record._defTimeEnd==undefined?(text?moment(text):''):record._defTimeEnd}
							onChange={time=>handleChangeTemp(time, "_defTimeEnd", record)}
							defaultValue={text ? moment(text) : ''}
							showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
						/>}
				},
			]
	
	
			return (
				<Modal
				visible={modalVisible}
				onCancel={()=>{handleClose()}}
				title={modalType=="batch"?"批量缓缴调整":"缓缴调整"}
				footer={null}
				width={'1000px'}
				maskClosable={false}
				>
	
				<Table
					{...tableProps}
					size="middle"
					bordered
					columns={columns}
					pagination={false}
					scroll={{y: 400,x:900}}
					rowKey={record => record.id}
				  />
				<div style={{padding:'10px 10px', marginTop:'10px'}}>
					<Button type="primary" size='small' style={{float:'right'}} onClick={handleSubmit}>确定</Button>
					<Button size='small' style={{float:'right', marginRight:'10px'}} onClick={handleClose}>取消</Button>
				</div>
	
				</Modal>
			)
		}
	
}

export default FeeDerateModal