import { Table, Divider, Input, Select, Badge, InputNumber, DatePicker, Popconfirm } from 'antd';
import styles from '../common.less';
import { getFormat } from 'utils'
import moment from 'moment'

const Option = Select.Option;

const UserTable = ({
  dataLoading, 
  dataList,
  searchName,
  onUpdateState,
  onSave,
  onDelete,
}) => {
  const handleEdit = (record) => {
    record._editable = true
    onUpdateState({dataList})
  }

  const handleCancel = (record) => {
    if(record._add){
      dataList.splice(0, 1)
    }else{
      record._editable = false
    }
    onUpdateState({dataList})
  }

  const handleSave = (record) => {
    if(!record._change){
      //没做任何修改
      handleCancel(record)
      return
    }
    onSave(record)
  }

  const changeValue = (record, key, value) => {
    if(!record._change){
      record._change = {}
    }
    if(key=="fee" && value==undefined){
      record._change[key] = 0
    }else{
      record._change[key] = value
    }
  }

  const getFixed = () => {
		let width = document.body.clientWidth
    if (width > 769) {
      width -= 504
    }
    if (width < 600) {
      return 'right'
    }
    return ''
	}

  const columns = [{
    title: '缓缴标准',
    dataIndex: 'name',
    width: 100,
    render: (text, record) => {
      return record._editable ? <Input onChange={e => changeValue(record, 'name', e.target.value)} defaultValue={text} style={{ margin: '-5px 0' }} placeholder="请输入" /> : text
    },
  },{
    title: '缓缴金额',
    dataIndex: 'fee',
    width: 100,
    render: (text, record) => {
      return record._editable ? <InputNumber onChange={value => changeValue(record, 'fee', value)} defaultValue={getFormat(text)} style={{ margin: '-5px 0' }} placeholder="请输入" /> : getFormat(text)
    },
  },{
    title: '缓缴原因',
    dataIndex: 'reason',
    width: 100,
    render: (text, record) => {
      return record._editable ? <Input onChange={e => changeValue(record, 'reason', e.target.value)} defaultValue={text} style={{ margin: '-5px 0' }} placeholder="请输入" /> : text
    },
  },{
    title: '截止时间',
    dataIndex: 'timeEnd',
    key: 'numCopies',
    width: 100,
    render: (text, record) => {
      return record._editable ? <DatePicker format="YYYY-MM-DD HH:mm:ss"
      onChange={time => changeValue(record, 'timeEnd', record._timeEnd=time?time.format('YYYY-MM-DD HH:mm:ss'):'')}
      defaultValue={text ? moment(text) : ''}
      showTime={{defaultValue: moment('23:59:59', 'HH:mm:ss')}}
      />:text
    },
  },{
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (text, record) => {
      return (
        record._editable ? 
        <Select style={{ margin: '-10px', width:'100%'}} defaultValue={text.toString()} onChange={(value)=>{changeValue(record, 'status',value)}}>
          <Option value="1" title={'启用'}>启用</Option>
              <Option value="2" title={'停用'}>停用</Option>
        </Select>
        : <Badge status={text=='1'?'success':'error'}  text={text=='1'?'启用':'停用'} />
    )
    },
  },{
    title: '操作',
    dataIndex: 'id',
    width: 100,
    fixed: getFixed(),
    render: (text, record) => {
      return (<div>
        {record._editable ? <div><a onClick={() => handleSave(record)}>保存</a><Divider type="vertical" /><a onClick={() => handleCancel(record)}>取消</a></div> 
        : <div><a onClick={()=>handleEdit(record)}>编辑</a><Divider type="vertical" />
        <Popconfirm title="删除不可恢复确认删除?" onConfirm={()=>onDelete(record)} okText="确定" cancelText="取消"><a>删除</a></Popconfirm></div>}
        </div>)
    },
  }]

  return (<div><Table
    dataSource={dataList&&searchName?dataList.filter(item => item._add||item.name.toLowerCase().indexOf(searchName.toLowerCase())>=0):dataList}
    columns={columns}
    size="middle"
    bordered
    pagination={false}
    loading={dataLoading}
    rowKey={record => record.id}
    scroll={{x:600}}
    className={styles.fixedTable}
  />
  </div>)
}

export default UserTable
