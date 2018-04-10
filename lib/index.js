"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RequestBase = require("irequest");
const ApiHost = "https://open.fxiaoke.com";
class fxiaoke extends RequestBase.RequestBase {
    constructor(options) {
        super(options.debug);
        /**
         * 企业应用访问公司合法性凭证到期时间
         */
        this.corpAccessTokenDeadline = 0;
        this.commonRequestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        };
        this.options = options;
    }
    /**
     * 获取 CorpAccessToken
     * @see http://open.fxiaoke.com/wiki.html#artiId=17
     */
    getCorpAccessToken() {
        return this.request(`${ApiHost}/cgi/corpAccessToken/get/V2`, Object.assign({}, this.commonRequestOptions, { body: JSON.stringify({
                appId: this.options.appId,
                appSecret: this.options.appSecret,
                permanentCode: this.options.permanentCode
            }) }));
    }
    /**
     * 获取 AppAccessToken
     * AppAccessToken是应用的全局唯一票据，需要AppId和AppSecret来换取，不同的AppSecret会返回不同的AppAccessToken
     * @see http://open.fxiaoke.com/wiki.html#artiId=17
     */
    getAppAccessToken() {
        return this.request(`${ApiHost}/cgi/appAccessToken/get`, Object.assign({}, this.commonRequestOptions, { body: JSON.stringify({
                appId: this.options.appId,
                appSecret: this.options.appSecret
            }) }));
    }
    initCorpAccessToken() {
        return Promise.resolve().then(() => {
            let now = Date.now();
            if (now < this.corpAccessTokenDeadline) {
                return;
            }
            return this.getCorpAccessToken().then(reply => {
                if (reply.errorCode !== 0) {
                    return Promise.reject({
                        status: 400,
                        stack: ['3cafbc509378727beb5df05c366004de'],
                        desc: reply["errorMessage"]
                    });
                }
                this.corpAccessToken = reply["corpAccessToken"];
                this.corpId = reply["corpId"];
                this.corpAccessTokenDeadline = now + reply["expiresIn"] * 1000;
            });
        });
    }
    /**
     * 获取 JsapiTicket
     * @see http://open.fxiaoke.com/wiki.html#artiId=17
     */
    getJsApiTicket() {
        return this.initCorpAccessToken().then(() => {
            return this.request(`${ApiHost}/cgi/jsApiTicket/get`, Object.assign({}, this.commonRequestOptions, { body: JSON.stringify({
                    corpAccessToken: this.corpAccessToken,
                    corpId: this.corpId
                }) }));
        });
    }
    /**
     * 获取部门列表
     * @see http://open.fxiaoke.com/wiki.html#artiId=20
     */
    departmentList() {
        return this.initCorpAccessToken().then(() => {
            return this.request(`${ApiHost}/cgi/department/list`, Object.assign({}, this.commonRequestOptions, { body: JSON.stringify({
                    corpAccessToken: this.corpAccessToken,
                    corpId: this.corpId
                }) }));
        });
    }
    /**
     * 添加部门
     * @see http://open.fxiaoke.com/wiki.html#artiId=32
     * @param name 部门名称(不能重复，只支持字母，数字，汉字，短横线 -, 下划线 _ )
     * @param parentId 父部门ID(顶级部门为 0)
     * @param principalOpenUserId 部门负责人开放平台员工账号
     */
    departmentAdd(name, parentId, principalOpenUserId) {
        return this.initCorpAccessToken().then(() => {
            return this.request(`${ApiHost}/cgi/department/add`, Object.assign({}, this.commonRequestOptions, { body: JSON.stringify({
                    corpAccessToken: this.corpAccessToken,
                    corpId: this.corpId,
                    department: {
                        name: name,
                        parentId: parentId,
                        principalOpenUserId: principalOpenUserId
                    }
                }) }));
        });
    }
    /**
     * 获取部门下成员信息(简略)
     * @see http://open.fxiaoke.com/wiki.html#artiId=21
     * @param departmentId 部门ID, 为非负整数
     * @param fetchChild 如果为true，则同时获取其所有子部门员工; 如果为false或者不传，则只获取当前部门员工
     */
    userSimpleList(departmentId, fetchChild) {
        return this.initCorpAccessToken().then(() => {
            return this.request(`${ApiHost}/cgi/user/simpleList`, Object.assign({}, this.commonRequestOptions, { body: JSON.stringify({
                    corpAccessToken: this.corpAccessToken,
                    corpId: this.corpId,
                    departmentId: departmentId,
                    fetchChild: fetchChild
                }) }));
        });
    }
    /**
     * 获取部门下成员信息(详细)
     * @see http://open.fxiaoke.com/wiki.html#artiId=22
     * @param departmentId 部门ID, 为非负整数
     * @param fetchChild 如果为true，则同时获取其所有子部门员工; 如果为false或者不传，则只获取当前部门员工
     * @param showDepartmentIdsDetail 如果为true，则会返回员工主属部门(mainDepartmentId)与附属部门(attachingDepartmentIds)
     */
    userList(departmentId, fetchChild, showDepartmentIdsDetail) {
        return this.initCorpAccessToken().then(() => {
            return this.request(`${ApiHost}/cgi/user/list`, Object.assign({}, this.commonRequestOptions, { body: JSON.stringify({
                    corpAccessToken: this.corpAccessToken,
                    corpId: this.corpId,
                    departmentId: departmentId,
                    fetchChild: fetchChild,
                    showDepartmentIdsDetail: showDepartmentIdsDetail
                }) }));
        });
    }
    /**
     * 添加成员
     * @see http://open.fxiaoke.com/wiki.html#artiId=35
     * @param user 二级对象(人员实体)
     */
    userAdd(user) {
        return this.initCorpAccessToken().then(() => {
            return this.request(`${ApiHost}/cgi/user/add`, Object.assign({}, this.commonRequestOptions, { body: JSON.stringify({
                    corpAccessToken: this.corpAccessToken,
                    corpId: this.corpId,
                    user: user
                }) }));
        });
    }
    /**
     * 获取企业CRM对象列表(包含预置对象和自定义对象)
     *
     * @see http://open.fxiaoke.com/wiki.html#artiId=207
     */
    crmObjectList() {
        return this.initCorpAccessToken().then(() => {
            return this.request(`${ApiHost}/cgi/crm/object/list`, Object.assign({}, this.commonRequestOptions, { body: JSON.stringify({
                    corpAccessToken: this.corpAccessToken,
                    corpId: this.corpId,
                    currentOpenUserId: this.options.currentOpenUserId
                }) }));
        });
    }
    /**
     * 获取对象描述
     * @see http://open.fxiaoke.com/wiki.html#artiId=207
     * @param apiName 对象的api_name
     */
    crmObjectDescribe(apiName) {
        return this.initCorpAccessToken().then(() => {
            return this.request(`${ApiHost}/cgi/crm/object/describe`, Object.assign({}, this.commonRequestOptions, { body: JSON.stringify({
                    corpAccessToken: this.corpAccessToken,
                    corpId: this.corpId,
                    currentOpenUserId: this.options.currentOpenUserId,
                    apiName: apiName
                }) }));
        });
    }
    /**
     * 查询对象数据
     * @see http://open.fxiaoke.com/wiki.html#artiId=207
     * @param apiName 对象的api_name
     * @param params 请求参数
     */
    crmDataQuery(apiName, searchQuery) {
        return this.initCorpAccessToken().then(() => {
            return this.request(`${ApiHost}/cgi/crm/data/query`, Object.assign({}, this.commonRequestOptions, { body: JSON.stringify({
                    corpAccessToken: this.corpAccessToken,
                    corpId: this.corpId,
                    currentOpenUserId: this.options.currentOpenUserId,
                    apiName: apiName,
                    searchQuery: searchQuery
                }) }));
        });
    }
    /**
     * 根据Id获取对象数据
     * @see http://open.fxiaoke.com/wiki.html#artiId=207
     * @param apiName 对象的api_name; SalesOrderProductObj(订单关联产品)对象不支持该操作
     * @param dataId 数据Id
     */
    crmDataGet(apiName, dataId) {
        return this.initCorpAccessToken().then(() => {
            return this.request(`${ApiHost}/cgi/crm/data/get`, Object.assign({}, this.commonRequestOptions, { body: JSON.stringify({
                    corpAccessToken: this.corpAccessToken,
                    corpId: this.corpId,
                    currentOpenUserId: this.options.currentOpenUserId,
                    apiName: apiName,
                    dataId: dataId
                }) }));
        });
    }
    /**
     * 新增对象数据
     * @see http://open.fxiaoke.com/wiki.html#artiId=207
     * @param apiName 对象的api_name
     * @param data 对象数据Map（和对象描述中字段一一对应）
     */
    crmDataCreate(apiName, data) {
        return this.initCorpAccessToken().then(() => {
            return this.request(`${ApiHost}/cgi/crm/data/create`, Object.assign({}, this.commonRequestOptions, { body: JSON.stringify({
                    corpAccessToken: this.corpAccessToken,
                    corpId: this.corpId,
                    currentOpenUserId: this.options.currentOpenUserId,
                    apiName: apiName,
                    data: data
                }) }));
        });
    }
    /**
     * 更新对象数据
     * @see http://open.fxiaoke.com/wiki.html#artiId=207
     * @param apiName 对象的api_name
     * @param dataId 数据Id
     * @param data 对象数据Map（和对象描述中字段一一对应）
     */
    crmDataUpdate(apiName, dataId, data) {
        return this.initCorpAccessToken().then(() => {
            return this.request(`${ApiHost}/cgi/crm/data/update`, Object.assign({}, this.commonRequestOptions, { body: JSON.stringify({
                    corpAccessToken: this.corpAccessToken,
                    corpId: this.corpId,
                    currentOpenUserId: this.options.currentOpenUserId,
                    apiName: apiName,
                    dataId: dataId,
                    data: data
                }) }));
        });
    }
}
exports.fxiaoke = fxiaoke;
