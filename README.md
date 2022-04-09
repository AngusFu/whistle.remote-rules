# whistle.remote-rules
> 面对云IDE开发场景下，CI会根据IDE地址动态下发whistle rule配置文件，因此需要实现点击文件地址，从而本地可以动态加载代理，这样开发者不再需要维护该文件

## design
- 针对whistle web服务，增加remoteRules参数解析，支持URL值
- 插件解析该参数并下载该rule
- 调用whistle加载该rule

## docs
- https://github.com/orgs/whistle-plugins/repositories
- https://github.com/avwo/lack
- https://wproxy.org/whistle/plugins.html

## get started

```
$ npm i -g lack

$ npm run dev

$ npm link

$ w2 stop

# 开启调试模式
$ w2 run

```

## 使用
访问`http://remote.whistlejs.com/?remoteRules=https%3A%2F%2Fraw.githubusercontent.com%2Falanhg%2Fwhistle.remote-rules%2F95d4729e13eaf8cbdf9ea120181a5f4c151cc589%2Ftest-whistle.js`
