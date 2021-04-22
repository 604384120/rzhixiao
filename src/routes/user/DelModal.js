import { Modal, Button, message, Row, InputNumber, Input, Spin, Icon, Progress,Switch, Upload,Popconfirm, Tag, Divider, Table } from "antd";
import { config, dowloadUrl } from 'utils'

const { api } = config
const Dragger = Upload.Dragger;
const DelModal = ({
	modalImpDelData,
	onClose,
	onUpdateState,
	onImportConfirm,
	}) => {
		const renderImportStep = () => {
			if(modalImpDelData.step == 0){
				//选择文件上传
				const uploadProps = {
					name: 'file',
					action: api.importUserExcel,
					data: { sence: 'userExcel' },
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
						modalImpDelData.fileList = [file];
						onUpdateState(modalImpDelData)
					},
					onChange: (info) => {
						if (info.file.status === 'done') {
							if(info.file.response.ret_code != "1"){
								message.error(info.file.response.ret_content)
								return;
							}
							message.success('上传成功')
							modalImpDelData.excel = info.file.response.ret_content;
							onUpdateState(modalImpDelData)
						} else if (info.file.status === 'error') {
							message.error('上传失败')
						}
						},
					fileList:modalImpDelData.fileList,
				}
				return (
					<div>
						
						<Row  style={{margin: 'auto', textAlign:'center'}}>
							<div style={{fontSize:'12px', marginBottom:'30px'}}>请先<a target="_blank" href={dowloadUrl(api.downloadUserDeleteTemp)}>下载标准模板</a>并按照表格说明整理表格，否则可能导致上传失败</div>
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
								<Button disabled={modalImpDelData.excel?false:true} style={{float:'right', marginRight:'40px', marginTop:'60px'}} type="primary" size="small" onClick={onImportConfirm}>确认导入</Button>
							</div>
						</Row>
					</div>
				)
			}else if(modalImpDelData.step == 2){
				//出错了显示错误信息
				return (
					<div style={{ margin: 'auto', textAlign:'center', paddingTop:'20px' }}>
						<Icon type="close-circle" style={{ fontSize: 50, color: 'red' }}/>
						<div style={{marginTop:'20px', fontSize:16, fontWeight:'bold'}}>导入失败</div>
						<div style={{marginTop:'20px'}}>{modalImpDelData.message}</div>
						<Button style={{marginTop:'40px'}} type="primary" onClick={onClose}>关闭</Button>
					</div>
				)
			}else{
				//上传进度和结果
				return (
					<div style={{ margin: 'auto', textAlign:'center', paddingTop:'20px' }}>
						<div>
						{
							modalImpDelData.importing ? <div><Spin indicator={(<Icon type="loading" style={{ fontSize: 18, marginRight: '10px' }} spin />)} /></div>
							: <div><span style={{ fontSize: 18 }}>处理完成</span></div>
						}
						</div>
						<div style={{ marginTop: '30px' }}>{modalImpDelData.cgNum}条新数据导入成功</div>
						<div style={{ marginTop: '30px' }}>
						<span>{modalImpDelData.wxNum}条无效数据导入失败 { modalImpDelData.wxNum == '0' ? '' : <a target="_blank" href={dowloadUrl(api.exportErrorUser)}>下载</a>}</span>
						</div>
					</div>
				)
			}
		}

		return (
			<Modal
			visible={modalImpDelData.modalVisible}
			onCancel={()=>{onClose()}}
			closable={modalImpDelData.importing?false:true}
			title="导入删除"
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

export default DelModal