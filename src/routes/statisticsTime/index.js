import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Card,Divider, Select, Spin, Icon, Message } from 'antd'
import { Page, UserSortLayer, BillSum } from 'components'
import UserTable from './UserTable'
import UserModal from './UserModal'
import styles from '../common.less'
import queryString from 'query-string'
import { getFormat, config, token } from 'utils'
import moment from 'moment';

const Option = Select.Option
const antIcon = <Icon type="loading" style={{ fontSize: 20 }} spin />;
const { api } = config;

const StatisticsTime = ({
  location, dispatch, statisticsTime, loading, app
}) => {
  const {
    modalVisible, modalData, modalType, sortSence, 
    pageNum, pageSize, timeType, month, year, 
    dataList, count, dataLoading, statData,
    sortFlag, totalBegin, statList,
  } = statisticsTime
  
  const { userDisplaySence, userAttrList, userAttrMap, requestMap } = app
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}

  const missionList = requestMap['missionList']
  const subjectList = requestMap['subjectList']

  const queryParam = {
		pageNum,
    pageSize,
    timeType,
    year,
    month,
  }

  const userTableProps = {
    dataSource: dataList,
    count,
    pageNum,
    pageSize,
    dataLoading,
    timeType,
    onChangePage (n, s) {
      dispatch({
        type: 'statisticsTime/getDataList',
        payload: {
          ...queryParam,
          pageNum: n,
          pageSize: s,
        },
      })
    },
    onShowDetail (data, modalType) {
      dispatch({
        type: 'statisticsTime/showDetail',
        payload: {
          ...data,
          year,
          modalType,
          sortList: userSortList,
          timeType,
        },
      })
    },
  }

  const userSortProps = {
    userAttrList,
    ...userDisplaySence[sortSence],
    displayExtra: {},
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
        payload:{sence:sortSence, displayExtra:{}}
      })
    },
    onUpdate (data) {
      dispatch({
        type: 'app/updateDisplay',
        payload: {
          displayListTemp:data,
          sence: sortSence,
        },
      })
    },
  }

  const billSumProps = {
    totalBegin,
    statData,
    statList,
    dataLoading,
    styles,
    getFormat,
    step: 4,
  }

  const userModalProps = {
    modalVisible, modalData, modalType, timeType,
    userSortProps, userSortMap, userSortList, userAttrMap, sortSence,
    missionList, subjectList,
    onClose () {
      dispatch({
        type: 'statisticsTime/updateState',
        payload: {
          modalVisible: false,
        },
      })
    },
    onGetAttrRelateList (data) {
      dispatch({
				type: 'app/getAttrRelateList',
				payload: {
          ...data,
          sence: sortSence
				},
			})
    },
    onUpdateState (data) {
      dispatch({
        type: 'statisticsTime/updateState',
        payload: {
         ...data
        },
      })
    },
    onGetDetail (data) {
      if(modalType == 1){
        dispatch({
          type: 'statisticsTime/getSubjectDetail',
          payload: {
           ...data
          },
        })
      }else if(modalType == 2){
        dispatch({
          type: 'statisticsTime/getMissionDetail',
          payload: {
           ...data
          },
        })
      }else if(modalType == 3){
        dispatch({
          type: 'statisticsTime/getPayTypeDetail',
          payload: {
           ...data
          },
        })
      }
    },
  }

  const handleResetQuery = () => {
    dispatch({type: 'statisticsTime/updateSort',    //重置加蒙版
      payload: {
        year: undefined,
        month: undefined,
      },
    })
    // dispatch({
    //   type: 'statisticsTime/updateState',
    //   payload: {
    //     year: undefined,
    //     month: undefined,
    //   },
    // })
  }

  const handleQueryData = () => {
    if(!timeType){
      Message.error("请选择统计方式")
      return
    }
    dispatch({
      type: 'statisticsTime/getDataList',
      payload: {
        ...queryParam,
      },
    })
  }

  const handleChangeTimeType = (value) => {
    dispatch({type: 'statisticsTime/updateSort',    //按时间统计加蒙版
      payload:{
        timeType: value,
        year: undefined,
        month: undefined,
        dataList: [],
        statData:{},
        count:0,
        pageNum:1
      }
    })
    // dispatch({
    //   type: 'statisticsTime/updateState',
    //   payload:{
    //     timeType: value,
    //     year: undefined,
    //     month: undefined,
    //     dataList: [],
    //     statData:{},
    //     count:0,
    //     pageNum:1
    //   }
    // })
  }

  const getExportUrl = () => {
		let tempParam = {...queryParam};
    if(tempParam.year){
      tempParam.year = tempParam.year.toString()
    }
    if(tempParam.month){
      tempParam.month = tempParam.month.toString()
    }
    if(token()){
      tempParam.token = token()
    }
    delete tempParam.pageNum
    delete tempParam.pageSize
		let url = api.exportTimeStatistics + '?' + queryString.stringify(tempParam);
		return url
  }

  const handleChangeYear = (value) => {
    dispatch({type: 'statisticsTime/updateSort',payload:{year: value}})   //年度选择加蒙版
    // dispatch({type: 'statisticsTime/updateState',payload:{year: value}})
	}
  const createYearOption = () => {
    const option = [];
    let yearNow = moment().format("YYYY");
    for(let i=0;i<11;i++){
      option.push(<Option key={i} value={(yearNow-i).toString()} title={yearNow-i}>{yearNow-i}</Option>)
    }
    return option;
  }

  const createMonthOption = () => {
    const option = [];
    for(let i=1;i<=12;i++){
      option.push(<Option key={i} value={(i).toString()} title={i}>{i}</Option>)
    }
    return option;
  }
  const handleChangeMonth = (value) => {
    dispatch({type: 'statisticsTime/updateSort',payload:{month: value}})    //月份选择加蒙版
    // dispatch({type: 'statisticsTime/updateState',payload:{month: value}})
  }

  const handleMoveLeft = () => {
    if(totalBegin>0){
      dispatch({
        type: 'statisticsTime/updateState',
        payload: {
          totalBegin:totalBegin-1
        },
      })
    }
  }

  const handleMoveRight = () => {
    dispatch({
      type: 'statisticsTime/updateState',
      payload: {
        totalBegin:totalBegin+1
      },
    })
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
                <Select disabled={dataLoading} value={timeType} style={{ width: '50%' }} onChange={handleChangeTimeType}>
                  <Option key={1} value={'day'} title={'日'}>日</Option>
                  <Option key={2} value={'month'} title={'月'}>月</Option>
                  <Option key={3} value={'year'} title={'年'}>年</Option>
                </Select>
                <span style={{ marginLeft: '6px' }}>统计</span>
          </div>
        ),
      },{
        id:i++,
        content:(
          <div className={styles.sortCol}>
             <div className={styles.sortText}>年度:</div>
              <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={year} className={styles.sortSelectMuti} placeholder={"选择年度"} onChange={handleChangeYear}>
              {createYearOption()}
              </Select>
          </div>
        )
      },{ 
        id:i++,
        content:(
          <div className={styles.sortCol} >
            {
                timeType=='day'||timeType=='month'?<div><div className={styles.sortText}>月份:</div>
                <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={month} className={styles.sortSelectMuti} placeholder={"选择月份"} onChange={handleChangeMonth}>
                {createMonthOption()}
                </Select></div>:""
              }
          </div>
        )
      }
    ]
      return list
  }

  const layerProps = {
    list: createSort(),
    query:(<div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden',textAlign: 'right' }}>
      <Button type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQueryData} style={{ marginRight: '10px',verticalAlign:'middle',width:'62px' }}>{dataLoading?"":"统计"}</Button>
      <Button onClick={handleResetQuery} disabled={dataLoading} style={{ marginRight: '8%',verticalAlign:'middle' }}>重置</Button>
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
              <Button style={{marginRight:'15px',textIndent: 'initial'}} target="_blank" href={timeType?getExportUrl():undefined} onClick={timeType?undefined:() => { Message.error("请选择统计方式") }}>导出</Button>
            </Row>
            <Row style={{marginTop:'20px'}}><UserTable {...userTableProps} /></Row>
            </div>
            { modalVisible && <UserModal {...userModalProps} /> }
          </Card>
        </Col>
      </Row>
    </Page>
  )
}

StatisticsTime.propTypes = {
  statisticsTime: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ statisticsTime, app, loading }) => ({ statisticsTime, app, loading }))(StatisticsTime)
