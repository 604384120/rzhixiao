import React from 'react'
import { Icon } from 'antd'
import styles from './error.less'

const Error = () => (<div className="content-inner">
  <div className={styles.error}>
    <Icon type="frown-o" />
    <h1>未找到您所需要的页面</h1>
  </div>
</div>)

export default Error
