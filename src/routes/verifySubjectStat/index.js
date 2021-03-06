import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Card, Input, Divider, Select, Icon, message, Modal, Spin, DatePicker, Popover } from 'antd'
import { Page, UserSort, UserDisplay, UserSortLayer, SortSelect } from 'components'
import queryString from 'query-string'
import styles from '../common.less'
import VerifySubjectStatTable from './VerifySubjectStatTable'
import UserModal from './UserModal'
import moment from 'moment'

const Option = Select.Option
const { Search } = Input;
const RangePicker = DatePicker.RangePicker;

const VerifySubjectStat = ({
  location, dispatch, verifySubjectStat, loading, app
}) => {
const {
  missionList, subjectList, accountList, missionId, subjectId, accountId, pageNum, pageSize, count, sortFlag, dataLoading, searchName, beginDate, endDate,
  displaySence, sortSence, modalVisible, modalData, modalType, payTypeNameMap,
  verifyStatList, status, userSortExtra, 
  confirmVerifyVisible, selectedVerifys,
} = verifySubjectStat
  const { userDisplaySence, userAttrList, userAttrMap, isNavbar, menuMap } = app
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}
  const queryParam = {
    key:searchName,
    sortList: userSortList,
    pageNum,
    pageSize,
    missionId,
    subjectId,
    accountId,
    status,
    beginDate,
    endDate,
  }

  const userDisplayProps = {
    userAttrList,
    ...userDisplaySence[displaySence],
    onUpdateState (data) {
      userDisplaySence[displaySence] = {...userDisplaySence[displaySence], ...data}
      dispatch({
        type: 'app/updateState',
        payload: {
          userDisplaySence
        },
      })
    },
    onReset () {
      dispatch({
        type: 'app/resetDisplay',
        payload:{sence:displaySence}
      })
    },
    onUpdate (data) {
      dispatch({
        type: 'app/updateDisplay',
        payload: {
          displayListTemp:data,
          sence: displaySence,
        },
      })
    },
  }

  const userSortProps = {
    userAttrList,
    ...userDisplaySence[sortSence],
    displayExtra: userSortExtra,
    onUpdateState (data) {
      const {userDisplaySence} = app
      userDisplaySence[sortSence] = {...userDisplaySence[sortSence], ...data}
      dispatch({
        type: 'app/updateState',
        payload: {
          userDisplaySence
        },
      })
    },
    
    onReset () {
      dispatch({
        type: 'app/resetDisplay',
        payload:{sence:sortSence, displayExtra:userSortExtra}
      })
    },
    onUpdate (data) {
      dispatch({type: 'verifySubjectStat/updateSort'})  // ?????????????????????
      dispatch({
        type: 'app/updateDisplay',
        payload: {
          displayListTemp:data,
          sence: sortSence,
        },
      })
    },
  }

  const structSelectProps = {
    dataLoading,
    userSortMap,
    userAttrMap,
    styles,
    onGetSelectList (data) {
      dispatch({
        type: 'app/getAttrRelateList',
        payload: {
          ...data
        },
      })
    },

    onChangeSort (value, attr) {
      dispatch({type: 'verifySubjectStat/updateSort'})  // ?????????
    },
  }

  const userTableProps = {
    dataSource: verifyStatList,
    dataLoading,
    count,
    pageNum,
    pageSize,
    userDisplayList,
    userDisplayMap,
    userAttrMap,
    selectedVerifys,
    onUpdateState (data) {
      dispatch({
        type: 'verifySubjectStat/updateState',
        payload: {
          ...data,
        },
      })
    },
    onCancel (data) {
      dispatch({
        type: 'verifySubjectStat/updateVerifyBill',
        payload:{
          billId:data.billId
        }
      })
    },
    onConfirm (data) {
      dispatch({
        type: 'verifySubjectStat/addVerifyBill',
        payload:{
          billId:data.billId
        }
      })
    },
    onChangePage (n, s) {
      dispatch({
        type: 'verifySubjectStat/getDataList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
        },
      })
    },
    onShowInfo (record) {
      dispatch({
        type: 'verifySubjectStat/showBillInfo',
        payload: {
          bill: record
        },
      })
    },
  }

  const userModalProps = {
    modalData,
    modalType,
    modalVisible,
    userDisplayList,payTypeNameMap,
    onScanCancel () {
      dispatch({
        type: 'verifySubjectStat/updateVerifyBill',
        payload:{
          billId:modalData.billId
        }
      })
      dispatch({
        type: 'verifySubjectStat/updateState',
        payload: {
          modalVisible: false,
          modalData: undefined
        },
      })
      dispatch({
        type: 'verifySubjectStat/getDataList',
        payload: {
          ...queryParam,
        },
      })
    },

    onScanClose () {
      dispatch({
        type: 'verifySubjectStat/updateState',
        payload: {
          modalVisible: false,
          modalData: undefined
        },
      })
  
      dispatch({
        type: 'verifySubjectStat/getDataList',
        payload: {
          ...queryParam,
        },
      })
    },

    onClose () {
      dispatch({
        type: 'verifySubjectStat/updateState',
        payload: {
          modalVisible: false,
          modalData: undefined
        },
      })
    }
  }

  const handleChangeDate = (value) => {
    dispatch({
      type: 'verifySubjectStat/updateSort',
      payload:{
        beginDate: value.length == 0?'':value[0].format('YYYY-MM-DD HH:mm:ss'),
        endDate: value.length == 0?'':value[1].format('YYYY-MM-DD HH:mm:ss'),
      },
    })
	}

  const handleChangeStatus = (value) => {
    dispatch({type: 'verifySubjectStat/updateSort',payload:{status: value}})    //???????????????
  }

  const handleQueryData = () => {
    dispatch({
      type: 'verifySubjectStat/getDataList',
      payload: {
          ...queryParam
      },
    })
  }

  const handleResetQuery = () => {
    dispatch({type: 'verifySubjectStat/updateSort',
      payload: {
        missionId: undefined,
        subjectId: undefined,
        status: null
      },
    })
  }

  const handleOnSearch = (name) => {
    if(searchName){
      dispatch({
        type: 'verifySubjectStat/getDataList',
        payload: {
          ...queryParam,
        },
      })
    }
  }

  const handleChangeSearchName = (value) => {
    dispatch({
      type: 'verifySubjectStat/updateState',
      payload: {
        searchName: value.target.value
      },
    })
  }

  const addVerifyBillScan = (payload) => {
    dispatch({
      type: 'verifySubjectStat/updateState',
      payload: {
        modalVisible: true,
        modalData: undefined,
        modalType:'scan'
      },
    })
    dispatch({
      type: 'verifySubjectStat/addVerifyBillScan',
      payload: {
        ...payload
      },
    })
  }

  const handleScan = () => {
    if(window.AlipayJSBridge) {
      AlipayJSBridge.call('scan', {type: 'qr'}, 
        function(result) {
          if(result.error){
            message.error('????????????')
          }else{
            //????????????????????????
            const content = queryString.parse(result.codeContent)
            if(!content.billId || !content.sign){
              queryParam.key = result.codeContent
              dispatch({
                type: 'verifySubjectStat/getDataList',
                payload: {
                    ...queryParam
                },
              })
              return
            }
            addVerifyBillScan(content)
          }
      });
    }
  }

  const handleChangeMission = (value) => {
    dispatch({type: 'verifySubjectStat/changeSelected',payload:{missionId: value}})
    dispatch({type: 'verifySubjectStat/updateSort',payload:{missionId: value}})   //?????????????????????
  }

  const handleChangeSubject = (value) => {
    dispatch({type: 'verifySubjectStat/updateSort',payload:{subjectId: value}})   //?????????????????????
  }

  const handleChangeVerifyUser = (value) => {
    dispatch({type: 'verifySubjectStat/updateSort',payload:{accountId: value}})   //??????????????????
  }

  const handleConfirmVerifyVisibleChange = (value) => {
    dispatch({
      type: 'verifySubjectStat/updateState',
      payload: {
        confirmVerifyVisible: value
      },
    })
  }

  const handleConfirmVerify = () => {
    dispatch({
      type: 'verifySubjectStat/addVerifyBill',
      payload: {
        billId: selectedVerifys.toString(),
      },
    })
  }

  const renderverify = () => {
		return(
			<div>
				<div>??????????????????????????????????</div>
				<div style={{ marginTop: '20px', textAlign: 'center' }}>
				<Button size="small" style={{ marginRight: '10px' }} onClick={()=>handleConfirmVerifyVisibleChange(false)}>??????</Button>
				<Button type="primary" size="small" onClick={()=>handleConfirmVerify()}>??????</Button>
				</div>
			</div>
		)
  }

  const createUserSortOption = (attr) => {
    const options = []
    if (attr._selectList) {
      for (let select of attr._selectList) {
        options.push(<Option key={select.relateId} value={select.relateName} title={select.relateName}>{select.relateName}</Option>)
      }
      return options
    }
    return null
  }

  const createVerifyUserOption = () => {
    const options = [];
    if(accountList){
        for(let index of accountList){
            options.push(<Option key={index.accountId} value={index.accountId} title={index.accountName}>{index.accountName}</Option>)
        }
    }
    return options;
  }

  const createMissionOption = () => {
    const options = [];
    if(missionList){
        for(let index of missionList){
            options.push(<Option key={index.missionId} value={index.missionId} title={index.missionName}>{index.missionName}</Option>)
        }
    }
    return options;
  }

  const createSubjectOption = () => {
      const options = [];
      if(subjectList){
          for(let index of subjectList){
              index._subVisible && options.push(<Option key={index.subjectId} value={index.subjectId} title={index.subjectName}>{index.subjectName}</Option>)
          }
      }
      return options;
  }

  const createSort = () => {
    let i = 0
    const list = [{
      id:i++,
      content:(
        <div className={styles.sortCol}>
          <div className={styles.sortTextW}>????????????:</div>
            <RangePicker
              disabled={dataLoading}
              showTime={{ format: 'HH:mm:ss',defaultValue:[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}}
              defaultValue={[beginDate?moment(beginDate):'', endDate?moment(endDate):'']}
              disabledDate={current=>{return current && current > moment().endOf('day')}}
              format="YYYY-MM-DD HH:mm:ss" 
              placeholder={['????????????', '????????????']}
              onChange={handleChangeDate}
              style={{width: 'calc(100% - 100px)'}}
            />
        </div>
      ),
      length: 2,
    }]
    
    if(menuMap['/verifySubject']!=undefined){
      list.push({
        id:i++,
        content:(
          <div className={styles.sortCol} >
          <div className={styles.sortText}>?????????:</div>
            <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear value={accountId} className={styles.sortSelectMuti} placeholder={"????????????"} onChange={handleChangeVerifyUser}>
            {createVerifyUserOption()}
            </Select>
          </div>
        )
      })
    }
    list.push({
      id:i++,
      content:(
        <div className={styles.sortCol} >
        <div className={styles.sortText}>????????????:</div>
          <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={missionId} className={styles.sortSelectMuti} placeholder={"????????????"} onChange={handleChangeMission}>
          {createMissionOption()}
          </Select>
        </div>
      )
    })
    list.push({
      id:i++,
      content:(
          <div className={styles.sortCol} >
          <div className={styles.sortText}>????????????:</div>
            <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={subjectId} className={styles.sortSelectMuti} placeholder={"????????????"} onChange={handleChangeSubject}>
            {createSubjectOption()}
            </Select>
          </div>
      )
    })
    list.push({
      id:i++,
      content:(
          <div className={styles.sortCol} >
          <div className={styles.sortText}>??????:</div>
              <Select disabled={dataLoading} allowClear={true} value={status} className={styles.sortSelectMuti} placeholder={"????????????"} onChange={handleChangeStatus}>
                  <Option key={2} value={2} title={'??????'}>??????</Option>
                  <Option key={1} value={1} title={'?????????'}>?????????</Option>
                  <Option key={0} value={0} title={'?????????'}>?????????</Option>
                </Select>
          </div>
        )
    })
    for(let attr of userSortList){
      i++
      list.push({
        id:i,
        content:(<SortSelect {...{...structSelectProps, attr}}/>)
      })
    }
    return list
  }

  const layerProps = {
    list: createSort(),
    query:(<div className={styles.queryBox}>
      <Button className={styles.inquery} type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQueryData}>{dataLoading?'':'??????'}</Button>
      <Button className={styles.reset} onClick={handleResetQuery} disabled={dataLoading}>??????</Button>
      <UserSort {...userSortProps} className={styles.more}/>
    </div>),
  }

  return (
    <Page inner>
    {sortFlag&&<div className={styles.masking}></div>}
      <Row gutter={16}>
          <Col>
            <Card bordered={false} bodyStyle={{ padding: ' 0' }}>
              <div>
              <Divider style={{ margin: '5px' }} dashed />
                <UserSortLayer {...layerProps}/>
                <Divider style={{ margin: '5px' }} dashed />
                <Row style={{marginBottom:'10px'}}>
                  <Popover trigger="click" placement="top"
                    content={renderverify()}
                    visible={confirmVerifyVisible}
                    onVisibleChange={e=>handleConfirmVerifyVisibleChange(e)}
                  ><Button type="primary" style={{ marginRight: '15px',marginBottom:isNavbar?'10px':undefined }} disabled={selectedVerifys.length == 0}>????????????</Button></Popover>
                  <div style={{width: isNavbar?'100%':'250px',display:'inline-block',float: 'right'}}>
                    <Search enterButton placeholder="??????" value={searchName} onChange={handleChangeSearchName} onSearch={value => handleOnSearch(value)} style={{ width: isNavbar?'calc(100% - 80px)':'200px', float: 'right' }} />
                    <UserDisplay {...userDisplayProps} />
                    {
                      isNavbar&&<Icon type="scan" style={{fontSize:'20px',marginTop:"5px"}} onClick={handleScan}/>
                    }
                  </div>
                </Row>
                <Row>
                  <VerifySubjectStatTable {...userTableProps} />
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
        {modalVisible&&<UserModal {...userModalProps}/>}
      {/* {modalVisible&&<Modal	visible={modalVisible}
      onCancel={()=>{handleModalClose()}}
      title={"????????????"}
      footer={null}
      width={'600px'}
      maskClosable={false}>
        <div style={{minHeight:'300px', overflowY:'scroll'}}>
        {
          modalData?
        <div style={{padding:'0 20px 0 20px'}}>
          {modalData.error?<Row style={{fontSize:'20px', color:'red', textAlign:"center", margin:'auto 0'}}>
            {modalData.error}
            </Row>:<div>
          <Row style={{fontSize:'20px', color:'#3eb94e'}}>
            ????????????
          </Row>
          <Row style={{marginTop:'20px'}}>???????????????{modalData.missionName}</Row>
          <Row style={{marginTop:'10px'}}>???????????????{modalData.subjectName}</Row>
          {renderUserInfo()}
            <Row style={{marginTop:"30px", textAlign:'center'}}>
            <Popconfirm title="???????????????????" onConfirm={handleCancel} okText="??????" cancelText="??????"><Button type="danger" ghost>????????????</Button></Popconfirm>
            <Button type="primary" ghost style={{marginLeft:'20px'}} onClick={handleModalClose}>????????????</Button>
            </Row>
          </div>
          }
          
        </div>
        :<Icon type="loading" style={{position: 'absolute', left: 'calc(50% - 20px)', top: '50%', fontSize:'50px'}}></Icon>
        }
        </div>
      </Modal>} */}
    </Page>
  )
}


VerifySubjectStat.propTypes = {
  verifySubjectStat: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ verifySubjectStat, app, loading }) => ({ verifySubjectStat, app, loading }))(VerifySubjectStat)
