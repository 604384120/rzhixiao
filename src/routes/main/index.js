import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Card, Input, Popover, Divider, Select, Spin, Tag, Icon, Menu, Dropdown, DatePicker } from 'antd'
import { Page, UserSort, UserDisplay, UserSortLayer } from 'components'
import { getFormat } from 'utils'

const Option = Select.Option
const { Search } = Input;
const RangePicker = DatePicker.RangePicker;

const Main = ({
  location, dispatch, main, loading, app
}) => {
  const { dataList, rediretPath } = main
  const { user } = app

  const creatList = (data) => {
    let arr = []
    let rows = []
    let col = 0
    arr[col] = []
    for(let i = 1; i <= data.length; i++){
      arr[col].push(<Col span={6} style={{paddingRight:'20px', marginBottom: '10px'}}>
        <Card size="small" title={data[i-1].name} extra={<a href={`/?token=${data[i-1].token}`} target="_blank">进入 <Icon type="right" /></a>}>
          <p>昨日收费 <span>{getFormat(data[i-1].orderFee)}</span></p>
          <p>昨日退费 <span>{getFormat(data[i-1].refundOrderFee)}</span></p>
        </Card>
      </Col>)
      if( i % 4 == 0 ){
        col ++
        arr[col] = []
      }
    }
    for(let i = 0; i < arr.length; i++){
      rows.push(<Row key={i}>
        {arr[i]}
      </Row>)
    }
    return rows
  }

  return (
    <Page>
      <div style={{width:'100%', height:'100%',}}>
        <Row style={{background:'#fff', height:'150px', marginBottom:'35px', marginRight:'20px'}}>
          <Col span={4} style={{lineHeight:'170px', textAlign:'center'}}>
            <Icon type="user" style={{fontSize:'45px'}} />
          </Col>
          <Col span={10}>
            <div style={{fontSize:'20px', margin:'50px 0 20px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',}}>{`欢迎${user.name}，祝你开心每一天！`}</div>
          </Col>
        </Row>
        <Row>
          {creatList(dataList)}
        </Row>
      </div>
    </Page>
    )
  }


  Main.propTypes = {
    main: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.object,
  }

export default connect(({ main, app, loading }) => ({ main, app, loading }))(Main)
