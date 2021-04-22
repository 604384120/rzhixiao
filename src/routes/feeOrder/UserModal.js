import { Modal, Button, message, Row, InputNumber, Input, Spin, Icon,Select, Upload,Popconfirm, Tag, Divider, Table } from "antd";
import { config, dowloadUrl } from 'utils'
import styles from '../common.less'

const { api } = config
const Dragger = Upload.Dragger;
const Option = Select.Option
const UserModal = ({
	subjectMap,
	modalVisible, 
	modalImportData,
	missionList,
	missionMap,
	onClose,
	onUpdateState,
	onImportConfirm,
	onImportCover,
	onGetSubject,
	}) => {
		const renderImportStep = () => {
			if(modalImportData.step == 0){
				//选择文件上传
				const uploadProps = {
					name: 'file',
					action: api.importUserExcel,
					data: { sence: 'orderExcel' },
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
						
						<Row  style={{margin: 'auto', textAlign:'center'}}>
							<div style={{fontSize:'12px', marginBottom:'30px'}}>请先<a target="_blank" href={modalImportData.importType==1?dowloadUrl(api.downloadOrderTemp):dowloadUrl(api.downloadFeeTemp)}>下载标准模板</a>并按照表格说明整理表格，否则可能导致上传失败</div>
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
								<Button disabled={modalImportData.excel?false:true} style={{float:'right', marginRight:'40px', marginTop:'60px'}} type="primary" size="small" onClick={onImportConfirm}>确认导入</Button>
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
			}else if(modalImportData.step == 3){
				const handleChangePosition = (value, record) => {
					record.position = value
					onUpdateState({modalImportData})
				}
				const handleSubmitSort = () => {
					modalImportData.step = 0
					onUpdateState({modalImportData})
				}
				const handleAdd = () => {
					if(modalImportData.edit){
						message.error("请先完成未保存的数据")
						return
					}
					let len = modalImportData.subjectSort.length - 1
					modalImportData.subjectSort[len]._editable = true
					modalImportData.edit  = true
					onUpdateState({modalImportData})
				}
				const createMissionOption = () => {
					const options = [];
					for(let index of missionList){
						options.push(<Option key={index.id} value={index.id} title={index.name}>{index.name}</Option>)
					}
					return options;
				}
				const handleChangeMission = (value, record) =>{
					record.missionId = value
					onUpdateState({modalImportData})
				}
				const createSubjectOption = (record) => {
					const options = [];
					if(record.missionId && missionMap[record.missionId]._subjectList){
						for(let index of missionMap[record.missionId]._subjectList){
							options.push(<Option key={index.id} value={index.id} title={index.name}>{index.name}</Option>)
						}
					}
					return options;
				}
				const handleClickSubject = (record) =>{
					onGetSubject(record)
				}
				const handleChangeSubject = (value, record) =>{
					record.subjectId = value
					onUpdateState({modalImportData})
				}
				const handleSubmit = (record) => {
					if(!record.subjectId || !record.missionId || !record.position){
						message.error("请完善信息")
						return
					}
					for(let item of modalImportData.subjectSort){
						if(item._editable==false&&item.subjectId+'_'+item.missionId==record.subjectId+'_'+record.missionId){
							message.error("请不要添加重复数据")
							return
						}
					}
					record._editable = false
					//排序
					modalImportData.subjectSort = modalImportData.subjectSort.sort((a,b)=>{return a.position-b.position})
					if(record._add){
						//新建的需要新加一个节点
						record._add = false
						modalImportData.subjectSort.push({_add:true})
					}
					modalImportData.edit  = false
					onUpdateState({modalImportData})
				}
				const handleCancel = (record) => {
					record._editable = false
					record.missionId = undefined
					record.subjectId = undefined
					modalImportData.edit  = false
					onUpdateState({modalImportData})
				}
				const handleEdit = (record) => {
					if(modalImportData.edit){
						message.error("请先完成未保存的数据")
						return
					}
					record._editable = true
					modalImportData.edit = true
					onUpdateState({modalImportData})
				}
				const handleDelete = (record) => {
					modalImportData.subjectSort.splice(modalImportData.subjectSort.findIndex(item => item.subjectId+'_'+item.missionId===record.subjectId+'_'+record.missionId), 1)
					onUpdateState({modalImportData})
				}
				const columns = [
					{
						title: "冲抵顺序",
						dataIndex: "position",
						width: 80,
						render: (text, record) => {
							if(record._editable){
								return <InputNumber style={{width:'100%'}} min={0} value={text} onChange={(value)=>handleChangePosition(value, record)}/>
							}else if(record._add){
								return (
									<a href="javascript:;" onClick={(e)=>{handleAdd(record)}}><Icon type="plus" />添加</a>
								)
							}else{
								return text
							}
						}
					},{
						title: "任务名称",
						dataIndex: "missionId",
						width: 180,
						render: (text, record) => {
							if(record._editable){
								return (
									<Select allowClear={true} style={{width:'100%'}} value={record.missionId} 
									showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
									placeholder={"选择任务"} onChange={(value)=>handleChangeMission(value, record)}>
									{createMissionOption()}
									</Select>
								)
							}else{
								return missionMap[record.missionId]?missionMap[record.missionId].name:''
							}
						}
					},{
						title: "项目名称",
						dataIndex: "name",
						width: 150,
						render: (text, record) => {
							if(record._editable){
								return (
									<Select allowClear={true} style={{width:'100%'}} value={record.subjectId} 
									showSearch optionFilterProp="children" disabled={!record.missionId}
									filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
									placeholder={"选择项目"} onFocus={()=>handleClickSubject(record)} 
									onChange={(value)=>handleChangeSubject(value, record)} 
									notFoundContent={!record._subjectList?<Spin size="small" />:null}>
									{createSubjectOption(record)}
									</Select>
								)
							}else{
								return subjectMap[record.subjectId]?subjectMap[record.subjectId].name:''
							}
						}
					},{
						title: "操作",
						dataIndex: "id",
						width: 80,
						render: (text, record) => {
							if(record._editable){
								return (
									<div><a onClick={()=>handleSubmit(record)}>确定</a> <a onClick={()=>handleCancel(record)}>取消</a></div>
								)
							}else if(record._add){
								return ''
							}else{
								return (
									<div><a onClick={()=>handleEdit(record)}>编辑</a> <a  onClick={()=>handleDelete(record)}>删除</a></div>
								)
							}
						}
					},
				]
				//显示导入优先级
				return (
					<div>
						<div style={{ width:'100%', height:'320px', margin: 'auto', textAlign:'center', paddingTop:'20px', marginTop:'-20px'}}>
							<Table 
							dataSource={modalImportData.subjectSort}
							bordered
							columns={columns}
							scroll={modalImportData.subjectSort.length>4?{ x: 540, y: 240 }:{ x: 540 }}
							className={styles.fixedTable}
							pagination={false}/>
						</div>
					<Button disabled={modalImportData.edit||modalImportData.subjectSort.length<=1} style={{float:'right', marginRight:'40px', marginTop:'20px'}} type="primary" size="small" onClick={handleSubmitSort}>下一步</Button>
					</div>
				)
			}else{
				//上传进度和结果
				return (
					<div style={{ margin: 'auto', textAlign:'center', paddingTop:'20px' }}>
						<div>
						{
							modalImportData.importing ? <div><Spin indicator={(<Icon type="loading" style={{ fontSize: 18, marginRight: '10px' }} spin />)} /><span style={{ fontSize: 18 }}>导入中</span></div>
							: <div><span style={{ fontSize: 18 }}>处理完成</span></div>
						}
						</div>
						<div style={{ marginTop: '30px' }}>{modalImportData.cgNum}条新数据导入成功</div>
						<div style={{ marginTop: '30px' }}>
						<span>{modalImportData.wxNum}条无效数据导入失败 {modalImportData.importing || modalImportData.wxNum == '0' ? '' : <a target="_blank" href={dowloadUrl(api.exportErrorOrder)}>下载</a>}</span>
						</div>
						<div style={{ marginTop: '30px' }}><span>{modalImportData.cfNum}条重复数据导入失败 {modalImportData.importing || modalImportData.cfNum == '0' ? '' : <a target="_blank" href={dowloadUrl(api.exportRepetitionOrder)}>下载</a>}</span></div>
					</div>
				)
			}
		}

		const handleChageImpotType= (value) => {
			if((modalImportData.importType==1 && modalImportData.step==0) || modalImportData.step == 3){
				modalImportData.importType = value
				if(value == 2){
					//从subjectList获取
					modalImportData.subjectSort = [{_add:true, position: 1}]
					modalImportData.step = 3
					modalImportData.edit = false
				}else{
					modalImportData.step = 0
				}
				onUpdateState({modalImportData})
			}
		}

		return (
			<Modal
			visible={modalVisible}
			onCancel={()=>{onClose()}}
			closable={modalImportData.importing?false:true}
			title="收费导入"
			footer={null}
			width={'600px'}
			maskClosable={false}
			>
				<div style={{height:'400px', overflowY: 'scorll'}}>
					<Row style={{padding:'0px 10px 10px 10px'}}>导入方式：
						<Tag id={1} color={modalImportData.importType==1?'#108ee9':''} onClick={()=>{handleChageImpotType(1)}}>分项目导入</Tag>
						<Tag id={2} color={modalImportData.importType==2?'#108ee9':''} onClick={()=>{handleChageImpotType(2)}}>按总额导入</Tag>
					</Row>
					<Divider style={{margin:'10px'}} />
					{renderImportStep()}
				</div>
			</Modal>
		)
}

export default UserModal