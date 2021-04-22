import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Test from './Test'

const style = {
  display: 'inline-block',
  margin: 0,
  position: 'relative',
  width: '100%',
}

@DragDropContext(HTML5Backend)
export default class Container extends Component {
  constructor (props) {
    super(props)
    this.moveCard = this.moveCard.bind(this)
    this.state = {
      texts: props.receiptTemplateTexts,
      imgHeight: 0,
      imgWidth: 0,
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ texts: nextProps.receiptTemplateTexts })
    this.setState({ templateWidth: nextProps.templateWidth })
    this.setState({ rulerSize: nextProps.rulerSize })
    this.setState({ imgUrl: nextProps.imgUrl })
    this.setState({ imgWidth: nextProps.imgWidth })
    this.setState({ imgHeight: nextProps.imgHeight })
    this.setState({ fontSize: nextProps.fontSize })
  }

  moveCard (dragIndex, hoverIndex, clientOffset, hoverBoundingRect) {
    let newTexts = this.state.texts

    let pos
    newTexts.map((item, index) => {
      if (item.id == dragIndex) {
        pos = index
      }
    })

    newTexts[pos].positionX = newTexts[pos].positionX + clientOffset.x / hoverBoundingRect.width * 100
    if (newTexts[pos]._positionX) {
      delete newTexts[pos]._positionX
    }
    newTexts[pos].positionY = newTexts[pos].positionY + clientOffset.y / hoverBoundingRect.height * 100
    if (newTexts[pos]._positionY) {
      delete newTexts[pos]._positionY
    }
    this.setState({ texts: newTexts })

    this.props.move(newTexts, newTexts[pos])
  }

  render () {
    return (
      <div style={style}>
        <Test imgload={this.props.imgload}
          imgWidth={this.state.imgWidth}
          imgHeight={this.state.imgHeight}
          fontSize={this.state.fontSize}
          moveCard={this.moveCard}
          son={this.state.texts}
          imgUrl={this.state.imgUrl}
          templateWidth={this.state.templateWidth}
          rulerSize={this.props.rulerSize}
          currentText={this.props.currentText}
          onChangeCurrentText={this.props.onChangeCurrentText}
          onChangeName={this.props.onChangeName}
          onDelete={this.props.onDelete}
        />
      </div>
    )
  }
}
