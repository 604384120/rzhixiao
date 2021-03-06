import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Card, message, Divider, Select, Spin, Icon, Checkbox, DatePicker } from 'antd'
import { Page, UserStatusSelect, UserSortLayer, BillSum, UserSort, SortSelect } from 'components'
import UserTable from './UserTable'
import styles from '../common.less'
import queryString from 'query-string'
import { getFormat, getYearFormat, config, getYearNew } from 'utils'
import moment from 'moment'
import XLSX from 'xlsx'

const Option = Select.Option
const antIcon = <Icon type="loading" style={{ fontSize: 20 }} spin />;
const { api, statDataMap, statDataList } = config
const RangePicker = DatePicker.RangePicker;

const AdminStat = ({
  location, dispatch, adminStat, loading, app
}) => {
  const {
    year, beginDate, endDate,
    dataList, dataLoading, statData,
    type, userStatus,
    sortFlag,
    statSence,
    yearList,
    totalBegin,
  } = adminStat

  const { userDisplaySence, } = app
  const statDisplayList = userDisplaySence[statSence]&&userDisplaySence[statSence].displayList?userDisplaySence[statSence].displayList:[]

  const queryParam = {
    year,
    type,
    userStatus,
    beginDate,
    endDate,
  }

  let statList = []
  if(statDisplayList){
    for(let node of statDisplayList){
      if(statDataMap[node.id]){
        statList.push(statDataMap[node.id])
      }
    }
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
    dataList,
    dataLoading,
    type,
  }

  const handleResetQuery = () => {
    dispatch({type: 'adminStat/updateSort',    //???????????????
      payload: {
        year: `${getYearNew()}`,
        userStatus: ['??????'],
      },
    })
  }

  const handleQueryData = () => {
    dispatch({
      type: 'adminStat/getDataList',
      payload: {
        ...queryParam,
      },
    })
  }
  
  const handleChangeDate = (value) => {
    dispatch({
      type: 'adminStat/updateSort',
      payload:{
        beginDate: value.length == 0?'':value[0].format('YYYY-MM-DD HH:mm:ss'),
        endDate: value.length == 0?'':value[1].format('YYYY-MM-DD HH:mm:ss'),
      },
    })
	}

  const handleChangeYear = (value) => {
    dispatch({type: 'adminStat/updateSort',payload:{year: value}})   //???????????????
  }
  
  const handleChangeUserStatus = (value) => {
    dispatch({type: 'adminStat/updateSort',payload:{userStatus: value}})   //?????????????????????
  }

  const handleChangeType = (e) => {
    queryParam.type = e.target.checked?'1':'0'
    handleQueryData()
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

  const exportExcel = () => {

    let _headers = {
      A1: {v:"??????"},
      B1: {v:"????????????"},
      C1: {v:"????????????"},
      D1: {v:"????????????"},
      E1: {v:"????????????"},
      F1: {v:"????????????"},
      G1: {v:"?????????"},
    }

    let _data = {}
    let i = 2
    let margeArr = []
    const creatSonRow = (data) => {
      for(let node of data){
        let j = 0
        let anbsp = ''
        for(let i = 0; i < node._index; i++){
          anbsp += ' '
        }
        _data[String.fromCharCode(65 + j++) + i] = {v:anbsp+node['name']}
        if(type){
          margeArr.push(
            {
              s: {//s?????????
                c: 0,//?????????
                r: i-1//?????????????????????,?????????????????????
              },
              e: {//e??????
                  c: 0,//?????????
                  r: i//?????????
              }
            }
          )
          margeArr.push(
            {
              s: {//s?????????
                c: 6,//?????????
                r: i-1//?????????????????????,?????????????????????
              },
              e: {//e??????
                  c: 6,//?????????
                  r: i//?????????
              }
            }
          )
        }
        let swiff = isNaN(Math.round((node['totalFee']-node['arrears'])/node['totalFee']*100))?'0':Math.round((node['totalFee']-node['arrears'])/node['totalFee']*100)
        _data[String.fromCharCode(65 + j++) + i] = {v:getFormat(node['totalFee'])}
        _data[String.fromCharCode(65 + j++) + i] = {v:getFormat(node['discount'])}
        _data[String.fromCharCode(65 + j++) + i] = {v:getFormat(node['paidFee'])}
        _data[String.fromCharCode(65 + j++) + i] = {v:getFormat(node['arrears'])}
        _data[String.fromCharCode(65 + j++) + i] = {v:getFormat(node['refund'])}
        _data[String.fromCharCode(65 + j++) + i] = {v:swiff+'%'}
        if(type == '1'){
          j = 1
          let num = i+1
          _data[String.fromCharCode(65 + j++) + num] = {v:node['totalFeeCount']+'/???'}
          _data[String.fromCharCode(65 + j++) + num] = {v:node['discountCount']+'/???'}
          _data[String.fromCharCode(65 + j++) + num] = {v:node['paidFeeCount']+'/???'}
          _data[String.fromCharCode(65 + j++) + num] = {v:node['arrearsCount']+'/???'}
          _data[String.fromCharCode(65 + j++) + num] = {v:node['refundCount']+'/???'}
          _data[String.fromCharCode(65 + j++) + num] = {v:''}
          i += 2
        }else{
          i ++
        }
        if(node.groupStatisticsData){
          creatSonRow(node.groupStatisticsData)
        }
      }
    }
    creatSonRow(dataList)
  
    // // ?????? headers ??? data
    const output = Object.assign({}, _headers, _data);
    // ??????????????????????????????
    const outputPos = Object.keys(output);
    // ??????????????? ,["A1",..., "H2"]
    const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;
    // ?????? workbook ??????
    const wb = {
      SheetNames: ['mySheet'],
      Sheets: {
        mySheet: Object.assign(
          {},
          output,
          {
            '!ref': ref,
            '!cols': [{ wpx: 100 }, { wpx: 100 }],
            '!merges': type == '1'?margeArr:null
          },
        ),
      },
    }
     // ?????? Excel
    XLSX.writeFile(wb, "??????????????????"+beginDate.replace(/[-]/g,"")+"_"+endDate.replace(/[-]/g,"")+".xlsx");
  }

  const createSort = () => {
    let i = 0
    const list = [
      {
        id:i++,
        content:(
          <div className={styles.sortCol}>
            <div className={styles.sortTextW}>??????:</div>
                <RangePicker
                  disabled={dataLoading}
                  showTime={{ format: 'HH:mm:ss',defaultValue:[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}}
                  defaultValue={[beginDate?moment(beginDate):'', endDate?moment(endDate):'']}
                  disabledDate={current=>{return current && current > moment().endOf('day')}}
                  format="YYYY-MM-DD HH:mm:ss" 
                  placeholder={['????????????', '????????????']}
                  onChange={handleChangeDate}
                  style={{width: 'calc(100% - 100px)'}}
                />
          </div>
        ),
        length: 2,
      },
      {
        id:i++,
        content:(
          <div className={styles.sortCol}>
             <div className={styles.sortText}>????????????:</div>
                <UserStatusSelect disabled={dataLoading} value={userStatus} className={styles.sortSelectMuti} placeholder={"??????????????????"} onChange={handleChangeUserStatus} />
          </div>
        )
      },
      {
        id:i++,
        content:(
          <div className={styles.sortCol} >
            <div className={styles.sortText}>??????:</div>
              <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={year} className={styles.sortSelectMuti} placeholder={"????????????"} onChange={handleChangeYear}>
                {createYearOption()}
              </Select>
          </div>
        )
      }
    ]
      return list
  }

  const layerProps = {
    list: createSort(),
    query:(<div className={styles.queryBox} style={{textAlign:'right', paddingRight: '5%'}}>
        <Button type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQueryData} className={styles.inquery}>{dataLoading?'':'??????'}</Button>
        <Button onClick={handleResetQuery} disabled={dataLoading} className={styles.reset}>??????</Button>
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
              <Button type="primary" onClick={() => exportExcel()}>??????</Button>
              <Checkbox disabled={dataLoading} checked={type=='1'} onChange={handleChangeType}>??????????????????</Checkbox>
            </Row>
            <Row><UserTable {...userTableProps} /></Row>
            </div>
          </Card>
        </Col>
      </Row>
    </Page>
  )
}

AdminStat.propTypes = {
  adminStat: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ adminStat, app, loading }) => ({ adminStat, app, loading }))(AdminStat)
