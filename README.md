# 国复数据 · 国际工程数据平台（改版）

面向海外工程承包与投资决策的 B2B 数据平台前端。本仓库为**视觉与版式改版版**：功能与板块保持完整，重新建立了统一的色系、字体层级、栅格与组件规范，适配高端商务场景。

## 改版说明（对应客户三点要求）

| 客户要求 | 本次处理 |
|---|---|
| 1. 功能与板块不删减，可调整位置 | 20 个页面、全部模块与交互（搜索 / 筛选 / 排序 / 分页 / 关注 / 报告下载 / 工作台 / 付费墙）均保留；首页重排为「Hero → 今日速览 → 情报两栏 → 三大速览 → CTA」，信息动线更清晰 |
| 2. 优化页面与板块内部布局（文字位置、字号、按钮、图标） | 统一 8pt 间距与 1320px 栅格；标题/正文/辅助文字三级字号；按钮改为直角实心 + 描边两档；导航加分组与图标位；卡片内边距与对齐重做 |
| 3. 色系统一，适合高端商务 2B | 全站收敛为「深海军蓝 + 古铜金 + 暖灰」单一色系：主色 `#16324F`，点缀 `#A8894F`，底色 `#F6F5F2`；图表、封面、徽标、表格全部同源取色，取消原先蓝/绿/紫/橙多色混用与大面积渐变 |

同时去掉了两版反面案例中的问题：不再使用城市照片做 Hero 背景、不再用高饱和黄色大色块、不再出现文字压在杂乱图片上。

## 目录

```
index.html            首页（Hero + 今日速览 + 热点动态 + 三大速览 + CTA）
owners.html           业主库（S–D 分级 + 榜单）
owner.html            业主详情 ?id=
contractors.html      承包商库
contractor.html       承包商详情 ?id=
countries.html        国别库
country.html          国别详情 ?id=
country-news.html     国别资讯
projects.html         项目库
project.html          项目详情 ?id=
reports.html          彩虹系列报告
news.html             资讯频道
news-article.html     资讯详情 ?id=
library.html          出海知识库
article.html          知识库文章 ?i=
search.html           全站搜索 ?q=&type=
login.html            登录 / 注册
workbench.html        会员工作台
pay.html              付费墙
about.html            关于 / 价格 / 评价
assets/style.css      基础样式（布局骨架）
assets/theme.css      改版视觉层（色系 / 字体 / 组件 / 版式）
assets/app.js         共享逻辑（导航 / 图表 / 弹窗 / 关注）
assets/data.js        演示数据与评分生成
assets/img/           站标、二维码、资讯图
```

## 设计规范

```css
--blue:#16324F    /* 主色：深海军蓝 */
--yellow:#A8894F  /* 点缀：古铜金 */
--ink:#121A24     /* 正文标题 */
--ink-2:#46505C   /* 次级文字 */
--ink-3:#8A939E   /* 辅助文字 */
--line:#E3E1DB    /* 发丝线 */
--bg:#F6F5F2      /* 页面底色 */
```

- 栅格：`max-width 1320px`，桌面 12 栏，内容区间距 32px
- 圆角：卡片 4px，按钮/标签 2px（不用胶囊）
- 阴影：默认无阴影，仅悬停时使用一层柔和投影
- 数字：全部 `tabular-nums`，榜单与评分右对齐
- 字体：Inter / PingFang SC / Microsoft YaHei 系统栈

## 本地运行

纯静态，无构建依赖：

```bash
python -m http.server 8080
# 打开 http://127.0.0.1:8080
```

也可直接双击 `index.html`（页面不使用 fetch）。

## 数据说明

`assets/data.js` 为**演示数据**：64 国别 / 54 承包商 / 39 业主 / 120 项目 / 60 份报告 / 19 条资讯 / 180 篇文章。六维评分由 FNV-1a 哈希确定性生成，仅用于展示交互与版式。接入真实数据时保持字段名不变、替换 `COUNTRIES_RAW` 等常量即可，页面无需改动。

## 登录与会员（演示）

`login.html` 任意账号 + 6 位密码即可登录；点击「使用会员演示账号」直接进入会员态。状态存于 `localStorage` 的 `gf_session`，关注列表存于 `ggi_favs`。生产环境需替换为服务端鉴权与签名下载链接。
