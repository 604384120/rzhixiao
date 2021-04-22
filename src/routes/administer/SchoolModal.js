import { Modal, Button, Col, Form, Input, Icon, Cascader, Breadcrumb, message  } from 'antd'

const FormItem = Form.Item

const SchoolModal = ({
	modalVisible, modalType, departTree, departs, departMap, schoolName, shortName, modalAccount, modalDepart, manyDepartId, departTreeMap,
	onClose, onSubmit, onUpDateState,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
    getFieldValue,
  },
}) => {


  const formItemLayout = {
	  labelCol: {
	    span: 6,
	  },
	  wrapperCol: {
	    span: 14,
	  },
	}

	const onAddStruct = (data) => {
		if((data.departId.length == 1 && data.departId[0] == '0') || departTreeMap[_.last(data.departId)].type == '1'){
			message.error("请添加学校部门")
			return
		}
		let onOff = true
		manyDepartId.filter((item)=>{
			if(departTreeMap[data.departId.slice(-1)].token == departTreeMap[item.slice(-1)].token){
				onOff = false
				return message.error("该用户已属于与该学校的部门，请不要重复添加")
			}
			if(item.toString() === getFieldsValue().departId.toString()){
				return onOff = false
			}
		})
		if(onOff){
			manyDepartId.push(data.departId)
			onUpDateState(manyDepartId)
		}
		setFieldsValue({departId:[]})
	}

	const handleDelete = (num) => {
		if(getFieldsValue().departId.toString() === manyDepartId[num].toString()){
			setFieldsValue({departId:[]})
		}
		manyDepartId.splice(num,1)
		onUpDateState({manyDepartId})
	}

  const submitAccount = () => {
    validateFields((errors) => {
			if(errors){
				return
			}
			if (modalType != 'resetPwd' && manyDepartId.length == 0) {
				message.error("请添加学校部门")
				return
			}
			if (modalType == 'add') {
				const data = {
					...getFieldsValue(),
				}
        // if (data.departId) {
        //   data.departId = data.departId[data.departId.length - 1]
        // }
	      	onSubmit(data)
			} else {
        const data = {
		        ...getFieldsValue(),
						id: modalAccount.id ? modalAccount.id : '',
						gtoken: modalAccount.token
				}
        // if (data.departId) {
        //   data.departId = data.departId[data.departId.length - 1]
				// }
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
						gtoken: modalDepart.token ? modalDepart.token : '',
						type: modalDepart.type,
					}
					if(modalDepart.schoolId){
						data.schoolId = modalDepart.schoolId
					}
					if (data.pid) {
						let pid = data.pid.pop().split('_')
						if(pid[0] == '2' || pid[0] == '0'){
							data.pid = '0'
						}else{
							data.pid = pid[1]
						}
					}
		      onSubmit(data)
	      } else {
	      	const data = {
	      		...getFieldsValue(),
					}
					data.gtoken = modalDepart.token
					if(modalDepart.type == '2'){
						data.type = '3'
						data.pid = '0'
					}else{
						data.type = modalDepart.type
						data.pid = modalDepart.id
					}
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

	const filterOptions = (data, parent, exceptId) => {
		let arr = []
		for(let index of data){
			if(index.type == 2){
				//只获取集团版节点
				continue;
			}
			if(index.value == exceptId){
				continue;
			}
			let temp = {
				value: index.value,
				label: index.label,
				type: index.type
			}
			if (index.groupDepartList) {
				filterOptions(index.groupDepartList, temp, exceptId)
			}
			arr.push(temp)
		}
		parent.children = arr
	}
		 
  const getOptions = (depart) => {
		let tree = departTree
		if(depart){
			if(depart.type == 1 || depart.type == 2){
				let temp = {
					value: '0',
					label: schoolName,
				}
				//只获取集团版节点
				filterOptions(tree, temp, depart.value)
				return [temp]
			}else if(depart.type == 3){
				//只获取学校节点
				for(let id of depart._path){
					if(departTreeMap[id].type == 2){
						let temp = {
							value: departTreeMap[id].value,
							label: departTreeMap[id].label,
						}
						if(departTreeMap[id].children){
							filterOptions(departTreeMap[id].children, temp, depart.value)
						}
						return [temp]
					}
				}
			}
		}

    let temp = [{
      value: '0',
      label: schoolName,
			children: tree,
		}]
    return temp
  }

  const getDepartArr = (departId) => {
    if (departs[0] && modalType == 'add') {
			departId = departs[0]
		}
    let departArr = []
    const unshiftDepart = (data) => {
      if (data) {
        departArr.unshift(data.id)
        if (data.pid && data.pid != '0') {
          unshiftDepart(departTreeMap[data.pid])
        }
      }
		}
		
    unshiftDepart(departTreeMap[departId])
		// if(modalType != 'update'){
		// 	departArr.unshift('0')
		// }
		// manyDepartId[0] = departArr
    return departArr
	}

	const filterDepartArr = (arr, type) => {
		//根据节点类型筛选path
		let tempArr = []
		for(let id of arr){
			if(type == 1 || type == 2){
				//集团部门
				if(departTreeMap[id].type < 2){
					tempArr.push(id)
				}
			}else{
				//学校部门
				if(departTreeMap[id].type >= 2){
					tempArr.push(id)
				}
			}
		}
		if(type == 1 || type == 2){
			tempArr.unshift('0')
		}
		return tempArr
	}

	const createSelect = () =>{
		let selectCols = []
		let row = 0
		for(let node of manyDepartId){
			selectCols[row] = []
			for(let index of node){
				selectCols[row].push(<Breadcrumb.Item>{index == '0'?schoolName:departTreeMap[index].label}</Breadcrumb.Item>)
			}
			row++
		}
		let rows = []
		let num = 0
		for(let col of selectCols){
			rows.push(<div style={{lineHeight:'normal'}}><Breadcrumb key={num+1} style={{display:'inline-block', width:'95%', fontSize:'12px'}}>
					{col}
			</Breadcrumb><Icon type="close" width='5%' onClick={handleDelete.bind(this,num)} /></div>)
			num++
		}
		return rows
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
        title={modalType == 'add' ? '添加用户' : '修改用户'}
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
          <FormItem label={<span><span style={{color:'#f5222d'}}>*</span>&nbsp;所属部门</span>} key="c" {...formItemLayout}>
						<Input.Group compact>
							<FormItem name={['所属部门', 'province']} style={{width:'calc(100% - 60px)'}}>
								{getFieldDecorator('departId', {
											initialValue: getDepartArr(modalAccount.departId),
										})(<Cascader options={getOptions()} placeholder="请选择所属部门" changeOnSelect expandTrigger="hover" style={{width:'100%'}} />)}
							</FormItem>
							<Form.Item name={['所属部门', 'street']} style={{width:'60px'}}>
								<Button type='primary' onClick={()=>onAddStruct(getFieldsValue())} style={{width:'100%'}}>添加</Button>
							</Form.Item>
						</Input.Group>
						<div>
							{createSelect()}
						</div>
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
			          })(<Input autoComplete="off" disabled={!!modalAccount.loginName} placeholder="请输入账号" addonAfter={`@${shortName}`} />)}
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
									})(<Input autoComplete="new-password" type="password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请填写密码" />)}
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
            {modalDepart.label?modalDepart.label:modalDepart.name}
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
								initialValue: filterDepartArr(modalDepart._path, modalDepart.type),
								rules: [
									{
										required: true,
										message: '请选择所属部门',
									},
								],
							})(<Cascader options={getOptions(modalDepart)} placeholder="请选择所属部门" changeOnSelect expandTrigger="hover"/>)}
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
