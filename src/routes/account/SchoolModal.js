import { Modal, Button, Col, Form, Input, Icon, Cascader, Table, Divider, Popconfirm, Select, Spin } from 'antd'

const FormItem = Form.Item

const SchoolModal = ({
	modalVisible, modalType, departTree, departSelected, departMap, schoolName, shortName, modalAccount, modalDepart, 
	userAttrList, userAttrMap, ...tableProps,dataLoading,
	onClose, onSubmit, onGetAttrRelateList, onUpdateState, onDeleteAttr, onUpdateAttr,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
    getFieldValue,
  },
}) => {
	if(modalType=="dataAccess"){
		const {dataSource} = tableProps;
		const handleEditAttr = (record) => {
			const node = dataSource.filter(item => record.id===item.id)[0]
			node._editable = true;
			onUpdateState({mgrAttrList: dataSource})
		}
		const handleAddAttr = (record) => {
			const node = dataSource.filter(item => record.id===item.id)[0]
			node._editable = true;
			onUpdateState({mgrAttrList: dataSource})
		}
		const handleDeleteAttr = (record) => {
			onDeleteAttr(record)
		}
		const handleCancelAttr = (record) => {
			const node = dataSource.filter(item => record.id===item.id)[0]
			node._editable = false;
			node._idSelected = null;
			if(node._add){
				node.attrId = "";
			}
			onUpdateState({mgrAttrList: dataSource})
		}
		const handleUpdateAttr = (record) => {
			if(record._idSelected){
				onUpdateAttr(record)
			}else{
				handleCancelAttr(record)
			}
		}
		const handleClickSort = (record) => {
			//获取下拉属性值
			if (!record._selectList || record._selectList.length <= 0) {
				onGetAttrRelateList(record)
			}
		}
		const handleSearchSort = (record, value) => {
			//搜索数据
			onGetAttrRelateList(record, value)
		}
		const handleChangeSort = (record, value) => {
			const node = dataSource.filter(item => record.id===item.id)[0]
			node._idSelected = value;
			onUpdateState({mgrAttrList: dataSource})
		}
		const handleChangeAttrId = (record, value) => {
			const node = dataSource.filter(item => record.id===item.id)[0]
			if(node.attrId != value){
				node.attrId = value;
				node._selectList = undefined;
				node._idSelected = [];
				onUpdateState({mgrAttrList: dataSource})
			}	
		}
		const createAttrOption = () => {
			const options = []
			if (userAttrList) {
				for (let select of userAttrList) {
					options.push(<Select.Option key={select.id} value={select.id} title={select.name}>{select.name}</Select.Option>)
				}
				return options
			}
			return null
		}
		const createUserSortOption = (record) => {
			const options = []
			if (record._selectList) {
				for (let select of record._selectList) {
					options.push(<Select.Option key={select.relateId} value={select.relateName} title={select.relateName}>{select.relateName}</Select.Option>)
				}
				return options
			}
			return null
		}
		
		let columns = [
			{
				title: "数据字段",
				dataIndex: "attrId",
				width: "200px",
				key:"attrId",
				render: (text, record) => {
					if(record._add){
						if(record._editable){
							//可编辑情况
							return (<Select style={{ width: '100%' }}
								value={record.attrId}
								allowClear
								showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								placeholder="请选择"
								onChange={(value) => { handleChangeAttrId(record, value) }}
							>
								{createAttrOption()}
							</Select>)
						}else{
							return (
								<a href="javascript:;" onClick={(e)=>{handleAddAttr(record)}}><Icon type="plus" />添加</a>
							)
						}
					}
					return userAttrMap[text].name;
				}
			},{
				title: "取值范围",
				dataIndex: "relateName",
				width: "400px",
				key:"relateName",
				render: (text, record) => {
					if(record._add && (!record._editable || !record.attrId)){
						return '';
					}
					return (
						<Select
						style={{width:"500px"}}
						mode="multiple"
						disabled={record._editable?false:true}
						allowClear
						value={record._idSelected?record._idSelected:record.relateName}
						placeholder={record._editable?"请选择，不选则表示全部数据":"全部"}
						onFocus={() => handleClickSort(record)}
						onSearch={(value) => handleSearchSort(record, value)}
						onChange={value => handleChangeSort(record, value)}
						notFoundContent={!record._selectList ? <Spin size="small" /> : null}
					>
						{createUserSortOption(record)}
					</Select>
					)
				
				}
			},{
				title: "操作",
				dataIndex: "id",
				width: "120px",
				key:"id",
				render: (text, record) => {
					if(record._add && !record._editable){
						return '';
					}
					return record._editable?<div><a onClick={()=>{handleUpdateAttr(record)}}>确定</a><Divider type="vertical" /><a onClick={()=>{handleCancelAttr(record)}}>取消</a></div>
					:<div><a onClick={()=>{handleEditAttr(record)}}>编辑</a><Divider type="vertical" />
					<Popconfirm title="删除不可恢复确认删除？" onConfirm={()=>{handleDeleteAttr(record)}} okText="Yes" cancelText="No"><a>删除</a></Popconfirm></div>
				}
			},
		];
		//数据权限设置
		return (<Modal
		visible={modalVisible}
		onCancel={()=>{onClose()}}
		title={"数据权限【"+modalAccount.loginName+"】"}
		footer={null}
		width={'900px'}
		maskClosable={false}
		>
		<div style={{minHeight:'300px', overflowY:'scroll'}}>
		<Table
			{...tableProps}
			loading={dataLoading}
			bordered
			columns={columns}
			pagination={false}
			rowKey={record => record.id}
				/>
		</div>
		</Modal>)
	}


  const formItemLayout = {
	  labelCol: {
	    span: 6,
	  },
	  wrapperCol: {
	    span: 14,
	  },
  }

  const submitAccount = () => {
    validateFields((errors) => {
	      if (errors) {
	        return
	      }
	      if (modalType == 'add') {
	      	const data = {
	      		...getFieldsValue(),
        }
        if (data.departId) {
          data.departId = data.departId[data.departId.length - 1]
        }
	      	onSubmit(data)
	      } else {
        const data = {
		        ...getFieldsValue(),
		        id: modalAccount.id ? modalAccount.id : '',
        }
        if (data.departId) {
          data.departId = data.departId[data.departId.length - 1]
        }
		      onSubmit(data)
	      }
	    })
  }

  const submitDepart = () => {
    validateFields((errors) => {
	      if (errors) {
	        return
	      }
	      if (modalType == 'editDepart') {
	      	const data = {
		        ...getFieldsValue(),
		        id: modalDepart.id ? modalDepart.id : '',
        }
        if (data.pid) {
          data.pid = data.pid[data.pid.length - 1]
        }
		      onSubmit(data)
	      } else {
	      	const data = {
	      		...getFieldsValue(),
        }
        data.pid = modalDepart.id
	      	onSubmit(data)
	      }
	    })
  }

  const checkPwd = (rule, value, callback) => {
    if (value !== getFieldValue('password')) {
      callback('两次密码输入必须一致')
    }

    callback()
  }

  const getOptions = () => {
    let temp = [{
      value: '0',
      label: schoolName,
      children: departTree,
    }]
    return temp
  }

  const getDepartArr = (departId) => {
    if (departSelected && modalType == 'add') {
      departId = departSelected.id
    }
    let departArr = []
    const unshiftDepart = (data) => {
      if (data) {
        departArr.unshift(data.id)
        if (data.pid && data.pid != '0') {
          unshiftDepart(departMap[data.pid])
        }
      }
    }
    unshiftDepart(departMap[departId])
    departArr.unshift('0')

    return departArr
  }

  if (modalType == 'resetPwd') {
    return (
      <Modal
        visible={modalVisible}
        onCancel={() => { onClose() }}
        title="重置密码"
        footer={<Button type="primary" onClick={() => { submitAccount() }}>保存</Button>}
      >
        <Form layout="horizontal">
          <FormItem label="密码" key="a" {...formItemLayout}>
            {getFieldDecorator('password', {
		            initialValue: '',
		            rules: [
		              {
		                required: true,
		                message: '请填写密码',
		              }, {
										max: 40,
										message: '长度超过限制',
									},
		            ],
		          })(<Input type="password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请填写密码" />)}
          </FormItem>

          <FormItem label="再次输入密码" key="b" {...formItemLayout}>
            {getFieldDecorator('password_repeat', {
		            initialValue: '',
		            rules: [
		              {
		                required: true,
		                message: '请再次输入密码',
		              }, {
										max: 40,
										message: '长度超过限制',
									}, {
									validator: checkPwd,
		              },
		            ],
		          })(<Input type="password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请填写密码" />)}
          </FormItem>
        </Form>
      </Modal>
    )
  } else if (modalType == 'add' || modalType == 'update') {
    return (
      <Modal
        visible={modalVisible}
        width='848px'
        onCancel={() => { onClose() }}
        title={modalType == 'add' ? '添加账户' : '修改账户'}
        footer={<Button type="primary" onClick={() => { submitAccount() }}>保存</Button>}
      >
        <Form layout="horizontal">
          <FormItem label="姓名" key="a" {...formItemLayout}>
            {getFieldDecorator('name', {
			            initialValue: modalAccount.name,
			            rules: [
			              {
			                required: true,
			                message: '请填写姓名',
			              }, {
											max: 40,
											message: '长度超过限制',
										},
			            ],
			          })(<Input placeholder="请填写姓名" />)}
          </FormItem>
          <FormItem label="电话号码" key="b" {...formItemLayout}>
            {getFieldDecorator('phone', {
			            initialValue: modalAccount.phone,
			            rules: [
			              {
			                required: true,
			                message: '请填写手机号码',
			              }, {
											max: 40,
											message: '长度超过限制',
										},
			            ],
			          })(<Input placeholder="请填写电话" />)}
          </FormItem>
          <FormItem label="所属部门" key="c" {...formItemLayout}>
            {getFieldDecorator('departId', {
			            initialValue: getDepartArr(modalAccount.departId),
			            rules: [
			              {
			                required: true,
			                message: '请选择所属部门',
			              },
			            ],
			          })(<Cascader options={getOptions()} placeholder="请选择所属部门" changeOnSelect expandTrigger="hover" />)}
          </FormItem>
          <FormItem label="账号" key="d" {...formItemLayout}>
            {getFieldDecorator('loginName', {
			            initialValue: modalAccount.loginName,
			            rules: [
			              {
			                required: true,
			                message: '请填写登录名',
			              }, {
											max: 40,
											message: '长度超过限制',
										},
			            ],
			          })(<Input disabled={!!modalAccount.loginName} placeholder="请输入账号" addonAfter={`@${shortName}`} />)}
          </FormItem>
          {
								modalType == 'add' && <FormItem label="密码" key="e" {...formItemLayout}>
  {getFieldDecorator('password', {
										initialValue: '',
										rules: [
											{
												required: true,
												message: '请填写密码',
											}, {
												max: 40,
												message: '长度超过限制',
											},
										],
									})(<Input type="password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请填写密码" />)}
								</FormItem>
							}
          {
								modalType == 'add' && <FormItem label="再次输入密码" key="f" {...formItemLayout}>
  {getFieldDecorator('password_repeat', {
											initialValue: '',
											rules: [
												{
													required: true,
													message: '请再次输入密码',
												}, {
													max: 40,
													message: '长度超过限制',
												}, {
													validator: checkPwd,
												},
											],
										})(<Input type="password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请填写密码" />)}
								</FormItem>
							}

        </Form>
      </Modal>)
  } else if (modalType == 'addDepart') {
    return (
      <Modal
        visible={modalVisible}
        onCancel={() => { onClose() }}
        footer={<Button type="primary" onClick={() => { submitDepart() }}>保存</Button>}
      >
        <Form layout="horizontal">
          <FormItem label="父级部门" key="a" {...formItemLayout}>
            {modalDepart.label}
          </FormItem>
          <FormItem label="层级名称" key="b" {...formItemLayout}>
            {getFieldDecorator('departName', {
				            initialValue: '',
				            rules: [
				              {
				                required: true,
				                message: '请填写层级名称',
				              }, {
												max: 20,
												message: '长度超过限制',
											},
				            ],
				          })(<Input placeholder="请填写名称" />)}
          </FormItem>

        </Form>
      </Modal>
    )
  } else if (modalType == 'editDepart') {
    return (
      <Modal
        visible={modalVisible}
        onCancel={() => { onClose() }}
        width='848px'
        footer={<Button type="primary" onClick={() => { submitDepart() }}>保存</Button>}
      >
        <Form layout="horizontal">
          <FormItem label="父级部门" key="a" {...formItemLayout}>
            {getFieldDecorator('pid', {
								initialValue: getDepartArr(modalDepart.pid),
								rules: [
									{
										required: true,
										message: '请选择所属部门',
									},
								],
							})(<Cascader options={getOptions()} placeholder="请选择所属部门" changeOnSelect />)}
          </FormItem>
          <FormItem label="层级名称" key="b" {...formItemLayout}>
            {getFieldDecorator('departName', {
								initialValue: modalDepart.label,
								rules: [
									{
										required: true,
										message: '请填写层级名称',
									}, {
										max: 20,
										message: '长度超过限制',
									},
								],
							})(<Input placeholder="请填写名称" />)}
          </FormItem>

        </Form>
      </Modal>
    )
  }
}

export default Form.create()(SchoolModal)
