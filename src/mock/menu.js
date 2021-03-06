const { config } = require('./common')

const { apiPrefix } = config
let database = [
  {
    id: '8',
    icon: 'edit',
    name: '前台业务',
  },
  {
    id: '81',
    mpid: '8',
    bpid: '8',
    name: '前台业务',
    route: '/counter',
  },
  {
    id: '1',
    icon: 'pay-circle-o',
    name: '应收账款',
  },
  {
    id: '11',
    mpid: '1',
    bpid: '1',
    name: '收费标准',
    route: '/feeRuleStand',
  },
  {
    id: '12',
    mpid: '1',
    bpid: '1',
    name: '收费任务',
    route: '/feeMission',
  },
  {
    id: '121',
    mpid: '12',
    bpid: '12',
    name: '任务详情',
    hidden: '1',
    route: '/feeMissionInfo',
  },{
    id: '122',
    mpid: '12',
    bpid: '12',
    name: '添加账单',
    hidden: '1',
    route: '/feeBillAdd',
  },
  {
    id: '13',
    mpid: '1',
    bpid: '1',
    name: '应收调整',
    route: '/feeAdjust',
  },
  {
    id: '14',
    mpid: '1',
    bpid: '1',
    name: '应收调整记录',
    route: '/feeAdjustHistory',
  },
  {
    id: '6',
    icon: 'tool',
    name: '收费维护',
  },
  {
    id: '61',
    mpid: '6',
    bpid: '6',
    name: '收费管理',
    route: '/feeOrder',
  },
  {
    id: '65',
    mpid: '6',
    bpid: '6',
    name: '收费审核',
    route: '/feeOrderReview',
  },
  {
    id: '62',
    mpid: '6',
    bpid: '6',
    name: '退费管理',
    route: '/feeReturn',
  },
  {
    id: '64',
    mpid: '6',
    bpid: '6',
    name: '退费审核',
    route: '/feeReturnReview',
  },
  {
    id: '63',
    mpid: '6',
    bpid: '6',
    name: '票据打印',
    route: '/feePrint',
  },
  {
    id: '67',
    mpid: '6',
    bpid: '6',
    name: '收费冲正',
    hidden: '1',
    route: '/feeOrderCancel',
  },
  {
    id: '68',
    mpid: '6',
    bpid: '6',
    name: '退费作废',
    hidden: '1',
    route: '/feeReturnCancel',
  },
  {
    id: '69',
    mpid: '6',
    bpid: '6',
    name: '结转',
    hidden: '1',
    route: '/feeConvert',
  },
  {
    id: '66',
    mpid: '6',
    bpid: '6',
    name: '交易对账',
    route: '/reconciliation',
  },
  {
    id: '610',
    mpid: '6',
    bpid: '6',
    name: '手续费管理',
    route: '/feeOrderRate',
  },
  {
    id: '100',
    name: '核销管理',
    icon: 'gift',
  },
  {
    id: '1001',
    name: '项目核销',
    mpid: '100',
    bpid: '100',
    icon: '',
    route: '/verifySubject',
  },
  {
    id: '1002',
    name: '核销统计',
    mpid: '100',
    bpid: '100',
    icon: '',
    route: '/verifySubjectStat',
  },
  {
    id: '7',
    icon: 'hdd',
    name: '绿色通道',
  },
  {
    id: '75',
    mpid: '7',
    bpid: '7',
    name: '缓缴标准',
    route: '/feeDeferredStand',
  },
  {
    id: '71',
    mpid: '7',
    bpid: '7',
    name: '缓缴调整',
    route: '/feeDeferred',
  },{
    id: '77',
    mpid: '7',
    bpid: '7',
    name: '缓缴调整记录',
    route: '/feeDeferredHistory',
  },{
    id: '76',
    mpid: '7',
    bpid: '7',
    name: '减免标准',
    route: '/feeDiscountStand',
  },
  {
    id: '72',
    mpid: '7',
    bpid: '7',
    name: '减免调整',
    route: '/feeDiscount',
  },
  {
    id: '78',
    mpid: '7',
    bpid: '7',
    name: '减免调整记录',
    route: '/feeDiscountHistory',
  },
  {
    id: '73',
    mpid: '7',
    bpid: '7',
    name: '贷款管理',
    route: '/feeLoan',
  },
  {
    id: '74',
    mpid: '7',
    bpid: '7',
    name: '奖助学金管理',
    route: '/feeSubsidy',
  },
  {
    id: '5',
    icon: 'bar-chart',
    name: '统计查询',
  },
  {
    id: '53',
    mpid: '5',
    bpid: '5',
    name: '组织结构统计',
    route: '/statisticsStruct',
  },
  {
    id: '56',
    mpid: '5',
    bpid: '5',
    name: '按个人统计',
    route: '/statisticsStudent',
  },
  {
    id: '54',
    mpid: '5',
    bpid: '5',
    name: '按任务统计',
    route: '/statisticsMission',
  },
  {
    id: '52',
    mpid: '5',
    bpid: '5',
    name: '按项目统计',
    route: '/statisticsSubject',
  },
  {
    id: '51',
    mpid: '5',
    bpid: '5',
    name: '收费方式统计',
    route: '/statistics',
  },
  {
    id: '55',
    mpid: '5',
    bpid: '5',
    name: '按时间统计',
    route: '/statisticsTime',
  },
  {
    id: '2',
    name: '票据管理',
    icon: 'file',
  },
  {
    id: '22',
    name: '票据类型',
    mpid: '2',
    bpid: '2',
    icon: '',
    route: '/receipt',
  }, {
    id: '23',
    name: '模板设计',
    mpid: '2',
    bpid: '2',
    icon: '',
    hidden: '1',
    route: '/template',
  }, {
    id: '21',
    name: '打印设置',
    mpid: '2',
    bpid: '2',
    icon: '',
    hidden: '1',
    route: '/printSet',
  },
  {
    id: '3',
    name: '学生管理',
    icon: 'user',
  }, {
    id: '31',
    name: '学生档案',
    mpid: '3',
    bpid: '3',
    icon: '',
    route: '/user',
  }, {
    id: '311',
    name: '个人信息',
    mpid: '31',
    bpid: '31',
    icon: '',
    hidden: '1',
    route: '/userInfo',
  }, {
    id: '32',
    name: '批量导入',
    mpid: '3',
    bpid: '3',
    icon: '',
    route: '/userImport',
  },
  {
    id: '33',
    name: '学籍异动',
    mpid: '3',
    bpid: '3',
    icon: '',
    route: '/userTransfer',
  },
  {
    id: '110',
    name: '招生管理',
    icon: 'usergroup-add',
  },
  {
    id: '1101',
    name: '招生人员',
    mpid: '110',
    bpid: '110',
    icon: '',
    route: '/joinAccount',
  },
  {
    id: '1105',
    name: '意向学员',
    mpid: '110',
    bpid: '110',
    icon: '',
    route: '/joinStudent',
  },
  {
    id: '1102',
    name: '入学管理',
    mpid: '110',
    bpid: '110',
    icon: '',
    route: '/joinAdminister',
  },
  // {
  //   id: '1102',
  //   name: '生源管理',
  //   mpid: '110',
  //   bpid: '110',
  //   icon: '',
  //   route: '/joinUser',
  // },
  {
    id: '11021',
    name: '生员详情',
    mpid: '1102',
    bpid: '1102',
    icon: '',
    hidden: '1',
    route: '/joinUserInfo',
  },
  {
    id: '11022',
    name: '招生审核',
    mpid: '1102',
    bpid: '1102',
    icon: '',
    hidden: '1',
    route: '/reviewJoinUser',
  },
  {
    id: '11023',
    name: '报名',
    mpid: '1102',
    bpid: '1102',
    icon: '',
    hidden: '1',
    route: '/joinUserAdd',
  },
  {
    id: '1103',
    name: '招生统计',
    mpid: '110',
    bpid: '110',
    icon: '',
    route: '/joinStat',
  },
  {
    id: '4',
    name: '系统设置',
    icon: 'setting',
  },
  {
    id: '43',
    mpid: '4',
    bpid: '4',
    name: '学校配置',
    route: '/schoolInfo',
  },
  {
    id: '411',
    mpid: '4',
    bpid: '4',
    name: '字段管理',
    route: '/userAttr',
  },
  {
    id: '41',
    bpid: '4',
    mpid: '4',
    name: '学校结构',
    route: '/struct',
  },
  {
    id: '42',
    bpid: '4',
    mpid: '4',
    name: '用户管理',
    route: '/account',
  },
  {
    id: '11',
    mpid: '4',
    bpid: '4',
    name: '收费项目',
    route: '/feeSubject',
  },
  {
    id: '9',
    name: '学分学费',
    icon: 'solution',
  },
  {
    id: '91',
    mpid: '9',
    bpid: '9',
    name: '课程管理',
    route: '/creditClass',
  },
  {
    id: '92',
    mpid: '9',
    bpid: '9',
    name: '学分标准',
    route: '/creditRule',
  },
  {
    id: '93',
    mpid: '9',
    bpid: '9',
    name: '学分管理',
    route: '/creditBatch',
  },{
    id: '931',
    mpid: '93',
    bpid: '93',
    name: '学分管理详情',
    hidden: '1',
    route: '/creditBatchInfo',
  },
]

let dataMain = [
  {
    id: '20',
    icon: 'home',
    name: '首页'
  },{
    id: '21',
    mpid: '20',
    bpid: '20',
    name: '首页',
    route: '/main',
  },{
    id: '30',
    icon: 'team',
    name: '用户管理'
  },{
    id: '31',
    mpid: '30',
    bpid: '30',
    name: '用户管理',
    route: '/administer',
  },{
    id: '40',
    icon: 'pie-chart',
    name: '统计查询'
  },{
    id: '41',
    mpid: '40',
    bpid: '40',
    name: '账务统计',
    route: '/adminStat',
  },
] 

module.exports = {
  [`GET ${apiPrefix}/mgr/mgrAccount/getMenu`] (req, res) {
    let data = {}
    data.ret_code = 1
    if(req.query.token){
      data.ret_content = database
    }else{
      data.ret_content = dataMain
    }
    res.status(200).json(data)
  },
}
