import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'
import TemText from './TemText'

const testTarget = {
  hover (props, monitor, component) {

  },
  drop (props, monitor, component) {// 当有对应的 drag source 放在当前组件区域时，会返回一个对象，可以在 monitor.getDropResult() 中获取到
    // if (monitor.didDrop()) {
	 //      // If you want, you can check whether some nested
	 //      // target already handled drop
	 //      return;
	 //    }
	 	const dragIndex = monitor.getItem().index	//  方法可以获得当前 哪个元素被拖拽(必须要在 drag source 的 beginDrag 方法中返回)，调用 component 上的 moveBox 方法重新设置拖拽之后的最新位置，从而实现元素的移动
    const hoverIndex = props.index

    // const clientOffset1 = monitor.getClientOffset()

    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()// findDOMNode(component)返回dom元素节点；getBoundingClientRect用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置。getBoundingClientRect是DOM元素到浏览器可视范围的距离（不包含文档卷起的部分）。

    const clientOffset = monitor.getDifferenceFromInitialOffset()// 方法计算出每次 drop 的时候，当前元素与拖拽前元素位置的偏移量

    // console.log(clientOffset1, clientOffset)

    props.moveCard(dragIndex, hoverIndex, clientOffset, hoverBoundingRect)
  },
}

@DropTarget(ItemTypes.CARD, testTarget, connect => ({// 接收拖拽的testTarget事件对象    // connect 里面的函数用来将 DOM 节点与 react-dnd 的 backend 建立联系
  connectDropTarget: connect.dropTarget(),// 包裹住 DOM 节点，使其可以接收对应的拖拽组件
}))
export default class Test extends Component {
	static propTypes = {//  这里声明好外部引用的时候需要传的参数
	  connectDropTarget: PropTypes.func.isRequired,// 使用isRequired设置属性为必须传递的值
	  moveCard: PropTypes.func.isRequired,
	}

	constructor (props) {
	  super(props)
	  this.state = {
	    templateWidth: this.props.templateWidth,
	    imgHeight: 0,
	    imgWidth: 0,
	  }
	}

	componentWillReceiveProps (nextProps) {
	  this.setState({ templateWidth: nextProps.templateWidth })
	  this.setState({ templateImgWidth: `${(nextProps.templateWidth / nextProps.rulerSize) * 100}%` })
	  this.setState({ imgUrl: nextProps.imgUrl })
	  this.setState({ imgWidth: nextProps.imgWidth })
	  this.setState({ imgHeight: nextProps.imgHeight })
	  this.setState({ fontSize: nextProps.fontSize })
	}

	render () {
	  const {
	    connectDropTarget,
	    currentText,
		onChangeCurrentText,
		onChangeName,
		onDelete,
	    templateWidth,
	  } = this.props

	  const imgWidth = this.state.imgWidth
	  const imgHeight = this.state.imgHeight
	  const fontSize = this.state.fontSize
	  return connectDropTarget(<div style={{ display: 'inline-block', width: this.state.templateImgWidth, position: 'relative' }}><img onLoad={this.props.imgload} style={{ width: '100%' }} src={this.state.imgUrl} />{this.props.son.map((item) => {
			return	<TemText imgWidth={imgWidth} key={item.id} imgHeight={imgHeight} index={item.id} textData={item} templateWidth={templateWidth} fontSize={fontSize} currentText={currentText} onChangeCurrentText={onChangeCurrentText} onChangeName={onChangeName} onDelete={onDelete}/>
		})}</div>)
	}
}
