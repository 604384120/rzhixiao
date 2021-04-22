import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, routerRedux } from 'dva/router'
import { LocaleProvider } from 'antd'
import dynamic from 'dva/dynamic'
import App from 'routes/app'
import zhCN from 'antd/lib/locale-provider/zh_CN'

const { ConnectedRouter } = routerRedux

const Routers = function ({ history, app }) {
  const error = dynamic({
    app,
    component: () => import('./routes/order'),
  })
  const routes = [
    {
      path: '/main',
      models: () => [import('./models/main')],
      component: () => import('./routes/main/'),
    },
    {
      path: '/administer',
      models: () => [import('./models/administer')],
      component: () => import('./routes/administer/'),
    },
    {
      path: '/adminStat',
      models: () => [import('./models/adminStat')],
      component: () => import('./routes/adminStat/'),
    },
    {
      path: '/feeSubject',
      models: () => [import('./models/feeSubject')],
      component: () => import('./routes/feeSubject/'),
    }, {
      path: '/feeMission',
      models: () => [import('./models/feeMission')],
      component: () => import('./routes/feeMission/'),
    }, {
      path: '/feeMissionInfo',
      models: () => [import('./models/feeMissionInfo')],
      component: () => import('./routes/feeMissionInfo'),
    }, {
      path: '/user',
      models: () => [import('./models/user')],
      component: () => import('./routes/user/'),
    }, {
      path: '/userInfo',
      models: () => [import('./models/userInfo')],
      component: () => import('./routes/userInfo/'),
    }, {
      path: '/userImport',
      models: () => [import('./models/userImport')],
      component: () => import('./routes/userImport/'),
    }, {
      path: '/userTransfer',
      models: () => [import('./models/userTransfer')],
      component: () => import('./routes/userTransfer/'),
    }, {
      path: '/login',
      models: () => [import('./models/login')],
      component: () => import('./routes/login/'),
    }, {
      path: '/account',
      models: () => [import('./models/account')],
      component: () => import('./routes/account/'),
    }, {
      path: '/struct',
      models: () => [import('./models/struct')],
      component: () => import('./routes/struct'),
    }, {
      path: '/receipt',
      models: () => [import('./models/receipt')],
      component: () => import('./routes/receipt'),
    }, {
      path: '/template',
      models: () => [import('./models/template')],
      component: () => import('./routes/template'),
    }, {
      path: '/printSet',
      models: () => [import('./models/printSet')],
      component: () => import('./routes/printSet/'),
    }, {
      path: '/schoolInfo',
      models: () => [import('./models/schoolInfo')],
      component: () => import('./routes/schoolInfo/'),
    }, {
      path: '/userAttr',
      models: () => [import('./models/userAttr')],
      component: () => import('./routes/userAttr/'),
    }, {
      path: '/counter',
      models: () => [import('./models/counter')],
      component: () => import('./routes/counter/'),
    }, {
      path: '/feeBillAdd',
      models: () => [import('./models/feeBillAdd')],
      component: () => import('./routes/feeBillAdd/'),
    },{
      path: '/statistics',
      models: () => [import('./models/statistics')],
      component: () => import('./routes/statistics/'),
    },{
      path: '/statisticsSubject',
      models: () => [import('./models/statisticsSubject')],
      component: () => import('./routes/statisticsSubject/'),
    },{
      path: '/feeOrder',
      models: () => [import('./models/feeOrder')],
      component: () => import('./routes/feeOrder/'),
    },{
      path: '/feeReturn',
      models: () => [import('./models/feeReturn')],
      component: () => import('./routes/feeReturn/'),
    },{
      path: '/feeReturnReview',
      models: () => [import('./models/feeReturnReview')],
      component: () => import('./routes/feeReturnReview/'),
    },{
      path: '/feeOrderReview',
      models: () => [import('./models/feeOrderReview')],
      component: () => import('./routes/feeOrderReview/'),
    },{
      path: '/feeOrderRate',
      models: () => [import('./models/feeOrderRate')],
      component: () => import('./routes/feeOrderRate/'),
    },{
      path: '/feePrint',
      models: () => [import('./models/feePrint')],
      component: () => import('./routes/feePrint/'),
    },{
      path: '/reconciliation',
      models: () => [import('./models/reconciliation')],
      component: () => import('./routes/reconciliation/'),
    },{
      path: '/feeDeferred',
      models: () => [import('./models/feeDeferred')],
      component: () => import('./routes/feeDeferred/'),
    },{
      path: '/feeDeferredHistory',
      models: () => [import('./models/feeDeferredHistory')],
      component: () => import('./routes/feeDeferredHistory/'),
    },{
      path: '/feeDiscount',
      models: () => [import('./models/feeDiscount')],
      component: () => import('./routes/feeDiscount/'),
    },{
      path: '/feeDiscountHistory',
      models: () => [import('./models/feeDiscountHistory')],
      component: () => import('./routes/feeDiscountHistory/'),
    },{
      path: '/feeLoan',
      models: () => [import('./models/feeLoan')],
      component: () => import('./routes/feeLoan/'),
    },{
      path: '/feeSubsidy',
      models: () => [import('./models/feeSubsidy')],
      component: () => import('./routes/feeSubsidy'),
    },{
      path: '/feeAdjust',
      models: () => [import('./models/feeAdjust')],
      component: () => import('./routes/feeAdjust/'),
    },{
      path: '/feeAdjustHistory',
      models: () => [import('./models/feeAdjustHistory')],
      component: () => import('./routes/feeAdjustHistory/'),
    },{
      path: '/statisticsStruct',
      models: () => [import('./models/statisticsStruct')],
      component: () => import('./routes/statisticsStruct/'),
    },{
      path: '/statisticsStudent',
      models: () => [import('./models/statisticsStudent')],
      component: () => import('./routes/statisticsStudent/'),
    },{
      path: '/statisticsMission',
      models: () => [import('./models/statisticsMission')],
      component: () => import('./routes/statisticsMission/'),
    },{
      path: '/statisticsTime',
      models: () => [import('./models/statisticsTime')],
      component: () => import('./routes/statisticsTime/'),
    },{
      path: '/creditClass',
      models: () => [import('./models/creditClass')],
      component: () => import('./routes/creditClass/'),
    },{
      path: '/creditRule',
      models: () => [import('./models/creditRule')],
      component: () => import('./routes/creditRule/'),
    },{
      path: '/creditBatch',
      models: () => [import('./models/creditBatch')],
      component: () => import('./routes/creditBatch/'),
    },{
      path: '/creditBatchInfo',
      models: () => [import('./models/creditBatchInfo')],
      component: () => import('./routes/creditBatchInfo/'),
    },{
      path: '/feeRuleStand',
      models: () => [import('./models/feeRuleStand')],
      component: () => import('./routes/feeRuleStand/'),
    },{
      path: '/feeDeferredStand',
      models: () => [import('./models/feeDeferredStand')],
      component: () => import('./routes/feeDeferredStand/'),
    },{
      path: '/feeDiscountStand',
      models: () => [import('./models/feeDiscountStand')],
      component: () => import('./routes/feeDiscountStand/'),
    },{
      path: '/verifySubject',
      models: () => [import('./models/verifySubject')],
      component: () => import('./routes/verifySubject/'),
    },{
      path: '/verifySubjectStat',
      models: () => [import('./models/verifySubjectStat')],
      component: () => import('./routes/verifySubjectStat/'),
    },
    {
      path: '/joinAccount',
      models: () => [import('./models/joinAccount')],
      component: () => import('./routes/joinAccount/'),
    },
    {
      path: '/joinStudent',
      models: () => [import('./models/joinStudent')],
      component: () => import('./routes/joinStudent/'),
    },
    {
      path: '/joinAdminister',
      models: () => [import('./models/joinAdminister')],
      component: () => import('./routes/joinAdminister/'),
    },
    {
      path: '/joinUser',
      models: () => [import('./models/joinUser')],
      component: () => import('./routes/joinUser/'),
    },
    {
      path: '/joinUserInfo',
      models: () => [import('./models/joinUserInfo')],
      component: () => import('./routes/joinUserInfo/'),
    },
    {
      path: '/joinStat',
      models: () => [import('./models/joinStat')],
      component: () => import('./routes/joinStat/'),
    },
  ]

  return (
    <ConnectedRouter history={history}>
      <LocaleProvider locale={zhCN}>
        <App>
          <Switch>
            {/* <Route exact path="/" render={() => (<Redirect to="/feeMission" />)} /> */}
            {
            routes.map(({ path, ...dynamics }, key) => (
              <Route key={key}
                exact
                path={path}
                component={dynamic({
                  app,
                  ...dynamics,
                })}
              />
            ))
          }
            <Route component={error} />
          </Switch>
        </App>
      </LocaleProvider>
    </ConnectedRouter>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
