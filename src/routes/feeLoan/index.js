import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Card, Input, message, Divider, Select, Spin, Modal, Popover, DatePicker } from 'antd'
import { Page, Print, UserSort, UserDisplay, UserSortLayer, SortSelect } from 'components'
import UserTable from './UserTable'
import UserModal from './UserModal'
import styles from '../common.less'
import { getYearFormat } from 'utils'
import moment from 'moment'

const Option = Select.Option
const { TextArea, Search } = Input;
const RangePicker = DatePicker.RangePicker;

const FeeLoan = ({
  location, dispatch, feeLoan, loading, app
}) => {
  const { isNavbar } = app;
  const {
    modalVisible,  modalImportData, missionMap,
    displaySence, sortSence, userSortExtra,
    searchName, pageNum, pageSize, loanType, accountId, missionId, subjectId, status, year, beginDate, endDate,
    loanList, count, dataLoading,selectedLoans,
    printCheck, textData, templateHeight, settingData, cancelLoanData,
    sortFlag, orderNo, 
  } = feeLoan

  const { userDisplaySence, userAttrList, userAttrMap, requestMap } = app
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}

  const missionList = requestMap['missionList']
  const yearList = requestMap['yearList']
  const subjectList = requestMap['subjectList']
  const subjectMap = requestMap['subjectMap']
  const accountList = requestMap['accountList']
  const loanTypeList = requestMap['loanTypeList']
  const loanTypeMap = requestMap['loanTypeMap']

  const queryParam = {
    key:searchName,
		pageNum,
		pageSize,
		missionId,
		sortList: userSortList,
		accountId: userSortMap['accountId']?userSortMap['accountId']._idSelected:undefined,
    subjectId,
    status,
    loanType: userSortMap['loanType']?userSortMap['loanType']._idSelected:undefined,
    year,
    beginDate,
    endDate,
    orderNo,
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
      dispatch({type: 'feeLoan/updateSort'})  // 更多筛选加蒙版
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
      dispatch({type: 'feeLoan/updateSort'})  // 加蒙版
    },
  }

  const userTableProps = {
    dataSource: loanList,
    count,
    pageNum,
    pageSize,
    userDisplayList,
    userDisplayMap,
    userAttrMap,
    dataLoading,
    subjectMap,
    selectedLoans,
    loanTypeMap,
    onChangePage (n, s) {
      dispatch({
        type: 'feeLoan/getLoanList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'feeLoan/updateState',
        payload: {
          ...data,
        },
      })
    },
    
  }

  const userModalProps = {
    modalImportData, modalVisible,
    missionList, missionMap,
    subjectMap,
    onClose () {
      dispatch({
        type: 'feeLoan/updateState',
        payload: {
          modalVisible: false,
          modalType: '',
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'feeLoan/updateState',
        payload: {
         ...data
        },
      })
    },
    onImportConfirm (data) {
      if(!modalImportData.excel){
        message.error('请选择文件');
        return;
        }
        dispatch({
          type: 'feeLoan/importLoan',
          payload: {
            file:modalImportData.excel.fileName,
            timer: setInterval(() => {
              dispatch({
                type: 'feeLoan/getImportLoanPrs'
              })
            }, 1500)
          },
        })
    },
    onImportCover (data) {
      dispatch({
        type: 'feeLoan/coverLoan',
        payload: {
          ...data,
          timer: setInterval(() => {
            dispatch({
              type: 'feeLoan/getImportLoanPrs'
            })
          }, 1500)
        },
      })
    },
    onGetSubject (record) {
      dispatch({
        type: 'feeLoan/getSubjectListByMission',
        payload: {
          missionId: record.missionId
        },
      })
    }
  }

  const handleChangeDate = (value) => {
    dispatch({
      type: 'feeLoan/updateSort',
      payload:{
        beginDate: value.length == 0?'':value[0].format('YYYY-MM-DD HH:mm:ss'),
        endDate: value.length == 0?'':value[1].format('YYYY-MM-DD HH:mm:ss'),
      },
    })
	}

  const handleChangeYear  = (value) => {
    dispatch({type: 'feeLoan/updateSort',payload:{year: value}})    //学年加蒙版
    // dispatch({
    //   type: 'feeLoan/updateState',
    //   payload:{
    //     year: value
    //   },
    // })
  }

  const handleChangeStatus = (value) => {
    dispatch({type: 'feeLoan/updateSort',payload:{status: value}})    //状态加蒙版
    // dispatch({
    //   type: 'feeLoan/updateState',
    //   payload:{
    //     status: value
    //   },
    // })
  }

  const handleChangeOrderNo = (value) => {
    dispatch({type: 'feeLoan/updateSort',payload:{orderNo: value}})  // 订单号加蒙版
	}

  const handleChangeMission = (value) => {
    dispatch({type: 'feeLoan/updateSort',payload:{missionId: value}})    //任务名称加蒙版
    // dispatch({
    //   type: 'feeLoan/updateState',
    //   payload:{
    //     missionId: value
    //   },
    // })
	}

	const handleChangeSubject = (value) => {
    dispatch({type: 'feeLoan/updateSort',payload:{subjectId: value}})    //项目名称加蒙版
    // dispatch({
    //   type: 'feeLoan/updateState',
    //   payload:{
    //     subjectId: value
    //   },
    // })
	}

  const handleResetQueryLoan = () => {
    for (let sort of userSortList) {
      if (sort._idSelected) {
        sort._idSelected = []
      }
    }
    dispatch({type: 'feeLoan/updateSort',       //重置加蒙版
      payload: {
        userSortList,
        accountId: [],
        status: undefined,
        subjectId:undefined,
        missionId:undefined,
        loanType: undefined,
      },
    })
    // dispatch({
    //   type: 'feeLoan/updateState',
    //   payload: {
    //     userSortList,
    //     accountId: [],
    //     status: undefined,
    //     subjectId:undefined,
    //     missionId:undefined,
    //     loanType: undefined,
    //   },
    // })
  }

  const handleChangeSearchName = (value) =>{
    dispatch({
      type: 'feeLoan/updateState',
      payload: {
        searchName: value.target.value
      },
    })
  }
  
  const handleOnSearch = (name) => {
		if(name || searchName){
			queryParam.key = name;
      dispatch({
        type: 'feeLoan/getLoanList',
        payload: {
          ...queryParam,
        },
      })
		}
	}

  const handleQueryLoan = () => {
    dispatch({
      type: 'feeLoan/getLoanList',
      payload: {
        ...queryParam,
      },
    })
  }

  const handlePrint = () => {
		const prnhtml = window.document.getElementById('prn').innerHTML
    window.document.getElementById('printArea').innerHTML = prnhtml
    dispatch({
      type: 'feeLoan/updateState',
      payload: {
        printCheck: 0,
      },
    })
    setTimeout(() => {
      dispatch({
        type: 'feeLoan/print'
      })
    }, 500)
  }
  
  const handlePrintResult = (rs) => {
		if(rs){
      //打印成功
      dispatch({
        type: 'feeLoan/printSuccess',
        payload: {
          beginNo: settingData.beginNo,
          missionId: settingData.missionId,
          orderNo: settingData.orderNo,
          settingId: settingData.settingId,
          receiptNo: settingData.receiptNo,
          billId: settingData.billId,
        },
      })
		}else{
      //打印失败
      dispatch({
        type: 'feeLoan/updateState',
        payload: {
          printCheck: 0,
        },
      })
		}
  }
  
  const handleShowImport = () => {
    dispatch({
      type: 'feeLoan/updateState',
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
  

  const handleCancelLoanVisibleChange = (value) => {
    cancelLoanData.visible = value
    dispatch({
      type: 'feeLoan/updateState',
      payload: {
        cancelLoanData
      },
    })
  }

  const handleChangeCancelRemark = (e) => {
		cancelLoanData.cancelRemark = e.target.value
		dispatch({
      type: 'feeLoan/updateState',
      payload: {
        cancelLoanData
      },
    })
	}

	const handleCancelLoan = () => {
		if(!cancelLoanData.cancelRemark){
			message.error("请输入作废理由")
			return
    }
    if(dataLoading){
      message.error("请不要重复提交")
			return
    }
    dispatch({
      type: 'feeLoan/cancelLoan',
      payload: {
        orderNo:selectedLoans.toString(),
        remark:cancelLoanData.cancelRemark
      },
    })
	}

  const renderCancelLoan = () => {
		return(
			<div>
				<div>请输入作废理由：</div>
				<TextArea style={{marginTop:'5px'}} value={cancelLoanData.cancelRemark} onChange={e=>handleChangeCancelRemark(e)}/>
				<div style={{ marginTop: '20px', textAlign: 'center' }}>
				<Button size="small" style={{ marginRight: '10px' }} onClick={()=>handleCancelLoanVisibleChange(false)}>取消</Button>
				<Button type="primary" size="small" onClick={()=>handleCancelLoan()}>确定</Button>
				</div>
			</div>
		)
	}
  
  const createYearOption = () => {
    const options = [];
    if(yearList){
      for(let index of yearList){
        options.push(<Option key={index.year} value={index.year} title={getYearFormat(index.year)}>{getYearFormat(index.year)}</Option>)
      }
    }
		return options;
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
            <div className={styles.sortTextW}>贷款日期:</div>
                <RangePicker
                  disabled={dataLoading}
                  showTime={{ format: 'HH:mm:ss',defaultValue:[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}}
                  defaultValue={[beginDate?moment(beginDate):'', endDate?moment(endDate):'']}
                  disabledDate={current=>{return current && current > moment().endOf('day')}}
                  format="YYYY-MM-DD HH:mm:ss" 
                  placeholder={['开始时间', '结束时间']}
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
            <div className={styles.sortText}>学年:</div>
                  <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={year} className={styles.sortSelectMuti} placeholder={"选择学年"} onChange={handleChangeYear}>
                  {createYearOption()}
                  </Select>
          </div>
        ),
      },{
        id:i++,
        content:(
          <div className={styles.sortCol}>
             <div className={styles.sortText}>任务名称:</div>
                  <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={missionId} className={styles.sortSelectMuti} placeholder={"选择任务"} onChange={handleChangeMission}>
                  {createMissionOption()}
                  </Select>
          </div>
        )
      },{
        id:i++,
        content:(
          <div className={styles.sortCol} >
            <div className={styles.sortText}>项目名称:</div>
                  <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={subjectId} className={styles.sortSelectMuti} placeholder={"选择项目"} onChange={handleChangeSubject}>
                  {createSubjectOption()}
                  </Select>
          </div>
        )
      },{
        id:i++,
        content:(
          <div className={styles.sortCol} >
            <div className={styles.sortText}>状态:</div>
                  <Select disabled={dataLoading} allowClear={true} value={status} className={styles.sortSelectMuti} placeholder={"选择状态"} onChange={handleChangeStatus}>
                    <Option key={2} value={2} title={'正常'}>正常</Option>
                    <Option key={0} value={0} title={'已作废'}>已作废</Option>
                    <Option key={5} value={5} title={'已驳回'}>已驳回</Option>
                    <Option key={4} value={4} title={'审核中'}>审核中</Option>
                  </Select>
          </div>
        )
      }
    ]
      for(let attr of userSortList){
        i++
        if(attr.id == 'orderNo'){
          list.push({
            id:i,
            content:(<div className={styles.sortCol}>
                      <div className={styles.sortText}>{attr.name}:</div>
                      <Input disabled={dataLoading} value={orderNo} className={styles.sortSelectMuti} onChange={(e) => handleChangeOrderNo(e.target.value)}></Input>
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
        <Button className={styles.inquery} type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQueryLoan} >{dataLoading?'':'查询'}</Button>
				<Button className={styles.reset} onClick={handleResetQueryLoan} disabled={dataLoading} >重置</Button>
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
              <Button type="primary" style={{ marginRight: '15px', marginBottom:isNavbar?'10px':undefined }} onClick={handleShowImport}>贷款导入</Button>
              <Popover title="作废确认" trigger="click" placement="top"
                content={renderCancelLoan()}
                visible={cancelLoanData.visible?cancelLoanData.visible:false}
                onVisibleChange={e=>handleCancelLoanVisibleChange(e)}
              ><Button type="primary" style={{ marginRight: '15px' }} disabled={selectedLoans.length == 0}>作废</Button></Popover>
              <div style={{width: isNavbar?'100%':'250px',display:'inline-blck',float: 'right'}}>
                <Search enterButton placeholder="搜索" value={searchName} onChange={(value)=>{handleChangeSearchName(value)}} onSearch={(value) => handleOnSearch(value)} style={{ float: 'right', width: isNavbar?'calc(100% - 50px)':'200px' }} />
                <UserDisplay {...userDisplayProps} />
              </div>
            </Row>
            <Row><UserTable {...userTableProps} /></Row>
            </div>
          </Card>
        </Col>
      </Row>
      {printCheck!=0&&<Modal visible={true} title={"打印确认"} footer={null} maskClosable={false} onCancel={()=>{handlePrintResult(false)}} width={'700px'}>
		<Row style={{margin: 'auto', left: 0, right: 0, width:'600px'}}>
		<div style={{width:'600px'}}>
			<div style={{background:'url('+textData.imgUrl+') no-repeat', backgroundSize:'100%'}}>
			<Print textData={textData} getHeight={getHeight} templateHeight={templateHeight} settingData={settingData} />
			</div>
		</div>
		</Row>
		<Row style={{marginTop:'60px', textAlign:'center'}}>
		{printCheck==1&&<Button type="primary" onClick={()=>{handlePrint()}}>确认打印</Button>}
		{printCheck==2&&<Button onClick={()=>{handlePrintResult(false)}} style={{marginRight:'10px'}}>打印失败</Button>}
		{printCheck==2&&<Button type="primary" onClick={()=>{handlePrintResult(true)}}>打印成功</Button>}
		</Row>
		</Modal>}
      { modalVisible && <UserModal {...userModalProps} /> }
    </Page>
  )
}

FeeLoan.propTypes = {
  feeLoan: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ feeLoan, app, loading }) => ({ feeLoan, app, loading }))(FeeLoan)
