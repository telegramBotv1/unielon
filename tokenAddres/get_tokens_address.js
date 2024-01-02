const { readFiles, writeFile, toRepeat } = require('../utils/utils')

const { postData } = require('../http')

const node_url = "https://unielon.com/v3"
let limit = 50
let tick = 'BELLS'

async function getCurrentTick() {
    let allInfo = []
    let total = 0
    let pages = 0
    let firstInfo = await getinfo(0)
    total = firstInfo.total
    pages = total / limit
    let outerInfo = null
    console.log(pages)

    return new Promise(async (resolve, reject) => {
        // 不要前三页 也不要 后十页 过滤掉大户跟小户
        for (let i = 3; i < Math.floor(pages) - 10; i++) {
            console.log("获取" + i)
            outerInfo = await getinfo(i)
            allInfo.push(...outerInfo.data)
        }
        writeFile(`./tokenAddres/${tick}.json`, allInfo).then(() => {
            console.log(`写入成功${tick}.json`);
            resolve()
        }).catch(err => {
            console.error('失败:', err);
            reject()
        })
    })
}

function getinfo(offset) {
    return new Promise(async (resolve, reject) => {
        let firstInfo = await postData(`${node_url}/drc20/holders`, {
            limit,
            offset: offset * limit,
            tick,
        })
        if (firstInfo.code == 200) {
            resolve(firstInfo)
        } else {
            console.log('error')
            reject()
        }
    })
}

// 处理数据
function getSuccess() {
    return new Promise((resolve, reject) => {
        const filesToRead = ['./第一批的地址.json', './第二批的地址.json', './第三批的地址.json', './第四批的地址.json', './blackList.json'];
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
        }).catch(err => {
            console.error('失败:', err);
        });
    })
}

function getTokenList(successAddres) {
    const filesToRead = [`./tokenAddres/${tick}.json`];
    readFiles(filesToRead).then(contents => {
        let concatList = []
        if (contents.length != 1) {
            contents.forEach(item => {
                concatList = concatList.concat(item)
            })
        } else {
            concatList = contents[0]
        }

        // 过滤第一遍 去掉很大的跟很小的并且不能包含在发送过的中
        let tokenFilterList = concatList.filter(item => {
            // return String(item.amt).length < 14 && String(item.amt).length > 5 && !successAddres.includes(item.address)
            return !successAddres.includes(item.address)
        })

        // 过滤掉仓位大小一致的 只保留一个
        tokenFilterList = toRepeat(tokenFilterList, 'amt')

        // 打乱随机取X个出来
        tokenFilterList = getRandomElements(tokenFilterList, 500)

        writeFile(`./tokenAddres/${tick}_filter.json`, tokenFilterList).then(() => {
            console.log(`写入成功${tick}_filter.json`);
        }).catch(err => {
            console.error('写入失败:', err);
        })

        setTimeout(() => {
            let resTokenList = []
            tokenFilterList.forEach(item => {
                resTokenList.push(item.address)
            })

            writeFile(`./tokenAddres/${tick}_filter_addres.json`, resTokenList).then(() => {
                console.log('写入成功');
            }).catch(err => {
                console.error('写入失败:', err);
            })
        })
    })
        .catch(err => {
            console.error('读取失败:', err);
        });
}

function getRandomElements(arr, count) {
    let shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    // 随机打乱数组
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[i];
        shuffled[i] = shuffled[index];
        shuffled[index] = temp;
    }

    return shuffled.slice(min);
}

async function dealWithData() {
    let successAddres = await getSuccess()
    getTokenList(successAddres)
}

getCurrentTick().then(() => {
    dealWithData()
})

