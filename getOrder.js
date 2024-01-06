const fs = require('fs');
const path = require('path');
const config = require('./config.json')
const { postData } = require('./http')

const node_url = "https://unielon.com/v3"
const tick = 'POWS'

async function getOrder(receive_address) {
    let currentAddressOrderList = []
    for(let i = 0; i < 10; i++) {
        console.log(`获取${receive_address}订单中: ${i}页`)
        let orderList = await postData(`${node_url}/orders/address`, {
            receive_address,
            limit: 50,
            offset: 50 * i
        })
        if (orderList?.code == 200 && orderList?.data) {
            currentAddressOrderList.push(...orderList['data'])
        } else {
            break
        }
    }
    return currentAddressOrderList
}

async function main(myAddres) {
    // let map = new Map()
    let resOrder = []
    for (let i = 0; i < myAddres.length; i++) {
        let orderList = await getOrder(myAddres[i])
        let filterOrderList = orderList.filter(item => item.tick === tick && item.drc20_tx_hash)
        // filterOrderList.forEach(item => {
        //     map.set(item.order_id, item)
        // })
        resOrder.push(...filterOrderList)
    }
    return resOrder
}

function convertTimestamp(timestamp) {
    var date = new Date(timestamp * 1000); // 将时间戳从秒转换为毫秒
    var year = date.getFullYear(); // 获取年份
    var month = ('0' + (date.getMonth() + 1)).slice(-2); // 获取月份，月份从0开始，所以+1，并且保证两位数
    var day = ('0' + date.getDate()).slice(-2); // 获取日，保证两位数
    var hours = ('0' + date.getHours()).slice(-2); // 获取小时，保证两位数
    var minutes = ('0' + date.getMinutes()).slice(-2); // 获取分钟，保证两位数
    var seconds = ('0' + date.getSeconds()).slice(-2); // 获取秒钟，保证两位数
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 使用模板字符串返回格式化日期
}

function writeJsonFile(filePath, jsonData, callback) {
    const jsonString = JSON.stringify(jsonData, null, 2);
    fs.writeFile(filePath, jsonString, 'utf8', (err) => {
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// setInterval(async () => {
    
// }, 1000 * 60)

async function start (myAddres) {
    let allSuccessList = []
    let successList = await main(myAddres)
    successList.forEach(item => {
        allSuccessList.push({
            '订单号': item.order_id,
            '数量': item.amt / 100000000,
            '铭文': item.tick,
            'DRC20哈希': item.drc20_tx_hash,
            '发送地址': item.receive_address,
            'receiveAddress': item.to_address,
            'gas费地址': item.fee_address,
            '时间': convertTimestamp(item.create_date)
        })
    })
    console.log('成功数量:', successList.length)
    const filePath = path.join(__dirname, 'success.json');
    writeJsonFile(filePath, allSuccessList, () => { })
    return allSuccessList
}

module.exports = {
    start
}