# api/v2/getFursuitByName
根据名字查找毛图

## 参数
所有 API 均需要[鉴权参数](/docs/misc/furbot/#鉴权)，除此之外此 API 还需要：

| 参数 | 说明                            | 示例                         |
|------|---------------------------------|------------------------------|
| name | 毛毛名字（中文请使用 URL 编码） | `%E7%84%B0%E7%8A%AC`（焰犬） |

name 支持模糊搜索，不存在时错误码为 404，有多张图片时随机返回一张。

## 示例请求
```
https://api.tail.icu/api/v2/getFursuitByName?name=%E7%84%B0%E7%8A%AC&qq=123456789&timestamp=987654321&sign=ce4a9627f83d3910d2296651a32f60c6
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
