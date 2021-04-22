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

const FeeSubsidy = ({
  location, dispatch, feeSubsidy, loading, app
}) => {
  const {
    modalVisible,  modalImportData,
    displaySence, sortSence, userSortExtra,
    searchName, pageNum, pageSize, subsidyType, accountId, missionId, subjectId, status, year, beginDate, endDate,
    subsidyList, count, dataLoading,selectedSubsidys,
    printCheck, textData, templateHeight, settingData, cancelSubsidyData,
    sortFlag, orderNo, 
  } = feeSubsidy

  const { userDisplaySence, userAttrList, userAttrMap, isNavbar, requestMap } = app
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}

  const missionList = requestMap['missionList']
  const missionMap = requestMap['missionMap']
  const subjectList = requestMap['subjectList']
  const subjectMap = requestMap['subjectMap']
  const accountList = requestMap['accountList']
  const yearList = requestMap['yearList']
  const subsidyTypeList = requestMap['subsidyTypeList']

  const queryParam = {
    key:searchName,
		pageNum,
		pageSize,
		missionId,
		sortList: userSortList,
		accountId: userSortMap['accountId']?userSortMap['accountId']._idSelected:undefined,
    subjectId,
    status,
    subsidyType: userSortMap['subsidyType']?userSortMap['subsidyType']._idSelected:undefined,
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
      dispatch({type: 'feeSubsidy/updateSort'})  // 更多筛选加蒙版
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
      dispatch({type: 'feeSubsidy/updateSort'})  // 加蒙版
    },
  }

  const userTableProps = {
    dataSource: subsidyList,
    count,
    pageNum,
    pageSize,
    userDisplayList,
    userDisplayMap,
    userAttrMap,
    dataLoading,
    subjectMap,
    selectedSubsidys,
    onChangePage (n, s) {
      dispatch({
        type: 'feeSubsidy/getSubsidyList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'feeSubsidy/updateState',
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
        type: 'feeSubsidy/updateState',
        payload: {
          modalVisible: false,
          modalType: '',
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'feeSubsidy/updateState',
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
          type: 'feeSubsidy/importSubsidy',
          payload: {
            file:modalImportData.excel.fileName,
            timer: setInterval(() => {
              dispatch({
                type: 'feeSubsidy/getImportSubsidyPrs'
              })
            }, 1500)
          },
        })
    },
    onImportCover (data) {
      dispatch({
        type: 'feeSubsidy/coverSubsidy',
        payload: {
          ...data,
          timer: setInterval(() => {
            dispatch({
              type: 'feeSubsidy/getImportSubsidyPrs'
            })
          }, 1500)
        },
      })
    },
    onGetSubject (record) {
      dispatch({
        type: 'feeSubsidy/getSubjectListByMission',
        payload: {
          missionId: record.missionId
        },
      })
    }
  }

  const handleChangeYear  = (value) => {
    dispatch({type: 'feeSubsidy/updateSort',payload:{year: value}})    //学年加蒙版
    // dispatch({
    //   type: 'feeSubsidy/updateState',
    //   payload:{
    //     year: value
    //   },
    // })
  }

  const handleChangeDate = (value) => {
    dispatch({
      type: 'feeSubsidy/updateSort',
      payload:{
        beginDate: value.length == 0?'':value[0].format('YYYY-MM-DD HH:mm:ss'),
        endDate: value.length == 0?'':value[1].format('YYYY-MM-DD HH:mm:ss'),
      },
    })
	}

  const handleChangeStatus = (value) => {
    dispatch({type: 'feeSubsidy/updateSort',payload:{status: value}})    //状态加蒙版
    // dispatch({
    //   type: 'feeSubsidy/updateState',
    //   payload:{
    //     status: value
    //   },
    // })
  }
  
  const handleClickAccount = () => {
		if(!accountList || accountList.length <= 0){
      dispatch({
        type: 'feeSubsidy/getAccountList',
      })
		}
	}
  const handleChangeAccount = (value) => {
    dispatch({type: 'feeSubsidy/updateSort',payload:{accountId: value}})    //经办人加蒙版
    // dispatch({
    //   type: 'feeSubsidy/updateState',
    //   payload:{
    //     accountId: value
    //   },
    // })
  }

  const handleChangeOrderNo = (value) => {
    dispatch({type: 'feeSubsidy/updateSort',payload:{orderNo: value}})  // 订单号加蒙版
	}
  
  const handleClickSubsidyType = () => {
		if(!subsidyTypeList || subsidyTypeList.length <= 0){
      dispatch({
        type: 'feeSubsidy/getSubsidyTypeList',
      })
		}
	}
  const handleChangeSubsidyType = (value) => {
    dispatch({type: 'feeSubsidy/updateSort',payload:{subsidyType: value}})    //类型加蒙版
    // dispatch({
    //   type: 'feeSubsidy/updateState',
    //   payload:{
    //     subsidyType: value
    //   },
    // })
	}

  const handleChangeMission = (value) => {
    dispatch({type: 'feeSubsidy/updateSort',payload:{missionId: value}})    //任务名称加蒙版
    // dispatch({
    //   type: 'feeSubsidy/updateState',
    //   payload:{
    //     missionId: value
    //   },
    // })
	}

	const handleChangeSubject = (value) => {
    dispatch({type: 'feeSubsidy/updateSort',payload:{subjectId: value}})    //项目名称加蒙版
    // dispatch({
    //   type: 'feeSubsidy/updateState',
    //   payload:{
    //     subjectId: value
    //   },
    // })
	}

  const handleClickSort = (attr) => {
    if (!attr._selectList || attr._selectList.length <= 0) {
      dispatch({
        type: 'app/getAttrRelateList',
        payload: {
          attrId: attr.id,
          sence: sortSence
        },
      })
    }
  }

  const handleSearchSort = (attr, value) => {
    dispatch({
      type: 'app/getAttrRelateList',
      payload: {
        attrId: attr.id,
        key:value,
        sence: sortSence
      },
    })
  }

  const handleChangeSort = (value, attr) => {
    userSortMap[attr.id]._idSelected = value
    dispatch({type: 'feeSubsidy/updateSort'})    //院系加蒙版
    // dispatch({
    //   type: 'feeSubsidy/updateState',
    //   payload: {
    //   },
    // })
  }

  const handleResetQuerySubsidy = () => {
    for (let sort of userSortList) {
      if (sort._idSelected) {
        sort._idSelected = []
      }
    }
    dispatch({type: 'feeSubsidy/updateSort',    //重置加蒙版
      payload: {
        userSortList,
        accountId: [],
        status: undefined,
        subjectId:undefined,
        missionId:undefined,
        subsidyType: undefined,
      },
    })
    // dispatch({
    //   type: 'feeSubsidy/updateState',
    //   payload: {
    //     userSortList,
    //     accountId: [],
    //     status: undefined,
    //     subjectId:undefined,
    //     missionId:undefined,
    //     subsidyType: undefined,
    //   },
    // })
  }

  const handleChangeSearchName = (value) =>{
    dispatch({
      type: 'feeSubsidy/updateState',
      payload: {
        searchName: value.target.value
      },
    })
  }
  
  const handleOnSearch = (name) => {
		if(name || searchName){
			queryParam.key = name;
      dispatch({
        type: 'feeSubsidy/getSubsidyList',
        payload: {
          ...queryParam,
        },
      })
		}
	}

  const handleQuerySubsidy = () => {
    dispatch({
      type: 'feeSubsidy/getSubsidyList',
      payload: {
        ...queryParam,
      },
    })
  }

  const handlePrint = () => {
		const prnhtml = window.document.getElementById('prn').innerHTML
    window.document.getElementById('printArea').innerHTML = prnhtml
    dispatch({
      type: 'feeSubsidy/updateState',
      payload: {
        printCheck: 0,
      },
    })
    setTimeout(() => {
      dispatch({
        type: 'feeSubsidy/print'
      })
    }, 500)
  }
  
  const handlePrintResult = (rs) => {
		if(rs){
      //打印成功
      dispatch({
        type: 'feeSubsidy/printSuccess',
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
        type: 'feeSubsidy/updateState',
        payload: {
          printCheck: 0,
        },
      })
		}
  }
  
  const handleShowImport = () => {
    dispatch({
      type: 'feeSubsidy/updateState',
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
  

  const handleCancelSubsidyVisibleChange = (value) => {
    cancelSubsidyData.visible = value
    dispatch({
      type: 'feeSubsidy/updateState',
      payload: {
        cancelSubsidyData
      },
    })
  }

  const handleChangeCancelRemark = (e) => {
		cancelSubsidyData.cancelRemark = e.target.value
		dispatch({
      type: 'feeSubsidy/updateState',
      payload: {
        cancelSubsidyData
      },
    })
	}

	const handleCancelSubsidy = () => {
		if(!cancelSubsidyData.cancelRemark){
			message.error("请输入作废理由")
			return
    }
    if(dataLoading){
      message.error("请不要重复提交")
			return
    }
    dispatch({
      type: 'feeSubsidy/cancelSubsidy',
      payload: {
        orderNo:selectedSubsidys.toString(),
        remark:cancelSubsidyData.cancelRemark
      },
    })
	}

  const renderCancelSubsidy = () => {
		return(
			<div>
				<div>请输入作废理由：</div>
				<TextArea style={{marginTop:'5px'}} value={cancelSubsidyData.cancelRemark} onChange={e=>handleChangeCancelRemark(e)}/>
				<div style={{ marginTop: '20px', textAlign: 'center' }}>
				<Button size="small" style={{ marginRight: '10px' }} onClick={()=>handleCancelSubsidyVisibleChange(false)}>取消</Button>
				<Button type="primary" size="small" onClick={()=>handleCancelSubsidy()}>确定</Button>
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

  const createAccountOption = () => {
		const options = [];
		if(accountList){
		  for(let select of accountList){
				options.push(<Option key={select.id} value={select.id} title={select.loginName+'('+select.name+')'}>{select.loginName+'('+select.name+')'}</Option>)
		  }
		  return options;
		}
		return null;
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

  const getHeight = (value)=>{
    dispatch({
      type: 'feeSubsidy/updateState',
      payload:{
        templateHeight: value
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
            <div className={styles.sortTextW}>操作日期:</div>
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
        <Button className={styles.inquery} type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQuerySubsidy} >{dataLoading?'':'查询'}</Button>
				<Button className={styles.reset} onClick={handleResetQuerySubsidy} disabled={dataLoading} >重置</Button>
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
              <Button type="primary" style={{ marginRight: '15px', marginBottom:isNavbar?'10px':undefined }} onClick={handleShowImport}>奖助学金导入</Button>
              <Popover title="作废确认" trigger="click" placement="top"
                content={renderCancelSubsidy()}
                visible={cancelSubsidyData.visible?cancelSubsidyData.visible:false}
                onVisibleChange={e=>handleCancelSubsidyVisibleChange(e)}
              ><Button type="primary" style={{ marginRight: '15px' }} disabled={selectedSubsidys.length == 0}>作废</Button></Popover>
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

FeeSubsidy.propTypes = {
  feeSubsidy: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ feeSubsidy, app, loading }) => ({ feeSubsidy, app, loading }))(FeeSubsidy)
