import { Modal, Button, message, Table, InputNumber, Input, Switch, Row, Col, Divider, Tag, DatePicker, Select, Icon, Checkbox } from "antd";
import { getFormat, getYearFormat } from 'utils'
import moment from 'moment'

const Option = Select.Option
const UserBillModal = ({
	modalVisible, 
	modalPayType,
  modalPayTime,
  modalPayRate,
	modalType,
	subjectMap,
	defStandMap,
	disStandMap,
  missionCurrent,
  missionList,
	user,
	userCurrent,
	payTypeList,
	gotoUser,
	...tableProps,
	onClose,
	onUpdateState,
	onUpdateData,
	onCompleteOrder,
	onCompleteOrderReturn,
  onUpdateBills,
	onConvertOrder,
	onChangeGotoUser,
	}) => {
		const {dataSource} = tableProps;
		const handleClose = () => {
			//重置所有项目
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
			onUpdateState({modalData: dataSource})
		}
		if(modalType <=2 ){
			//收费、退费
			let totalFee = 0;
      let remainFee = 0;
      let rateFee = 0;
      let finalFee = 0;
			if(dataSource){
				for(let subject of dataSource){
					if(modalType == 1){
						if(subject._fee == undefined){
							if(subject.isRequired=='0'){
								subject._fee = 0
							}else{
                subject._fee = subject.arrears
                if(subject.defPast!='1' && subject.deferred){
                  subject._fee -= subject.deferred
                }
                if(subject._fee < 0){
                  subject._fee = 0
                }else{
                  subject._fee = getFormat(subject._fee)
                }
							}
						}
						totalFee += parseFloat(subject._fee);
            remainFee += subject.arrears-Math.round(subject._fee*100);
					}else{
						if(subject._refundFee == undefined){
							subject._refundFee = 0;
						}
						totalFee += parseFloat(subject._refundFee);
						remainFee += subject.arrears+Math.round(subject._refundFee*100);
					}
					
        }
        if(modalType == 1 && modalPayRate){
          finalFee = totalFee / (1 - modalPayRate/100)
          rateFee = finalFee - totalFee
        }else{
          finalFee = totalFee
        }
			}
			function DX(n) {
				if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
					return "数据非法";
				if(n==0){
					return "零"
				}
				var unit = "千百拾亿千百拾万千百拾元角分", str = "";
					n += "00";
				var p = n.indexOf('.');
				if (p >= 0)
					n = n.substring(0, p) + n.substr(p+1, 2);
					unit = unit.substr(unit.length - n.length);
				for (var i=0; i < n.length; i++)
					str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
				return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
			}
			const handleTotalFeeChange = (value, record) => {
				if(!value){
					value = 0
				}
				let fee = value;
				// let totalFee = parseFloat(record.arrears);
				// if(fee*100 > totalFee){
				// 	message.error("输入金额不能大于欠费金额");
				// 	return
				// }
				const target = dataSource.filter(item => record.id === item.id)[0];
				if (target) {
					target._fee = fee;
				}
				onUpdateData(dataSource)
			}
			const handleRefundFeeChange = (value, record) => {
				if(!value){
					value = 0
				}
				let fee = value;
				const target = dataSource.filter(item => record.id === item.id)[0];
				if (target) {
					target._refundFee = fee;
				}
	
				onUpdateData(dataSource)
			}
			const handleCancel = () => {
				onUpdateState({modalData:[], modalVisible: false})
			}
			const handleSubmit = () => {
				if(modalType == 1){
					onCompleteOrder(dataSource, modalPayType, modalPayTime, rateFee?Math.round(rateFee*100).toString():undefined)
				}else{
					//退款默认只有现金
					onCompleteOrderReturn(dataSource, modalPayType, modalPayTime)
				}
				
			}
			const handleChagePayType = (type) => {
        modalPayRate = 0
        for(let node of payTypeList){
          if(node.payType == type){
            modalPayRate = node.rate?parseFloat(node.rate):0
            break
          }
        }
				onUpdateState({modalPayType: type, modalPayRate})
			}
			const handleChangePayDate = (value, dateString) => {
				onUpdateState({modalPayTime: dateString})
			}
			const columns = [
				{
					title: "项目编号",
					dataIndex: "subCode",
					width: '100',
				},
				{
					title: "收费项目",
					dataIndex: "subjectName",
					width: '100',
					render: (text, record) => {return text+(record.isRequired=='0'?"(选缴)":"")}
				},{
					title: "应收金额",
					dataIndex: "totalFee",
					width: '100',
					render: (text, record) => {return getFormat(text)}
				},{
					title: "减免金额",
					dataIndex: "discount",
					width: '100',
					render: (text, record) => {return getFormat(text)}
				},{
					title: "收费金额",
					dataIndex: "paidFee",
					width: '100',
					render: (text, record) => {return getFormat(text)}
				},{
					title: "退费金额",
					dataIndex: "refund",
					width: '100',
					render: (text, record) => {return getFormat(text)}
				},{
					title: "欠费金额",
					dataIndex: "arrears",
					width: '100',
					render: (text, record) => {return getFormat(text)}
        },{
					title: "缓缴金额",
					dataIndex: "deferred",
					width: '100',
					render: (text, record) => {return record.defPast=='1'?'0':getFormat(record.deferred)}
        },{
					title: modalType==1?"本次实收":"本次实退",
					dataIndex: "fee2",
					width: '100',
					render: (text, record) => {
						return (
							modalType==1?
							<InputNumber  min={0} step={0.01} value={record._fee} onChange={(value)=>{handleTotalFeeChange(value, record)}}/>
							:<InputNumber min={0} step={0.01} value={record._refundFee} onChange={(value)=>{handleRefundFeeChange(value, record)}}/>
						)
					}
				},{
					title: "剩余欠费",
					dataIndex: "fee3",
					width: '100',
					render: (text, record) => {
            if(modalType==1){
              let num = record.arrears-Math.round(record._fee*100)
              return <span style={{color:num<0?"red":""}}>{getFormat(num)}</span>
            }else{
              return getFormat(record.arrears+Math.round(record._refundFee*100))
            }
					}
				},
			]
	
			const renderTags = () => {
				let tags = [];
				//if(modalType == 1){
					for (let payType of payTypeList) {
            if(payType.code || payType.status=='2'){
              continue
            }
						tags.push(
							<Tag id={payType.payType} color={(payType.code)?'#d2d2d2':modalPayType==payType.payType?'#108ee9':''} onClick={(payType.code)?undefined:()=>{handleChagePayType(payType.payType)}}>{payType.name}</Tag>
						)
					}
				// }else{
				// 	tags.push(
				// 		<Tag color={'#108ee9'} >现金</Tag>
				// 	)
				// }
				
				return tags;
			}
	
			return (
				<Modal
				visible={modalVisible}
				onCancel={()=>{onClose()}}
				title={(modalType==1?"收费(":"退费(")+missionCurrent.name+'  '+getYearFormat(missionCurrent.year)+")"}
				footer={null}
				width={'1000px'}
				maskClosable={false}
				>
				<Row style={{marginBottom:"20px", textAlign:"center"}}>
					<Col span={12}>
					<div>收费日期:<DatePicker 
						format="YYYY-MM-DD HH:mm:ss"
						showTime
						value={moment(modalPayTime)}
						onChange={handleChangePayDate}
						style={{width:'60%', marginLeft:'10px'}}/></div>
					</Col>
					<Col span={12}>
					<div>经办人:<Input
						style={{width:'60%', marginLeft:'10px'}}
						value={user.name}
						disabled={true}
					/></div>
					</Col>
				</Row>
				<Table
					{...tableProps}
					bordered
					columns={columns}
					pagination={false}
					scroll={{x:600}}
					rowKey={record => record.id}
				  />
				<Row style={{height:'52px',backgroundColor:'#e6f7ff', padding:'10px 10px'}}>
					<div style={{marginTop:'5px', paddingLeft:'10px', display:'inline-block', width:'718px'}}><span>合计(大写)：</span><span style={{fontSize: '16px', marginLeft:'5px', fontWeight: 'bold'}}>{DX(getFormat(Math.round(totalFee*100)))}</span></div>
					<div style={{marginTop:'6px',display:'inline-block', width:'130px', textAlign:'center',fontSize: '16px',color:'orange'}}>{getFormat(Math.round(totalFee*100))}</div>
					<div style={{marginTop:'6px',display:'inline-block', width:'84px', textAlign:'center',fontSize: '16px',color:'orange'}}>{getFormat(remainFee)}</div>
				</Row>
        {
          modalType==1&&modalPayRate!=0&&<div>
          <Row style={{height:'52px', padding:'10px 10px'}}>
          <div style={{marginTop:'5px', paddingLeft:'10px', display:'inline-block', width:'718px'}}><span>手续费：</span></div>
          <div style={{marginTop:'6px',display:'inline-block', width:'130px', textAlign:'center',fontSize: '16px'}}>{getFormat(Math.round(rateFee*100))}</div>
          </Row>
          <Row style={{height:'52px',backgroundColor:'#e6f7ff', padding:'10px 10px'}}>
            <div style={{marginTop:'5px', paddingLeft:'10px', display:'inline-block', width:'718px'}}><span>总计(大写)：</span><span style={{fontSize: '16px', marginLeft:'5px', fontWeight: 'bold'}}>{DX(getFormat(Math.round(finalFee*100)))}</span></div>
            <div style={{marginTop:'6px',display:'inline-block', width:'130px', textAlign:'center',fontSize: '16px',color:'orange'}}>{getFormat(Math.round(finalFee*100))}</div>
          </Row>
          </div>
        }
				<Input style={{marginTop:'20px',}} size="large" allowClear placeholder="请输入备注信息" maxLength={200} onChange={(e)=>onUpdateState({remark:e.target.value})} />
				<Row style={{padding:'10px 0', marginTop:'20px', textAlign:'right'}}>
					支付方式：
					{renderTags()}
				</Row>
				<Row style={{padding:'10px 10px'}}>
					<Divider style={{ margin: '5px', marginBottom:"20px" }} dashed />
					{modalType==2&&<Checkbox checked={gotoUser} onChange={onChangeGotoUser}>同时修改学生信息</Checkbox>}
					<Button type="primary" size='small' style={{float:'right'}} onClick={handleSubmit}>确定</Button>
					<Button size='small' style={{float:'right', marginRight:'10px'}} onClick={handleCancel}>取消</Button>
				</Row>
				</Modal>
			)
		}else if(modalType == 3){
			//应收调整
			const handleSubmit = () => {
				let tempArr = []
				for(let record of dataSource){
          let totalFee = ''
          if(record._totalFee!=='' && record._totalFee!=undefined){
            totalFee = Math.round(record._totalFee*100).toString()
          }else{
            totalFee = undefined
          }
        
					if(totalFee == record.totalFee && record._reason == record.reason && record._status==record.status && !record._stand){
						continue;
					}else if(record._add && record._status == '0'){
						continue;
					}
					if(subjectMap[record.subjectId] && subjectMap[record.subjectId].subType=="2"){
						//跳过学分学费
						continue
          }
					tempArr.push({
						missionId: missionCurrent.id,
						totalFee: (record._stand=='1'||(user.isStand=='1' && user.isAdmin!='1'))?'':totalFee,
						reason: record._reason?record._reason:'',
						subjectId: record.subjectId,
						status: record._status,
					})
				}
				if(tempArr.length <= 0){
					//未做任何改变
					onClose()
					return
				}
				onUpdateBills({billList:JSON.stringify(tempArr),userId:userCurrent.id})
			}
			const handleStatusChange = (record) => {
				if(record._status == '1'){
					record._status='0';
				}else{
					record._status='1';
				}
				onUpdateData(dataSource)
			}
			const handleStandChange = (record) => {
				if(record._stand != '1'){
					record._stand = '1';
				}else{
					record._stand = undefined
				}
				onUpdateData(dataSource)
      }
      const handlEditFeeChange = (record, value) => {
        record._editFee = value
				onUpdateData(dataSource)
      }
      const handleEditFeeBlur = (record) => {
        if(!record._editFee){
          record._editFee = 0
        }
        record._totalFee = getFormat(parseInt(record.totalFee) + Math.round(record._editFee*100))
        onUpdateData(dataSource)
      }
      const handlTotalFeeChange = (record, value) => {
        record._totalFee = value
				onUpdateData(dataSource)
      }
      const handleTotalFeeBlur = (record) => {
        if(!record._totalFee){
          record._totalFee = 0
        }
        record._editFee = getFormat(Math.round(record._totalFee*100) - parseInt(record.totalFee))
        onUpdateData(dataSource)
      }
			const columns = [
				{
					title: "学年",
					dataIndex: "year",
					width: '10%',
					render: (text, record) => {
						return getYearFormat(missionCurrent.year)
					}
				},{
					title: "收费任务",
					dataIndex: "missionName",
					width: '10%',
					render: (text, record) => {
						return missionCurrent.name
					}
				},{
					title: "项目名称",
					dataIndex: "subjectName",
					width: '10%',
				},{
					title: "原应收金额",
					dataIndex: "totalFee",
					width: '10%',
					render: (text, record) => {return getFormat(text)}
				},{
					title: "调整金额",
					dataIndex: "editTotalFee",
					width: '10%',
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
					dataIndex: "distTotalFee",
					width: '10%',
					render: (text, record) => {
						if((user.isStand=='1' && user.isAdmin!='1') || record._stand=='1'){
							//需要按照标准来设置
							return (<Input disabled={true} style={{width:'100%'}} defaultValue={"按照已有标准设置"} />)
						}
						return (
							<InputNumber disabled={(record._status!='1'||(subjectMap[record.subjectId]&&subjectMap[record.subjectId].subType=="2"))} 
							style={{width:'100%'}} value={record._totalFee} onChange={(value)=>handlTotalFeeChange(record, value)} onBlur={()=>handleTotalFeeBlur(record)}/>
						)
					}
				},{
					title: "调整原因",
					dataIndex: "disReason",
					width: '18%',
					render: (text, record) => {
						return (
							<Input disabled={(record._status!='1'||(subjectMap[record.subjectId]&&subjectMap[record.subjectId].subType=="2"))} 
							style={{width:'100%'}} defaultValue={text} onChange={(e)=>{record._reason=e.target.value}}/>
						)
					}
				},{
					title: "项目状态",
					dataIndex: "status",
					width: '10%',
					render: (text, record) => {return  <Switch disabled={subjectMap[record.subjectId]&&subjectMap[record.subjectId].subType=="2"} checked={record._status=='1'?true:false} onChange={()=>{handleStatusChange(record)}} />}
				},{
					title: "按标准设置",
					dataIndex: "stand",
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
					{...tableProps}
					bordered
					columns={columns}
					pagination={false}
					scroll={{y: 400,x:800}}
					rowKey={record => record.id}
				  />
				<div style={{padding:'10px 10px', marginTop:'10px'}}>
					<Button type="primary" size='small' style={{float:'right'}} onClick={handleSubmit}>确定</Button>
					<Button size='small' style={{float:'right', marginRight:'10px'}} onClick={onClose}>取消</Button>
				</div>
				</Modal>
			)
		}else if(modalType == 4){
			//减免调整
			const handleSubmit = () => {
        let tempArr = []
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
					tempArr.push({
						missionId: missionCurrent.id,
						discount,
						disReason: record._disReason,
						subjectId: record.subjectId,
						disStandId: record._disStandId,
          })
				}
				if(tempArr.length <= 0){
					//未做任何改变
					onClose()
					return
        }
				onUpdateBills({billList:JSON.stringify(tempArr),userId:userCurrent.id})
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
				onUpdateState({modalData: dataSource})
      }
      const handleAdd = () => {
        dataSource[dataSource.length-1] = {subjectName:undefined,disStandId:undefined,_id:dataSource.length-1}
        dataSource.push({_add:true})
        onUpdateState({modalData: dataSource})
      }
      const handleChangeSubject = (value, record) => {
        if(record.subjectId != value){
          //清空其他数据
          record._disStandId = undefined
          record._discount = undefined
          record._disReason = undefined
        }
        record.subjectId = value
        onUpdateState({modalData: dataSource})
      }
      const handleDelete = (record) => {
        let temp = []
        let i = 0
        for(let node of dataSource){
          if(node._id != record._id){
            node._id = i++
            temp.push(node)
          }
        }
        onUpdateState({modalData: temp})
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
						return getYearFormat(missionCurrent.year)
					}
				},{
					title: "收费任务",
					dataIndex: "missionName",
					width: '10%',
					render: (text, record) => {
            if(record._add){
              return ""
            }
						return missionCurrent.name
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
            if(missionCurrent.feeBillLists){
              for(let node of missionCurrent.feeBillLists){
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
					dataIndex: "editDiscount",
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
					title: "调整原因",
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
				title={"减免调整"}
				footer={null}
				width={'1000px'}
				maskClosable={false}
				>
	
				<Table
					{...tableProps}
					bordered
					columns={columns}
					pagination={false}
					scroll={{y: 400,x:900}}
					rowKey={record => record.id}
				  />
				<div style={{padding:'10px 10px', marginTop:'10px'}}>
					<Button type="primary" size='small' style={{float:'right'}} onClick={handleSubmit}>确定</Button>
					<Button size='small' style={{float:'right', marginRight:'10px'}} onClick={onClose}>取消</Button>
				</div>
				</Modal>
			)
		}else if(modalType == 5){
			//缓缴调整
			const handleSubmit = () => {
				let tempArr = []
				for(let record of dataSource){
					if(record._deferred==undefined && record._defReason==undefined && record._defTimeEnd==undefined){
						continue
					}
					let defTimeEnd = record._defTimeEnd!=undefined?(record._defTimeEnd?record._defTimeEnd.format('YYYY-MM-DD HH:mm:ss'):''):(record.defTimeEnd==null?undefined:record.defTimeEnd)
          let deferred = ''
          if(record._deferred!=='' && record._deferred!=undefined){
            deferred = Math.round(record._deferred*100).toString()
          }else if(record._deferred == undefined){
            deferred = Math.round(record.deferred).toString()
          }
          
					if(deferred == '0'){
						defTimeEnd = "";
					}else if(!defTimeEnd || !deferred){
						message.error('请输入正确的金额和结束时间')
						return
					}
					tempArr.push({
						missionId: missionCurrent.id,
						deferred,
						defReason: record._defReason!=undefined?record._defReason:(record.defReason==null?undefined:record.defReason),
						subjectId: record.subjectId,
						defTimeEnd,
						defStandId: record._defStandId!=undefined?record._defStandId:(record.defStandId==null?undefined:record.defStandId),
					})
				}
				if(tempArr.length == 0){
					handleClose()
					return
				}
				onUpdateBills({billList:JSON.stringify(tempArr),userId:userCurrent.id})
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
				onUpdateState({modalData: dataSource})
			}
			
			const columns = [
				{
					title: "学年",
					dataIndex: "year",
					width: '10%',
					render: (text, record) => {
						return getYearFormat(missionCurrent.year)
					}
				},{
					title: "收费任务",
					dataIndex: "missionName",
					width: '10%',
					render: (text, record) => {
						return missionCurrent.name
					}
				},{
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
				},{
					title: "缓缴金额",
					dataIndex: "deferredEdit",
					width: '11%',
					render: (text, record) => {
						return (
							<InputNumber style={{width:'100%'}} disabled={record._defStandId} min={0} value={record._deferred==undefined?getFormat(record.deferred):record._deferred}
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
				onCancel={()=>{handleClose()}}
				title={modalType=="batch"?"批量缓缴调整":"缓缴调整"}
				footer={null}
				width={'1200px'}
				maskClosable={false}
				>
	
				<Table
					{...tableProps}
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
		}
    else if(modalType == 6){
      //结转
      const handleSubmit = () => {
        if(!dataSource.srcData.id){
          message.error("请选择结转的项目")
          return
        }

        if(!dataSource.dstData.id){
          message.error("请选择转入的项目")
          return
        }

        if(!dataSource.convertFee){
          message.error("请输入结转金额")
          return
        }

        onConvertOrder({exportBillId: dataSource.srcData.id, importBillId: dataSource.dstData.id, 
          fee: Math.round(dataSource.convertFee*100).toString()})
      }
      const handleClose = () => {
        onClose()
      }
      const handleConvertFee = (value) => {
        dataSource.convertFee = value
        onUpdateState()
      }
      const handleChangeSrcSubject = (value, record) => {
        if(value){
          for(let node of missionCurrent.feeBillLists){
            if(node.id == value){
              dataSource.srcData = {...node}
              break;
            }
          }
        }else{
          dataSource.srcData = {}
        }
        onUpdateState()
      }
      const columnsSrc = [
				{
					title: "学年",
					dataIndex: "year",
					width: '10%',
					render: (text, record) => {
						return getYearFormat(missionCurrent.year)
					}
				},{
					title: "收费任务",
					dataIndex: "missionName",
					width: '15%',
					render: (text, record) => {
						return missionCurrent.name
					}
				},{
					title: "收费项目",
					dataIndex: "subjectName",
          width: '15%',
          render: (text, record) => {
            let options = []
            if(missionCurrent.feeBillLists){
              for(let node of missionCurrent.feeBillLists){
                if(node.id != dataSource.dstData.id){
                  options.push(
                    <Option key={node.id} value={node.id} title={node.subjectName}>{node.subjectName}</Option>
                  )
                }
              }
            }
            return <Select placeholder={"选择项目"} style={{width:"100%",maxWidth:"145px"}} showSearch
              value={record.id} allowClear
              optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={(value)=>handleChangeSrcSubject(value, record)}>{options}</Select>
					}
				},{
					title: "应收金额",
					dataIndex: "totalFee",
					width: '10%',
					render: (text, record) => {
            if(!record.id){
              return ""
            }
            return getFormat(text)
          }
				},{
					title: "减免金额",
					dataIndex: "discount",
					width: '10%',
					render: (text, record) => {
            if(!record.id){
              return ""
            }
            return getFormat(text)
          }
				},{
					title: "收费金额",
					dataIndex: "paidFee",
					width: '10%',
					render: (text, record) => {
            if(!record.id){
              return ""
            }
            return getFormat(text)
          }
				},{
					title: "退费金额",
					dataIndex: "refund",
					width: '10%',
					render: (text, record) => {
            if(!record.id){
              return ""
            }
            return getFormat(text)
          }
				},{
					title: "欠费金额",
					dataIndex: "arrears",
					width: '10%',
          render: (text, record) => {
            if(!record.id){
              return ""
            }
            return getFormat(text)
          }
				},{
					title: "缓缴金额",
					dataIndex: "deferred",
					width: '10%',
					render: (text, record) => {
            if(!record.id){
              return ""
            }
            return getFormat(text)
          }
				},
      ]
      const handleChangeDstMission = (value, record) => {
        if(value){
          for(let node of missionList){
            if(node.id == value){
              dataSource.dstData = {
                _feeBillLists: node.feeBillLists,
                missionId: value,
                year: node.year
              }
              if(node.feeBillLists && node.feeBillLists.length==1 && node.feeBillLists[0].id!=dataSource.srcData.id){
                Object.assign(dataSource.dstData, {...node.feeBillLists[0]})
              }
              break;
            }
          }
        }else{
          dataSource.dstData = {}
        }
        onUpdateState()
      }
      const handleChangeDstSubject = (value, record) => {
        if(value){
          for(let node of dataSource.dstData._feeBillLists){
            if(node.id == value){
              Object.assign(dataSource.dstData, {...node})
              break;
            }
          }
        }else{
          dataSource.dstData = {
            _feeBillLists: dataSource.dstData._feeBillLists,
            missionId: dataSource.dstData.missionId,
            year: dataSource.dstData.year
          }
        }
        onUpdateState()
      }
      const columnsDst = [
				{
					title: "学年",
					dataIndex: "year",
					width: '10%',
					render: (text, record) => {
            if(record.missionId){
              return getYearFormat(record.year)
            }else{
              return ""
            }
					}
				},{
					title: "收费任务",
					dataIndex: "missionName",
					width: '15%',
					render: (text, record) => {
            let options = []
            if(missionList){
              for(let node of missionList){
                options.push(
                  <Option key={node.id} value={node.id} title={node.name}>{node.name}</Option>
                )
              }
            }
            return <Select placeholder={"选择任务"} style={{width:"100%",maxWidth:"145px"}} showSearch
              value={record.missionId} allowClear
              optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={(value)=>handleChangeDstMission(value, record)}>{options}</Select>
					}
				},{
					title: "收费项目",
					dataIndex: "subjectName",
          width: '15%',
          render: (text, record) => {
            let options = []
            if(record._feeBillLists){
              for(let node of record._feeBillLists){
                if(node.id != dataSource.srcData.id){
                  options.push(
                    <Option key={node.id} value={node.id} title={node.subjectName}>{node.subjectName}</Option>
                  )
                }
              }
            }
            return <Select placeholder={"选择项目"} style={{width:"100%",maxWidth:"145px"}} showSearch
              value={record.id} allowClear disabled={!record.missionId}
              optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={(value)=>handleChangeDstSubject(value, record)}>{options}</Select>
					}
				},{
					title: "应收金额",
					dataIndex: "totalFee",
					width: '10%',
					render: (text, record) => {
            if(!record.id){
              return ""
            }
            return getFormat(text)
          }
				},{
					title: "减免金额",
					dataIndex: "discount",
					width: '10%',
					render: (text, record) => {
            if(!record.id){
              return ""
            }
            return getFormat(text)
          }
				},{
					title: "收费金额",
					dataIndex: "paidFee",
					width: '10%',
					render: (text, record) => {
            if(!record.id){
              return ""
            }
            return getFormat(text)
          }
				},{
					title: "退费金额",
					dataIndex: "refund",
					width: '10%',
					render: (text, record) => {
            if(!record.id){
              return ""
            }
            return getFormat(text)
          }
				},{
					title: "欠费金额",
					dataIndex: "arrears",
					width: '10%',
          render: (text, record) => {
            if(!record.id){
              return ""
            }
            return getFormat(text)
          }
				},{
					title: "缓缴金额",
					dataIndex: "deferred",
					width: '10%',
					render: (text, record) => {
            if(!record.id){
              return ""
            }
            return getFormat(text)
          }
				},
      ]
      return <Modal
				visible={modalVisible}
				onCancel={()=>{onClose()}}
				title={"结转（"+missionCurrent.name+'  '+getYearFormat(missionCurrent.year)+")"}
				footer={null}
				width={'1200px'}
				maskClosable={false}
				>
        <Row>结转的项目:</Row>
        <Table
          dataSource={[dataSource.srcData]}
          bordered
          columns={columnsSrc}
          pagination={false}
          scroll={{x:700}}
          rowKey={record => record.id}
        />
        <div style={{position:'absolute',left:'730px', top:'228px'}}>
          <img src="arrowdown.png" style={{width:'70px'}}/>
          <div style={{color:"#46baff",position:'absolute',top:'25px',left:'50%',marginLeft:'-13px'}}>结转</div>
        </div>
        <div style={{position:'absolute',left:'805px', top:'248px'}}>
          <InputNumber placeholder="请输入结转金额" min={0} style={{width:'120px',borderColor:'#46baff'}} value={dataSource.convertFee} onChange={handleConvertFee}/>
        </div>
        <Row style={{marginTop:'60px'}}>转入的项目:</Row>
        <Table 
          dataSource={[dataSource.dstData]}
          bordered
          columns={columnsDst}
          pagination={false}
          scroll={{x:700}}
          rowKey={record => record.id}
        />
        <div style={{padding:'10px 10px', marginTop:'10px'}}>
          <Button type="primary" size='small' style={{float:'right'}} onClick={handleSubmit}>确定</Button>
          <Button size='small' style={{float:'right', marginRight:'10px'}} onClick={handleClose}>取消</Button>
				</div>
        </Modal>
    }

		return ''
	
}

export default UserBillModal