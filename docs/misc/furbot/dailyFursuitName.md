# api/v2/DailyFursuit/name
根据名字获取指定一期每日鉴毛

:::caution
注意大小写！此处 name 为小写，和 DailyFursuit/id 相同，而 DailyFursuit/Rand 为首字母大写。
:::

## 参数
所有 API 均需要[鉴权参数](/docs/misc/furbot/#鉴权)，除此之外此 API 还需要：

| 参数 | 说明                            | 示例                         |
|------|---------------------------------|------------------------------|
| name | 毛毛名字（中文请使用 URL 编码） | `%E5%88%80%E5%8A%A9`（刀助） |

name 支持模糊搜索，不存在时错误码为 404。

## 示例请求
```url
https://api.tail.icu/api/v2/DailyFursuit/name?name=%E5%88%80%E5%8A%A9&qq=123456789&timestamp=987654321&sign=bd6e7e55657fcb27c71e76e90d8980d5
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

name 不存在时为：
```json
{
  "code": 404,
  "msg": "Fursuit 名字不存在/未收录",
  "data": {
    "msg": "Fursuit Name Not Found"
  },
  "time": 987654321,
  "notice": "MicroTail-API|QQ群：893579624"
}
```
