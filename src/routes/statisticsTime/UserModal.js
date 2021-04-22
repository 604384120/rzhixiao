import { Row, Col, Modal, Button, Spin, Divider, Table,Select } from "antd";
import { getFormat } from 'utils'
import styles from '../common.less'
import { UserSort, UserSortLayer, SortSelect } from 'components'

const { Option } = Select

const UserModal = ({
  modalData, modalVisible, modalType, timeType,
  missionList, subjectList,
  userSortProps, userSortMap, userSortList, userAttrMap, sortSence,
  onClose,
  onGetAttrRelateList,
  onUpdateState,
  onGetDetail,
}) => {
  if(!modalData){
    return
  }
  const structSelectProps = {
    dataLoading: modalData.dataLoading,
    userSortMap,
    userAttrMap,
    styles,
    onGetSelectList (data) {
      onGetAttrRelateList (data)
    },

    onChangeSort (value, attr) {
      onUpdateState()
    },
  }
  const handleChangeMission = (value) => {
    modalData.missionId = value
    onUpdateState({modalData})
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

  const handleChangeSubject = (value) => {
    modalData.subjecId = value
    onUpdateState({modalData})
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
  const handleQueryData = () => {
    onGetDetail({
      missionId: modalData.missionId,
      sortList: userSortList,
      subjecId: modalData.subjecId,
      time: modalData.info.createDate,
      timeType
    })
  }
  const handleResetQuery = () => {
    for (let sort of userSortList) {
      if (sort._idSelected) {
        sort._idSelected = []
      }
    }
    modalData.missionId = undefined
    modalData.subjecId  = undefined
    onUpdateState({modalData})
  }
  const createSort = () => {
    let i = 0
    let list;
    if(modalType == 1){
      list = [
        {
          id:i++,
          content:(
          <div className={styles.sortCol} >
            <div className={styles.sortText}>任务名称:</div>
            <Select  disabled={modalData.dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={modalData.missionId} className={styles.sortSelectMuti} placeholder={"选择任务"} onChange={handleChangeMission}>
            {createMissionOption()}
            </Select>
          </div>
          )
        }
      ]
    }
    else if(modalType == 2){
      list = [
        {
          id:i++,
          content:(
          <div className={styles.sortCol} >
            <div className={styles.sortText}>项目名称:</div>
            <Select  disabled={modalData.dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={modalData.subjecId} className={styles.sortSelectMuti} placeholder={"选择任务"} onChange={handleChangeSubject}>
            {createSubjectOption()}
            </Select>
          </div>
          )
        }
      ]
    }else if(modalType == 3){
      list = [
        {
          id:i++,
          content:(
          <div className={styles.sortCol} >
            <div className={styles.sortText}>任务名称:</div>
            <Select  disabled={modalData.dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={modalData.missionId} className={styles.sortSelectMuti} placeholder={"选择任务"} onChange={handleChangeMission}>
            {createMissionOption()}
            </Select>
          </div>
          )
        },{
          id:i++,
          content:(
          <div className={styles.sortCol} >
            <div className={styles.sortText}>项目名称:</div>
            <Select  disabled={modalData.dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={modalData.subjecId} className={styles.sortSelectMuti} placeholder={"选择项目"} onChange={handleChangeSubject}>
            {createSubjectOption()}
            </Select>
          </div>
          )
        }
      ]
    }
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
    query:(<div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', textAlign:'center' }}>
      <Button disabled={modalData.dataLoading} onClick={handleQueryData} style={{ marginRight: '10px' }}>查询</Button>
      <Button disabled={modalData.dataLoading} onClick={handleResetQuery} style={{ marginRight: '10px' }}>重置</Button>
      <UserSort {...userSortProps} />
    </div>),
    }

  
  if(modalType == 1){
    //项目明细
    const getStatisticsColumns = () => {
      return [
        {title:'项目名称',dataIndex: "subjectName", width: '100px'},
        {title:'缴费金额',dataIndex: "totalFee", width: '100px', render: (text, record) => {return getFormat(text)}},
        {title:'缴费笔数',dataIndex: "totalOrder", width: '100px'},
        {title:'退费金额',dataIndex: "refundFee", width: '100px', render: (text, record) => {return getFormat(text)}},
        {title:'退费笔数',dataIndex: "refundOrder", width: '100px'},
      ]
    }
    return(<Modal
      visible={modalVisible}
      onCancel={()=>{onClose()}}
      title={"项目明细"}
      footer={null}
      width={'1100px'}
      maskClosable={false}
    >
      <UserSortLayer {...layerProps} />
      <Divider style={{ margin: '5px' }} dashed />
      <Row style={{textAlign:'center',fontSize:'18px',fontWeight:'bolder',marginBottom:'10px'}}>{modalData.info.createDate}项目统计</Row>
      <Row><Table
        dataSource={modalData.dataList}
        bordered
        size="middle"
        columns={getStatisticsColumns()}
        pagination={false}
        loading={modalData.dataLoading}
        className={styles.fixedTable}
        scroll={{x:500}}
        />
      </Row>
    </Modal>)
  }else if(modalType == 2){
    //任务明细
    const getStatisticsColumns = () => {
      return [
        {title:'任务名称',dataIndex: "missionName", width: '100px'},
        {title:'缴费金额',dataIndex: "totalFee", width: '100px', render: (text, record) => {return getFormat(text)}},
        {title:'缴费笔数',dataIndex: "totalOrder", width: '100px'},
        {title:'退费金额',dataIndex: "refundFee", width: '100px', render: (text, record) => {return getFormat(text)}},
        {title:'退费笔数',dataIndex: "refundOrder", width: '100px'},
      ]
    }
    return(<Modal
      visible={modalVisible}
      onCancel={()=>{onClose()}}
      title={"任务明细"}
      footer={null}
      width={'1100px'}
      maskClosable={false}
    >
      <UserSortLayer {...layerProps} />
      <Divider style={{ margin: '5px' }} dashed />
      <Row style={{textAlign:'center',fontSize:'18px',fontWeight:'bolder',marginBottom:'10px'}}>{modalData.info.createDate}任务统计</Row>
      <Row><Table
        dataSource={modalData.dataList}
        bordered
        size="middle"
        columns={getStatisticsColumns()}
        pagination={false}
        loading={modalData.dataLoading}
        className={styles.fixedTable}
        scroll={{x:500}}
        />
      </Row>
    </Modal>)
  }else if(modalType == 3){
    //收费方式明细
    const getStatisticsColumns = () => {
      return [
        {title:'收费方式',dataIndex: "payTypeName", width: '100px'},
        {title:'缴费金额',dataIndex: "totalFee", width: '100px', render: (text, record) => {return getFormat(text)}},
        {title:'缴费笔数',dataIndex: "totalOrder", width: '100px'},
        {title:'退费金额',dataIndex: "refundFee", width: '100px', render: (text, record) => {return getFormat(text)}},
        {title:'退费笔数',dataIndex: "refundOrder", width: '100px'},
      ]
    }
    return(<Modal
      visible={modalVisible}
      onCancel={()=>{onClose()}}
      title={"收费方式明细"}
      footer={null}
      width={'1100px'}
      maskClosable={false}
    >
      <UserSortLayer {...layerProps} />
      <Divider style={{ margin: '5px' }} dashed />
      <Row style={{textAlign:'center',fontSize:'18px',fontWeight:'bolder',marginBottom:'10px'}}>{modalData.info.createDate}收费方式统计</Row>
      <Row><Table
        dataSource={modalData.dataList}
        bordered
        size="middle"
        columns={getStatisticsColumns()}
        pagination={false}
        loading={modalData.dataLoading}
        className={styles.fixedTable}
        scroll={{x:500}}
        />
      </Row>
    </Modal>)
  }
}

export default UserModal