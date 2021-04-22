import { Modal, Button, message, Row, InputNumber, Input, Spin, Icon, DatePicker, Upload,Popconfirm, Table, Select } from "antd";
import { config, getFormat, getYearFormat, dowloadUrl } from 'utils'
import moment from 'moment'

const Option = Select.Option
const { api } = config
const Dragger = Upload.Dragger;
const UserModal = ({
	modalVisible, 
	modalImportData,
	modalType,
	modalEditData,
	subjectMap,
	defStandMap,
	onClose,
	onUpdateState,
	onImportConfirm,
	onImportCover,
	onSubmitDefrred,
	selectedAll,
	}) => {
		if(modalType == 'import'){
			const renderImportStep = () => {
				if(modalImportData.step == 0){
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
							
							<Row  style={{margin: 'auto', textAlign:'center'}}>
								<div style={{fontSize:'12px', marginBottom:'30px'}}>请先<a target="_blank" href={dowloadUrl(api.downloadDeferredTemp)}>下载标准模板</a>并按照表格说明整理表格，否则可能导致上传失败</div>
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
				title="缓缴导入"
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

		const handleCancel = () => {
			modalEditData.dataSource = undefined
			onUpdateState({modalEditData, modalVisible: false})
		}

		const handleSubmit = () => {
      let billList = []
			for(let record of modalEditData.dataSource){
				if((!record.ids||record.ids.length==1) && record._deferred==undefined && record._defReason==undefined && record._defTimeEnd==undefined){
					continue;
				}
        let deferred = ''
        if(record._deferred!=='' && record._deferred!=undefined){
          deferred = Math.round(record._deferred*100).toString()
        }else if(record._deferred == undefined){
          deferred = Math.round(record.deferred).toString()
        }
				let defTimeEnd = record._defTimeEnd!=undefined?(record._defTimeEnd?record._defTimeEnd.format('YYYY-MM-DD HH:mm:ss'):''):(record.defTimeEnd==null?undefined:record.defTimeEnd)
				if(deferred == '0'){
					defTimeEnd = ""
				}else if(!deferred || !defTimeEnd){
					message.error('请输入正确的金额和结束时间')
					return
				}
				billList.push({
					missionId: record.missionId,
					subjectId: record.subjectId,
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

			if(modalEditData.id && modalEditData.id.length > 0){ // 选择单个或多选
				onSubmitDefrred({billList,id: modalEditData.id})
			}else if(selectedAll){ // 选择全部
				onSubmitDefrred({billList,params:{}})
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
				let stand = defStandMap[value]
				record._deferred = getFormat(stand.fee)
				record._defReason = stand.reason
				record._defTimeEnd = stand.timeEnd?moment(stand.timeEnd):''
			}
			onUpdateState({modalEditData})
		}

		const handleChangeTemp = (value, key, record) => {
			if(value==undefined){
				record[key] = ''
			}else{
				record[key] = value
			}
			onUpdateState({modalEditData})
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
				title: "原缓缴金额",
				dataIndex: "deferred",
				width: '10%',
				render: (text, record) => { return getFormat(text) }
			},{
				title: "缓缴标准",
				dataIndex: "defStandId",
				width: '15%',
				render: (text, record) => {
					let options = []
					let disabled = true
					if(subjectMap[record.subjectId] && defStandMap){
						for(let index in defStandMap){
							if(record.subjectId == defStandMap[index].subjectId){
								options.push(
									<Option key={defStandMap[index].id} value={defStandMap[index].id} title={defStandMap[index].name}>{defStandMap[index].name}</Option>
								)
							}
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
			},
			{
				title: "缓缴金额",
				dataIndex: "_deferred",
				width: '11%',
				render: (text, record) => {
					return (
						<InputNumber style={{width:'100%'}} disabled={record._defStandId?true:false} min={0} value={record._deferred==undefined?getFormat(record.deferred):record._deferred}
						onChange={(value)=>handleChangeTemp(value, "_deferred", record)}/>
					)
				}
			},{
				title: "缓缴原因",
				dataIndex: "defReason",
				width: '15%',
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
			onCancel={()=>{onClose()}}
			title={modalType=="batch"?"批量缓缴调整":"缓缴调整"}
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
				scroll={{y: 400,x:900}}
				rowKey={record => record.id}
	      	/>
			<div style={{padding:'10px 10px', marginTop:'10px'}}>
				<Button type="primary" size='small' style={{float:'right'}} onClick={handleSubmit}>确定</Button>
				<Button size='small' style={{float:'right', marginRight:'10px'}} onClick={handleCancel}>取消</Button>
			</div>

			</Modal>
		)
		
}

export default UserModal