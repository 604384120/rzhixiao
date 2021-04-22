import React from 'react'
import { Row, Icon, Spin, Popover } from 'antd'
import PropTypes from 'prop-types'

const antIcon = <Icon type="loading" style={{ fontSize: 20 }} spin />;

class StatusList extends React.Component {
  state = {}

  details = (fee, status, user, orderOperateData) => {
		const detailser = []
		let i = 0
		if(orderOperateData.orderOperateList){
			for(let node of orderOperateData.orderOperateList){
				i++
				if(node.mask == '1'){
					detailser.push(<div style={{marginBottom:'10px'}} key={i}><Row>{node.createDate+'：'+node.accountName}</Row>
											<Row>{`${fee == '1'?'冲正，冲正理由：':'作废，作废理由：'}${node.remark?node.remark:''}`}</Row></div>)
				}else if(node.mask == '2' && status == '5'){
					detailser.push(<div style={{marginBottom:'10px'}} key={i}><Row>{node.createDate+'：'+node.accountName}</Row>
											<Row>{`审核驳回，驳回理由：${node.remark?node.remark:''}`}</Row></div>)
				}else if(node.mask == '2' && status != '5'){
					detailser.push(<div style={{marginBottom:'10px'}} key={i}><Row>{node.createDate+'：'+node.accountName}</Row>
											<Row>审核成功</Row></div>)
				}else if(node.mask == '4'){
					detailser.push(<div style={{marginBottom:'10px'}} key={i}><Row>{node.createDate+'：'+node.accountName}</Row>
											<Row>对账</Row></div>)
				}
			}
    }
    detailser.push(<div style={{marginBottom:'10px'}} key={i}><Row>{orderOperateData.timeEnd+'：'+(orderOperateData.accountName?orderOperateData.accountName:user.schoolName)}</Row>
									<Row>{`${fee == '1'?'收款，收款理由：':'退款，退款理由：'}${orderOperateData.orderRemark?orderOperateData.orderRemark:''}`}</Row></div>)
		return detailser
	}
  
  orderStatus = (fee, status, user, orderOperateData) => {
    if( status=='0'){
      return <Popover content={this.details(fee,status, user, orderOperateData)} title="操作详情"><span style={{color:this.props.style?'#666':'red'}}>{fee == '1'?'已冲正':'已作废'}</span></Popover>
    }else if(status=='5'){
      return <Popover content={this.details(fee,status, user, orderOperateData)} title="操作详情"><span style={{color:'red'}}>已驳回</span></Popover>
    }else if(status=='4'){
      return <Popover content={this.details(fee,status, user, orderOperateData)} title="操作详情"><span style={{color:'rgb(255, 153, 0)'}}>审核中</span></Popover>
    }else if(status=='2'){
      return <Popover content={this.details(fee,status, user, orderOperateData)} title="操作详情"><span style={{color:'green'}}>正常</span></Popover>
    }else if(status=='6'){
      return <Popover content={this.details(fee,status, user, orderOperateData)} title="操作详情"><span>已对账</span></Popover>
    }
  }

  render () {
    const {
      fee, status, orderOperateData, style, user
    } = this.props

    const dateToTime = function(str){
      return (new Date(str.replace(/-/g,'/'))).getTime(); //用/替换日期中的-是为了解决Safari的兼容
    }
    if(this.props.orderOperateData.orderOperateList){
      for(var i=0; i < this.props.orderOperateData.orderOperateList.length; i++){
        this.props.orderOperateData.orderOperateList[i].createDateNew = dateToTime(this.props.orderOperateData.orderOperateList[i].createDate);
      }
      this.props.orderOperateData.orderOperateList.sort(function(a, b) {
        return b.createDateNew > a.createDateNew ? 1 : -1;
      });
    }
    

    return (
      <Row style={this.props.style?this.props.style:undefined}>
        {this.orderStatus(this.props.fee,this.props.status,this.props.user,this.props.orderOperateData)}
      </Row>
    )
  }
}
StatusList.propTypes = {
  fee: PropTypes.string,
  status: PropTypes.string,
  orderOperateData: PropTypes.object,
  style: PropTypes.object,
  user: PropTypes.object,
}

export default StatusList