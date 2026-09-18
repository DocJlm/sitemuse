# 内容与截图维护 / Content and screenshots

## 添加或修改案例 / Edit a case

1. 实际访问原站，确认不是停放域名、错误页或验证页面。检查作者是否已有条目；旧版、子站放入原条目的 `links`，不要重复收录。
   Visit the live site. Reject parked domains, error screens, and challenge pages. Keep related versions in the same creator entry.
2. 编辑 `src/data/sites.json`。`id` 与 `slug` 一经发布应保持稳定，避免破坏链接或已有收藏。使用完整 HTTPS 来源地址。
   Edit the catalog. Keep published IDs and slugs stable so links and favorites keep working.
3. 填写 `description`、`bestFor` 的 `zh/en` 文本，以及 `takeaways.zh/en` 各三个具体借鉴点。类型和风格必须来自 `src/lib/catalog.ts`。
   Provide both languages and exactly three specific takeaways per language. Use existing taxonomy keys.
4. `rank` 决定编辑顺序；`featured` 表示首页精选（首页按数据顺序展示前三个）。`addedAt` 是实际首次收录日期，`verifiedAt` 是最近成功核验日期，均使用 YYYY-MM-DD。
   Rank controls editorial order. Featured entries supply the first three homepage picks. Never fabricate dates.

## 截图流程 / Screenshot workflow

- 用浏览器打开最终来源网址，等待正文、字体、图片和入场动画完成。必要时关闭非必要弹窗，或点击进入作品的按钮。不得通过关闭安全防护绕过验证页面。
- Capture the actual homepage after content, fonts, and entry animations settle. Dismiss ordinary overlays or enter the experience when appropriate.
- 将真实截图保存为 `.captures/<id>.png`；原图仅在本地保存，`.captures/` 不提交。
- Save the real capture to `.captures/<id>.png`. Raw captures stay local and are ignored by Git.
- 首批完整转换：`node scripts/images.mjs`。此命令需要所有条目的原始截图，并生成预览图、联系表与分享图。
- For a single update, run `node scripts/preview.mjs <id> <absolute-path-to-image>`; it converts only that local capture to a 1280×800 WebP without distorting the site.
- 检查生成图不是加载态、空白、错误页或图片断链。转换仅缩放与补边，不重画原站，不生成替代截图。
- Inspect the output for loading states, errors, and broken images. Resize and letterbox only; do not fabricate previews.
- 更新核验日期。保持预览来源与 `url` 一致；关联页的链接不等于已独立核验过截图。

## 验证与发布 / Validate and publish

```sh
npm run validate
npm test
npm run build
npm run typecheck
```

检查中英文卡片和详情、搜索过滤、收藏、手机布局。向 `main` 提交后检查 GitHub CI 与 Vercel 部署状态；最后在生产网址上验证变更。

Review both locales, filters, favorites, and mobile layout. After pushing to main, check GitHub CI and Vercel, then verify the production URL.

撤回内容时删除对应条目与预览图即可；已保存的失效 ID 会被画廊忽略。不要复用旧 ID 给另一个站点。
When removing a site, remove its entry and preview. Unknown favorite IDs are ignored. Never reuse an ID for another creator.
