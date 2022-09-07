---
sidebar_position: 2
---
# 配置文件

## 搭建说明
IdhagnBot 的所有配置文件都存放在 configs 目录下，并且 IdhagnBot 有用于存放运行时产生的缓存等数据的“状态文件”，存放在 states 目录下。虽然配置和状态都以人类可读的 YAML 格式存储，但通常情况下你不只应该修改配置文件，不应该修改状态文件，除非别无选择或本文档明确告知可以这么做。

大多数配置文件采用“懒加载”，并不会在启动时读取，而是在第一次使用时读取。当第一次读取时，如果文件不存在，会在日志中输出缺失的文件名。如果文件不存在，或者文件缺失某个配置项，对应配置项会使用默认值而非报错，这是为了降低配置的难度，但默认行为可能不是你需要的。（比如默认只响应私聊，不响应任何群聊）

配置文件可以使用 `/reload` 命令热重载，热重载目前并不是“懒加载”的，而且并不是所有的配置都支持热重载。

配置和状态文件均存在两种变种，一种是所有群聊共用一份，一种是每个群聊单独创建一份。在 default.yaml 存在时创建不存在的群配置，会自动复制一份，注意 default.yaml 只会在创建时生效，并不会作为 fallback。
```
📁 configs
|-📁 some_group_config 示例：每个群聊单独的配置
| |-📄 群号.yaml
| \-📄 default.yaml
\-📄 some_shared_config.yaml 示例：所有群聊共用的配置
```

