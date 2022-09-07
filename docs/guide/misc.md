---
sidebar_position: 6
---
# 杂项
一些杂项功能的说明和配置，用户通常不需要涉及这些，以下内容主要供群主和开发者查阅。

## 货币系统
IdhagnBot 有一个简单的货币系统，目前只有 [purchase](/docs/guide/plugins/purchase) 和 [sign](/docs/guide/plugins/sign) 插件使用这个系统，不同群聊之间的货币是独立的。具体请参考 [API 文档](/docs/api/util.currency)。

状态文件在 `states/coin.yaml`，参考如下：

:::caution
你通常不应该修改状态文件，除非别无选择。
:::
```yaml
groups:
  123456789: # 群号
    987654321: 100 # 用户: 金币数
```

## 用户别名
在使用 [`/rua`](/docs/guide/plugins/petpet_v2) 等命令时，需要指定一个用户，除了可以直接输入 QQ 号或者 @ 对方，IdhagnBot 还会将群员昵称和群名片中的空格和特殊符号去掉，用于查找群员。

但当群员的昵称和群名片只包含特殊符号而不包含任何中文、英文、数字时，IdhagnBot 将不能通过名字找到他，此时你可以为他手动指定别名。

假如一个名字可以查找到两个或更多群员，为了防止不必要的误会，IdhagnBot 默认也会拒绝匹配到任何一个，除非手动指定别名。

别名还可以用于给群员“起外号”~~，如果给某人起了不太好听的外号而被他打了我不为此负责~~。

使用 `/match 名字` 可以查看名字能搜索到哪些群员，使用 `/match QQ号` 可以查看群员的所有别名，包括自动生成的。

`config/account_aliases.yaml`
```yaml
aliases:
- contexts: # 这些别名在哪些上下文生效，不指定时在所有上下文生效
  - 123456789 # -1 指私聊，-2 指任意群聊
  aliases:
  - names:
    - 名字1
    - 名字2
    users: # 部分命令可以接受指代多个群员的别名，但大部分命令只接受指代一个群员的别名
    - 123456789
    - 987654321
```

### 开发示例
通常你需要使用 `util.account_aliases.match_uid`，这个函数会在内部处理大部分细节，在出错时抛出 `util.util.AggregateError`，包含*相对*友好的错误信息，当一个名称既能精确匹配也能模糊匹配时，精确匹配优先。

如果需要更底层的方法，你可以使用 `util.account_aliases.get_aliases` 和 `util.account_aliases.match`，参见 [API 文档](/docs/api/util.account_aliases)。

## 日志
IdhagnBot 和 Nonebot2 一样，也使用 Loguru 作为日志库，但 IdhagnBot 覆盖了 Nonebot2 的默认格式。

`config/log.yaml`
```yaml
sinks: # 如果不指定，默认值如下，可以指定多个 sink
- level: INFO # 日志等级，可以是字符串或数字，不区分大小写，参见 Loguru 的日志等级
  fold_nonebot: true # 是否将 nonebot. 开头的模块都显示为 nonebot，就像 Nonebot2 默认的日志一样
  format: "<g>{time:HH:mm:ss}</g>|<lvl>{level:8}</lvl>| <c>{name}</c> - {message}" # 日志格式，此处为默认格式
  type: stderr # stdout、stderr 或 syslog
  # syslog 使用 Python 的 syslog 标准库，只在 POSIX 系统上可用（如 Linux、Mac 等）
  # 如果你将机器人作为 Systemd 服务运行，推荐使用 syslog
  # file: 日志文件名 # 和 type 二选一，目前不支持 Loguru 的高级特性，如大小限制
warnings_as_log: true # 将 Python 标准库 warnings 输出的警告作为 WARN 等级的日志输出，默认为 true
stdio_as_log: true # 将 stdout 和 stderr 分别作为 INFO 和 ERROR 等级的日志输出，默认为 true
```

