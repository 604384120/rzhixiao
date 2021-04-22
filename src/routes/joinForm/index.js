import { Row, Col, Card, Button, Input, message, Icon, Select, Checkbox, Popover } from 'antd'
import { Page } from 'components'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import styles from "../common.less"
import Sortable, { SortableContainer } from 'react-anything-sortable'

const { TextArea } = Input;
const Option = Select.Option

const JoinForm = ({
  location,
  dispatch,
  joinForm,
  loading,
  app,
}) => {
  const { isNavbar } = app
  const {
    title, descr, userAttrList, userAttrMap, attrList, addVisible, addAttr
  } = joinForm

  const handleDrag = (data) => {
    let arr = []
    for(let index of data){
      arr.push(attrList[index])
    }
    dispatch({
      type: 'joinForm/updateState',
      payload: {
        attrList: arr
      },
    })
  }

  const handleChangeTitle = (e) => {
    dispatch({
      type: 'joinForm/updateState',
      payload: {
        title: e.target.value
      },
    })
  }

  const handleChangeDescr = (e) => {
    dispatch({
      type: 'joinForm/updateState',
      payload: {
        descr: e.target.value
      },
    })
  }

  const handleChangeCheck = (e, node) => {
    node.isRequired = e.target.checked?"1":"0"
    dispatch({
      type: 'joinForm/updateState',
      payload: {
        attrList
      },
    })
  }

  const handleDeleteAttr = (node) => {
    let i = 0
    for(let attr of attrList){
      if(node.attrId == attr.attrId){
        attrList.splice(i, 1)
        userAttrMap[node.attrId]._disable = false
      }
      i++
    }
    dispatch({
      type: 'joinForm/updateState',
      payload: {
        attrList
      },
    })
  }

  const handleChangeAddVisible = (visible) => {
    if(visible == false){
      return
    }
    dispatch({
      type: 'joinForm/updateState',
      payload: {
        addVisible: visible
      },
    })
  }

  const handleCloseAdd = () => {
    dispatch({
      type: 'joinForm/updateState',
      payload: {
        addVisible: false
      },
    })
  }

  const handleAddSubmit = () => {
    if(!addAttr){
      return
    }
    attrList.push({
      attrId: addAttr,
      isRequired: '0'
    })
    userAttrMap[addAttr]._disable = true

    dispatch({
      type: 'joinForm/updateState',
      payload: {
        attrList,
        addVisible: false,
        addAttr: undefined
      },
    })
  }

  const hanldeSubmit = () => {
    if(!title){
      message.error("请输入标题")
      return
    }
    dispatch({
      type: 'joinForm/updateJoinForm',
      payload: {
        title,
        descr,
        attrList: JSON.stringify(attrList)
      },
    })
  }

  const handleChangeAttrOption = (value) => {
    dispatch({
      type: 'joinForm/updateState',
      payload: {
        addAttr: value
      },
    })
  }

  const createAttrOption = () => {
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

  const renderAttr = () => {
    let list = []
    let i = 0
    for(let node of attrList){
      list.push(<SortableContainer className="sort" sortData={i} key={i}>
        <Row style={{paddingTop:'20px'}}>
          <span style={{fontSize:'14px'}}>{i+1}.{userAttrMap[node.attrId]?userAttrMap[node.attrId].name:''}</span>
          <Icon type="delete" style={{float:'right',marginTop:'4px',cursor: 'pointer', visibility: node.cantDel?'hidden':''}} onClick={(e) => { e.stopPropagation(); handleDeleteAttr(node) }}/>
          <Checkbox checked={node.isRequired=='1'} style={{float:'right'}} onChange={(e)=>handleChangeCheck(e,node)}>必填</Checkbox>
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

  return (
    <Page inner>
      <Row gutter={16}>
        <Col>
          <Card bordered={false} bodyStyle={{ padding: '20px 0px'}}>
            <div style={{maxWidth:'600px',margin:'auto'}}>
              <Row>
                <Input value={title} onChange={handleChangeTitle} style={{borderTop:'0',borderLeft:'0',borderRight:'0',textAlign:'center',fontSize:'22px'}} placeholder="请输入表单标题"/>
              </Row>
              <Row style={{marginTop:'30px'}}>
                <TextArea rows={4} value={descr} onChange={handleChangeDescr} placeholder="请输入表单描述"/>
              </Row>
              <Row>
              <Sortable direction="vertical" dynamic sortHandle="ui-sortable-item" onSort={handleDrag} containment={true}>
              {renderAttr()}
              </Sortable>
              </Row>
              <Row style={{marginTop:'20px'}}>
              <Popover
                content={
                  <div style={{'width':"250px"}}>
                    <div className={styles.sortText} style={{width:'60px'}}>题目:</div>
                    <Select value={addAttr} className={styles.sortSelectMuti} placeholder={"选择题目"} showSearch
                      optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onChange={handleChangeAttrOption}>
                      {createAttrOption()}
                    </Select>
                    <div style={{marginTop:'10px'}}>
                      <Button style={{marginLeft:'60px'}} size='small' onClick={handleCloseAdd}>取消</Button>
                      <Button style={{marginLeft:'40px'}} size='small' onClick={()=>handleAddSubmit()} type="primary">保存</Button>
                    </div>
                  </div>
                }
                title={"添加题目"}
                trigger="click"
                placement="right"
                visible={addVisible}
                onVisibleChange={(visible)=>{handleChangeAddVisible(visible)}}
              >
                <div style={{border:'1px dashed #1890ff', borderRadius:'5px', textAlign:'center', height:"30px", width:'100px', padding:'4px 0 5px 0'}}>
                <a style={{fontSize:'13px'}}><Icon type="plus"/>添加题目</a>
                </div>
                </Popover>
              </Row>
              <Row style={{textAlign:'center',marginTop:'50px'}}>
                <Button type="primary" onClick={hanldeSubmit}>保存并发布</Button>
              </Row>
            </div>
           
          </Card>
        </Col>
      </Row>
    </Page>
  )
}

JoinForm.propTypes = {
  joinForm: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default connect(({ joinForm, app, loading }) => ({ joinForm, app, loading }))(JoinForm)

