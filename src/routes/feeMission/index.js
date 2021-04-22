import React from 'react'
import { Row, Col, Card, Button, Input, Divider, message, Select, Cascader } from 'antd'
import { Page, UserSortLayer } from 'components'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import FeeMissionTable from './FeeMissionTable'
import FeeMissionModal from './FeeMissionModal'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import styles from "../common.less"
import moment from 'moment'
import { getYearFormat } from 'utils'
import SchoolTree from './SchoolTree'

const Search = Input.Search
const Option = Select.Option

const FeeMission = ({
  location,
  dispatch,
  feeMission,
  loading,
  app,
}) => {
  const { isNavbar, user, requestMap } = app
  const {
    modalVisible,
    ModalType,
    modalData,
    count,pageNum,pageSize,list,
    dataLoading,searchName,accountList,
    creditBatchList,templateList,
    subjectList,subjectMap,
    cgNum,
    departId,
    gradeList,
    year,
    sortFlag,
  } = feeMission

  const departTree = requestMap['departTree']
  const departMap = requestMap['departMap']
  const yearList = requestMap['yearList']

  const queryParam = {
		pageNum,
		pageSize,
    departId,
    year,
    name:searchName
  }
  const feeMissionTableProps = {
    dataSource: list,
    count,
    pageNum,
    pageSize,
    dataLoading,
    user,
    onChangePage (n, s) {
      dispatch({
        type: 'feeMission/getMissionList',
        payload: {
          pageNum: n,
          pageSize: s,
          name: searchName,
        },
      })
    },
    OnSwitchMissionStatus (data, status) {
      dispatch({
        type: 'feeMission/updateMissionStatus',
        payload: {
          mission: data,
          status,
        },
      })
    },
    
    onEditMission (data) {
      dispatch(routerRedux.push({
        pathname: '/feeMissionInfo',
        search: queryString.stringify({
          missionId: data.id,
        }),
      }))
    },
    onDeleteMission (data) {
      dispatch({
        type: 'feeMission/deleteMission',
        payload: {
          mission: data,
        },
      })
    },
  }

  const feeMissionModalProps = {
    modalVisible,ModalType,
    accountList,templateList,creditBatchList,
    subjectList,subjectMap,gradeList,departTree,departMap,
    ...modalData,
    user,
    cgNum,
    onGetCreditBatchList(){
      dispatch({
        type: 'feeMission/getCreditBatchList',
      })
    },
    onMergeInpVisible(mergeInpVisible) {  // 输入框输入内容时候updateState记录value
      modalData.mergeInpVisible = mergeInpVisible
      dispatch({
        type: 'feeMission/updateState',
        payload: {
          modalData,
        },
      })
    },
    onUpdateState(data) {
      dispatch({
        type: 'feeMission/updateState',
        payload: {
          modalData: {...modalData, ...data}
        },
      })
    },
    onStep1Ok (data) {
      data.step = 1
      dispatch({
        type: 'feeMission/getSubjectList',
        payload: {
          modalData: {...modalData, ...data}
        },
      })
    },
    onStep2Ok (data) {
      if (ModalType == 'add') {
        if(dataLoading){
          message.error("请不要重复点击")
          return
        }
        let hasCredit = data.hasCredit
        dispatch({
          type: 'feeMission/addMission',
          payload: {
            ...data,
            timer: hasCredit?setInterval(() => {
              dispatch({
                type: 'feeMission/getCreateBillsPrs',
                payload: {},
              })
            }, 1500):null
          },
        })
        if(hasCredit){
          dispatch({
            type: 'feeMission/updateState',
            payload: {
              modalVisible: true,
              ModalType: 'addbill',
              cgNum: 0,
            },
          })
        }
      }
    },
    onClose () {
      dispatch({
        type: 'feeMission/hideModal',
      })
    },
    onAddSubject (record) {
      const target = subjectList.filter(item => record.id === item.id)[0]
      if (target) {
        target._editable = false
        modalData.subjectSelectedList.push(target)
        modalData.subjectSelectedTemp = null
        modalData.optionalSubjectSelectedTemp = modalData.optionalSubjectSelectedTemp&&record.id==modalData.optionalSubjectSelectedTemp.id?null:modalData.optionalSubjectSelectedTemp,
        dispatch({
          type: 'feeMission/updateState',
          payload: {
            subjectList,
            modalData
          },
        })
      }
    },
    onAddSubjectOptional (record) {
      const target = subjectList.filter(item => record.id === item.id)[0]
      if (target) {
        target._editable = false
        modalData.optionalSubjectSelectedList.push(target)
        modalData.subjectSelectedTemp = modalData.subjectSelectedTemp&&record.id==modalData.subjectSelectedTemp.id?null:modalData.subjectSelectedTemp,
        modalData.optionalSubjectSelectedTemp = null
        dispatch({
          type: 'feeMission/updateState',
          payload: {
            subjectList,
            modalData
          },
        })
      }
    },
    onChangeSubjectSelectedDefault (record, checked) {                                        //默认
      const target = modalData.subjectSelectedList.filter(item => record.id === item.id)[0]
      target._default = checked;                                                              //checked是改变后的值
      if(checked){                                                                            
        target._defaultl = false;
      }
      dispatch({
        type: 'feeMission/updateState',
        payload: {
          modalData,
        },
      })
    },

    onChangeSubjectSelectedDefaultl (record, checked) {                                         //分期
      const target = modalData.subjectSelectedList.filter(item => record.id === item.id)[0]              //filter创建新数组,返回item
      target._defaultl = checked;
      if(checked){
        target._default = false;
      }
      dispatch({
        type: 'feeMission/updateState',
        payload: {
          modalData,
        },
      })
    },

    onDeleteSubject (record) {
      let i = 0
      for (let selected of modalData.subjectSelectedList) {
        if (selected.id == record.id) {
          const target = subjectList.filter(item => record.id === item.id)[0]
          if (target) {
            target._editable = true
            modalData.subjectSelectedList.splice(i, 1)
            modalData.mergeInpVisible = false  // 删除时候输入手机端显示名称的输入框不展示
            dispatch({
              type: 'feeMission/updateState',
              payload: {
                subjectList,
                modalData,
              },
            })
          }
          break
        }
        i++
      }
    },
    onDeleteSubjectOptional (record) {
      let i = 0
      for (let selected of modalData.optionalSubjectSelectedList) {
        if (selected.id == record.id) {
          const target = subjectList.filter(item => record.id === item.id)[0]
          if (target) {
            target._editable = true
            modalData.optionalSubjectSelectedList.splice(i, 1)
            dispatch({
              type: 'feeMission/updateState',
              payload: {
                subjectList,
                modalData
              },
            })
          }
          break
        }
        i++
      }
    },
    onSwapSelected (data) {
      modalData.subjectSelectedList = data
      dispatch({
        type: 'feeMission/updateState',
        payload: {
          modalData
        },
      })
    },
    onSwapSelectedOptional(data) {
      modalData.optionalSubjectSelectedList = data
      dispatch({
        type: 'feeMission/updateState',
        payload: {
          modalData
        },
      })
    },
    onBackStep1 () {
      modalData.step = 0
      dispatch({
        type: 'feeMission/updateState',
        payload: {
          modalData
        },
      })
    },
    onGetGradeList(data){
      dispatch({
        type: 'feeMission/getGradeList',
        payload: {
          ...data
        },
      })
    },
  }

  const SchoolTreeProps = {
    departTree,
    schoolName: user.schoolName,
    departId,
    user,
    onSelectDepart (data) {
      if(data[0] == '0'){
        dispatch({
          type: 'feeMission/updateState',
          payload: {
            departId: []
          },
        })
      }else{
        queryParam.departId = data
        dispatch({
          type: 'feeMission/getMissionList',
          payload: {
            ...queryParam
          },
        })
      }
    },
  }

  const handleAdd = () => {
    let year = moment().format('YYYY')
    dispatch({
      type: 'feeMission/showEditMission',
      payload: {
        modalData:{
          current: {},
          disableReceipt: false,
          step: 0,
          name: '',
          beginDate: null,
          endDate: null,
          templateId: '',
          receipt: '',
          chargeId: '',
          chargeName: '',
          subjectSelectedList: [],
          optionalSubjectSelectedList: [],
          year: `${moment().format('M') < 9?year- 1 : year}`,
          mergeInpVisible: false,  // 判断请输入手机端显示名称的输入框是否显示
          subjectSelectedTempData:{
            // default: true,
            required: false,
            modify: false,
            deferred: false,
            stand: (user.isStand=='1' && user.isAdmin!='1')?user.isStand:false,
            opStand: (user.isStand=='1' && user.isAdmin!='1')?user.isStand:false,
            default: 2,
          },
        },
        ModalType: 'add',
      },
    })
  }

  const handleChangeSearchName = (value) =>{
    dispatch({
      type: 'feeMission/updateState',
      payload: {
        searchName: value.target.value
      },
    })
  }

  const handleSearch = (name) => {
    if (name || searchName) {
      queryParam.name = name
      dispatch({
        type: 'feeMission/getMissionList',
        payload: {
          ...queryParam
        },
      })
    }
  }

  const handleResetQuery = () => {
    dispatch({
      type: 'feeMission/updateSort',
      payload: {
        departId: undefined,
        year: undefined,
      },
    })
  }

  const handleQueryData = () => {
    dispatch({
      type: 'feeMission/getMissionList',
      payload: {
        ...queryParam,
      },
    })
  }

  const handleChangeYear = (value) => {
    dispatch({type: 'feeMission/updateSort',payload:{year: value}})
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
  // const handleChangeDepart = (value) => {
  //   dispatch({type: 'feeMission/updateSort',payload:{departId: value}})
	// }
  // const getOptions = () => {
  //   if(user.departId && user.departId!="0"){
  //     //属于部门的从所属部门开始
  //     return departTree
  //   }
  //   //添加学校根结点
  //   let temp = [{
  //     value: '0',
  //     label: user.schoolName,
  //     children: departTree,
  //   }]
  //   return temp
  // }

  const createSort = () => {
    let i = 0
    const list = [
      {
        id:i++,
        content:(
          <div className={styles.sortCol}>
            <div className={styles.sortText}>学年:</div>
              <Select  mode="multiple" disabled={dataLoading} optionFilterProp="children" allowClear={true} value={year} className={styles.sortSelectMuti} placeholder={"选择学年"} onChange={handleChangeYear}>
              {createYearOption()}
              </Select>
          </div>
        ),
      }
      // ,{
      //   id:i++,
      //   content:(
      //     <div className={styles.sortCol}>
      //        <div className={styles.sortText}>部门:</div>
      //         <Cascader className={styles.sortSelectMuti} disabled={dataLoading} value={departId} options={getOptions()} placeholder="请选择部门" changeOnSelect onChange={handleChangeDepart}/>
      //     </div>
      //   ),
      //   length:2
      // }
    ]
      return list
  }

  const layerProps = {
    list: createSort(),
    query:(<div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop:'6px',overflow: 'hidden',textAlign: 'right' }}>
      <Button type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQueryData} style={{ marginRight: '10px',verticalAlign: 'middle',width:'62px' }}>{dataLoading?'':'查询'}</Button>
      <Button onClick={handleResetQuery} disabled={dataLoading} style={{ marginRight: '8%',verticalAlign: 'middle' }}>重置</Button>
    </div>),
  }

  return (
    <Page inner>
      {sortFlag&&<div style={{backgroundColor:"rgba(240, 242, 245, 0.5)", zIndex:800, position:'absolute', width:'100%', height:'100%', margin:'-24px'}}></div>}
      <Row gutter={16}>
        <Col>
          <Card bordered={false} bodyStyle={{ padding: ' 0' }}>
            <Divider style={{ margin: '5px' }} dashed />
            <UserSortLayer {...layerProps}/>
            <Divider style={{ margin: '5px' }} dashed />
            <Row>
              <div style={{width:'240px',float:'left'}}>
                <SchoolTree {...SchoolTreeProps} />
              </div>
              <div style={{width:"calc(100% - 240px)",float:'left',paddingLeft:'10px'}}>
                <div style={{overflow: 'hidden'}}>
                  <Button icon="plus" onClick={() => { handleAdd() }} type="primary" style={{ marginBottom: '10px' }} >添加收费任务</Button>
                  <div style={{width: isNavbar?'100%':'240px',display: 'inline-blck',float: 'right',marginBottom: '10px'}}>
                    <Search enterButton placeholder="搜索" value={searchName} onChange={(value)=>{handleChangeSearchName(value)}} onSearch={value => handleSearch(value)} style={{ width: '100%', float: 'right', marginBottom:isNavbar?'10px':undefined }} />
                  </div>
                </div>
                <FeeMissionTable {...feeMissionTableProps} />
              </div>
            </Row>
            
          </Card>
        </Col>
      </Row>
      { modalVisible && <FeeMissionModal {...feeMissionModalProps} /> }
    </Page>
  )
}

FeeMission.propTypes = {
  feeMission: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default connect(({ feeMission, app, loading }) => ({ feeMission, app, loading }))(FeeMission)

