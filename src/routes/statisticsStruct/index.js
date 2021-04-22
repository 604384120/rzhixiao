import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Card, message, Divider, Select, Spin, Icon, Checkbox, DatePicker } from 'antd'
import { Page, UserStatusSelect, UserSortLayer, BillSum, UserSort, SortSelect } from 'components'
import UserTable from './UserTable'
import UserModal from './UserModal'
import styles from '../common.less'
import queryString from 'query-string'
import { getFormat, getYearFormat, config, getYearNew, getSortParam, token } from 'utils'
import moment from 'moment'

const Option = Select.Option
const antIcon = <Icon type="loading" style={{ fontSize: 20 }} spin />;
const { api, statDataMap, statDataList } = config
const RangePicker = DatePicker.RangePicker;

const StatisticsStruct = ({
  location, dispatch, statisticsStruct, loading, app
}) => {
  const {
    modalVisible, modalData,
    pageNum, pageSize,  missionId, subjectId, structId, structItemPid, year, beginDate, endDate,
    dataList, count, dataLoading, statData,
    structList,
    type, userStatus,
    sortFlag,
    statSence, sortSence, userSortExtra, printTotal
  } = statisticsStruct

  const { userDisplaySence, userAttrList, requestMap, userAttrMap, user } = app
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}
  const statDisplayList = userDisplaySence[statSence]&&userDisplaySence[statSence].displayList?userDisplaySence[statSence].displayList:[]

  const missionList = requestMap['missionList']
  const yearList = requestMap['yearList']
  const subjectList = requestMap['subjectList']

  const queryParam = {
		pageNum,
		pageSize,
		missionId,
    subjectId,
    year,
    structId,
    pid: structItemPid._idSelected,
    type,
    userStatus,
    beginDate,
    endDate,
    sortList: userSortList,
  }

  let statList = []
  if(statDisplayList){
    for(let node of statDisplayList){
      if(statDataMap[node.id]){
        statList.push(statDataMap[node.id])
      }
    }
  }

  const userSortProps = {
    userAttrList,
    ...userDisplaySence[sortSence],
    displayExtra: userSortExtra,
    onUpdateState (data) {
      const {userDisplaySence} = app
      userDisplaySence[sortSence] = {...userDisplaySence[sortSence], ...data}
      dispatch({
        type: 'app/updateState',
        payload: {
          userDisplaySence
        },
      })
    },
    onReset () {
      dispatch({
        type: 'app/resetDisplay',
        payload:{sence:sortSence, displayExtra:userSortExtra, onFilter: true}
      })
    },
    onUpdate (data) {
      dispatch({type: 'statisticsStruct/updateSort'})  // 更多筛选加蒙版
      dispatch({
        type: 'app/updateDisplay',
        payload: {
          displayListTemp:data,
          sence: sortSence,
        },
      })
    },
  }
  const structSelectProps = {
    dataLoading,
    userSortMap,
    userAttrMap,
    styles,
    onGetSelectList (data) {
      dispatch({
        type: 'app/getAttrRelateList',
        payload: {
          ...data
        },
      })
    },

    onChangeSort (value, attr) {
      dispatch({type: 'statisticsStruct/updateSort'})  // 加蒙版
    },
  }

  const billSumProps = {
    statData,
    statList,
    dataLoading,
    styles,
    getFormat,
    type,
    step: statList.length<6?statList.length+1:6,
    setting:{
      userAttrList:statDataList,
      ...userDisplaySence[statSence],
      onUpdateState (data) {
        userDisplaySence[statSence] = {...userDisplaySence[statSence], ...data}
        dispatch({
          type: 'app/updateState',
          payload: {
            userDisplaySence
          },
        })
      },
      onReset (displayExtra) {
        dispatch({
          type: 'app/resetDisplay',
          payload:{sence: statSence, displayExtra}
        })
      },
      onUpdate (data) {
        dispatch({
          type: 'app/updateDisplay',
          payload: {
            displayListTemp:data,
            sence: statSence
          },
        })
      },
    }
  }

  const userTableProps = {
    dataSource: dataList,
    count,
    pageNum,
    pageSize,
    dataLoading,
    structId,
    structList,
    type,
    onChangePage (n, s) {
      dispatch({
        type: 'statisticsStruct/getDataList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
        },
      })
    },
    onShowDetail (data) {
      dispatch({
        type: 'statisticsStruct/showDetail',
        payload: {
          ...data,
          structId,
          sortList: queryParam.sortList
        },
      })
    },
  }


  const userModalProps = {
    modalVisible, modalData,
    yearList, missionList, subjectList, beginDate, endDate,
    user,
    onClose () {
      dispatch({
        type: 'statisticsStruct/updateState',
        payload: {
          modalVisible: false,
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'statisticsStruct/updateState',
        payload: {
         ...data
        },
      })
    },
    onGetDataList (data) {
      dispatch({
        type: 'statisticsStruct/getStatSubject',
        payload: {
         ...data
        },
      })
    },
    onChangeDate (value) {
      modalData.beginDate = value.length == 0?'':value[0].format('YYYY-MM-DD HH:mm:ss'),
      modalData.endDate = value.length == 0?'':value[1].format('YYYY-MM-DD HH:mm:ss'),
      dispatch({
        type: 'statisticsStruct/updateState',
        payload:{
          modalData
        },
      })
    }
  }

  const handleResetQuery = () => {
    for (let node of structList) {
      delete node._idSelected
      delete node._selectList
    }
    for (let sort of userSortList) {
      if (sort._idSelected) {
        sort._idSelected = []
      }
    }
    dispatch({type: 'statisticsStruct/updateSort',    //重置加蒙版
      payload: {
        structList,
        subjectId: undefined,
        missionId: undefined,
        year: getYearFormat(getYearNew()),
      },
    })
  }

  const handleQueryData = () => {
    if(!structId){
      message.error("请选择统计类型")
      return
    }
    dispatch({
      type: 'statisticsStruct/getDataList',
      payload: {
        ...queryParam,
      },
    })
  }
  
  const handleChangeStruct = (value) => {
    dispatch({type: 'statisticsStruct/changeStruct',payload:{structId: value}})
  }
  
  const handleChangeDate = (value) => {
    dispatch({
      type: 'statisticsStruct/updateSort',
      payload:{
        beginDate: value.length == 0?'':value[0].format('YYYY-MM-DD HH:mm:ss'),
        endDate: value.length == 0?'':value[1].format('YYYY-MM-DD HH:mm:ss'),
      },
    })
	}

  const createStructOption = () => {
    const options = []
    if (structList) {
      for (let struct of structList) {
        if (struct.status == '1') {
          options.push(<Option key={struct.id} value={struct.id} title={struct.label}>{struct.label}</Option>)
        }
      }
    }
    return options
  }

  const handleChangeYear = (value) => {
    dispatch({type: 'statisticsStruct/updateSort',payload:{year: value}})   //学年加蒙版
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

  const handleChangeUserStatus = (value) => {
    dispatch({type: 'statisticsStruct/updateSort',payload:{userStatus: value}})   //学生状态加蒙版
	}

  const handleChangeMission = (value) => {
    dispatch({type: 'statisticsStruct/updateSort',payload:{missionId: value}})   //任务名称加蒙版
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
    dispatch({type: 'statisticsStruct/updateSort',payload:{subjectId: value}})   //项目名称加蒙版
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

  const clickStructItem = (struct) => {
    dispatch({
      type: 'statisticsStruct/getAllItemList',
      payload: {
        structId: struct.id,
        itemPid: structItemPid,
      },
    })
  }
  const handleChangeStructItem = (value, struct) => {
    dispatch({
      type: 'statisticsStruct/changeStructItem',
      payload: {
        structId: struct.id,
        id: value,
      },
    })
  }

  const getExportUrl = () => {
    let tempParam = {...queryParam};
    let tempList = getSortParam(tempParam.sortList)
    if (tempList && tempList.length>0) {
      tempParam.sortList = JSON.stringify(tempList)
    } else {
      tempParam.sortList = null
    }
    if(tempParam.subjectId){
      tempParam.subjectId = tempParam.subjectId.toString()
    }
    if(tempParam.missionId){
      tempParam.missionId = tempParam.missionId.toString()
    }
    if(tempParam.year){
      tempParam.year = tempParam.year.toString()
    }
    if(tempParam.userStatus){
      tempParam.userStatus = tempParam.userStatus.toString()
    }
    if(token()){
      tempParam.token = token()
    }
    delete tempParam.pageNum
    delete tempParam.pageSize
		let url = api.exportArchitectureStatistics + '?' + queryString.stringify(tempParam);
		return url
  }
  
  const handleChangeType = (e) => {
    queryParam.type = e.target.checked?'1':'0'
    handleQueryData()
  }

  const genMissionName= () => {
    let str = ""
    if(missionId && missionId.length>0){
      str = "";
      for(let n of missionList){
        if(missionId.indexOf(n.id)>=0){
          if(str) str += ";"
          str += n.name
        }
      }
      str = "任务名称：" + str
    }else{
      str = "";
      for(let n of year){
        if(str) str += ";"
        str += getYearFormat(n)
      }
      str = "学年：" + str
    }
    return str
  }
  
  const genFee = (first) =>{
    let tr = "";
    if(first.name != "__noPrint"){
      tr += "<td>"+first.name+"</td>"
    }
    tr += "<td>"+first.totalFee+"元 "+(type==1?first.totalFeeCount+"人":'')
    tr += "</td><td>"+first.discount+"元 "+(type==1?first.discountCount+"人":'')
    tr += "</td><td>"+first.paidFee+"元 "+(type==1?first.paidFeeCount+"人":'')
    tr += "</td><td>"+first.refund+"元 "+(type==1?first.refundCount+"人":'')
    tr += "</td><td>"+first.arrears+"元 "+(type==1?first.arrearsCount+"人":'')
    tr += "</td><td>"+first.percent+"</td>"
    return tr
  }

  const genTable = () => {
    let head = "<thead><tr>";
    let rowArr = [];
    let colSpan = 0
    for(let struct of structList){
      head += "<td>"+struct.label+"</td>";
      rowArr.push(struct.id)
      colSpan++;
			if(struct.id==structId){
				break;
			}
    }
    head += "<td>年级</td><td>应收金额</td><td>减免金额</td><td>收费金额</td><td>退费金额</td><td>欠费金额</td><td>完成度</td></tr></thead>";
    let body = "";
    for(let n of dataList){
      let tr = "<tr>";
      let span = n.gradeList.length
      //第一行数据
      for(let r of rowArr){
        tr += "<td rowspan="+span+">"+(n[r]?n[r]:"")+"</td>"
      }
      tr += genFee(n.gradeList[0]) + "</tr>"
      for(let i=1; i<span; i++){
        tr += "<tr>"
        tr += genFee(n.gradeList[i]) + "</tr>"
      }
      body += tr
    }
    //最后一行
    body += "<tr><td colspan="+(colSpan+1)+" style='text-align:center'>总计</td>"
    printTotal.name = "__noPrint";
    printTotal.percent = printTotal.totalFee!='0'&&printTotal.totalFee!=null?((printTotal.totalFee-printTotal.arrears)/printTotal.totalFee*100).toFixed(2)+'%':'0%'
    body += genFee(printTotal) + "</tr>"
    return "<table border='1px solid #ccc' cellspacing='0' cellpadding='0' style='width:100%'>"+head+"<tbody>"+body+"</tbody></table>"
  }

  const handlePrint = () => {
    var iframe=document.getElementById("print-iframe");
    if(iframe) document.body.removeChild(iframe);
    var el = "<div style='text-align:center;font-size:20px'>"+user.schoolName+"收费系统统计报表</div>";
    el += "<div style='height:20px;margin-top:40px'><span style='float:left'>" + genMissionName() + "</span><span style='float:right'>统计时间："+ beginDate +"~"+ endDate +"</span></div>";
    el += "<div style='margin:5px 0 5px 0'>" + genTable() + "</div>"
    el += "<div><span style='float:left'>打印人:"+user.name+"</span><span style='float:right'>打印时间:"+moment().format('YYYY-MM-DD HH:mm:ss')+"</span></div>"
    //window.document.body.innerHTML=el
    iframe = document.createElement('IFRAME');
    var doc = null;
    iframe.setAttribute("id", "print-iframe");
    iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
    document.body.appendChild(iframe);
    doc = iframe.contentWindow.document;
    doc.write("<div>" + el + "</div>");
    doc.close();
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }
  
  const createStructItemOption = (struct) => {
    const options = []
    if (struct._selectList) {
      for (let select of struct._selectList) {
        options.push(<Option key={select.id} value={select.id} title={select.name}>{select.name}</Option>)
      }
      return options
    }
    return null
  }
  let structSortLen = 0
  if(structId){
    for(let struct of structList){
      if (struct.id == structId) {
        break
      }
      structSortLen++;
    }
  }

  const createSort = () => {
    let i = 0
    const list = [
      {
        id:i++,
        content:(
          <div className={styles.sortCol}>
            <span className={styles.sortNorm}
                  >按</span>
                  <Select disabled={dataLoading} value={structId} style={{ width: '50%' }} onChange={handleChangeStruct}>
                    {createStructOption()}
                  </Select>
                  <span style={{ marginLeft: '6px' }}>统计</span>
          </div>
        ),
      },{
        id:i++,
        content:(
          <div className={styles.sortCol}>
            <div className={styles.sortTextW}>日期:</div>
                <RangePicker
                  disabled={dataLoading}
                  showTime={{ format: 'HH:mm:ss',defaultValue:[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}}
                  defaultValue={[beginDate?moment(beginDate):'', endDate?moment(endDate):'']}
                  disabledDate={current=>{return current && current > moment().endOf('day')}}
                  format="YYYY-MM-DD HH:mm:ss" 
                  placeholder={['开始时间', '结束时间']}
                  onChange={handleChangeDate}
                  style={{width: 'calc(100% - 100px)'}}
                />
          </div>
        ),
        length: 2,
      },{
        id:i++,
        content:(
          <div className={styles.sortCol}>
             <div className={styles.sortText}>学生状态:</div>
                <UserStatusSelect disabled={dataLoading} value={userStatus} className={styles.sortSelectMuti} placeholder={"选择学生状态"} onChange={handleChangeUserStatus} />
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
      },{
        id:i++,
        content:(
          <div className={styles.sortCol} >
            <div className={styles.sortText}>学年:</div>
                  <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={year} className={styles.sortSelectMuti} placeholder={"选择学年"} onChange={handleChangeYear}>
                  {createYearOption()}
                  </Select>
          </div>
        )
      }
    ]
      for(let struct of structList){
        if (!structId || struct.id == structId) {
          break
        }
        i++
        list.push({
          id:i,
          content:(<div className={styles.sortCol}>
                      <div className={styles.sortText}>{struct.label}:</div>
                      <Select allowClear
                        disabled={dataLoading}
                        value={struct._idSelected}
                        className={styles.sortSelectMuti}
                        placeholder={`选择${struct.label}`}
                        showSearch optionFilterProp="children"
                        onFocus={() => clickStructItem(struct)}
                        onChange={value => handleChangeStructItem(value, struct)}
                        notFoundContent={!struct._selectList ? <Spin size="small" /> : null}
                      >
                      {createStructItemOption(struct)}
                      </Select>
                    </div>)
                })
        }
        for(let attr of userSortList){
          if(attr.valueType == '3'){
            continue
          }
          i++
          list.push({
            id:i,
            content:(<SortSelect {...{...structSelectProps, attr}}/>)})
          }
      return list
  }

  const layerProps = {
    list: createSort(),
    query:(<div className={styles.queryBox}>
        <Button type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQueryData} className={styles.inquery}>{dataLoading?'':'统计'}</Button>
        <Button onClick={handleResetQuery} disabled={dataLoading} className={styles.reset}>重置</Button>
        <UserSort {...userSortProps} className={styles.more}/>
    </div>),
  }

  return (
    <Page inner>
      {sortFlag&&<div style={{backgroundColor:"rgba(240, 242, 245, 0.5)", zIndex:800, position:'absolute', width:'100%', height:'100%', margin:'-24px'}}></div>}
      <Row gutter={16}>
        <Col>
          <Card bordered={false} bodyStyle={{ padding: ' 0' }}>
            <div>
            <Divider style={{ margin: '5px' }} dashed />
            <UserSortLayer {...layerProps}/>
            <Divider style={{ margin: '5px' }} dashed />
            <div style={{ padding: '10px', textAlign: 'center' }}>
             <BillSum {...billSumProps}/>
            </div>
            <Row style={{ marginBottom:'10px',textIndent:'20px' }}>
              <Button style={{textIndent: 'initial'}} target="_blank" href={structId?getExportUrl():undefined} onClick={structId?undefined: () => { message.error("请选择统计类型") } }>导出</Button>
              <Button style={{textIndent: 'initial', marginLeft:'10px'}} onClick={handlePrint}>打印</Button>
              <Checkbox disabled={dataLoading} checked={type=='1'} onChange={handleChangeType}>显示人数统计</Checkbox>
            </Row>
            <Row><UserTable {...userTableProps} /></Row>
            </div>
            { modalVisible && <UserModal {...userModalProps} /> }
          </Card>
        </Col>
      </Row>
    </Page>
  )
}

StatisticsStruct.propTypes = {
  statisticsStruct: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ statisticsStruct, app, loading }) => ({ statisticsStruct, app, loading }))(StatisticsStruct)
