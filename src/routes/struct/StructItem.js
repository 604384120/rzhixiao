import { Table, Cascader, Pagination, Divider, Popconfirm, Input, Select } from 'antd'
import styles from '../common.less'
import { TableCom } from 'components'

const Option = Select.Option

const StructItem = ({
  count, pageNum, pageSize, structItemList, structSelected, structList, attrList, dataLoading,
  departMap, departTree,
	onUpdateDataSource, onChangePage,  onDelete, onAdd, onUpdate,
}) => {
  if (!structSelected) { return (<div />) }

  const handleChangePage = (num, size) => {
    onChangePage(num == 0 ? 1 : num, size)
  }

  const handleChangeSize = (current, size) => {
    onChangePage(current == 0 ? 1 : current, size)
  }

  const handleEidt = (record) => {
    record._editable = true
    onUpdateDataSource(structItemList)
  }

  const handleCancel = (record) => {
    record._editable = false
    if (record._add) {
      structItemList.splice(0, 1)
    }
    delete record._name
    delete record._attrTemp
    delete record._depart
    onUpdateDataSource(structItemList)
  }

  const handleSave = (record) => {
    if (record._add) {
      onAdd(record)
    } else {
      if(!record._name && !record._attrTemp && !record._depart) {
        handleCancel(record)
        return
      }
      onUpdate(record)
    }
  }

  const handleDelete = (record) => {
    onDelete(record)
  }

  const handleChangeName = (value, record) => {
    record._name = value
    onUpdateDataSource(structItemList)
  }

  const createAttrValueOption = (attr, record) => {
    const options = []
    const selectList = attr.userAttrValueEntities
    if (selectList) {
		  for (let select of selectList) {
        options.push(<Option key={select.id} style={{ width: 'auto' }} value={select.id} title={select.value}>{select.value}</Option>)
		  }
		  return options
    }
    return null
  }

  const handleChangeAttrValue = (attr, value, record) => {
    if(!record._attrTemp){
      record._attrTemp = {}
    }
    record._attrTemp[attr.attrId] = value
    onUpdateDataSource(structItemList)
  }

  const showItemName = (struct, text, record) => {
    if(record._depart && record._depart[struct._position]){
      //????????????????????????
      return departMap[record._depart[struct._position]].label
    }
    return text
  }

  const hanldeChangeDepart = (value, record) => {
    if(value.length == 0){
      //????????????
      record._depart = value
      onUpdateDataSource(structItemList)
      return
    }
    if(value.length != structSelected._pid._position+1){
      //????????????????????????
      return 
    }
    record._depart = value
    onUpdateDataSource(structItemList)
  }

  const getFixed = () => {
    let width = document.body.clientWidth
    if (width > 769) {
      width -= 540
    }
    if (num + 1 > width / 100) {
      return 'right'
    }
    return ''
  }

  const columns = []
  let num = 0
  for (let struct of structList) {
    // ???????????????????????????????????????????????????
    if (struct.id == structSelected.id) {
      num += 1
      columns.push({
        title: struct.label,
        dataIndex: 'name',
        width: 100,
        render: (text, record) => {
          return (
            <div>
              {record._editable ?<Input style={{ margin: '-5px 0' }} defaultValue={text} onChange={(e) => { handleChangeName(e.target.value, record) }} />
							: text
						  }
            </div>
          )
        },
      })
      break
    }
    if (struct.status == '1') {
      num += 1
      columns.push({
        title: struct.label,
        dataIndex: struct.id,
        width: 100,
        render: (text, record) => {
          if(record._editable){
            if(struct.id == structSelected._pid.id){
               //????????????????????????
              return <Cascader style={{width:'100%',  textAlign:'left'}} value={record._depart?record._depart:record.depart} options={departTree[0].children} 
                displayRender={(label)=>{return label[label.length - 1]}} placeholder="?????????"
                onChange={(value)=>{hanldeChangeDepart(value, record)}}/>
            }else{
              return <Input style={{ margin:'-5px 0 0 -5px', width: '100%' }} 
                value={showItemName(struct, text, record)} disabled={true} placeholder="?????????"/>
            }
          }
          return text
        },
      })
    }
  }

  if (attrList) {
    for (let attr of attrList) {
      // ????????????????????????
      num += 1
      columns.push({
        title: attr.attrName,
        dataIndex: `attrId_${attr.attrId}`,
        width: 100,
        render: (text, record) => {
          return (
            <div>
              {
              record._editable ?<Select style={{ margin: '-5px 0 0 -5px', width: '100%' }} showSearch optionFilterProp="children"
                value={(record._attrTemp&&record._attrTemp[attr.attrId])?record._attrTemp[attr.attrId]:text} 
                onChange={(value) => {handleChangeAttrValue(attr, value, record)}}>
                {createAttrValueOption(attr, record)}
              </Select>
							: text
						}
            </div>
          )
        },
      })
    }
  }

  columns.push({
    title: '??????',
    dataIndex: 'id',
    width: 100,
    fixed: getFixed(),
    render: (text, record) => {
      return (
        <div>
          {
						record._editable ?
            <div>
              <a onClick={() => handleSave(record)}>??????</a>
              <Divider type="vertical" />
              <a onClick={() => handleCancel(record)}>??????</a>
            </div>
						:<div>
              <a onClick={() => handleEidt(record)}>??????</a>
              <Divider type="vertical" />
              <Popconfirm title="????????????????????????????????????" onConfirm={() => handleDelete(record)} okText="??????" cancelText="??????"><a>??????</a></Popconfirm>
            </div>
					}
        </div>
      )
    },
  })
  return (
    <div>
      <TableCom
        dataSource={structItemList}
        size="middle"
        columns={columns}
        bordered
        rowKey={record => record.id}
        loading={dataLoading}
        pagination={false}
        scroll={{ x: num*100 }}
        className={styles.structItemTable}
      />
      {count > 0 ? <Pagination style={{ float: 'right', marginTop: '20px' }} current={pageNum} defaultPageSize={pageSize} onShowSizeChange={handleChangeSize} showSizeChanger showQuickJumper onChange={handleChangePage} total={count} showTotal={count => `??? ${count} ???`} /> : ''}
    </div>
  )
}

export default StructItem
