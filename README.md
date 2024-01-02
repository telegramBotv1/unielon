# 脚本怎么跑起来

## 安装node

1. 在node官网下载node 最好用14.18.0 比较稳定
2. 进入项目主目录执行 npm i 下载所需要的依赖

## 目录结构

test 是我测试的一些代码 不用看
地址.js 这个文件是对X上的地址进行过滤去重生成最终的地址的地方 本次不需要执行
第X批的地址 这是就是发过的 以及没有发过的地址, 由地址.js生成  本地就是第二次的地址

config.js 重要重要！！脚本主配置文件 第一次使用请将config-model 修改成config 或者新建一个config.json 内容为config-model中的内容
是一个数组 可以写多个地址。 脚本的执行原理是发起支付请求 然后去手动签名。 自动签名没有实现 具体代码在test中 慎用！慎用 会扣光钱包中的狗狗币

unielon 有个特点就是 发起未支付的请求是一个订单 签名支付又是一个订单 所以要注意 别发错了地址

这里建议一个发送钱包的地址只写 5-8个被发送的地址 因为一个小时订单将会失效 一个小时也就最多发这些

当手动签名后 会提示 undefined 提示这个是成功的 可以进行下一个钱包的操作了

success.json 这个文件就是成功的订单信息 这个文件是getOrder.js文件生成的

getOrder.js 这个文件就是跑 config.json中的wallet_address 这个字段所对应的 钱包地址的订单也就是发空头的钱包地址

unielon_transfer这个文件就是主要的执行文件 执行 这个文件  node unielon_transfer.js 将会发起 config.json中配置的信息的请求

http 这个就是封装的请求 需要修改一下代理地址 请使用socks5

tokenAdddres 文件夹是获取其他铭文地址的 执行get_tokens_address 

X 文件夹是获取 X评论区的地址的

## 重要信息！！

1. 查看http中socks5 是否正确
2. config.json中的sendList建议一次输入5-8个 几个钱包全部发完了 然后再换一批 不容易出错 
3. 有问题联系helen na
4. gas费就是最低的 如果要修改请修改unielon_transfer 中的 rate_fee 这个值我写了个错的会按照正常的gas算 ，小心修改