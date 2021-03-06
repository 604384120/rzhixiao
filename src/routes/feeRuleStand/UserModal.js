import { Row, Modal, Button, InputNumber, Select, Spin, Table, Icon } from 'antd'
import { getFormat, getYearFormat } from 'utils'

const Option = Select.Option

const UserModal = ({
  modalVisible, modalData, modalType, userAttrList, attrId, attrName,
  onGetAttrValueList, onUpdateFeeRule,
  onGetUserAttrList, onClose, onUpdateState,onUpdateFeeRuleAttr,
}) => {
  
  if(modalType == 'fee'){
    const handleCancel = () => {
			modalData.relateList = undefined
			onUpdateState({modalData, modalVisible: false})
		}

		const handleSubmit = () => {
      let tempArr = []
			for(let record of modalData.relateList){
        if(record._add == 1 || !record.relateId || (record._add==2&&!record._fee)){
          continue
        }
				if((!modalData.itemList||modalData.itemList.length==1) && record._fee==undefined){
					continue
        }
        let fee = (record._fee||record._fee===0)?Math.round(record._fee*100).toString():""
        if(record._fee==undefined){
          fee = (record.fee||record.fee===0)?Math.round(record.fee*100).toString():""
        }
        tempArr.push({
					subjectId: record.subjectId,
          fee,
          relateId: record.relateId!='0'?record.relateId:undefined,
          item: modalData.itemList.toString(),
          year:record.year,
          structId: record.structId
				})
			}
			if(tempArr.length == 0){
				onClose()
				return
			}
			onUpdateFeeRule({param:tempArr})
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
				title: "??????",
				dataIndex: "year",
				width: '10%',
				render: (text, record) => {
          if(record._add == 1){
            return <a href="javascript:;" onClick={(e) => { handleAdd(record) }}><Icon type="plus" />??????</a>
          }
					return getYearFormat(text)
				}
			},{
				title: "????????????",
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
              placeholder="?????????"
              notFoundContent={!modalData._attrValueList ? <Spin size="small" /> : "?????????"}
              onFocus={() => onGetAttrValueList()}
              onChange={(value)=>handleChangeRelateId(record, value)}
            >
              {createRelateOption(record)}
            </Select>
          }else if(record.relateId == '0'){
            return <span style={{fontWeight:'500'}}>????????????</span>
          }else{
            return text
          }
        }
      })
    }
    columns.push({
      title: "????????????",
      dataIndex: "fee",
      width: '12%',
      render: (text, record) => {
        if(record._add == 1){
          return ""
        }else{
          return (
            <InputNumber style={{width:'100%'}} min={0} value={record._fee==undefined?record.fee:record._fee}
            onChange={(value)=>handleChangeTemp(value, "_fee", record)}/>
          )
        }
      }
    })
		return (
			<Modal
			visible={modalVisible}
			onCancel={()=>{onClose()}}
			title={"????????????"}
			footer={null}
			width={'800px'}
			maskClosable={false}
			>
      <div style={{overflow:'hidden', overflowX:'auto'}}>
			<Table
				dataSource={modalData.relateList}
        bordered
        size='middle'
				columns={columns}
				pagination={false}
        scroll={{y: 400}}
        style={{minWidth:'600px'}}
				//rowKey={record => record.id}
	    />
      </div>
			<div style={{padding:'10px 10px', marginTop:'10px'}}>
				<Button type="primary" size='small' style={{float:'right'}} onClick={handleSubmit}>??????</Button>
				<Button size='small' style={{float:'right', marginRight:'10px'}} onClick={handleCancel}>??????</Button>
			</div>

			</Modal>
		)
  }
  else if(modalType == 'attr'){
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
          options.push(<Option key={select.id} style={{ width: 'auto' }} value={select.id} title={select.name}>{select.name}</Option>)
        }
        return options
      }
      return null
    }
    const createAttrSelect = () => {
      return (
        <div>
          <Row>
            <div style={{display: 'inline-block'}}>????????????:</div>
            <Select style={{ marginLeft:'10px',width:'75%',display: 'inline-block' }}
              value={modalData['attrId']}
              showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              placeholder="?????????"
              notFoundContent={!userAttrList ? <Spin size="small" /> : "?????????"}
              onFocus={() => onGetUserAttrList()}
              onChange={handleChangeAttrId}
            >
              {createAttrOption()}
            </Select>
          </Row>
          <Row style={{marginTop:'10px', color:'red', textAlign:'center', fontSize:'12px'}}>*?????????????????????????????????????????????????????????????????????</Row>
        </div>
      )
    }
    return (
      <Modal
        visible={modalVisible}
        onCancel={() => { onClose() }}
        maskClosable={false}
        title="??????????????????"
        width="450px"
        footer={<Button type="primary" onClick={() => { handleSubmitAttr() }}>??????</Button>}
      >
        {createAttrSelect()}
      </Modal>)
  }
}

export default UserModal
