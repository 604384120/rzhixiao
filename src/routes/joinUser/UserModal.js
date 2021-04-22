import { Modal, Button, message, Row, InputNumber, Input, Spin, Icon, DatePicker, Upload,Popconfirm, Cascader, Select } from "antd";
import { config, getFormat, getYearFormat } from 'utils'
import moment from 'moment'

const Option = Select.Option
const UserModal = ({
	modalVisible, 
  modalData,
  userAttrMap,
  disabledAttr,
  departMap,
  departTree,
	onClose,
	onUpdateState,
  onGetUserAttrValue,
  onGetStructItemList,
  onSubmit
	}) => {
    const { attrMap } = modalData
    const handleSubmit = () => {
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
      if(count == 0){
        return
      }
      onSubmit({attrList})
    }
    
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
    
    const renderAttrValue = (formAttr) => {
        let attr = userAttrMap[formAttr.attrId]
        if (attr.valueType == '1') {
          // 文本
          return (
            <Input style={{width:'100%'}} placeholder={"请输入"+(userAttrMap[attr.id]?userAttrMap[attr.id].name:'')}  onChange={(e) => { handleChangeTemp(attr.id, e.target.value) }}/>
          )
        }else if(disabledAttr && disabledAttr[attr.id]){
          //被禁用
          return (<Input value={attrMap[attr.id]._displayValue} placeholder="请选择" disabled={true}/>)
        }else if (attr.valueType == '3') {
           //修改层级
          return (<Cascader style={{width:'100%'}} value={modalData._changeTemp['_departTree']} options={departTree} changeOnSelect={true}
            displayRender={(label, value)=>{return value&&value.length>0&&disabledAttr[departMap[value[value.length-1].id].attrId]?"":label[label.length - 1]}} placeholder="请选择"
            onChange={(value)=>{hanldeChangeDepart(value)}} loadData={handleLoadData}
          />)
        }
        // 值空间
        return (
          <Select style={{ width: '100%' }}
          //value={modalData._changeTemp[attr.id]}
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
            {/* {
              userAttrMap[node.attrId].valueType==1?<Input style={{width:'100%'}} placeholder={"请输入"+(userAttrMap[node.attrId]?userAttrMap[node.attrId].name:'')}/>:
              <Select style={{ width: '100%' }}
                value={node.idSelected}
                allowClear
                showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                placeholder="请选择"
                notFoundContent={!node._select ? <Spin size="small" /> : "无匹配"}
                onFocus={() => handleClickAttrValueOption(node)}
                onChange={(value) => { handleChangeAttr(node, value) }}
              >
                {createAttrValueOption(node)}
              </Select>
            } */}
            {renderAttrValue(node)}
          </Row>
        </Row>)
        i++
      }
  
      return list
    }

		return (
			<Modal
			visible={modalVisible}
			onCancel={()=>{onClose()}}
			title={"招生报名表"}
			footer={null}
			width={'600px'}
			maskClosable={false}
			>
      <div style={{maxWidth:'500px',margin:'auto'}}>
        <Row style={{borderTop:'0',borderLeft:'0',borderRight:'0',textAlign:'center',fontSize:'22px'}}>
          <span>{modalData.title}</span>
        </Row>
        <Row style={{marginTop:'30px',textAlign:'center'}}>
          <span>{modalData.descr}</span>
        </Row>
        {renderAttr()}
        <Row>
        </Row>
      </div>
			<div style={{marginTop:'30px', textAlign:'center'}}>
				<Button style={{marginRight:'20px'}} onClick={onClose}>取消</Button>
        <Button type="primary" onClick={handleSubmit}>确定</Button>
			</div>

			</Modal>
		)
		
}

export default UserModal