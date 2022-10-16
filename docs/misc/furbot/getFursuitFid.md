# api/v2/getFursuitFid
获取同一个名字的所有 ID

:::caution
注意大小写！此处 Fid 为首字母大写，而 getFursuitByID 中的 ID 为全大写（并且没有F）。
:::

## 参数
所有 API 均需要[鉴权参数](/docs/misc/furbot/#鉴权)，除此之外此 API 还需要：

| 参数 | 说明                            | 示例                         |
|------|---------------------------------|------------------------------|
| name | 毛毛名字（中文请使用 URL 编码） | `%E7%91%9E%E7%8B%A9`（瑞狩） |

name **不支持**模糊搜索，不存在时**错误码也是 200**，但 fids 为空数组。

## 示例请求
```
https://api.tail.icu/api/v2/getFursuitFid?name=%E7%91%9E%E7%8B%A9&qq=123456789&timestamp=987654321&sign=0efb0dc9f385acf9b255067d704eb97a
```
*QQ 号、Token 和时间戳已隐去。*

## 示例响应
响应成功时为以下格式：
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "name": "瑞狩", // 你填写的名字/查询到的名字
    "fids": [ // 所有 ID
      6,
      1172,
      1173,
      1240,
      1241,
      3149
    ]
  },
  "time": 987654321,
  "notice": "MicroTail-API|QQ群：893579624"
}
```

name 不存在时为：
```json
{
  "code": 200, // 注意此处也是 200
  "msg": "操作成功",
  "data": {
    "name": "", // 你填写的名字
    "fids": [] // 固定为空数组
  },
  "time": 987654321,
  "notice": "MicroTail-API|QQ群：893579624"
}
```

