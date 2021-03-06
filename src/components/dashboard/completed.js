import React from 'react'
import styles from './completed.less'
import { color } from '../../utils'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function Completed (props) {
  return (
    <div className={styles.sales}>
      <div className={styles.title}>TEAM TOTAL COMPLETED</div>
      <ResponsiveContainer minHeight={360}>
        <AreaChart data={props.data}>
          <Legend verticalAlign="top"
            content={(props) => {
              const { payload } = props
              return (<ul className={`${styles.legend} clearfix`}>
                {payload.map((item, key) => <li key={key}><span className={styles.radiusdot} style={{ background: item.color }} />{item.value}</li>) }
              </ul>)
            }}
          />
          <XAxis dataKey="name" axisLine={{ stroke: color.borderBase, strokeWidth: 1 }} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <CartesianGrid vertical={false} stroke={color.borderBase} strokeDasharray="3 3" />
          <Tooltip
            wrapperStyle={{ border: 'none', boxShadow: '4px 4px 40px rgba(0, 0, 0, 0.05)' }}
            content={(content) => {
              const list = content.payload.map((item, key) => <li key={key} className={styles.tipitem}><span className={styles.radiusdot} style={{ background: item.color }} />{`${item.name}:${item.value}`}</li>)
              return <div className={styles.tooltip}><p className={styles.tiptitle}>{content.label}</p><ul>{list}</ul></div>
            }}
          />
          <Area type="monotone" dataKey="Task complete" stroke={color.grass} fill={color.grass} strokeWidth={2} dot={{ fill: '#fff' }} activeDot={{ r: 5, fill: '#fff', stroke: color.green }} />
          <Area type="monotone" dataKey="Cards Complete" stroke={color.sky} fill={color.sky} strokeWidth={2} dot={{ fill: '#fff' }} activeDot={{ r: 5, fill: '#fff', stroke: color.blue }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Completed
