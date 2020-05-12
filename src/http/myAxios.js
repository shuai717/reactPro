import axios from 'axios';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
axios.defaults.baseURL='';

axios.interceptors.request.use((config)=>{
    NProgress.start()
    return config;
})
axios.interceptors.response.use((response)=>{
    NProgress.done()
    return response.data;
},
(err)=>{
    NProgress.done()
    return new Promise(()=>{});
   
}
)
export default axios;