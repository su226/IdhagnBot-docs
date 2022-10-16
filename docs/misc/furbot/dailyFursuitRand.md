# api/v2/DailyFursuit/Rand
获取随机一期每日鉴毛

:::caution
注意大小写！此处 Rand 为首字母大写，而 DailyFursuit/name 和 DailyFursuit/id 为小写。
:::

## 参数
除[鉴权参数](/docs/misc/furbot/index#鉴权)外，无额外参数。

## 示例请求
```url
https://api.tail.icu/api/v2/DailyFursuit/Rand?qq=123456789&timestamp=987654321&sign=3958c186d76aa4bb9e640eaed83ebe36
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
    "url": "https://*已隐去*", // 完整图片**临时**地址
    "thumb": "https://*已隐去*" // 缩略图（分辨率 300x300 以内）**临时**地址
  },
  "time": 987654321,
  "notice": "MicroTail-API|QQ群：893579624"
}
```
