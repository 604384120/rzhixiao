	import React from 'react'
	import PropTypes from 'prop-types'
	import { connect } from 'dva'
	import { Row, Col, Button, Card, Input, Popover, Divider, Select, Spin, Tag, Icon, Menu, Dropdown } from 'antd'
	import { Page, UserSort, UserDisplay, UserSortLayer } from 'components'
	import queryString from 'query-string'
	import { routerRedux } from 'dva/router'
	import styles from '../common.less'
	import JoinAccountTable from './JoinAccountTable'
	import JoinAccountModal from './JoinAccountModal'

	const Option = Select.Option
	const { Search } = Input;

	const JoinAccount = ({
	location, dispatch, joinAccount, loading, app
	}) => {
	const { isNavbar } = app
	const {
		status, pageNum, pageSize, count, sortFlag, dataLoading, searchName, modalVisible, modalData,
		dataList, modalList, modalType, accountId
	} = joinAccount

	const queryParam = {
		key:searchName,
		pageNum,
		pageSize,
		status,
	}

	const userTableProps = {
			dataSource: dataList,
			dataLoading,
			count, pageNum, pageSize,
			onStatInfo (data) {
				dispatch(routerRedux.push({
					pathname: '/joinAdminister',
					search: queryString.stringify({
						accountId: data.accountId,
					}),
				}))
			},
			onDeleteVerfy (data) {
				dispatch({
					type: 'joinAccount/deleteVerifySubject',
					payload: {
						...data
					},
				})
			},
			onChangePage (n, s) {
				dispatch({
					type: 'joinAccount/getDataList',
					payload: {
						...queryParam,
						pageNum: n,
						pageSize: s,
					},
				})
			},
			onLinks (record, type) {
				dispatch({
					type: 'joinAccount/showModal',
					payload: {
            modalType: 'links',
            accountId: record.accountId,
						partnerId: record.partnerId,
						type,
					},
				})
			},
			OnSwitchStatus (data, status) {
				dispatch({
					type: 'joinAccount/updateJoinAccount',
					payload: {
						data: data,
						status,
					},
				})
			},
	}

	const ModalProps = {
    modalVisible,
		dataLoading,
		modalList,
		modalType,
		accountId,
    modalData,
		onSubmit (data) {
			dispatch({
				type: 'joinAccount/VerifySubjected',
				payload: {
					...data,
				},
			})
			dispatch({
				type: 'joinAccount/hideModal',
			})
		},
		onHideModal () {
			dispatch({
				type: 'joinAccount/hideModal',
			})
		},
		onClose () {
      dispatch({
        type: 'joinAccount/hideModal',
      })
		},
		onChangeAccount (value) {
			dispatch({
				type: 'joinAccount/updateState',
				payload: {
					accountId: value,
				},
      })
		},
		onSubmit (data) {
			dispatch({
				type: 'joinAccount/addJoinAccount',
				payload: {
					accountId: data.accountId,
					...queryParam
				},
      })
		},
	}

	const handleResetQuery = () => {
		dispatch({type: 'joinAccount/updateSort',
			payload: {
				status: null
			},
		})
	}

	const handleQueryData = () => {
		dispatch({
			type: 'joinAccount/getDataList',
			payload: {
				...queryParam
			},
		})
	}

	const handleChangeSearchName = (value) => {
		dispatch({
			type: 'joinAccount/updateState',
			payload: {
				searchName: value.target.value
			},
		})
	}

	const handleOnSearch = (value) => {
    dispatch({
			type: 'joinAccount/getDataList',
			payload: {
					...queryParam
			},
		})
	}
	
	const handleOnAdd = () => {
		dispatch({
			type: 'joinAccount/updateState',
			payload: {
				accountId: undefined,
			},
		})
    dispatch({
      type: 'joinAccount/showModal',
      payload: {
        modalType: 'add',
      },
    })
	}
	
	const handleChangeStatus = (value) => {
		dispatch({type: 'joinAccount/updateSort',payload:{status: value}})    //状态加蒙版
	}

	const createSort = () => {
		let i = 0
		const list = [
			{
				id:i++,
				content:(
					<div className={styles.sortCol} >
					<div className={styles.sortText}>状态:</div>
							<Select disabled={dataLoading} allowClear value={status?status:undefined} className={styles.sortSelectMuti} placeholder={"选择状态"} onChange={handleChangeStatus}>
								<Option key={1} value={1} title={'启用'}>启用</Option>
								<Option key={2} value={2} title={'停用'}>停用</Option>
							</Select>
					</div>
					)
			},
		]
		return list
	}

	const layerProps = {
		list: createSort(),
		query:(<div className={styles.queryBox} style={{textAlign:'right',paddingRight:'3%'}}>
			<Button className={styles.inquery} type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQueryData}>{dataLoading?'':'查询'}</Button>
			<Button className={styles.reset} onClick={handleResetQuery} disabled={dataLoading}>重置</Button>
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
							<Row style={{marginBottom:'10px'}}>
							<Button icon="plus" onClick={() => { handleOnAdd() }} type="primary" style={{marginBottom:isNavbar?'10px':undefined}}>添加</Button>
							<div style={{width: isNavbar?'100%':'240px',display:'inline-blck',float: 'right'}}>
									<Search enterButton placeholder="搜索" value={searchName} onChange={handleChangeSearchName} onSearch={value => handleOnSearch(value)} style={{ width: isNavbar?'100%':200, float: 'right' }} />
							</div>
							</Row>
							<Row>
								<JoinAccountTable {...userTableProps} />
							</Row>
					</div>
				</Card>
		</Col>
		</Row>
		{ modalVisible && <JoinAccountModal {...ModalProps} /> }
	</Page>
	)
	}


	JoinAccount.propTypes = {
		joinAccount: PropTypes.object,
		location: PropTypes.object,
		dispatch: PropTypes.func,
		loading: PropTypes.object,
	}

	export default connect(({ joinAccount, app, loading }) => ({ joinAccount, app, loading }))(JoinAccount)
