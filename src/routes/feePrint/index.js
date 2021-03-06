import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, InputNumber, Card, Input, message, Divider, Select, Spin, Message, Modal, Popconfirm, DatePicker } from 'antd'
import { Page, Print, UserSort, UserDisplay, UserSortLayer, SortSelect } from 'components'
//import UserDisplay from './UserDisplay'
//import UserSort from './UserSort'
import UserTable from './UserTable'
import UserModal from './UserModal'
import styles from '../common.less'
import queryString from 'query-string'
import qs from 'qs'
import { getFormat } from 'utils'
import moment from 'moment';

const Option = Select.Option
const RangePicker = DatePicker.RangePicker;
const { TextArea, Search } = Input;

const FeePrint = ({
  location, dispatch, feePrint, loading, app
}) => {
  const {
    displaySence, sortSence, userSortExtra,
    searchName, pageNum, pageSize, beginDate, endDate, receiptBeginNo, receiptEndNo, missionId, subjectId, accountId, status,
    printList, count, dataLoading,selectedPrints,
    cancelOrderData,
    sortFlag,
    modalVisible,
    modalImportData
  } = feePrint

  const { user, userDisplaySence, userAttrList, userAttrMap, isNavbar, requestMap } = app
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}

  const missionList = requestMap['missionList']
  const subjectList = requestMap['subjectList']
  const accountList = requestMap['accountList']

  const queryParam = {
    key:searchName,
		pageNum,
		pageSize,
		beginDate,
		endDate,
		missionId,
		sortList: userSortList,
		receiptBeginNo,
		receiptEndNo,
		accountId: userSortMap['accountId']?userSortMap['accountId']._idSelected:undefined,
    subjectId,
    status,
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
      dispatch({type: 'feePrint/updateSort'})  // ?????????????????????
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
      dispatch({type: 'feePrint/updateSort'})  // ?????????
    },
  }

  const userTableProps = {
    dataSource: printList,
    count,
    pageNum,
    pageSize,
    userDisplayList,
    userDisplayMap,
    userAttrMap,
    dataLoading,
    selectedPrints,
    onChangePage (n, s) {
      dispatch({
        type: 'feePrint/getPrintList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'feePrint/updateState',
        payload: {
          ...data,
        },
      })
    },
  }

  const userModalProps = {
    modalImportData, modalVisible,
    onClose () {
      dispatch({
        type: 'feePrint/updateState',
        payload: {
          modalVisible: false,
          modalType: '',
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'feePrint/updateState',
        payload: {
         ...data
        },
      })
    },
    onImportConfirm (data) {
      if(!modalImportData.excel){
        message.error('???????????????');
        return;
      }
        dispatch({
          type: 'feePrint/importPrint',
          payload: {
            file:modalImportData.excel.fileName,
            timer: setInterval(() => {
              dispatch({
                type: 'feePrint/getImportPrintPrs'
              })
            }, 1500)
          },
        })
    },
    onImportCover (data) {
      dispatch({
        type: 'feePrint/coverPrint',
        payload: {
          ...data,
          timer: setInterval(() => {
            dispatch({
              type: 'feePrint/getImportPrintPrs'
            })
          }, 1500)
        },
      })
    },
  }

  const handleChangeDate = (value) => {
    dispatch({type: 'feePrint/updateSort',   //?????????????????????
      payload:{
        beginDate: value.length == 0?'':value[0].format('YYYY-MM-DD HH:mm:ss'),
        endDate: value.length == 0?'':value[1].format('YYYY-MM-DD HH:mm:ss'),
      },
    })
    // dispatch({
    //   type: 'feePrint/updateState',
    //   payload:{
    //     beginDate: value.length == 0?'':value[0].format('YYYY-MM-DD HH:mm:ss'),
    //     endDate: value.length == 0?'':value[1].format('YYYY-MM-DD HH:mm:ss'),
    //   },
    // })
	}

  const handleChangePrintStatus = (value) => {
    dispatch({type: 'feePrint/updateSort',payload:{status: value}})   //???????????????
    // dispatch({
    //   type: 'feePrint/updateState',
    //   payload:{
    //     status: value
    //   },
    // })
  }

  const handleChangeAccount = (value) => {
    dispatch({type: 'feePrint/updateSort',payload:{accountId: value}})    //??????????????????
    // dispatch({
    //   type: 'feePrint/updateState',
    //   payload:{
    //     accountId: value
    //   },
    // })
	}

  const handleChangeMission = (value) => {
    dispatch({type: 'feePrint/updateSort',payload:{missionId: value}})    //?????????????????????
    // dispatch({
    //   type: 'feePrint/updateState',
    //   payload:{
    //     missionId: value
    //   },
    // })
	}

	const handleChangeSubject = (value) => {
    dispatch({type: 'feePrint/updateSort',payload:{subjectId: value}})    //?????????????????????
    // dispatch({
    //   type: 'feePrint/updateState',
    //   payload:{
    //     subjectId: value
    //   },
    // })
	}
	
	const handleChangeReBeginNo = (value) => {
    dispatch({type: 'feePrint/updateSort',payload:{receiptBeginNo: value}})    //?????????????????????
    // dispatch({
    //   type: 'feePrint/updateState',
    //   payload:{
    //     receiptBeginNo: value
    //   },
    // })
	}

	const handleChangeReEndNo = (value) => {
    dispatch({type: 'feePrint/updateSort',payload:{receiptEndNo: value}})    //?????????????????????
    // dispatch({
    //   type: 'feePrint/updateState',
    //   payload:{
    //     receiptEndNo: value
    //   },
    // })
	}

  const handleResetQueryOrder = () => {
    for (let sort of userSortList) {
      if (sort._idSelected) {
        sort._idSelected = []
      }
    }
    dispatch({type: 'feePrint/updateSort',    //???????????????
      payload: {
        userSortList,
        accountId: [],
        receiptBeginNo: null,
        receiptEndNo: null,
        subjectId:undefined,
        missionId:undefined,
        status: undefined
      },
    })
    // dispatch({
    //   type: 'feePrint/updateState',
    //   payload: {
    //     userSortList,
    //     accountId: [],
    //     receiptBeginNo: null,
    //     receiptEndNo: null,
    //     subjectId:undefined,
    //     missionId:undefined,
    //     status: undefined
    //   },
    // })
  }

  const handleChangeSearchName = (value) =>{
    dispatch({
      type: 'feePrint/updateState',
      payload: {
        searchName: value.target.value
      },
    })
  }
  
  const handleOnSearch = (name) => {
		if(name || searchName){
			queryParam.key = name;
      dispatch({
        type: 'feePrint/getPrintList',
        payload: {
          ...queryParam,
        },
      })
		}
	}

  const handleQueryOrder = () => {
    dispatch({
      type: 'feePrint/getPrintList',
      payload: {
        ...queryParam,
      },
    })
  }

	const handleDeletePrint = () => {
    if(dataLoading){
      message.error("?????????????????????")
			return
    }
    if(user.printType=='bs'){
      for(let index of selectedPrints){
        if(printList[index].status!='1'){
          continue;
        }
        //????????????????????????
        let params = {
          flag:"?????????="+printList[index].receiptNo+"|????????????="+printList[index].templateCode,
        };
        // //????????????
        const url = "http://127.0.0.1:7699/PDelPj?"+qs.stringify(params);
        fetch(url, {
            method: "GET",
        }).then((res) => res.text())
        .then(retdata => {
          //????????????
          if(retdata.indexOf('??????:') == 0){
            let param = [{
              orderNo: printList[index].orderNo,
              receiptNo: printList[index].receiptNo,
            }]
            dispatch({
              type: 'feePrint/deletePrint',
              payload: {
                param
              },
            })
          }else{
            Message.error(retdata);
          }
        })
        .catch(err => Message.error("??????????????????????????????????????????????????????????????????"));
      }
    }
    else{
      let param = []
      for(let index of selectedPrints){
        if(printList[index].status!='1'){
          continue;
        }
        param.push({
          missionId: printList[index].missionId,
          orderNo: printList[index].orderNo,
          receiptNo: printList[index].receiptNo,
        })
      }
      dispatch({
        type: 'feePrint/deletePrint',
        payload: {
          param
        },
      })
    }
  }
  
  const handleShowImport = () => {
    dispatch({
      type: 'feePrint/updateState',
      payload: {
        modalVisible: true,
        modalImportData:{
          step:0,
          importing: false,
          covering: false,
          importType: 1
        }
      },
    })
  }
  
  const createMissionOption = () => {
    const options = [];
    if(missionList){
      for(let index of missionList){
        options.push(<Option key={index.id} value={index.id} title={index.name}>{index.name}</Option>)
      }
    }
		return options;
	}

  const createSubjectOption = () => {
    const options = [];
    if(subjectList){
      for(let index of subjectList){
        options.push(<Option key={index.id} value={index.id} title={index.name}>{index.name}</Option>)
      }
    }
		return options;
	}

  const createSort = () => {
    let i = 0
    const list = [
      {
        id:i++,
        content:(
          <div className={styles.sortCol}>
            <div className={styles.sortTextW} >????????????:</div>
                <RangePicker
                  disabled={dataLoading}
                  showTime={{ format: 'HH:mm:ss',defaultValue:[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}}
                  defaultValue={[beginDate?moment(beginDate):'', endDate?moment(endDate):'']}
                  disabledDate={(current)=>{return current && current > moment().endOf('day')}}
                  format="YYYY-MM-DD HH:mm:ss" 
                  placeholder={['????????????', '????????????']}
                  onChange={handleChangeDate}
                  style={{width: 'calc(100% - 100px)'}}
                />
          </div>
        ),
        length: 2,
      },{
        id:i++,
        content:(
          <div className={styles.sortCol}>
             <div className={styles.sortText}>????????????:</div>
                <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={missionId} className={styles.sortSelectMuti} placeholder={"????????????"} onChange={handleChangeMission}>
                {createMissionOption()}
                </Select>
          </div>
        )
      },{
        id:i++,
        content:(
          <div className={styles.sortCol} >
            <div className={styles.sortText}>????????????:</div>
                <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={subjectId} className={styles.sortSelectMuti} placeholder={"????????????"} onChange={handleChangeSubject}>
                {createSubjectOption()}
                </Select>
          </div>
        )
      }
    ]
      for(let attr of userSortList){
        i++
        if(attr.id == 'receiptNo'){
          list.push({
            id:i,
            content:(<div className={styles.sortCol}>
                      <div className={styles.sortText}>{attr.name}:</div>
                      <div style={{width:'calc(100% - 100px)',display:'inline-block'}}>
                        <InputNumber min={0}  step={1} disabled={dataLoading} value={receiptBeginNo} onChange={handleChangeReBeginNo} style={{width:'calc(50% - 5px)'}}/>
                          ~<InputNumber min={0} step={1} disabled={dataLoading} value={receiptEndNo} onChange={handleChangeReEndNo} style={{width:'calc(50% - 5px)'}}/>
                      </div>
                    </div>)
                  })
          }else if(attr.id == 'status'){
            list.push({
              id:i,
              content:(<div className={styles.sortCol}>
                        <div className={styles.sortText}>{attr.name}:</div>
                        <Select disabled={dataLoading} allowClear={true} value={status} className={styles.sortSelectMuti} placeholder={"??????"+attr.name} onChange={handleChangePrintStatus}>
                          <Option key={1} value={1} title={'?????????'}>?????????</Option>
                          <Option key={0} value={0} title={'?????????'}>?????????</Option>
                        </Select>
                      </div>)
                    })
          }else{
            list.push({
              id:i,
              content:(<SortSelect {...{...structSelectProps, attr}}/>)})
          }
        }
      return list
  }

  const layerProps = {
    list: createSort(),
    query:(<div className={styles.queryBox} >
        <Button className={styles.inquery} type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQueryOrder} >{dataLoading?'':'??????'}</Button>
				<Button className={styles.reset} onClick={handleResetQueryOrder} disabled={dataLoading} >??????</Button>
				<UserSort {...userSortProps} className={styles.more}/>
    </div>),
  }

  return (
    <Page inner>
      {sortFlag&&<div className={styles.masking} ></div>}
      <Row gutter={16}>
        <Col>
          <Card bordered={false} bodyStyle={{ padding: ' 0' }}>
            <div>
            <Divider style={{ margin: '5px' }} dashed />
            <UserSortLayer {...layerProps}/>
            <Divider style={{ margin: '5px' }} dashed />
            <Row style={{ marginBottom: '10px' }}>
              <Button type="primary" style={{ marginRight: '15px', marginBottom:isNavbar?'10px':undefined }} onClick={handleShowImport}>????????????</Button>
              <Popconfirm title={<span>??????????????????????????????????????????????????????????????????<br/>????????????????????????????????????</span>} onConfirm={handleDeletePrint} okText="??????" cancelText="??????"><Button type="primary" style={{ marginRight: '15px' }} disabled={selectedPrints.length == 0}>??????</Button></Popconfirm>
              <div style={{width: isNavbar?'100%':'250px',display:'inline-blck',float: 'right'}}>
                <Search enterButton placeholder="??????" value={searchName} onChange={(value)=>{handleChangeSearchName(value)}} onSearch={(value) => handleOnSearch(value)} style={{ float: 'right', width: isNavbar?'calc(100% - 50px)':'200px' }} />
                <UserDisplay {...userDisplayProps} />
              </div>
            </Row>
            <Row><UserTable {...userTableProps} /></Row>
            </div>
          </Card>
        </Col>
      </Row>
      { modalVisible && <UserModal {...userModalProps} /> }
    </Page>
  )
}

FeePrint.propTypes = {
  feePrint: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ feePrint, app, loading }) => ({ feePrint, app, loading }))(FeePrint)
