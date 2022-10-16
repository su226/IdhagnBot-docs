# api/v2/DailyFursuit/id
根据期数（不是毛毛 ID）获取指定一期每日鉴毛

:::caution
注意大小写！此处 id 为小写，和 DailyFursuit/name 相同，而 DailyFursuit/Rand 为首字母大写。
:::

## 参数
所有 API 均需要[鉴权参数](/docs/misc/furbot/index#鉴权)，除此之外此 API 还需要：

| 参数 | 说明                                    | 示例 |
|------|-----------------------------------------|------|
| id   | ID，此处是每日鉴毛期数，**不是毛毛 ID** | 68   |

id 不存在时错误码为 404。

## 示例请求
```url
https://api.tail.icu/api/v2/DailyFursuit/id?id=68&qq=123456789&timestamp=987654321&sign=1485ac61a3d42a4e9ff481af927c7922
```
*QQ 号、Token 和时间戳已隐去。*

## 示例响应
`DailyFursuit/Rand`、`DailyFursuit/name`、`DailyFursuit/id` 响应成功时均为以下格式：
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "id": 68, // ID，此处为期数，不是毛毛的 ID
    // 注意 DailyFursuit 相关 API 没有 cid
    "name": "刀助", // 名字
    "url": "https://*此处省略*", // 完整图片**临时**地址
    "thumb": "https://*此处省略*" // 缩略图（分辨率 300x300 以内）**临时**地址
  },
  "time": 987654321,
  "notice": "MicroTail-API|QQ群：893579624"
}
```

id 不存在时为：
```json
{
  "code": 404,
  "msg": "没有找到这一期每日鉴毛",
  "data": {
    "msg": "Daily Fursuit Id Not Found"
  },
  "time": 987654321,
  "notice": "MicroTail-API|QQ群：893579624"
}
```
