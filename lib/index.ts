import * as RequestBase from 'irequest'
export interface ICrmCommonParams {
  /**
   * 当前操作人的openUserId(对于公海中未分配的客户,需为公海管理员身份)
   */
  currentOpenUserId: string
  /**
   * 对象的api_name
   */
  apiName: string
}
export interface ICrmSearchQueryCondition {
  /**
   * term_condition:表示精确匹配(目前只支持这种)
   */
  conditionType: "term_condition"
  conditions: {
    [name: string]: any
  }
}
export interface ICrmSearchQueryRangeCondition {
  fieldName: string
  from: string
  to: string
}
export interface ICrmSearchQueryOrder {
  /**
   * true 表示正序 false 表示倒序
   */
  ascending: boolean
  /**
   * 字段名
   */
  field: string
}
export interface ICrmSearchQuery {
  currentOpenUserId: string
  apiName: string
  conditions: ICrmSearchQueryCondition[]
  dataProjection: {
    fieldNames: string[]
  }
  limit: number
  offset: number
  orders: ICrmSearchQueryOrder
  rangeConditions: ICrmSearchQueryRangeCondition[]
}
export interface ICrmDataQueryParams extends ICrmCommonParams {
  searchQuery: ICrmSearchQuery
}
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
export interface ICommomReturn {
  /**
   * 返回码
   */
  errorCode: number
  /**
   * 对返回码的文本描述内容
   */
  errorMessage: string
}
export interface IGetCorpAccessToken extends ICommomReturn {
  /**
   * 企业应用访问公司合法性凭证
   */
  corpAccessToken: string
  /**
   * 开放平台派发的公司帐号
   */
  corpId: string
  /**
   * 企业应用访问公司合法性凭证的过期时间，单位为秒，取值在0~7200之间
   */
  expiresIn: number
}
export interface IGetAppAccessToken extends ICommomReturn {
  /**
   * 企业应用获取到的凭证
   */
  appAccessToken: string
  /**
   * 企业应用获取到的凭证的过期时间，单位为秒，取值在0~2592000之间
   */
  expiresIn: number
}
export interface IGetJsApiTicket extends ICommomReturn {
  /**
   * 临时票据
   */
  ticket: string
  /**
   * ticket有效时间,以秒为单位
   */
  expiresIn: number
}
export interface IDepartment {
  /**
   * 部门ID
   */
  id: number
  /**
   * 部门名称
   */
  name: string
  /**
   * 父部门ID，根部门ID为0，其它部门Id为非负整数
   */
  parentId: number
  /**
   * 		是否停用（true表示停用，false表示正常）
   */
  isStop: boolean
  /**
   * 部门排序，序号越小，排序越靠前。最小值为1
   */
  order: number
}
export interface IDepartmentList extends ICommomReturn {
  departments: IDepartment[]
}
const ApiHost = '${ApiHost}'
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
  commonRequestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }
  constructor(options: fxiaokeOptions) {
    super(options.debug)
    this.options = options
  }
  /**
   * 获取 CorpAccessToken
   * @see http://open.fxiaoke.com/wiki.html#artiId=17
   */
  getCorpAccessToken(): Promise<IGetCorpAccessToken> {
    return this.request(`${ApiHost}/cgi/corpAccessToken/get/V2`, {
      ...this.commonRequestOptions,
      body: JSON.stringify({
        appId: this.options.appId,
        appSecret: this.options.appSecret,
        permanentCode: this.options.permanentCode,
      }),
    }) as Promise<IGetCorpAccessToken>
  }
  /**
   * 获取 AppAccessToken
   * AppAccessToken是应用的全局唯一票据，需要AppId和AppSecret来换取，不同的AppSecret会返回不同的AppAccessToken
   * @see http://open.fxiaoke.com/wiki.html#artiId=17
   */
  getAppAccessToken(): Promise<IGetAppAccessToken> {
    return this.request(`${ApiHost}/cgi/appAccessToken/get`, {
      ...this.commonRequestOptions,
      body: JSON.stringify({
        appId: this.options.appId,
        appSecret: this.options.appSecret,
      }),
    }) as Promise<IGetAppAccessToken>
  }
  initCorpAccessToken() {
    return Promise.resolve().then(() => {
      let now = Date.now()
      if (now < this.corpAccessTokenDeadline) {
        return
      }
      return this.getCorpAccessToken().then(reply => {
        if (reply.errorCode !== 0) {
          return Promise.reject({
            status: 400,
            stack: ['6aba4c44787dbdbb88c03ba6ac4c48fa'],
            desc: reply['errorMessage'],
          })
        }
        this.corpAccessToken = reply['corpAccessToken']
        this.corpId = reply['corpId']
        this.corpAccessTokenDeadline += now + reply['expiresIn'] * 1000
      })
    })
  }
  /**
   * 获取 JsapiTicket
   * @see http://open.fxiaoke.com/wiki.html#artiId=17
   */
  getJsApiTicket(): Promise<IGetJsApiTicket> {
    return this.initCorpAccessToken().then(() => {
      return this.request(`${ApiHost}/cgi/jsApiTicket/get`, {
        ...this.commonRequestOptions,
        body: JSON.stringify({
          corpAccessToken: this.corpAccessToken,
          corpId: this.corpId,
        }),
      })
    }) as Promise<IGetJsApiTicket>
  }
  /**
   * 获取部门列表
   * @see http://open.fxiaoke.com/wiki.html#artiId=20
   */
  departmentList(): Promise<IDepartmentList> {
    return this.initCorpAccessToken().then(() => {
      return this.request(`${ApiHost}/cgi/department/list`, {
        ...this.commonRequestOptions,
        body: JSON.stringify({
          corpAccessToken: this.corpAccessToken,
          corpId: this.corpId,
        }),
      })
    }) as Promise<IDepartmentList>
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
      return this.request(`${ApiHost}/cgi/department/add`, {
        ...this.commonRequestOptions,
        body: JSON.stringify({
          corpAccessToken: this.corpAccessToken,
          corpId: this.corpId,
          department: {
            name: name,
            parentId: parentId,
            principalOpenUserId: principalOpenUserId
          },
        }),
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
      return this.request(`${ApiHost}/cgi/user/simpleList`, {
        ...this.commonRequestOptions,
        body: JSON.stringify({
          corpAccessToken: this.corpAccessToken,
          corpId: this.corpId,
          departmentId: departmentId,
          fetchChild: fetchChild,
        }),
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
      return this.request(`${ApiHost}/cgi/crm/object/list`, {
        ...this.commonRequestOptions,
        body: JSON.stringify({
          corpAccessToken: this.corpAccessToken,
          corpId: this.corpId,
          currentOpenUserId: currentOpenUserId,
        }),
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
      return this.request(`${ApiHost}/cgi/crm/object/describe`, {
        ...this.commonRequestOptions,
        body: JSON.stringify({
          corpAccessToken: this.corpAccessToken,
          corpId: this.corpId,
          currentOpenUserId: currentOpenUserId,
          apiName: apiName,
        }),
      })
    })
  }
  /**
   * 查询对象数据
   * @see http://open.fxiaoke.com/wiki.html#artiId=207
   * @param params 请求参数
   */
  crmDataQuery(params: ICrmDataQueryParams) {
    return this.initCorpAccessToken().then(() => {
      return this.request(`${ApiHost}/cgi/crm/data/query`, {
        ...this.commonRequestOptions,
        body: JSON.stringify({
          corpAccessToken: this.corpAccessToken,
          corpId: this.corpId,
          currentOpenUserId: params.currentOpenUserId,
          apiName: params.apiName,
        }),
      })
    })
  }
}