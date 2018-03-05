import * as RequestBase from "irequest";

export interface ICrmCommonParams {
  /**
   * 当前操作人的openUserId(对于公海中未分配的客户,需为公海管理员身份)
   */
  currentOpenUserId: string;
  /**
   * 对象的api_name
   */
  apiName: string;
}

export interface ICrmSearchQueryCondition {
  /**
   * term_condition:表示精确匹配(目前只支持这种)
   */
  conditionType: "term_condition";
  conditions: {
    [name: string]: any;
  };
}

export interface ICrmSearchQueryRangeCondition {
  fieldName: string;
  from: string;
  to: string;
}

export interface ICrmSearchQueryOrder {
  /**
   * true 表示正序 false 表示倒序
   */
  ascending: boolean;
  /**
   * 字段名
   */
  field: string;
}

export interface ICrmSearchQuery {
  currentOpenUserId: string;
  apiName: string;
  conditions: ICrmSearchQueryCondition[];
  dataProjection: {
    fieldNames: string[];
  };
  limit: number;
  offset: number;
  orders: ICrmSearchQueryOrder;
  rangeConditions: ICrmSearchQueryRangeCondition[];
}

export interface ICrmDataQueryParams extends ICrmCommonParams {
  searchQuery: ICrmSearchQuery;
}

export interface fxiaokeOptions {
  /**
   * 是否开启调试信息
   */
  debug: boolean;
  /**
   * 企业应用ID
   */
  appId: string;
  /**
   * 企业应用凭证密钥
   */
  appSecret: string;
  /**
   * 企业应用获得的公司永久授权码
   */
  permanentCode: string;
}

export interface ICommomReturn {
  /**
   * 返回码
   */
  errorCode: number;
  /**
   * 对返回码的文本描述内容
   */
  errorMessage: string;
}

export interface IGetCorpAccessToken extends ICommomReturn {
  /**
   * 企业应用访问公司合法性凭证
   */
  corpAccessToken: string;
  /**
   * 开放平台派发的公司帐号
   */
  corpId: string;
  /**
   * 企业应用访问公司合法性凭证的过期时间，单位为秒，取值在0~7200之间
   */
  expiresIn: number;
}

export interface IGetAppAccessToken extends ICommomReturn {
  /**
   * 企业应用获取到的凭证
   */
  appAccessToken: string;
  /**
   * 企业应用获取到的凭证的过期时间，单位为秒，取值在0~2592000之间
   */
  expiresIn: number;
}

export interface IGetJsApiTicket extends ICommomReturn {
  /**
   * 临时票据
   */
  ticket: string;
  /**
   * ticket有效时间,以秒为单位
   */
  expiresIn: number;
}

export interface IDepartment {
  /**
   * 部门ID
   */
  id: number;
  /**
   * 部门名称
   */
  name: string;
  /**
   * 父部门ID，根部门ID为0，其它部门Id为非负整数
   */
  parentId: number;
  /**
   * 		是否停用（true表示停用，false表示正常）
   */
  isStop: boolean;
  /**
   * 部门排序，序号越小，排序越靠前。最小值为1
   */
  order: number;
}

export interface IDepartmentList extends ICommomReturn {
  departments: IDepartment[];
}

export interface IDepartmentAdd extends ICommomReturn {
  departmentId: number;
  order: number;
}

export interface IUserSimpleList extends ICommomReturn {
  userlist: {
    /**
     * 开放平台员工帐号
     */
    openUserId: string;
    /**
     * 员工姓名
     */
    name: string;
  }[];
}

export interface ICrmObjectList extends ICommomReturn {
  /**
   * 对象列表（对象类型数组）
   */
  objects: {
    /**
     * 对象api名称(自定义对象api_name以__c结尾)
     */
    api_name: string;
    /**
     * 对象显示名称
     */
    display_name: string;
  }[];
}

export interface IEmbeddedFieldDesc {
  type:
    | "object_reference"
    | "email"
    | "phone_number"
    | "true_or_false"
    | "text"
    | "long_text"
    | "date_time"
    | "number"
    | "select_one"
    | "select_many"
    | "file_attachment"
    | "image"
    | "employee"
    | "country"
    | "province"
    | "city"
    | "district";
  define_type: "system" | "package" | "custom";
  is_index: boolean;
  round_mode: number;
  length: number;
  is_need_convert: boolean;
  decimal_places: number;
  is_unique: boolean;
  is_required: boolean;
  max_length: number;
  pattern: string;
  api_name: string;
  label: string;
  description: string;
}

export interface IFieldDesc {
  /**
   * 字段类型
   */
  type:
    | "object_reference"
    | "email"
    | "phone_number"
    | "true_or_false"
    | "text"
    | "long_text"
    | "date_time"
    | "number"
    | "select_one"
    | "select_many"
    | "embedded_object_list"
    | "file_attachment"
    | "image"
    | "employee"
    | "country"
    | "province"
    | "city"
    | "district";
  /**
   * 内嵌字段
   */
  embedded_fields?: {
    [name: string]: IEmbeddedFieldDesc;
  };
  /**
   * 定义类型
   * system:系统内置，package:包（业务应用）定义，custom:企业客户定义
   */
  define_type: "system" | "package" | "custom";
  /**
   * 字段api_name
   * 用于数据操作时对字段的唯一标识
   */
  api_name: string;
  /**
   * 是否必填
   * 添加时候是否必须输入
   */
  is_required: boolean;
  /**
   * 是否启用
   * 用于表示该字段是否生效，false表示该字段被隐藏(禁用)，管理员可以从字段管理中打开
   */
  is_active: boolean;
  /**
   * 是否自动编号
   * 自动编号的字段添加、更新时不允许输入
   */
  is_auto_number?: boolean;
  /**
   * 是否需要转换
   * 需要转换的字段,输入和返回值都是合法的openUserId
   */
  is_need_convert: boolean;
  /**
   * 字段描述
   */
  description: string;
  /**
   * 帮助信息
   */
  help_text: string;
  /**
   * 字段显示名称
   */
  label: string;
}

