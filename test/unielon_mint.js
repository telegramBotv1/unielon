const fs = require('fs');
const path = require('path');
const { getData, postData } = require('../http')

const node_url = "https://unielon.com/v3"
const rate_fee = '200000000' // gas费
const tick = 'PUMP'
const wallet_address = 'DLoqEZedPDzrkzQZytWtbrtdSMz5ZbtKg1'

function mint(wallet_address, amt, tick) {
    return new Promise(async (resolve, reject) => {
        response = await postData(`${node_url}/drc20/new`, {
            "p": "drc-20",
            "op": "mint",
            "tick": tick,
            "amt": 10000,
            "receive_address": wallet_address,
            "rate_fee": rate_fee
        })

        if (response.code == 200) {
            resolve(response.data)
        } else {
            reject(null)
        }
    })
}


async function main() {
    let res = await mint(wallet_address, tick)
    console.log(res)
}

main()