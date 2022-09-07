:::caution
文档还在施工中，目前仅供先行预览。
:::

[开发示例](/docs/guide/concepts/context#开发示例)

```python
from dataclasses import dataclass
from datetime import datetime
from typing import Literal

from apscheduler.job import Job
from nonebot.adapter.onebot.v11 import Bot, Event
from nonebot.permission import Permission
from nonebot.rule import Rule
from pydantic import BaseModel

from util import permission

class Config(BaseModel):
  '''配置模型'''
  groups: dict[int, list[str]] = ...
  private_limit: set[int] = ...
  private_limit_whitelist: bool = ...
  timeout: int = ...

class Context(BaseModel):
  group: int
  expire: datetime

class State(BaseModel):
  '''状态模型'''
  contexts: dict[int, Context] = ...

@dataclass
class Group:
  '''用于存放群信息的 dataclass，只会在启动时更新，所以仅用于日志等，若要获取实时群名，请参考 OneBot 的 `get_group_info` 方法。'''
  id: int
  '''群号'''
  name: str
  '''群名'''
  aliases: list[str]
  '''别名'''

CONFIG: Config = ...
'''当前配置'''
STATE: State = ...
'''当前状态'''
GROUP_IDS: dict[int, Group] = ...
'''群号到群信息的字典'''
GROUP_NAMES: dict[str, Group] = ...
'''别名到群信息的字典'''
PRIVATE: Literal[-1] = ...
'''特殊群号，值为 -1，代表未提供群号'''
ANY_GROUP: Literal[-2] = ...
'''特殊群号，值为 -2，代表提供了任意群号'''
def enter_context(uid: int, gid: int) -> Job:
  '''设置用户的上下文，返回对应的超时退出任务'''
  ...
def exit_context(uid: int) -> bool:
  '''清除用户的上下文并取消对应的超时退出任务，如果没有上下文返回 False，否则返回 True'''
  ...
def get_uid_context(uid: int) -> int:
  '''返回用户的上下文，如果没有进入上下文，返回 PRIVATE'''
  ...
def get_event_context(event: Event) -> int:
  '''从事件中获取用户 ID，并返回用户的上下文，如果没有进入上下文，返回 PRIVATE
  对于群聊事件，始终返回当前群号'''
  ...
def refresh_context(uid: int) -> Job | None:
  '''刷新用户的上下文，返回对应的超时退出任务，如果没有进入上下文，返回 None'''
  ...
def in_group(ctx: int, *contexts: int) -> bool:
  '''返回 ctx 是否是 contexts 中的一个，会特殊处理 ANY_GROUP'''
  ...
def in_group_rulein_group_rule(*contexts: int) -> Rule:
  '''创建检查提供群号的 Rule，通常用于 CommandBuilder'''
  ...
async def has_group(bot: Bot, user: int, *groups: int) -> bool:
  '''返回用户是否在指定群聊中的任意一个，并行检查'''
  ...
def has_group_rule(*groups: int) -> Rule:
  '''创建检查是否在群聊中的 Rule，通常用于 CommandBuilder'''
  ...
async def get_event_level(bot: Bot, event: Event) -> permission.Level:
  '''根据事件获取用户的权限等级'''
  ...
def build_permission(node: permission.Node, default: permission.Level) -> Permission:
  '''创建检查权限等级的 Permission，通常用于 CommandBuilder
  这个函数会注册权限节点'''
  ...
async def get_card_or_name(bot: Bot, event: Event, uid: int) -> str:
  '''便捷函数，根据事件上下文获取指定用户的称呼（群名片优先于昵称）'''
  ...
```
