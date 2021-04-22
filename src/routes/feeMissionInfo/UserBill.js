import { Row, Col, Card, Button, Input, Select, message, Tag, Divider, Menu, Popover, Dropdown, Spin, Icon } from 'antd'
//import UserBillSort from './UserBillSort'
//import UserBillDisplay from './UserBillDisplay'
import UserBillTable from './UserBillTable'
import UserBillModal from './UserBillModal'
import UserBillTableModal from './UserBillTableModal'
import styles from '../common.less'
import { config } from 'utils'
import queryString from 'query-string'
import { getFormat, getSortParam, token } from 'utils'
import { UserSortLayer, UserSort, UserDisplay, SortSelect } from 'components'
//import UserDisplay from '../../components/UserDisplay';

const { api } = config
const Option = Select.Option
const Search = Input.Search

const UserBill = ({
  missionId,
  missionInfo,
  billData,
  userDisplaySence,
  userAttrList,
  userAttrMap,
  subjectList,
  subjectMap,
  user,isNavbar,
  menuMap,
  displayUpdateState,
  displayReset,
  displayUpdate,
  displayAttrRelateList,
  onUpdateState,
  onGetBillList,
  onResetUserAttr,
  onUpdateUserAttr,
  onUpdateBills,
  onUpdateBillsBatch,
  onBillAdd,
  onCreateBills,
  onGetCreateBillsPrs,
  onImportConfirm,
  onImportCover,
  onGetImportPrs,
  onUpdateSort,
  onQueryOperateHistory
}) => {
  const {sortSence, displaySence, userSortExtra}  = billData
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const userDisplayList = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayList?userDisplaySence[displaySence].displayList:[]
  const userDisplayMap = userDisplaySence[displaySence]&&userDisplaySence[displaySence].displayMap?userDisplaySence[displaySence].displayMap:{}

  const billQueryParam = {
    missionId,
    pageNum: billData.pageNum,
    pageSize: billData.pageSize,
    key: billData.searchName,
    sortList: userSortList,
    subjectId: billData.subjectId,
  }

  const userDisplayProps = {
    userAttrList,
    ...userDisplaySence[displaySence],
    onUpdateState (data) {
      displayUpdateState(data, displaySence)
    },
    onReset () {
      displayReset(displaySence)
    },
    onUpdate (data) {
      displayUpdate(data, displaySence)
    },
  }
  const userSortProps = {
    userAttrList,
    ...userDisplaySence[sortSence],
    displayExtra: userSortExtra,
    onUpdateState (data) {
      displayUpdateState(data, sortSence)
    },
    onReset () {
      displayReset(sortSence, userSortExtra)
    },
    onUpdate (data) {
      displayUpdate(data, sortSence)
    },
  }
  const structSelectProps = {
    dataLoading: billData.dataLoading,
    userSortMap,
    userAttrMap,
    styles,
    onGetSelectList (data) {
      displayAttrRelateList({ ...data }, sortSence,)
    },

    onChangeSort (value, attr) {
      onUpdateSort()  // 加蒙版
    },
  }

  const userBillTableProps = {
    dataSource: billData.list,
    userDisplayList,
    ...billData,
    user,
    menuMap,
    missionInfo,
    onChangePage (n, s) {
      billQueryParam.pageNum = n
      billQueryParam.pageSize = s
      handleQueryBill()
    },
    onAdjust (data) {
      //根据列表生成表格
      let tempArr = [];
      for(let subject of subjectList){
        if(billData.subjectId && billData.subjectId.length>0 && billData.subjectId.indexOf(subject.id)<0){
          continue
        }
        let addFlag = true;
        for (let node of data.feeBillListEntities) {
          if(subject.id == node.subjectId){
            node._totalFee = getFormat(node.totalFee)
            node._reason = node.reason
            node._status = node.status
            node._count = 1
            tempArr.push({...node})
            addFlag = false;
            break;
          }
        }
        if(addFlag){
          let tempNode = {
            subjectId:subject.id,
            subjectName:subject.name,
            totalFee: 0,
            _totalFee: 0,
            status: '0',
            _status: '0',
            reason: '',
            _reason: '',
            _addUserId: [data.userId],
            _count: 1          
          }
          tempArr.push(tempNode);
        }
      }
      billData.modalData = {...data}
      billData.modalData.feeBillListEntities = tempArr
      billData.modalData.dataSource = tempArr
      billData.modalData.userId = [data.userId]
      billData.modalVisible = true
      billData.modalType = 'adjust'
     	onUpdateState(billData)
    },
    onDiscount (data) {
      let tempArr = [];
      for (let node of data.feeBillListEntities) {
        node._disStandId = node.disStandId;
        tempArr.push({...node})
      }
      billData.modalData = {...data}
      billData.modalData.feeBillListEntities = tempArr
      billData.modalData.dataSource = [{_add:true}]
      billData.modalData.userId = [data.userId]
      billData.modalVisible = true
      billData.modalType = 'discount'
      onUpdateState({ ...billData, ...data })
    },
    onDeferred (data) {
      let tempArr = [];
      for (let node of data.feeBillListEntities) {
        node._defStandId = node.defStandId;
        tempArr.push({...node})
      }
      billData.modalData = {...data}
      billData.modalData.feeBillListEntities = tempArr
      billData.modalData.dataSource = tempArr
      billData.modalData.userId = [data.userId]
      billData.modalVisible = true
      billData.modalType = 'deferred'
      onUpdateState({ ...billData, ...data })
    },
    onUpdateState (data) {
      billData.selectedAll = data.selectedAll
      billData.selectedBills = data.selectedBills
      onUpdateState({ ...billData })
    },
    onTableOperateHistory (data,mask) {
      onQueryOperateHistory(data,mask)
    }
  }

  const userBillModalProps = {
    ...billData,
    dataSource: billData.modalData.dataSource,
    missionId,
    subjectMap,
    user,
    onClose () {
      billData.modalVisible = false
      billData.modalType = ''
      onUpdateState(billData)
    },
    onUpdateState (data) {
      onUpdateState({ ...billData, ...data })
    },
    onUpdateBills (data) {
      if(data.params){
        data.params = billQueryParam
        data.params.count = billData.count
        delete data.params.pageNum
        delete data.params.pageSize
        if(data.params.missionId){data.params.missionId = data.params.missionId.toString()}
        if(data.params.subjectId){data.params.subjectId = data.params.subjectId.toString()}
      }
      onUpdateBills({
        ...data
      })
    },
    onImportConfirm () {
      if(!billData.modalImportData.excel){
        message.error('请选择文件');
        return;
      }
      onImportConfirm({
        missionId,
        file:billData.modalImportData.excel.fileName,
        importType: billData.modalImportData.importType,
        timer: setInterval(() => {
          onGetImportPrs({ missionId })
        }, 1500)
      })
    },
    onImportCover () {
      onImportCover({
        missionId,
        timer: setInterval(() => {
          onGetImportPrs({ missionId })
        }, 1500)
      })
    },

  }

  const userBillTableModalProps = {
    ...billData,
    onModalTableVisible () {
      billData.modalTableVisible = false,
      onUpdateState(billData)
    }
  }

  const handleAdjust = () => {
    //根据列表生成表格
    let tempArr = [];
    for(let subject of subjectList){
      if(billData.subjectId && billData.subjectId.length>0 && billData.subjectId.indexOf(subject.id)<0){
        continue
      }
      let tempNode = {
        id: undefined,
        subjectId:subject.id,
        subjectName:subject.name,
        totalFee: 0,
        _totalFee: 0,
        status: '0',
        _status: '0',
        reason: '',
        _reason: '',
        _addUserId: undefined,
        _count: billData.selectedBills.length,
      }
      for(let index of billData.selectedBills){
        let data = billData.list[index]
        let addFlag = true
        for (let node of data.feeBillListEntities) {
          if(subject.id == node.subjectId){
            //存在对应的账单
            if(tempNode.id){
              tempNode.id.push(node.id)
            }else{
              //取第一个人的数据
              tempNode.totalFee = node.totalFee
              tempNode.reason = node.reason
              tempNode.status = node.status
              tempNode._totalFee = getFormat(node.totalFee)
              tempNode._reason = node.reason
              tempNode._status = node.status
              tempNode.id = [node.id]
            }
            addFlag = false
            break
          }
        }
        if(addFlag){
          if(tempNode._addUserId){
            tempNode._addUserId.push(data.userId)
          }else{
            tempNode._addUserId = [data.userId]
          }
        }
      }
      if(tempNode.id){
        tempNode.id = tempNode.id.toString()
      }
      tempArr.push(tempNode)
    }
    
    billData.modalData = {}
    if(!billData.selectedAll && billData.selectedBills && billData.selectedBills.length>0){
      let userId = []
      for(let index of billData.selectedBills){
        userId.push(billData.list[index].userId)
      }
      billData.modalData.userId = userId
    }

    billData.modalData.feeBillListEntities = tempArr
    billData.modalData.dataSource = tempArr
    billData.modalVisible = true
    billData.modalType = 'adjust'
    onUpdateState(billData)
  }

  const handleDiscount = () => {
    let tempArr = [];
    for(let subject of subjectList){
      let tempNode = undefined
      for(let index of billData.selectedBills){
        let data = billData.list[index]
        for (let node of data.feeBillListEntities) {
          if(subject.id == node.subjectId && node.status!='0'){
            if(tempNode){
              tempNode.ids.push(node.id)
            }else{
              tempNode = {...node}
              tempNode.ids = [node.id]

            }
            break;
          }
        }
      }
      if(tempNode){
        tempNode.id = tempNode.ids.toString()
        tempArr.push(tempNode)
      }
    }
    billData.modalData = {}
    if(!billData.selectedAll && billData.selectedBills && billData.selectedBills.length>0){
      let userId = []
      for(let index of billData.selectedBills){
        userId.push(billData.list[index].userId)
      }
      billData.modalData.userId = userId
    }
    billData.modalData.feeBillListEntities = tempArr
    billData.modalData.dataSource = [{_add:true}]
    billData.modalVisible = true
    billData.modalType = 'discount'
    onUpdateState(billData)
  }

  const handleDeferred = () => {
    let tempArr = [];
    for(let subject of subjectList){
      let tempNode = undefined
      for(let index of billData.selectedBills){
        let data = billData.list[index]
        for (let node of data.feeBillListEntities) {
          if(subject.id == node.subjectId && node.status!='0'){
            if(tempNode){
              tempNode.ids.push(node.id)
            }else{
              tempNode = {...node}
              tempNode.ids = [node.id]
              
            }
            break;
          }
        }
      }
      if(tempNode){
        tempNode.id = tempNode.ids.toString()
        tempArr.push(tempNode)
      }
    }
    billData.modalData = {}
    if(!billData.selectedAll && billData.selectedBills && billData.selectedBills.length>0){
      let userId = []
      for(let index of billData.selectedBills){
        userId.push(billData.list[index].userId)
      }
      billData.modalData.userId = userId
    }
    billData.modalData.feeBillListEntities = tempArr
    billData.modalData.dataSource = tempArr
    billData.modalVisible = true
    billData.modalType = 'deferred'
    onUpdateState(billData)
  }

  const handleShowImport = () => {
    billData.modalVisible = true
    billData.modalType = 'bilImport'
    billData.modalImportData = {
      step:0,
      importing: false,
      covering: false,
    };
    onUpdateState(billData)
  }

  const handleChangeSubject = (value, attr) => {
    billData.subjectId= value
    billData.pageNum = 1
    billData.list = []
    billData.count = 0
    onUpdateState(billData)
    onUpdateSort()    //项目名称加蒙版
  }

  const handleQueryBill = () => {
    onGetBillList(billQueryParam)
  }

  const handleChangeSearchName = (value) => {
    billData.searchName = value.target.value
    onUpdateState(billData)
  }

  const handleResetQueryBill = () => {
    for (let sort of userSortList) {
      if (sort._idSelected) {
        delete sort._idSelected
      }
    }
    onUpdateState(billData)
    onUpdateSort()
  }

  const handleBillSearch = (name) => {
    if (name || billData.searchName) {
      billQueryParam.key = name
      handleQueryBill()
    }
  }

  const handleFormatVisibleChange = (visible) => {
    billData.formatVisible = visible;
    onUpdateState(billData)
  }

  const handleChangeFormat = (format) => {
    billData.exportFormat = format;
    onUpdateState(billData)
  }

  const renderFormat = () => {
    return(
      <div style={{width:'530px', height:'250px'}}>
          <Col span={3} style={{textAlign:'center'}}>
            <div><Tag color={billData.exportFormat!=2&&billData.exportFormat!=3?"blue":""} onClick={()=>handleChangeFormat(1)}>&nbsp;&nbsp;格式1&nbsp;&nbsp;</Tag></div>
            <div style={{marginTop:'15px'}}><Tag color={billData.exportFormat==2?"blue":""} onClick={()=>handleChangeFormat(2)}>&nbsp;&nbsp;格式2&nbsp;&nbsp;</Tag></div>
            <div style={{marginTop:'15px'}}><Tag color={billData.exportFormat==3?"blue":""} onClick={()=>handleChangeFormat(3)}>&nbsp;&nbsp;格式3&nbsp;&nbsp;</Tag></div>
          </Col>
          <Col span={21} style={{borderLeft:"1px solid rgb(240,240,240)"}}>
          <div style={{marginLeft:'10px',marginBottom:'5px'}}>示例：</div>
          {
            billData.exportFormat==2?
            <table border="1px" borderColor="#ddd" className={styles.formatTable} style={{marginLeft:'10px',textAlign:'center',verticalAlign:'middle',width:'450px'}}>
            <thead style={{background:"rgb(245,245,245)"}}>
            <tr>
              <td rowspan="2">姓名</td>
              <td rowspan="2">应收总计</td>
              <td rowspan="2">收费总计</td>
              <td colspan="2">学费</td>
              <td colspan="2">住宿费</td>
            </tr>
            <tr>
              <td>应收金额</td>
              <td>收费金额</td>
              <td>应收金额</td>
              <td>收费金额</td>
            </tr>
          </thead>
          <tbody>
          <tr>
            <td>学生1</td>
            <td>100.00</td>
            <td>50.00</td>
            <td>50.00</td>
            <td>50.00</td>
            <td>50.00</td>
            <td>0</td>
          </tr>
          <tr>
            <td>学生2</td>
            <td>100.00</td>
            <td>50.00</td>
            <td>50.00</td>
            <td>50.00</td>
            <td>50.00</td>
            <td>0</td>
          </tr>
          <tr>
            <td>学生3</td>
            <td>100.00</td>
            <td>50.00</td>
            <td>50.00</td>
            <td>50.00</td>
            <td>50.00</td>
            <td>0</td>
          </tr>
        </tbody>
              </table>
            :billData.exportFormat==3?<table border="1px" borderColor="#ddd" className={styles.formatTable} style={{marginLeft:'10px',textAlign:'center',verticalAlign:'middle',width:'450px'}}>
            <thead style={{background:"rgb(245,245,245)"}}>
              <tr>
                <td>学号</td>
                <td>姓名</td>
                <td>身份证件号</td>
                <td>任务名称</td>
                <td>项目名称</td>
                <td>应收金额</td>
                <td>调整原因</td>
              </tr>
            </thead>
            <tbody>
									<tr>
										<td>001</td>
										<td>张某某</td>
                    <td>140621200612207843</td>
										<td>2018年春收</td>
										<td>学费</td>
										<td>50.00</td>
										<td>贫困生</td>
									</tr>
									<tr>
                    <td>001</td>
										<td>张某某</td>
                    <td>140621200612207843</td>
										<td>2018年春收</td>
										<td>学费</td>
										<td>50.00</td>
										<td>贫困生</td>
									</tr>
									<tr>
                    <td>001</td>
										<td>张某某</td>
                    <td>140621200612207843</td>
										<td>2018年春收</td>
										<td>学费</td>
										<td>50.00</td>
										<td>贫困生</td>
									</tr>
								</tbody>
              </table>:<table border="1px" borderColor="#ddd" className={styles.formatTable} style={{marginLeft:'10px',textAlign:'center',verticalAlign:'middle',width:'450px'}}>
            <thead style={{background:"rgb(245,245,245)"}}>
              <tr>
                <td>姓名</td>
                <td>应收总计</td>
                <td>收费总计</td>
                <td>项目名称</td>
                <td>应收金额</td>
                <td>收费金额</td>
              </tr>
            </thead>
            <tbody>
									<tr>
										<td rowspan="2">学生1</td>
										<td rowspan="2">100.00</td>
                    <td rowspan="2">100.00</td>
										<td>学费</td>
										<td>50.00</td>
										<td>50.00</td>
									</tr>
									<tr>
										<td>住宿费</td>
										<td>50.00</td>
										<td>50.00</td>
									</tr>
									<tr>
										<td rowspan="2">学生2</td>
										<td rowspan="2">100.00</td>
                    <td rowspan="2">100.00</td>
										<td>学费</td>
										<td>50.00</td>
										<td>50.00</td>
									</tr>
									<tr>
										<td>住宿费</td>
										<td>50.00</td>
										<td>50.00</td>
									</tr>
								</tbody>
              </table>
          }
          <Button type="primary" style={{marginTop:'15px', float:"right"}} target="_blank" href={getExportUrl()}>确认导出</Button>
          </Col>
      </div>
    )
  }

  const getExportUrl = () => {
    let tempParam = { ...billQueryParam }
    let tempList = getSortParam(tempParam.sortList)
    if (tempList && tempList.length>0) {
      tempParam.sortList = JSON.stringify(tempList)
    } else {
      tempParam.sortList = null
    }
    if(token()){
      tempParam.token = token()
    }

    delete tempParam.pageNum
    delete tempParam.pageSize
    tempParam.sence =  displaySence
    tempParam.form = billData.exportFormat==2 || billData.exportFormat==3?billData.exportFormat:1;
    let url = `${api.exportBills}?${queryString.stringify(tempParam)}`

    return url
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
            <div className={styles.sortText}>项目名称:</div>
                <Select disabled={billData.dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={billData.subjectId} className={styles.sortSelectMuti} placeholder={"选择项目"} onChange={handleChangeSubject}>
                {createSubjectOption()}
                </Select>
          </div>
        ),
      }
    ]

    for(let attr of userSortList){
      list.push({
        id:i++,
        content:(<SortSelect {...{...structSelectProps, attr}}/>)
      })
    }

    return list
    
  }
  const layerProps = {
    list: createSort(),
    query:(<div className={styles.queryBox}>
        <Button className={styles.inquery} type={billData.sortFlag==undefined||billData.sortFlag?"primary":''} loading={billData.dataLoading} onClick={handleQueryBill}>{billData.dataLoading?'':'查询'}</Button>
        <Button className={styles.reset} onClick={handleResetQueryBill} disabled={billData.dataLoading}>重置</Button>
        <UserSort {...userSortProps} className={styles.more}/>
      </div>),
  }

  return (
    <Row gutter={16}>
      {billData.sortFlag&&<div className={styles.masking} style={{width:'120%'}}></div>}
      <Col>
        <Card bordered={false} bodyStyle={{ padding: ' 0' }}>
          <UserSortLayer {...layerProps} />
          <Divider style={{margin:'10px'}} />
          <Row style={{paddingTop:'10px'}}>
             {
              (menuMap['/feeAdjust']==undefined&&menuMap['/feeDiscount']==undefined&&menuMap['/feeDeferred']==undefined)?"":<div style={{display:'inline-block'}}>
              	<Dropdown
                  disabled={billData.selectedBills.length == 0}
					        overlay={
                  <Menu>
                    {menuMap['/feeAdjust']!=undefined&&<Menu.Item key="1"><a onClick={(e)=>{e.stopPropagation();handleAdjust()}}>应收调整</a></Menu.Item>}
                    {menuMap['/feeDiscount']!=undefined&&<Menu.Item key="2"><a onClick={(e)=>{e.stopPropagation();handleDiscount()}}>减免调整</a></Menu.Item>}
                    {menuMap['/feeDeferred']!=undefined&&<Menu.Item key="3"><a onClick={(e)=>{e.stopPropagation();handleDeferred()}}>缓缴调整</a></Menu.Item>}
                  </Menu>}>
              <Button type="primary" style={{ marginRight: '5px',marginBottom:'5px' }} disabled={billData.selectedBills.length == 0}>批量调整</Button></Dropdown>
              {menuMap['/feeAdjust']!=undefined&&<Button style={{ marginRight: '5px',marginBottom:'5px' }} onClick={onBillAdd} >添加账单</Button>}
              {menuMap['/feeAdjust']!=undefined&&<Button style={{ marginRight: '5px',marginBottom:'5px' }} onClick={handleShowImport} >导入账单</Button>}
             </div>
             }
             <Popover title="选择格式"
                content={renderFormat()}
                trigger="click"
                placement="right"
                visible={billData.formatVisible}
                onVisibleChange={handleFormatVisibleChange}
                >
             <Button style={{ marginRight: '5px',marginBottom:'5px' }} target="_blank" href={getExportUrl()}>导出</Button>
             </Popover>
             <div style={{width: isNavbar?'100%':'250px',display:'inline-blck',float: 'right'}}>
              <Search enterButton placeholder="搜索" value={billData.searchName} onChange={(value) => { handleChangeSearchName(value) }} onSearch={value => handleBillSearch(value)} style={{ width: 'calc(100% - 50px)', float: 'right' }} />
              <UserDisplay {...userDisplayProps} />
             </div>
          </Row>
          <Row style={{color:'#1890ff', visibility:billData.selectedBills.length>0?'visible':'hidden',fontSize:'12px'}}>
            <Icon type="check" style={{marginLeft:'5px'}}/> 当前已选择{billData.selectedAll?billData.count:(billData.selectedBills.length?billData.selectedBills.length:'0')}条记录
          </Row>
          <Row>
            <Col span={24}>
              <UserBillTable {...userBillTableProps} />
            </Col>
          </Row>
        </Card>
      </Col>
      { billData.modalVisible && <UserBillModal {...userBillModalProps} /> }
      { billData.modalTableVisible && <UserBillTableModal {...userBillTableModalProps} /> }
    </Row>
  )
}

export default UserBill
