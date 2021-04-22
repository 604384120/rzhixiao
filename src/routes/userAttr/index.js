import { Tree } from 'antd'
import React from 'react'
import Mock from 'mockjs'
import { Row, Col, Card, Button, Input, Table, Checkbox, Popconfirm,  Badge, Divider, Select, Icon, Message } from 'antd'
import { Page } from 'components'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import AttrValueModal from './AttrValueModal'

const Option = Select.Option

const UserAttr = ({
  location,
  dispatch,
  userAttr,
  loading,
  app,
}) => {
  const {
    dataLoading, list, typeMap, tempTypeMap, attrMap, modalVisible, valueList, modalAttrId, modalAttrName, valueMap, disabledDisplayArr,
  } = userAttr
  const { isNavbar } = app
  const attrValueModalProps = {
    modalVisible,
    modalAttrId,
    modalAttrName,
    valueList,
    valueMap,
    dataSource: valueList,
    attrMap,
    onClose () {
      dispatch({
        type: 'userAttr/updateState',
        payload: {
          modalVisible: false,
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'userAttr/updateState',
        payload: {
          ...data,
        },
      })
    },
    onDelete (data) {
      dispatch({
        type: 'userAttr/deleteUserAttrValue',
        payload: {
          ...data,
        },
      })
    },
    onAdd (data) {
      dispatch({
        type: 'userAttr/addUserAttrValue',
        payload: {
          ...data,
        },
      })
    },
    onSave (data) {
      dispatch({
        type: 'userAttr/updateUserAttrValue',
        payload: {
          ...data,
        },
      })
    },
  }

  const handleAdd = (record) => {
    attrMap[record.id]._editable = true
    attrMap[record.id].status = '1'
    attrMap[record.id]._status = '1'
    attrMap[record.id].userShow = '1'
    attrMap[record.id]._userShow = '1'
    attrMap[record.id].name = ''
    attrMap[record.id].valueType = '1'
	  dispatch({
      type: 'userAttr/updateState',
      payload: {
        attrMap,
      },
    })
  }

  const handleEidt = (record) => {
    attrMap[record.id]._editable = true
    attrMap[record.id]._status = attrMap[record.id].status
    attrMap[record.id]._userShow = attrMap[record.id].userShow
    attrMap[record.id]._name = attrMap[record.id].name
	  dispatch({
      type: 'userAttr/updateState',
      payload: {
        attrMap,
      },
    })
  }

  const handleChangeName = (value, record) => {
    if (value && [...value].length > 40) {
      Message.error('长度超过限制')
      return
    }
    attrMap[record.id]._name = value
	  dispatch({
      type: 'userAttr/updateState',
      payload: {
        attrMap,
      },
    })
  }

  const handleSave = (record) => {
    if(record.type=='5'){
      if (!record._name) {
        Message.error('请输入字段名称')
        return
      }
      if (attrMap[record.id]._add) {
        dispatch({
          type: 'userAttr/addUserAttr',
          payload: {
            name: record._name,
            status: record._status,
            userShow: record._status=='2'?'0':record._userShow,
            type: '5',
            valueType: record.valueType,
          },
        })
        return
      }else{
        let userShow = record._userShow
        if(record._status=='2'){
          userShow = '0'
        }else if(disabledDisplayArr.indexOf(record.name)>=0){
          userShow = '1'
        }
        dispatch({
          type:'userAttr/updateUserAttrStatus',
          payload:{
            id: record.id,
            name: record._name,
            status: record._status,
            userShow,
          }
        })
      }
    }else {
      let userShow = record._userShow
      if(record._status=='2'){
        userShow = '0'
      }else if(disabledDisplayArr.indexOf(record.name)>=0){
        userShow = '1'
      }
      dispatch({
        type: 'userAttr/updateUserAttrStatus',
        payload: {
          id: record.id,
          status: record._status,
          userShow,
        },
      })
    }
  }

  const handleChangeStatus = (value, record) => {
    attrMap[record.id]._status = value
    dispatch({
      type: 'userAttr/updateState',
      payload: {
        attrMap,
      },
    })
  }

  const handleChangeUserShow = (value, record) => {
    attrMap[record.id]._userShow = value 
    dispatch({
      type: 'userAttr/updateState',
      payload: {
        attrMap,
      },
    })
  }

  const handleChangeValueType = (value, record) => {
    attrMap[record.id].valueType = value
    dispatch({
      type: 'userAttr/updateState',
      payload: {
        attrMap,
      },
    })
  }

  const handleCancel = (record) => {
    attrMap[record.id]._editable = false
	  dispatch({
      type: 'userAttr/updateState',
      payload: {
        attrMap,
      },
    })
  }

  const handleClickValue = (record) => {
	  dispatch({
      type: 'userAttr/showAttrValue',
      payload: {
        id: record.id,
        name: record.name,
        valueDefault: record.valueDefault
      },
    })
  }

  const handleDelete = (record) => {
    dispatch({
      type: 'userAttr/deleteUserAttr',
      payload: {
        id:record.id,
      },
    })
  }

  const getFixed = () => {
		let width = document.body.clientWidth
    if (width > 769) {
      width -= 304
		}
    if (width < 600) {
      return 'right'
    }
    return ''
	}

  const columns = [
    {
      title: '',
      dataIndex: 'type',
      width: 100,
      render: (text, record) => {
        const obj = {
          children: typeMap[text],
          props: {},
        }
        obj.props.rowSpan = record.span
        return obj
      },
    }, {
      title: '字段',
      dataIndex: 'name',
      width: 100,
      render: (text, record) => {
        if(record.type=='5'&&record._editable){
          return (
            <Input style={{ margin: '-5px 0' }} defaultValue={text} onChange={(e) => { handleChangeName(e.target.value, record) }} />
          )
        }
        if (record._add) {
          if (record._editable) {
            return (
              <Input style={{ margin: '-5px 0' }} defaultValue={text} onChange={(e) => { handleChangeName(e.target.value, record) }} />
            )
          }
          return (
            <a href="javascript:;" onClick={(e) => { handleAdd(record) }}><Icon type="plus" />添加</a>
          )
        }

        return text
      },
    }, {
      title: '类型',
      dataIndex: 'valueType',
      width: 100,
      render: (text, record) => {
        if (record._add && !record._editable) {
          return ''
        }
        if (record._add && record._editable) {
          return (
            <div style={{ width: '70px', margin: '0 auto' }}>
              <Select style={{ margin: '-10px 0', width: '80px' }} defaultValue={text.toString()} onChange={(value) => { handleChangeValueType(value, record) }}>
                <Option value="1" title={'文本'}>文本</Option>
                <Option value="2" title={'选项'}>选项</Option>
              </Select>
            </div>
          )
        }
        if (text == '1') {
          return <div style={{ width: '70px', margin: '0 auto' }}>文本</div>
        } else if (text == '2') {
          return (
            <div style={{ width: '70px', margin: '0 auto' }}>选项<Icon type="edit" onClick={() => { handleClickValue(record) }} /></div>
          )
        }
        return <div style={{ width: '70px', margin: '0 auto' }}>层级</div>
      },
    }, {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (text, record) => {
        if (record._add && !record._editable) {
          return ''
        }
        return (
          <div style={{ width: '70px', margin: '0 auto' }}>
            {
            record._editable&&record.statusDefault!='1'?
              <Select style={{ margin: '-10px' }} defaultValue={text.toString()} onChange={(value) => { handleChangeStatus(value, record) }}>
                <Option value="1" title={'启用'}>启用</Option>
                <Option value="2" title={'停用'}>停用</Option>
              </Select>
            : <Badge status={text == '1' ? 'success' : 'error'} text={text == '1' ? '启用' : '未启用'} />
          }
          </div>
        )
      },
    }, {
      title: '用户端展示',
      dataIndex: 'userShow',
      width: 100,
      render: (text, record) => {
        if (record._add && !record._editable) {
          return ''
        }
        return (
          <div style={{ width: '70px', margin: '0 auto' }}>
            {
            record._editable&&disabledDisplayArr.indexOf(record.name)<0? 
              <Select style={{ margin: '-10px' }} defaultValue={text.toString()} onChange={(value) => { handleChangeUserShow(value, record) }}>
                <Option value="1" title={'启用'}>启用</Option>
                <Option value="0" title={'停用'}>停用</Option>
              </Select>
            : <Badge status={text == '1' ? 'success' : 'error'} text={text == '1' ? '启用' : '未启用'} />
          }
          </div>
        )
      },
    },{
      title: '操作',
      dataIndex: 'id',
      width: 100,
      fixed: getFixed(),
      render: (text, record) => {
        if (record._add && !record._editable) {
          return ''
        }
        return (
          <div>
            {
							record._editable ?
  <div>
    <a onClick={() => handleSave(record)}>保存</a>
    <Divider type="vertical" />
    <a onClick={() => handleCancel(record)}>取消</a>
  </div>
							:
  <div>
    <a disabled={record.statusDefault=='1'&&disabledDisplayArr.indexOf(record.name)>=0} onClick={() => handleEidt(record)}>编辑</a>
    {record.type=='5'&&<div style={{display:'inline-block'}}>
      <Divider type="vertical" />
      <Popconfirm title="删除不可恢复确认删除吗？" onConfirm={() => handleDelete(record)} okText="确定" cancelText="取消"><a>删除</a></Popconfirm>
    </div>}
  </div>
						}
          </div>
        )
      },
    },
  ]
  return (
    <Page inner>
      <Row gutter={16}>
        <Col>
          <Card bordered={false} bodyStyle={{ padding: ' 0' }}>
              <Table
                dataSource={list}
                loading={dataLoading}
                size="middle"
                bordered
                columns={columns}
                pagination={false}
                rowKey={record => record.id}
                scroll={{x:600}}
              />
          </Card>
        </Col>
        { modalVisible && <AttrValueModal {...attrValueModalProps} /> }
      </Row>
    </Page>
  )
}

UserAttr.propTypes = {
  userAttr: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default connect(({ userAttr, app,  loading }) => ({ userAttr, app, loading }))(UserAttr)

