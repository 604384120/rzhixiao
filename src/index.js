import 'babel-polyfill'
import { message } from 'antd'
import dva from 'dva'
import createLoading from 'dva-loading'
import createHistory from 'history/createHashHistory'


// 1. Initialize    初始化
const app = dva({
  ...createLoading({
    effects: true,
  }),
  history: createHistory(),
  onError (error) {
    message.error(error.message)
  },
})

// 2. Model     加载model
app.model(require('./models/app'))

// 3. Router    加载路由
app.router(require('./router'))

// 4. Start     启动程序
app.start('#root')
