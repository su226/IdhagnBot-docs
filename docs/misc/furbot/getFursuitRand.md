# api/v2/getFursuitRand
获取随机毛图

## 参数
除[鉴权参数](/docs/misc/furbot/#鉴权)外，无额外参数。

## 示例请求
```url
https://api.tail.icu/api/v2/getFursuitRand?qq=123456789&timestamp=987654321&sign=9e000741fe8ea71f4c54b3b41816fb97
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
