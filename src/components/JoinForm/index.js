import React from 'react'
import { Row, Spin, Modal, Button, Input, message, Icon, Select, Checkbox, Popover, Radio, InputNumber } from 'antd'
import PropTypes from 'prop-types'
import Sortable, { SortableContainer } from 'react-anything-sortable'
// import { InputNumber } from 'element-react';

const antIcon = <Icon type="loading" style={{ fontSize: 20 }} spin />;
const { TextArea } = Input;
const Option = Select.Option

class JoinForm extends React.Component {
  state = {
    userAttrList: this.props.userAttrList,
    userAttrMap: this.props.userAttrMap,
    mchList: this.props.mchList,

    title: this.props.title,
    descr: this.props.descr,
    attrList: this.props.attrList,
    feeType: !this.props.feeName && (!this.props.fee || this.props.fee == '0') && !this.props.mchId ?1:2,
    feeName: this.props.feeName, 
    fee: this.props.fee,
    mchId: this.props.mchId,
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      userAttrList: newProps.userAttrList,
      userAttrMap: newProps.userAttrMap,
      mchList: newProps.mchList,
  
      title: newProps.title,
      descr: newProps.descr,
      attrList: newProps.attrList,
      feeType: !newProps.feeName && (!newProps.fee || newProps.fee == '0') && !newProps.mchId ?1:2,
      feeName: newProps.feeName, 
      fee: newProps.fee,
      mchId: newProps.mchId,
    })
  }

  handleDrag = (data) => {
    let attrList = this.state.attrList
    let arr = []
    for(let index of data){
      arr.push(attrList[index])
    }
    this.setState({attrList: arr})
  }

  handleChangeTitle = (e) => {
    this.setState({title: e.target.value})
  }

  handleChangeDescr = (e) => {
    this.setState({descr: e.target.value})
  }

  handleChangeCheck = (e, node) => {
    let attrList = this.state.attrList
    node.isRequired = e.target.checked?"1":"0"
    this.setState({attrList})
  }

  handleDeleteAttr = (node) => {
    let attrList = this.state.attrList
    let userAttrMap = this.state.userAttrMap
    let i = 0
    for(let attr of attrList){
      if(node.attrId == attr.attrId){
        attrList.splice(i, 1)
        userAttrMap[node.attrId]._disable = false
      }
      i++
    }
    this.setState({attrList})
  }

  handleChangeAddVisible = (visible) => {
    if(visible == false){
      return
    }
    this.setState({addVisible: visible})
  }

  handleCloseAdd = () => {
    this.setState({addVisible: false})
  }

  handleAddSubmit = () => {
    let userAttrMap = this.state.userAttrMap
    let attrList = this.state.attrList
    let addAttr = this.state.addAttr
    if(!addAttr){
      return
    }
    attrList.push({
      attrId: addAttr,
      isRequired: '0'
    })
    userAttrMap[addAttr]._disable = true
    this.setState({attrList,addVisible: false,addAttr: undefined})
  }

  hanldeSubmit = () => {
    if(!this.state.title){
      message.error("请输入标题")
      return
    }
    let param = {
      title: this.state.title,
      descr: this.state.descr,
      attrList: JSON.stringify(this.state.attrList),
    }
    if(this.props.type == '2' && this.state.feeType == '2'){
      if(!this.state.feeName){
        message.error("请输入收费名")
        return
      }
      if(!this.state.fee || this.state.fee == '0'){
        message.error("请输入金额")
        return
      }
      if(!this.state.mchId){
        message.error("请选择收费账户")
        return
      }
      param.feeName = this.state.feeName
      param.fee = Math.round(this.state.fee*100).toString()
      param.mchId = this.state.mchId
    }
    if(this.props.tableType){
      param.type = '2'  //  意向
    }else{
      param.type = '1'  //  入学招生
    }
    this.props.onSubmit(param)
  }

  handleChangeAttrOption = (value) => {
    this.setState({addAttr: value})
  }

  handleChangeFeeType = (e) => {
    this.setState({feeType: e.target.value})
  }

  handleChangeFeeName = (e) => {
    this.setState({feeName: e.target.value})
  }

  handleChangeFee = (value) => {
    this.setState({fee: value})
  }

  handleChangeMch = (value) => {
    this.setState({mchId: value})
  }

  createMchOption = (mchList) => {
		const options = []
		if(mchList){
			for (let select of mchList) {
				options.push(<Option key={select.id} value={select.id} title={select.name}>{select.name}</Option>)
			}
			return options
		}
		return null;
	}

  createAttrOption = (userAttrList) => {
    const options = [];
    if(userAttrList){
      for(let node of userAttrList){
        if(!node._disable){
          options.push(<Option key={node.id} value={node.id} title={node.name}>{node.name}</Option>)
        }
      }
    }
		return options;
  }

  renderAttr = (userAttrMap,attrList) => {
    let list = []
    let i = 0
    for(let node of attrList){
      list.push(<SortableContainer className="sort" sortData={i} key={i}>
        <Row style={{paddingTop:'20px'}}>
          <span style={{fontSize:'14px'}}>{i+1}.{userAttrMap[node.attrId]?userAttrMap[node.attrId].name:''}</span>
          <Icon type="delete" style={{float:'right',marginTop:'4px',cursor: 'pointer', visibility: node.cantDel?'hidden':''}} onClick={(e) => { e.stopPropagation(); this.handleDeleteAttr(node) }}/>
          <Checkbox checked={node.isRequired=='1'} style={{float:'right'}} onChange={(e)=>this.handleChangeCheck(e,node)}>必填</Checkbox>
        </Row>
        <Row style={{marginTop:'10px'}}>
          {
            userAttrMap[node.attrId] && userAttrMap[node.attrId].valueType==1?<Input style={{width:'100%'}} placeholder={"请输入"+(userAttrMap[node.attrId]?userAttrMap[node.attrId].name:'')} disabled={true}/>:
            <Select style={{width:'100%'}} placeholder={"请选择"+(userAttrMap[node.attrId]?userAttrMap[node.attrId].name:'')} disabled={true}/>
          }
          
        </Row>
      </SortableContainer>)
      i++
    }

    return list
  }

  render () {
    const {
      setFormVisible, styles, onClose, tableType,
      // title, descr, userAttrList, userAttrMap, attrList, addVisible, addAttr
    } = this.props
    let {title, descr, userAttrList, userAttrMap, mchList, attrList, addVisible, addAttr, feeType, feeName, fee, mchId} = this.state
    return (
      <Modal
        visible={setFormVisible}
        onCancel={()=>{onClose()}}
        title={"报名表单设置"}
        footer={null}
        width={'600px'}
        maskClosable={false}
        >
          <div style={{maxWidth:'600px',margin:'auto'}}>
                <Row>
                  <Input value={title} onChange={this.handleChangeTitle} style={{borderTop:'0',borderLeft:'0',borderRight:'0',textAlign:'center',fontSize:'22px'}} placeholder="请输入表单标题"/>
                </Row>
                <Row style={{marginTop:'30px'}}>
                  <TextArea rows={4} value={descr} onChange={this.handleChangeDescr} placeholder="请输入表单标题"/>
                </Row>
                <Row>
                <Sortable direction="vertical" dynamic sortHandle="ui-sortable-item" onSort={this.handleDrag} containment={true}>
                {this.renderAttr(userAttrMap,attrList)}
                </Sortable>
                </Row>
                <Row style={{marginTop:'20px'}}>
                <Popover
                  content={
                    <div style={{'width':"250px"}}>
                      <div className={styles.sortText} style={{width:'60px'}}>题目:</div>
                      <Select value={addAttr} className={styles.sortSelectMuti} placeholder={"选择题目"} showSearch
                        optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        onChange={this.handleChangeAttrOption}>
                        {this.createAttrOption(userAttrList)}
                      </Select>
                      <div style={{marginTop:'10px'}}>
                        <Button style={{marginLeft:'60px'}} size='small' onClick={this.handleCloseAdd}>取消</Button>
                        <Button style={{marginLeft:'40px'}} size='small' onClick={()=>this.handleAddSubmit()} type="primary">保存</Button>
                      </div>
                    </div>
                  }
                  title={"添加题目"}
                  trigger="click"
                  placement="right"
                  visible={addVisible}
                  onVisibleChange={(visible)=>{this.handleChangeAddVisible(visible)}}
                >
                  <div style={{border:'1px dashed #1890ff', borderRadius:'5px', textAlign:'center', height:"30px", width:'100px', padding:'4px 0 5px 0'}}>
                  <a style={{fontSize:'13px'}}><Icon type="plus"/>添加题目</a>
                  </div>
                  </Popover>
                </Row>
                {tableType && <Row>
                  <span style={{ fontSize: '18px', marginTop: '40px', borderLeft: '5px solid #1890ff', paddingLeft: '10px', marginBottom: '30px', display: 'block'}}>报名费用</span>
                  <Radio.Group onChange={this.handleChangeFeeType} value={feeType} style={{paddingLeft: '20px'}}>
                    <Radio value={1} style={{display: 'block', marginBottom: '10px'}}>免费</Radio>
                    <Radio value={2}>
                      <Input value={feeName} onChange={this.handleChangeFeeName} style={{width:'100px', marginRight: '10px'}} placeholder="请输入费用名称" disabled={feeType == 1}/>
                      金额(￥)：
                      <InputNumber type={'number'} value={fee} onChange={this.handleChangeFee} style={{width:'100px',}} placeholder="请输入" min={0} disabled={feeType == 1}/>
                      <div style={{display: 'inline-block', width: '150px', marginLeft: '10px'}}>
                        <span style={{marginRight: '8px'}}>收费账户：</span>
                        <Select style={{ margin: '-10px', width:'100%' }} value={mchId} defaultValue={mchId} onChange={this.handleChangeMch}
                        disabled={feeType == 1}
                        showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        notFoundContent={!mchList ? <Spin size="small" /> : null}>
                          {this.createMchOption(mchList)}
                        </Select>
                      </div>
                    </Radio>
                  </Radio.Group>
                </Row>}
                <Row style={{textAlign:'center',marginTop:'50px'}}>
                  <Button type="primary" onClick={this.hanldeSubmit}>保存并发布</Button>
                </Row>
              </div>
        </Modal>
    )
  }
}
JoinForm.propTypes = {
  setFormVisible:PropTypes.bool,
  title: PropTypes.string,
  descr: PropTypes.string,
  tableType: PropTypes.string,
  fee: PropTypes.string,
  type:  PropTypes.string,
  feeName: PropTypes.string,
  mchId: PropTypes.string,
  userAttrMap: PropTypes.object,
  userAttrList: PropTypes.object,
  attrList: PropTypes.object,
  mchList: PropTypes.object,
  styles: PropTypes.object,
  getFormat: PropTypes.func,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
}

export default JoinForm

