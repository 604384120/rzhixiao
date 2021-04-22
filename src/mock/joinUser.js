const { config } = require('./common')

const { apiPrefix } = config

module.exports = {

	[`POST ${apiPrefix}/join/joinAccount/addJoinAccount`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
	},
	
  [`GET ${apiPrefix}/join/joinAccount/getJoinAccountList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 20,  }
    data.ret_content.data = [{
			loginName: "yyxx",
			name: "yyxx",
			departName: "测试小学",
			phone: "13652999191",
			id: '111',
			departId: '2221',
      status: "1",
      accountId:'2',
      partnerId:'partner3'
		}]
		res.status(200).json(data)
  },
  
[`GET ${apiPrefix}/join/joinAccount/getJoinAccountStat`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 20 }
    data.ret_content.data = [{
			loginName: "admin",
			name: "知校测试大学",
			departName: null,
			phone: null,
			status: "1",
			id: "2",
			passCount: "2",
      sumCount: "3",
      accountId:'110',
		}, {
			loginName: "yyxx",
			name: "yyxx",
			departName: "测试小学",
			phone: "13652999191",
			status: "1",
			id: "1",
			passCount: "2",
      sumCount: "2",
      accountId:'1890',
		}]
		res.status(200).json(data)
  },

  [`GET ${apiPrefix}/join/joinForm/getJoinForm`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content  = {
      "title": "知校测试大学",
      "descr": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "type": "2",
      "fee": "9",
      "feeName": '住宿费',
      'mchId': '1',
			"attrList": [{
				"attrId": "7",
				"isRequired": "2"
			},{
				"attrId": "8",
				"isRequired": "1"
			},{
				"attrId": "11",
				"isRequired": "1"
			},{
				"attrId": "22",
				"isRequired": "1"
			},{
				"attrId": "1",
				"isRequired": "1"
			},{
				"attrId": "3",
				"isRequired": "1"
			},{
				"attrId": "4",
				"isRequired": "1"
			}]
		}
		res.status(200).json(data)
  },
  
	[`POST ${apiPrefix}/join/joinForm/updateJoinForm`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/join/joinUser/reviewJoinUser`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/join/joinUser/addJoinUser`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/join/joinUser/updateJoinUser`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/join/joinUser/updateJoinUserStatus`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/join/joinAccount/updateJoinAccount`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },
  
  [`GET ${apiPrefix}/join/joinForm/getJoinAttr`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = 
    [{
      id: '5',
      name: '姓名',
      position: '5',
      type: '1',
      relateId: 'name',
      valueType: '1',
      status: '1',
      statusDefault:'1',
      userShow:'1',
      isRequired:'1'
    },
   {
      id: '22',
      name: '身份证件号',
      position: '22',
      type: '1',
      relateId: 'IDCard',
      valueType: '1',
      status: '1',
      userShow:'1'
    },{
      id: '969',
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
    },{
      id: '11',
      name: '电话',
      position: '12',
      type: '4',
      relateId: 'dh',
      valueType: '1',
      status: '1',
      userShow:'1'
    },{
      id: '1',
      name: '校区',
      position: '12',
      type: '2',
      relateId: 'a',
      valueType: '3',
      status: '1',
      userShow:'1'
    },{
      id: '3',
      name: '专业',
      position: '13',
      type: '2',
      relateId: 'c',
      valueType: '3',
      status: '1',
      userShow:'1'
    },
    ]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/join/joinUser/getJoinUserList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {"sumCount":"3","awaitCount":"2","passCount":"0","rejectedCount":"1","refundCount":"0","joinOrderStat":null,"data":[{"id":"245","createDate":"2020-04-30 10:21:12","updateDate":"2020-04-30 10:21:12","status":"5","remark":null,"accountName":"知校测试大学","reviewName":null,"userAccountId":null,"fee":null,"payType":null,"attrList":[{"relateName":"张维之","attrId":"968","relateId":"null"},{"relateName":"男","attrId":"969","relateId":"3873"},{"relateName":"12345675432","attrId":"1000","relateId":"null"},{"relateName":"123456768765643","attrId":"975","relateId":"null"},{"relateName":"124355","attrId":"966","relateId":"null"},{"relateName":"南校区","attrId":"979","relateId":"1077"},{"relateName":"经济学院","attrId":"980","relateId":"1079"},{"relateName":"经济学","attrId":"981","relateId":"1105"},{"relateName":"蒙古族","attrId":"972","relateId":"3889"}]},{"id":"244","createDate":"2020-04-30 10:19:51","updateDate":"2020-04-30 10:19:51","status":"5","remark":null,"accountName":"知校测试大学","reviewName":null,"userAccountId":null,"fee":"50000","payType":null,"attrList":[{"relateName":"诸葛青","attrId":"968","relateId":"null"},{"relateName":"男","attrId":"969","relateId":"3873"},{"relateName":"34672134","attrId":"1000","relateId":"null"},{"relateName":"324354676664","attrId":"975","relateId":"null"},{"relateName":"123124","attrId":"966","relateId":"null"},{"relateName":"南校区","attrId":"979","relateId":"1077"},{"relateName":"经济学院","attrId":"980","relateId":"1079"},{"relateName":"经济学","attrId":"981","relateId":"1105"},{"relateName":"蒙古族","attrId":"972","relateId":"3889"}]},{"id":"243","createDate":"2020-04-30 09:49:21","updateDate":"2020-04-30 09:49:21","status":"3","remark":"驳回","accountName":"知校测试大学","reviewName":"知校测试大学","userAccountId":null,"fee":null,"payType":null,"attrList":[{"relateName":"2","attrId":"968","relateId":"null"},{"relateName":"男","attrId":"969","relateId":"3873"},{"relateName":"2","attrId":"1000","relateId":"null"},{"relateName":"2","attrId":"975","relateId":"null"},{"relateName":"2","attrId":"966","relateId":"null"},{"relateName":"南校区","attrId":"979","relateId":"1077"},{"relateName":"经济学院","attrId":"980","relateId":"1079"},{"relateName":"经济学","attrId":"981","relateId":"1105"},{"relateName":"2","attrId":"973","relateId":"null"},{"relateName":"蒙古族","attrId":"972","relateId":"3889"}]}]}
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/join/joinUser/getJoinUserInfo`] (req, res) {
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
      },{
        attrId: '969',
        relateId: '5',
        relateName: "xxxx",
      },
      ],
    }
    res.status(200).json(data)
  },
  
  [`GET ${apiPrefix}/join/joinUser/getJoinUserOperate`] (req, res) {
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

  
  [`GET ${apiPrefix}/join/joinUser/getIntentionUserList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { 
      count: 20,
      "sumCount": "4",
      "awaitCount": "0",
      "passCount": "4",
      "rejectedCount": "0",
      "joinOrderStat": {
        "paidFeeSum": "0",
        "refundSum": "0",
        "surplusSum": "0",
        "offsetSum": "0",
        "refundCount": "0",
        "surplusCount": "0",
        "paidFeeCount": "0",
        "offsetCount": "0"
      },
    }
    data.ret_content.data = [{
			"id": "173",
			"createDate": "2020-04-17 15:27:32",
			"updateDate": "2020-04-17 15:27:32",
			"status": "1",
			"remark": null,
			"accountName": "知校测试大学",
			"reviewName": null,
			"userAccountId": "14838",
			"fee": '20',
			"payType": '2',
			"attrList": [{
				"relateName": "岳绮罗",
				"attrId": "968",
				"relateId": "null"
			}, {
				"relateName": "女",
				"attrId": "969",
				"relateId": "3874"
			}, {
				"relateName": "12345676432",
				"attrId": "975",
				"relateId": "null"
			}, {
				"relateName": "2345664",
				"attrId": "1000",
				"relateId": "null"
			}, {
				"relateName": "西校区",
				"attrId": "979",
				"relateId": "1078"
			}, {
				"relateName": "财经学院",
				"attrId": "980",
				"relateId": "1107"
			}, {
				"relateName": "财务管理",
				"attrId": "981",
				"relateId": "1082"
			}, {
				"relateName": "2020级",
				"attrId": "983",
				"relateId": "5860"
			}, {
				"relateName": "1",
				"attrId": "973",
				"relateId": "null"
			}]
		}]
		res.status(200).json(data)
  },

}


