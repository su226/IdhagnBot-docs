---
sidebar_position: 2
tags:
- {label: 有配置文件, permalink: has-config}
- {label: 需要手动配置, permalink: config-required}
---
# 安装

## 安装 IdhagnBot
IdhagnBot 的开发主要在 ArchLinux 上完成，且需要至少 Python 3.8（建议使用 3.10，部分插件不能在 3.11 中使用），不保证在 Windows 或 MacOS 上的兼容性，如有问题或需求可以[发起 Issue](https://github.com/su226/IdhagnBot/issues)。

以下命令请根据发行版替换。

```shell
sudo pacman -S cairo pango gobject-introspection python-pdm
git clone https://github.com/su226/IdhagnBot.git
cd IdhagnBot
# 只安装基础功能
pdm install
# 或者安装全部功能
# 编译 python-libzim 时需要安装 libzim，但使用 PyPI 上的二进制包时不需要，可自行去除
sudo pacman -S libyaml bubblewrap nodejs npm libqalculate libzim
pdm install -G :all
```

:::info
在 Windows 安装和搭建 IdhagnBot 可能需要用到 [MSYS2](https://www.msys2.org/)（未测试）
```shell
pacman -S mingw-w64-cairo mingw-w64-pango mingw-w64-gobject-introspection
```
你可以参考 [PyGObject 的官方文档](https://pygobject.readthedocs.io/en/latest/getting_started.html) 等资料

目前 MSYS2 不提供 python-pdm 包（参见 https://packages.msys2.org ），你需要参考 [PDM 的官方文档](https://pdm.fming.dev) 安装PDM
:::

## 配置协议端
你需要安装一个 OneBot V11（原CQHTTP）协议端，并且选择一个驱动器，这里以 [go-cqhttp](https://github.com/Mrs4s/go-cqhttp) 和 AIOHTTP（正向WebSocket连接）为例。

AIOHTTP 也作为其他插件的HTTP库使用，因此使用其他驱动器也必须安装。使用其他驱动器理论上不会有问题，但使用 go-cqhttp 以外的协议端未经充分测试。

可参考 Nonebot2 的文档：
* https://v2.nonebot.dev/docs/start/install-driver
* https://v2.nonebot.dev/docs/tutorial/choose-driver#aiohttp
* https://adapter-onebot.netlify.app/docs/guide/setup/#正向-websocket-连接

:::info
本项目并不使用 nb-cli，请使用 pip 或 pdm 安装相关依赖。
:::

你可以使用 Nonebot2 文档中所写的 `.env` 来配置 Nonebot2
```dotenv
DRIVER=~aiohttp
ONEBOT_WS_URLS=["ws://127.0.0.1:6700"] # 要与协议端的端口号一致
SUPERUSERS=[123456789, 9876543210] # 超管用户 QQ 号，可以指定多个，将会接收到出错等消息
```

或者如果你希望 Nonebot2 配置文件和其他配置文件一样使用 YAML 的话，你可以使用 `configs/nonebot.yaml`
```yaml
driver: ~aiohttp
onebot_ws_urls: # 端口号要与协议端一致
- ws://127.0.0.1:6700
superusers: # 超管用户 QQ 号，可以指定多个，将会接收到出错等消息
- 123456789
- 987654321
```

其他配置文件请参考接下来的文档。

## 启动
使用 `pdm start` 即可启动机器人，如果你需要机器人长期运行，可以使用 [tmux](https://github.com/tmux/tmux) 或者编写 Systemd 服务。

tmux 的用法和编写 Systemd 服务可参考：
* https://www.ruanyifeng.com/blog/2019/10/tmux.html
* http://www.jinbuguo.com/systemd/systemd.service.html

<details>
  <summary>Systemd 服务参考（IdhagnBot）</summary>

  ```systemd-unit-file
  [Unit]
  Description=Idhagn Chatbot
  Wants=go-cqhttp.service
  After=go-cqhttp.service

  [Service]
  Type=simple
  WorkingDirectory=工作目录
  ExecStart=pdm run start
  Restart=on-failure
  User=用户

  [Install]
  WantedBy=multi-user.target
  ```

</details>

<details>
  <summary>Systemd 服务参考（go-cqhttp）</summary>

  ```systemd-unit-file
  [Unit]
  Description=go-cqhttp Chatbot Backend
  Wants=network-online.target
  After=network-online.target

  [Service]
  Type=forking
  WorkingDirectory=工作目录
  ExecStart=工作目录/go-cqhttp -d -faststart
  Restart=on-failure
  User=用户

  [Install]
  WantedBy=multi-user.target
  ```

</details>

## 目录结构
安装完成后的 IdhagnBot 有如下的目录结构，其中带 ⚠️ 的在 .gitignore 内并且可能需要自行创建。
```
📁IdhagnBot
|-📁⚠️ configs 配置目录，如果对应插件没有配置，会在日志中提示
| |-📁 * 插件群配置
| | |-📄 群号.yaml
| | \-📄 default.yaml 在创建不存在的群配置且default.yaml存在时，会自动复制一份
| |-📄 *.yaml 插件共享配置
| \-📄 nonebot.yaml 另一种Nonebot2配置文件
|-📁 plugins Nonebot2插件（含所需的资源）
| |-📁 * 较为复杂，包含资源文件或分多个模块的插件为文件夹
| \-📄 *.py 一些简单的插件通常是单文件
|-📁⚠️ resources 用户自定义资源
|-📁⚠️ states 状态文件，用于记录缓存、统计数据等，可能被自动修改，而配置一定只能手动修改（不建议手动编辑）
| |-📁 * 插件群状态
| | |-📄 群号.yaml
| | \-📄 default.yaml 尽管状态也支持default.yaml，但并不建议使用
| \-📄 *.yaml 插件共享状态
|-📁⚠️ user_plugins 用户插件，可以根据自己的需要拓展机器人功能
|-📁 util 插件之间共用的代码
|-📄⚠️ .env* Nonebot2配置文件（也可使用configs/nonebot.yaml，见上文）
|-📄 .gitignore
|-📄 bot.py 机器人主程序
|-📄 pdm.lock
|-📄 pyproject.yaml
|-📄 README.md
\-📄 LICENSE
```
