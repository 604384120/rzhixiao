import { Modal, Button, message, Row, Spin, Icon, Upload,Popconfirm, Table, Pagination } from "antd";
import { config, dowloadUrl} from 'utils'
import styles from '../common.less'
import { getFormat } from 'utils'

const { api } = config
const Dragger = Upload.Dragger;
const UserModal = ({
	modalVisible, 
	modalImportData,
	modalType,
	userDisplayList,
	onClose,
	onUpdateState,
	onImportConfirm,
	onImportCover,
	onChangeStatPage,
	}) => {
		if(modalType == 'import'){
			const renderImportStep = () => {
				if(modalImportData.step == 0){
					//选择文件上传
					const uploadProps = {
						name: 'file',
						action: api.importUserExcel,
						data: { sence: 'creditBatchExcel' },
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
								<div style={{fontSize:'12px', marginBottom:'30px'}}>请先<a target="_blank" href={dowloadUrl(api.downloadCreditBatchTemp)}>下载标准模板</a>并按照表格说明整理表格，否则可能导致上传失败</div>
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
							<span>{modalImportData.wxNum}条无效数据导入失败 {modalImportData.importing || modalImportData.wxNum == '0' ? '' : <a target="_blank" href={dowloadUrl(api.exportErrorCreditBatch)}>下载</a>}</span>
							</div>
							<div style={{ marginTop: '30px' }}>
							<span>{modalImportData.cfNum}条重复数据导入失败 {modalImportData.importing || modalImportData.cfNum == '0' ? '' : <a target="_blank" href={dowloadUrl(api.exportRepetitionCreditBatch)}>下载</a>} {renderCoverButton()}</span>
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
				title="选课信息导入"
				footer={null}
				width={'600px'}
				maskClosable={false}
				>
					<div style={{height:'300px', overflowY: 'scorll'}}>
						{renderImportStep()}
					</div>
				</Modal>
			)
		}

		let columns = [];
		let num = 0;
		for(let attr of userDisplayList){
			num ++;
			columns.push({
				title: attr.name,
				dataIndex: attr.id,
				width:'100px'
			})
		}

		const handleChangePage = (num, size) => {
			onChangeStatPage(num==0?1:num, size)
		}
	
		const handleChangeSize = (current, size) => {
			onChangeStatPage(current==0?1:current, size)
		}

		let columnsDetail = [
			{
				title: "所选课程",
				dataIndex: "name",
				width:'100px'
			},{
				title: "课程代码",
				dataIndex: "code",
				width:'100px'
			},{
				title: "课程性质",
				dataIndex: "type",
				width:'100px'
			},{
				title: "课程属性",
				dataIndex: "property",
				width:'100px'
			},{
				title: "课程学分",
				dataIndex: "credit",
				width:'100px'
			},{
				title: "学分标准",
				dataIndex: "fee",
				width:'100px',
				render: (text, record) => {
					return  getFormat(text/record.credit)
				}
			}
		]

		return (
			<Modal
			visible={modalVisible}
			onCancel={()=>{onClose()}}
			closable={modalImportData.importing?false:true}
			title={"课程详情"}
			footer={null}
			width={'1000px'}
			maskClosable={false}
			>
				<div style={{minHeight:'500px', overflowY: 'scorll'}}>
				<div style={{padding:'0 10px 0 10px',backgroundColor:'white'}}>
					<Table
						dataSource={[modalImportData.userInfo]}
						bordered
						columns={columns}
						pagination={false}
						className={styles.fixedTable}
						scroll={{x:240}}
					/>
				</div>

				 <div style={{padding:'10px',backgroundColor:'white',marginTop:'10px'}}>
				 	<Row style={{ borderLeft: '5px solid #1890ff', paddingLeft: '10px', marginBottom: '15px' }}><span >课程列表</span></Row>
					<Table
						dataSource={modalImportData.dataList}
						bordered
						columns={columnsDetail}
						pagination={false}
						className={styles.fixedTable}
						scroll={{x:240}}
					/>
					 {modalImportData.count>0&&<Pagination style={{float:"right",marginTop: '20px'}} current={modalImportData.pageNum} defaultPageSize={modalImportData.pageSize} onChange={handleChangePage} onShowSizeChange={handleChangeSize}
		  	 			total={modalImportData.count} showTotal={count => `共 ${count} 条`} showSizeChanger showQuickJumper/>}
				</div>
				</div>
			</Modal>
		)
		
}

export default UserModal