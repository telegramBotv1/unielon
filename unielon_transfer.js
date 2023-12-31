const fs = require('fs');
const colors = require('colors')
const config = require('./config.json')
const { postData } = require('./http')

const node_url = "https://unielon.com/v3"
const rate_fee = '13377' // gas费
const tick = 'POWS'

function send_transaction(wallet_address, to_address, amt, tick) {
    return new Promise(async (resolve, reject) => {
        response = await postData(`${node_url}/drc20/new`, {
            "p": "drc-20",
            "op": "transfer",
            "tick": tick,
            "amt": amt,
            "receive_address": wallet_address,
            "to_address": to_address,
            "rate_fee": rate_fee
        })
        if (response.code == 200) {
            resolve(response.data)
        } else {
            reject(null)
        }
    })
}

function regex(str) {
    const addressRegex = /^D[a-zA-Z0-9]{33}$/;
    const isValidAddress = addressRegex.test(str);
    return isValidAddress
}

// let wallet_address_list = []
async function main() {
    for (let i = 0; i < config.length; i++) {
        let wallet_address = config[i].wallet_address // 发送地址
        let current_send_list = config[i].sendList
        // wallet_address_list.push(wallet_address)

        if (current_send_list.length !== 0) {
            let to_address = '' // 接收地址
            let amt = '500000000000' // 发送数量
            for (let send_index = 0; send_index < current_send_list.length; send_index++) {
                to_address = current_send_list[send_index]
                if (!regex(to_address)) {
                    console.log('不匹配狗链地址' + colors.red(to_address))
                } else {
                    let send_transaction_result = await send_transaction(wallet_address, to_address, amt, tick)
                    if (send_transaction_result.order_id) {
                        console.log(`请求发起成功,请手动签名并发送.订单号: ${colors.cyan(send_transaction_result.order_id)}, 发送地址:  ${colors.cyan(to_address)}`)
                    } else {
                        console.log(`请求发起失败. 发送地址:  ${colors.red(to_address)}`)
                    }
                }
            }
        }
    }
}

function readJsonFile(filePath, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return callback(err, null);
        }
        try {
            const jsonData = JSON.parse(data);
            callback(null, jsonData);
        } catch (parseErr) {
            callback(parseErr, null);
        }
    });
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

main()
