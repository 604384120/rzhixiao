import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Card, Divider, Select, Spin, Icon, DatePicker, Checkbox } from 'antd'
import { Page, UserSort, UserSortLayer, SortSelect } from 'components'
import DateTable from './DateTable'
import styles from '../common.less'
import { getFormat,config } from 'utils'
import moment from 'moment';
import XLSX from 'xlsx';

const { payType } = config
const Option = Select.Option
const Statistics = ({
  location, dispatch, statistics, loading, app
}) => {
  const {
    displaySence, sortSence, userSortExtra,
    dateRangeType,
    beginDate,
    endDate,
    dataLoading,
    sumStatistics,
    dayStatistics,
    dayList,
    totalBegin,
    sortFlag,
    showSubject
  } = statistics

  const { user, userDisplaySence, userAttrList, userAttrMap, requestMap, isNavbar } = app
  const userSortList = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayList?userDisplaySence[sortSence].displayList:[]
  const userSortMap = userDisplaySence[sortSence]&&userDisplaySence[sortSence].displayMap?userDisplaySence[sortSence].displayMap:{}

  const payTypeList = requestMap['payTypeList']
  const payTypeNameMap = requestMap['payTypeMap']

  const { RangePicker } = DatePicker;

  const queryParam = {
    beginDate,
    endDate,
    sortList: userSortList,
    showSubject
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
        payload:{sence:sortSence, displayExtra:userSortExtra}
      })
    },
    onUpdate (data) {
      dispatch({type: 'statistics/updateSort'})  // 更多筛选加蒙版
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
    payType,
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
      dispatch({type: 'statistics/updateSort'})  // 加蒙版
    },
  }

  const dateTableProps = {
    showSubject,
    dataSource: dayList,
    dataLoading,
    payTypeNameMap,
    onUpdateState (data) {
      dispatch({
        type: 'statistics/updateState',
        payload: {
          ...data,
        },
      })
    },
  }

  const handleResetQuery = () => {
    for (let sort of userSortList) {
      if (sort._idSelected) {
        sort._idSelected = []
      }
    }
    // dispatch({type: 'statistics/updateState'})
    dispatch({type: 'statistics/updateSort'})    //重置加蒙版
  }

  const handleQuery = () => {
    dispatch({
      type: 'statistics/getOverallStatistics',
      payload: {
        ...queryParam,
      },
    })
  }

  const handleChangeDateRange = (value) => {
    if(value.length != 0){
      dispatch({type: 'statistics/updateSort',    //交易时段加蒙版
        payload: {
            dateRangeType: 0,
            beginDate: value[0].format('YYYY-MM-DD'),
            endDate: value[1].format('YYYY-MM-DD'),
        },
      })
    }
  }

  const changeDateRangeType = (type) => {
    if(dateRangeType != type){
      let data = {
        dateRangeType: type
      }
      if(type == 1){
        data.beginDate = `${moment().format('YYYY-MM-DD')}`;
        data.endDate = `${moment().format('YYYY-MM-DD')}`;
      }else if(type == 2){
        data.beginDate = `${moment().subtract(1,'days').format('YYYY-MM-DD')}`;
        data.endDate = `${moment().subtract(1,'days').format('YYYY-MM-DD')}`;
      }else if(type == 3){
        data.beginDate = `${moment().subtract(6,'days').format('YYYY-MM-DD')}`;
        data.endDate = `${moment().format('YYYY-MM-DD')}`;
      }
      dispatch({
        type: 'statistics/updateState',
        payload: {
          ...data
        },
      })
    }
  }


  const  onChangeShowSubject = (value) => {
    queryParam.showSubject = value.target.checked
    handleQuery()
  }

  const exportExcel = () => {

    let _headers = showSubject?{
      A1: {v:"日期"},
      B1: {v:"支付方式"},
      C1: {v:"收费项目"},
      D1: {v:"订单总额"},
      E1: {v:"订单笔数"},
      F1: {v:"退款总额"},
      G1: {v:"退款笔数"},
      H1: {v:"实收总额"},
    }:{
      A1: {v:"日期"},
      B1: {v:"支付方式"},
      C1: {v:"订单总额"},
      D1: {v:"订单笔数"},
      E1: {v:"退款总额"},
      F1: {v:"退款笔数"},
      G1: {v:"实收总额"},
    }

    let _data = {}
    let i = 2
    let margeArr = []
    for(let node of dayList){
      let j = 0
      _data[String.fromCharCode(65 + j++) + i] = {v:node['date']}
      if(node.rowSpan){
        margeArr.push(
          {
            s: {//s为开始
              c: 0,//开始列
              r: i-1//可以看成开始行,实际是取值范围
            },
            e: {//e结束
                c: 0,//结束列
                r: i+node.rowSpan-2//结束行
            }
          }
        )
      }
      if(node.subRowSpan){
        margeArr.push(
          {
            s: {//s为开始
              c: 1,//开始列
              r: i-1//可以看成开始行,实际是取值范围
            },
            e: {//e结束
                c: 1,//结束列
                r: i+node.subRowSpan-2//结束行
            }
          }
        )
      }
      _data[String.fromCharCode(65 + j++) + i] = {v:node['payType']=='0'?'总计':payTypeNameMap[node['payType']]}
      if(showSubject){
        _data[String.fromCharCode(65 + j++) + i] = {v:node['name']}
      }
      _data[String.fromCharCode(65 + j++) + i] = {v:getFormat(node['paidFee'])}
      _data[String.fromCharCode(65 + j++) + i] = {v:node['paidFeeCount']}
      _data[String.fromCharCode(65 + j++) + i] = {v:getFormat(node['refund'])}
      _data[String.fromCharCode(65 + j++) + i] = {v:node['refundCount']}
      _data[String.fromCharCode(65 + j++) + i] = {v:getFormat(node['realFee'])}
      i++
    }
  
    // 合并 headers 和 data
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
            '!merges': margeArr
          },
        ),
      },
    }
     // 导出 Excel
    XLSX.writeFile(wb, "收费方式导出"+beginDate.replace(/[-]/g,"")+"_"+endDate.replace(/[-]/g,"")+".xlsx");
  }


  const handleMoveLeft = () => {
    if(totalBegin>0){
      dispatch({
        type: 'statistics/updateState',
        payload: {
          totalBegin:totalBegin-1
        },
      })
    }
   
  }

  const handleMoveRight = () => {
    dispatch({
      type: 'statistics/updateState',
      payload: {
        totalBegin:totalBegin+1
      },
    })
  }

  const createTotal = () => {
    const cols = [];
    let lists = []
    let i =0;
    let a = 1
    let step = 4
    if(document.body.clientWidth < 600){
      step = 1;
    }else{
      step = Math.round(document.body.clientWidth / 400)
      if(step == 5){
        step = 4
      }
    }
    //插入总额
    if(sumStatistics !== {}){
      lists[0] = {}
      lists[0].date = sumStatistics.date
      lists[0].paidFee = sumStatistics.paidFee
      lists[0].paidFeeCount = sumStatistics.paidFeeCount
      lists[0].payType = '0'
      lists[0].realFee = sumStatistics.realFee
      lists[0].refund = sumStatistics.refund
      lists[0].refundCount = sumStatistics.refundCount
      //插入分项
      if(sumStatistics.typeStatistics){
        for(let node of sumStatistics.typeStatistics){
          lists[a++] = node
        }
        for(i = totalBegin;i<lists.length;i++){
          cols.push(
            <Col span={24/step} style={{height:'200px', display:'inline-block', borderRight:"1px solid #ffffff"}} key={lists[i].payType}>
              {
                totalBegin!==0&&cols.length<1&&<Icon type='double-left' onClick={handleMoveLeft} style={{position:'absolute', marginTop:'88px', fontSize:'22px', color:'#c3c3c3'}}/>
              }
              <div style={{ margin:"0 auto"}}>
                 {lists[i].payType=='0'?<div style={{fontSize:'20px', marginTop:'20px', marginLeft:'20px'}}>总计</div>
                 :<div style={{fontSize:'20px', marginTop:'20px', marginLeft:'20px'}}>
                 {payType[lists[i].payType]&&<Icon type={payType[lists[i].payType].icon} style={{marginRight:'10px'}}/>}
                 {payTypeNameMap[lists[i].payType]}
                 </div>}
                 <div style={{marginTop:'10px'}}>
                   <span style={{fontSize:'16px', marginLeft:'20px'}}>实收总额:</span>
                   <span style={{fontSize:'20px', marginLeft:'5px', color:'#1890ff'}}>{getFormat(lists[i].realFee)}</span>
                   <span style={{fontSize:'12px', paddingTop:'6px', marginLeft:'5px'}}>元</span>
                 </div>
                 <div style={{marginTop:'25px'}}>
                   <span style={{fontSize:'12px', marginLeft:'20px'}}>订单总额:</span>
                   <span style={{fontSize:'12px', marginLeft:'5px'}}>{getFormat(lists[i].paidFee)}</span>
                   <span style={{fontSize:'10px', marginLeft:'5px'}}>元</span>
                   <span style={{fontSize:'12px', marginLeft:'10px'}}>|</span>
                   <span style={{fontSize:'12px', marginLeft:'10px'}}>{lists[i].paidFeeCount}</span>
                   <span style={{fontSize:'10px', marginLeft:'5px'}}>笔</span>
                 </div>
                 <div style={{marginTop:'10px'}}>
                   <span style={{fontSize:'12px', marginLeft:'20px'}}>退款总额:</span>
                   <span style={{fontSize:'12px', marginLeft:'5px'}}>{getFormat(lists[i].refund)}</span>
                   <span style={{fontSize:'10px', marginLeft:'5px'}}>元</span>
                   <span style={{fontSize:'12px', marginLeft:'10px'}}>|</span>
                   <span style={{fontSize:'12px', marginLeft:'10px'}}>{lists[i].refundCount}</span>
                   <span style={{fontSize:'10px', marginLeft:'5px'}}>笔</span>
                 </div>
               </div>
                {
                  cols.length>=step-1&&totalBegin<lists.length-step&&<Icon type='double-right' onClick={handleMoveRight} style={{position:'absolute', marginTop:'88px', fontSize:'22px', color:'#c3c3c3', top:0, right:0}}/>
                }
            </Col>
          )
          if(cols.length==step){
            break
          }
        }
      }
    }
   return cols;
  }

  const createSort = () => {
    let i = 0
    const list = [
      {
        id:i++,
        content:(
          <div className={styles.sortCol}>
            <div className={styles.sortTextW} style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '68px', lineHeight: '32px' }}>交易时段:</div>
                  <div style={{width:isNavbar?"calc(100% - 100px)":"calc(100% - 210px)",display:"inline-block", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',}}>
                    <RangePicker
                      disabled={dataLoading}
                      allowClear={false}
                      //showTime={{ format: 'HH:mm:ss',defaultValue:[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}}
                      value={[moment(beginDate), moment(endDate)]}
                      disabledDate={(current)=>{return current && current > moment().endOf('day')}}
                      format="YYYY-MM-DD"
                      onChange={handleChangeDateRange}
                      placeholder={['开始时间', '结束时间']}
                      style={{width:"100%"}}
                    />
                  </div>
                  {
                    isNavbar?"": <div style={{display:'inline-block', overflow: 'hidden', lineHeight:'32px'}}>
                        <a style={{marginLeft:'8px',color:dateRangeType==1?'#1890ff':'#666',}} onClick={()=>changeDateRangeType(1)}>今日</a>
                        <a style={{marginLeft:'8px',color:dateRangeType==2?'#1890ff':'#666',}} onClick={()=>changeDateRangeType(2)}>昨日</a>
                        <a style={{marginLeft:'8px',color:dateRangeType==3?'#1890ff':'#666',}} onClick={()=>changeDateRangeType(3)}>近7日</a>
                    </div>
                  }
                 
          </div>
        ),
        length:2
      }
    ]
    for(let attr of userSortList){
      if(!userSortMap[attr.id]){
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
    query:(<div className={styles.queryBox} >
        <Button className={styles.inquery} type={sortFlag==undefined||sortFlag?"primary":''} loading={dataLoading} onClick={handleQuery} >{dataLoading?'':'查询'}</Button>
        <Button className={styles.reset} onClick={handleResetQuery} disabled={dataLoading} >重置</Button>
        <UserSort {...userSortProps} className={styles.more} />
    </div>),
  }

  return (
    <Page inner>
      {sortFlag&&<div className={styles.masking} ></div>}
      <Row gutter={16}>
        <Col>
          <Card bordered={false} bodyStyle={{ padding: ' 0' }}>
            <div>
            <Divider style={{ margin: '5px' }} dashed />
            <UserSortLayer {...layerProps}/>
            <Divider style={{ margin: '5px' }} dashed />
            <Row style={{marginTop:'10px', backgroundColor:'#f7f7f7'}}>
            {createTotal()}
            </Row>
            <Row style={{marginTop:'5px'}}>
            <Button type="primary" onClick={() => exportExcel()}>导出</Button>
            <Checkbox style={{marginLeft:"10px"}} onChange={onChangeShowSubject}>显示收费项目</Checkbox>
            </Row>
            <Row style={{marginTop:'5px'}}><DateTable {...dateTableProps} /></Row>
            </div>
          </Card>
        </Col>
      </Row>
    </Page>
  )
}

Statistics.propTypes = {
  statistics: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ statistics, app, loading }) => ({ statistics, app, loading }))(Statistics)