Nonebot2 和多数市场插件默认使用 dotenv 进行配置，IdhagnBot 也保留了这种用法，不过考虑到 dotenv 并不原生支持 str 以外的类型（这些类型由 Pydantic 提供支持，参见[此处](https://pydantic-docs.helpmanual.io/usage/settings/#dotenv-env-support)），IdhagnBot 也允许使用 YAML 配置 Nonebot2，文件在 `configs/nonebot.yaml`。不过这个文件并不使用上文中的配置 API，因此也没有热重载等额外功能。

配置优先级：YAML > 系统环境变量 > dotenv

## 开发示例
你可以使用 SharedConfig 和 GroupConfig 创建配置，使用 GroupState 和 SharedState 创建状态，SharedConfig 和 GroupConfig 都是 BaseConfig 的子类，SharedState 和 GroupState 分别是 SharedConfig 和 GroupConfig 的子类。

Shared/GroupState 除了使用 states 而非 configs 文件夹存储，和 Shared/GroupConfig 并没有区别，比如 Shared/GroupConfig 也有 dump 方法，但根据上文中配置的定义，并不建议使用。

```python
from nonebot.adapters.onebot.v11 import Event
from pydantic import BaseModel
from util import command, config_v2, context

class SomeModel(BaseModel):
  # 你可以像其他 Pydantic 模型一样编写配置模型
  # 注意所有字段都需要有默认值，否则在文件不存在时会报错
  some_field: int = 1
  other_field: str = "Hello, World!"

# 第一个参数为配置文件名，对于共用配置会自动加上 .yaml 拓展名，对于独立配置会创建文件夹
# 第二个参数为 BaseModel 的子类
# 第三个参数为是否可以热重载，可省略，省略时为 True
STATE = config_v2.GroupState("some_state", SomeModel, True)

# 使用 onload 装饰器可以控制加载配置文件时的行为
# 唯一一个参数为是否禁用懒加载，考虑到此类配置文件通常涉及到定时任务等，省略参数时为 True
# SharedConfig 和 SharedState 需要的函数: Callable[[SomeModel | None, SomeModel], None]
# GroupConfig 和 GroupState 需要的函数: Callable[[SomeModel | None, SomeModel, int], None]
@STATE.onload(False)
def on_reload(old: SomeModel | None, new: SomeModel, gid: int) -> None:
  # old 在第一次加载时为 None，重载时为重载前的配置
  # new 始终为加载后的配置
  # gid 是加载 GroupConfig 时的群号
  pass

matcher = command.CommandBuilder("some_plugin.some_command", "测试命令").build()
@matcher.handle()
async def handler(event: Event) -> None:
  # SharedConfig 和 SharedState 调用时无需参数
  # SharedConfig 和 GroupState 调用时需要群号，通常是使用 context.get_event_context 获取，参见“上下文”
  state = STATE(context.get_event_context(event))
  # 调用创建的 CONFIG / STATE 来获取当前的配置/状态对象，重新加载时当前对象会失效
  # 因此请在每次处理命令时都获取配置，而不是把配置缓存起来，BaseConfig 内部会处理缓存
  # ... 其余代码 ...
  state.dump()
  # 调用 dump 将状态写入到磁盘上，不建议对 CONFIG 调用 dump。
```

### 自定义配置类型
上述 4 个类应该能满足几乎所有情况的配置类型，因此并不建议你创建新的配置类型，不过如果你仍然需要创建，可参考以下内容。

BaseConfig 是泛型类，原型为 `BaseConfig[TModel, *TParam]`（此处星号为 Python 3.11 的语法，本项目使用 Python 3.10，因此使用的是 `typing_extensions.Unpack`）

其中 TModel 是模型类，需要是 BaseModel 的子类，创建 SharedConfig 时的第二个参数就是 `type[TParam]`。
而 TParam 是在调用 CONFIG 时传入的参数类型列表，对于 SharedConfig 这个列表为空，对于 GroupConfig 这个列表为 `[int]`，这个列表也会用在 onload 等函数中。

以下是 GroupConfig 的实现供参考。
```python
import os
import shutil
from typing import ClassVar, Iterable, TypeVar
from pydantic import BaseModel
from util import config, context

TModel = TypeVar("TModel", bound=BaseModel)
class GroupConfig(config.BaseConfig[TModel, int]):
  base_dir: ClassVar = "configs"  # base_dir 为存放文件的目录
  # category: ClassVar = "配置"  # category 是在日志中输出“xx文件不存在”时显示的名称

  def __init__(self, name: str, model: type[TModel], reloadable: bool = True) -> None:
    super().__init__(model, reloadable)
    self.name = name

  # get_file 用于获取指定参数对应的配置文件名
  def get_file(self, group: int) -> str:
    file = f"{self.base_dir}/{self.name}/{group}.yaml"
    default_file = f"{self.base_dir}/{self.name}/default.yaml"
    if not os.path.exists(file) and os.path.exists(default_file):
      shutil.copy(default_file, file)
    return file

  # get_all 是生成器函数，用于获取所有参数组合，用于热重载
  def get_all(self) -> Iterable[tuple[int]]:
    for i in context.CONFIG.groups:
      yield i,
```

### 过时的 API
你可能注意到配置模块的名字是 `util.config_v2`，而非 `util.config`，因为 IdhagnBot 还有一些插件还在使用过时的配置 API，而没有迁移。

过时 API 也区分配置和状态，但并没有为每个群单独配置的功能，你需要自行实现这些，并且不支持懒加载和热重载。

请不要使用过时 API，它将会在迁移完成后删除，届时 `util.config_v2` 将会重命名为 `util.config`。

## 列表
使用新配置 API 的插件和辅助模块列表：

标注 ⏩ 的配置不使用懒加载，标注 ❄️ 的配置不支持热重载

* [bilibili_check](/docs/guide/plugins/bilibili_check)
* ⏩ [daily](/docs/guide/plugins/daily)
* [idhagn_fetch](/docs/guide/plugins/idhagn_fetch)
* ⏩ [sign](/docs/guide/plugins/sign)
* ⏩ [util.log](/docs/api/util.log)
* [util.permission](/docs/api/util.permission)
* ⏩ [util.util](/docs/api/util.util)

使用过时 API 的插件和辅助模块列表：
* [auto_strike](/docs/guide/plugins/auto_strike)
* [bilibili_activity](/docs/guide/plugins/bilibili_activity)
* [bilibili_live](/docs/guide/plugins/bilibili_live)
* [coin](/docs/guide/plugins/coin)
* [dog](/docs/guide/plugins/dog)
* [emojimix](/docs/guide/plugins/emojimix)
* [fallback](/docs/guide/plugins/fallback)
* [forbidden_word](/docs/guide/plugins/forbidden_word)
* [image_board](/docs/guide/plugins/image_board)
* [liferestart](/docs/guide/plugins/liferestart)
* [minecraft](/docs/guide/plugins/minecraft)
* [purchase](/docs/guide/plugins/purchase)
* [trending](/docs/guide/plugins/trending)
* [welcome](/docs/guide/plugins/welcome)
* [wikipedia](/docs/guide/plugins/wikipedia)
* [util.account_aliases](/docs/api/util.account_aliases)
* [util.context](/docs/api/util.context)
* [util.currency](/docs/api/util.currency)
* [util.help](/docs/api/util.help)
