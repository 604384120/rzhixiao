import React, { Component } from 'react'
import { DragSource } from 'react-dnd'
import ItemTypes from './ItemTypes'
import { Input,Icon, Popconfirm } from 'antd'

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}


const cardSource = {
  beginDrag (props) {// 开始拖拽时触发当前函数  @param {*} props 组件的 props
    return {// 返回的对象可以在 monitor.getItem() 中获取到
      index: props.index,
      item: props.textData,
      x: props.textData.positionX,
      y: props.textData.positionY,
    }
  },
}


@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),// 包裹住 DOM 节点，使其可以进行拖拽操作
  isDragging: monitor.isDragging(),// 是否处于拖拽状态
}))

export default class TemText extends Component {
  render () {
    const {
      text,
      isDragging,
      connectDragSource,
      textData,
      imgWidth,
      imgHeight,
      fontSize,
      currentText,
      onChangeCurrentText,
      onChangeName,
      onDelete,
    } = this.props
    const opacity = isDragging ? 0 : 1
    const x = `${textData.positionX}%`
    const y = `${textData.positionY}%`
    const w = textData.width * imgWidth / 100
    const h = textData.height * imgHeight / 100
    return connectDragSource(
      <div style={{position: 'absolute', opacity, top: y, left: x}}onClick={(e) => { e.stopPropagation(); onChangeCurrentText(textData) }}>
        <Input value={textData.name} disabled={currentText && currentText.id == textData.id?false:true} 
              style={currentText && currentText.id == textData.id ? {cursor: 'move', width: w, height: h, borderColor: textData.name?(currentText.name?'#40a9ff':''):'red', fontSize: fontSize} : { cursor: 'move', width: w, height: h,borderColor: textData.name?'':'red' , fontSize: fontSize}}
              onChange={(e)=>{onChangeName(textData, e.target.value)}}
        />
        {currentText && currentText.id == textData.id?
        <Popconfirm title="确认删除?" okText="确定" cancelText="取消" onConfirm={()=>onDelete(textData)}>
        <Icon type='close' style={{position: 'absolute',right:'5px',top:h/2-6, color:'rgb(160, 160, 160)'}} /></Popconfirm>:''}
      </div>)
  }
}
