	import React from 'react'
	import PropTypes from 'prop-types'
	import { connect } from 'dva'
	import { Row, Col, Button, Card, Input, Popover, Divider, Select, Spin, Tag, Icon, Menu, Dropdown } from 'antd'
	import { Page, UserSort, UserDisplay, UserSortLayer } from 'components'
	import queryString from 'query-string'
	import { routerRedux } from 'dva/router'
	import { getFormat, config, getYearFormat } from 'utils'
	import styles from '../common.less'
	import VerifySubjectTable from './VerifySubjectTable'
	import VerifySubjectModal from './VerifySubjectModal'

	const Option = Select.Option
	const { Search } = Input;

	const VerifySubject = ({
	location, dispatch, verifySubject, loading, app
	}) => {
	const { isNavbar, requestMap } = app
	const {
		 missionId, subjectId, year, modalVisible, modalData,
		pageNum, pageSize, count, sortFlag, dataLoading, searchName,
		list, modalType, modalVerify,
	} = verifySubject

	const missionList = requestMap['missionList']
  const subjectList = requestMap['subjectList']
  const accountList = requestMap['accountList']
  const yearList = requestMap['yearList']

	const queryParam = {
		key:searchName,
		pageNum,
		pageSize,
		missionId,
		subjectId,
		year,
	}

	const verifySubjectTableProps = {
			dataSource: list,
			dataLoading,
			count, pageNum, pageSize,
			onEidt (data) {
				dispatch({
					type: 'verifySubject/showModal',
					payload: {
						modalVerify: data,
						modalType: 'eidt',
					},
				})
			},
			onStatInfo (data) {
				dispatch(routerRedux.push({
					pathname: '/verifySubjectStat',
					search: queryString.stringify({
            missionId: data.missionId,
            subjectId: data.subjectId
					}),
				}))
			},
			onDeleteVerfy (data) {
				dispatch({
					type: 'verifySubject/deleteVerifySubject',
					payload: {
						...data
					},
				})
			},
			onChangePage (n, s) {
				dispatch({
					type: 'verifySubject/getDataList',
					payload: {
						...queryParam,
						pageNum: n,
						pageSize: s,
					},
				})
			},
	}

	const ModalProps = {
		missionList,
		subjectList,
		accountList,
		yearList,
    modalVisible,
		dataLoading,
		modalVerify,
		modalType,
		modalData,
		onSubmit (data) {
			dispatch({
				type: 'verifySubject/VerifySubjected',
				payload: {
					...data,
				},
			})
			dispatch({
				type: 'verifySubject/hideModal',
			})
		},
		onHideModal () {
			dispatch({
				type: 'verifySubject/hideModal',
			})
		},
		onClose () {
      dispatch({
        type: 'verifySubject/hideModal',
      })
		},
		onYearChange (value) {
			//清空任务、项目
			modalData.subjectList = []
			modalData.year = value
			modalData.subjectDisable = true
			dispatch({
				type: 'verifySubject/updateState',
				payload: {
					modalData
				},
			})
		},
		onMissionChange (value) {
			//项目
			modalData.subjectList = []
			modalData.subjectDisable = true
			dispatch({
				type: 'verifySubject/updateState',
				payload: {
					modalData
				},
			})

			if(value){
				dispatch({
					type: 'verifySubject/getSubjectByMission',
					payload: {
						missionId: value
					},
				})
			}
		},
  }

	const handleResetQuery = () => {
		dispatch({type: 'verifySubject/updateSort',
			payload: {
				missionId: undefined,
				subjectId: undefined,
				year: undefined
			},
		})
	}

	const handleChangeYear = (value) => {
		dispatch({type: 'verifySubject/updateSort', payload:{year: value},})    //学年加蒙版
	}

	const handleChangeMission = (value) => {
		dispatch({type: 'verifySubject/updateSort',payload:{missionId: value}})   //任务名称加蒙版
	}

	const handleChangeSubject = (value) => {
		dispatch({type: 'verifySubject/updateSort',payload:{subjectId: value}})   //项目名称加蒙版
	}

	const handleQueryData = () => {
		dispatch({
			type: 'verifySubject/getDataList',
			payload: {
					...queryParam
			},
		})
	}

	const handleChangeSearchName = (value) => {
		dispatch({
			type: 'verifySubject/updateState',
			payload: {
				searchName: value.target.value
			},
		})
	}

	const handleOnSearch = (value) => {
    dispatch({
			type: 'verifySubject/getDataList',
			payload: {
					...queryParam
			},
		})
	}
	
	const handleOnAdd = () => {
		dispatch({
			type: 'verifySubject/updateState',
			payload: {
				modalType: 'add',
				modalVisible: true,
				modalData:{
					missionId: undefined,
					year: undefined,
					subjectId: undefined,
					accountId: undefined,
					subjectDisable: true,
				}
			},
		})
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
							<div className={styles.sortText}>学年:</div>
							<Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={year} className={styles.sortSelectMuti} placeholder={"选择学年"} onChange={handleChangeYear}>
							{createYearOption()}
							</Select>
					</div>
					)
			},{
					id:i++,
					content:(
							<div className={styles.sortCol} >
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
				},
			]
					return list
	}

	const layerProps = {
			list: createSort(),
			query:(<div className={styles.queryBox} style={{textAlign:'right', paddingRight: '5%'}}>
					<Button className={styles.inquery} type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQueryData}>{dataLoading?'':'查询'}</Button>
					<Button className={styles.reset} onClick={handleResetQuery} disabled={dataLoading} style={{ marginRight: '10px' }}>重置</Button>
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
									<Button icon="plus" onClick={() => { handleOnAdd() }} type="primary" style={{marginBottom:isNavbar?'10px':undefined}}>添加</Button>
									<div style={{width: isNavbar?'100%':'240px',display:'inline-blck',float: 'right'}}>
											<Search enterButton placeholder="搜索" value={searchName} onChange={handleChangeSearchName} onSearch={value => handleOnSearch(value)} style={{ width: isNavbar?'100%':200, float: 'right' }} />
									</div>
									</Row>
									<Row>
										<VerifySubjectTable {...verifySubjectTableProps} />
									</Row>
							</div>
					</Card>
			</Col>
			</Row>
			{ modalVisible && <VerifySubjectModal {...ModalProps} /> }
	</Page>
	)
	}


	VerifySubject.propTypes = {
	verifySubject: PropTypes.object,
	location: PropTypes.object,
	dispatch: PropTypes.func,
	loading: PropTypes.object,
	}

	export default connect(({ verifySubject, app, loading }) => ({ verifySubject, app, loading }))(VerifySubject)
