import { Modal, Button, Row, Form, InputNumber,Table, Select, Progress, Spin, Icon } from 'antd'

const Option = Select.Option

const FeeRuleModal = ({
  modalVisible,
  ModalType,
  modalData,
  missionInfo,
  userAttrList,
  cgNum,
  attrId,
  attrName,
  onClose,
  onGetUserAttrList,
  onUpdateState,
  onUpdateFeeRuleAttr,
  onGetAttrValueList,
  onUpdateFeeRule,
}) => {
  if (ModalType == 'addbill') {
    return (
    <Modal
        visible={modalVisible}
        onCancel={() => { onClose() }}
        title={cgNum!=100?"账单生成中":"账单生成成功"}
        footer={null}
        width="300px"
        maskClosable={false}
        closable={cgNum!=100?false:true}
        >
        <div style={{width: '40%',margin: 'auto', textAlign:'center'}}> <Progress type="circle" percent={cgNum} width={80} /></div>
        </Modal>
    )
  }else if(ModalType == 'attr'){
    const handleSubmitAttr = () => {
      const attr = userAttrList.filter(_=>_.id===modalData['attrId'])[0]
      onUpdateFeeRuleAttr({attrId: attr['id'], attrName:attr['name']})
    }
    const handleChangeAttrId = (value) => {
      modalData.attrId = value
      onUpdateState({modalData})
    }
    const createAttrOption = () => {
      const options = []
      if (userAttrList) {
        for (let select of userAttrList) {
          if(select.valueType == '2'){
            options.push(<Option key={select.id} style={{ width: 'auto' }} value={select.id} title={select.name}>{select.name}</Option>)
          }
        }
        return options
      }
      return null
    }
    const createAttrSelect = () => {
      return (
        <div>
          <Row>
            <div style={{display: 'inline-block'}}>选择字段:</div>
            <Select style={{ marginLeft:'10px', width:'calc(100% - 68px)',display: 'inline-block' }}
              value={modalData['attrId']}
              showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              placeholder="请选择"
              notFoundContent={!userAttrList ? <Spin size="small" /> : "无匹配"}
              onFocus={() => onGetUserAttrList()}
              onChange={handleChangeAttrId}
            >
              {createAttrOption()}
            </Select>
          </Row>
          <Row style={{marginTop:'10px', color:'red', textAlign:'center', fontSize:'12px'}}>*提示：设置字段后将无法修改</Row>
        </div>
      )
    }
    return (
      <Modal
        visible={modalVisible}
        onCancel={() => { onClose() }}
        maskClosable={false}
        title="添加设置方式"
        width="450px"
        footer={<Button type="primary" onClick={() => { handleSubmitAttr() }}>保存</Button>}
      >
        {createAttrSelect()}
      </Modal>)
  }
  const handleCancel = () => {
    modalData.relateList = undefined
    onUpdateState({modalData, modalVisible: false})
  }

  const handleSubmit = () => {
    let tempArr = []
    for(let record of modalData.relateList){
      if(record._disabled){
        continue
      }
      if(record._add == 1 || !record.relateId || (record._add==2&&!record._fee)){
        continue
      }
      if((!modalData.itemList||modalData.itemList.length==1) && record._fee==undefined){
        continue
      }
      let fee = (record._fee||record._fee===0)?Math.round(record._fee*100).toString():undefined
      if(record._fee==undefined){
        fee = (record.fee||record.fee===0)?Math.round(record.fee*100).toString():undefined
      }
      if(fee == undefined){
        continue
      }
      tempArr.push({
        subjectId: record.subjectId,
        fee,
        relateId: record.relateId!='0'?record.relateId:undefined,
        item: modalData.itemList.toString(),
        missionId: missionInfo.id,
        structId: record.structId,
      })
    }
    if(tempArr.length == 0){
      onClose()
      return
    }
    onUpdateFeeRule(tempArr)
  }

  const handleChangeTemp = (value, key, record) => {
    if(value==undefined){
      record[key] = ''
    }else{
      record[key] = value
    }
    onUpdateState({modalData})
  }
  
  const handleAdd = (record) => {
    record._add = 2
    modalData.relateList.push({
     ...record,
     fee: 0,
     relateId: undefined,
     relateName: undefined,
     _add:1
    })
    onUpdateState({modalData})
  }

  const handleChangeRelateId = (record, value) => {
    record.relateId = value
    modalData.relateMap[value] = record
    onUpdateState({modalData})
  }

  const createRelateOption = (record) => {
    const options = []
    if (modalData._attrValueList) {
      for (let select of modalData._attrValueList) {
        if(select.id==record.relateId || !modalData.relateMap[select.id]){
          options.push(<Option key={select.id} style={{ width: 'auto' }} value={select.id} title={select.value}>{select.value}</Option>)
        }
      }
      return options
    }
    return null
  }

  const columns = [
    {
      title: "收费任务",
      dataIndex: "missionName",
      width: '10%',
      render: (text, record) => {
        if(record._add == 1){
          return <a href="javascript:;" onClick={(e) => { handleAdd(record) }}><Icon type="plus" />添加</a>
        }
        return missionInfo.name
      }
    },{
      title: "收费项目",
      dataIndex: "subjectName",
      width: '10%',
      render: (text, record) => {
        if(record._add == 1){
          return ""
        }
        return text
      }
    },
  ]
  if(attrId){
    columns.push({
      title: attrName,
      dataIndex: "relateName",
      width: '15%',
      render: (text, record) => {
        if(record._add == 1){
          return ""
        }else if(record._add == 2){
          return <Select style={{ width:'100%' }}
            value={record.relateId}
            showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            placeholder="请选择"
            notFoundContent={!modalData._attrValueList ? <Spin size="small" /> : "无匹配"}
            onFocus={() => onGetAttrValueList()}
            onChange={(value)=>handleChangeRelateId(record, value)}
          >
            {createRelateOption(record)}
          </Select>
        }else if(record.relateId == '0'){
          return <span style={{fontWeight:'500'}}>默认标准</span>
        }else{
          return text
        }
      }
    })
  }
  columns.push({
    title: "收费标准",
    dataIndex: "fee",
    width: '12%',
    render: (text, record) => {
      if(record._add == 1){
        return ""
      }else{
        return (
          <InputNumber style={{width:'100%'}} min={0} value={record._fee==undefined?record.fee:record._fee} disabled={record._disabled}
          onChange={(value)=>handleChangeTemp(value, "_fee", record)}/>
        )
      }
    }
  })
  return (
    <Modal
    visible={modalVisible}
    onCancel={()=>{onClose()}}
    title={"设置标准(已设置标准的项不会生效，请在应收调整中调整金额)"}
    footer={null}
    width={'800px'}
    maskClosable={false}
    >

    <Table
      dataSource={modalData.relateList}
      bordered
      size='middle'
      columns={columns}
      pagination={false}
      scroll={{y: 400}}
      //rowKey={record => record.id}
    />
    <div style={{padding:'10px 10px', marginTop:'10px'}}>
      <Button type="primary" size='small' style={{float:'right'}} onClick={handleSubmit}>确定</Button>
      <Button size='small' style={{float:'right', marginRight:'10px'}} onClick={handleCancel}>取消</Button>
    </div>

    </Modal>
  )

}

export default Form.create()(FeeRuleModal)
