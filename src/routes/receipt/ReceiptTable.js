import { Table, Select, Badge, Divider, Input } from 'antd';

const ReceiptTable = ({
  templateList, menuMap, onDesignTemp, 
  onUpdataState, onCancel, onEdit, onSave, onShowModal
}) => {
  const onChange = (value, record) => {
    const target = templateList.filter(item => record.id === item.id)[0];
    if (target) {
      target.status = value;
        onUpdataState({templateList});
    }
	}

  const handleDesign = (record) => {
    onDesignTemp(record)
  }


  const handleEdit = (record) => {
    onEdit(record)
  }

  const handleCancel = (record) => {
    onCancel(record)
  }

  const handleShowModal = (visible,text,record) => {
    onShowModal (visible,text,record)
  }
  
  const handleSaveMe = (record) => {
    // const data = { ...record }
    // if (data.code) { data.code = data._change.code }
    // if (data.name) { data.name = data._change.name }
    // if (data.digits) { data.digits = data._change.digits }
    // if (data.numRelates) { data.numRelates = data._change.numRelates }
    // if (data.numCopies) { data.numCopies = data._change.numCopies }
    // console.log(data)
    onSave(record)
  }

  const changeValue = (record, key, e) => {
    record._change[key] = e.target.value
  }

  const getFixed = () => {
		let width = document.body.clientWidth
    if (width > 769) {
      width -= 304
		}
    if (width <= 730) {
      return 'right'
    }
    return ''
  }

  const columns = [{
    title: '票据代码',
    dataIndex: 'code',
    key: 'code',
    width: '150px',
    render: (text, record) => {
      return (<div style={{ maxWidth: '150px', margin: '0 auto' }}>{record._editable ? <Input onChange={e => changeValue(record, 'code', e)} defaultValue={text} style={{ margin: '-5px 0' }} placeholder="票据代码" /> : text}</div>)
    },
  }, {
    title: '票据名称',
    dataIndex: 'name',
    key: 'name',
    width: '200px',
    render: (text, record) => {
      return (<div style={{ maxWidth: '200px', margin: '0 auto' }}>{record._editable ? <Input onChange={e => changeValue(record, 'name', e)} defaultValue={text} style={{ margin: '-5px 0' }} placeholder="票据名称" /> : text}</div>)
    },
  }, {
    title: '票据类型',
    dataIndex: 'digits',
    key: 'digits',
    width: '100px',
    render: (text, record) => {
      return (<div style={{ width: '100%', margin: '0 auto' }}>{record.typeName ? record.typeName:"机打票据"}</div>)
    },
  }, {
    title: '创建时间',
    dataIndex: 'numCopies',
    key: 'numCopies',
    width: '100px',
    render: (text, record) => {
      return (<div style={{ width: '100%', margin: '0 auto' }}>{record.createDate}</div>)
    },
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '80px',
    render: (text, record) => {
      // return (<Switch checked={text == '1'} onChange={status => onChange(status, record)} />)
      return (
        record._editable ? 
        <Select style={{ margin: '-10px', width:'100%'}} defaultValue={text.toString()} onChange={(value)=>{onChange(value, record)}}>
          <Option value="1" title={'启用'}>启用</Option>
              <Option value="0" title={'停用'}>停用</Option>
        </Select>
        : <Badge status={text=='1'?'success':'error'}  text={text=='1'?'启用':'停用'} />
    )
    },
  }, {
    title: '操作',
    dataIndex: 'id',
    width: '100px',
    fixed: getFixed(),
    render: (text, record) => {
      return (<div>
        {record._editable ? <div><a onClick={() => handleSaveMe(record)}>保存</a><Divider type="vertical" /><a onClick={() => handleCancel(record)}>取消</a></div> 
        : (record.typeName ? <div><a onClick={() => handleEdit(record)} type='text'>编辑</a><Divider type="vertical" /><a disabled={!menuMap['/template']||!record.info} onClick={() => handleShowModal(true,text,record)}>配置</a></div>
          : <div><a onClick={() => handleEdit(record)}>编辑</a><Divider type="vertical" /><a disabled={!menuMap['/template']} onClick={() => { handleDesign(record) }}>设计</a></div>)}
        </div>)
    },
  }]

  return (<div><Table
    dataSource={templateList}
    size="middle"
    columns={columns}
    bordered
    pagination={false}
    rowKey={record => record.id}
    simple
    scroll={{x:730}}
  />
  </div>)
}

export default ReceiptTable
