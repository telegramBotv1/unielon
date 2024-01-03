const fs = require('fs').promises;
const { readFiles, writeFile } = require('../utils/utils')
const filePath = './X/xtxt.txt';
const jsonFilePath = './X/addresses.json'


// 异步读取txt文件并提取地址的函数
async function readAndExtractAddresses(filePath) {
    try {
        // 异步读取文件内容
        const fileContent = await fs.readFile(filePath, 'utf8');
        // 定义正则表达式匹配以D开头，后面跟着31个字符（总共32个字符）的字符串
        const addressPattern = /D[a-zA-Z0-9]{33}/g;
        // 使用正则表达式匹配地址
        const addresses = fileContent.match(addressPattern);
        const uniqueAddresses = [...new Set(addresses)];
        await fs.writeFile(jsonFilePath, JSON.stringify(uniqueAddresses, null, 2));
        getFilter()
    } catch (error) {
        // 错误处理
        console.error('An error occurred:', error);
    }
}

// 处理数据
function getSuccess() {
    return new Promise((resolve, reject) => {
        const filesToRead = ['./第一批的地址.json', './第二批的地址.json', './第三批的地址.json', './第四批的地址.json', './blackList.json', './第五批的地址其他社区.json'];
        readFiles(filesToRead).then(contents => {
            let concatList = []
            if (contents.length != 1) {
                contents.forEach(item => {
                    concatList = concatList.concat(item)
                })
            } else {
                concatList = contents[0]
            }
            resolve(concatList)
        })
            .catch(err => {
                console.error('失败:', err);
            });
    })
}

async function getFilter() {
    let success = await getSuccess()
    readFiles(jsonFilePath).then(contents => {
        let concatList = []
        let res = []
        if (contents.length != 1) {
            contents.forEach(item => {
                concatList = concatList.concat(item)
            })
        } else {
            concatList = contents[0]
        }

        res = concatList.filter(item => {
            return !success.includes(item)
        })

        writeFile(`./X/filter_adderss.json`, res).then(() => {
            console.log('写入成功');
        }).catch(err => {
            console.error('写入失败:', err);
        })
    })
        .catch(err => {
            console.error('失败:', err);
        });
}

// JSON文件路径
readAndExtractAddresses(filePath);



// getFilter()