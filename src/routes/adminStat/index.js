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
    dispatch({type: 'adminStat/updateSort',    //重置加蒙版
      payload: {
        year: `${getYearNew()}`,
        userStatus: ['在读'],
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
    dispatch({type: 'adminStat/updateSort',payload:{year: value}})   //学年加蒙版
  }
  
  const handleChangeUserStatus = (value) => {
    dispatch({type: 'adminStat/updateSort',payload:{userStatus: value}})   //学生状态加蒙版
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
      A1: {v:"学校"},
      B1: {v:"应收金额"},
      C1: {v:"减免金额"},
      D1: {v:"收费金额"},
      E1: {v:"欠费金额"},
      F1: {v:"退费金额"},
      G1: {v:"完成度"},
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
              s: {//s为开始
                c: 0,//开始列
                r: i-1//可以看成开始行,实际是取值范围
              },
              e: {//e结束
                  c: 0,//结束列
                  r: i//结束行
              }
            }
          )
          margeArr.push(
            {
              s: {//s为开始
                c: 6,//开始列
                r: i-1//可以看成开始行,实际是取值范围
              },
              e: {//e结束
                  c: 6,//结束列
                  r: i//结束行
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
          _data[String.fromCharCode(65 + j++) + num] = {v:node['totalFeeCount']+'/人'}
          _data[String.fromCharCode(65 + j++) + num] = {v:node['discountCount']+'/人'}
          _data[String.fromCharCode(65 + j++) + num] = {v:node['paidFeeCount']+'/人'}
          _data[String.fromCharCode(65 + j++) + num] = {v:node['arrearsCount']+'/人'}
          _data[String.fromCharCode(65 + j++) + num] = {v:node['refundCount']+'/人'}
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
  
    // // 合并 headers 和 data
    const output = Object.assign({}, _headers, _data);
    // 获取所有单元格的位置
    const outputPos = Object.keys(output);
    // 计算出范围 ,["A1",..., "H2"]
    const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;
    // 构建 workbook 对象
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
     // 导出 Excel
    XLSX.writeFile(wb, "账务统计导出"+beginDate.replace(/[-]/g,"")+"_"+endDate.replace(/[-]/g,"")+".xlsx");
  }

  const createSort = () => {
    let i = 0
    const list = [
      {
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
      },
      {
        id:i++,
        content:(
          <div className={styles.sortCol}>
             <div className={styles.sortText}>学生状态:</div>
                <UserStatusSelect disabled={dataLoading} value={userStatus} className={styles.sortSelectMuti} placeholder={"选择学生状态"} onChange={handleChangeUserStatus} />
          </div>
        )
      },
      {
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
      return list
  }

  const layerProps = {
    list: createSort(),
    query:(<div className={styles.queryBox} style={{textAlign:'right', paddingRight: '5%'}}>
        <Button type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQueryData} className={styles.inquery}>{dataLoading?'':'统计'}</Button>
        <Button onClick={handleResetQuery} disabled={dataLoading} className={styles.reset}>重置</Button>
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
              <Button type="primary" onClick={() => exportExcel()}>导出</Button>
              <Checkbox disabled={dataLoading} checked={type=='1'} onChange={handleChangeType}>显示人数统计</Checkbox>
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
