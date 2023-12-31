const axios = require('axios');
const {SocksProxyAgent} = require('socks-proxy-agent');

// 配置SOCKS5代理地址
const proxyOptions = 'socks5://127.0.0.1:7890';  // 示例代理服务器地址
const agent = new SocksProxyAgent(proxyOptions);

// 封装GET请求
const getData = async (url, params = {}) => {
    try {
        const response = await axios.get(url, { 
            httpsAgent: agent, 
            params 
        });
        return response.data;
    } catch (error) {
        console.error(`Error during GET request to ${url}: ${error}`);
        throw error;
    }
};
// 封装POST请求
const postData = async (url, data = {},axiosConfig = {}) => {
    try {
        const response = await axios.post(url, data, { 
            httpsAgent: agent,
            ...axiosConfig
        });
        return response.data;
    } catch (error) {
        console.error(`Error during POST request to ${url}: ${error}`);
    }
};


module.exports = {
    getData,
    postData
}