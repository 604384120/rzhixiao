const { config } = require('./common')

const { apiPrefix } = config

module.exports = {
	[`POST ${apiPrefix}/verification/verifySubject/addVerifySubject`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
	},
	
	[`POST ${apiPrefix}/verification/verifySubject/updateVerifySubject`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
	},
	
	[`POST ${apiPrefix}/verification/verifySubject/deleteVerifySubject`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
	},

	[`POST ${apiPrefix}/verification/verifySubject/addVerifyBill`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
	},

	[`POST ${apiPrefix}/verification/verifySubject/updateVerifyBill`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },
  
  [`POST ${apiPrefix}/verification/verifySubject/addVerifyBillScan`] (req, res) {
    //res.status(200).json({ ret_code: 0, ret_content: "无此权限" })
    res.status(200).json({ 
      ret_code: 1, 
      ret_content: {
        "id": null,
        "subjectId": "1211",
        "missionId": "1704",
        "missionName": "书本费",
        "subjectName": "书本费",
        "fee": "1195",
        "totalFee": "1200",
        "discount": "5",
        "disReason": null,
        "reason": null,
        "paidFee": "0",
        "disAccountName": "知校测试大学",
        "deferred": "200",
        "defReason": null,
        "defTimeend": "2019-07-01 23:59:59.0",
        "defAccountName": "知校测试大学",
        "refund": "0",
        "userId": "14293",
        "date": null,
        "status": null,
        "attrList": [{
          "relateName": "在读",
          "attrId": "994",
          "relateId": "4053"
        }, {
          "relateName": "2019级",
          "attrId": "983",
          "relateId": "5853"
        }, {
          "relateName": "四川经济管理学校",
          "attrId": "979",
          "relateId": "1128"
        }, {
          "relateName": "默认院系",
          "attrId": "2",
          "relateId": "1129"
        }, {
          "relateName": "计算机应用（VR+、电子竞技）",
          "attrId": "3",
          "relateId": "3"
        }, {
          "relateName": "吴杰鑫",
          "attrId": "5",
          "relateId": "null"
        }, {
          "relateName": "510623200302045217",
          "attrId": "6",
          "relateId": "null"
        }]
      }
    })
	},
	
  [`GET ${apiPrefix}/verification/verifySubject/getVerifySubjectList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 20 }
    data.ret_content.data = [{
			id: "1",
			accountList: [
				{accountId: '1',accountName:"卫生部门/admin1"},
				{accountId: '1212',accountName:"卫生部门/admin1212"},
			],
			missionName: "2018年春收",
			missionId:'1',
			subjectName: "教材费",
			subjectId:'2',
			status: null,
			year: "2019"
    },{
			id: "2",
			accountList: [
				{accountId: '3',accountName:"卫生部门/ainadf7"},
				{accountId: '345',accountName:"卫生部门/ad12"},
			],
			accountName: "知校测试大学",
			missionId:'2',
			missionName: "0710",
			subjectId:'4',
			subjectName: "学年标准杂货费",
			status: null,
			year: "2020"
		},{
			id: "3",
			accountList: [
				{accountId: '1',accountName:"卫生部门/admin1"},
				{accountId: '1212',accountName:"卫生部门/admin1212"},
			],
			missionName: "2018年春收",
			missionId:'1',
			subjectName: "军训费",
			subjectId:'3',
			status: null,
			year: "2019"
    }]
		res.status(200).json(data)
	},

	[`GET ${apiPrefix}/verification/verifySubject/getVerifySubjectStatisticsList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 20 }
    data.ret_content.data = [{
			id: "1",
			subjectId: "1211",
			missionId: "1704",
			missionName: "书本费",
			subjectName: "书本费",
			fee: "1200",
			userId: "14302",
			date: "2019-08-09 09:53:22",
			accountName: "dzkjd",
			billId: "280238",
			status: "1",
			attrList: [{
					relateName: "计算机学院",
					attrId: "2",
					relateId: "2"
				}, {
					relateName: "计算机专业",
					attrId: "3",
					relateId: "3"
				}, {
					relateName: "墨尔本",
					attrId: "5",
					relateId: "5"
				}, {
					relateName: "156827367",
					attrId: "6",
					relateId: "6"
				},]
		},{
			id: "2",
			subjectId: "1211",
			missionId: "1704",
			missionName: "书本费",
			subjectName: "书本费",
			fee: "1200",
			userId: "14302",
			date: "2019-08-09 09:53:22",
			accountName: "dzkjd",
			billId: "280458",
			status: "0",
			attrList: [{
			relateName: "在读",
			attrId: "994",
			relateId: "4053"
			}, {
				relateName: "2019级",
				attrId: "983",
				relateId: "5853"
			}, {
				relateName: "本科生",
				attrId: "986",
				relateId: "4013"
			}, {
				relateName: "四川省经济管理学校",
				attrId: "979",
				relateId: "1133"
			}, {
				relateName: "默认院系",
				attrId: "980",
				relateId: "1134"
			}, {
				relateName: "计算机应用（VR+、电子竞技）",
				attrId: "981",
				relateId: "1137"
			}, {
				relateName: "四川计算机",
				attrId: "984",
				relateId: "1138"
			}, {
				relateName: "邱晓琳",
				attrId: "968",
				relateId: "null"
			}, {
				relateName: "510421200207084329",
				attrId: "975",
				relateId: "null"
			}]
		},{
			id: "3",
			subjectId: "1211",
			missionId: "1704",
			missionName: "书本费",
			subjectName: "书本费",
			fee: "1200",
			userId: "14302",
			date: "2019-08-09 09:53:22",
			accountName: "dzkjd",
			billId: "28768",
			status: "0",
			attrList: [{
			relateName: "在读",
			attrId: "994",
			relateId: "4053"
			}, {
				relateName: "2019级",
				attrId: "983",
				relateId: "5853"
			}, {
				relateName: "本科生",
				attrId: "986",
				relateId: "4013"
			}, {
				relateName: "四川省经济管理学校",
				attrId: "979",
				relateId: "1133"
			}, {
				relateName: "默认院系",
				attrId: "980",
				relateId: "1134"
			}, {
				relateName: "计算机应用（VR+、电子竞技）",
				attrId: "981",
				relateId: "1137"
			}, {
				relateName: "四川计算机",
				attrId: "984",
				relateId: "1138"
			}, {
				relateName: "邱晓琳",
				attrId: "968",
				relateId: "null"
			}, {
				relateName: "510421200207084329",
				attrId: "975",
				relateId: "null"
			}]
		}]
		res.status(200).json(data)
  },
  
  [`GET ${apiPrefix}/verification/verifySubject/getVerifyBillOperateList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = [{
      id: "1",
      type:'1',
			createDate: "2019-08-09 09:53:22",
			accountName: "dzkjd",
			billId: "280238",
		},{
      id: "2",
      type:'2',
			createDate: "2019-08-09 09:53:22",
			accountName: "dzkjd",
			billId: "280238",
		}]
		res.status(200).json(data)
	},

	[`GET ${apiPrefix}/verification/verifySubject/getVerifyAccountList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 20 }
    data.ret_content = [{
			id: "1",
			accountName: "admin1",
    },{
			id: "2",
			accountName: "admin2",
		}]
		res.status(200).json(data)
	},

}


