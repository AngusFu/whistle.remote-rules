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
