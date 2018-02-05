import * as RequestBase from 'irequest'

export interface fxiaokeOptions {
  /**
   * 是否开启调试信息
   */
  debug: boolean
  /**
   * 企业应用ID
   */
  appId: string
  /**
   * 企业应用凭证密钥
   */
  appSecret: string
  /**
   * 企业应用获得的公司永久授权码
   */
  permanentCode: string
}

export class fxiaoke extends RequestBase.RequestBase {
  options: fxiaokeOptions
  /**
   * 企业应用访问公司合法性凭证
   */
  corpAccessToken: string
  /**
   * 开放平台派发的公司帐号
   */
  corpId: string
  /**
   * 企业应用访问公司合法性凭证到期时间
   */
  corpAccessTokenDeadline: number = 0

  constructor(options: fxiaokeOptions) {
    super(options.debug)
    this.options = options
  }

  /**
   * 获取 CorpAccessToken
   */
  getCorpAccessToken() {
    return this.request(`https://open.fxiaoke.com/cgi/corpAccessToken/get/V2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appId: this.options.appId,
        appSecret: this.options.appSecret,
        permanentCode: this.options.permanentCode,
      })
    })
  }

  getAppAccessToken() {
    return this.request(`https://open.fxiaoke.com/cgi/appAccessToken/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appId: this.options.appId,
        appSecret: this.options.appSecret,
      })
    })
  }

  initCorpAccessToken() {
    return Promise.resolve().then(() => {
      let now = Date.now()
      if (now < this.corpAccessTokenDeadline) {
        return
      }
      return this.getCorpAccessToken().then(reply => {
        if (reply['errorCode'] !== 0) {
          return Promise.reject({
            status: 400,
            stack: ['<jdists encoding="md5">^linenum</jdists>'],
            desc: reply['errorMessage'],
          })
        }

        this.corpAccessToken = reply['corpAccessToken']
        this.corpId = reply['corpId']
        this.corpAccessTokenDeadline += now + reply['expiresIn'] * 1000
      })
    })
  }

  getJsApiTicket() {
    return this.initCorpAccessToken().then(() => {
      return this.request(`https://open.fxiaoke.com/cgi/jsApiTicket/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          corpAccessToken: this.corpAccessToken,
          corpId: this.corpId,
        })
      })
    })
  }

  /**
   * 获取部门列表
   * @see http://open.fxiaoke.com/wiki.html#artiId=20
   */
  departmentList() {
    return this.initCorpAccessToken().then(() => {
      return this.request(`https://open.fxiaoke.com/cgi/department/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          corpAccessToken: this.corpAccessToken,
          corpId: this.corpId,
        })
      })
    })
  }

  /**
   * 添加部门
   * @see http://open.fxiaoke.com/wiki.html#artiId=32
   * @param name 部门名称(不能重复，只支持字母，数字，汉字，短横线 -, 下划线 _ )
   * @param parentId 父部门ID(顶级部门为 0)
   * @param principalOpenUserId 部门负责人开放平台员工账号
   */
  departmentAdd(name: string, parentId: number, principalOpenUserId?: string) {
    return this.initCorpAccessToken().then(() => {
      return this.request(`https://open.fxiaoke.com/cgi/department/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          corpAccessToken: this.corpAccessToken,
          corpId: this.corpId,
          department: {
            name: name,
            parentId: parentId,
            principalOpenUserId: principalOpenUserId
          },
        })
      })
    })
  }

  /**
   * 获取部门下成员信息(简略)
   * @see http://open.fxiaoke.com/wiki.html#artiId=21
   * @param departmentId 部门ID, 为非负整数
   * @param fetchChild 如果为true，则同时获取其所有子部门员工; 如果为false或者不传，则只获取当前部门员工
   */
  userSimpleList(departmentId: number, fetchChild?: boolean) {
    return this.initCorpAccessToken().then(() => {
      return this.request(`https://open.fxiaoke.com/cgi/user/simpleList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          corpAccessToken: this.corpAccessToken,
          corpId: this.corpId,
          departmentId: departmentId,
          fetchChild: fetchChild,
        })
      })
    })
  }

  /**
   * 获取企业CRM对象列表(包含预置对象和自定义对象)
   *
   * @see http://open.fxiaoke.com/wiki.html#artiId=207
   * @param currentOpenUserId 当前操作人的openUserId
   */
  crmObjectList(currentOpenUserId: string) {
    return this.initCorpAccessToken().then(() => {
      return this.request(`https://open.fxiaoke.com/cgi/crm/object/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          corpAccessToken: this.corpAccessToken,
          corpId: this.corpId,
          currentOpenUserId: currentOpenUserId,
        })
      })
    })
  }

  /**
   * 获取对象描述
   * @see http://open.fxiaoke.com/wiki.html#artiId=207
   * @param currentOpenUserId 当前操作人的openUserId
   * @param apiName 对象的api_name
   */
  crmObjectDescribe(currentOpenUserId: string, apiName: string) {
    return this.initCorpAccessToken().then(() => {
      return this.request(`https://open.fxiaoke.com/cgi/crm/object/describe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          corpAccessToken: this.corpAccessToken,
          corpId: this.corpId,
          currentOpenUserId: currentOpenUserId,
          apiName: apiName,
        })
      })
    })
  }
}