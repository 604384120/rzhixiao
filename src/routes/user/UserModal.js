import { Row, Modal, Button, Input, Select, Spin, Cascader, Message } from 'antd'
import styles from '../common.less'

const Option = Select.Option

const UserModal = ({
  modalVisible, modalData, modalType, tempTypeMap, typeMap, attrMap, disabledAttr,departTree,departMap, selectedUsers, selectedAll,
  onClose, onSubmit, onUpdateState, onGetUserAttrValue, onLoadStructItem, queryParam, count
}) => {
  const handleSelectAll = (attrList) => {
    const { sortList } = queryParam
    let tempList = []
    if (sortList && sortList.length > 0) {
      for (let sort of sortList) {
        if (sort._idSelected && sort._idSelected.length > 0) {
          let tempSort = {}
          tempSort.attrId = sort.id
          tempSort.relateName = ''
          for (let select of sort._idSelected) {
            tempSort.relateName += `${select},`
          }
          tempList.push(tempSort)
        }
      }
    }
    let depart = null
    if(queryParam.depart){
      //存在组织结构查询条件
      tempList.push(queryParam.depart)
      depart = queryParam.depart
    }
    delete queryParam.depart
    if (tempList && tempList.length>0) {
      queryParam.sortList = JSON.stringify(tempList)
    }else{
      delete queryParam.sortList
    }
    delete queryParam.pageSize
    delete queryParam.pageNum
    delete queryParam.version
    queryParam.count = count.toString()
    onSubmit({ attrList, params: JSON.stringify(queryParam)})
  }
  const handleSubmit = () => {
    let attrList = []
    let count = 0;
    for (let node in modalData) {
      if(!attrMap[node]){
        continue
      }
      let temp = {
        attrId: node,
      }
      if (attrMap[node].valueType == '2' || attrMap[node].valueType == '3') {
        temp.relateId = modalData[node]
      } else {
        temp.relateName = modalData[node]
      }
      attrList.push(temp)
      count++
    }
    if(count == 0){
      return
    }
    if(modalType == 'updateStruct'){
      if(!modalData['_departTree'] || modalData['_departTree'].length<=0){
        Message.error('请选择班级')
        return
      }
      if(!selectedAll){
        onSubmit({ attrList, id:selectedUsers.toString() })
      }else{
        handleSelectAll(attrList)
      }
    }else if(modalType == 'updateStatus'){
      for(let index in modalData){
        if(!modalData[index]){
          Message.error('请选择状态')
          return
        }
      }
      if(!selectedAll){
        onSubmit({ attrList, id:selectedUsers.toString() })
      }else{
        handleSelectAll(attrList)
      }
    }else{
      onSubmit({ attrList, id: '' })
    }
  }

  const handleChangeTemp = (attrId, value) => {
    modalData[attrId] = value
    onUpdateState({ modalData })
  }

  const hanldeChangeDepart = (value) => {
    if(value.length == 0){
      //取消选择
      for(let index in attrMap){
        if(attrMap[index].valueType == 3 || disabledAttr[index]){
          delete modalData[index]
          attrMap[index]._displayValue = ""
        }
      }
      // for(let attrId in disabledAttr){
      //   modalData[attrId] = ""
      //   attrMap[attrId]._displayValue = ""
      // }
      modalData['_departTree'] = value
      onUpdateState({ modalData })
      return 
    }
    // if(disabledAttr[departMap[value[value.length-1]].attrId]){
    //   //没选中任何的数据
    //   return 
    // }
    for(let index of value){
      if(index == '0'){
        continue
      }
      let depart = departMap[index]
      modalData[depart.attrId] = index
      attrMap[depart.attrId]._displayValue = depart.label
      if(depart.structItemAttrRelateMap){
        for(let attrId in depart.structItemAttrRelateMap){
          modalData[attrId] = depart.structItemAttrRelateMap[attrId].relateId?depart.structItemAttrRelateMap[attrId].relateId:depart.structItemAttrRelateMap[attrId].relateName
          attrMap[attrId]._displayValue = depart.structItemAttrRelateMap[attrId].relateName
        }
      }
    }

    modalData['_departTree'] = value
    onUpdateState({ modalData })
  }

  const handleLoadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    onLoadStructItem(targetOption)
  }

  const handleClickAttrValueOption = (attr) => {
    onGetUserAttrValue({ id: attr.id })
  }

  const createAttrValueOption = (attr) => {
    const options = []
    if (attrMap[attr.id]) {
      const selectList = attrMap[attr.id]._select
      if (selectList) {
        for (let select of selectList) {
          options.push(<Option key={select.id} style={{ width: 'auto' }} value={select.id} title={select.value}>{select.value}</Option>)
        }
        return options
      }
    }
    return null
  }

  if(modalType == 'updateStruct'){
    return (
      <Modal
        visible={modalVisible}
        onCancel={() => { onClose() }}
        maskClosable={false}
        title="批量修改班级"
        width="450px"
        footer={<Button type="primary" onClick={() => { handleSubmit() }}>保存</Button>}
      >
        <div>
          <div style={{display: 'inline-block'}}>转入班级:</div>
          <Cascader style={{marginLeft:'10px', width:'320px',display: 'inline-block'}} value={modalData['_departTree']} options={departTree[0].children} placeholder="请选择班级"
            onChange={hanldeChangeDepart} loadData={handleLoadData}
          />
        </div>
  
      </Modal>)
  }else if(modalType == 'updateStatus'){
    const createStaus = () => {
      for(let id in attrMap){
        if(attrMap[id].name == '学生状态'){
          let attr = attrMap[id]
          return (
            <div>
              <div style={{display: 'inline-block'}}>学生状态:</div>
              <Select style={{ marginLeft:'10px', width:'320px',display: 'inline-block' }}
              value={modalData[attr.id]}
              showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              placeholder="请选择"
              notFoundContent={!attrMap[attr.id] || !attrMap[attr.id]._select ? <Spin size="small" /> : "无匹配"}
              onFocus={() => handleClickAttrValueOption(attr)}
              onChange={(value) => { handleChangeTemp(attr.id, value) }}
            >
              {createAttrValueOption(attr)}
            </Select>
            </div>
          )
        }
      }
    }
    return (
      <Modal
        visible={modalVisible}
        onCancel={() => { onClose() }}
        maskClosable={false}
        title="批量修改状态"
        width="450px"
        footer={<Button type="primary" onClick={() => { handleSubmit() }}>保存</Button>}
      >
        {createStaus()}
      </Modal>)
  }

  const createAttrValue = (type, attr) => {
    if (attr.valueType == '1') {
      // 文本
      return (
        <Input value={modalData[attr.id]} placeholder="请输入" onChange={(e) => { handleChangeTemp(attr.id, e.target.value) }} />
      )
    }else if(disabledAttr[attr.id]){
      //被禁用
      return (<Input value={attrMap[attr.id]._displayValue} placeholder="请选择" disabled={true}/>)
    }else if (attr.valueType == '3') {
      //修改层级
      return (<Cascader style={{width:'100%'}} value={modalData['_departTree']} options={departTree[0].children} changeOnSelect={true}
        displayRender={(label, value)=>{return value&&value.length>0&&disabledAttr[departMap[value[value.length-1].id].attrId]?"":label[label.length - 1]}} placeholder="请选择"
        onChange={hanldeChangeDepart} loadData={handleLoadData}
      />)
    }
    // 值空间
    return (
      <Select style={{ width: '100%' }}
        value={modalData[attr.id]}
        allowClear
        showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        placeholder="请选择"
        notFoundContent={!attrMap[attr.id] || !attrMap[attr.id]._select ? <Spin size="small" /> : "无匹配"}
        onFocus={() => handleClickAttrValueOption(attr)}
        onChange={(value) => { handleChangeTemp(attr.id, value) }}
      >
        {createAttrValueOption(attr)}
      </Select>
    )
  }

  const createAttr = (type) => {
    const attrs = []
    let list = tempTypeMap[type].list
    if (list) {
		  for (let i = 0; i < list.length; i += 2) {
        attrs.push(<tr key={list[i].id}>
          <td className={styles.userInfoAttrTD}>{list[i].name}</td><td className={styles.userInfoAttrValueTD}>
            {createAttrValue(type, list[i])}
          </td>
          <td className={styles.userInfoAttrTD}>{i + 1 >= list.length ? '' : list[i + 1].name}</td><td className={styles.userInfoAttrValueTD}>
            {i + 1 >= list.length ? '' : createAttrValue(type, list[i + 1])}
          </td>
        </tr>)
		  }
    }
    return attrs
  }

  const createAttrGroup = () => {
    const groups = []
    for (let type in tempTypeMap) {
      groups.push(<div style={{ marginBottom: '20px' }} key={type}>
        <Row style={{ borderLeft: '5px solid #1890ff', paddingLeft: '10px', marginBottom: '10px' }}><span style={{ fontSize: '18px', marginRight: '10px' }}>{typeMap[type]}</span>
        </Row>
        <Row>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {createAttr(type)}
            </tbody>
          </table>
        </Row>
      </div>)
    }
    return groups
  }

  return (
    <Modal
      visible={modalVisible}
      onCancel={() => { onClose() }}
      maskClosable={false}
      title="添加学生"
      width="840px"
      footer={<Button type="primary" onClick={() => { handleSubmit() }}>保存</Button>}
    >
      <div style={{ height: '600px', width: '800px', overflowY: 'scroll' }}>
        {createAttrGroup()}
      </div>

    </Modal>)
}

export default UserModal
