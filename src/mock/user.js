const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')

const { apiPrefix } = config

let usersListData = Mock.mock({
  'data|80-100': [
    {
      id: '@id',
      name: '@name',
      nickName: '@last',
      phone: /^1[34578]\d{9}$/,
      'age|11-99': 1,
      address: '@county(true)',
      isMale: '@boolean',
      email: '@email',
      createTime: '@datetime',
      avatar () {
        return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
      },
    },
  ],
})


let database = usersListData.data

const EnumRoleType = {
  ADMIN: 'admin',
  DEFAULT: 'guest',
  DEVELOPER: 'developer',
}

const userPermission = {
  DEFAULT: {
    visit: ['1', '2', '21', '7', '5', '51', '52', '53'],
    role: EnumRoleType.DEFAULT,
  },
  ADMIN: {
    role: EnumRoleType.ADMIN,
  },
  DEVELOPER: {
    role: EnumRoleType.DEVELOPER,
  },
}

const adminUsers = [
  {
    id: 0,
    username: 'admin',
    password: 'admin',
    permissions: userPermission.ADMIN,
  }, {
    id: 1,
    username: 'guest',
    password: 'guest',
    permissions: userPermission.DEFAULT,
  }, {
    id: 2,
    username: '吴彦祖',
    password: '123456',
    permissions: userPermission.DEVELOPER,
  },
]

const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  let data

  for (let item of array) {
    if (item[keyAlias] === key) {
      data = item
      break
    }
  }

  if (data) {
    return data
  }
  return null
}

const NOTFOUND = {
  message: 'Not Found',
  documentation_url: 'http://localhost:8000/request',
}

