import fetch from 'dva/fetch';
import { notification ,message} from 'antd';
import router from 'umi/router';
import hash from 'hash.js';
import { isAntdPro } from './utils';
import { getLocale,formatMessage } from 'umi/locale';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
  512: '租户到期。',
  511: '不是可信主机。'
  // 510: '服务器数据插入失败,请检查是否重名。',
};

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if(response.status == 511 || response.status == 512){
    let data = {status : response.status, errMsg : codeMessage[response.status]};
    return data;
  }else if(response.status == 510){
    let data = {status : response.status, errMsg : decodeURI(escape(response.headers.get('x-error-string')))};
    return data;
  }else{
    const errortext = codeMessage[response.status] || response.statusText;
    // notification.error({
    //   message: `请求错误 ${response.status}: ${response.url}`,
    //   description: errortext,
    // });
    console.log(`请求错误 ${response.status}: ${errortext}`);
  
    const error = new Error(errortext);
    error.name = response.status;
    error.response = response;
    throw error;
  }
};

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get('x-total-record');
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then(content => {
        sessionStorage.setItem(hashcode, content,contentType);
        sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option) {
  
  const options = {
    expirys: isAntdPro(),
    ...option,
  };
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  if(url.indexOf('?') == -1){
    url += '?lang' + (getLocale()=='zh-CN'? 0 : 1)
  }else{
    url += '&lang=' + (getLocale()=='zh-CN'? 0 : 1) 
  }
  const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest('hex');

  const defaultOptions = {
    credentials: 'include',
    // redirect: 'manual'  //设置manual后不会抛出异常，但会获取到一个被过滤过后的response
  };
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    
    if (!(newOptions.body instanceof FormData)) {
      
      if(url.indexOf("/honeypot/post/setting") >= 0){
        newOptions.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          ...newOptions.headers,
        }; 
      }else{
        newOptions.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          ...newOptions.headers,
        };
        newOptions.body = JSON.stringify(newOptions.body);
      }
      
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  
  const expirys = options.expirys && 60;
  // options.expirys !== false, return the cache,
  if (options.expirys !== false) {
    const cached = sessionStorage.getItem(hashcode);
    const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
    if (cached !== null && whenCached !== null) {
      const age = (Date.now() - whenCached) / 1000;
      if (age < expirys) {
        const response = new Response(new Blob([cached]));
        return response.json();
      }
      sessionStorage.removeItem(hashcode);
      sessionStorage.removeItem(`${hashcode}:timestamp`);
    }
  }
  return Promise.race([fetch(url, newOptions),new Promise(function(resolve,reject){
        setTimeout(()=> reject(new Error('request timeout')),1000 * 600)
      })])
    .then(checkStatus)
    // .then(response => cachedSave(response, hashcode))
      
    .then(response => {
      if(response.hasOwnProperty('errMsg')){
        return response;
      }
      // DELETE and 204 do not return data by default
      // using .json will report an error.
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      if(response.headers.get('x-total-record')){
        newOptions.headers.total = response.headers.get('x-total-record');
      }
      if(response.headers.get('x-error-code')){
        newOptions.headers.errMsg = response.headers.get('x-error-code');
        return response.headers.get('x-error-string') ? decodeURI(escape(response.headers.get('x-error-string'))): codeMessage[newOptions.headers.errMsg];
      }
      return response.json();
    })
    .then((data) => {
      if(newOptions.headers != undefined && newOptions.headers.total){
        let newData = null;
        newData = {
                    response : data, 
                    total: newOptions.headers.total,
                    current:option.body.currentPage || 1,
                    pageSize:option.body.pageSize || 50,
                    // errMsg:decodeURI(escape(newOptions.headers.errMsg)),
                  };
        if(option.body.hasOwnProperty('isRefresh') && option.body.isRefresh){
          newData['isRefresh'] = true;
        }
        return newData;
      }else{
        return data;
      }
    })
    // .then(response=>{
    //  //失效时,返回到登录页面
    //  if(){
    //    window.g_app._store.dispatch({
    //      type:'login/logout',
    //    });
    //    return response;
    //  }
    //    return response;
    // })
    .catch(e => {
      const status = e.name;
      if(status === 510){
        return null;
      }    
      if (status === 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        router.push('/user/login');
        return;
      }
      // environment should not be used
      if (status === 403) {
        router.push('/exception/403');
        return;
      }
      if (status <= 504 && status >= 500) {
        // router.push('/exception/500');
        message.error(formatMessage({id:'timeout'}))
        console.error('service error status',status)
        return;
      }
      if (status >= 404 && status < 422) {
        router.push('/exception/404');
      }
    });
}
