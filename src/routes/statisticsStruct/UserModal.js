import { Row, Col, Modal, Button, Divider, Table, Select, Checkbox, DatePicker } from "antd";
import { getFormat,getYearFormat } from 'utils'
import { UserStatusSelect, UserSortLayer } from 'components'
import styles from '../common.less'
import moment from 'moment'

const { Option } = Select
const RangePicker = DatePicker.RangePicker;

const UserModal = ({
	modalData, modalVisible, 
	yearList, missionList, subjectList, 
	beginDate, endDate,// index的时间值
	user,
	onClose,
	onUpdateState,
	onGetDataList,
	onChangeDate,
	}) => {
		if(!modalData){
			return
		}

		const genMissionName= () => {
			let str = ""
			let missionId = modalData.missionId
			if(missionId && missionId.length>0){
				str = "";
				for(let n of missionList){
					if(missionId.indexOf(n.id)>=0){
						if(str) str += ";"
						str += n.name
					}
				}
				str = "任务名称：" + str
			}else{
				str = "";
				let year = modalData.year
				for(let n of year){
					if(str) str += ";"
					str += getYearFormat(n)
				}
				str = "学年：" + str
			}
			return str
		}
		
		const genFee = (first) =>{
			let tr = "";
			if(first.id != "__total"){
				tr += "<td>"+first.name+"</td>"
			}
			tr += "<td>"+getFormat(first.totalFee)+"元 "+(modalData.type==1?first.totalFeeCount+"人":'')
			tr += "</td><td>"+getFormat(first.discount)+"元 "+(modalData.type==1?first.discountCount+"人":'')
			tr += "</td><td>"+getFormat(first.paidFee)+"元 "+(modalData.type==1?first.paidFeeCount+"人":'')
			tr += "</td><td>"+getFormat(first.refund)+"元 "+(modalData.type==1?first.refundCount+"人":'')
			tr += "</td><td>"+getFormat(first.arrears)+"元 "+(modalData.type==1?first.arrearsCount+"人":'')+"</td>"
			return tr
		}
	
		const genTable = () => {
			let head = "<thead><tr>";
			head += "<td>项目名称</td><td>年级</td><td>应收金额</td><td>减免金额</td><td>收费金额</td><td>退费金额</td><td>欠费金额</td></tr></thead>";
			let body = "";
			for(let n of modalData.dataList){
				let tr = "<tr>";
				let span = n.gradeList.length
				if(n.id == "__total"){
					tr += "<td style='text-align:center' rowspan="+span+" colSpan=2>"+n.subjectName+"</td>"
				}else{
					tr += "<td rowspan="+span+">"+n.subjectName+"</td>"
				}
				
				tr += genFee(n.gradeList[0]) + "</tr>"
				for(let i=1; i<span; i++){
					tr += "<tr>"
					tr += genFee(n.gradeList[i]) + "</tr>"
				}
				body += tr
			}
			return "<table border='1px solid #ccc' cellspacing='0' cellpadding='0' style='width:100%'>"+head+"<tbody>"+body+"</tbody></table>"
		}
	
		const handlePrint = () => {
			var iframe=document.getElementById("print-iframe");
			if(iframe) document.body.removeChild(iframe);
			var el = "<div style='text-align:center;font-size:20px'>"+user.schoolName+modalData.info.name+"统计报表</div>";
			el += "<div style='height:20px;margin-top:40px'><span style='float:left'>" + genMissionName() + "</span><span style='float:right'>统计时间："+ beginDate +"~"+ endDate +"</span></div>";
			el += "<div style='margin:5px 0 5px 0'>" + genTable() + "</div>"
			el += "<div><span style='float:left'>打印人:"+user.name+"</span><span style='float:right'>打印时间:"+moment().format('YYYY-MM-DD HH:mm:ss')+"</span></div>"
			//window.document.body.innerHTML=el
			iframe = document.createElement('IFRAME');
			var doc = null;
			iframe.setAttribute("id", "print-iframe");
			iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
			document.body.appendChild(iframe);
			doc = iframe.contentWindow.document;
			doc.write("<div>" + el + "</div>");
			doc.close();
			iframe.contentWindow.focus();
			iframe.contentWindow.print();
		}

		const handleChangeYear = (value) => {
			modalData.year = value
			onUpdateState({modalData})
		}
		const handleChangeUserStatus = (value) => {
			modalData.userStatus = value
			onUpdateState({modalData})
		}
		const createYearOption = () => {
			const options = [];
			for(let index of yearList){
				options.push(<Option key={index.year} value={index.year} title={getYearFormat(index.year)}>{getYearFormat(index.year)}</Option>)
			}
			return options;
		}
		const handleChangeMission = (value) => {
			modalData.missionId = value
			onUpdateState({modalData})
		}
		const createMissionOption = () => {
			const options = [];
			for(let index of missionList){
				options.push(<Option key={index.id} value={index.id} title={index.name}>{index.name}</Option>)
			}
			return options;
		}
		const handleChangeSubject = (value) => {
			modalData.subjectId = value
			onUpdateState({modalData})
		}
		const createSubjectOption = () => {
			const options = [];
			for(let index of subjectList){
				options.push(<Option key={index.id} value={index.id} title={index.name}>{index.name}</Option>)
			}
			return options;
		}
		const handleQueryData = () => {
			onGetDataList({
				year: modalData.year,
				missionId: modalData.missionId,
				subjectId: modalData.subjectId,
				structId: modalData.info.structId,
				structItemId: modalData.info.id,
				type: modalData.type,
				userStatus: modalData.userStatus,
				beginDate: modalData.beginDate,
				endDate: modalData.endDate,
			})
		}
		const handleResetQuery = () => {
			delete modalData.year
			delete modalData.missionId
			delete modalData.subjectId
			onUpdateState({modalData})
		}
		
		const handleChangeType = (e) => {
			onGetDataList({
				year: modalData.year,
				missionId: modalData.missionId,
				subjectId: modalData.subjectId,
				structId: modalData.info.structId,
				structItemId: modalData.info.id,
				type:e.target.checked?'1':'0',
				userStatus: modalData.userStatus,
				beginDate: modalData.beginDate,
				endDate: modalData.endDate,
			})
		}

		const createSort = () => {
			let i = 0
			const list = [
				{
					id:i++,
					content:(
						<div className={styles.sortCol}>
							<div className={styles.sortTextW}>日期:</div>
									<RangePicker
										disabled={modalData.dataLoading}
										showTime={{ format: 'HH:mm:ss',defaultValue:[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}}
										defaultValue={[modalData.beginDate?moment(modalData.beginDate):'', modalData.endDate?moment(modalData.endDate):'']}
										disabledDate={current=>{return current && (current < moment(beginDate) || current > moment(endDate))}}
										format="YYYY-MM-DD HH:mm:ss" 
										placeholder={['开始时间', '结束时间']}
										onChange={onChangeDate}
										style={{width: 'calc(100% - 100px)'}}
									/>
						</div>
					),
					length: 2,
				},{
				id:i++,
				content:(
				  <div className={styles.sortCol}>
					<div className={styles.sortText}>学生状态:</div>
					<UserStatusSelect disabled={modalData.dataLoading} value={modalData.userStatus} className={styles.sortSelectMuti} placeholder={"选择学生状态"} onChange={handleChangeUserStatus} />
				  </div>
				),
			  },{
				id:i++,
				content:(
				  <div className={styles.sortCol}>
					<div className={styles.sortText}>学年:</div>
					<Select disabled={modalData.dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={modalData.year} className={styles.sortSelectMuti} placeholder={"选择学年"} onChange={handleChangeYear}>
					{createYearOption()}
					</Select>
				  </div>
				)
			  },{
				id:i++,
				content:(
				  <div className={styles.sortCol} >
					<div className={styles.sortText}>任务名称:</div>
					<Select disabled={modalData.dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={modalData.missionId} className={styles.sortSelectMuti} placeholder={"选择任务"} onChange={handleChangeMission}>
					{createMissionOption()}
					</Select>
				  </div>
				)
			  },{
				id:i++,
				content:(
				  <div className={styles.sortCol} >
					<div className={styles.sortText}>项目名称:</div>
					<Select disabled={modalData.dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={modalData.subjectId} className={styles.sortSelectMuti} placeholder={"选择项目"} onChange={handleChangeSubject}>
						{createSubjectOption()}
					</Select>
				  </div>
				)
			  }
			]
			return list
		  }
		
		  const layerProps = {
			list: createSort(),
			query:(<div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', float:'right' }}>
				<Button disabled={modalData.dataLoading} onClick={handleQueryData} style={{ marginRight: '10px' }}>统计</Button>
				<Button disabled={modalData.dataLoading} onClick={handleResetQuery} style={{ marginRight: '30px' }}>重置</Button>
			</div>),
		  }
		const columns = [];
		const columnsName = [
			{dataIndex: "name", width: '100px'},
			{dataIndex: "totalFee", width: '100px', render: (text, record) => {return <div>{getFormat(text)}
				<Row className={styles.peopleNums}>{modalData.type=='1'?(record.totalFeeCount+'/人'):''}</Row></div>}},
			{dataIndex: "discount", width: '100px', render: (text, record) => {return <div>{getFormat(text)}
				<Row className={styles.peopleNums}>{modalData.type=='1'?(record.discountCount+'/人'):''}</Row></div>}},
			{dataIndex: "paidFee", width: '100px', render: (text, record) => {return <div>{getFormat(text)}
				<Row className={styles.peopleNums}>{modalData.type=='1'?(record.paidFeeCount+'/人'):''}</Row></div>}},
			{dataIndex: "refund", width: '100px', render: (text, record) => {return <div>{getFormat(text)}
				<Row className={styles.peopleNums}>{modalData.type=='1'?(record.refundCount+'/人'):''}</Row></div>}},
			{dataIndex: "arrears", width: '100px', render: (text, record) => {return <div>{getFormat(text)}
				<Row className={styles.peopleNums}>{modalData.type=='1'?(record.arrearsCount+'/人'):''}</Row></div>}},
		]
		columns.push({
			title: "项目名称",
			dataIndex: "subjectName",
			width: '100px',
			render: (text, record) => {
				if(record.id == '__total'){
					return {
						children: text,
						props: {
							colSpan: 2,
						},
					}
				}
				return text
			}
		})
		columns.push({
			title: "年级",
			dataIndex: "gradeList",
			width: '100px',
			render: (text, record) => {
				if(record.id == '__total'){
					return {
						props: {
							colSpan: 0,
						},
					};
				}
				return {
					children: record.gradeList&&record.gradeList.length>0?<Table
						dataSource={record.gradeList}
						size="middle"
						columns={columnsName}
						bordered
						showHeader={false}
						pagination={false}
						style={{width:'100%'}}
						/>:'',
					props: {
						colSpan: 6,
						className:styles.childTablePanel,
						style:{padding:'0'}
					},
				};
			}
		})
		columns.push({
			title: "应收金额",
			dataIndex: "totalFee",
			width: '100px',
			render: (text, record) => {
				if(record.id == '__total'){
					record = record.gradeList[0]
					return <div>{getFormat(record.totalFee)}
					<Row className={styles.peopleNums}>{modalData.type=='1'?(record.totalFeeCount+'/人'):''}</Row></div>
				}
				return {
					props: {
					  colSpan: 0,
					},
				};
			}
		})
		columns.push({
			title: "减免金额",
			dataIndex: "discount",
			width: '100px',
			render: (text, record) => {
				if(record.id == '__total'){
					record = record.gradeList[0]
					return <div>{getFormat(record.discount)}
					<Row className={styles.peopleNums}>{modalData.type=='1'?(record.discountCount+'/人'):''}</Row></div>
				}
				return {
					props: {
					  colSpan: 0,
					},
				};
			}
		})
		columns.push({
			title: "收费金额",
			dataIndex: "paidFee",
			width: '100px',
			render: (text, record) => {
				if(record.id == '__total'){
					record = record.gradeList[0]
					return <div>{getFormat(record.paidFee)}
				<Row className={styles.peopleNums}>{modalData.type=='1'?(record.paidFeeCount+'/人'):''}</Row></div>
				}
				return {
					props: {
					  colSpan: 0,
					},
				};
			}
		})
		columns.push({
			title: "退费金额",
			dataIndex: "refund",
			width: '100px',
			render: (text, record) => {
				if(record.id == '__total'){
					record = record.gradeList[0]
					return <div>{getFormat(record.refund)}
					<Row className={styles.peopleNums}>{modalData.type=='1'?(record.refundCount+'/人'):''}</Row></div>
				}
				return {
					props: {
					  colSpan: 0,
					},
				};
			}
		})
		columns.push({
			title: "欠费金额",
			dataIndex: "arrears",
			width: '100px',
			render: (text, record) => {
				if(record.id == '__total'){
					record = record.gradeList[0]
					return <div>{getFormat(record.arrears)}
					<Row className={styles.peopleNums}>{modalData.type=='1'?(record.arrearsCount+'/人'):''}</Row></div>
				}
				return {
					props: {
					  colSpan: 0,
					},
				};
			}
		})
		return (
			<Modal
			visible={modalVisible}
			onCancel={()=>{onClose()}}
			title="查看明细"
			footer={null}
			width={'1100px'}
			maskClosable={false}
			>
				<div style={{minHeight:'400px'}}>
					<UserSortLayer {...layerProps}/>
					<Divider style={{margin:'10px'}} />
					<Row style={{textAlign:'center',fontSize:'18px',fontWeight:'bolder',marginBottom:'10px'}}>{modalData.info.name}收费明细</Row>
					<Row style={{ marginBottom:'10px',textIndent:'20px' }}>
						<Button style={{textIndent: 'initial'}} onClick={handlePrint}>打印</Button>
						<Checkbox disabled={modalData.dataLoading} checked={modalData.type=='1'} onChange={handleChangeType}>显示人数统计</Checkbox>
					</Row>
					<Row><Table
						dataSource={modalData.dataList}
						size="middle"
						bordered
						columns={columns}
						pagination={false}
						loading={modalData.dataLoading}
						className={styles.fixedTable}
						scroll={{x:700}}
						/>
					</Row>
				</div>
			</Modal>
		)
}

export default UserModal