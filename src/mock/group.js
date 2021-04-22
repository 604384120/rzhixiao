const { config } = require('./common')

const { apiPrefix } = config

module.exports = {

	[`POST ${apiPrefix}/group/group/updateGroupMgrDepart`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
	},
	
	[`POST ${apiPrefix}/group/group/updateGroupMgrAccount`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },
  
	[`POST ${apiPrefix}/group/group/deleteGroupMgrDepart`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },
  
	[`POST ${apiPrefix}/group/group/updateGroupMgrAcc`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },
  
	[`POST ${apiPrefix}/group/group/updatePwd`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
	},

	[`POST ${apiPrefix}/group/group/updateDisplayAttr`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
	},
	
	[`POST ${apiPrefix}/group/group/deleteDisplayAttr`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },
	
  [`GET ${apiPrefix}/group/group/getGroupStatistics`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = [{
      "token": "8fa866c26694477d938625194753c011",
      "name": "知校测试大学",
      "orderFee": "1234245",
      "refundOrderFee": "67568"
    }, {
      "token": "23f44305980943d18dfb103386b73eaf",
      "name": "测试收费系统",
      "orderFee": "2345787",
      "refundOrderFee": "4567597"
    },{
      "token": "23f44305980943d18dfb103386b73eaf",
      "name": "测试收费系统",
      "orderFee": "2345787",
      "refundOrderFee": "4567597"
    },{
      "token": "23f44305980943d18dfb103386b73eaf",
      "name": "测试收费系统",
      "orderFee": "2345787",
      "refundOrderFee": "4567597"
    },{
      "token": "23f44305980943d18dfb103386b73eaf",
      "name": "测试收费系统",
      "orderFee": "2345787",
      "refundOrderFee": "4567597"
    },{
      "token": "23f44305980943d18dfb103386b73eaf",
      "name": "测试收费系统",
      "orderFee": "2345787",
      "refundOrderFee": "4567597"
    },{
      "token": "23f44305980943d18dfb103386b73eaf",
      "name": "测试收费系统",
      "orderFee": "2345787",
      "refundOrderFee": "4567597"
    },{
      "token": "23f44305980943d18dfb103386b73eaf",
      "name": "测试收费系统",
      "orderFee": "2345787",
      "refundOrderFee": "4567597"
    },{
      "token": "23f44305980943d18dfb103386b73eaf",
      "name": "测试收费系统",
      "orderFee": "2345787",
      "refundOrderFee": "4567597"
    },{
      "token": "23f44305980943d18dfb103386b73eaf",
      "name": "测试收费系统",
      "orderFee": "2345787",
      "refundOrderFee": "4567597"
    },{
      "token": "23f44305980943d18dfb103386b73eaf",
      "name": "测试收费系统",
      "orderFee": "2345787",
      "refundOrderFee": "4567597"
    },{
      "token": "23f44305980943d18dfb103386b73eaf",
      "name": "测试收费系统",
      "orderFee": "2345787",
      "refundOrderFee": "4567597"
    },{
      "token": "23f44305980943d18dfb103386b73eaf",
      "name": "测试收费系统",
      "orderFee": "2345787",
      "refundOrderFee": "4567597"
    },{
      "token": "23f44305980943d18dfb103386b73eaf",
      "name": "测试收费系统",
      "orderFee": "2345787",
      "refundOrderFee": "4567597"
    },{
      "token": "23f44305980943d18dfb103386b73eaf",
      "name": "测试收费系统",
      "orderFee": "2345787",
      "refundOrderFee": "4567597"
    },{
      "token": "23f44305980943d18dfb103386b73eaf",
      "name": "测试收费系统",
      "orderFee": "2345787",
      "refundOrderFee": "4567597"
    },{
      "token": "23f44305980943d18dfb103386b73eaf",
      "name": "测试收费系统",
      "orderFee": "2345787",
      "refundOrderFee": "4567597"
    },{
      "token": "23f44305980943d18dfb103386b73eaf",
      "name": "测试收费系统",
      "orderFee": "2345787",
      "refundOrderFee": "4567597"
    },{
      "token": "23f44305980943d18dfb103386b73eaf",
      "name": "测试收费系统",
      "orderFee": "2345787",
      "refundOrderFee": "4567597"
    },{
      "token": "23f44305980943d18dfb103386b73eaf",
      "name": "测试收费系统",
      "orderFee": "2345787",
      "refundOrderFee": "4567597"
    },{
      "token": "23f44305980943d18dfb103386b73eaf",
      "name": "测试收费系统",
      "orderFee": "2345787",
      "refundOrderFee": "4567597"
    },]
		res.status(200).json(data)
  },

  [`GET ${apiPrefix}/group/group/getGroupMgrAccountList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 25 }
    data.ret_content.data = [{"loginName":"www","name":"www","token":"8fa866c26694477d938625194753c011","isAdmin":"0","schoolName":null,"logo":null,"logoInfo":null,"shortName":null,"departName":null,"phone":"123123","id":"195","departId":null,"printType":null,"groupStatus":null,"isReview":null,"isStand":null,"orderCancelTime":null,"departList":null,"groupToken":null,"childrenTokenList":null,"status":"1","privilegeList":null},{"loginName":"lwh","name":"lwh","token":"8fa866c26694477d938625194753c011","isAdmin":"0","schoolName":null,"logo":null,"logoInfo":null,"shortName":null,"departName":null,"phone":"123456789","id":"167","departId":null,"printType":null,"groupStatus":null,"isReview":null,"isStand":null,"orderCancelTime":null,"departList":[{"id":"96","mgrAccountId":"167","token":"8fa866c26694477d938625194753c011","privilegeList":"5,6,7,4,10,16,40,54,8,12,13,14,15,71,11,24,17,3,46,2,27,49,1,30,31,53,55,68,69,70,33,34,35,50,51,52,64,67","departId":"187"}],"groupToken":null,"childrenTokenList":null,"status":"1","privilegeList":null},{"loginName":"ee","name":"ee","token":"8fa866c26694477d938625194753c011","isAdmin":"0","schoolName":null,"logo":null,"logoInfo":null,"shortName":null,"departName":null,"phone":"1987654320","id":"172","departId":null,"printType":null,"groupStatus":null,"isReview":null,"isStand":null,"orderCancelTime":null,"departList":[{"id":"100","mgrAccountId":"172","token":"8fa866c26694477d938625194753c011","privilegeList":"5,6,7,4,10,16,40,54,8,24,17,20,36,37,38,39,48,18,3,46,2,27,33,34,35,50,51,52,32","departId":"186"}],"groupToken":null,"childrenTokenList":null,"status":"1","privilegeList":null},{"loginName":"yyxx","name":"yyxx","token":"12","isAdmin":"0","schoolName":null,"logo":null,"logoInfo":null,"shortName":null,"departName":null,"phone":"110","id":"154","departId":"187","printType":null,"groupStatus":null,"isReview":null,"isStand":null,"orderCancelTime":null,"departList":[{"id":"128","mgrAccountId":"154","token":"8fa866c26694477d938625194753c011","privilegeList":"5,6,7,4,10,16,40,54,8,12,13,14,15,71,11,24,17,20,36,37,38,39,48,18,45,22,42,43,21,3,46,2,27,49,25,1,30,31,53,55,68,69,70,28,33,34,35,50,51,52,32,58,59,57,61,63,64,67,62,65,66,60","departId":"187"}],"groupToken":null,"childrenTokenList":null,"status":"1","privilegeList":null},{"loginName":"dzkjd","name":"dzkjd","token":"8fa866c26694477d938625194753c011","isAdmin":"0","schoolName":null,"logo":null,"logoInfo":null,"shortName":null,"departName":null,"phone":"12345678909","id":"166","departId":"0","printType":null,"groupStatus":null,"isReview":null,"isStand":null,"orderCancelTime":null,"departList":[{"id":"130","mgrAccountId":"166","token":"8fa866c26694477d938625194753c011","privilegeList":null,"departId":"187"},{"id":"131","mgrAccountId":"166","token":"23f44305980943d18dfb103386b73eaf","privilegeList":"20,36,37,38,39,48,18,3,46,2,27,49,74,25","departId":"0"}],"groupToken":null,"childrenTokenList":null,"status":"1","privilegeList":null},{"loginName":"jtcs","name":"集团测试","token":"8fa866c26694477d938625194753c011","isAdmin":"0","schoolName":null,"logo":null,"logoInfo":null,"shortName":null,"departName":null,"phone":"12346765432","id":"189","departId":"0","printType":null,"groupStatus":null,"isReview":null,"isStand":null,"orderCancelTime":null,"departList":[{"id":"124","mgrAccountId":"189","token":"23f44305980943d18dfb103386b73eaf","privilegeList":"20,36,37,38,39,48,18,3,46,2,27,49,74,25","departId":"0"},{"id":"125","mgrAccountId":"189","token":"8fa866c26694477d938625194753c011","privilegeList":"20,36,37,38,39,48,18,3,46,2,27,49,74,25","departId":"0"}],"groupToken":null,"childrenTokenList":null,"status":"2","privilegeList":null},{"loginName":"yyxx","name":"yyxx","token":"8fa866c26694477d938625194753c011","isAdmin":"0","schoolName":null,"logo":null,"logoInfo":null,"shortName":null,"departName":null,"phone":"13652999191","id":"159","departId":null,"printType":null,"groupStatus":null,"isReview":null,"isStand":null,"orderCancelTime":null,"departList":[{"id":"90","mgrAccountId":"159","token":"8fa866c26694477d938625194753c011","privilegeList":"50","departId":"184"}],"groupToken":null,"childrenTokenList":null,"status":"2","privilegeList":null},{"loginName":"111","name":"111","token":"8fa866c26694477d938625194753c011","isAdmin":"0","schoolName":null,"logo":null,"logoInfo":null,"shortName":null,"departName":null,"phone":"2345","id":"191","departId":"177","printType":null,"groupStatus":null,"isReview":null,"isStand":null,"orderCancelTime":null,"departList":[{"id":"134","mgrAccountId":"191","token":"8fa866c26694477d938625194753c011","privilegeList":"20,36,37,38,39,48,18,3,46,2,27,49,74,25","departId":"0"},{"id":"135","mgrAccountId":"191","token":"23f44305980943d18dfb103386b73eaf","privilegeList":"20,36,37,38,39,48,18,3,46,2,27,49,74,25","departId":"177"}],"groupToken":null,"childrenTokenList":null,"status":"2","privilegeList":null},{"loginName":"jtyh","name":"集团用户","token":"8fa866c26694477d938625194753c011","isAdmin":"0","schoolName":null,"logo":null,"logoInfo":null,"shortName":null,"departName":null,"phone":"12345678","id":"188","departId":null,"printType":null,"groupStatus":null,"isReview":null,"isStand":null,"orderCancelTime":null,"departList":[{"id":"121","mgrAccountId":"188","token":"8fa866c26694477d938625194753c011","privilegeList":"5,6,7,4,10,16,40,54,8,12,13,14,15,71,11,24,17,20,36,37,38,39,48,18,45,22,42,43,21,3,46,2,27,49,25,1,30,31,53,55,68,69,70,28,33,34,35,50,51,52,32,58,59,57,61,63,64,67,62,65,66,60","departId":"187"}],"groupToken":null,"childrenTokenList":null,"status":"2","privilegeList":null},{"loginName":"lll","name":"lll","token":"8fa866c26694477d938625194753c011","isAdmin":"0","schoolName":null,"logo":null,"logoInfo":null,"shortName":null,"departName":null,"phone":"18382276889","id":"190","departId":"0","printType":null,"groupStatus":null,"isReview":null,"isStand":null,"orderCancelTime":null,"departList":[{"id":"129","mgrAccountId":"190","token":"23f44305980943d18dfb103386b73eaf","privilegeList":"20,36,37,38,39,48,18,3,46,2,27,49,74,25","departId":"0"}],"groupToken":null,"childrenTokenList":null,"status":"2","privilegeList":null},{"loginName":"xhxx","name":"新华小学财务处","token":"23f44305980943d18dfb103386b73eaf","isAdmin":"0","schoolName":null,"logo":null,"logoInfo":null,"shortName":null,"departName":null,"phone":"13521869165","id":"160","departId":null,"printType":null,"groupStatus":null,"isReview":null,"isStand":null,"orderCancelTime":null,"departList":[{"id":"91","mgrAccountId":"160","token":"23f44305980943d18dfb103386b73eaf","privilegeList":"10,16,40,8,24,17,20,36,37,38,39,48,18,46,3,47,2,27,30,31,50","departId":"179"}],"groupToken":null,"childrenTokenList":null,"status":"2","privilegeList":null},{"loginName":"klxx","name":"1","token":"23f44305980943d18dfb103386b73eaf","isAdmin":"0","schoolName":null,"logo":null,"logoInfo":null,"shortName":null,"departName":null,"phone":"1","id":"163","departId":null,"printType":null,"groupStatus":null,"isReview":null,"isStand":null,"orderCancelTime":null,"departList":[{"id":"93","mgrAccountId":"163","token":"23f44305980943d18dfb103386b73eaf","privilegeList":"10,16,40,8,24,17,20,36,37,38,39,48,18,46,3,47,2,27,30,31","departId":"0"}],"groupToken":null,"childrenTokenList":null,"status":"2","privilegeList":null},{"loginName":"caoniupi","name":"caoniupi","token":"8fa866c26694477d938625194753c011","isAdmin":"0","schoolName":null,"logo":null,"logoInfo":null,"shortName":null,"departName":null,"phone":"111","id":"174","departId":null,"printType":null,"groupStatus":null,"isReview":null,"isStand":null,"orderCancelTime":null,"departList":[{"id":"101","mgrAccountId":"174","token":"8fa866c26694477d938625194753c011","privilegeList":"5,6,7,4,10,16,40,8,12,13,14,15,11,46,3,47,2,27,49,25","departId":"184"}],"groupToken":null,"childrenTokenList":null,"status":"2","privilegeList":null},{"loginName":"lly","name":"lly","token":"8fa866c26694477d938625194753c011","isAdmin":"0","schoolName":null,"logo":null,"logoInfo":null,"shortName":null,"departName":null,"phone":"123456789","id":"168","departId":null,"printType":null,"groupStatus":null,"isReview":null,"isStand":null,"orderCancelTime":null,"departList":[{"id":"97","mgrAccountId":"168","token":"8fa866c26694477d938625194753c011","privilegeList":"5,6,7,4,10,16,40,8,12,13,14,15,11,24,17","departId":"185"}],"groupToken":null,"childrenTokenList":null,"status":"1","privilegeList":null},{"loginName":"klxx","name":"klxx","token":"8fa866c26694477d938625194753c011","isAdmin":"0","schoolName":null,"logo":null,"logoInfo":null,"shortName":null,"departName":null,"phone":"11","id":"169","departId":null,"printType":null,"groupStatus":null,"isReview":null,"isStand":null,"orderCancelTime":null,"departList":[{"id":"98","mgrAccountId":"169","token":"8fa866c26694477d938625194753c011","privilegeList":"5,6,7,4,10,16,40,54,8,12,13,14,15,11,24,17,20,36,37,38,39,48,18,45,22,42,43,21,3,46,2,27,49,25,1,30,31,28,33,34,35,50,51,52,32,58,59,57,61,63,64,67,62,65,66,60","departId":"0"}],"groupToken":null,"childrenTokenList":null,"status":"1","privilegeList":null},{"loginName":"csbm","name":"测试部门","token":"8fa866c26694477d938625194753c011","isAdmin":"0","schoolName":null,"logo":null,"logoInfo":null,"shortName":null,"departName":null,"phone":"123456789","id":"170","departId":null,"printType":null,"groupStatus":null,"isReview":null,"isStand":null,"orderCancelTime":null,"departList":[{"id":"99","mgrAccountId":"170","token":"8fa866c26694477d938625194753c011","privilegeList":"5,6,7,4,10,16,40,54,8,12,13,14,15,71,11,24,17,20,36,37,38,39,48,18,45,22,42,43,21,3,46,2,27,49,74,25,1,30,31,53,55,68,69,70,76,77,28,33,34,35,50,51,52,72,73,32,58,59,57,61,63,64,67,62,65,66,60","departId":"184"}],"groupToken":null,"childrenTokenList":null,"status":"1","privilegeList":null},{"loginName":"xjd","name":"新加的","token":"8fa866c26694477d938625194753c011","isAdmin":"0","schoolName":null,"logo":null,"logoInfo":null,"shortName":null,"departName":null,"phone":"111","id":"175","departId":null,"printType":null,"groupStatus":null,"isReview":null,"isStand":null,"orderCancelTime":null,"departList":[{"id":"102","mgrAccountId":"175","token":"8fa866c26694477d938625194753c011","privilegeList":"5,6,7,4,10,16,40,54,8,12,13,14,15,71,11,24,17,20,36,37,38,39,48,18,45,22,42,43,21,3,46,2,27,49,25,1,30,31,53,55,68,69,70,28,33,34,35,50,51,52,32,58,59,57,61,63,64,67,62,65,66,60","departId":"187"}],"groupToken":null,"childrenTokenList":null,"status":"1","privilegeList":null},{"loginName":"liangqi","name":"liangqi","token":"8fa866c26694477d938625194753c011","isAdmin":"0","schoolName":null,"logo":null,"logoInfo":null,"shortName":null,"departName":"仓前校区","phone":"13876567898","id":"177","departId":"187","printType":null,"groupStatus":null,"isReview":null,"isStand":null,"orderCancelTime":null,"departList":[{"id":"119","mgrAccountId":"177","token":"8fa866c26694477d938625194753c011","privilegeList":"5,6,7,4,10,16,40,54,8,12,13,14,15,71,11,24,17,20,36,37,38,39,48,18,45,22,42,43,21,3,46,2,27,49,25,1,30,31,53,55,68,69,70,28,33,34,35,50,51,52,32,58,59,57,61,63,64,67,62,65,66,60","departId":"187"}],"groupToken":null,"childrenTokenList":null,"status":"1","privilegeList":null},{"loginName":"admin1","name":"计算机","token":"23f44305980943d18dfb103386b73eaf","isAdmin":"0","schoolName":null,"logo":null,"logoInfo":null,"shortName":null,"departName":null,"phone":"18328748631","id":"158","departId":null,"printType":null,"groupStatus":null,"isReview":null,"isStand":null,"orderCancelTime":null,"departList":[{"id":"89","mgrAccountId":"158","token":"23f44305980943d18dfb103386b73eaf","privilegeList":"5,6,7,4,10,16,40,8,12,13,14,15,11,24,17,20,36,37,38,39,18,45,22,42,43,21,46,3,47,2,27,25,1,30,31,28,33,34,35,32","departId":"0"}],"groupToken":null,"childrenTokenList":null,"status":"1","privilegeList":null},{"loginName":"admin","name":"知校测试大学","token":"8fa866c26694477d938625194753c011","isAdmin":"1","schoolName":null,"logo":null,"logoInfo":null,"shortName":null,"departName":null,"phone":"12345","id":"146","departId":null,"printType":null,"groupStatus":null,"isReview":null,"isStand":null,"orderCancelTime":null,"departList":[{"id":"79","mgrAccountId":"146","token":"8fa866c26694477d938625194753c011","privilegeList":"5,6,7,4,10,16,40,54,8,12,13,14,15,11,24,17,20,36,37,38,39,48,18,45,22,42,43,21,3,46,2,27,49,25,1,30,31,53,55,28,33,34,35,50,51,52,32,58,59,57,61,63,64,67,62,65,66,60","departId":"0"}],"groupToken":null,"childrenTokenList":null,"status":"1","privilegeList":null}]
		res.status(200).json(data)
  },

  [`GET ${apiPrefix}/group/group/getGroupMgrDepartTree`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = [{"id":"4","name":"第一部门","pid":"0","token":"8fa866c26694477d9386252345676543451","schoolId":null,"type":"1","schoolToken":null,"groupDepartList":[{"id":"2","name":"知校测试大学","pid":"4","token":"8fa866c26694477d938625194753c011","schoolId":"32","type":"2","schoolToken":"8fa866c26694477d938625194753c011","groupDepartList":[{"id":"184","name":"新华小学","pid":"0","token":"8fa866c26694477d938625194753c011","schoolId":null,"type":"3","schoolToken":null,"groupDepartList":[{"id":"207","name":"小学部门","pid":"184","token":"8fa866c26694477d938625194753c011","schoolId":null,"type":"3","schoolToken":null,"groupDepartList":null}]},{"id":"185","name":"阳光小学","pid":"0","token":"8fa866c26694477d938625194753c011","schoolId":null,"type":"3","schoolToken":null,"groupDepartList":null},{"id":"186","name":"凯里小学","pid":"0","token":"8fa866c26694477d938625194753c011","schoolId":null,"type":"3","schoolToken":null,"groupDepartList":null},{"id":"187","name":"仓前校区","pid":"0","token":"8fa866c26694477d938625194753c011","schoolId":null,"type":"3","schoolToken":null,"groupDepartList":[{"id":"188","name":"财务部","pid":"187","token":"8fa866c26694477d938625194753c011","schoolId":null,"type":"3","schoolToken":null,"groupDepartList":[{"id":"189","name":"审计署","pid":"188","token":"8fa866c26694477d938625194753c011","schoolId":null,"type":"3","schoolToken":null,"groupDepartList":null},{"id":"190","name":"会计处","pid":"188","token":"8fa866c26694477d938625194753c011","schoolId":null,"type":"3","schoolToken":null,"groupDepartList":null}]}]},{"id":"193","name":"新校区","pid":"0","token":"8fa866c26694477d938625194753c011","schoolId":null,"type":"3","schoolToken":null,"groupDepartList":[{"id":"194","name":"新校区一","pid":"193","token":"8fa866c26694477d938625194753c011","schoolId":null,"type":"3","schoolToken":null,"groupDepartList":[{"id":"196","name":"一一一","pid":"194","token":"8fa866c26694477d938625194753c011","schoolId":null,"type":"3","schoolToken":null,"groupDepartList":[{"id":"199","name":"一一一一","pid":"196","token":"8fa866c26694477d938625194753c011","schoolId":null,"type":"3","schoolToken":null,"groupDepartList":null}]}]},{"id":"195","name":"新校区二","pid":"193","token":"8fa866c26694477d938625194753c011","schoolId":null,"type":"3","schoolToken":null,"groupDepartList":[{"id":"197","name":"二二二","pid":"195","token":"8fa866c26694477d938625194753c011","schoolId":null,"type":"3","schoolToken":null,"groupDepartList":[{"id":"198","name":"二二二二","pid":"197","token":"8fa866c26694477d938625194753c011","schoolId":null,"type":"3","schoolToken":null,"groupDepartList":null}]}]}]}]},{"id":"5","name":"第二部门","pid":"4","token":"8fa866c26694477d938625194753c011","schoolId":null,"type":"1","schoolToken":null,"groupDepartList":[{"id":"6","name":"第三部门","pid":"5","token":"8fa866c26694477d938625194753c011","schoolId":null,"type":"1","schoolToken":null,"groupDepartList":null}]}]},{"id":"13","name":"集团部门","pid":"0","token":"8fa866c26694477d938625194753c011","schoolId":null,"type":"1","schoolToken":null,"groupDepartList":[{"id":"3","name":"测试收费系统","pid":"13","token":"23f44305980943d18dfb103386b73eaf","schoolId":"40","type":"2","schoolToken":"23f44305980943d18dfb103386b73eaf","groupDepartList":[{"id":"177","name":"财务部","pid":"0","token":"23f44305980943d18dfb103386b73eaf","schoolId":null,"type":"3","schoolToken":null,"groupDepartList":[{"id":"180","name":"测试","pid":"177","token":"23f44305980943d18dfb103386b73eaf","schoolId":null,"type":"3","schoolToken":null,"groupDepartList":null}]},{"id":"178","name":"财务2","pid":"0","token":"23f44305980943d18dfb103386b73eaf","schoolId":null,"type":"3","schoolToken":null,"groupDepartList":null},{"id":"179","name":"新华小学","pid":"0","token":"23f44305980943d18dfb103386b73eaf","schoolId":null,"type":"3","schoolToken":null,"groupDepartList":null},{"id":"181","name":"阳光小学","pid":"0","token":"23f44305980943d18dfb103386b73eaf","schoolId":null,"type":"3","schoolToken":null,"groupDepartList":null},{"id":"182","name":"凯里小学","pid":"0","token":"23f44305980943d18dfb103386b73eaf","schoolId":null,"type":"3","schoolToken":null,"groupDepartList":null},{"id":"183","name":"测试小学","pid":"0","token":"23f44305980943d18dfb103386b73eaf","schoolId":null,"type":"3","schoolToken":null,"groupDepartList":null}]},{"id":"14","name":"集团子部门","pid":"13","token":"8fa866c26694477d938625194753c011","schoolId":null,"type":"1","schoolToken":null,"groupDepartList":null}]}]
		res.status(200).json(data)
	},
	
	[`GET ${apiPrefix}/group/group/getGroupTreeStatistics`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
			"statisticsDataSum": {
				"paidFeeSum": "121466741",
				"refundSum": "959912",
				"arrearsSum": "1804861747",
				"totalFeeSum": "2651958710",
				"discountSum": "2847100",
				"exceedFeeSum": "37651147",
				"convertFeeSum": "20832300",
				"refundCount": "22",
				"arrearsCount": "483",
				"paidFeeCount": "70",
				"discountCount": "29",
				"totalFeeCount": "487",
				"exceedFeeCount": "24",
				"convertFeeCount": "9",
				"year": null,
				"structItemEntity": {
					"count": null,
					"data": null
				},
				"feeBillEntities": {
					"count": null,
					"data": null
				},
				"statisticsDataList": [],
				"statisticsDataListPage": {
					"count": null,
					"data": null
				}
			},
			"groupStatisticsData": [{"id":"4","name":"第一部门","pid":"0","token":"8fa866c26694477d938625194753c011","schoolId":null,"type":"1","schoolToken":null,"groupStatisticsData":[{"id":"2","name":"知校测试大学","pid":"4","token":"8fa866c26694477d938625194753c011","schoolId":"32","type":"2","schoolToken":"8fa866c26694477d938625194753c011","groupStatisticsData":null,"paidFee":"0","refund":"0","arrears":"1216180935","totalFee":"3060220723","discount":"0","totalFeeCount":null,"discountCount":null,"paidFeeCount":null,"arrearsCount":null,"refundCount":null},{"id":"5","name":"第二部门","pid":"4","token":"8fa866c26694477d938625194753c011","schoolId":null,"type":"1","schoolToken":null,"groupStatisticsData":[{"id":"6","name":"第三部门","pid":"5","token":"8fa866c26694477d938625194753c011","schoolId":null,"type":"1","schoolToken":null,"groupStatisticsData":[{"id":"3","name":"测试收费系统","pid":"6","token":"8fa866c26694477d938625194753c011","schoolId":"40","type":"2","schoolToken":"23f44305980943d18dfb103386b73eaf","groupStatisticsData":null,"paidFee":"0","refund":"0","arrears":"0","totalFee":"0","discount":"0","totalFeeCount":null,"discountCount":null,"paidFeeCount":null,"arrearsCount":null,"refundCount":null}],"paidFee":"0","refund":"0","arrears":"0","totalFee":"0","discount":"0","totalFeeCount":"0","discountCount":"0","paidFeeCount":"0","arrearsCount":"0","refundCount":"0"}],"paidFee":"0","refund":"0","arrears":"0","totalFee":"0","discount":"0","totalFeeCount":"0","discountCount":"0","paidFeeCount":"0","arrearsCount":"0","refundCount":"0"}],"paidFee":"0","refund":"0","arrears":"1216180935","totalFee":"3060220723","discount":"0","totalFeeCount":"0","discountCount":"0","paidFeeCount":"0","arrearsCount":"0","refundCount":"0"},{"id":"13","name":"集团部门","pid":"0","token":"8fa866c26694477d938625194753c011","schoolId":null,"type":"1","schoolToken":null,"groupStatisticsData":[{"id":"14","name":"集团子部门","pid":"13","token":"8fa866c26694477d938625194753c011","schoolId":null,"type":"1","schoolToken":null,"groupStatisticsData":null,"paidFee":"0","refund":"0","arrears":"0","totalFee":"0","discount":"0","totalFeeCount":null,"discountCount":null,"paidFeeCount":null,"arrearsCount":null,"refundCount":null}],"paidFee":"0","refund":"0","arrears":"0","totalFee":"0","discount":"0","totalFeeCount":null,"discountCount":null,"paidFeeCount":null,"arrearsCount":null,"refundCount":null}]
		}
		res.status(200).json(data)
	},
	
	[`GET ${apiPrefix}/group/group/getDisplayAttr`] (req, res) {
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
  


}


