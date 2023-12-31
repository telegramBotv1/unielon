const config = require('../config.json')
const { getData, postData } = require('./http')
const bitcore = require('bitcore-lib-doge');
const FormData = require('form-data');
const node_url = "https://unielon.com/v3"

const wallet_address = 'DCfmJjV1shLCQ1EzTWFiUJeQS3rgNn6xHW' // 发送地址
const rate_fee = '13377' // gas费
const someExistingPrivateKeyWIF = 'QU8hzZc4isiNxH29xmbhStYguC' // 钱包私钥


let to_address = 'DLoqEZedPDzrkzQZytWtbrtdSMz5ZbtKg1' // 接收地址
let amt = '6' // 发送数量
let tick = "BELLS" // 铭文名称


// var dogecoinNetworks = {
//     name: 'dogecoin',
//     alias: 'doge',
//     pubkeyhash: 0x1e, // Dogecoin 公钥哈希前缀
//     privatekey: 0x9e, // Dogecoin 私钥前缀
//     scripthash: 0x16, // Dogecoin 脚本哈希前缀
//     xpubkey: 0x02facafd, // Dogecoin 公钥 xpub 前缀
//     xprivkey: 0x02fac398, // Dogecoin 私钥 xpriv 前缀
//     networkMagic: 0xc0c0c0c0, // Dogecoin P2P 消息前缀
//     port: 22556, // Dogecoin 网络端口
//     dnsSeeds: [ // Dogecoin DNS 种子节点
//       'seed.dogecoin.com',
//       'seed.doger.dogecoin.com',
//       'seed.dogecoin.messenger'
//     ]
//   };
  
//   bitcore.Networks.add(dogecoinNetworks);

// function script (){
//     var address = new bitcore.Address.fromString(wallet_address);
//     var script = new bitcore.Script.buildPublicKeyHashOut(address);
//     console.log(script.toString())
// }

function send_transaction() {
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


function getOrderId(order_id) {
    return new Promise(async (resolve, reject) => {
        response = await postData(`${node_url}/orders/id`, {
            order_id
        })

        if (response.code == 200) {
            resolve(response)
        } else {
            reject(null)
        }
    })
}

function sing() {
    return new Promise(async (resolve, reject) => {
        const form = new FormData();
        form.append('address', wallet_address);
        form.append('amount', '1');
        form.append('count', '1');
        response = await postData(`https://utxo.unielon.com/utxo`, form, {
            headers: form.getHeaders()
        })
        console.log(response)
        if (response.amount) {
            resolve(response)
        } else {
            reject(null)
        }
    })
}

function getTick(tick) {
    return new Promise(async (resolve, reject) => {
        response = await postData(`${node_url}/drc20/tick`, {
            tick
        })
        console.log(response)
        if (response.code == 200) {
            resolve(response)
        } else {
            reject(null)
        }
    })
}

async function createBit(singResult) {

    return new Promise(async (resolve, reject) => {
        const privateKey = new bitcore.PrivateKey(someExistingPrivateKeyWIF)

        // let a = await getData(`https://api.blockcypher.com/v1/doge/main/addrs/${wallet_address}?unspentOnly=true`)
        // console.log(a)
        // return

        // let hash = bitcore.Address.fromString(wallet_address).hashBuffer;
        let script = bitcore.Script.buildPublicKeyHashOut(wallet_address).toHex()

        // let script = new bitcore.Script.buildPublicKeyHashOut(to_address).toHex()

        let utxo = {
            "txId": singResult.utxo[0].txid,
            "outputIndex": singResult.utxo[0].vout,
            "address": singResult.utxo[0].address,
            "satoshis": amt * 1,
            "script": script
        }
        console.log(utxo)

        var transaction = await new bitcore.Transaction()
            .from(utxo)
            .to(to_address, amt * 1)
            .fee(rate_fee * 1)
            .addData('UBTC')
            .change(wallet_address)
            .sign(privateKey)

            console.log(transaction)
        try {
            let broadcastRes = await broadcast(transaction)
            resolve(broadcastRes)
        } catch (error) {
            reject()
        }
    })
}

function broadcast(transaction) {
    return new Promise(async (resolve, reject) => {
        tx_hex = transaction.toString()
        try {
            response = await postData(`${node_url}/tx/broadcast`, {
                tx_hex
            })
            if (response.code == 200) {
                resolve(response)
            } else {
                reject()
            }
        } catch (error) {
            reject()
        }
    })
}

function start() {
    return new Promise(async(resolve, reject) => {
        // 创建订单
        // let transaction = await send_transaction()
        // order_id = transaction.order_id
        // fee_address = 'ADsvNtQzT5r2MTp3UW33KTxWSW2eP3Tj9n'


        // 广播获取
        let singResult = await sing()
        let createBitRes = ''
        try {
            createBitRes = await createBit(singResult)
        } catch (error) {

        }

        // let time = setInterval(async () => {
        //     let orderRes = await getOrderId(order_id)
        //     if(orderRes.data.block_hash) {
        //         console.log('证明转完了 开始下一个')
        //         clearInterval(time)
        //     } else {
        //         console.log(orderRes)
        //     }
        // }, 1000 * 60)

    })
}

// main()


async function main() {
    if (config.length !== 0) {
        for (let i = 0; i < config.length; i++) {
            let sendData = config[i].split(',')
            to_address = sendData[0]
            amt = sendData[1]
            tick = sendData[2]
            let mainResult = await start()

        }
    }
}


main()