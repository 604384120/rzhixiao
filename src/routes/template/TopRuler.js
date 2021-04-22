import React from 'react'

const TopRuler = ({
  rulerSize,
}) => {
  const li_style = {
    display: 'inline-block',
    transform: 'rotate(180deg)',
    width: '10%',
    letterSpacing: 'normal',
  }

  // const arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
  const genRuler = () => {
    const list = []
    for (let i = 0; i < 10; i++) {
      list.push(<li style={li_style} key={i}><img style={{ width: '101%', height: '20px', borderTop: '1px solid black' }} src="ruler.png" /><div style={{ float: 'left', transform: 'rotate(180deg)' }}>{rulerSize / 10 * (i + 1)}</div></li>)
    }
    return list
  }

  return (<div style={{ width: '100%' }}>
    <ul style={{ padding: 0, width: '100%', letterSpacing: '-8px' }}>
      {genRuler()}
    </ul>
  </div>)
}

export default TopRuler