module.exports = {
  [`GET ${apiPrefix}/message/message/getMessageList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 16 }
    data.ret_content.data = [
      {
        id: '1',
        status: '2',
        content: '给您指派了一个收费任务',
        url: '/feeMissionInfo?missionId=1',
        type: '1',
        sendPersonName: '测试/www',
        sendPerson: '98',
        createDate: '2018-05-03 11:17:54',
        handleDate: null,
        title: null,
      }, {
        id: '2',
        status: '1',
        content: '编辑了1条学生信息',
        url: '/user?version=2018-04-05 11:23:23&versionType=2',
        type: '2',
        sendPersonName: '测试/www',
        sendPerson: '98',
        createDate: '2018-05-03 11:17:54',
        handleDate: null,
        title: null,
      }, {
        id: '3',
        status: '1',
        content: '添加了10条学生信息',
        url: '/user?version=2018-04-05 11:23:23&versionType=3',
        type: '3',
        sendPersonName: '测试/www',
        sendPerson: '98',
        createDate: '2018-05-03 11:17:54',
        handleDate: null,
        title: null,
      }, {
        id: '4',
        status: '1',
        content: '删除了10条学生信息',
        url: '/user?version=2018-04-05 11:23:23&versionType=4',
        type: '4',
        sendPersonName: '测试/www',
        sendPerson: '98',
        createDate: '2018-05-03 11:17:54',
        handleDate: null,
        title: null,
      }, {
        id: '5',
        status: '1',
        content: '给您指派了一个收费任务',
        url: null,
        type: '1',
        sendPersonName: '测试/www',
        sendPerson: '98',
        createDate: '2018-05-03 11:17:54',
        handleDate: null,
        title: null,
      }, {
        id: '1',
        status: '2',
        content: '给您指派了一个收费任务',
        url: '/feeMissionInfo?missionId=1',
        type: '1',
        sendPersonName: '测试/www',
        sendPerson: '98',
        createDate: '2018-05-03 11:17:54',
        handleDate: null,
        title: null,
      }, {
        id: '2',
        status: '1',
        content: '给您指派了一个收费任务',
        url: null,
        type: '2',
        sendPersonName: '测试/www',
        sendPerson: '98',
        createDate: '2018-05-03 11:17:54',
        handleDate: null,
        title: null,
      }, {
        id: '3',
        status: '1',
        content: '给您指派了一个收费任务',
        url: null,
        type: '3',
        sendPersonName: '测试/www',
        sendPerson: '98',
        createDate: '2018-05-03 11:17:54',
        handleDate: null,
        title: null,
      }, {
        id: '4',
        status: '1',
        content: '给您指派了一个收费任务',
        url: null,
        type: '4',
        sendPersonName: '测试/www',
        sendPerson: '98',
        createDate: '2018-05-03 11:17:54',
        handleDate: null,
        title: null,
      }, {
        id: '5',
        status: '1',
        content: '给您指派了一个收费任务',
        url: null,
        type: '1',
        sendPersonName: '测试/www',
        sendPerson: '98',
        createDate: '2018-05-03 11:17:54',
        handleDate: null,
        title: null,
      }, {
        id: '1',
        status: '2',
        content: '给您指派了一个收费任务',
        url: '/feeMissionInfo?missionId=1',
        type: '1',
        sendPersonName: '测试/www',
        sendPerson: '98',
        createDate: '2018-05-03 11:17:54',
        handleDate: null,
        title: null,
      }, {
        id: '2',
        status: '1',
        content: '给您指派了一个收费任务',
        url: null,
        type: '2',
        sendPersonName: '测试/www',
        sendPerson: '98',
        createDate: '2018-05-03 11:17:54',
        handleDate: null,
        title: null,
      }, {
        id: '3',
        status: '1',
        content: '给您指派了一个收费任务',
        url: null,
        type: '3',
        sendPersonName: '测试/www',
        sendPerson: '98',
        createDate: '2018-05-03 11:17:54',
        handleDate: null,
        title: null,
      }, {
        id: '4',
        status: '1',
        content: '给您指派了一个收费任务',
        url: null,
        type: '4',
        sendPersonName: '测试/www',
        sendPerson: '98',
        createDate: '2018-05-03 11:17:54',
        handleDate: null,
        title: null,
      }, {
        id: '5',
        status: '1',
        content: '给您指派了一个收费任务',
        url: null,
        type: '1',
        sendPersonName: '测试/www',
        sendPerson: '98',
        createDate: '2018-05-03 11:17:54',
        handleDate: null,
        title: null,
      },
    ]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/message/message/getCount`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = '10'
    res.status(200).json(data)
  },

  [`POST ${apiPrefix}/message/message/updateMessageStatus`] (req, res) {
    res.status(200).json({ ret_code: '1', ret_content: '1' })
  },
  
  [`POST ${apiPrefix}/upload`] (req, res) {
    res.status(200).json({ ret_code: '1', ret_content: { fileName: '111.png' } })
  },

  [`GET ${apiPrefix}/user/userAccount/getUserCount`] (req, res) {
    res.status(200).json({ ret_code: '1', ret_content: '0' })
  },

  [`GET ${apiPrefix}/user/userAttr/getUserAttr`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = [{
      id: '1',
      name: '校区',
      position: '1',
      type: '2',
      relateId: 'a',
      valueType: '3',
      status: '1',
      userShow:'1'
    }, {
      id: '2',
      name: '院系',
      position: '2',
      type: '2',
      relateId: 'b',
      valueType: '3',
      status: '1',
      userShow:'1'
    }, {
      id: '3',
      name: '专业',
      position: '3',
      type: '2',
      relateId: 'c',
      valueType: '3',
      status: '1',
      userShow:'1'
    }, {
      id: '4',
      name: '班级',
      position: '4',
      type: '2',
      relateId: 'd',
      valueType: '3',
      status: '1',
      userShow:'1'
    }, {
      id: '412',
      name: "学生状态",
      position: '5',
      type: '2',
      relateId: '',
      valueType: '2',
      status: '1',
      statusDefault:'1',
      valueDefault:'1',
      userShow:'1'
    }, {
      id: '5',
      name: '姓名',
      position: '5',
      type: '1',
      relateId: 'name',
      valueType: '1',
      status: '1',
      statusDefault:'1',
      userShow:'1'
    },
    {
      id: '6',
      name: '学号',
      position: '6',
      type: '1',
      relateId: 'stuno',
      valueType: '1',
      status: '1',
      userShow:'1'
    }, {
      id: '22',
      name: '身份证件号',
      position: '22',
      type: '1',
      relateId: 'IDCard',
      valueType: '1',
      status: '1',
      userShow:'1'
    },{
      id: '7',
      name: '性别',
      position: '7',
      type: '1',
      relateId: 'sex',
      valueType: '2',
      status: '1',
      userShow:'1'
    }, {
      id: '8',
      name: '民族',
      position: '8',
      type: '1',
      relateId: 'mz',
      valueType: '2',
      status: '1',
      userShow:'1'
    }, {
      id: '9',
      name: '专业类别',
      position: '9',
      type: '3',
      relateId: 'lb',
      valueType: '2',
      status: '2',
      userShow:'0'
    }, {
      id: '10',
      name: '学科门类',
      position: '10',
      type: '5',
      relateId: 'ml',
      valueType: '2',
      status: '2',
      statusDefault:'0',
      valueDefault:'0',
      userShow:'0'
    }, {
      id: '11',
      name: '电话',
      position: '12',
      type: '4',
      relateId: 'dh',
      valueType: '1',
      status: '1',
      userShow:'1'
    },
    ]
    res.status(200).json(data)
  },
  [`GET ${apiPrefix}/user/userAttr/getDisplayAttr`] (req, res) {
    let data = {}
    data.ret_code = 1
    if (req.query.sence == 'orderSort1') {
      data.ret_content = [
        {
          id: 'printStatus',
          position: '6',
        },
      ]
    }else if(req.query.sence.indexOf("statDataDisplay") >=0){
      data.ret_content=[{"position":"1","id":"exceedFee"},{"position":"2","id":"convertFee"},{"position":"3","id":"arrears"},{"position":"4","id":"totalFee"},{"position":"5","id":"discount"},{"position":"6","id":"paidFee"},{"position":"7","id":"refund"},{"position":"8","id":"receivedFee"}]
    }
    else {
      data.ret_content = [{
        id: '1x',
        position: '1',
      }, {
        id: '2',
        position: '2',
      },
      {
        id: '3',
        position: '3',
      }, {
        id: '5',
        position: '5',
      },
      {
        id: '6',
        position: '6',
      },
      ]
    }

    res.status(200).json(data)
  },

  [`POST ${apiPrefix}/user/userAttr/updateUserAttr`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/user/userAttr/updateUserAttrStatus`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/user/userAttr/addUserAttr`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/user/userAttr/addUserAttrValue`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/user/userAttr/updateUserAttrValue`] (req, res) {
    res.status(200).json({ ret_code: 0, ret_content: 1 })
  },

  [`POST ${apiPrefix}/user/userAttr/deleteUserAttrValue`] (req, res) {
    res.status(200).json({ ret_code: 2, ret_content: "删除失败" })
  },

  [`POST ${apiPrefix}/user/userAttr/deleteUserAttr`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: "删除成功" })
  },

  [`GET ${apiPrefix}/user/userAttr/getUserAttrValue`] (req, res) {
    let data = {}
    data.ret_code = 1

    data.ret_content = [{
      id: '1',
      value: '名称1',
      code: '代码1',
    }, {
      id: '2',
      value: '名称2',
      code: '代码2',
    }, {
      id: '3',
      value: '名称3',
      code: '代码3',
    }, {
      id: '5',
      value: '名称4',
      code: '代码4',
    },
    {
      id: '6',
      value: '名称5',
      code: '代码5',
    },
    ]

    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/user/userAttr/getAttrRelateList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = [{
      attrId: '1',
      relateId: '1',
      relateName: 'name1',
    }, {
      attrId: '2',
      relateId: '2',
      relateName: 'name2',
    }, {
      attrId: '3',
      relateId: '3',
      relateName: 'name3',
    },
    {
      attrId: '4',
      relateId: '4',
      relateName: 'name4',
    },
    {
      attrId: '5',
      relateId: '5',
      relateName: 'name5',
    },
    {
      attrId: '6',
      relateId: '6',
      relateName: 'name6',
    },
    ]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/user/userAttr/getAttrRelatePage`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {count:100}
    data.ret_content.data = [{
      attrId: '1',
      relateId: '1',
      relateName: 'name1',
    }, {
      attrId: '2',
      relateId: '2',
      relateName: 'name2',
    }, {
      attrId: '3',
      relateId: '3',
      relateName: 'name3',
    },
    {
      attrId: '4',
      relateId: '4',
      relateName: 'name4',
    },
    {
      attrId: '5',
      relateId: '5',
      relateName: 'name5',
    },
    {
      attrId: '6',
      relateId: '6',
      relateName: 'name6',
    },
    ]
    res.status(200).json(data)
  },


 

  [`GET ${apiPrefix}/user/userAccount/getUserInfo`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      id: '1',
      attrList: [{
        attrId: '1',
        relateId: '1',
        relateName: '清水河校区',
      }, {
        attrId: '2',
        relateId: '2',
        relateName: '计算机学院',
      }, {
        attrId: '3',
        relateId: '3',
        relateName: '计算机专业',
      }, {
        attrId: '4',
        relateId: '4',
        relateName: '一班',
      }, {
        attrId: '5',
        relateId: '5',
        relateName: '梁琦',
      },
      ],
    }
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/user/userAccount/getUserTransferInfo`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {count: '10'},
    data.ret_content.data = [
      {
        accountName: '经办人',
        createDate: '2018-05-01 10:25:26',
        recordList: [
            {
              type: '状态异动',
              beforeRecord: '调整前记录',
              afterRecord: '调整后记录',
            },
            {
              type: '班级异动',
              beforeRecord: '休学',
              afterRecord: '复学',
            }
        ],
        attrList: [{
            attrId: '2',
            relateId: '1',
            relateName: '清水河校区',
        },{
            attrId: '3',
            relateId: '2',
            relateName: '计算机专业',
        },{
            attrId: '5',
            relateId: '3',
            relateName: '奥威',
        },{
          attrId: '6',
          relateId: '4',
          relateName: '1556666600000',
      }]
    },{
      accountName: '经办人',
      createDate: '2018-05-01 10:25:26',
      recordList: [
          {
            type: '状态异动2',
            beforeRecord: '调整前记录',
            afterRecord: '调整后记录',
            
          },
          {
            type: '班级异动',
            beforeRecord: '休学',
            afterRecord: '复学',
          }
      ],
      attrList: [{
            attrId: '2',
            relateId: '1',
            relateName: '清水河校区',
          },{
            attrId: '3',
            relateId: '2',
            relateName: '计算机专业',
          },{
            attrId: '5',
            relateId: '3',
            relateName: '奥威',
          },{
            attrId: '6',
            relateId: '4',
            relateName: '1556666600000',
          }]
      },]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/user/userAccount/getUserList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: '30' }
    data.ret_content.data = [{
      id: '1',
      attrList: [{
        attrId: '1',
        relateId: '1',
        relateName: '清水河校区',
      }, {
        attrId: '2',
        relateId: '2',
        relateName: '计算机学院',
      }, {
        attrId: '3',
        relateId: '3',
        relateName: '计算机专业',
      }, {
        attrId: '4',
        relateId: '4',
        relateName: '一班',
      }, {
        attrId: '5',
        relateId: '5',
        relateName: '梁琦',
      },
      ],
    },
    {
      id: '2',
      attrList: [{
        attrId: '1',
        relateId: '1',
        relateName: '清水河校区',
      }, {
        attrId: '2',
        relateId: '2',
        relateName: '计算机学院',
      }, {
        attrId: '3',
        relateId: '3',
        relateName: '计算机专业',
      }, {
        attrId: '4',
        relateId: '4',
        relateName: '一班',
      }, {
        attrId: '5',
        relateId: '5',
        relateName: '敖炜',
      },
      ],
    },{
      id: '3',
      attrList: [{
        attrId: '1',
        relateId: '1',
        relateName: '清水河校区',
      }, {
        attrId: '2',
        relateId: '2',
        relateName: '计算机学院',
      }, {
        attrId: '3',
        relateId: '3',
        relateName: '计算机专业',
      }, {
        attrId: '4',
        relateId: '4',
        relateName: '一班',
      }, {
        attrId: '5',
        relateId: '5',
        relateName: '敖炜',
      },
      ],
    },{
      id: '4',
      attrList: [{
        attrId: '1',
        relateId: '1',
        relateName: '清水河校区',
      }, {
        attrId: '2',
        relateId: '2',
        relateName: '计算机学院',
      }, {
        attrId: '3',
        relateId: '3',
        relateName: '计算机专业',
      }, {
        attrId: '4',
        relateId: '4',
        relateName: '一班',
      }, {
        attrId: '5',
        relateId: '5',
        relateName: '敖炜',
      },
      ],
    },{
      id: '5',
      attrList: [{
        attrId: '1',
        relateId: '1',
        relateName: '清水河校区',
      }, {
        attrId: '2',
        relateId: '2',
        relateName: '计算机学院',
      }, {
        attrId: '3',
        relateId: '3',
        relateName: '计算机专业',
      }, {
        attrId: '4',
        relateId: '4',
        relateName: '一班',
      }, {
        attrId: '5',
        relateId: '5',
        relateName: '敖炜',
      },
      ],
    }
  ]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/user/userAccount/getUserOperate`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 16 }
    data.ret_content.data = [{
      userId: '1',
      snapshot: [{ attrId: '1', relateId: '0', relateName: '清水河校区' }, { attrId: '2', relateId: '0', relateName: '计算机学院' }],
      info: [{ attrId: '1', relateId: '1', relateName: '沙河校区' }, { attrId: '2', relateId: '1', relateName: '软件学院' }],
      accountId: '1',
      accountName: '财务科/LLL',
      createDate: '2018-05-01 10:25:26',
    }, {
      userId: '1',
      snapshot: '',
      info: [{ attrId: '1', relateId: '0', relateName: '2' }, { attrId: '1', relateId: '0', relateName: '2' }],
      accountId: '1',
      accountName: '财务科/LLL',
      createDate: '2018-05-01 10:25:25',
    }, {
      userId: '1',
      snapshot: [{ attrId: '1', relateId: '0', relateName: '清水河校区' }, { attrId: '2', relateId: '0', relateName: '计算机学院' }],
      accountId: '1',
      accountName: '财务科/LLL',
      createDate: '2018-05-01 10:25:26',
    }, {
      userId: '1',
      snapshot: '',
      info: [{ attrId: '1', relateId: '0', relateName: '2' }, { attrId: '1', relateId: '0', relateName: '2' }],
      accountId: '1',
      accountName: '财务科/LLL',
      createDate: '2018-05-01 10:25:25',
    }, {
      userId: '1',
      snapshot: [{ attrId: '1', relateId: '0', relateName: '清水河校区' }, { attrId: '2', relateId: '0', relateName: '计算机学院' }],
      info: [{ attrId: '1', relateId: '1', relateName: '沙河校区' }, { attrId: '2', relateId: '1', relateName: '软件学院' }],
      accountId: '1',
      accountName: '财务科/LLL',
      createDate: '2018-05-01 10:25:26',
    }, {
      userId: '1',
      snapshot: '',
      info: [{ attrId: '1', relateId: '0', relateName: '2' }, { attrId: '1', relateId: '0', relateName: '2' }],
      accountId: '1',
      accountName: '财务科/LLL',
      createDate: '2018-05-01 10:25:25',
    }, {
      userId: '1',
      snapshot: [{ attrId: '1', relateId: '0', relateName: '清水河校区' }, { attrId: '2', relateId: '0', relateName: '计算机学院' }],
      info: [{ attrId: '1', relateId: '1', relateName: '沙河校区' }, { attrId: '2', relateId: '1', relateName: '软件学院' }],
      accountId: '1',
      accountName: '财务科/LLL',
      createDate: '2018-05-01 10:25:26',
    }, {
      userId: '1',
      snapshot: '',
      info: [{ attrId: '1', relateId: '0', relateName: '2' }, { attrId: '1', relateId: '0', relateName: '2' }],
      accountId: '1',
      accountName: '财务科/LLL',
      createDate: '2018-05-01 10:25:25',
    }, {
      userId: '1',
      snapshot: [{ attrId: '1', relateId: '0', relateName: '清水河校区' }, { attrId: '2', relateId: '0', relateName: '计算机学院' }],
      info: [{ attrId: '1', relateId: '1', relateName: '沙河校区' }, { attrId: '2', relateId: '1', relateName: '软件学院' }],
      accountId: '1',
      accountName: '财务科/LLL',
      createDate: '2018-05-01 10:25:26',
    }, {
      userId: '1',
      snapshot: '',
      info: [{ attrId: '1', relateId: '0', relateName: '2' }, { attrId: '1', relateId: '0', relateName: '2' }],
      accountId: '1',
      accountName: '财务科/LLL',
      createDate: '2018-05-01 10:25:25',
    }, {
      userId: '1',
      snapshot: [{ attrId: '1', relateId: '0', relateName: '清水河校区' }, { attrId: '2', relateId: '0', relateName: '计算机学院' }],
      info: [{ attrId: '1', relateId: '1', relateName: '沙河校区' }, { attrId: '2', relateId: '1', relateName: '软件学院' }],
      accountId: '1',
      accountName: '财务科/LLL',
      createDate: '2018-05-01 10:25:26',
    }, {
      userId: '1',
      snapshot: '',
      info: [{ attrId: '1', relateId: '0', relateName: '2' }, { attrId: '1', relateId: '0', relateName: '2' }],
      accountId: '1',
      accountName: '财务科/LLL',
      createDate: '2018-05-01 10:25:25',
    }, {
      userId: '1',
      snapshot: [{ attrId: '1', relateId: '0', relateName: '清水河校区' }, { attrId: '2', relateId: '0', relateName: '计算机学院' }],
      info: [{ attrId: '1', relateId: '1', relateName: '沙河校区' }, { attrId: '2', relateId: '1', relateName: '软件学院' }],
      accountId: '1',
      accountName: '财务科/LLL',
      createDate: '2018-05-01 10:25:26',
    }, {
      userId: '1',
      snapshot: '',
      info: [{ attrId: '1', relateId: '0', relateName: '2' }, { attrId: '1', relateId: '0', relateName: '2' }],
      accountId: '1',
      accountName: '财务科/LLL',
      createDate: '2018-05-01 10:25:25',
    }, {
      userId: '1',
      snapshot: [{ attrId: '1', relateId: '0', relateName: '清水河校区' }, { attrId: '2', relateId: '0', relateName: '计算机学院' }],
      info: [{ attrId: '1', relateId: '1', relateName: '沙河校区' }, { attrId: '2', relateId: '1', relateName: '软件学院' }],
      accountId: '1',
      accountName: '财务科/LLL',
      createDate: '2018-05-01 10:25:26',
    }]
    res.status(200).json(data)
  },


  [`GET ${apiPrefix}/user/userAccount/importUserInfo`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = [{
      id: '1',
      example: '校区',
      source: '朝阳校区',
      attr: '校区',
      attrId: '1',
    }, {
      id: '2',
      example: '院系名称',
      source: '公共卫生系',
      attr: '院系名称',
      attrId: '2',
    },
    ]
    res.status(200).json(data)
  },

  [`POST ${apiPrefix}/user/userAccount/importConfirm`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/user/userAccount/coverUser`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`GET ${apiPrefix}/user/userAccount/importUserDelete`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = ""
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/user/userAccount/getImportPrs`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      cfNum: '100',
      cgNum: '855',
      wxNum: '55',
      status: '2',
      url: '/user?version=2018-04-05 11:23:23&versionType=2',
    }
    res.status(200).json(data)
  },

  [`POST ${apiPrefix}/user/userAttr/updateDisplayAttr`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/user/userAttr/deleteDisplayAttr`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/user/userAccount/updateUserInfo`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/user/userAccount/deleteUserInfo`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/school/school/updateSchool`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`GET ${apiPrefix}/school/school/getSchool`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      "id": "32",
      "name": "知校测试大学",
      "logo": null,
      "logoInfo": "",
      orderCancelTime: null,
      joinReview:'1',
      joinBill:'0',
      verifyPay:'1',
      fee_limit:'1',
      arrears_ignore: ['休学'],
    }
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/user`] (req, res) {
    const cookie = req.headers.cookie || ''
    const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' })
    const response = {}
    const user = {}
    if (!cookies.token) {
      res.status(200).send({ message: 'Not Login' })
      return
    }
    const token = JSON.parse(cookies.token)
    if (token) {
      response.success = token.deadline > new Date().getTime()
    }
    if (response.success) {
      const userItem = adminUsers.filter(_ => _.id === token.id)
      if (userItem.length > 0) {
        user.permissions = userItem[0].permissions
        user.username = userItem[0].username
        user.id = userItem[0].id
      }
    }
    response.user = user
    res.json(response)
  },

  [`GET ${apiPrefix}/users`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = database
    for (let key in other) {
      if ({}.hasOwnProperty.call(other, key)) {
        newData = newData.filter((item) => {
          if ({}.hasOwnProperty.call(item, key)) {
            if (key === 'address') {
              return other[key].every(iitem => item[key].indexOf(iitem) > -1)
            } else if (key === 'createTime') {
              const start = new Date(other[key][0]).getTime()
              const end = new Date(other[key][1]).getTime()
              const now = new Date(item[key]).getTime()

              if (start && end) {
                return now >= start && now <= end
              }
              return true
            }
            return String(item[key]).trim().indexOf(decodeURI(other[key]).trim()) > -1
          }
          return true
        })
      }
    }

    res.status(200).json({
      data: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
    })
  },

  [`DELETE ${apiPrefix}/users`] (req, res) {
    const { ids } = req.body
    database = database.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },


  [`POST ${apiPrefix}/user`] (req, res) {
    const newData = req.body
    newData.createTime = Mock.mock('@now')
    newData.avatar = newData.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newData.nickName.substr(0, 1))
    newData.id = Mock.mock('@id')

    database.unshift(newData)

    res.status(200).end()
  },

  [`GET ${apiPrefix}/user/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      res.status(200).json(data)
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`DELETE ${apiPrefix}/user/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      database = database.filter(item => item.id !== id)
      res.status(204).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`PATCH ${apiPrefix}/user/:id`] (req, res) {
    const { id } = req.params
    const editItem = req.body
    let isExist = false

    database = database.map((item) => {
      if (item.id === id) {
        isExist = true
        return Object.assign({}, item, editItem)
      }
      return item
    })

    if (isExist) {
      res.status(201).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },
}
