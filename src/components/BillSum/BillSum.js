import React from 'react'
import { Row, Icon, Spin } from 'antd'
import PropTypes from 'prop-types'
import { getFormat } from 'utils'
import { UserDisplay } from 'components'

const antIcon = <Icon type="loading" style={{ fontSize: 20 }} spin />;

class BillSum extends React.Component {
  state = {
    totalBegin: 0,
  }

  handleMoveLeft = () => {
    if(this.state.totalBegin>0){
      this.setState({
        totalBegin:this.state.totalBegin-1
      })
    }
  }

  handleMoveRight = () => {
    this.setState({
      totalBegin:this.state.totalBegin+1
    })
  }
  
  createTotal = () => {
    const cols = [];
    let i =0;
    let step = Math.round(document.body.clientWidth / 200)
    if(step > this.props.step){
      step = this.props.step
    }
    
    let statList = [...this.props.statList]
    if(this.props.setting){
      this.props.setting.title = "统计设置"
      this.props.setting.content = <Icon type="appstore-o" style={{fontSize:'35px', marginTop:'20px'}}/>
      statList.push({_type:'setting'})
    }
    if(this.state.totalBegin>=statList.length){
      this.state.totalBegin = 0
    }
    for(i = this.state.totalBegin;i<statList.length;i++){
      cols.push(<div style={{width:100/`${step}`+'%', float:'left', height:'80px'}} key={i}>
        {
          this.state.totalBegin>0&&cols.length<1&&<Icon type='double-left' onClick={this.handleMoveLeft} style={{position:'absolute', marginTop:'16px', fontSize:'22px', color:'#c3c3c3', left:0}}/>
        }
        {statList[i]._type=='setting'?<UserDisplay {...this.props.setting}/>:(this.props.statData?<div>
          <div style={{ marginBottom: '8px', color: '#aaaaaa' }}>{statList[i].name}</div>
          {this.props.dataLoading==false?<div>
          <div style={{ fontSize: '20px' }}>{this.props.statData[statList[i].pens]?this.props.statData[statList[i].pens]:getFormat(this.props.statData[statList[i].sum])}</div>
          <div className={this.props.styles.peopleNum}>{this.props.type&&this.props.type=='1'?(this.props.statData[statList[i].count]?this.props.statData[statList[i].count]+'/人':'0/人'):''}</div>
          </div>:<div className={this.props.styles.spinningBox}><Spin indicator={antIcon} className={this.props.styles.spinning}/></div>}
        </div>:
        <div><div style={{ marginBottom: '8px', color: '#aaaaaa' }}>{statList[i].name}</div>
        {this.props.dataLoading==false?<div ><div style={{ fontSize: '20px' }}>0.00</div></div>:<div className={this.props.styles.spinningBox}><Spin indicator={antIcon} className={this.props.styles.spinning}/></div>}</div>)}
        {
          cols.length>=step-1&&this.state.totalBegin<statList.length-step&&<Icon type='double-right' onClick={this.handleMoveRight} style={{position:'absolute', marginTop:'16px', fontSize:'22px', color:'#c3c3c3', top:0, right:0}}/>
        }
      </div>)
      if(cols.length==step){
        break
      }
    }
   return cols;
  }

  render () {
    const {
      statData, statList, styles, getFormat, dataLoading, type
    } = this.props
    return (
      <Row>
        {this.createTotal()}
      </Row>
    )
  }
}
BillSum.propTypes = {
  dataLoading:PropTypes.bool,
  type: PropTypes.string,
  statData: PropTypes.object,
  statList: PropTypes.object,
  styles: PropTypes.object,
  getFormat: PropTypes.func,
  onMoveLeft: PropTypes.func,
  onMoveRight: PropTypes.func,
}

export default BillSum