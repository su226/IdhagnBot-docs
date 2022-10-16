# 绒狸 API 文档（非官方）
在开发 IdhagnBot 的[绒狸插件](/docs/guide/plugins/furbot)时，我发现绒狸官方并没有 HTTP API 文档，我只能参照其他插件，如 [Furbot-Mirai](https://github.com/furleywolf/Furbot-Mirai) 或 [Nonebot-Plugin-PyFurbot](https://github.com/BuDingOwO/Nonebot-Plugin-PyFurbot) 来编写，因此我决定为绒狸编写第三方 API 文档。

## 可用 API

* [`api/v2/getFursuitRand`](/docs/misc/furbot/getFursuitRand): 获取随机毛图
* [`api/v2/getFursuitByName`](/docs/misc/furbot/getFursuitByName): 根据名字查找毛图
* [`api/v2/getFursuitByID`](/docs/misc/furbot/getFursuitByID): 根据 ID 获取指定毛图
* [`api/v2/getFursuitFid`](/docs/misc/furbot/getFursuitFid): 获取同一个名字的所有 ID
* [`api/v2/DailyFursuit/Rand`](/docs/misc/furbot/dailyFursuitRand): 获取随机一期每日鉴毛
* [`api/v2/DailyFursuit/name`](/docs/misc/furbot/dailyFursuitName): 根据名字获取指定一期每日鉴毛
* [`api/v2/DailyFursuit/id`](/docs/misc/furbot/dailyFursuitId): 根据期数（不是毛毛 ID）获取指定一期每日鉴毛

所有 API 的主机目前均为 https://api.tail.icu

## 鉴权
如[绒狸插件](/docs/guide/plugins/furbot#搭建说明)的文档所说，你需要先[前往绒狸官方群](https://jq.qq.com/?_wv=1027&k=5YmdAAH9)或[填写问卷](https://wj.qq.com/s2/9668371/f3bc/)申请一个 API Token。

然后所有 API 都接受以下三个参数用于鉴权：

| 参数      | 说明                               | 示例                             |
|-----------|------------------------------------|----------------------------------|
| qq        | 你的 QQ 号，注意**不是机器人的**。 | 123456789                        |
| timestamp | 当前的 UNIX 时间戳。               | 987654321                        |
| sign      | 一个MD5，参见下文。                | a39c52746fa9552cefe685b1fc40aee9 |

:::caution
不要暴露你的 Token！示例中的 QQ 号均已用 `123456789` 替代，Token 均已用 `1234567890ABCDEF` 替代，时间戳均已用 `987654321` 替代。
:::

sign 是 `API-时间戳-Token` 字符串的 MD5 哈希值，假如你调用的 API 是 `api/v2/getFursuitRand`，当前时间戳是 `987654321`，Token 是 `1234567890ABCDEF`，就是字符串 `api/v2/getFursuitRand-987654321-1234567890ABCDEF` 的哈希值，即 `9e000741fe8ea71f4c54b3b41816fb97`；并且因为所有的 API 都使用 GET 方法，你需要把 sign 放在 URL 中，示例如下：

```
https://api.tail.icu/api/v2/getFursuitRand?qq=123456789&timestamp=987654321&sign=9e000741fe8ea71f4c54b3b41816fb97
```

getFursuitRand 没有其他参数，因此只需要这三个即可。

## 结果和错误码
所有 API 的结果均为以下格式：
```json
{
  "code": 200, // 响应成功时为 200，参数缺失为 400，鉴权失败为 403，毛毛不存在时为 404
  "msg": "操作成功", // 错误信息
  "time": 987654321, // 响应时间
  "data": {}, // 数据，随 API 而定
  "notice": "MicroTail-API|QQ群：893579624" // 公告
}
```

鉴权失败时为：
```json
{
  "code": 403,
  "msg": "API用户不存在-未授权", // msg可能不同
  "data": [
    "Unauthorized"
  ],
  "time": 987654321,
  "notice": "MicroTail-API|QQ群：893579624"
}
```

参数缺失时为：
```json
{
  "code": 400,
  "msg": "没有传入毛毛的名字name", // msg可能不同
  "data": {
    "msg": "Fursuit Name Not Provided"
  },
  "time": 987654321,
  "notice": "MicroTail-API|QQ群：893579624"
}
```