export interface ICrmObjectDescribe extends ICommomReturn {
  objectDesc: {
    fields: {
      [name: string]: IFieldDesc;
    };
  };
}

export interface ICrmDataQuery {
  /**
   * 总记录数
   */
  totalNumber: number;
  /**
   * 数据列表
   */
  datas: {
    [name: string]: any;
  }[];
}

const ApiHost = "https://open.fxiaoke.com";

export class fxiaoke extends RequestBase.RequestBase {
  options: fxiaokeOptions;
  /**
   * 企业应用访问公司合法性凭证
   */
  corpAccessToken: string;
  /**
   * 开放平台派发的公司帐号
   */
  corpId: string;
  /**
   * 企业应用访问公司合法性凭证到期时间
   */
  corpAccessTokenDeadline: number = 0;

  commonRequestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  };

  constructor(options: fxiaokeOptions) {
    super(options.debug);
    this.options = options;
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
        permanentCode: this.options.permanentCode
      })
    }) as Promise<IGetCorpAccessToken>;
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
        appSecret: this.options.appSecret
      })
    }) as Promise<IGetAppAccessToken>;
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
            stack: ['<!--jdists encoding="md5">^linenum</jdists-->'],
            desc: reply["errorMessage"]
          });
        }

        this.corpAccessToken = reply["corpAccessToken"];
        this.corpId = reply["corpId"];
        this.corpAccessTokenDeadline += now + reply["expiresIn"] * 1000;
      });
    });
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
          corpId: this.corpId
        })
      });
    }) as Promise<IGetJsApiTicket>;
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
          corpId: this.corpId
        })
      });
    }) as Promise<IDepartmentList>;
  }

  /**
   * 添加部门
   * @see http://open.fxiaoke.com/wiki.html#artiId=32
   * @param name 部门名称(不能重复，只支持字母，数字，汉字，短横线 -, 下划线 _ )
   * @param parentId 父部门ID(顶级部门为 0)
   * @param principalOpenUserId 部门负责人开放平台员工账号
   */
  departmentAdd(
    name: string,
    parentId: number,
    principalOpenUserId?: string
  ): Promise<IDepartmentAdd> {
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
          }
        })
      });
    }) as Promise<IDepartmentAdd>;
  }

  /**
   * 获取部门下成员信息(简略)
   * @see http://open.fxiaoke.com/wiki.html#artiId=21
   * @param departmentId 部门ID, 为非负整数
   * @param fetchChild 如果为true，则同时获取其所有子部门员工; 如果为false或者不传，则只获取当前部门员工
   */
  userSimpleList(
    departmentId: number,
    fetchChild?: boolean
  ): Promise<IUserSimpleList> {
    return this.initCorpAccessToken().then(() => {
      return this.request(`${ApiHost}/cgi/user/simpleList`, {
        ...this.commonRequestOptions,
        body: JSON.stringify({
          corpAccessToken: this.corpAccessToken,
          corpId: this.corpId,
          departmentId: departmentId,
          fetchChild: fetchChild
        })
      });
    }) as Promise<IUserSimpleList>;
  }

  /**
   * 获取企业CRM对象列表(包含预置对象和自定义对象)
   *
   * @see http://open.fxiaoke.com/wiki.html#artiId=207
   * @param currentOpenUserId 当前操作人的openUserId
   */
  crmObjectList(currentOpenUserId: string): Promise<ICrmObjectList> {
    return this.initCorpAccessToken().then(() => {
      return this.request(`${ApiHost}/cgi/crm/object/list`, {
        ...this.commonRequestOptions,
        body: JSON.stringify({
          corpAccessToken: this.corpAccessToken,
          corpId: this.corpId,
          currentOpenUserId: currentOpenUserId
        })
      });
    }) as Promise<ICrmObjectList>;
  }

  /**
   * 获取对象描述
   * @see http://open.fxiaoke.com/wiki.html#artiId=207
   * @param currentOpenUserId 当前操作人的openUserId
   * @param apiName 对象的api_name
   */
  crmObjectDescribe(
    currentOpenUserId: string,
    apiName: string
  ): Promise<ICrmObjectDescribe> {
    return this.initCorpAccessToken().then(() => {
      return this.request(`${ApiHost}/cgi/crm/object/describe`, {
        ...this.commonRequestOptions,
        body: JSON.stringify({
          corpAccessToken: this.corpAccessToken,
          corpId: this.corpId,
          currentOpenUserId: currentOpenUserId,
          apiName: apiName
        })
      });
    }) as Promise<ICrmObjectDescribe>;
  }
  /**
   * 查询对象数据
   * @see http://open.fxiaoke.com/wiki.html#artiId=207
   * @param params 请求参数
   */
  crmDataQuery(params: ICrmDataQueryParams): Promise<ICrmDataQuery> {
    return this.initCorpAccessToken().then(() => {
      return this.request(`${ApiHost}/cgi/crm/data/query`, {
        ...this.commonRequestOptions,
        body: JSON.stringify({
          corpAccessToken: this.corpAccessToken,
          corpId: this.corpId,
          currentOpenUserId: params.currentOpenUserId,
          apiName: params.apiName
        })
      });
    }) as Promise<ICrmDataQuery>;
  }
}
