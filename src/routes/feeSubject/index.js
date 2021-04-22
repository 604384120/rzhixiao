import { Tree } from 'antd'
import React from 'react'
import Mock from 'mockjs'
import { Row, Col, Card, Button, Input, Select, Divider } from 'antd'
import { Page, UserSort, UserSortLayer } from 'components'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import FeeSubjectTable from './FeeSubjectTable'
import SchoolTree from './SchoolTree'
import styles from '../common.less'
import FeeSubjectModal from './FeeSubjectModal'

const Search = Input.Search

const FeeSubject = ({
  location,
  dispatch,
  feeSubject,
  loading,
  app,
}) => {
  const {
    count, list, searchName, dataLoading, isAdmin, departs, type, templateId, mchId, sortFlag, displaySence, sortSence, userSortExtra, pageNum, pageSize, visible, record,
  } = feeSubject

  const { user, isNavbar, requestMap } = app
  const templateList = requestMap['template']
  const mchList = requestMap['mch']
  const departTree = requestMap['departTree']
  const departMap = requestMap['departMap']

  const queryParam = {
    departId: departs[0],
    name:searchName,
		pageNum,
    pageSize,
    type,
    templateId,
    mchId,
  }

  const SchoolTreeProps = {
    departTree,
    schoolName: user.schoolName,
    departs,
    user,
    onSelectDepart (data) {
      if(data[0] == '0'){
        dispatch({
          type: 'feeSubject/updateState',
          payload: {
            departs: []
          },
        })
        return
      }else{
        queryParam.departId = data[0]
        dispatch({
          type: 'feeSubject/getSubjectList',
          payload: {
            ...queryParam,
          },
        })
      }
    },
  }

  const feeSubjectTableProps = {
    dataSource: list,
    count,
    schoolName: user.schoolName,
    departTree,
    departMap,
    dataLoading,
    templateList,
    mchList,
    isAdmin,
    pageSize,
    pageNum,
    onChangePage (n, s) {
      dispatch({
        type: 'feeSubject/getSubjectList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
        },
      })
    },
    onUpdateDataSource (data) {
      dispatch({
        type: 'feeSubject/updateState',
        payload: {
          list: data,
        },
      })
    },
    onAddSubject (data) {
      dispatch({
        type: 'feeSubject/addSubject',
        payload: {
          subject: data,
        },
      })
    },
    onSaveSubject (data) {
      dispatch({
        type: 'feeSubject/updateSubject',
        payload: {
          subject: data,
        },
      })
    },
    onDeleteSubject (data) {
      dispatch({
        type: 'feeSubject/deleteSubject',
        payload: {
          subject: data,
        },
      })
    },
    onShowModal: (visible,text,record) => {
      dispatch({
        type: 'feeSubject/updateState',
        payload: {
          visible,
          text,
          record
        },
      })
    },
  }

  const modalProps = {
    visible,
    record,
    onhandleClose : (visible) => {
      dispatch({
        type: 'feeSubject/updateState',
        payload: {
          visible : !visible
        },
      })
    },

    onSubmit (visible,datas) {
      let data = {
        id : datas.id,
        name : datas.name,
        status : datas.status,
        info : JSON.stringify(datas.info)
      }
      dispatch({
        type: 'feeSubject/updateTemplateList',
        payload: {
          ...data
        },
      })
      dispatch({
        type: 'feeSubject/updateState',
        payload: {
          visible : visible
        },
      })
    }
  }

  const handleOnAdd = () => {
    if (list.length == 0 || !list[0]._add) {
      const newSub = {
        id: '',
        name: '',
        createDate: '',
        status: '1',
        accountName: user.username,
        type: '1',
        _editable: true,
        _add: true,
        _tempSource: {
          id: '',
          name: '',
          status: '1',
          type: '1',
          accountName: user.username,
        },
      }
      list.unshift(newSub)
      dispatch({
        type: 'feeSubject/updateState',
        payload: {
          list,
        },
      })
    }
  }

  const handleChangeSearchName = (value) =>{
    dispatch({
      type: 'feeSubject/updateState',
      payload: {
        searchName: value.target.value
      },
    })
  }

  const handleOnSearch = (name) => {
    if (name || searchName) {
      queryParam.name = name
      dispatch({
        type: 'feeSubject/getSubjectList',
        payload: {
          ...queryParam,
        },
      })
    }
  }

  const handleQuery = () => {
    dispatch({
      type: 'feeSubject/getSubjectList',
      payload: {
        ...queryParam,
      },
    })
  }

  const handleResetQuery = () => {
    dispatch({
      type: 'feeSubject/updateSort',
      payload: {
        templateId: undefined,
        mchId: undefined,
        type: undefined,
      },
    })
  }

  const handleChangeNature = (value) => {
    dispatch({
      type: 'feeSubject/updateSort',
      payload:{
        type: value
      },
    })
  }

  const handleChangeTemplate = (value) => {
    dispatch({
      type: 'feeSubject/updateSort',
      payload:{
        templateId: value
      },
    })
  }

  const handleChangeMch = (value) => {
    dispatch({
      type: 'feeSubject/updateSort',
      payload:{
        mchId: value
      },
    })
  }

  const createTemplateOption = () => {
		const options = []
		if(templateList){
			for (let select of templateList) {
        options.push(<Option key={select.id} value={select.id} title={select.name}>{select.name}</Option>)
			}
			return options
		}
		return null;
  }
  
  const createMchOption = () => {
		const options = []
		if(mchList){
			for (let select of mchList) {
				options.push(<Option key={select.id} value={select.id} title={select.name}>{select.name}</Option>)
			}
			return options
		}
		return null;
  }

  const createSort = () => {
    let i = 0
    const list = [
      {
        id:i++,
        content:(
          <div className={styles.sortCol}>
             <div className={styles.sortText}>收费性质:</div>
                <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={type} className={styles.sortSelectMuti} placeholder={"选择收费性质"} onChange={handleChangeNature}>
                  <Option value="1" title={'行政事业性收费'}>行政事业性收费</Option>
      						<Option value="2" title={'非行政事业性收费'}>非行政事业性收费</Option>
                </Select>
          </div>
        )
      },{
        id:i++,
        content:(
          <div className={styles.sortCol} >
            <div className={styles.sortText}>票据类型:</div>
                <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={templateId} className={styles.sortSelectMuti} placeholder={"选择票据类型"} onChange={handleChangeTemplate}>
                {createTemplateOption()}
                </Select>
          </div>
        )
      },{
        id:i++,
        content:(
          <div className={styles.sortCol} >
            <div className={styles.sortText}>收款账户:</div>
                <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={mchId} className={styles.sortSelectMuti} placeholder={"选择收款账户"} onChange={handleChangeMch}>
                {createMchOption()}
                </Select>
          </div>
        )
      },
    ]
      return list
  }

  const layerProps = {
    list: createSort(),
    query:(<div className={styles.queryBox}>
        <Button className={styles.inquery} type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQuery}>{dataLoading?'':'查询'}</Button>
				<Button className={styles.reset} onClick={handleResetQuery} disabled={dataLoading}>重置</Button>
    </div>),
  }

  return (
    <Page inner>
      {sortFlag&&<div className={styles.masking}></div>}
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
                <Row>
                  {isAdmin == '1' ? <Button icon="plus" onClick={() => { handleOnAdd() }} type="primary" style={{ marginBottom: '10px' }} >添加收费项目</Button> : <Button icon="plus" type="primary" style={{ marginBottom: '20px', visibility: 'hidden' }} >添加收费项目</Button>}
                  <Search enterButton placeholder="搜索" value={searchName} onChange={(value)=>{handleChangeSearchName(value)}} onSearch={value => handleOnSearch(value)} style={{ float: 'right', width: isNavbar?'calc(100% - 50px)':'200px' }} />
                </Row>
                <FeeSubjectTable {...feeSubjectTableProps} />
              </div>
            </Row>
          </Card>
        </Col>
      </Row>
      {visible&&<FeeSubjectModal {...modalProps}></FeeSubjectModal>}
    </Page>
  )
}

FeeSubject.propTypes = {
  feeSubject: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default connect(({ feeSubject, app, loading }) => ({ feeSubject, app, loading }))(FeeSubject)

