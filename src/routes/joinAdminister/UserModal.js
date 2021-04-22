import { Modal, Button, message, Row, InputNumber, Input, Spin, Checkbox, Table, Col, Switch, Cascader, Select } from "antd";
import { config, getFormat, getYearFormat } from 'utils'
import moment from 'moment'
import styles from '../common.less'

const Option = Select.Option
const UserModal = ({
	modalVisible, 
  modalData,
  userAttrMap,
  disabledAttr,
  departMap,
  departTree,
  year,
  user,
	onClose,
	onUpdateState,
  onGetUserAttrValue,
  onGetStructItemList,
  onGetSubjectByMissId,
  onSubmit
	}) => {
    //  建档入学
    const { attrMap, dataList, yearList, _enrol } = modalData
    const handleSubmit = () => {
      let param = {}
      let attrList = []
      let count = 0;

      for(let node of modalData.attrList){
        if(modalData._changeTemp[node.attrId]){
          let temp = {
            attrId: node.attrId,
          }
          if (userAttrMap[node.attrId].valueType == '2' || userAttrMap[node.attrId].valueType == '3') {
            temp.relateId = modalData._changeTemp[node.attrId]
          } else {
            temp.relateName = modalData._changeTemp[node.attrId]
          }
          attrList.push(temp)
          count++
        }else if(node.isRequired == '1'){
          message.error(userAttrMap[node.attrId].name+"为必填项")
          return
        }
      }
      param.attrList = attrList
      if(count == 0){
        return
      }
      if(user.joinBill != '1' || modalData._edit){
        let billList = []
        for(let node of dataList){
          if(node._status == '1' && (node._totalFee || node._discountFee || node._stand == '1' || node._position)){
            if(!_enrol && !node._position && node._stand != '1'){
              message.error("请填写冲抵顺序")
              return
            }
            let totalFee = null
            if(node._totalFee!=='' && node._totalFee!=undefined){
              totalFee = Math.round(node._totalFee*100).toString()
            }else{
              totalFee = undefined
            }
            billList.push({
              missionId: node.missionId,
              totalFee: totalFee,
              discount: node._discountFee?Math.round(node._discountFee*100).toString():'0',
              subjectId: node.subjectId,
              status: node._status,
              stand: node._stand,
              position: node._position.toString(),
            })
          }
        }
        if(billList.length != 0){
          param.billList = billList
        }
      }
      if(modalData.joinUserId){
        param.joinUserId = modalData.joinUserId
      }
      param.type = '1'
      onSubmit(param)
    }

    const handleClickAttrValueOption = (attr) => {
      onGetUserAttrValue({ id: attr.id })
    }

    const handleLoadData = (selectedOptions) => {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;
      onGetStructItemList(targetOption.id)
    }
    
    const handleChangeAttr = (attr, value) => {
      attr.idSelected = value
      modalData._changeTemp[attr.id] = value
      onUpdateState({modalData})
    }

    const handleChangeTemp = (attrId, value) => {
      if (value && [...value].length > 500) {
        Message.error('长度超过限制')
        return
      }
      modalData._changeTemp[attrId] = value
      onUpdateState({modalData})
    }

    const hanldeChangeDepart = (value) => {
      if(value.length == 0){
        //取消选择
        for(let index in attrMap){
          if(attrMap[index].valueType==3 || disabledAttr[index]){
            modalData._changeTemp[index] = ""
            attrMap[index]._displayValue = ""
          }
        }
        modalData._changeTemp['_departTree'] = value
        onUpdateState({modalData})
        return 
      }
      for(let index of value){
        if(index == '0'){
          continue
        }
        let depart = departMap[index]
        modalData._changeTemp[depart.attrId] = index
        if(attrMap[depart.attrId]){
          attrMap[depart.attrId]._displayValue = depart.label
        }
        if(depart.structItemAttrRelateMap){
          for(let attrId in depart.structItemAttrRelateMap){
            modalData._changeTemp[attrId] = depart.structItemAttrRelateMap[attrId].relateId?depart.structItemAttrRelateMap[attrId].relateId:depart.structItemAttrRelateMap[attrId].relateName
            if(attrMap[attrId]){
              attrMap[attrId]._displayValue = depart.structItemAttrRelateMap[attrId].relateName
            }
          }
        }
      }
      modalData._changeTemp['_departTree'] = value
      onUpdateState({modalData})
    }

    //  账单
    const handleStandChange = (record) => {
      if(record._stand != '1'){
				record._stand = '1';
			}else{
				record._stand = undefined
			}
			onUpdateState({modalData})
    }

    const handleChangePosition = (value, record) => {
      if(value >= modalData._count){
        modalData._count = value+1;
      }
      record._position = value
      onUpdateState({modalData})
    }

    const handleStatusChange = (record) => {
      if(record._status == '1'){
        record._status='0';
        record._stand = undefined
      }else{
        record._status='1';
        if(!record._position){
          record._position = modalData._count;
          modalData._count++;
        }
      }
      onUpdateState({modalData})
    }

    const handleTotalFeeChange = (record, value) => {
      record._totalFee = value
      onUpdateState({modalData})
    }

    const handleTotalFeeBlur = (record) => {
      if(!record._totalFee){
        record._totalFee = 0
      }
      record._totalFee = getFormat(Math.round(record._totalFee*100))
      onUpdateState({modalData})
    }

    const handleDiscountFeeChange = (record, value) => {
      record._discountFee = value
      onUpdateState({modalData})
    }

    const handleDiscountFeeBlur = (record) => {
      if(!record._discountFee){
        record._discountFee = 0
      }
      record._discountFee = getFormat(Math.round(record._discountFee*100))
      onUpdateState({modalData})
    }

    const handleAddEdit = () => {
      modalData._addEdit = !modalData._addEdit
      onUpdateState({modalData})
    }

    //  建档入学

    const createAttrValueOption = (attr) => {
      const options = []
      if (attr._select) {
        for (let select of attr._select) {
          options.push(<Option key={select.id} style={{ width: 'auto' }} value={select.id} title={select.value}>{select.value}</Option>)
        }
        return options
      }
      return null
    }

    const renderAttrValue = (formAttr) => {
        let attr = userAttrMap[formAttr.attrId]
        if (attr.valueType == '1') {
          // 文本
          return (
            <Input style={{width:'100%'}} value={modalData._changeTemp[attr.id]} placeholder={"请输入"+(userAttrMap[attr.id]?userAttrMap[attr.id].name:'')}  onChange={(e) => { handleChangeTemp(attr.id, e.target.value) }}/>
          )
        }else if(disabledAttr && disabledAttr[attr.id]){
          //被禁用
          return (<Input value={attrMap[attr.id]._displayValue} placeholder="请选择" disabled={true}/>)
        }else if (attr.valueType == '3') {
           //修改层级
          return (<Cascader style={{width:'100%'}} value={modalData._changeTemp['_departTree']} options={departTree} changeOnSelect={true}
            // displayRender={(label, value)=>{return value&&value.length>0&&disabledAttr[departMap[value[value.length-1].id].attrId]?"":label[label.length - 1]}}
            displayRender={(label, value)=>{return attrMap[attr.id]._displayValue}}
            placeholder={attrMap[attr.id]._displayValue?'':"请选择"}
            onChange={(value)=>{hanldeChangeDepart(value)}} loadData={handleLoadData}
          />)
        }
        // 值空间
        return (
          <Select style={{ width: '100%' }}
          value={modalData._changeTemp[attr.id]}
          allowClear
          showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          placeholder="请选择"
          notFoundContent={!attr._select ? <Spin size="small" /> : "无匹配"}
          onFocus={() => handleClickAttrValueOption(attr)}
          onChange={(value) => { handleChangeAttr(attr, value) }}
        >
          {createAttrValueOption(formAttr)}
        </Select>
        )
    }

    const renderAttr = () => {
      let list = []
      let i = 0
      for(let node of modalData.attrList){
        list.push(<Row key={i}>
          <Row style={{paddingTop:'20px'}}>
            <span style={{fontSize:'14px'}}>{i+1}.{userAttrMap[node.attrId]?userAttrMap[node.attrId].name:''}{node.isRequired=="1"?"(必填)":""}</span>
          </Row>
          <Row style={{marginTop:'10px'}}>
            {renderAttrValue(node)}
          </Row>
        </Row>)
        i++
      }
  
      return list
    }

    //  账单
    const createYearOption = () => {
      const options = [];
      if(yearList){
        for(let index of yearList){
          options.push(<Option key={index.year} value={index.year} title={getYearFormat(index.year)}>{getYearFormat(index.year)}</Option>)
        }
      }
      return options;
    }

    const columns = [
      {
        title: "学年",
        dataIndex: "year",
        width: '80px',
        render: (text, record) => {
					return getYearFormat(text)
				}
      },
      {
        title: "收费任务",
        dataIndex: "missionName",
        // width: '80px',
      },
      {
        title: "项目名称",
        dataIndex: "subjectName",
        width: '120px',
      },{
        title: "应收金额",
        dataIndex: "_totalFee",
        width: '80px',
        render: (text, record) => {
					if((user.isStand=='1' && user.isAdmin!='1') || (record._stand=='1' && record._status == '1')){
						//需要按照标准来设置
						return (<Input disabled={true} style={{width:'100%'}} defaultValue={"按照已有标准设置"} />)
					}
					return (
						<InputNumber disabled={record._status!='1'} min={0}
						 style={{width:'100%'}} value={record._totalFee} onChange={(value)=>handleTotalFeeChange(record, value)} onBlur={()=>handleTotalFeeBlur(record)}/>
					)
				}
      },
      {
        title: "减免金额",
        dataIndex: "_discount",
        width: '80px',
        render: (text, record) => {
					// if((user.isStand=='1' && user.isAdmin!='1') || (record._stand=='1' && record._status == '1')){
					// 	//需要按照标准来设置
					// 	return (<Input disabled={true} style={{width:'100%'}} defaultValue={"按照已有标准设置"} />)
					// }
					return (
						<InputNumber disabled={record._status!='1'} min={0}
						 style={{width:'100%'}} value={record._discountFee?record._discountFee:'0'} onChange={(value)=>handleDiscountFeeChange(record, value)} onBlur={()=>handleDiscountFeeBlur(record)} />
					)
				}
      },{
        title: "项目状态",
        dataIndex: "status",
        width: '60px',
        render: (text, record) => {return <Switch checked={record._status=='1'?true:false} onChange={()=>{handleStatusChange(record)}} />}
      },{
        title: "按标准设置",
        dataIndex: "stand",
        width: '60px',
        render: (text, record) => {return <Switch disabled={!record._status || record._status != '1'} checked={record._stand=='1'||(user.isStand=='1' && user.isAdmin!='1')} onChange={()=>{handleStandChange(record)}} />}
      },
    ]
    if(!_enrol && modalData.reservationFee && modalData.reservationFee != '0'){
      columns.push({
        title: "报名费冲抵顺序",
        dataIndex: "_position",
        width: '80px',
        render: (text, record) => {
          if(record._status == '1'){
            return <InputNumber style={{width:'100%'}} min={0} value={text} onChange={(value)=>handleChangePosition(value, record)}/>
          }else{
            return text
          }
        }
      })
    }

    return (//  需要获取是否是设置了自动生成账单
      <div>
        <Modal
        visible={modalVisible}
        onCancel={()=>{onClose()}}
        title={_enrol?"建档入学":'审核'}
        footer={null}
        width={'1200px'}
        height={'800px'}
        maskClosable={false}
        >
        <Row style={{overflow:'hiddle'}}>
          <Col span={6} style={{overflowY: 'scroll', height: '700px', paddingRight: '20px'}}>
            <Row style={{borderTop:'0',borderLeft:'0',borderRight:'0',textAlign:'center',fontSize:'22px'}}>
              <span>{modalData.title}</span>
            </Row>
            <Row style={{marginTop:'30px',textAlign:'center'}}>
              <span>{modalData.descr}</span>
            </Row>
              {renderAttr()}
            <Row>
            </Row>
          </Col>
          <Col span={1}></Col>
          <Col span={17}>
            {user.joinBill == '1' && <div style={{marginBottom: '20px', color: '#ff0000'}}>* 提示：已设置自动生成账单，如需更改，请点击
              {/* <Button size='small' type="primary" onClick={handleAddEdit} style={{marginLeft: '10px' }}>编辑</Button> */}
              <Checkbox style={{marginLeft:"10px"}} checked={modalData._addEdit} onChange={handleAddEdit}></Checkbox>
            </div>}
            <Row style={{ width: '100%', marginBottom: '20px' }}>
              {user.joinBill == '1' && !modalData._addEdit && <div style={{backgroundColor:"rgba(240, 242, 245, 0.5)", zIndex:800, position:'absolute', width:'100%', height:'100%', margin:'-10px'}}></div>}
              <div style={{overflow: 'hidden'}}>
                <div style={{float: 'left', paddingTop: '10px'}}>
                  <span style={{ borderLeft: '5px solid #1890ff', paddingLeft: '10px', fontSize: '18px',}}>应收账单</span>
                </div>
                <div className={styles.sortCol} style={{float: 'right', width: '300px',}}>
                  <div className={styles.sortText}>学年:</div>
                  <Select optionFilterProp="children" allowClear={true} value={year} className={styles.sortSelectMuti} placeholder={"选择学年"} onChange={onGetSubjectByMissId}>
                    {createYearOption()}
                  </Select>
                </div>
              </div>
              <div style={{width: '100%', height: '550px', marginBottom: '30px',}}>
                <Table
                  dataSource={dataList}
                  size="middle"
                  bordered
                  columns={columns}
                  pagination={false}
                  scroll={{y: 500,x:700}}
                  rowKey={record => record.id}
                />
              </div>
            </Row>
          </Col>
          <div style={{marginTop:'30px', textAlign:'center'}}>
            <Button style={{marginRight:'20px'}} onClick={onClose}>取消</Button>
            <Button type="primary" onClick={handleSubmit}>确定</Button>
          </div>
        </Row>
        </Modal>
      </div>
		)
		
}

export default UserModal