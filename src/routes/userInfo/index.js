import React from 'react'
import { Row, Col, Card, Input, Cascader, Select, Icon, Message, Spin, List } from 'antd'
import { Page } from 'components'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import SnapshotModal from './SnapshotModal'
import styles from './index.less'
import QueueAnim from 'rc-queue-anim'
import InfiniteScroll from 'react-infinite-scroller'

const Option = Select.Option

const UserInfo = ({
  location,
  dispatch,
  userInfo,
  loading,
  app,
}) => {
  const { isNavbar } = app
  const {
    typeMap, tempTypeMap, attrMap, userInfoMap, userId, opHistoryVisible, departTree, departMap,disabledAttr,
    opList, opCount, opPageNum, opPageSize, opLoading,
    modalVisible, modalData,
  } = userInfo

  const opQueryParam = {
    pageNum: opPageNum,
    pageSize: opPageSize,
    id: userId,
  }

  const snapshotModalProps = {
    modalVisible,
    modalData,
    tempTypeMap,
    typeMap,

    onClose () {
      dispatch({
        type: 'userInfo/updateState',
        payload: {
          modalVisible: false,
        },
      })
    },
  }

  const handleChangeTemp = (type, attrId, value) => {
    if (value && [...value].length > 500) {
      Message.error('长度超过限制')
      return
    }
    tempTypeMap[type]._changeTemp[attrId] = value
	  dispatch({
      type: 'userInfo/updateState',
      payload: {
        tempTypeMap,
      },
    })
  }

  const handleEditGroup = (type) => {
    tempTypeMap[type]._editable = true
    tempTypeMap[type]._changeTemp = {}
    for (let node of tempTypeMap[type].list) {
      if (userInfoMap[node.id]) {
        if (node.valueType == '1') {
          tempTypeMap[type]._changeTemp[node.id] = userInfoMap[node.id].relateName
        } else {
          tempTypeMap[type]._changeTemp[node.id] = userInfoMap[node.id].relateId
        }
      }
    }
    dispatch({
      type: 'userInfo/updateState',
      payload: {
        tempTypeMap,
        opHistoryVisible: false,
      },
    })
  }

  const handleSaveGroup = (type) => {
    dispatch({
      type: 'userInfo/updateUserInfo',
      payload: {
        id: userId,
        type,
      },
    })
  }

  const handleCancelGroup = (type) => {
    tempTypeMap[type]._editable = false
    delete tempTypeMap[type]._changeTemp
    dispatch({
      type: 'userInfo/updateState',
      payload: {
        tempTypeMap,
      },
    })
  }

  const handleChangeOpHistoryVisible = (visible) => {
    dispatch({
      type: 'userInfo/changeOpHistoryVisible',
      payload: {
        visible,
      },
    })
  }

  const handleClickStructOption = (type, attr) => {
    dispatch({
      type: 'userInfo/getStructItem',
      payload: {
        structId: attr.relateId,
        type,
      },
    })
  }

  const hanldeChangeDepart = (value, type) => {
    if(value.length == 0){
      //取消选择
      for(let index in attrMap){
        if(attrMap[index].valueType==3 || disabledAttr[index]){
          tempTypeMap[type]._changeTemp[index] = ""
          attrMap[index]._displayValue = ""
        }
      }
      // for(let attrId in disabledAttr){
      //   tempTypeMap[type]._changeTemp[attrId] = ""
      //   attrMap[attrId]._displayValue = ""
      // }
      tempTypeMap[type]._changeTemp['_departTree'] = value
      dispatch({
        type: 'userInfo/updateState',
        payload: {
          tempTypeMap,
        },
      })
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
      tempTypeMap[type]._changeTemp[depart.attrId] = index
      attrMap[depart.attrId]._displayValue = depart.label
      if(depart.structItemAttrRelateMap){
        for(let attrId in depart.structItemAttrRelateMap){
          tempTypeMap[type]._changeTemp[attrId] = depart.structItemAttrRelateMap[attrId].relateId?depart.structItemAttrRelateMap[attrId].relateId:depart.structItemAttrRelateMap[attrId].relateName
          attrMap[attrId]._displayValue = depart.structItemAttrRelateMap[attrId].relateName
        }
      }
    }
    tempTypeMap[type]._changeTemp['_departTree'] = value
    dispatch({
      type: 'userInfo/updateState',
      payload: {
        tempTypeMap,
      },
    })
  }

  const handleClickAttrValueOption = (attr) => {
    dispatch({
      type: 'userInfo/getUserAttrValue',
      payload: {
        id: attr.id,
      },
    })
  }

  const handleChangeAttrValueOption = (type, attr, value) => {
    tempTypeMap[type]._changeTemp[attr.id] = value
    dispatch({
      type: 'userInfo/updateState',
      payload: {
        tempTypeMap,
      },
    })
  }

  const handleLoadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    dispatch({
      type: 'userInfo/getStructItemList',
      payload: {
        pid: targetOption.id,
      },
    })
  }

  const showAttrValueName = (type, attr) => {
    if (attrMap[attr.id] && attrMap[attr.id]._select && attrMap[attr.id]._select.length > 0) {
      let id = tempTypeMap[type]._changeTemp[attr.id]
      if(id){
        const node = attrMap[attr.id]._select.filter(item => id === item.id)[0]
        if (node) {
          return id
        }
      }
      return undefined
    }

    return userInfoMap[attr.id] ? userInfoMap[attr.id].relateName : undefined
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

  const createAttrValue = (type, attr) => {
    if (tempTypeMap[type]._editable) {
      if (attr.valueType == '1') {
        // 文本
        return (
          <Input value={tempTypeMap[type]._changeTemp[attr.id]} placeholder="请输入" onChange={(e) => { handleChangeTemp(type, attr.id, e.target.value) }} />
        )
      }else if(disabledAttr[attr.id]){
        //被禁用
        return (<Input value={attrMap[attr.id]._displayValue} placeholder="请选择" disabled={true}/>)
      }else if (attr.valueType == '3') {
         //修改层级
        return (<Cascader style={{width:'100%'}} value={tempTypeMap[type]._changeTemp['_departTree']} options={departTree} changeOnSelect={true}
          displayRender={(label, value)=>{return value&&value.length>0&&disabledAttr[departMap[value[value.length-1].id].attrId]?"":label[label.length - 1]}} placeholder="请选择"
          onChange={(value)=>{hanldeChangeDepart(value, type)}} loadData={handleLoadData}
        />)
      }
      // 值空间
      return (
        <Select style={{ width: '100%' }}
          value={showAttrValueName(type, attr)}
          allowClear
          showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          placeholder="请选择"
          notFoundContent={!attrMap[attr.id] || !attrMap[attr.id]._select ? <Spin size="small" /> : null}
          onFocus={() => handleClickAttrValueOption(attr)}
          onChange={(value) => { handleChangeAttrValueOption(type, attr, value) }}
        >
          {createAttrValueOption(attr)}
        </Select>
      )
    }
    return userInfoMap[attr.id] ? userInfoMap[attr.id].relateName : ''
  }

  const createAttr = (type) => {
    const attrs = []
    let list = tempTypeMap[type].list
    if (list) {
      for (let i = 0; i < list.length; i += 2) {
        if(isNavbar){
          attrs.push(<tr key={list[i].id}>
            <td className={styles.userInfoAttrTD}>{list[i].name}</td><td className={styles.userInfoAttrValueTD}>
              {createAttrValue(type, list[i])}
            </td>
          </tr>)
          attrs.push(<tr key={(i + 1 >= list.length)?"none":list[i+1].id}>
            <td className={styles.userInfoAttrTD}>{i + 1 >= list.length ? '' : list[i + 1].name}</td><td className={styles.userInfoAttrValueTD}>
              {i + 1 >= list.length ? '' : createAttrValue(type, list[i + 1])}
            </td>
          </tr>)
        }else{
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
    }
    return attrs
  }

  const createAttrGroup = () => {
    const groups = []
    for (let type in tempTypeMap) {
      groups.push(<div style={{ marginBottom: '20px' }} key={type}>
        <Row style={{ borderLeft: '5px solid #1890ff', paddingLeft: '10px', marginBottom: '10px' }}><span style={{ fontSize: '18px', marginRight: '10px' }}>{typeMap[type]}</span>
          {
            tempTypeMap[type]._editable ? <span><a style={{ lineHeight: '24px', marginRight: '10px' }} onClick={() => handleSaveGroup(type)}>保存</a><a style={{ lineHeight: '24px' }} onClick={() => handleCancelGroup(type)}>取消</a></span> :
            <a style={{ lineHeight: '24px' }} onClick={() => handleEditGroup(type)}>编辑</a>
          }
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

  const handleInfiniteOnLoad = () => {
    if (opLoading || opCount <= opList.length) {
      return
    }
    opQueryParam.pageNum += 1
    dispatch({
      type: 'userInfo/getUserOperate',
      payload: {
        ...opQueryParam,
      },
    })
  }

  const renderOpIcon = (item) => {
    if (item.snapshot && item.snapshot.length > 0) {
      return 'edit'
    }
    return 'plus-circle-o'
  }

  const showSnapshotModal = (item) => {
    // 生成快照map
    let modataData = { ...item }
    let srcMap = []
    for (let node of item.snapshot) {
      srcMap[node.attrId] = node
    }
    modataData._srcMap = srcMap
    let dstMap = []
    for (let node of item.info) {
      dstMap[node.attrId] = node
    }
    modataData._dstMap = dstMap
    dispatch({
      type: 'userInfo/updateState',
      payload: {
        modalVisible: true,
        modalData: modataData,
      },
    })
  }

  const renderContent = (item) => {
    let str = `${item.accountName} `
    if(!item.snapshot) {
      str += '添加'
    }else if(!item.info){
      str += '删除'
    }else{
      str += '编辑'
    }
    str += '了该学生信息'

    return (
    <Row>{str} {item.info?<a onClick={(e) => { showSnapshotModal(item) }}>点此查看</a>:""}</Row>
    )
  }

  return (
    <Page inner>
      <Row gutter={16}>
        <Col>
          <Card bordered={false} bodyStyle={{ padding: ' 0' }}>
            <div style={{ width: '100%', maxWidth: '1366px' }}>
              {createAttrGroup()}
            </div>
            {
              opHistoryVisible ? <QueueAnim ><div key="opHistory"
                style={{width: '300px', minHeight: '75vh', height:'100%', position: 'absolute', backgroundColor: 'white', zIndex: 999, top: '-22px', right: 0, boxShadow: '-2px 0px 2px #e8e8e8', paddingBottom: '20px',}}>
                <div key="v1"
                  style={{
                      position: 'absolute',
                      marginLeft: '-90px',
                      width: '90px',
                      color: 'white',
                      backgroundColor: '#1890ff',
                      height: '32px',
                      lineHeight: '32px',
                                        textAlign: 'center',
                      fontSize: '15px',
                      borderTopLeftRadius: '15px',
                      borderBottomLeftRadius: '15px',
                      }}
                  onClick={() => handleChangeOpHistoryVisible(false)}
                >收起</div>
                <Row style={{ padding: '20px', borderBottom: '1px solid #e8e8e8' }}>
                  <span style={{ fontSize: '16px' }}>操作日志</span>
                </Row>
                <div style={{ width: '100%', height: '90%', overflow: 'auto' }}>
                  <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={handleInfiniteOnLoad}
                    hasMore={!opLoading && opCount > opList.length}
                    useWindow={false}
                  >
                    <List
                      dataSource={opList}
                      renderItem={item => (
                        <List.Item key={item.id}>
                          <Row style={{ paddingLeft: '20px', paddingTop: '10px' }}>
                            <div>
                              <div style={{width: '20px', display: 'inline-block', verticalAlign: 'top', paddingTop: '8px', marginRight: '10px'}}>
                              <Icon type={renderOpIcon(item)} style={{ fontSize: 18, color: '#cccccc' }} /></div>
                              <div style={{ width: '230px', display: 'inline-block' }}>
                                <Row>{item.createDate}</Row>
                                {renderContent(item)}
                              </div>
                            </div>
                          </Row>
                        </List.Item>
                    )}
                    >
                      {opLoading && opCount > opList.length && (
                      <div style={{position: 'absolute', bottom: '40px', textAlign: 'center', width: '100%'}}>
                        <Spin />
                      </div>
                    )}
                    </List>
                  </InfiniteScroll>
                </div>
              </div></QueueAnim>
              : <div key="v2"
                style={{
                  position: 'absolute',
                  top: '-22px',
                  right: '-25px',
                  marginLeft: '-80px',
                  width: '90px',
                  color: 'white',
                  backgroundColor: '#1890ff',
                                  height: '32px',
                  lineHeight: '32px',
                  textAlign: 'center',
                  fontSize: '15px',
                  borderTopLeftRadius: '15px',
                  borderBottomLeftRadius: '15px',
                }}
                onClick={() => handleChangeOpHistoryVisible(true)}
              >操作日志</div>
            }

          </Card>
        </Col>

        { modalVisible && <SnapshotModal {...snapshotModalProps} /> }
      </Row>
    </Page>
  )
}

UserInfo.propTypes = {
  userInfo: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default connect(({ userInfo, app, loading }) => ({ userInfo, app, loading }))(UserInfo)

