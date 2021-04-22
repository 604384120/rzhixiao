import { Modal, Button, message, Row, InputNumber, Input, Spin, Icon, Upload,Popconfirm, Table, Select, Tag, Divider, } from "antd";
import { config, getFormat, getYearFormat, dowloadUrl } from 'utils'

const { api } = config
const Option = Select.Option
const Dragger = Upload.Dragger;
const UserModal = ({
	modalVisible, 
	modalImportData,
	modalType,
	modalEditData,
	subjectMap,
	disStandMap,
	selectedAll,
	onClose,
	onUpdateState,
	onImportConfirm,
	onImportCover,
	onSubmitDiscount,
	}) => {

		const handleChageImpotType= (value) => {
			modalImportData.importType = value
			onUpdateState({modalImportData})
		}

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
							{modalImportData.step == 0?<div><Row style={{padding:'0px 10px 10px 10px'}}>导入方式：
                <Tag id={1} color={modalImportData.importType==1?'#108ee9':''} onClick={()=>{handleChageImpotType(1)}}>导入调整金额</Tag>
                <Tag id={2} color={modalImportData.importType==2?'#108ee9':''} onClick={()=>{handleChageImpotType(2)}}>导入减免金额</Tag>
              </Row>
              <Divider style={{margin:'10px'}} /></div>:''}
							<Row  style={{margin: 'auto', textAlign:'center'}}>
								<div style={{fontSize:'12px', marginBottom:'30px'}}>请先<a target="_blank" href={modalImportData.importType==1?dowloadUrl(api.downloadDiscountAdjustTemp):(api.downloadDiscountTemp)}>下载标准模板</a>并按照表格说明整理表格，否则可能导致上传失败</div>
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
              {
                modalImportData.importType==2 && <div style={{ marginTop: '30px' }}>
                <span>{modalImportData.cfNum}条重复数据导入失败 {modalImportData.importing || modalImportData.cfNum == '0' ? '' : <a target="_blank" href={dowloadUrl(api.exportRepetitionBill)}>下载</a>} {renderCoverButton()}</span>
                </div>
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
				title="减免导入"
				footer={null}
				width={'600px'}
				maskClosable={false}
				>
					<div style={{height:'360px', overflowY: 'scorll'}}>
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
      let i = 0
			for(let record of modalEditData.dataSource){
        i++
        if(record._add){
          continue
        }
        if(!record.missionId || !record.subjectId || !record._disReason || !record._discount){
          message.error("请完善第"+i+"行调整信息")
          return
        }
        let discount = Math.round(record._discount*100).toString()
				billList.push({
					missionId: record.missionId,
					subjectId: record.subjectId,
					discount,
					disReason: record._disReason!=undefined?record._disReason:(record.disReason==null?undefined:record.disReason),
					disStandId: record._disStandId!=undefined?record._disStandId:(record.disStandId==null?undefined:record.disStandId),
				})
			}
			if(billList.length == 0){
				onClose()
				return
			}
			if(modalEditData.id && modalEditData.id.length > 0){ // 选择单个或多选
				onSubmitDiscount({billList,id: modalEditData.id})
			}else if(selectedAll){ // 选择全部
				onSubmitDiscount({billList,params:{}})
			}
		}

		const handleChangeStand = (value, record) => {
			if(value == undefined){
				record._disStandId = ''
				record._discount = getFormat(record.lastDeferred)
				record._disReason = record.disReason
			}else{
				record._disStandId = value
				let stand = disStandMap[value]
				record._discount = getFormat(stand.fee)
				record._disReason = stand.reason
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
    
    const handleAdd = () => {
      let dataSource = modalEditData.dataSource
      let temp = {subjectName:undefined,disStandId:undefined,_id:dataSource.length-1}
      if(modalEditData.feeBillLists&&modalEditData.feeBillLists.length == 1){
        temp.year = modalEditData.feeBillLists[0].year
        temp.missionId = modalEditData.feeBillLists[0].missionId
        temp.missionName = modalEditData.feeBillLists[0].missionName
        temp.subjectId = modalEditData.feeBillLists[0].subjectId
        temp.subjectName = modalEditData.feeBillLists[0].subjectName
      }
      dataSource[dataSource.length-1] = temp
      dataSource.push({_add:true})
      onUpdateState({modalEditData})
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
      for(let node of modalEditData.feeBillLists){
        if(node.missionId == value){
          record.year = node.year
          break
        }
      }
      record.missionId = value
      onUpdateState({modalEditData})
    }

    const handleChangeSubject = (value, record) => {
      if(record.subjectId != value){
        //清空其他数据
        record._disStandId = undefined
        record._discount = undefined
        record._disReason = undefined
      }
      record.subjectId = value
      onUpdateState({modalEditData})
    }

    const handleDelete = (record) => {
      let temp = []
      let i = 0
      for(let node of modalEditData.dataSource){
        if(node._id != record._id){
          node._id = i++
          temp.push(node)
        }
      }
      modalEditData.dataSource = temp
      onUpdateState({modalEditData})
    }

		const columns = [
			{
				title: "学年",
				dataIndex: "year",
				width: '10%',
				render: (text, record) => {
          if(record._add){
            return <a href="javascript:;" onClick={(e) => { handleAdd(record) }}><Icon type="plus" />添加</a>
          }
          if(text){
            return getYearFormat(text)
          }
          return ""
				}
			},{
				title: "收费任务",
				dataIndex: "missionName",
        width: '15%',
        render: (text, record) => {
          if(record._add){
            return ""
          }
					let options = []
          if(modalEditData.feeBillLists){
            let tempMap = {}
            for(let node of modalEditData.feeBillLists){
              if(tempMap[node.missionId]){
                continue
              }
              options.push(
                <Option key={node.missionId} value={node.missionId} title={node.missionName}>{node.missionName}</Option>
              )
              tempMap[node.missionId] = true
            }
          }
          return <Select placeholder={"选择任务"} style={{width:"100%"}} showSearch
            value={record.missionId} allowClear 
            optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            onChange={(value)=>handleChangeMission(value, record)}>{options}</Select>
				}
			},{
				title: "项目名称",
				dataIndex: "subjectName",
        width: '15%',
        render: (text, record) => {
          if(record._add){
            return ""
          }
          let options = []
          if(modalEditData.feeBillLists){
            for(let node of modalEditData.feeBillLists){
              if(node.missionId == record.missionId){
                options.push(
                  <Option key={node.subjectId} value={node.subjectId} title={node.subjectName}>{node.subjectName}</Option>
                )
              }
            }
          }
          return <Select placeholder={"选择项目"} style={{width:"100%"}} showSearch
            value={record.subjectId} allowClear disabled={!record.missionId}
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
					if(subjectMap[record.subjectId] && disStandMap){
						for(let index in disStandMap){
							if(record.subjectId == disStandMap[index].subjectId){
								options.push(
									<Option key={disStandMap[index].id} value={disStandMap[index].id} title={disStandMap[index].name}>{disStandMap[index].name}</Option>
								)
							}
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
				dataIndex: "discount",
				width: '12%',
				render: (text, record) => {
          if(record._add){
            return ""
          }
					return (
						<InputNumber style={{width:'100%'}} disabled={!record.subjectId||record._disStandId} value={record._discount==undefined?getFormat(record.discount):record._discount}
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
			onCancel={()=>{onClose()}}
			title={modalType=="batch"?"批量减免调整":"减免调整"}
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
				scroll={{y: 400,x:700}}
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