开发示例请参见 [Loguru](https://github.com/Delgan/loguru)。

## 杂项方法
[`util.util`](/docs/api/util.util) 包含一些实用但琐碎的方法。*这个命名也许应该改成 `util.misc` 的，我有点脑抽……*

[`util.color`](/docs/api/util.color) 包含一些解析颜色字符串和处理颜色的方法，解析颜色字符串时支持 3 位或 6 位十六进制、CSS 颜色名、`rgb(r, g, b)`、`hsl(h, s, l)`、Material Design 颜色名，不支持 Alpha 通道。

[`util.binomial`](/docs/api/util.binomial) 包含一个二项分布随机数生成器，从 NPM 模块 [@stdlib/random-base-binomial](https://github.com/stdlib-js/random-base-binomial/blob/main/lib/sample2.js) 移植过来，目的是让 coin 和 dice 不再依赖 NumPy。

`config/util.yaml`
```yaml
special_font:
  # 目前只有唯一一个特殊字体，pixel，用在 meme_text.nokia 中，未指定时 fallback 为 sans
  pixel: Unifont
font_substitute:
  # PangoCairo 使用 FontConfig，因此 IdhagnBot 会跟随系统设置，但你也可以手动覆盖
  # 目前 IdhagnBot 使用了这些通用名
  serif: Noto Serif CJK SC
  serif bold: Noto Serif CJK SC Bold
  sans: Noto Sans CJK SC
  sans medium: Noto Sans CJK SC Medium
  sans bold: Noto Sans CJK SC Bold
  sans heavy: Noto Sans CJK SC Heavy
  monospace: Iosevka
  # 其实上面这些字体并没有什么特殊含义，只是我喜欢而已（逃）
chromium: "" # Pyppeteer 使用的 Chromium 路径，默认为空，即让 Pyppeteer 自行下载
# 以下两项默认都是 bicubic
resample: bicubic # Pillow 除缩放外的图片插值方式，可用：nearest、bilinear、bicubic
scale_resample: bicubic # Pillow 缩放图片插值方式，除上面三个还可用：box、hamming、lanczos
```

## 字体渲染
IdhagnBot 使用 PangoCairo 来渲染文字，以提供 Emoji 等特殊符号的 fallback，也支持其他一些高级排版特性。

[配置文件见上](#杂项方法)

### 开发示例
util.text 主要提供 layout、render 和 paste 三个函数，paste 会将文字粘贴到目标图像上（并返回渲染的图片），是最便捷的函数。如果需要更多的控制，render 返回 [PIL.Image.Image](https://pillow.readthedocs.io/en/stable/reference/Image.html#PIL.Image.Image)，layout 返回 [Pango.Layout](https://lazka.github.io/pgi-docs/Pango-1.0/classes/Layout.html)。具体请参考 [API 文档](/docs/api/util.text)。

## 浏览器渲染
IdhagnBot ~~由于作者的精神洁癖，~~偏向尽可能使用 Pillow、PyCairo、NumPy、OpenCV 等库生成图片而非调用浏览器，但以下功能由于极其复杂只能使用浏览器渲染：

* [wikipedia](/docs/guide/plugins/wikipedia)

[配置文件见上](#杂项方法)

### 开发示例
`util.util.browser` 会使用配置文件中的 Chromium 路径创建 [Pyppeteer](https://github.com/pyppeteer/pyppeteer) 的浏览器实例，并且自动关闭浏览器，防止后台残留。

```python
from util import util

async with util.browser() as browser:
  pass # 使用获取的 browser
```

## 图片采样
IdhagnBot 默认使用双立方插值来缩放图片或进行其他变换，通常不应该造成性能影响。但如果确实有，请参考 [Pillow 的文档](https://pillow.readthedocs.io/en/stable/handbook/concepts.html#concept-filters) 适当降低采样质量。

[配置文件见上](#杂项方法)

### 开发示例
在使用 Image.resize 等方法时，请使用 `util.util.resample` 和 `util.util.scale_resample`，而非硬编码采样。

```python
from PIL import Image
from util import util

im = Image.new("RGBA", (100, 100))
# scale_resample 可能被指定为 Box、Hamming 或 Lanczos，不要用在 resize 以外的方法中
im.resize((50, 50), util.scale_resample)
# resample 一定只会被指定为 Nearest、Bilinear 或 Bicubic
im.rotate(45, util.resample)
```