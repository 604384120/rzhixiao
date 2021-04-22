import moment from 'moment'
import { Modal, Button,Row, Col, Form, Spin, Input,  Icon, Steps, DatePicker,Cascader, Select, Checkbox, message, Progress, Divider, InputNumber } from 'antd'
import Sortable, { SortableContainer } from 'react-anything-sortable'
import { getYearFormat } from 'utils'

const FormItem = Form.Item
const Step = Steps.Step
const Option = Select.Option

const FeeMissionModal = ({
  modalVisible,
  ModalType,
  onGetCreditBatchList,
  onClose,
  onStep1Ok,
  onStep2Ok,
  onAddSubject,
  onAddSubjectOptional,
  onDeleteSubject,
  onDeleteSubjectOptional,
  onSwapSelected,
  onSwapSelectedOptional,
  onBackStep1,
  onUpdateState,
  onGetGradeList,
  current,
  name,
  beginDate,
  endDate,
  year,
  cgNum,
  chargeId,
  accountList,
  creditBatchList,
  subjectList,
  subjectMap,
  subjectSelectedList,
  subjectSelectedTempData,
  optionalSubjectSelectedList,
  departTree, departId, departMap,
  gradeList, gradeId,
  user,
  showOptionalSubject,
  step,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
    getFieldValue,

  },
  mergeInpVisible,
  onMergeInpVisible,
}) => {
  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    validateFields((err, values) => {
      if (!err) {
        if (step == 0) {
          const data = {
            ...getFieldsValue(),
          }
          if (!accountList[data.chargeId]) {
            message.error('请选择正确的负责人')
            return
          }
          if (data.departId) {
            data.departId = data.departId[data.departId.length - 1]
          }
          onStep1Ok(data)
        } else {

        }
      }
    })
  }

  const handleComplete = () => {
    if (subjectSelectedList.length <= 0 && optionalSubjectSelectedList.length<=0) {
      message.error('至少选择一项收费项目!')
      return
    }
    let subjectArr = []
    let hasCredit = false;
    let subjectMap = {}
    //必选项目
    for (let selected of subjectSelectedList) {
      let tempSubject = {subjectId:selected.id,isRequired:selected._required?"1":"0",isDefault:selected._default,allowModify:selected._modify?"1":"0",allowDeferred:selected._deferred?"1":"0",isStand:selected._stand?"1":"0",userShowStatus:selected._userShowStatus?"1":"0",}
      if(selected._hintValue){
        tempSubject.remark = selected._hintValue
      }
      if(selected._stand){
        hasCredit = true;
      }
      if(selected._userShowStatus && (!selected._userShowName || selected._userShowName == '')){
        message.error('请输入合并显示名称!')
        return
      }
      if(selected.subType == '2'){
        //学分学费
        if(!selected.batchId){
          message.error('请选择学分批次!')
          return
        }
        tempSubject.batchId = selected.batchId;
        hasCredit = true;
      }
      if(selected._modify){
        tempSubject.modifyMin = selected._modifyMin?selected._modifyMin.toString():undefined
        selected._modifyMin = undefined
        tempSubject.modifyStep = selected._modifyStep?selected._modifyStep.toString():undefined
        selected._modifyStep = undefined
      }

      if(selected._userShowName){  // 当输入了手机端显示名称后传参
        tempSubject.userShowName = selected._userShowName
        if(subjectMap[selected._userShowName]){
          if(subjectMap[selected._userShowName].isRequired != tempSubject.isRequired 
            || subjectMap[selected._userShowName].isDefault != tempSubject.isDefault ){
              message.error('相同显示名称的项目配置必须相同')
              return
          }
        }else{
          subjectMap[selected._userShowName] = tempSubject
        }
      }
      subjectArr.push(tempSubject)
    }
    //可选项目
    for (let selected of optionalSubjectSelectedList) {
      let tempSubject = {subjectId:selected.id,isRequired:"0",isDefault:"0",allowModify:"0",allowDeferred:"0",isStand:selected._stand?"1":"0"}
      if(selected._userShowName){  // 当输入了手机端显示名称后传参
        tempSubject.userShowName = selected._userShowName
        if(subjectMap[selected._userShowName]){
          if(subjectMap[selected._userShowName].isRequired != tempSubject.isRequired 
            || subjectMap[selected._userShowName].isDefault != tempSubject.isDefault ){
              message.error('相同显示名称的项目配置必须相同')
              return
          }
        }else{
          subjectMap[selected._userShowName] = tempSubject
        }
      }
      subjectArr.push(tempSubject)
    }

    let data = []
    data.name = name
    data.beginDate = beginDate ? beginDate.format('YYYY-MM-DD HH:mm:ss') : null
    data.endDate = endDate ? endDate.format('YYYY-MM-DD HH:mm:ss') : null
    data.year = year
    data.chargeId = accountList[chargeId].id
    data.subjectList = JSON.stringify(subjectArr)   //转换成json
    data.hasCredit = hasCredit
    data.departId = departId!="0"?departId:null
    data.gradeId = gradeId?gradeId.toString():null
    onStep2Ok(data)
  }

  const hanldeChangeDepart = (value) => {
    onUpdateState({departId: value})
    setFieldsValue({chargeId:undefined})
  }
  const createAccountSelect = () => {
    const accoutSelect = []
    for (let account in accountList) {
      if(!departId || departId.length<=1 || !accountList[account].departId || accountList[account].departId=='0' || 
        (departMap[accountList[account].departId]&&(
          departMap[accountList[account].departId].path.length>=departId.length?departMap[accountList[account].departId].path.indexOf(departId[departId.length-1])>=0
          :departId.indexOf(accountList[account].departId)>=0)
        )){
        accoutSelect.push(<Option key={String(accountList[account].id)} value={`${accountList[account].departName}/${accountList[account].loginName}`} title={`${accountList[account].departName}/${accountList[account].loginName}`}>{`${accountList[account].departName}/${accountList[account].loginName}`}</Option>)
      }
    }
    return accoutSelect;
  }

  const createYearSelect = () => {
    const option = [];
    let yearNow = moment().format("YYYY") - 10;
    for(let i=0;i<20;i++){
      option.push(<Option key={i} value={(yearNow+i).toString()} title={getYearFormat(yearNow+i)}>{getYearFormat(yearNow+i)}</Option>)
    }
    return option;
  }

  const handleChangeSubjectSelectedRequired = (record, checked) => {
    record._required = checked;
    record._default = 2
    onUpdateState({subjectSelectedList})
  }
  const handleChangeSubjectSelectedDefault = (record, value) => {
    record._default = value;
    onUpdateState({subjectSelectedList})
  }
  const handleChangeSubjectSelectedModify = (record, checked) => {
    record._modify = checked;
    onUpdateState({subjectSelectedList})
  }
  const handleChangeSubjectSelectedDeferred= (record, checked) => {
    record._deferred = checked;
    onUpdateState({subjectSelectedList})
  }
  const handleChangeSubjectSelectedStand = (record, checked) => {
    record._stand = checked;
    onUpdateState({subjectSelectedList})
  }
  const handleChangeSubjectSelectedDeferredMin = (record, value) => {
    record._modifyMin = value;
    onUpdateState({subjectSelectedList})
  }
  const handleChangeSubjectSelectedDeferredStep = (record, value) => {
    record._modifyStep = value;
    onUpdateState({subjectSelectedList})
  }

  // const handleShowOptionalSubject = () => {
  //   onUpdateState({showOptionalSubject:true})
  // }

  const handleBackStep1 = () => {
    onBackStep1()
  }

  const handleSelectSubject = (value) => {
    if (ModalType == 'update' && current.status != '4') {
      message.warning('已上线，无法操作')
      return
    }
    const record = subjectMap[value]
    record._default = subjectSelectedTempData.default;
    // record._isDefault = subjectSelectedTempData.isDefault;
    record._required = subjectSelectedTempData.required;
    record._modify = subjectSelectedTempData.modify;
    record._userShowName = null
    if(record.subType == "2"){
      //学分学费不允许匹配标准
      record._stand = false
    }else{
      record._stand = (user.isStand=='1' && user.isAdmin!='1')||subjectSelectedTempData.stand;
    }
    onAddSubject(record)
  }

  // const handleSelectSubjectOptional= (value) => {
  //   if (ModalType == 'update' && current.status != '4') {
  //     message.warning('已上线，无法操作')
  //     return
  //   }
  //   const record = subjectMap[value]
  //   record._stand = user.isStand=='1'||subjectSelectedTempData.opStand;
  //   onAddSubjectOptional(record)
  // }

  
  const handleChangeSubjectSelectedTempRequired = (e) => {
    subjectSelectedTempData.required = e.target.checked
    subjectSelectedTempData.default = 2
    onUpdateState({subjectSelectedTempData})
  }

  const handleChangeSubjectSelectedTempUserShowStatus = (e) => {
    subjectSelectedTempData.userShowStatus = e.target.checked
    onUpdateState({subjectSelectedTempData})
  }
  
  const handleChangeSubjectSelectedTempDefault = (value) => {
    subjectSelectedTempData.default = value
    onUpdateState({subjectSelectedTempData})
  }

  const handleChangeSubjectSelectedTempModify = (e) => {
    subjectSelectedTempData.modify = e.target.checked
    onUpdateState({subjectSelectedTempData})
  }

  const handleChangeSubjectSelectedTempDeferred = (e) => {
    subjectSelectedTempData.deferred = e.target.checked
    onUpdateState({subjectSelectedTempData})
  }

  const handleChangeSubjectSelectedTempStand = (e) => {
    subjectSelectedTempData.stand = e.target.checked
    onUpdateState({subjectSelectedTempData})
  }

  // const handleChangeSubjectSelectedTempOpStand = (e) => {
  //   subjectSelectedTempData.opStand = e.target.checked
  //   onUpdateState({subjectSelectedTempData})
  // }

  const handleDeleteSubject = (record) => {
    if (ModalType == 'update' && current.status != '4') {
      message.warning('已上线，无法操作')
      return
    }
    onDeleteSubject(record)
  }

  const handleDeleteSubjectOptional = (record) => {
    if (ModalType == 'update' && current.status != '4') {
      message.warning('已上线，无法操作')
      return
    }
    onDeleteSubjectOptional(record)
  }

  const getChareId = (chargeId) => {
    if (chargeId) {
      let i = 0
      for (let account in accountList) {
        if (accountList[account].id == chargeId) {
          chargeId = `${accountList[account].departName}/${accountList[account].loginName}`
          return chargeId
        }
      }
    }
  }

  const handleSelectCreditBatch = (value, subject) => {
    const target = subjectSelectedList.filter(item => subject.id === item.id)[0]
    target.batchId = value;
    onUpdateState(subjectSelectedList);
  }

  const handleClickCreditBatch = () => {
    onGetCreditBatchList();
  }

  const createCreditBatchOption = () => {
    const options = [];
    if(creditBatchList){
			for (let select of creditBatchList) {
				options.push(<Option key={select.id} value={select.id} title={select.name}>{select.name}</Option>)
			}
			return options
		}
		return null;
  }

  const handleMergeInp = (record, checked) => {
    record._userShowStatus = checked;
    onUpdateState({subjectSelectedList})
    // mergeInpVisible = !mergeInpVisible
    // onMergeInpVisible(mergeInpVisible)
  }

  const handleChangeMergeValue = (record, e) => {  // 输入手机端显示名称时候存储value值
    record._userShowName = e.target.value
    onUpdateState({subjectSelectedList})
  }

  const handleChangeHintValue = (record, e) => {  // 输入提示时候存储value值
    let remark = e.target.value
    if(record._userShowName){
      for(let n of subjectSelectedList){
        if(n._userShowName == record._userShowName){
          n._hintValue = remark
        }
      }
    }else{
      record._hintValue = remark
    }
    onUpdateState({subjectSelectedList})
  }

  const createSubjectSelected = () => {
    const subjectSelected = []
    let i = 0
    for (let subject of subjectSelectedList) {
      subjectSelected.push(<SortableContainer className="mission" sortData={i} key={i}>
        <div>
          <div className="mission-subject" style={{width: '210px'}}>{subject.name}</div>
          <div className="mission-subject-pre" style={{width: '670px'}}>
            <Checkbox style={{marginRight:'5px'}} checked={subject._required} onChange={(e)=>handleChangeSubjectSelectedRequired(subject, e.target.checked)}/>必缴项目
            <Checkbox style={{marginRight:'5px'}} disabled={(user.isStand=='1' && user.isAdmin!='1')||subject.subType=='2'} checked={subject._stand} onChange={(e)=>handleChangeSubjectSelectedStand(subject, e.target.checked)}/>适配已有标准
            {/* <Checkbox style={{marginRight:'5px'}} checked={subject._default} onChange={(e)=>handleChangeSubjectSelectedDefault(subject, e.target.checked)}/>默认选择 */}
            <Checkbox style={{marginRight:'5px'}} checked={subject._modify} onChange={(e)=>handleChangeSubjectSelectedModify(subject, e.target.checked)}/>允许分期
            <Checkbox style={{marginRight:'5px'}} checked={subject._deferred} onChange={(e)=>handleChangeSubjectSelectedDeferred(subject, e.target.checked)}/>允许缓缴
            <Checkbox  style={{marginRight:'5px'}} checked={subject._userShowStatus} onClick={(e) => handleMergeInp(subject, e.target.checked)}>手机端合并显示</Checkbox>
            <Select style={{width:'120px',display: "inline-block",marginLeft: '8px'}} size='small' value={subject._default} onChange={(value)=>{handleChangeSubjectSelectedDefault(subject,value)}}>
              <Option style={{minWidth:'130px'}} key={2} value={2} title={'默认勾选'}>默认勾选</Option>
              <Option style={{minWidth:'130px'}} key={1} value={1} disabled={!subject._required} title={'默认且不可取消'}>默认且不可取消</Option>
              <Option style={{minWidth:'130px'}} key={0} value={0} title={'默认不勾选'}>默认不勾选</Option>
            </Select>
          </div>
          <div className="mission-subject-side"> <Icon className="mission-subject-delete" type="delete" onClick={(e) => { e.stopPropagation(); handleDeleteSubject(subject) }} /></div>
          <div style={{fontSize:'10px',color:'#bbb'}}>
            <div style={{display:'inline-block'}}>收款账户：{subject.mchName}</div> | <div style={{display:'inline-block'}}>票据类型：{subject.templateName}</div>
          </div>
          {
            subject.subType=='2'&&<div style={{display:'inline-block'}}>
              <Select style={{width:'210px', marginRight:'10px',marginBottom:'10px'}} value={subject.batchId}
                  showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  placeholder={"选择学分学费批次"}
                  notFoundContent={!creditBatchList ? <Spin size="small" /> : null}
                  onFocus={() => handleClickCreditBatch()}
                  onChange={(value)=>{handleSelectCreditBatch(value, subject)}}>{createCreditBatchOption()}</Select>
            </div>
          }
          {/* <div>
            <Input value={subject._hintValue} placeholder="请输入提示" style={{marginBottom:'10px', width: '210px'}} onChange={(e) => handleChangeHintValue(subject,e)} />
            </div> */}
          {
            subject._modify&&<div style={{display:'inline-block'}}>
              <InputNumber style={{marginTop:'5px', width:'145px'}} placeholder="最低分期金额" onChange={(value)=>handleChangeSubjectSelectedDeferredMin(subject, value)}/>
              <InputNumber style={{marginTop:'5px', marginLeft:'5px', width:'100px'}} placeholder="倍数步长" onChange={(value)=>handleChangeSubjectSelectedDeferredStep(subject, value)}/>
            </div>
          }
          <div className="example-input" style={{marginRight:'10px'}}><Input value={subject._hintValue} placeholder="请输入提示" style={{marginRight:'10px', width:'210px'}} onChange={(e) => handleChangeHintValue(subject,e)}/>
          <Input style={{width:'210px'}} value={subject._userShowName?subject._userShowName:''} placeholder="请输入手机端显示名称" onChange={(e) => handleChangeMergeValue(subject,e)} />
          </div>
          <Divider style={{ margin: '10px' }} dashed />
        </div>
      </SortableContainer>)
      i++
    }
    return subjectSelected;
  }

  // const createUbjectSelectedOptional = () => {
  //   const subjectSelectedOptional = [];
  //   let i=0
  //   for (let subject of optionalSubjectSelectedList) {
  //     subjectSelectedOptional.push(<SortableContainer className="mission" sortData={i} key={i}>
  //       <div>
  //         <div className="mission-subject" style={{marginBottom:mergeInpVisible?'10px':'0'}}>{subject.name}</div>
  //         <div className="mission-optional-pre">
  //           <Checkbox style={{marginRight:'5px'}} disabled={user.isStand=='1'} checked={subject._stand} onChange={(e)=>handleChangeSubjectSelectedStand(subject, e.target.checked)}/>适配已有标准
  //         </div>
  //         <div className="mission-subject-side"> <Icon className="mission-subject-delete" type="delete" onClick={(e) => { e.stopPropagation(); handleDeleteSubjectOptional(subject) }} /></div>
  //         {mergeInpVisible && <div className="example-input" style={{width:'250px', marginRight:'10px'}}><Input value={subject._userShowName?subject._userShowName:''} placeholder="请输入手机端显示名称" onChange={(e) => handleChangeMergeValue(subject,e)} /></div>}
  //         <Divider style={{ margin: '10px' }} dashed />
  //       </div>
  //     </SortableContainer>)
  //     i++
  //   }
  //   return subjectSelectedOptional;
  // }

  const createSubjectOption = () => {
    const options = [];
    let mchId = null;
    let templateId = null;
    let initFlag = false
    if(subjectSelectedList.length>0){
      mchId = subjectSelectedList[0].mchId;
      templateId = subjectSelectedList[0].templateId;
    }else if(optionalSubjectSelectedList.length>0){
      mchId = optionalSubjectSelectedList[0].mchId;
      templateId = optionalSubjectSelectedList[0].templateId
    }
    if(subjectSelectedList.length<=0 && optionalSubjectSelectedList<=0){
      initFlag = true
    }
    for(let selected of subjectList){
      if(selected._editable == true && ((initFlag&&selected.mchId)||(mchId&&selected.mchId==mchId)) && (initFlag||(selected.templateId==templateId))){
        options.push(
          <Option key={selected.id} style={{width: 'auto'}} value={selected.id} title={selected.name}>{selected.name}</Option>
        )
      }
    }
    return options;
  }

  const onDrag = (data) => {
    const tempSelectedList = []
    for (let selected of data) {
      tempSelectedList.push(subjectSelectedList[selected])
    }
    onSwapSelected(tempSelectedList)
  }

  // const onDragOptional = (data) => {
  //   const tempSelectedList = []
  //   for (let selected of data) {
  //     tempSelectedList.push(optionalSubjectSelectedList[selected])
  //   }
  //   onSwapSelectedOptional(tempSelectedList)
  // }

  const getOptions = () => {
    if(user.departId && user.departId!="0"){
      //属于部门的从所属部门开始
      return departTree
    }
    //添加学校根结点
    let temp = [{
      value: '0',
      label: user.schoolName,
      children: departTree,
    }]
    return temp
  }

  const handleSearchGrade = (value) => {
      onGetGradeList({
        key: value
      })
  }

  const handleClickGrade = () => {
    if (!gradeList || gradeList.length <= 0) {
      onGetGradeList()
    }
  }

  const createGradeOption = () => {
    const options = []
    if (gradeList) {
      for (let select of gradeList) {
        options.push(<Option key={select.relateId} value={select.relateId} title={select.name}>{select.relateName}</Option>)
      }
      return options
    }
    return null
  }

  if (ModalType == 'addbill') {
    return (<Modal
      visible={modalVisible}
      onCancel={() => { onClose() }}
      title="任务创建中"
      footer={null}
      width="300px"
      maskClosable={false}
      closable={cgNum!=100?false:true}
    >
      <div style={{width: '40%',margin: 'auto', textAlign:'center'}}> <Progress type="circle" percent={cgNum} width={80} /></div>
    </Modal>)
  }

  return (
    <Modal
      visible={modalVisible}
      onCancel={() => { onClose() }}
      title={ModalType == 'add' ? '添加任务' : '修改任务'}
      footer={null}
      width='1100px'
      maskClosable={false}
    >
      <Steps current={step} style={{ width: '80%', marginLeft: '10%' }}>
        <Step title="编辑收费任务" />
        <Step title="选择收费项目" />
      </Steps>
      <div style={{ height: '550px', overflow: 'scroll' }}>
        <div style={{ marginTop: '30px' }} hidden={step != 0}>
          <Form layout="horizontal" onSubmit={handleSubmit}>
            <FormItem label="任务名称" {...formItemLayout} key="name">
              {getFieldDecorator('name', {
							initialValue: name,
							rules: [{ required: true, message: '请输入任务名称!' }, { max: 40, message: '长度超过限制!' }],
						})(<Input />)}
            </FormItem>

            <FormItem {...formItemLayout} label="学年" key="year">
              {getFieldDecorator('year', {
                initialValue: year ? year : null,
                rules: [{ required: true, message: '请选择学年!' }],
							})(<Select style={{ width: '100%' }}>
              {createYearSelect()}
              </Select>)}
            </FormItem>

            <FormItem {...formItemLayout} label="开始日期" key="beginDate">
              {getFieldDecorator('beginDate', {
								initialValue: beginDate ? moment(beginDate, 'YYYY-MM-DD HH:mm:ss') : null,
							})(<DatePicker
                style={{ width: '100%' }}
                format="YYYY-MM-DD HH:mm:ss"
                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
							/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="结束日期" key="endDate">
              {getFieldDecorator('endDate', {
								initialValue: endDate ? moment(endDate, 'YYYY-MM-DD HH:mm:ss') : null,
							})(<DatePicker
                style={{ width: '100%' }}
                format="YYYY-MM-DD HH:mm:ss"
                showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
							/>)}
            </FormItem>
            <FormItem label="所属部门" {...formItemLayout} key="departId">
            {getFieldDecorator('departId', {
			          initialValue: "",
			          rules: [{required: true,message: '请选择所属部门'},],
			        })(<Cascader options={getOptions()} placeholder="请选择所属部门" changeOnSelect expandTrigger="hover" onChange={hanldeChangeDepart}/>)}
            </FormItem>
            <FormItem label="负责人" {...formItemLayout} key="chargeId">
              {getFieldDecorator('chargeId', {
								initialValue: getChareId(chargeId),
								rules: [{ required: true, message: '请选择负责人!' }],
							})(<Select mode="combobox" placeholder="请选择负责人" disabled={departId&&departId.length>0?false:true} style={{ width: '100%' }}>
              {createAccountSelect()}
							</Select>)}
            </FormItem>
            <FormItem label="年级" {...formItemLayout} key="gradeId">
              {getFieldDecorator('gradeId', {
							})( <Select mode="multiple" allowClear={true} optionFilterProp="children" placeholder="请选择年级" style={{ width: '100%' }}
                onSearch={(value) => handleSearchGrade(value)} 
                onFocus={()=>handleClickGrade()} notFoundContent={!gradeList?<Spin size="small" />:null}>
                {createGradeOption()}
              </Select>)}
            </FormItem>
            <FormItem wrapperCol={{ span: 14, offset: 6 }}>
              <Button type="primary" htmlType="submit" style={{ float: 'right' }}>下一步</Button>
            </FormItem>
          </Form>
        </div>
        <div style={{ marginTop: '30px'}} hidden={step != 1}>
          <Row >
            <Col span={1} />
            <Col span={23}>
              <Sortable className="mission-container" direction="vertical" dynamic sortHandle="ui-sortable-item" onSort={onDrag} containment={true}>
              {createSubjectSelected()}
              </Sortable>
              <div style={{paddingBottom:'15px',marginTop:'-10px',marginLeft:'10px'}}>
                <div className="mission-subject-tips"><Select style={{width:'210px',display: "inline-block"}} showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  placeholder={"选择缴费项目"} value={undefined} onChange={(value)=>{handleSelectSubject(value)}}>{createSubjectOption()}</Select>
                <div className="mission-subject-pre" style={{width: '670px'}}>
                  <Checkbox style={{marginRight:'5px'}} checked={subjectSelectedTempData.required} onChange={handleChangeSubjectSelectedTempRequired}/>必缴项目
                <Checkbox style={{marginRight:'5px'}} disabled={(user.isStand=='1' && user.isAdmin!='1')} checked={(user.isStand=='1' && user.isAdmin!='1')||subjectSelectedTempData.stand} onChange={handleChangeSubjectSelectedTempStand}/>适配已有标准
                  
                  <Checkbox style={{marginRight:'5px'}} checked={subjectSelectedTempData.modify} onChange={handleChangeSubjectSelectedTempModify}/>允许分期
                  <Checkbox style={{marginRight:'5px'}} checked={subjectSelectedTempData.deferred} onChange={handleChangeSubjectSelectedTempDeferred}/>允许缓缴
                  <Checkbox  style={{marginRight:'5px'}} checked={subjectSelectedTempData.userShowStatus} onClick={handleChangeSubjectSelectedTempUserShowStatus}>手机端合并显示</Checkbox>
                  <Select style={{width:'120px',display: "inline-block",marginLeft: '8px'}} size='small' value={subjectSelectedTempData.default} onChange={(value)=>{handleChangeSubjectSelectedTempDefault(value)}}>
                    <Option style={{minWidth:'130px'}} key={2} value={2} title={'默认勾选'}>默认勾选</Option>
                    <Option style={{minWidth:'130px'}} key={1} value={1} disabled={!subjectSelectedTempData.required} title={'默认且不可取消'}>默认且不可取消</Option>
                    <Option style={{minWidth:'130px'}} key={0} value={0} title={'默认不勾选'}>默认不勾选</Option>
                  </Select>
                </div>
                </div>
              </div>
            </Col>
          </Row>
          {/* <Row style={{marginTop:'40px'}}>
            <Col span={2} />
            <Col span={22}>
            {
              showOptionalSubject?<div>
              <div style={{fontSize: "15px"}}>选缴项目</div>
              <Sortable className="mission-container" direction="vertical" dynamic sortHandle="ui-sortable-item" onSort={onDragOptional} containment={true}>
                {createUbjectSelectedOptional()}
              </Sortable>
              <div style={{padding:'0px 15px 15px 10px',marginTop:'-10px'}}>
                <div className="mission-subject-tips" ><Select style={{width:'250px',display: "inline-block",}} showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  placeholder={"选择选缴项目"} value={undefined} onChange={(value)=>{handleSelectSubjectOptional(value)}}>{createSubjectOption()}</Select>
                  <div className="mission-subject-pre">
                    <Checkbox style={{marginRight:'5px'}} disabled={user.isStand=='1'} checked={user.isStand=='1'||subjectSelectedTempData.opStand} onChange={handleChangeSubjectSelectedTempOpStand}/>适配已有标准
                  </div>
                </div>
              </div>
              </div>:<a onClick={handleShowOptionalSubject}>设置选缴项目</a>
            }
            </Col>
          </Row> */}
          <Row style={{marginTop:'30px',color:'#bfbfbf',marginLeft:'57px'}}>
            <Col span={2} />
            <Col span={15}>
            <div>特别说明：1、收费项目不要超过票据可能打印的最大限度</div>
            <div style={{marginLeft:'67px'}}>2、收费项目一经设定，不可更改</div>
            <div style={{marginLeft:'67px'}}>3、收费项目只能选择相同账户和相同票据类型</div>
            </Col>
          </Row>
          <Row>
            {/* <Col span={8} style={{paddingTop:'15px'}}>
              <Checkbox  style={{marginLeft:'25px',color:'rgb(255,71,71)',fontWeight:'bold'}} checked={mergeInpVisible} onClick={handleMergeInp}>手机端合并显示项目</Checkbox>
            </Col> */}
            <Col span={16} offset={8}>
              <Button type="primary" onClick={handleComplete} style={{ float: 'right', marginLeft:'20px'}}>完&nbsp;成</Button>
              <Button onClick={handleBackStep1}
                style={{float: 'right', backgroundColor: '#f2f2f2', borderColor: '#f2f2f2'}}
              >上一步</Button>
            </Col>
          </Row>
        </div>
      </div>

    </Modal>
  )
}

export default Form.create()(FeeMissionModal)
