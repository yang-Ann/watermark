# 基本使用

```js
import WaveShaperNode from "@anlib/watermark";
const instace = new WaveShaperNode({
  context: "我是水印",
  container: "#container1", // 插入到那个容器里面, 不指定则是 body
  rotate: -30
});

setTimeout(() => {
  // 重新渲染
  instace.render({
    fontSize: 12,
    context: "我变了",
    color: "red",
    rotate: -10,
    width: 100,
    height: 50,
    container: "#container2",
  });
}, 1500);
```