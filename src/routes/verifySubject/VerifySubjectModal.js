import { Modal, Button, Col, Form, Input, Icon, Cascader, Table, Divider, Popconfirm, Select, message } from 'antd'
import moment from 'moment'
import { getFormat, config, getYearFormat } from 'utils'

const FormItem = Form.Item

const SchoolModal = ({
  modalVisible, dataLoading, modalVerify, modalType, missionList, subjectList, accountList, modalData, yearList,
  onClose, onSubmit, onHideModal, onYearChange, onMissionChange,
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

  const handleConfirmOrderVisibleChange = (value) => {
    onHideModal ()
  }

  const handleYearChange = (value) => {
    setFieldsValue({year:null,missionId:null,subjectId:null})
    onYearChange (value)
  }

  const handleMissionChange = (value) => {
    if(value){
      const mission = missionList.filter(_=>_.id===value)[0]
      if(!mission){
        message.error("系统错误")
        return
      }
      setFieldsValue({missionId:null,subjectId:null,year:mission.year})
    }else{
      setFieldsValue({missionId:null,subjectId:null})
    }
    
    onMissionChange (value)
  }

  const createYearSelect = () => {
    const options = [];
			if(yearList){
					for(let index of yearList){
							options.push(<Option key={index.year} value={index.year} title={getYearFormat(index.year)}>{getYearFormat(index.year)}</Option>)
					}
			}
			return options;
  }

  const createMissionSelect = () => {
		const options = [];
		if(missionList){
				for(let index of missionList){
          if(!modalData.year || index.year==modalData.year){
            options.push(<Option key={index.id} value={index.id} title={index.name}>{index.name}</Option>)
          }
				}
		}
		return options;
	}

	const createSubjectSelect = () => {
			const options = [];
			if(modalData.subjectList){
					for(let index of modalData.subjectList){
              options.push(<Option key={index.id} value={index.id} title={index.name}>{index.name}</Option>)
					}
			}
			return options;
  }

  const createAccountSelect = () => {
    const options = [];
    for (let account of accountList) {
        options.push(<Option key={String(account.id)} value={account.id} title={`${account.departName}/${account.loginName}`}>{`${account.departName}/${account.loginName}`}</Option>)
    }
    return options;
  }
  
  const submitVerify = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      if(modalType == 'eidt'){
        data.id = modalVerify.id
      }
      data.accountId = data.accountId.toString()
      onSubmit(data)
    })
  }

  if (modalType == 'add') {
    return (
      <Modal
        visible={modalVisible}
        onCancel={() => { onClose() }}
        title={'添加'}
        footer={<div>
                <Button style={{ marginRight: '10px' }} onClick={()=>handleConfirmOrderVisibleChange(false)}>取消</Button>
                <Button type="primary" onClick={() => { submitVerify() }}>确定</Button>
              </div>}
      >
        <Form layout="horizontal">
          <FormItem {...formItemLayout} label="学年" key="year">
              {getFieldDecorator('year', {
                initialValue: null,
                rules: [{ required: true, message: '请选择' }],
							})(<Select style={{ width: '100%' }} allowClear showSearch optionFilterProp="children" onChange={(value) => handleYearChange(value)}>
              {createYearSelect()}
              </Select>)}
          </FormItem>
          <FormItem {...formItemLayout} label="收费任务" key="missionId">
              {getFieldDecorator('missionId', {
                initialValue: null,
                rules: [{ required: true, message: '请选择' }],
							})(<Select style={{ width: '100%' }} allowClear showSearch optionFilterProp="children" onChange={(value) => handleMissionChange(value)}>
              {createMissionSelect()}
              </Select>)}
          </FormItem>
          <FormItem {...formItemLayout} label="收费项目" key="subjectId">
              {getFieldDecorator('subjectId', {
                initialValue: null,
                rules: [{ required: true, message: '请选择' }],
							})(<Select style={{ width: '100%' }} allowClear showSearch optionFilterProp="children" disabled={modalData.subjectDisable}>
              {createSubjectSelect()}
            </Select>)}
            </FormItem>
          <FormItem {...formItemLayout} label="核销人员" key="accountId">
              {getFieldDecorator('accountId', {
                initialValue: [],
                rules: [{ required: true, message: '请选择' }],
							})(<Select style={{ width: '100%' }} mode="multiple">
              {createAccountSelect()}
              </Select>)}
          </FormItem>

        </Form>
      </Modal>)
  }else{
    return (
      <Modal
        visible={modalVisible}
        onCancel={() => { onClose() }}
        title={'编辑'}
        footer={<div>
                <Button style={{ marginRight: '10px' }} onClick={()=>handleConfirmOrderVisibleChange(false)}>取消</Button>
                <Button type="primary" onClick={() => { submitVerify() }}>确定</Button>
              </div>}
      >
        <Form layout="horizontal">
          <FormItem {...formItemLayout} label="学年" key="year">
              {getFieldDecorator('year', {
                initialValue: modalVerify.year,
                rules: [{ required: true, message: '请选择' }],
							})(<Select style={{ width: '100%' }} disabled={true}>
              {createYearSelect()}
              </Select>)}
          </FormItem>
          <FormItem {...formItemLayout} label="收费任务" key="missionId">
              {getFieldDecorator('missionId', {
                initialValue: modalVerify.missionId,
                rules: [{ required: true, message: '请选择' }],
							})(<Select style={{ width: '100%' }} disabled={true}>
              {createMissionSelect()}
              </Select>)}
          </FormItem>
          <FormItem {...formItemLayout} label="收费项目" key="subjectId">
              {getFieldDecorator('subjectId', {
                initialValue: modalVerify.subjectId,
                rules: [{ required: true, message: '请选择' }],
							})(<Select style={{ width: '100%' }} disabled={true}>
              {createSubjectSelect()}
            </Select>)}
            </FormItem>
          <FormItem {...formItemLayout} label="核销人员" key="accountId">
              {getFieldDecorator('accountId', {
                initialValue: modalVerify.accountIdList,
                rules: [{ required: true, message: '请选择' }],
							})(<Select style={{ width: '100%' }} mode="multiple">
              {createAccountSelect()}
              </Select>)}
          </FormItem>

        </Form>
      </Modal>)
  }
}

export default Form.create()(SchoolModal)
