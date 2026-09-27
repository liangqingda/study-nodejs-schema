# study-nodejs-schema

Node.js 20+ / pnpm 的 API 契约包。TypeScript 源码使用 ESM `import`/`export`，构建为 CommonJS；发布到 GitHub Packages，包内只有 `lib/`。

## 安装与运行

```sh
pnpm install
pnpm lint
pnpm build
node lib/apis/greeting/example-server.js
```

另一个终端请求真实接口：

```sh
curl -i -X POST http://localhost:3001/greetings -H 'Content-Type: application/json' -d '{"name":"Ada","mood":"formal"}'
curl -i -X POST http://localhost:3001/greetings -H 'Content-Type: application/json' -d '{"name":""}'
```

第一个请求返回 200、`{"message":"Good day, Ada."}`；第二个在 Zod 的 `min(1)` 校验处失败，返回 400。服务终端打印 `[greeting]` 对应的接收、验证与响应步骤，不输出请求内容。未知路径返回 404。`PORT` 可指定监听端口。

## 添加 API

在 `apis/<feature>/` 放置请求 schema、响应 schema/类型和 `defineApiInfo` 描述，并经 `apis/index.ts` 导出。顶层导出的 `ZodObject` 必须调用 `.openapi('唯一的有效 TypeScript 标识符')`；嵌套命名 object/enum 也会生成引用类型。业务实现优先用 `z.infer<typeof schema>`，手写响应类型仅用于演示两种来源。`types/api-types.ts` 标记前可以维护 import，`// start of generated types` 后禁止手改。`common/` 只放跨 API 共享内容。

```sh
pnpm generate:apitypes
pnpm generate:openapi
pnpm build
```

生成的 `types/api-types.ts` 会参与编译；OpenAPI 3.1 输出到根目录被忽略的 `openApiJsonFile.json`，构建复制到 `lib/openApiJsonFile.json`。`pnpm build` 自动执行两个生成步骤，失败不会暂改 `types/index.ts`。实现、注册、执行路径及边界见 [架构说明](docs/schema-package.md)。

## 发布

`package.json` 的 `publishConfig.registry` 和 `.npmrc` 把 `@liangqingda` 指向 GitHub Packages；配置有权限的 GitHub token 后执行 `pnpm publish`，`prepack` 会先构建。安装此包的消费者也需配置相同的 scoped registry 和自己的读取权限。`main`/`types` 指向 `lib/index.js`/`lib/index.d.ts`；子路径 `./apis` 指向 `lib/apis/index.js`。提交时 Husky 调用 lint-staged 对暂存的 `.ts` 文件运行 `eslint --fix`。发布前可执行 `pnpm pack --pack-destination /tmp`，再检查生成的 tarball 清单。
