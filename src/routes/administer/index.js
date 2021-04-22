import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Card, Input, Divider, Select, message, Icon, Popover, notification, DatePicker } from 'antd'
import { Page, UserSort, UserDisplay, UserSortLayer } from 'components'
import { request } from 'utils'
import styles from '../common.less'
import SchoolTree from './SchoolTree'
import SchoolTable from './SchoolTable'
import SchoolModal from './SchoolModal'

const Option = Select.Option
const { Search } = Input;
const RangePicker = DatePicker.RangePicker;

const Administer = ({
  location, dispatch, administer, loading, app
}) => {
  const {
    modalVisible, modalType, accountList, count, pageNum, pageSize, dataLoading, departs,
    modalAccount, modalDepart, sortFlag, selectedOrders, selectedAll, status, typeExact, valueExact, enabledVisible, disabledVisible, deleteVisible, manyDepartId, departTreeSearch, departTree, departMap, departTreeMap
  } = administer

  const { user, requestMap } = app

  const SchoolTreeProps = {
    departTree,
    schoolName: user.schoolName,
    departs,
    user,
    departTreeSearch,
    onSelectDepart (data) {
      const arr = []
      arr.push(data)
      dispatch({
        type: 'administer/getMgrAccountList',
        payload: {
          departs: arr,
        },
      })
    },
    onAddDepart (data) {
      dispatch({
        type: 'administer/showModal',
        payload: {
          modalType: 'addDepart',
          modalDepart: data,
        },
      })
    },
    onEditDepart (data) {
      dispatch({
        type: 'administer/showModal',
        payload: {
          modalType: 'editDepart',
          modalDepart: data,
        },
      })
    },
    onDeleteDepart (data) {
      const key = `open${Date.now()}`
      const btn = (<Button type="primary" size="small" onClick={() => { deleteMe(key) }}>确定</Button>)
      notification.open({
        message: '确认删除',
        description: `是否删除所选中的层级：${data.label}`,
        btn,
        key,
      })

      const deleteMe = () => {
        dispatch({
          type: 'administer/deleteMgrDepart',
          payload: {
            id: data.id,
            gtoken: data.token,
            type: data.type,
          },
        })
        notification.close(key)
      }
    },
  }

  const SchoolTableProps = {
    dataSource: accountList,
    // loading: loading.effects['account/query'],
    count,
    pageNum,
    pageSize,
    shortName: user.shortName,
    dataLoading,
    selectedOrders,
    selectedAll,
    departMap,
    departTreeMap,
    onUpdateState (data) {
      dispatch({
        type: 'administer/updateState',
        payload: {
          ...data,
        },
      })
    },
    onChange (n, s) {
      dispatch({
        type: 'administer/getMgrAccountList',
        payload: {
          pageNum: n,
          pageSize: s,
          departs,
          status,
          typeExact,
          valueExact,
        },
      })
    },
    onResetPwd (data) {
      dispatch({
        type: 'administer/showModal',
        payload: {
          modalAccount: data,
          modalType: 'resetPwd',
        },
      })
    },
    onDeleteUser (data) {
      dispatch({
        type: 'administer/deleteMgrAccount',
        payload: {
          id: data.id,
          status: '0',
        },
      })
    },
    onEditUser (data) {
      let many = []
      let i = 0
      if(data.departList){
        for(let index of data.departList){
          if(index.departId && index.departId != '0' && departTreeMap['3_'+index.departId]){
            many[i] = departTreeMap['3_'+index.departId]._path.concat()
            many[i].push(departTreeMap['3_'+index.departId].value)
            many[i].unshift('0')
            i++
          }else if(departMap[index.token] && (!index.departId || index.departId == '0')){
            many[i] = departMap[index.token]._path.concat()
            many[i].push(departMap[index.token].value)
            many[i].unshift('0')
            i++
          }
        }
      }
      dispatch({
        type: 'administer/showModal',
        payload: {
          modalAccount: data,
          modalType: 'update',
          manyDepartId: many,
        },
      })
    },
  }

  const ModalProps = {
    modalVisible,
    departTree,
    departMap,
    departTreeMap,
    departs,
    schoolName: user.schoolName,
    shortName: user.shortName,
    modalAccount,
    modalDepart,
    modalType,
    dataLoading,
    manyDepartId,
    onUpDateState (data) {
      dispatch({
        type: 'administer/updateState',
        payload: {
          ...data
        }
      })
    },
    onSubmit (data) {
      if (modalType == 'resetPwd') {
        dispatch({
          type: 'administer/resetPwd',
          payload: {
            id: data.id,
            gtoken: data.gtoken,
            password: data.password,
          },
        })
        dispatch({
          type: 'administer/hideModal',
        })
      } else if (modalType == 'add' || modalType == 'update') {
        dispatch({
          type: 'administer/updateMgrAccount',
          payload: {
            ...data,
          },
        })
        dispatch({
          type: 'administer/hideModal',
        })
      } else if (modalType == 'addDepart') {
        dispatch({
          type: 'administer/updateMgrDepart',
          payload: {
            ...data,
          },
        })

        dispatch({
          type: 'administer/hideModal',
        })
      } else if (modalType == 'editDepart') {
        dispatch({
          type: 'administer/updateMgrDepart',
          payload: {
            ...data,
          },
        })

        dispatch({
          type: 'administer/hideModal',
        })
      }
    },
    onClose () {
      dispatch({
        type: 'administer/hideModal',
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'administer/updateState',
        payload: {
          ...data
        }
      })
    },
    onGetAttrRelateList (record, key) {
      dispatch({
        type: 'administer/getAttrRelateList',
        payload: {
          id:record.id,
          attrId: record.attrId,
          key,
        }
      })
    },
    onDeleteAttr (record) {
      dispatch({
        type: 'administer/deleteMgrAttr',
        payload: {
          attrId:record.attrId,
          id:record.id,
          accountId:modalAccount.id
        }
      })
    },
    onUpdateAttr (record) {
      dispatch({
        type: 'administer/updateMgrAttr',
        payload: {
          id:record.id=="_add"?"":record.id,
          attrId: record.attrId,
          relateName:record._idSelected.toString(),
          accountId:modalAccount.id
        }
      })
    },
  }

  const handleChangeStatus = (value) => {
    dispatch({
      type: 'administer/updateState',
      payload: {
        status: value,
      },
    })
  }

  const handleChangeTypeExact = (value) => {
    dispatch({
      type: 'administer/updateState',
      payload: {
        typeExact: value,
      },
    })
  }
  
  const handleChangeValueExact = (e) => {
    dispatch({
      type: 'administer/updateState',
      payload: {
        valueExact: e.target.value,
      },
    })
  }

  const handleAddAccount = () => {
    dispatch({
      type: 'administer/showModal',
      payload: {
        modalAccount: {},
        modalType: 'add',
        manyDepartId: []
      },
    })
  }

  const handleStatusVisibleChange = (value, type) => {
    if(type == 'enabled'){
      dispatch({
        type: 'administer/updateState',
        payload: {
          enabledVisible: value,
        },
      })
    }else if(type == 'disabled'){
      dispatch({
        type: 'administer/updateState',
        payload: {
          disabledVisible: value,
        },
      })
    }else if(type == 'delete'){
      dispatch({
        type: 'administer/updateState',
        payload: {
          deleteVisible: value,
        },
      })
    }
    
  }

  const handleConfirmStatus = (type, status) => {
    dispatch({
      type: 'administer/deleteMgrAccount',
      payload: {
        // type,
        selectedOrders,
        status,
      },
    })
  }
  
  const handleSearch = (value) => {
    dispatch({
      type: 'administer/searchStruct',
      payload: {
        departTreeSearch: value,
        departTree,
      },
    })
  }

  const handleQueryData = () => {
    dispatch({
      type: 'administer/getMgrAccountList',
      payload: {
        pageNum: 1,
        pageSize,
        status,
        typeExact,
        valueExact,
      },
    })
  }

  const handleResetQuery = () => {
    dispatch({
      type: 'administer/updateState',
      payload: {
        status: '0',
        typeExact: undefined,
        valueExact: undefined,
      },
    })
  }

  const createSort = () => {
    let i = 0
    const list = [
      {
        id:i++,
        content:(
          <div className={styles.sortCol}>
            <div className={styles.sortText}>状态:</div>
              <Select disabled={dataLoading} allowClear={true} value={status} className={styles.sortSelectMuti} placeholder={"选择状态"} onChange={handleChangeStatus}>
                <Option key={'0'} value={'0'} title={'全部'}>全部</Option>
                <Option key={'1'} value={'1'} title={'启用'}>启用</Option>
                <Option key={'2'} value={'2'} title={'停用'}>停用</Option>
              </Select>
          </div>
        ),
      },
      {
        id:i++,
        content:(
          <div className={styles.sortCol}>
            <div className={styles.sortText} style={{width:'30%'}}>精准搜索:</div>
              <Select style={{width:'20%'}} disabled={dataLoading} allowClear={true} value={typeExact} className={styles.sortSelectMuti} placeholder={"选择状态"} onChange={handleChangeTypeExact}>
                <Option key={'1'} value={'1'} title={'账号'}>账号</Option>
                <Option key={'2'} value={'2'} title={'姓名'}>姓名</Option>
                <Option key={'3'} value={'3'} title={'手机号'}>手机号</Option>
              </Select>
              <Input disabled={!typeExact} placeholder="请输入" style={{width:'42%'}} value={valueExact} onChange={handleChangeValueExact} />
          </div>
        ),
        length: 2,
      }
    ]
      return list
  }

  const layerProps = {
    list: createSort(),
    query:(<div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop:'6px',overflow: 'hidden',textAlign: 'right', paddingRight: '5%' }}>
      <Button type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQueryData} style={{ marginRight: '10px',verticalAlign: 'middle',width:'62px' }}>{dataLoading?'':'查询'}</Button>
      <Button onClick={handleResetQuery} disabled={dataLoading} style={{ marginRight: '8%',verticalAlign: 'middle' }}>重置</Button>
    </div>),
  }

  const renderConfirmStatus = (type, status) => {
		return(
			<div>
				<div>{type == 'enabled'?'确定对该用户启用':type == 'disabled'?'确定对该用户禁用':'删除该用户'}</div>
				<div style={{ marginTop: '20px', textAlign: 'center' }}>
				<Button size="small" style={{ marginRight: '10px' }} onClick={()=>handleStatusVisibleChange(false, type)}>取消</Button>
				<Button type="primary" size="small" onClick={()=>handleConfirmStatus(type, status)}>确定</Button>
				</div>
			</div>
		)
  }

  return (
      <Page inner>
        <Card bordered={false} bodyStyle={{padding: ' 0'}}>
          <Row>
            <div style={{width:'300px', float:'left'}}>
              <Search enterButton placeholder="搜索" onSearch={value => handleSearch(value)} style={{ width: '300px', display:'block',}} />
              <Card bordered={false} bodyStyle={{padding: '0px',}}>
                <SchoolTree {...SchoolTreeProps} />
              </Card>
            </div>
            <div style={{paddingLeft:'10px', float:'left', width:'calc(100% - 300px)'}}>
              <Row>
                <UserSortLayer {...layerProps}/>
                <Divider style={{ margin: '5px' }} dashed />
              </Row>
              <Row style={{margin:'10px 0 0 0'}}>
                <Button icon="plus" onClick={() => handleAddAccount('add')} type="primary" style={{ marginBottom: '10px' }} >添加用户</Button>
                <Popover trigger="click" placement="top"
                  content={renderConfirmStatus('enabled', '1')}
                  visible={enabledVisible}
                  onVisibleChange={e=>handleStatusVisibleChange(e, 'enabled')}
                ><Button disabled={selectedOrders.length<=0} type="primary" style={{ margin: '0 0 10px 10px' }} >启用</Button></Popover>
                <Popover trigger="click" placement="top"
                  content={renderConfirmStatus('disabled', '2')}
                  visible={disabledVisible}
                  onVisibleChange={e=>handleStatusVisibleChange(e, 'disabled')}
                ><Button disabled={selectedOrders.length<=0} type="primary" style={{ margin: '0 0 10px 10px' }} >禁用</Button></Popover>
                <Popover trigger="click" placement="top"
                  content={renderConfirmStatus('delete', '0')}
                  visible={deleteVisible}
                  onVisibleChange={e=>handleStatusVisibleChange(e, 'delete')}
                ><Button disabled={selectedOrders.length<=0} type="primary" style={{ margin: '0 0 10px 10px' }} >删除</Button></Popover>
              </Row>
              <Row style={{color:'#1890ff', visibility:selectedOrders.length>0?'visible':'hidden',fontSize:'12px'}}>
                <Icon type="check" style={{marginLeft:'5px'}}/> 当前已选择{selectedAll?count:(selectedOrders.length?selectedOrders.length:'0')}条记录
              </Row>
              <Row><SchoolTable {...SchoolTableProps} /></Row>
            </div>
          </Row>
          { modalVisible && <SchoolModal {...ModalProps} /> }
        </Card>
      </Page>
    )
  }


  Administer.propTypes = {
    administer: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.object,
  }

export default connect(({ administer, app, loading }) => ({ administer, app, loading }))(Administer)
