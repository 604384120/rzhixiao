const APIV1 = ''

// const APIV1 = ""

module.exports = {
  footerText: '杭州亿易  © 2018 知校',
  copyRight: 'Copyright  2017 - 2018 知校. All Rights Reserved.',
  //logo: '/logo.svg',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  payType: {
    '0':{
      name:'总体',
      icon:''
    },
    '1':{
      name:'微信',
      icon:'wechat'
    },
    '2':{
      name:'支付宝',
      icon:'alipay'
    },
    '3':{
      name:'现金',
      icon:'pay-circle'
    },
    '4':{
      name: 'pos机',
      icon:'credit-card'
    }
  },
  statDataList: [
    {id:'totalFee', name:'应收总额'},
    {id:'discount', name:'减免总额'},
    {id:'paidFee', name:'实收总额'},
    {id:'refund', name:'退费总额'},
    {id:'receivedFee', name:'收费总额'},
    {id:'arrears', name:'欠费总额'},
    {id:'exceedFee', name:'超收总额'},
    {id:'convertFee', name:'结转总额'},
  ],
  statDataMap: {
    totalFee:{name:'应收总额',sum:'totalFeeSum',count:'totalFeeCount'},
    paidFee:{name:'实收总额',sum:'paidFeeSum',count:'paidFeeCount'},
    arrears:{name:'欠费总额',sum:'arrearsSum',count:'arrearsCount'},
    discount:{name:'减免总额',sum:'discountSum',count:'discountCount'},
    refund:{name:'退费总额',sum:'refundSum',count:'refundCount'},
    exceedFee:{name:'超收总额',sum:'exceedFeeSum',count:'exceedFeeCount'},
    receivedFee:{name:'收费总额',sum:'receivedFeeSum',count:'receivedFeeCount'},
    convertFee:{name:'结转总额',sum:'convertFeeSum',count:'convertFeeCount'},
  },
  CORS: [],
  openPages: ['/login'],
  apiPrefix: '',
  APIV1,
  api: {
    login: `${APIV1}/mgr/mgrAccount/login`,
    authCode: `${APIV1}/mgr/mgrAccount/authCode`,
    autoLogin: `${APIV1}/mgr/mgrAccount/autoLogin`,
    loginOut: `${APIV1}/mgr/mgrAccount/loginOut`,
    userInfo: `${APIV1}/userInfo`,
    users: `${APIV1}/users`,
    posts: `${APIV1}/posts`,
    user: `${APIV1}/user/:id`,
    getMenu: `${APIV1}/mgr/mgrAccount/getMenu`,
    getCurrentTime: `${APIV1}/mgr/mgrAccount/getCurrentTime`,
    getMissionList: `${APIV1}/fee/feeMission/getMissionList`,
    getMissionSimple: `${APIV1}/fee/feeMission/getMissionSimple`,
    getMissionById: `${APIV1}/fee/feeMission/getMissionById`,
    addMission: `${APIV1}/fee/feeMission/addMission`,
    updateMission: `${APIV1}/fee/feeMission/updateMission`,
    updateMissionStatus: `${APIV1}/fee/feeMission/updateMissionStatus`,
    deleteMission: `${APIV1}/fee/feeMission/deleteMission`,
    getMchList: `${APIV1}/fee/feeMission/getMchList`,
    getYearList: `${APIV1}/fee/feeMission/getYearList`,
    getSubjectList: `${APIV1}/fee/feeSubject/getSubjectList`,
    getSubjectByMissId: `${APIV1}/fee/feeSubject/getSubjectByMissId`,
    addSubject: `${APIV1}/fee/feeSubject/addSubject`,
    updateSubject: `${APIV1}/fee/feeSubject/updateSubject`,
    deleteSubject: `${APIV1}/fee/feeSubject/deleteSubject`,
    getRuleList: `${APIV1}/fee/feeRule/getRuleList`,
    updateRule: `${APIV1}/fee/feeRule/updateRule`,
    getRuleStandList: `${APIV1}/fee/feeRule/getRuleStandList`,
    delectRuleStand: `${APIV1}/fee/feeRule/delectRuleStand`,
    updateRuleStand: `${APIV1}/fee/feeRule/updateRuleStand`,
    copyRuleStand: `${APIV1}/fee/feeRule/copyRuleStand`,
    getFeeRuleAttr: `${APIV1}/fee/feeRule/getFeeRuleAttr`,
    updateFeeRuleAttr: `${APIV1}/fee/feeRule/updateFeeRuleAttr`,
    getDeferredStandList: `${APIV1}/fee/feeRule/getDeferredStandList`,
    addDeferredStand: `${APIV1}/fee/feeRule/addDeferredStand`,
    updateDeferredStand: `${APIV1}/fee/feeRule/updateDeferredStand`,
    getDiscountStandList: `${APIV1}/fee/feeRule/getDiscountStandList`,
    addDiscountStand: `${APIV1}/fee/feeRule/addDiscountStand`,
    updateDiscountStand: `${APIV1}/fee/feeRule/updateDiscountStand`,
    getBillList: `${APIV1}/fee/feeBill/getBillList`,
    getBillByUser: `${APIV1}/fee/feeBill/getBillByUser`,
    getBills: `${APIV1}/fee/feeBill/getBills`,
    getBillStatistics: `${APIV1}/fee/feeBill/getBillStatistics`,
    updateBill: `${APIV1}/fee/feeBill/updateBill`,
    updateBatchBill: `${APIV1}/fee/feeBill/updateBatchBill`,
    updateBatchDeferredBill: `${APIV1}/fee/feeBill/updateBatchDeferredBill`,
    updateBatchDiscountBill: `${APIV1}/fee/feeBill/updateBatchDiscountBill`,
    addBatchBill: `${APIV1}/fee/feeBill/addBatchBill`,
    exportBills: `${APIV1}/fee/feeBill/exportBills`,
    getMissionByUser: `${APIV1}/fee/feeBill/getMissionByUser`,
    getOrderByUser: `${APIV1}/fee/feeBill/getOrderByUser`,
    getOrderReturnByUser: `${APIV1}/fee/feeBill/getOrderReturnByUser`,
    completeOrder: `${APIV1}/fee/feeBill/completeOrder`,
    getFeeBillOperateHistory: `${APIV1}/fee/feeBill/getFeeBillOperateHistory`,
    completeOrderReturn: `${APIV1}/order/orderReturn/completeOrderReturn`,
    cancelOrderReturn: `${APIV1}/order/orderReturn/cancelOrderReturn`,
    importBill: `${APIV1}/fee/feeBill/importBill`,
    importBillBySubject: `${APIV1}/fee/feeBill/importBillBySubject`,
    getImportBillPrs: `${APIV1}/fee/feeBill/getImportPrs`,
    coverBill: `${APIV1}/fee/feeBill/coverBill`,
    exportErrorBill: `${APIV1}/fee/feeBill/exportErrorBill`,
    exportRepetitionBill: `${APIV1}/fee/feeBill/exportRepetitionBill`,
    importBillDelete: `${APIV1}/fee/feeBill/importBillDelete`,
    getUserListNoBill: `${APIV1}/fee/feeBill/getUserListNoBill`,
    getDeferredList: `${APIV1}/fee/feeBill/getDeferredList`,
    getDiscountList: `${APIV1}/fee/feeBill/getDiscountList`,
    downloadBillTemp: `${APIV1}/billTemp.xlsx`,
    downloadBillAdjustTemp: `${APIV1}/billAdjustTemp.xlsx`,
    billDeleteTemp: `${APIV1}/billDeleteTemp.xlsx`,
    downloadBillBySubjectTemp: `${APIV1}/billBySubjectTemp.xlsx`,
    downloadOrderTemp: `${APIV1}/orderTemp.xlsx`,
    downloadFeeTemp: `${APIV1}/feeTemp.xlsx`,
    downloadLoanTemp: `${APIV1}/loanTemp.xlsx`,
    downloadFeeLoanTemp: `${APIV1}/feeLoanTemp.xlsx`,
    downloadSubsidyTemp: `${APIV1}/subsidyTemp.xlsx`,
    downloadFeeSubsidyTemp: `${APIV1}/feeSubsidyTemp.xlsx`,
    downloadDeferredTemp: `${APIV1}/deferredTemp.xlsx`,
    downloadDiscountTemp: `${APIV1}/discountTemp.xlsx`,
    downloadDiscountAdjustTemp: `${APIV1}/discountAdjustTemp.xlsx`,
    downloadReturnTemp: `${APIV1}/orderReturnTemp.xlsx`,
    getOrderFeeSum: `${APIV1}/order/order/getOrderFeeSum`,
    getOrderReturnFeeSum: `${APIV1}/order/orderReturn/getOrderReturnFeeSum`,
    getOrderList: `${APIV1}/order/order/getOrderList`,
    getOrderRateList: `${APIV1}/order/order/getOrderRateList`,
    orderReview: `${APIV1}/order/order/orderReview`,
    importOrder: `${APIV1}/order/order/importOrder`,
    importFee: `${APIV1}/order/order/importFee`,
    getImportOrderPrs: `${APIV1}/order/order/getImportPrs`,
    coverOrder: `${APIV1}/order/order/coverOrder`,
    exportErrorOrder: `${APIV1}/order/order/exportErrorOrder`,
    exportRepetitionOrder: `${APIV1}/order/order/exportRepetitionOrder`,
    refundOrder: `${APIV1}/order/order/refundOrder`,
    cancelOrder: `${APIV1}/order/order/cancelOrder`,
    convertOrder: `${APIV1}/order/order/convertOrder`,
    //exportOrder: `${APIV1}/order/order/exportOrder`,
    getOrderPayType: `${APIV1}/order/orderPayType/getOrderPayType`,
    updateOrderPayType: `${APIV1}/order/orderPayType/updateOrderPayType`,
    getOrderReturnList: `${APIV1}/order/orderReturn/getOrderReturnList`,
    //exportOrderReturn: `${APIV1}/order/orderReturn/exportOrderReturn`,
    orderReturnReview: `${APIV1}/order/orderReturn/orderReturnReview`,
    getReturnOrderReconciliation: `${APIV1}/order/orderReturn/getReturnOrderReconciliation`,
    updateReturnOrderReconciliation: `${APIV1}/order/orderReturn/updateReturnOrderReconciliation`,
    // importReturn: `${APIV1}/order/orderReturn/importReturn`,
    // getImportReturnPrs: `${APIV1}/order/orderReturn/getImportPrs`,
    // coverReturn: `${APIV1}/order/orderReturn/coverReturn`,
    // exportErrorReturn: `${APIV1}/order/orderReturn/exportErrorReturn`,
    // exportRepetitionReturn: `${APIV1}/order/orderReturn/exportRepetitionReturn`,
    getLoanList: `${APIV1}/order/order/getLoanList`,
    //cancelLoan: `${APIV1}/order/order/cancelLoan`,
    getLoanType: `${APIV1}/order/order/getLoanType`,
    getSubsidyList: `${APIV1}/order/order/getSubsidyList`,
    //cancelSubsidy: `${APIV1}/order/order/cancelSubsidy`,
    getSubsidyType: `${APIV1}/order/order/getSubsidyType`,
    getOrderReconciliation: `${APIV1}/order/order/getOrderReconciliation`,
    updateOrderReconciliation: `${APIV1}/order/order/updateOrderReconciliation`,
    // importLoan: `${APIV1}/order/order/importLoan`,
    // getImportLoanPrs: `${APIV1}/order/order/getImportPrs`,
    // coverLoan: `${APIV1}/order/order/coverLoan`,
    // exportErrorLoan: `${APIV1}/order/order/exportErrorLoan`,
    // exportRepetitionLoan: `${APIV1}/order/order/exportRepetitionLoan`,
    getMgrAttr: `${APIV1}/mgr/mgrAccount/getMgrAttr`,
    updateMgrAttr: `${APIV1}/mgr/mgrAccount/updateMgrAttr`,
    deleteMgrAttr: `${APIV1}/mgr/mgrAccount/deleteMgrAttr`,
    getMgrAccountList: `${APIV1}/mgr/mgrAccount/getMgrAccountList`,
    getMgrAccount: `${APIV1}/mgr/mgrAccount/getMgrAccount`,
    addMgrAccount: `${APIV1}/mgr/mgrAccount/addMgrAccount`,
    updateMgrAccount: `${APIV1}/mgr/mgrAccount/updateMgrAccount`,
    deleteMgrAccount: `${APIV1}/mgr/mgrAccount/deleteMgrAccount`,
    getMgrDepartTree: `${APIV1}/mgr/mgrDepart/getMgrDepartTree`,
    resetPwd: `${APIV1}/mgr/mgrAccount/updatePwd`,
    updateMyPwd: `${APIV1}/mgr/mgrAccount/updateMyPwd`,
    updateSchool: `${APIV1}/mgr/mgrAccount/updateSchool`,
    getMgrDepart: `${APIV1}/mgr/mgrDepart/getMgrDepart`,
    addMgrDepart: `${APIV1}/mgr/mgrDepart/addMgrDepart`,
    updateMgrDepart: `${APIV1}/mgr/mgrDepart/updateMgrDepart`,
    deleteMgrDepart: `${APIV1}/mgr/mgrDepart/deleteMgrDepart`,
    updateMgrPrivilege: `${APIV1}/mgr/mgrPrivilege/updateMgrPrivilege`,
    getMgrPrivilegeTree: `${APIV1}/mgr/mgrPrivilege/getMgrPrivilegeTree`,
    getStructItemTree: `${APIV1}/struct/structItem/getStructItemTree`,
    getStructList: `${APIV1}/struct/struct/getStructList`,
    updateStruct: `${APIV1}/struct/struct/updateStruct`,
    getStructAttr: `${APIV1}/struct/struct/getStructAttr`,
    addStructAttr: `${APIV1}/struct/struct/addStructAttr`,
    deleteStructAttr: `${APIV1}/struct/struct/deleteStructAttr`,
    getItemList: `${APIV1}/struct/structItem/getItemList`,
    getAllItemList: `${APIV1}/struct/structItem/getAllItemList`,
    addItem: `${APIV1}/struct/structItem/addItem`,
    updateItem: `${APIV1}/struct/structItem/updateItem`,
    deleteItemList: `${APIV1}/struct/structItem/deleteItemList`,
    addItemLabel: `${APIV1}/struct/structItem/addItemLabel`,
    updateItemLabel: `${APIV1}/struct/structItem/updateItemLabel`,
    uploadFile: `${APIV1}/uploadFile`,
    getGroup: `${APIV1}/struct/structGroup/getGroup`,
    addGroup: `${APIV1}/struct/structGroup/addGroup`,
    updateGroup: `${APIV1}/struct/structGroup/updateGroup`,
    deleteGroup: `${APIV1}/struct/structGroup/deleteGroup`,
    addLabel: `${APIV1}/struct/structLabel/addLabel`,
    updateLabel: `${APIV1}/struct/structLabel/updateLabel`,
    deleteLabel: `${APIV1}/struct/structLabel/deleteLabel`,
    getUserAttr: `${APIV1}/user/userAttr/getUserAttr`,
    addUserAttr: `${APIV1}/user/userAttr/addUserAttr`,
    getUserAttrValue: `${APIV1}/user/userAttr/getUserAttrValue`,
    updateUserAttr: `${APIV1}/user/userAttr/updateUserAttr`,
    updateUserAttrStatus: `${APIV1}/user/userAttr/updateUserAttrStatus`,
    getDisplayAttr: `${APIV1}/user/userAttr/getDisplayAttr`,
    getAttrRelateList: `${APIV1}/user/userAttr/getAttrRelateList`,
    getAttrRelatePage: `${APIV1}/user/userAttr/getAttrRelatePage`,
    updateDisplayAttr: `${APIV1}/user/userAttr/updateDisplayAttr`,
    deleteDisplayAttr: `${APIV1}/user/userAttr/deleteDisplayAttr`,
    addUserAttrValue: `${APIV1}/user/userAttr/addUserAttrValue`,
    updateUserAttrValue: `${APIV1}/user/userAttr/updateUserAttrValue`,
    deleteUserAttrValue: `${APIV1}/user/userAttr/deleteUserAttrValue`,
    deleteUserAttr: `${APIV1}/user/userAttr/deleteUserAttr`,
    getUserInfo: `${APIV1}/user/userAccount/getUserInfo`,
    getUserList: `${APIV1}/user/userAccount/getUserList`,
    updateUserInfo: `${APIV1}/user/userAccount/updateUserInfo`,
    deleteUserInfo: `${APIV1}/user/userAccount/deleteUserInfo`,
    importUserInfo: `${APIV1}/user/userAccount/importUserInfo`,
    importConfirm: `${APIV1}/user/userAccount/importConfirm`,
    getImportPrs: `${APIV1}/user/userAccount/getImportPrs`,
    coverUser: `${APIV1}/user/userAccount/coverUser`,
    exportUser: `${APIV1}/user/userAccount/exportUser`,
    getUserTransferInfo: `${APIV1}/user/userAccount/getUserTransferInfo`,
    importUserExcel: `${APIV1}/upload`,
    downloadUserDeleteTemp: `${APIV1}/userDelete.xlsx`,
    importUserDelete: `${APIV1}/user/userAccount/importUserDelete`,
    exportUserModel: `${APIV1}/user/userAccount/exportUserModel`,
    exportRepetitionUser: `${APIV1}/user/userAccount/exportRepetitionUser`,
    exportErrorUser: `${APIV1}/user/userAccount/exportErrorUser`,
    getUserOperate: `${APIV1}/user/userAccount/getUserOperate`,
    getSchool: `${APIV1}/school/school/getSchool`,
    updateSchoolSubmit: `${APIV1}/school/school/updateSchool`,
  	getTemplateText: `${APIV1}/receipt/receiptTemplate/getTemplateText`,
    getTemplateList: `${APIV1}/receipt/receiptTemplate/getTemplateList`,
    updateTemplateText: `${APIV1}/receipt/receiptTemplate/updateTemplateText`,
    updateTemplateList: `${APIV1}/receipt/receiptTemplate/updateTemplateList`,
    addTemplateList: `${APIV1}/receipt/receiptTemplate/addTemplateList`,
    getSetting: `${APIV1}/receipt/receiptSetting/getSetting`,
    updateSetting: `${APIV1}/receipt/receiptSetting/updateSetting`,
    getTextValue: `${APIV1}/receipt/receiptSetting/getTextValue`,
    createBills: `${APIV1}/fee/feeMission/createBills`,
    getCreateBillsPrs: `${APIV1}/fee/feeMission/getCreateBillsPrs`,
    getUserCount: `${APIV1}/user/userAccount/getUserCount`,
    getMessageList: `${APIV1}/message/message/getMessageList`,
    updateMessageStatus: `${APIV1}/message/message/updateMessageStatus`,
    getCount: `${APIV1}/message/message/getCount`,
    getReceiptHistoryList: `${APIV1}/receipt/receiptHistory/getReceiptHistoryList`,
    importReceipt: `${APIV1}/receipt/receiptHistory/importReceipt`,
    getReceiptImportPrs: `${APIV1}/receipt/receiptHistory/getImportPrs`,
    addReceiptHistory: `${APIV1}/receipt/receiptHistory/addReceiptHistory`,
    coverReceipt: `${APIV1}/receipt/receiptHistory/coverReceipt`,
    downloadReceiptTemp: `${APIV1}/receiptTemp.xlsx`,
    exportErrorPrint: `${APIV1}/receipt/receiptHistory/exportErrorPrint`,
    exportRepetitionPrint: `${APIV1}/receipt/receiptHistory/exportRepetitionPrint`,
    deleteReceiptHistory: `${APIV1}/receipt/receiptHistory/deleteReceiptHistory`,
    getOverallStatistics: `${APIV1}/statistics/statisticsOrder/getOverallStatistics`,
    getOverallStatisticsSubject: `${APIV1}/statistics/statisticsOrder/getOverallStatisticsSubject`,
    getArchitectureStatisticsList: `${APIV1}/statistics/statisticsQuery/getArchitectureStatisticsList`,
    getArchitectureStatisticsDetail: `${APIV1}/statistics/statisticsQuery/getArchitectureStatisticsDetail`,
    getArchitectureStatSubject: `${APIV1}/statistics/statisticsQuery/getArchitectureStatSubject`,
    getMissionStatistics: `${APIV1}/statistics/statisticsQuery/getMissionStatistics`,
    getMissionStatisticsDetail: `${APIV1}/statistics/statisticsQuery/getMissionStatisticsDetail`,
    getSubjectStatistics: `${APIV1}/statistics/statisticsQuery/getSubjectStatistics`,
    getSubjectStatisticsDetail: `${APIV1}/statistics/statisticsQuery/getSubjectStatisticsDetail`,
    getTimeStatistics: `${APIV1}/statistics/statisticsQuery/getTimeStatistics`,
    getTimeSubjectStatistics: `${APIV1}/statistics/statisticsQuery/getTimeSubjectStatistics`,
    getTimeMissionStatistics: `${APIV1}/statistics/statisticsQuery/getTimeMissionStatistics`,
    getTimePayTypeStatistics: `${APIV1}/statistics/statisticsQuery/getTimePayTypeStatistics`,
    getStudentStatisticsList: `${APIV1}/statistics/statisticsQuery/getStudentStatisticsList`,
    exportOrderList: `${APIV1}/statistics/export/exportOrderList`,
    exportOrderReturnList: `${APIV1}/statistics/export/exportOrderReturnList`,
    exportStatBills: `${APIV1}/statistics/export/exportFeeBill`,
    exportOverallStatistics: `${APIV1}/statistics/export/exportOverallStatistics`,
    exportDailyStatisticsFeeBill: `${APIV1}/statistics/export/exportDailyStatisticsFeeBill`,
    exportArchitectureStatistics: `${APIV1}/statistics/export/exportArchitectureStatistics`,
    exportMissionStatistics: `${APIV1}/statistics/export/exportMissionStatistics`,
    exportSubjectStatistics: `${APIV1}/statistics/export/exportSubjectStatistics`,
    exportTimeStatistics: `${APIV1}/statistics/export/exportTimeStatistics`,
    exportFeeBillOperateHistory: `${APIV1}/statistics/export/exportFeeBillOperateHistory`,
    getCreditClassList: `${APIV1}/credit/creditClass/getCreditClassList`,
    addCreditClass: `${APIV1}/credit/creditClass/addCreditClass`,
    updateCreditClass: `${APIV1}/credit/creditClass/updateCreditClass`,
    deleteCreditClass: `${APIV1}/credit/creditClass/deleteCreditClass`,
    importCreditClass: `${APIV1}/credit/creditClass/importCreditClass`,
    getImportCreditClassPrs: `${APIV1}/credit/creditClass/getImportPrs`,
    coverCreditClass: `${APIV1}/credit/creditClass/coverCreditClass`,
    exportErrorCreditClass: `${APIV1}/credit/creditClass/exportErrorCreditClass`,
    exportRepetitionCreditClass: `${APIV1}/credit/creditClass/exportRepetitionCreditClass`,
    downloadCreditClassTemp: `${APIV1}/creditClassTemp.xlsx`,
    getCreditRuleList: `${APIV1}/credit/creditRule/getCreditRuleList`,
    updateCreditRule: `${APIV1}/credit/creditRule/updateCreditRule`,
    getCreditBatchList: `${APIV1}/credit/creditBatch/getCreditBatchList`,
    addCreditBatch: `${APIV1}/credit/creditBatch/addCreditBatch`,
    updateCreditBatch: `${APIV1}/credit/creditBatch/updateCreditBatch`,
    deleteCreditBatch: `${APIV1}/credit/creditBatch/deleteCreditBatch`,
    getCreditBatchDetail: `${APIV1}/credit/creditBatch/getCreditBatchDetail`,
    deleteCreditBatchDetail: `${APIV1}/credit/creditBatch/deleteCreditBatchDetail`,
    getCreditStatistics: `${APIV1}/credit/creditBatch/getCreditStatistics`,
    getUserClassDetail: `${APIV1}/credit/creditBatch/getUserClassDetail`,
    getCreditOperateList: `${APIV1}/credit/creditBatch/getCreditOperateList`,
    importCreditBatch: `${APIV1}/credit/creditBatch/importCreditBatch`,
    getImportCreditBatchPrs: `${APIV1}/credit/creditBatch/getImportPrs`,
    coverCreditBatch: `${APIV1}/credit/creditBatch/coverCreditBatch`,
    exportErrorCreditBatch: `${APIV1}/credit/creditBatch/exportErrorCreditBatch`,
    exportRepetitionCreditBatch: `${APIV1}/credit/creditBatch/exportRepetitionCreditBatch`,
    downloadCreditBatchTemp: `${APIV1}/creditBatchTemp.xlsx`,
    getVerifySubjectList: `${APIV1}/verification/verifySubject/getVerifySubjectList`,
    addVerifySubject: `${APIV1}/verification/verifySubject/addVerifySubject`,
    updateVerifySubject: `${APIV1}/verification/verifySubject/updateVerifySubject`,
    deleteVerifySubject: `${APIV1}/verification/verifySubject/deleteVerifySubject`,
    getVerifySubjectStatisticsList: `${APIV1}/verification/verifySubject/getVerifySubjectStatisticsList`,
    addVerifyBill: `${APIV1}/verification/verifySubject/addVerifyBill`,
    updateVerifyBill: `${APIV1}/verification/verifySubject/updateVerifyBill`,
    addVerifyBillScan: `${APIV1}/verification/verifySubject/addVerifyBillScan`,
    getVerifyAccountList: `${APIV1}/verification/verifySubject/getVerifyAccountList`,
    getVerifyBillOperateList: `${APIV1}/verification/verifySubject/getVerifyBillOperateList`,
    getJoinAccountList: `${APIV1}/join/joinAccount/getJoinAccountList`,
    addJoinAccount: `${APIV1}/join/joinAccount/addJoinAccount`,
    getJoinAccountStat: `${APIV1}/join/joinAccount/getJoinAccountStat`,
    updateJoinAccount: `${APIV1}/join/joinAccount/updateJoinAccount`,
    exportJoinAccountStat: `${APIV1}/join/joinAccount/exportJoinAccountStat`,
    getJoinForm: `${APIV1}/join/joinForm/getJoinForm`,
    updateJoinForm: `${APIV1}/join/joinForm/updateJoinForm`,
    getJoinAttr: `${APIV1}/join/joinForm/getJoinAttr`,
    getJoinUserList: `${APIV1}/join/joinUser/getJoinUserList`,
    getJoinUserInfo: `${APIV1}/join/joinUser/getJoinUserInfo`,
    reviewJoinUser: `${APIV1}/join/joinUser/reviewJoinUser`,
    addJoinUser: `${APIV1}/join/joinUser/addJoinUser`,
    updateJoinUser: `${APIV1}/join/joinUser/updateJoinUser`,
    getJoinUserOperate: `${APIV1}/join/joinUser/getJoinUserOperate`,
    exportJoinUser: `${APIV1}/join/joinUser/exportJoinUser`,
    exportJoinUserForm1: `${APIV1}/join/joinUser/exportJoinUserForm1`,
    exportJoinUserForm2: `${APIV1}/join/joinUser/exportJoinUserForm2`,
    getIntentionUserList: `${APIV1}/join/joinUser/getIntentionUserList`,
    updateJoinUserStatus: `${APIV1}/join/joinUser/updateJoinUserStatus`,
    getGroupStatistics: `${APIV1}/group/group/getGroupStatistics`,
    getGroupMgrDepartTree: `${APIV1}/group/group/getGroupMgrDepartTree`,
    updateGroupMgrDepart: `${APIV1}/group/group/updateGroupMgrDepart`,
    updateGroupMgrAccount: `${APIV1}/group/group/updateGroupMgrAccount`,
    deleteGroupMgrDepart: `${APIV1}/group/group/deleteGroupMgrDepart`,
    getGroupMgrAccountList: `${APIV1}/group/group/getGroupMgrAccountList`,
    updateGroupMgrAcc: `${APIV1}/group/group/updateGroupMgrAcc`,
    updatePwd: `${APIV1}/group/group/updatePwd`,
    getGroupTreeStatistics: `${APIV1}/group/group/getGroupTreeStatistics`,
    getDisplayAttrAdmin: `${APIV1}/group/group/getDisplayAttr`,
    updateDisplayAttrAdmin: `${APIV1}/group/group/updateDisplayAttr`,
    deleteDisplayAttrAdmin: `${APIV1}/group/group/deleteDisplayAttr`,
  },
}
