# api/v2/getFursuitByID
根据 ID 获取指定毛图

:::caution
注意大小写！此处 ID 为全大写，而 getFursuitFid 中的 Fid 为首字母大写（并且前面有F）。
:::

## 参数
所有 API 均需要[鉴权参数](/docs/misc/furbot/index#鉴权)，除此之外此 API 还需要：

| 参数                     | 说明                                                | 示例 |
|--------------------------|-----------------------------------------------------|------|
| fid（**注意前面有个f**） | 毛毛 ID，一个名字可能对应多个，一张图片唯一对应一个 | 6925 |

fid 不存在时错误码为 404。

## 示例请求
```
https://api.tail.icu/api/v2/getFursuitByID?id=6925&qq=123456789&timestamp=987654321&sign=2e9349b16391c373d720c691e86647b3
```
*QQ 号、Token 和时间戳已隐去。*

## 示例响应
`getFursuitRand`、`getFursuitByName`、`getFursuitByID` 响应成功时均为以下格式：
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "id": 6925, // ID
    "cid": null, // 特殊 ID，可能为字符串或 null。
    "name": "焰犬", // 名字
    "url": "https://*已隐去*", // 完整图片**临时**地址
    "thumb": "https://*已隐去*" // 缩略图（分辨率 300x300 以内）**临时**地址
  },
  "time": 987654321,
  "notice": "MicroTail-API|QQ群：893579624"
}
```

fid 不存在时为：
```json
{
  "code": 404,
  "msg": "FurID不存在",
  "data": {
    "msg": "FurID Not Found"
  },
  "time": 987654321,
  "notice": "MicroTail-API|QQ群：893579624"
}
```

:::caution
此 API 在未传入 fid 参数时不会报错，而是固定返回 ID 为 2 的图片（可能是 Bug），请小心。
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "id": 2,
    "cid": null,
    "name": "果糖",
    "url": "https://*已隐去*",
    "thumb": "https://*已隐去*"
  },
  "time": 987654321,
  "notice": "MicroTail-API|QQ群：893579624"
}
```
:::
