const { readFiles, writeFile, toRepeat } = require('./utils/utils')
const { start } = require('./getOrder')
const itemAddresNumber = 8
let willAddresList = []

let myAddres = [
    "DKHsGS1WTSSeyPexzNZBJpRMKut48pLLgN",
    "DAEeeStacS7D6tBEVvPhMmPhto9FWRMjsw",
    "DTCvPpHMZhSUsmmGGPCERM9fjC2LKVRuid",
    "DE2PsXUnjRHkGzcJR6v5v7cEMPpBRGiMa9",
    "DTR78YWBBKXGoBY3W8ohZhEvUtaqTUCoQ5",
    "DPLtH5mr66q9Md3z4NhwwmH4P112JrMVQW",
    "DPHnmwgpTu72Bznw93zb7MKhiEkGKG6kt7",
    "D9FA6oMTMXsLsz7CzM1gcfvwa6KH1VzQ8k",
    "DSm5P6HR2QqAuWLToD9q8J3bvmcxNtgiCD",
    "DLFm75PnkCjxYSpUjjVRXdPf4BbudqQ2zH"
]


function getAllAdders() {
    return new Promise((resolve, reject) => {
        let filesToRead = './tokenAddres/BUNNY_filter_addres.json'
        readFiles(filesToRead).then(contents => {
            resolve(contents)
        }).catch(err => {
            console.error('失败:', err);
        });
    })
}

async function main() {
    let successList = await start(myAddres)
    let allAddresList = await getAllAdders()

    allAddresList[0].forEach(item => {
        let hascurrent = successList.filter(successItem => {
            return successItem['receiveAddress'] == item
        }).length == 0
        if(hascurrent) {
            if(willAddresList.length == itemAddresNumber * myAddres.length) {
                return
            } else {
                willAddresList.push(item)
            }
        }
    })
    let config = generateConfig(myAddres, willAddresList, itemAddresNumber)
    writeFile(`./config.json`, config).then(() => {
        console.log(`写入成功`);
    }).catch(err => {
        console.error('写入失败:', err);
    })

}


function generateConfig(myAddres, willAddresList, itemAddresNumber) {
    const config = myAddres.map((wallet_address, index) => {
        // 计算当前地址对应的willAddresList的开始索引
        const startIndex = index * itemAddresNumber;
        // 获取当前地址对应的willAddresList片段
        const sendList = willAddresList.slice(startIndex, startIndex + itemAddresNumber);
        return { wallet_address, sendList };
    });

    return config;
}


main()