

// 代码使用监听Dom的办法进行获取所有的元素然后进行提取

let domInnerText = ''
let targetNode = document.querySelector('div[aria-label="时间线：对话"]>div')
var observerOptions = {
    childList: true, // 观察目标子节点的变化，是否有添加或者删除
    attributes: false, // 观察属性变动
    subtree: false, // 观察后代节点，默认为 false
};

var observer = new MutationObserver((mutationList) => {
    mutationList.forEach(item => {
        domInnerText += item.target.innerText
    })
});
observer.observe(targetNode, observerOptions);


setTimeout(() => {
    console.log(domInnerText)
}, 1000 * 60 * 1)

