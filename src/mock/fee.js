const { config } = require('./common')

const { apiPrefix } = config

module.exports = {
  [`GET ${apiPrefix}/fee/feeMission/createBills`] (req, res) {
    res.status(200).json({
      ret_code: 1,
      ret_content: null,
    })
  },
  [`GET ${apiPrefix}/fee/feeMission/getCreateBillsPrs`] (req, res) {
    res.status(200).json({
      ret_code: 1,
      ret_content: { cgNum: '100' },
    })
  },

  [`GET ${apiPrefix}/fee/feeBill/getDeferredList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 20 }
    data.ret_content.data = [{
      id: '1',
      year:'2017',
      missionId:'1',
      missionName: '2018春季',
      accountName: '张三',
      userId: '1',
      subjectId:'1',
      subjectName: '书本费',
      lastDeferred: "0",
      deferred: "0",
      defReason:"贫困生",
      defTimeEnd:null,
      attrList: null,
      status:'0',
    },{
      id: '10',
      year:'2017',
      missionId:'1',
      missionName: '2018春季',
      accountName: '张三',
      userId: '1',
      subjectId:'1',
      subjectName: '书本费',
      lastDeferred: "0",
      deferred: "0",
      defReason:"贫困生",
      defTimeEnd:null,
      attrList: null,
      status:'0',
    },
    {
      id: '2',
      missionId:'2',
      missionName: '2018春季',
      accountName: '张三',
      userId: '2',
      subjectId:'2',
      subjectName: '书本费',
      lastDeferred: "10",
      deferred: "10",
      defReason:"贫困生",
      defTimeEnd:"2019-02-11 23:59:59",
      status:'1',
      subjectList: [{
        id: '1',
        subjectId: '1',
        subjectName: '学费',
        fee: '50000',
        totalFee: '50000',
        discount: '30000',
        disReason: null,
      }, {
        id: '2',
        subjectId: '2',
        subjectName: '教材费',
        fee: '50000',
        totalFee: '50000',
        discount: '30000',
        disReason: null,
      },
      {
        id: '3',
        subjectId: '3',
        subjectName: '军训费',
        fee: '50000',
        totalFee: '50000',
        discount: '30000',
        disReason: null,
      },

      ],
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
      year:'2017',
      missionId:'1',
      missionName: '2018春季',
      accountName: '张三',
      userId: '1',
      subjectId:'1',
      subjectName: '书本费',
      lastDeferred: "10",
      deferred: "10",
      defReason:"贫困生",
      defTimeEnd:"2018-02-11 23:59:59",
      status:'2',
      attrList: null,
    },]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/fee/feeBill/getDiscountList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 20 }
    data.ret_content.data = [{
      id: '1',
      year:'2017',
      missionId:'1',
      missionName: '2018春季',
      accountName: '张三',
      userId: '1',
      subjectId:'1',
      subjectName: '书本费',
      lastDiscount: "10",
      discount: "10",
      disReason:null,
      createDate:"",
      attrList: null,
      disStandId: '1'
    },
    {
      id: '2',
      missionId:'2',
      missionName: '2018春季',
      accountName: '张三',
      userId: '2',
      subjectId:'2',
      subjectName: '书本费',
      lastDiscount: "10",
      discount: "10",
      disReason:"贫困生",
      disTimeEnd:"",
      subjectList: [{
        id: '1',
        subjectId: '1',
        subjectName: '学费',
        fee: '50000',
        totalFee: '50000',
        discount: '30000',
        disReason: null,
      }, {
        id: '2',
        subjectId: '2',
        subjectName: '教材费',
        fee: '50000',
        totalFee: '50000',
        discount: '30000',
        disReason: null,
      },
      {
        id: '3',
        subjectId: '3',
        subjectName: '军训费',
        fee: '50000',
        totalFee: '50000',
        discount: '30000',
        disReason: null,
      },

      ],
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
      year:'2017',
      missionId:'1',
      missionName: '2018春季',
      accountName: '张三',
      userId: '1',
      subjectId:'1',
      subjectName: '书本费',
      lastDiscount: "10",
      discount: "10",
      disReason:"贫困生",
      createDate:"",
      attrList: null,
    },]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/fee/feeBill/getBillList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 20 }
    data.ret_content.data = [{
      id: '1',
      fee: '1000',
      totalFee: '10010',
      discount: '0',
      disReason: '',
      userId: '1',
      attrList: null,
    },
    {
      id: '2',
      fee: '5000',
      totalFee: '5000',
      discount: '1000',
      disReason: '贫困生',
      userId: '2',
      subjectList: [{
        id: '1',
        subjectId: '1',
        subjectName: '学费',
        fee: '50000',
        totalFee: '50000',
        discount: '30000',
        disReason: null,
      }, {
        id: '2',
        subjectId: '2',
        subjectName: '教材费',
        fee: '50000',
        totalFee: '50000',
        discount: '30000',
        disReason: null,
      },
      {
        id: '3',
        subjectId: '3',
        subjectName: '军训费',
        fee: '50000',
        totalFee: '50000',
        discount: '30000',
        disReason: null,
      },

      ],
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
    }]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/fee/feeBill/getFeeBillOperateHistory`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      "feeBillOperateHistoryList": {
        "count": "2",
        "data": [{
          "userId": "14830",
          "year": "2019",
          "subjectId": "1218",
          "subjectName": "学年标准学费",
          "missionId": "1656",
          "missionName": "学年缴费",
          "attrList": [{
            "relateName": "2020级",
            "attrId": "983",
            "relateId": "5860"
          }, {
            "relateName": "姓名123",
            "attrId": "968",
            "relateId": "null"
          }, {
            "relateName": "女",
            "attrId": "969",
            "relateId": "3874"
          }, {
            "relateName": "-09876",
            "attrId": "975",
            "relateId": "null"
          }, {
            "relateName": "34567",
            "attrId": "1000",
            "relateId": "null"
          }, {
            "relateName": "蒙古族",
            "attrId": "972",
            "relateId": "3889"
          }, {
            "relateName": "2020级",
            "attrId": "983",
            "relateId": "5860"
          }, {
            "relateName": "在读",
            "attrId": "994",
            "relateId": "4053"
          }, {
            "relateName": "admin(知校测试大学)",
            "attrId": "1292",
            "relateId": "null"
          }, {
            "relateName": "经济学",
            "attrId": "981",
            "relateId": "1105"
          }, {
            "relateName": "经济学院",
            "attrId": "980",
            "relateId": "1079"
          }, {
            "relateName": "南校区",
            "attrId": "979",
            "relateId": "1077"
          }, {
            "relateName": "123",
            "attrId": "966",
            "relateId": "null"
          }],
          "billId": null,
          "snapshot": "{\"status\":1}",
          "info": "{\"status\":0}",
          "accountId": "146",
          "accountName": "知校测试大学",
          "createDate": "2020-03-11 16:08:56",
          "mask": "0",
          "updateFee": "-10000"
        }, {
          "userId": "14830",
          "year": "2019",
          "subjectId": "1218",
          "subjectName": "学年标准学费",
          "missionId": "1656",
          "missionName": "学年缴费",
          "attrList": [{
            "relateName": "2020级",
            "attrId": "983",
            "relateId": "5860"
          }, {
            "relateName": "姓名123",
            "attrId": "968",
            "relateId": "null"
          }, {
            "relateName": "女",
            "attrId": "969",
            "relateId": "3874"
          }, {
            "relateName": "-09876",
            "attrId": "975",
            "relateId": "null"
          }, {
            "relateName": "34567",
            "attrId": "1000",
            "relateId": "null"
          }, {
            "relateName": "蒙古族",
            "attrId": "972",
            "relateId": "3889"
          }, {
            "relateName": "2020级",
            "attrId": "983",
            "relateId": "5860"
          }, {
            "relateName": "在读",
            "attrId": "994",
            "relateId": "4053"
          }, {
            "relateName": "admin(知校测试大学)",
            "attrId": "1292",
            "relateId": "null"
          }, {
            "relateName": "经济学",
            "attrId": "981",
            "relateId": "1105"
          }, {
            "relateName": "经济学院",
            "attrId": "980",
            "relateId": "1079"
          }, {
            "relateName": "南校区",
            "attrId": "979",
            "relateId": "1077"
          }, {
            "relateName": "123",
            "attrId": "966",
            "relateId": "null"
          }],
          "billId": null,
          "snapshot": "{\"totalFee\":10000}",
          "info": "{\"totalFee\":10000}",
          "accountId": "146",
          "accountName": "知校测试大学",
          "createDate": "2020-03-11 16:08:56",
          "mask": "1",
          "updateFee": "0"
        }, {
          "userId": "14830",
          "year": "2019",
          "subjectId": "1218",
          "subjectName": "学年标准学费",
          "missionId": "1656",
          "missionName": "学年缴费",
          "attrList": [{
            "relateName": "2020级",
            "attrId": "983",
            "relateId": "5860"
          }, {
            "relateName": "姓名123",
            "attrId": "968",
            "relateId": "null"
          }, {
            "relateName": "女",
            "attrId": "969",
            "relateId": "3874"
          }, {
            "relateName": "-09876",
            "attrId": "975",
            "relateId": "null"
          }, {
            "relateName": "34567",
            "attrId": "1000",
            "relateId": "null"
          }, {
            "relateName": "蒙古族",
            "attrId": "972",
            "relateId": "3889"
          }, {
            "relateName": "2020级",
            "attrId": "983",
            "relateId": "5860"
          }, {
            "relateName": "在读",
            "attrId": "994",
            "relateId": "4053"
          }, {
            "relateName": "admin(知校测试大学)",
            "attrId": "1292",
            "relateId": "null"
          }, {
            "relateName": "经济学",
            "attrId": "981",
            "relateId": "1105"
          }, {
            "relateName": "经济学院",
            "attrId": "980",
            "relateId": "1079"
          }, {
            "relateName": "南校区",
            "attrId": "979",
            "relateId": "1077"
          }, {
            "relateName": "123",
            "attrId": "966",
            "relateId": "null"
          }],
          "billId": null,
          "snapshot": null,
          "info": "{\"totalFee\":10000}",
          "accountId": "146",
          "accountName": "知校测试大学",
          "createDate": "2020-03-11 16:08:38",
          "mask": "1",
          "updateFee": "10000"
        }, {
          "userId": "14830",
          "year": "2020",
          "subjectId": "1228",
          "subjectName": "西北风",
          "missionId": "1776",
          "missionName": "招生账单",
          "attrList": [{
            "relateName": "2020级",
            "attrId": "983",
            "relateId": "5860"
          }, {
            "relateName": "姓名123",
            "attrId": "968",
            "relateId": "null"
          }, {
            "relateName": "女",
            "attrId": "969",
            "relateId": "3874"
          }, {
            "relateName": "-09876",
            "attrId": "975",
            "relateId": "null"
          }, {
            "relateName": "34567",
            "attrId": "1000",
            "relateId": "null"
          }, {
            "relateName": "蒙古族",
            "attrId": "972",
            "relateId": "3889"
          }, {
            "relateName": "2020级",
            "attrId": "983",
            "relateId": "5860"
          }, {
            "relateName": "在读",
            "attrId": "994",
            "relateId": "4053"
          }, {
            "relateName": "admin(知校测试大学)",
            "attrId": "1292",
            "relateId": "null"
          }, {
            "relateName": "经济学",
            "attrId": "981",
            "relateId": "1105"
          }, {
            "relateName": "经济学院",
            "attrId": "980",
            "relateId": "1079"
          }, {
            "relateName": "南校区",
            "attrId": "979",
            "relateId": "1077"
          }, {
            "relateName": "123",
            "attrId": "966",
            "relateId": "null"
          }],
          "billId": null,
          "snapshot": "{\"reason\":\"12\",\"totalFee\":2000}",
          "info": "{\"reason\":\"20\",\"totalFee\":2000}",
          "accountId": "146",
          "accountName": "知校测试大学",
          "createDate": "2020-03-11 15:46:03",
          "mask": "1",
          "updateFee": "0"
        }, {
          "userId": "14830",
          "year": "2020",
          "subjectId": "1228",
          "subjectName": "西北风",
          "missionId": "1776",
          "missionName": "招生账单",
          "attrList": [{
            "relateName": "2020级",
            "attrId": "983",
            "relateId": "5860"
          }, {
            "relateName": "姓名123",
            "attrId": "968",
            "relateId": "null"
          }, {
            "relateName": "女",
            "attrId": "969",
            "relateId": "3874"
          }, {
            "relateName": "-09876",
            "attrId": "975",
            "relateId": "null"
          }, {
            "relateName": "34567",
            "attrId": "1000",
            "relateId": "null"
          }, {
            "relateName": "蒙古族",
            "attrId": "972",
            "relateId": "3889"
          }, {
            "relateName": "2020级",
            "attrId": "983",
            "relateId": "5860"
          }, {
            "relateName": "在读",
            "attrId": "994",
            "relateId": "4053"
          }, {
            "relateName": "admin(知校测试大学)",
            "attrId": "1292",
            "relateId": "null"
          }, {
            "relateName": "经济学",
            "attrId": "981",
            "relateId": "1105"
          }, {
            "relateName": "经济学院",
            "attrId": "980",
            "relateId": "1079"
          }, {
            "relateName": "南校区",
            "attrId": "979",
            "relateId": "1077"
          }, {
            "relateName": "123",
            "attrId": "966",
            "relateId": "null"
          }],
          "billId": null,
          "snapshot": "{\"totalFee\":2000}",
          "info": "{\"reason\":\"12\",\"totalFee\":2000}",
          "accountId": "146",
          "accountName": "知校测试大学",
          "createDate": "2020-03-11 15:40:28",
          "mask": "1",
          "updateFee": "0"
        }, {
          "userId": "14830",
          "year": "2020",
          "subjectId": "1224",
          "subjectName": "装备费",
          "missionId": "1776",
          "missionName": "招生账单",
          "attrList": [{
            "relateName": "2020级",
            "attrId": "983",
            "relateId": "5860"
          }, {
            "relateName": "姓名123",
            "attrId": "968",
            "relateId": "null"
          }, {
            "relateName": "女",
            "attrId": "969",
            "relateId": "3874"
          }, {
            "relateName": "-09876",
            "attrId": "975",
            "relateId": "null"
          }, {
            "relateName": "34567",
            "attrId": "1000",
            "relateId": "null"
          }, {
            "relateName": "蒙古族",
            "attrId": "972",
            "relateId": "3889"
          }, {
            "relateName": "2020级",
            "attrId": "983",
            "relateId": "5860"
          }, {
            "relateName": "在读",
            "attrId": "994",
            "relateId": "4053"
          }, {
            "relateName": "admin(知校测试大学)",
            "attrId": "1292",
            "relateId": "null"
          }, {
            "relateName": "经济学",
            "attrId": "981",
            "relateId": "1105"
          }, {
            "relateName": "经济学院",
            "attrId": "980",
            "relateId": "1079"
          }, {
            "relateName": "南校区",
            "attrId": "979",
            "relateId": "1077"
          }, {
            "relateName": "123",
            "attrId": "966",
            "relateId": "null"
          }],
          "billId": null,
          "snapshot": "{\"disAccountId\":146,\"disReason\":\"12\",\"discount\":1200}",
          "info": "{\"disAccountId\":146,\"disReason\":\"3\",\"discount\":1500}",
          "accountId": "146",
          "accountName": "知校测试大学",
          "createDate": "2020-02-28 12:53:46",
          "mask": "2",
          "updateFee": "300"
        }, {
          "userId": "14830",
          "year": "2020",
          "subjectId": "1224",
          "subjectName": "装备费",
          "missionId": "1776",
          "missionName": "招生账单",
          "attrList": [{
            "relateName": "2020级",
            "attrId": "983",
            "relateId": "5860"
          }, {
            "relateName": "姓名123",
            "attrId": "968",
            "relateId": "null"
          }, {
            "relateName": "女",
            "attrId": "969",
            "relateId": "3874"
          }, {
            "relateName": "-09876",
            "attrId": "975",
            "relateId": "null"
          }, {
            "relateName": "34567",
            "attrId": "1000",
            "relateId": "null"
          }, {
            "relateName": "蒙古族",
            "attrId": "972",
            "relateId": "3889"
          }, {
            "relateName": "2020级",
            "attrId": "983",
            "relateId": "5860"
          }, {
            "relateName": "在读",
            "attrId": "994",
            "relateId": "4053"
          }, {
            "relateName": "admin(知校测试大学)",
            "attrId": "1292",
            "relateId": "null"
          }, {
            "relateName": "经济学",
            "attrId": "981",
            "relateId": "1105"
          }, {
            "relateName": "经济学院",
            "attrId": "980",
            "relateId": "1079"
          }, {
            "relateName": "南校区",
            "attrId": "979",
            "relateId": "1077"
          }, {
            "relateName": "123",
            "attrId": "966",
            "relateId": "null"
          }],
          "billId": null,
          "snapshot": "{\"discount\":0}",
          "info": "{\"disAccountId\":146,\"disReason\":\"12\",\"discount\":1200}",
          "accountId": "146",
          "accountName": "知校测试大学",
          "createDate": "2020-02-28 12:53:20",
          "mask": "2",
          "updateFee": "1200"
        }, {
          "userId": "14830",
          "year": "2020",
          "subjectId": "1228",
          "subjectName": "西北风",
          "missionId": "1776",
          "missionName": "招生账单",
          "attrList": [{
            "relateName": "2020级",
            "attrId": "983",
            "relateId": "5860"
          }, {
            "relateName": "姓名123",
            "attrId": "968",
            "relateId": "null"
          }, {
            "relateName": "女",
            "attrId": "969",
            "relateId": "3874"
          }, {
            "relateName": "-09876",
            "attrId": "975",
            "relateId": "null"
          }, {
            "relateName": "34567",
            "attrId": "1000",
            "relateId": "null"
          }, {
            "relateName": "蒙古族",
            "attrId": "972",
            "relateId": "3889"
          }, {
            "relateName": "2020级",
            "attrId": "983",
            "relateId": "5860"
          }, {
            "relateName": "在读",
            "attrId": "994",
            "relateId": "4053"
          }, {
            "relateName": "admin(知校测试大学)",
            "attrId": "1292",
            "relateId": "null"
          }, {
            "relateName": "经济学",
            "attrId": "981",
            "relateId": "1105"
          }, {
            "relateName": "经济学院",
            "attrId": "980",
            "relateId": "1079"
          }, {
            "relateName": "南校区",
            "attrId": "979",
            "relateId": "1077"
          }, {
            "relateName": "123",
            "attrId": "966",
            "relateId": "null"
          }],
          "billId": null,
          "snapshot": null,
          "info": "{\"totalFee\":2000}",
          "accountId": "146",
          "accountName": "知校测试大学",
          "createDate": "2020-02-27 20:09:44",
          "mask": "1",
          "updateFee": "2000"
        }, {
          "userId": "14830",
          "year": "2020",
          "subjectId": "1224",
          "subjectName": "装备费",
          "missionId": "1776",
          "missionName": "招生账单",
          "attrList": [{
            "relateName": "2020级",
            "attrId": "983",
            "relateId": "5860"
          }, {
            "relateName": "姓名123",
            "attrId": "968",
            "relateId": "null"
          }, {
            "relateName": "女",
            "attrId": "969",
            "relateId": "3874"
          }, {
            "relateName": "-09876",
            "attrId": "975",
            "relateId": "null"
          }, {
            "relateName": "34567",
            "attrId": "1000",
            "relateId": "null"
          }, {
            "relateName": "蒙古族",
            "attrId": "972",
            "relateId": "3889"
          }, {
            "relateName": "2020级",
            "attrId": "983",
            "relateId": "5860"
          }, {
            "relateName": "在读",
            "attrId": "994",
            "relateId": "4053"
          }, {
            "relateName": "admin(知校测试大学)",
            "attrId": "1292",
            "relateId": "null"
          }, {
            "relateName": "经济学",
            "attrId": "981",
            "relateId": "1105"
          }, {
            "relateName": "经济学院",
            "attrId": "980",
            "relateId": "1079"
          }, {
            "relateName": "南校区",
            "attrId": "979",
            "relateId": "1077"
          }, {
            "relateName": "123",
            "attrId": "966",
            "relateId": "null"
          }],
          "billId": null,
          "snapshot": null,
          "info": "{\"totalFee\":100000}",
          "accountId": "146",
          "accountName": "知校测试大学",
          "createDate": "2020-02-27 20:09:44",
          "mask": "1",
          "updateFee": "100000"
        }]
      },
      "count": "2",
      "updateFeeSum": "1000"
    }
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/fee/feeBill/getMissionByUser`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = 
    // [{
    //   id: '1',
    //   name: '2018春收',
    //   totalFee: '400',
    //   discount: '0',
    //   paidFee: '10',
    //   templateCode: '1004',
    //   loans:null,
    //   year:'2017',
    //   refund: '310',
    //   feeBillLists: [
    //     {
    //       id: '1',
    //       subjectName: '学费',
    //       paidFee: '5',
    //       subCode:'001',
    //       totalFee:'200',
    //       discount:null,
    //       isDefault:'1',
    //       isRequired:"1",
    //       loans:null,
    //       refund:'10',
    //       deferred: "1",
    //       defPast: "0",
    //       subjectId: "1",
    //       disStandId: "1",
    //       defStandId: "1",
    //     }, {
    //       id: '2',
    //       subjectName: '学费2',
    //       paidFee: '5',
    //       subCode:'001',
    //       totalFee:'200',
    //       discount:null,
    //       isDefault:'1',
    //       isRequired:"1",
    //       loans:null,
    //       refund:'300',
    //       deferred: "0",
    //       subjectId: "1",
    //       disStandId: "1",
    //       defStandId: "1",
    //     }
    //   ],
    // },{
    //   id: '2',
    //   name: '2017春收',
    //   totalFee: '100',
    //   discount: '1',
    //   paidFee: '5',
    //   loans: '10',
    //   year:'2018',
    //   refund:'10',
    //   feeBillLists: [{
    //     id: '3',
    //     subjectName: '教材费',
    //     paidFee: '5',
    //     subCode:'002',
    //     totalFee:'100',
    //     discount:"1",
    //     isRequired:"1",
    //     loans:'0',
    //     refund:'10',
    //     deferred: '80',
    //     defPast:'1',
    //     subjectId: "2",
    //   }],
    // },{
    //   id: '3',
    //   name: '2016春收',
    //   totalFee: '100',
    //   discount: '1',
    //   paidFee: '5',
    //   loans: '10',
    //   refund:'10',
    //   feeBillLists: [{
    //     id: '4',
    //     subjectName: '教材费',
    //     paidFee: '5',
    //     subCode:'002',
    //     totalFee:'100',
    //     discount:"1",
    //     isRequired:"1",
    //     loans:'0',
    //     refund:'10',
    //     deferred: '80',
    //     defPast:'1',
    //     subjectId: "2",
    //   }],
    // }]
    [{
      "id": "1744",
      "name": "电子科技大学2019学年收费",
      "status": "1",
      "beginDate": "2019-11-01 00:00:00",
      "endDate": "2019-11-30 23:59:59",
      "totalFee": "2222200",
      'exceedFee': '12234455',
      "discount": "0",
      "paidFee": "222200",
      "templateCode": "4",
      "refund": "0",
      "loans": null,
      "year": "2019",
      "feeBillLists": [{
        "id": "337978",
        "subjectId": "1",
        "missionId": "1744",
        "subjectName": "水费",
        "fee": "2222200",
        "totalFee": "2222200",
        "discount": "0",
        "refund": "0",
        "loans": null,
        "disReason": null,
        "userId": "14373",
        "paidFee": "222200",
        "isRequired": "0",
        "isDefault": "2",
        "allowModify": "0",
        "deferred": "0",
        "defTimeEnd": null,
        "defReason": null,
        "disStandId": '1',
        "defStandId": '1',
        "feeDeferredStandList": null,
        "enableReceipt": null,
        "attrList": null,
        "defPast": "0"
      }]
    }, {
      "id": "1732",
      "name": "925",
      "status": "1",
      "beginDate": null,
      "endDate": null,
      "totalFee": "222200",
      "discount": "0",
      "paidFee": "444400",
      "templateCode": "4",
      "refund": "0",
      "loans": null,
      "year": "2019",
      "feeBillLists": [{
        "id": "337993",
        "subjectId": "2",
        "missionId": "1732",
        "subjectName": "器材费",
        "fee": "222200",
        "totalFee": "222200",
        "discount": "0",
        "refund": "0",
        "loans": null,
        "disReason": null,
        "userId": "14373",
        "paidFee": "444400",
        "isRequired": "1",
        "isDefault": "1",
        "allowModify": "0",
        "deferred": "0",
        "defTimeEnd": null,
        "defReason": null,
        "disStandId": '1',
        "defStandId": '1',
        "feeDeferredStandList": null,
        "enableReceipt": null,
        "attrList": null,
        "defPast": "0"
      }]
    }]
    res.status(200).json(data)
  },

  [`POST ${apiPrefix}/fee/feeBill/completeOrder`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`GET ${apiPrefix}/fee/feeBill/getOrderByUser`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = [{
      id: '1',
      missionId:'1',
      orderNo: '1516363147990615',
      fee: '1000',
      payType: '2',
      timeEnd: '2018-02-08 00:00:00',
      templateCode: "1111",
      status:'5',
      remark:'世界点点滴滴',
      printType:'bssssss',
      accountId: "146",
      accountName: "知校测试大学",
      rateFee:"33",
      feeBillLists: [
        {
          id: '1',
          subjectName: '学费',
          paidFee: '500',
          subCode:'001',
          totalFee:'2000',
          subjectId:'1',
          receiptNo: '638297800',
          downUrl:"http://www.baidu.com",
        }, {
          id: '2',
          subjectName: '教材费',
          paidFee: '500',
          subCode:'002',
          totalFee:'1000',
          subjectId:'2'
        },
      ],
      orderOperateList: [{
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark":'sdfsdfl',
        "createDate": "2019-09-26 15:36:46",
        "mask": "2"
      }, {
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": "cscsc",
        "createDate": "2019-09-29 18:06:05",
        "mask": "4"
      }],
    },
    {
      id: '2',
      missionId:'1',
      orderNo: '1516363147990616',
      fee: '1000',
      payType: '2',
      receiptPrintId: '1',
      receiptNo: '638297801',
      timeEnd: '2018-02-08 00:00:00',
      templateCode: '201',
      status:'0',
      printType:'bs',
      accountId: "146",
      accountName: "知校测试大学",
      feeBillLists: [
        {
          id: '1',
          subjectName: '学费',
          paidFee: '500',
          subCode:'001',
          totalFee:'2000',
          receiptNo: '638297801',
          downUrl:"http://www.baidu.com",
          subjectId:'1'
        },
        {
          id: '2',
          subjectName: '学sdfsd费',
          paidFee: '500',
          subCode:'001',
          totalFee:'2000',
          receiptNo: '638297801',
          downUrl:"http://www.baidu.com",
          subjectId:'1'
        },
      ],
      orderOperateList: [{
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark":'sdfsdfl',
        "createDate": "2019-09-26 15:36:46",
        "mask": "2"
      }, {
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": null,
        "createDate": "2019-09-29 18:06:05",
        "mask": "1"
      }],
    },
    {
      id: '3',
      missionId:'1',
      orderNo: '1516362343147990616',
      fee: '13000',
      payType: '2',
      receiptPrintId: '1',
      receiptNo: '638235497801',
      timeEnd: '2018-02-08 00:00:00',
      templateCode: '201',
      status:'4',
      printType:'bs',
      accountId: "146",
      accountName: "知校测试大学",
      feeBillLists: [
        {
          id: '1',
          subjectName: '学sdf费',
          paidFee: '500',
          subCode:'001',
          totalFee:'2000',
          receiptNo: '63829347801',
          downUrl:"http://www.baidu.com",
          subjectId:'1'
        },
      ],
      orderOperateList: [{
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark":'sdfsdfl',
        "createDate": "2019-09-26 15:36:46",
        "mask": "2"
      }, {
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": null,
        "createDate": "2019-09-29 18:06:05",
        "mask": "1"
      }],
    },
    {
      id: '4',
      missionId:'1',
      orderNo: '151636990616',
      fee: '10800',
      payType: '5',
      receiptPrintId: '1',
      //receiptNo: '638292347801',
      timeEnd: '2018-02-08 00:00:00',
      templateCode: '201',
      status:'2',
      printType:'',
      accountId: "146",
      accountName: "知校测试大学",
      feeBillLists: [
        {
          id: '1',
          subjectName: '学gfg费',
          paidFee: '500',
          subCode:'001',
          totalFee:'2000',
          //receiptNo: '638223497801',
          downUrl:"http://www.baidu.com",
          subjectId:'1'
        },
      ],
      orderOperateList: [{
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark":'sdfsdfl',
        "createDate": "2019-09-26 15:36:46",
        "mask": "2"
      }, {
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": null,
        "createDate": "2019-09-29 18:06:05",
        "mask": "1"
      }],
    },
    {
      id: '5',
      missionId:'1',
      orderNo: '151636990616',
      fee: '10800',
      payType: '4',
      receiptPrintId: '1',
      //receiptNo: '638292347801',
      timeEnd: '2018-02-08 00:00:00',
      templateCode: '201',
      status:'5',
      printType:'',
      accountId: "146",
      accountName: "知校测试大学",
      feeBillLists: [
        {
          id: '1',
          subjectName: '学富费',
          paidFee: '500',
          subCode:'001',
          totalFee:'2000',
          //receiptNo: '638223497801',
          downUrl:"http://www.baidu.com",
          subjectId:'1'
        },
      ],
      orderOperateList: [{
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark":'sdfsdfl',
        "createDate": "2019-09-26 15:36:46",
        "mask": "2"
      }, {
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": null,
        "createDate": "2019-09-29 18:06:05",
        "mask": "1"
      }],
    },
    // },{
    //   id: '5',
    //   missionId:'1',
    //   orderNo: '1516363147990619',
    //   fee: '1000',
    //   payType: '2',
    //   receiptPrintId: '1',
    //   receiptNo: '638297801',
    //   timeEnd: '2018-02-08 00:00:00',
    //   templateCode: '201',
    //   feeBillLists: [
    //     {
    //       id: '1',
    //       subjectName: '学费',
    //       paidFee: '500',
    //       subCode:'001',
    //       totalFee:'2000',
    //       receiptNo: '638297801',
    //     }, {
    //       id: '2',
    //       subjectName: '教材费',
    //       paidFee: '500',
    //       subCode:'002',
    //       totalFee:'1000',
    //       receiptNo: '638297801',
    //     },
    //   ],
    // },{
    //   id: '6',
    //   missionId:'1',
    //   orderNo: '1516363147990620',
    //   fee: '1000',
    //   payType: '2',
    //   receiptPrintId: '1',
    //   receiptNo: '638297801',
    //   timeEnd: '2018-02-08 00:00:00',
    //   templateCode: '201',
    //   feeBillLists: [
    //     {
    //       id: '1',
    //       subjectName: '学费',
    //       paidFee: '500',
    //       subCode:'001',
    //       totalFee:'2000',
    //       receiptNo: '638297801',
    //     }, {
    //       id: '2',
    //       subjectName: '教材费',
    //       paidFee: '500',
    //       subCode:'002',
    //       totalFee:'1000',
    //       receiptNo: '638297801',
    //     },
    //   ],
    //  },
  ]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/fee/feeBill/getOrderReturnByUser`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = [{
      id: '1',
      missionId:'1',
      orderNo: '1516363147990615',
      fee: '1000',
      payType: '2',
      timeEnd: '2018-02-08 00:00:00',
      status:'6',
      accountId: "146",
      accountName: "知校测试大学",
      feeBillLists: [
        {
          id: '1',
          subjectName: '学费',
          paidFee: '500',
          subCode:'001',
          totalFee:'2000',
        }, {
          id: '2',
          subjectName: '教材费',
          paidFee: '500',
          subCode:'002',
          totalFee:'1000'
        },
      ],
      "orderOperateList": [{
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark":'sdfsdfl',
        "createDate": "2019-09-26 15:36:46",
        "mask": "4"
      }, {
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": "cscsc",
        "createDate": "2019-09-29 18:06:05",
        "mask": "2"
      }],
    },
    {
      id: '2',
      missionId:'1',
      orderNo: '1516363147990616',
      fee: '1000',
      payType: '2',
      receiptPrintId: '1',
      receiptNo: '638297801',
      timeEnd: '2018-02-08 00:00:00',
      templateCode: '201',
      status:'0',
      accountId: "146",
      accountName: "知校测试大学",
      feeBillLists: [
        {
          id: '1',
          subjectName: '学费',
          paidFee: '500',
          subCode:'001',
          totalFee:'2000',
          receiptNo: '638297801',
        },
      ],
      "orderOperateList": [{
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark":'sdfsdfl',
        "createDate": "2019-09-26 15:36:46",
        "mask": "1"
      }, {
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": "cscsc",
        "createDate": "2019-09-29 18:06:05",
        "mask": "4"
      }],
    },
    {
      id: '3',
      missionId:'1',
      orderNo: '151637867890616',
      fee: '2000',
      payType: '2',
      receiptPrintId: '1',
      receiptNo: '638297801',
      timeEnd: '2018-02-08 00:00:00',
      templateCode: '201',
      status:'5',
      accountId: "146",
      accountName: "知校测试大学",
      feeBillLists: [
        {
          id: '1',
          subjectName: '学费',
          paidFee: '500',
          subCode:'001',
          totalFee:'2000',
          receiptNo: '638297801',
        },
      ],
      "orderOperateList": [{
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark":'sdfsdfl',
        "createDate": "2019-09-26 15:36:46",
        "mask": "2"
      }, {
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": null,
        "createDate": "2019-09-29 18:06:05",
        "mask": "1"
      }],
    },
    {
      id: '4',
      missionId:'1',
      orderNo: '1516361234245345',
      fee: '3000',
      payType: '2',
      receiptPrintId: '1',
      receiptNo: '638297801',
      timeEnd: '2018-02-08 00:00:00',
      templateCode: '201',
      status:'4',
      accountId: "146",
      accountName: "知校测试大学",
      feeBillLists: [
        {
          id: '1',
          subjectName: '学费',
          paidFee: '500',
          subCode:'001',
          totalFee:'2000',
          receiptNo: '638297801',
        },
      ],
    },
    {
      id: '5',
      missionId:'1',
      orderNo: '15163612323',
      fee: '4000',
      payType: '2',
      receiptPrintId: '1',
      receiptNo: '638297801',
      timeEnd: '2018-02-08 00:00:00',
      templateCode: '201',
      status:'2',
      accountId: "146",
      accountName: "知校测试大学",
      feeBillLists: [
        {
          id: '1',
          subjectName: '学费',
          paidFee: '500',
          subCode:'001',
          totalFee:'2000',
          receiptNo: '638297801',
        },
      ],
    },
  ]
  res.status(200).json(data)
  },

  [`GET ${apiPrefix}/fee/feeBill/getBills`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 1000 }
    data.ret_content.data = [{
      userId: '1',
      type:'1',
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
      feeBillListEntities: [
        {
          id: '3',
          subjectId: '3',
          subjectName: '军训费',
          fee: '50000',
          arrears: '234234',
          totalFee: '50000',
          discount: '0',
          disReason: null,
          paidFee: '0',
          exceedFee: '10',
          loans:'0',
          status:'1',
          refund:'0',
          deferred: '0',
          year:'2017',
          missionId: '1',
          missionName: '2018春收',
        },
        {
          id: '1',
          subjectId: '1',
          subjectName: '学费',
          fee: '50000',
          totalFee: '50000',
          discount: '0',
          disReason: null,
          paidFee: '0',
          loans:'0',
          status:'1',
          refund:'0',
          deferred: '0',
          year:'2017',
          missionId: '1',
          missionName: '2018春收',
          disStandId: '1',
          defStandId: '1',
        },

      ],
    },
    {
      userId: '2',
      type:'0',
      feeBillListEntities: [{
        id: '9',
        subjectId: '1',
        subjectName: '学费',
        fee: '50000',
        totalFee: '50000',
        discount: '30000',
        disReason: null,
        paidFee: '20000',
        loans:'10000',
        status:'1',
        refund:'200',
        year:'2017',
        missionId: '1',
        missionName: '2018春收'
      },
      {
        id: '10',
        subjectId: '2',
        subjectName: '教材费',
        fee: '50000',
        totalFee: '50000',
        discount: '30000',
        disReason: null,
        paidFee: '20000',
        loans:'10000',
        status:'0',
        refund:'0',
        year:'2017',
        missionId: '1',
        missionName: '2018春收'
      },
      {
        id: '11',
        subjectId: '3',
        subjectName: '军训费',
        fee: '50000',
        totalFee: '50000',
        discount: '30000',
        disReason: null,
        paidFee: '20000',
        loans:'10000',
        status:'1',
        refund:'200',
        year:'2017',
        missionId: '1',
        missionName: '2018春收'
      },

      ],
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
    }]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/fee/feeBill/getBillStatistics`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      totalFeeSum: '100000',
      totalFeeCount: '200',
      discountSum: '1000',
      discountCount: '20',
      paidFeeSum: '100000',
      paidFeeCount: '100',
      arrearsSum: '22000',
      arrearsCount: '200',
      refundSum: '22000',
      refundCount: '200',
      exceedFeeSum: '100',
      exceedFeeCount: '5',
      convertFeeSum: '234534'
    }
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/fee/feeBill/getBillByUser`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = [{
      id: '1',
      subjectId: '1',
      subjectName: '收钱1',
      fee: '444444',
      totalFee: '444444',
      discount: 9999,
      disReason: '',
    },
    {
      id: '2',
      subjectId: '2',
      subjectName: '收钱2',
      fee: '9010',
      totalFee: '10010',
      discount: '1000',
      disReason: '贫困生',
    }]
    res.status(200).json(data)
  },

  [`POST ${apiPrefix}/fee/feeMission/updateMissionStatus`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/fee/feeMission/updateMission`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/fee/feeMission/addMission`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: "试试试试试试" })
  },

  [`POST ${apiPrefix}/fee/feeSubject/updateSubject`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/fee/feeSubject/addSubject`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/fee/feeSubject/deleteSubject`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/fee/feeRule/updateRule`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: "8888888" })
  },

  [`POST ${apiPrefix}/fee/feeRule/updateRuleStand`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: "8888888" })
  },
  [`POST ${apiPrefix}/fee/feeRule/updateFeeRuleAttr`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: "8888888" })
  },
  [`POST ${apiPrefix}/fee/feeRule/updateDeferredStand`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: "8888888" })
  },

  [`POST ${apiPrefix}/fee/feeRule/addDeferredStand`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: "8888888" })
  },

  [`POST ${apiPrefix}/fee/feeRule/updateDiscountStand`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: "8888888" })
  },

  [`POST ${apiPrefix}/fee/feeRule/addDiscountStand`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: "8888888" })
  },

  [`POST ${apiPrefix}/fee/feeRule/copyRuleStand`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: "8888888" })
  },

  [`POST ${apiPrefix}/fee/feeBill/updateBill`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/fee/feeBill/updateBatchDiscountBill`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/fee/feeBill/updateBatchBill`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/fee/feeBill/updateBatchDeferredBill`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/fee/feeBill/addBatchBill`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/fee/feeRule/delectRuleStand`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`GET ${apiPrefix}/fee/feeBill/importBillDelete`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = ""
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/fee/feeSubject/getSubjectList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 20 }
    data.ret_content.data = [{
      id: '1',
      name: '学分学费',
      createDate: '2018-01-11 14:08:23',
      status: '1',
      accountName: '财务部门',
      type: '1',
      code: '101',
      departId: '21',
      departName: '财务部门',
      templateId: '2',
      templateName:'四川省中小学、大中专院校专用票据',
      mchId:'1',
      mchName:'学费户',
      subType:'2',
      info:"{\"代开标志\":\"自开\",\"销货方识别号\":28176786897,\"销货方名称\":\"四川大学锦城学院\",\"销货方地址\":\"四川省成都市武侯区科华南路19号\",\"销货方电话\":27689866176867,\"销货方银行账号\":27689866176867,\"复核人\":\"张勤\",\"税率\":0.17}"
    },
    {
      id: '4',
      name: '水电费水电费',
      createDate: '2018-01-电风扇水电费 14:08:23',
      status: '4',
      accountName: '撒的发生的',
      type: '1',
      code: '101',
      departId: '21',
      departName: '双方都',
      templateId: '2',
      templateName:'撒的发生的',
      mchId:'1',
      mchName:'水电费',
      subType:'1',
      subType:'1'
    },
    {
      id: '2',
      name: '教材费',
      createDate: '2018-01-11 14:08:23',
      status: '2',
      accountName: '军训部门',
      type: '2',
      code: '102',
      departId: '22',
      departName: '军训部门',
      templateId: '2',
      templateName:'四川省中小学、大中专院校专用票据',
      mchId:'1',
      mchName:'学费户',
      subType:'1'
    },
    {
      id: '3',
      name: '军训费',
      createDate: '2018-01-11 14:08:23',
      status: '2',
      accountName: '军训部门',
      type: '2',
      code: '102',
      departId: '22',
      departName: '军训部门',
      mchId:'1',
      mchName:'学费户',
      subType:'1'
    },
    ]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/fee/feeSubject/getSubjectByMissId`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = [{
      subjectId:'1',
      subjectName:'学费',
      missionId:'1',
      missionName:'2018春收',
      year:'2017',
    },
    {
      subjectId:'2',
      subjectName:'教材费',
      missionId:'1',
      missionName:'2018春收',
      year:'2017',
    },
    {
      subjectId:'3',
      subjectName:'军训费',
      missionId:'1',
      missionName:'2018春收',
      year:'2017',
    },{
      subjectId:'1',
      subjectName:'学费',
      missionId:'2',
      missionName:'2017秋收',
      year:'2017',
    },{
      subjectId:'1',
      subjectName:'学费',
      missionId:'2',
      missionName:'2017秋收',
      year:'2017',
    },{
      subjectId:'1',
      subjectName:'学费',
      missionId:'2',
      missionName:'2017秋收',
      year:'2017',
    },{
      subjectId:'1',
      subjectName:'学费',
      missionId:'2',
      missionName:'2017秋收',
      year:'2017',
    },{
      subjectId:'1',
      subjectName:'学费',
      missionId:'2',
      missionName:'2017秋收',
      year:'2017',
    },{
      subjectId:'1',
      subjectName:'学费',
      missionId:'2',
      missionName:'2017秋收',
      year:'2017',
    },{
      subjectId:'1',
      subjectName:'学费',
      missionId:'2',
      missionName:'2017秋收',
      year:'2017',
    },{
      subjectId:'1',
      subjectName:'学费',
      missionId:'2',
      missionName:'2017秋收',
      year:'2017',
    },{
      subjectId:'1',
      subjectName:'学费',
      missionId:'2',
      missionName:'2017秋收',
      year:'2017',
    },{
      subjectId:'1',
      subjectName:'学费',
      missionId:'2',
      missionName:'2017秋收',
      year:'2017',
    },{
      subjectId:'1',
      subjectName:'学费',
      missionId:'2',
      missionName:'2017秋收',
      year:'2017',
    },
    ]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/fee/feeMission/getMissionList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 20 }
    data.ret_content.data = [{
      id: '1',
      name: '2018年春收',
      createDate: '2018-01-11 14:08:23',
      beginDate: '2018-01-11 14:08:23',
      endDate: '2018-01-11 14:08:23',
      status: '1',
      templateId: '1',
      templateName: '四川省政府非税收入通用票据',
      acountId: '1',
      acountName: '财务处 / AAA@puk',
      chargeId: '2',
      chargeName: '财务处 / AAA@puk',
      subjectList: '1,2',
      enableReceipt: '1',
      year:"2017",
      departName:'财务处'
    },
    {
      id: '2',
      name: '2017年秋收',
      createDate: '2018-01-11 14:08:23',
      beginDate: '2018-01-11 14:08:23',
      endDate: '2018-01-11 14:08:23',
      status: '1',
      templateId: '1',
      templateName: '四川省中小学、大中专院校专用票据',
      acountId: '1',
      acountName: '收费科 /  BBB@puk',
      chargeId: '1',
      chargeName: '财务处 / AAA@puk',
      subjectList: '',
      enableReceipt: '0',
    }, {
      id: '24',
      name: '2017年秋收',
      createDate: '2018-01-11 14:08:23',
      beginDate: '2018-01-11 14:08:23',
      endDate: '2018-01-11 14:08:23',
      status: '4',
      templateId: '1',
      templateName: '四川省中小学、大中专院校专用票据',
      acountId: '1',
      acountName: '收费科 /  BBB@puk',
      chargeId: '1',
      chargeName: '财务处 / AAA@puk',
      subjectList: '',
      enableReceipt: '0',
    }]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/fee/feeMission/getMissionById`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      id: '1',
      name: '2018年春收',
      createDate: '2018-01-11 14:08:23',
      beginDate: '2018-01-11 14:08:23',
      endDate: '2018-01-11 14:08:23',
      // beginDate: null,
      // endDate: null,
      status: '4',
      templateId: '11',
      templateName: '四川省政府非税收入通用票据',
      templateCode: '2000462',
      // templateId: null,
      // templateName: null,
      acountId: '1',
      acountName: '财务处 / AAA@puk',
      chargeId: '2',
      chargeName: '财务处 / AAA@puk',
      //subjectList: '1,2',
      subjectList: [
        {
          id:'1',
          name:'学分学费',
          subType:'2',
          isRequired:'1',
          isDefault:'2',
          allowModify:'1',
          allowDeferred:'1',
          modifyMin:'200000',
          modifyStep:'100000',
          userShowName:'学杂费',
          userShowStatus:'1',
          remark: '收费时段',
        },
        {
          id:'4',
          name:'水电费水电费',
          subType:'1',
          isRequired:'0',
          isDefault:'1',
          allowModify:'1',
          allowDeferred:'1',
          modifyMin: null,
          modifyStep:null,
        },
        {
          id:'3',
          name:'军训费',
          subType:'1',
          isRequired:'0',
          isDefault:'1',
          allowModify:'1',
          allowDeferred:'1',
          modifyMin: null,
          modifyStep:null,
        }
      ],
      gradeList: [{
        id: "1",
        value: "2018级"
      }, {
        id: "3994",
        value: "2017级"
      }, {
        id: "3995",
        value: "2016级"
      }, {
        id: "3996",
        value: "2015级"
      }],
      enableReceipt: '1',
      year:'2017',
      creditBatchName: '2018年上学期',
      printType:'xxx',
      departId: '31',
      departName: '一级 3'
    }
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/fee/feeMission/getMchList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = [
      {
        id:"1",
        name:"学费户",
      },
      {
        id:"WGTZjpGv6BGAAAAWPwAVGQ",
        name:"杂费"
      }
    ]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/fee/feeMission/getYearList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = [
      {
        year:'2017'
      },
      {
        year:'2018'
      },
      {
        year:'2019'
      }
    ]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/fee/feeMission/getMissionSimple`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 20 }
    data.ret_content.data = [{
      id: '1',
      name: '2018年春收',
      createDate: '2018-01-11 14:08:23',
      beginDate: '2018-01-11 14:08:23',
      endDate: '2018-01-11 14:08:23',
      status: '1',
      year:'2018',
    },
    {
      id: '2',
      name: '2017年秋收',
      createDate: '2018-01-11 14:08:23',
      beginDate: '2018-01-11 14:08:23',
      endDate: '2018-01-11 14:08:23',
      status: '1',
      year:'2017',
    }]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/fee/feeRule/getRuleList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 20 }
    data.ret_content.data = [{
      id: '111',
      name: '计算机专业',
      structId: 'c',
      pid: 'b',
      fee: null,
      editable: '1',
      structItemEntities: [{
        id: '11',
        name: '计算机学院',
        structId: 'b',
        pid: 'a',
      }, {
        id: '1',
        name: '清水河校区',
        structId: 'a',
        pid: null,
      },
      ],
      structItemAttrRelateEntities: [
        {
          id: 2,
          itemId: 1,
          attrId: 1,
          relateId: 1,
          relateName: '标签1',
        },
        {
          id: 3,
          itemId: 1,
          attrId: 2,
          relateId: 4,
          relateName: '标签4',
        },
      ],
      feeRuleStandRelateList:[
        {
          relateId:'1',
          relateName:'重点',
          fee:'80000'
        },
        {
          relateId:'2',
          relateName:'普通',
          fee:'90000'
        }
      ]
    },
    {
      id: '112',
      name: '软件专业',
      structId: 'c',
      pid: 'b',
      fee: null,
      editable: '1',
      structItemEntities: [{
        id: '11',
        name: '计算机学院',
        structId: 'b',
        pid: 'a',
      }, {
        id: '1',
        name: '清水河校区',
        structId: 'a',
        pid: null,
      },
      ],
    }]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/fee/feeRule/getFeeRuleAttr`] (req, res) {
    let data = {}
    data.ret_code = 1
    if(req.query.subjectId == 3){
      data.ret_content = {
        id: '111',
        structId: 'd'
      }
    }else{
      data.ret_content = {
        id: '111',
        attrId: '10',
        attrName: '学科门类',
        structId: '0'
      }
    }
   
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/fee/feeRule/getRuleStandList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 20 }
    data.ret_content.data = [{
      id: '111',
      name: '计算机专业',
      structId: 'c',
      pid: 'b',
      structItemEntities: [{
        id: '11',
        name: '计算机学院',
        structId: 'b',
        pid: 'a',
      }, {
        id: '1',
        name: '清水河校区',
        structId: 'a',
        pid: null,
      },
      ],
      structItemAttrRelateEntities: [
        {
          id: 2,
          itemId: 1,
          attrId: 1,
          relateId: 1,
          relateName: '标签1',
        },
        {
          id: 3,
          itemId: 1,
          attrId: 2,
          relateId: 4,
          relateName: '标签4',
        },
      ],
      fee: null,
      editable: '1',
      feeRuleStandRelateList:[
        {
          relateId:'1',
          relateName:'重点',
          fee:'80000'
        },
        {
          relateId:'2',
          relateName:'普通',
          fee:'90000'
        }
      ]
    },
    {
      id: '112',
      name: '软件专业',
      structId: 'c',
      pid: 'b',
      structItemEntities: [{
        id: '11',
        name: '计算机学院',
        structId: 'b',
        pid: 'a',
      }, {
        id: '1',
        name: '清水河校区',
        structId: 'a',
        pid: null,
      },
      ],
      fee: '444',
      editable: '1',
    }]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/fee/feeRule/getDeferredStandList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = [{
      "id": "1",
      "name": "缓缴测试",
      "fee": "1002000",
      "reason": "贫困生",
      "subjectId": "1",
      "createDate": "2019-04-25 14:19:11",
      "status": "1",
      "timeEnd":"2019-04-25 14:19:11"
    },{
      "id": "2",
      "name": "缓缴测试2",
      "fee": "2000",
      "reason": null,
      "subjectId": "2",
      "createDate": "2019-04-25 14:19:11",
      "status": "1",
      "timeEnd":"2019-04-25 14:19:11"
    }]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/fee/feeRule/getDiscountStandList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = [{
      "id": "1",
      "name": "缓缴测试",
      "fee": "1002000",
      "reason": "零零落落零零落落",
      "subjectId": "1",
      "createDate": "2019-04-25 14:19:11",
      "status": "1",
    },{
      "id": "2",
      "name": "缓缴测试2",
      "fee": "2000",
      "reason": null,
      "subjectId": "2",
      "createDate": "2019-04-25 14:19:11",
      "status": "1",
    }]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/fee/feeBill/getUserListNoBill`] (req, res) {
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

  [`GET ${apiPrefix}/fee/feeBill/importBill`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = ""
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/fee/feeBill/importBillBySubject`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = ""
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/fee/feeBill/importDeferred`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = ""
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/fee/feeBill/importDiscount`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = ""
    res.status(200).json(data)
  },

  [`POST ${apiPrefix}/fee/feeBill/coverBill`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/fee/feeBill/coverDeferred`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/fee/feeBill/coverDiscount`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`GET ${apiPrefix}/fee/feeBill/getImportPrs`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      cfNum: '10',
      cgNum: '0',
      wxNum: '1',
      status: '2',
    }
    res.status(200).json(data)
  },
}
