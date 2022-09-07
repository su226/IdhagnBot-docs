---
sidebar_position: 1
---
# 上下文
如果你是用户，你可能想过能否在私聊中触发机器人；如果你是群主，你可能想过为什么机器人启动后不响应群聊。

由于 IdhagnBot 在设计时的目标之一就有同时服务多个群聊，IdhagnBot 引入了一个称作“上下文”（Context）的模块来管理不同群聊之间的行为。

## 用户说明
在群聊中使用 IdhagnBot，只能使用当前群聊里的命令，在私聊中使用 IdhagnBot，分这几种情况：

* 一部分命令会自动检测你是否加了可以使用对应命令的群，只要加的群有至少一个能使用该命令，就会在帮助里显示，并且可以在私聊中使用。IdhagnBot 的通用插件中并不包含此类命令，但群主在编写 `user_plugins` 时可以加入此类命令。
* 一部分命令需要你手动提供你所在的群号，只有提供了群号且对应群可以使用该命令时，命令才会在帮助里显示，并且才能在私聊中使用。如：[`/签到`](/docs/guide/plugins/sign)
* 一部分命令可以直接使用，其中一部分命令如果手动提供了群号，在功能上会有所不同。如：[`/硬币`](/docs/guide/plugins/coin)（没有不同）、[`/rua`](/docs/guide/plugins/petpet_v2)（有细微不同）

提供群号的方式是在私聊中发送 `/ctx 群号`，除了群号也可以使用群主在配置中指定的别名，要查看当前群聊的可用别名，请在群聊中发送 `/alias`。

为防止误操作，一段时间（默认为 10 分钟）内没有在私聊中使用命令，就会清除提供的群号，你也可以发送 `/ctx exit` 立即清除。

~~作者：很复杂是吧？其实我也这么觉得，可能没有我之外的第二个人能理解这种诡异的设计~~

## 搭建说明
默认的配置只会响应私聊，如需响应群聊，请修改配置文件。

配置文件在 `configs/context.yaml`，参考如下：
```yaml
groups: # 要响应的所有群，名单外的群不会响应
  123456789: [别名1, 别名2]
  987654321: [] # 如果不需要别名，数组可留空
private_limit: # 私聊黑/白名单，如果一个帐号同时用于调试和实际使用，你可能需要配置这个功能
- 123123123
private_limit_whitelist: true # 将上面的名单作为白名单（默认为黑名单）
timeout: 600 # /ctx 命令的超时，默认为 600 秒（10分钟）
```

状态文件在 `states/context.yaml`，参考如下：

:::caution
你通常不应该修改状态文件，除非别无选择。
:::
```yaml
contexts: # 一项对应一个发送过 /ctx 的用户
  123456789: # 用户 QQ 号
    expire: '2022-03-28T20:29:51.850468' # 过期时间
    group: 987654321 # 当前 /ctx 群号
```

## 开发示例
[API 文档](/docs/api/util.context)

创建命令时，请使用 `CommandBuilder` 而非 `nonebot.on_command`。

* `CommandBuilder.has_group` 可用于配置[用户说明](#用户说明)中的第一类命令。
* `CommandBuilder.in_group` 可用于配置[用户说明](#用户说明)中的第二类命令。

```python
from nonebot.adapters.onebot.v11 import Event
from util import command

# 关于 CommandBuilder 的详细用法，请参考对应文档
matcher = (command.CommandBuilder("some_plugin.some_command", "命令名")
  # 群号可指定多个，对于 in_group 也可以不指定，代表任意群聊
  .has_group(123456789, 987654321)
  .build())
@matcher.handle()
async def handler(event: Event) -> None:
  # 调用 context.get_event_context 来获取当前事件的上下文
  # 对于群聊事件，始终返回当前群号
  ctx = context.get_event_context(event)
  await matcher.finish(f"当前上下文：{ctx}")
```