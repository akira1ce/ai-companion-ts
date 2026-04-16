---
name: mvc-bff-page
description: >-
  Scaffold and develop React page modules following the MVC+BFF design pattern.
  Use when creating new pages, adding page-level API services, defining page types,
  or building controller logic for data transformation. Applies to any work under src/pages/.
---

# MVC+BFF Page Pattern

本项目页面模块采用 **MVC + BFF** 分层设计模式，将 UI 渲染、数据处理、API 通信、类型定义严格分离。

## Architecture Overview

```
src/pages/<page-name>/
├── index.tsx            # View 层 - 页面组件，纯 UI 渲染
├── controller.ts        # Controller 层 - 数据加工、校验、组合
├── service.ts           # BFF/Service 层 - API 接口调用，与服务端 1:1 对应
├── type.ts              # Type 层 - 集中管理页面所有类型定义
└── components/          # 子组件目录（按需）
    └── <component>.tsx
```

## Layer Responsibilities

### View (`index.tsx`)

页面组件，只关心 **渲染** 和 **用户交互**，不直接调用 API。

- 从 controller 获取处理好的数据
- 管理 UI 状态（loading、表单输入等）
- 组合子组件完成页面布局
- 通过 hooks 或 controller 函数触发业务动作

```typescript
/* 「view」 */
import { getOverUsersInfo } from "./controller";

export default function Page() {
  const [promise] = useState(getOverUsersInfo);
  return (
    <Suspense fallback={<Loading />}>
      <List promise={promise} />
    </Suspense>
  );
}
```

### Controller (`controller.ts`)

直接对接 View 层，完成数据加工逻辑：

1. **数据校验** - 验证参数合法性
2. **数据二次处理** - 将 service 返回的原始数据转换为 View 层所需格式
3. **多接口编排** - 组合多个 service 调用
4. **组件级 hooks** - 提供页面级别的自定义 hooks

```typescript
/**
 * 「controller」
 */
import { getUsersInfo } from "./service";
import type { OverUserInfo } from "./type";

export async function getOverUsersInfo() {
  const list = await getUsersInfo();
  const overList: OverUserInfo[] = list.map((item, index) => ({
    id: Math.random().toString(16),
    desc: `${index}、desc`,
    email: item.email,
    name: `${item.name.first} ${item.name.last}`,
    thumbnail: item.picture.thumbnail,
  }));
  return overList;
}
```

### Service (`service.ts`)

BFF 服务层，**与服务端接口文档严格保持一致**。

- 每个函数对应一个后端 API 接口
- 入参和返回值类型从 `type.ts` 导入
- 仅做 HTTP 调用，不做数据加工
- 多接口合并聚合也放在此层

```typescript
/*
 *「service」
 * 应该与服务端提供的接口文档严格保持一致
 */
import type { ApiLoginReq } from "./type";

export const apiLogin = async (params: ApiLoginReq) => {
  // HTTP 调用
};
```

### Type (`type.ts`)

集中管理页面所有类型定义，避免业务代码中散落类型。

按注释分区组织：

- `「controller-type」` - View 层消费的数据结构（经过 controller 加工后的类型）
- `「service-type」` - 与后端 API 对应的原始数据结构

```typescript
/**
 * 定义数据类型
 * 统一管理类型，避免业务代码中过多的类型定义，造成污染
 */

/* 「controller-type」 */
export interface OverUserInfo {
  id: string;
  name: string;
  thumbnail: string;
}

/* 「service-type」 */
export interface UserInfo {
  name: { first: string; last: string };
  picture: { thumbnail: string };
}
```

### Components (`components/`)

页面私有子组件，仅在当前页面内复用。

- 通过 props 接收 controller 层处理好的数据
- 不直接调用 service 或 controller
- 文件名使用 kebab-case

## Naming Conventions

### Directory & Files

| 对象 | 风格 | 示例 |
|------|------|------|
| 页面目录 | kebab-case | `user-profile/`, `order-detail/` |
| 入口文件 | 固定 | `index.tsx` |
| 控制器 | 固定 | `controller.ts` |
| 服务层 | 固定 | `service.ts` |
| 类型文件 | 固定 | `type.ts` |
| 子组件文件 | kebab-case | `components/user-card.tsx` |

### Functions

| 层级 | 前缀规则 | 示例 |
|------|----------|------|
| Service 函数 | `api` + 动词 + 名词 | `apiLogin`, `apiGetUserInfo`, `apiUpdateOrder` |
| Controller 函数 | `get/set/handle` + 业务描述 | `getOverUsersInfo`, `handleSubmitOrder` |
| Controller hooks | `use` + 业务描述 | `useUserForm`, `useOrderList` |

### Types & Interfaces

| 类别 | 规则 | 示例 |
|------|------|------|
| API 请求类型 | `Api` + 接口名 + `Req` | `ApiLoginReq`, `ApiGetUserInfoReq` |
| API 响应类型 | `Api` + 接口名 + `Res` | `ApiLoginRes`, `ApiGetUserInfoRes` |
| Controller 类型 | 业务语义命名（PascalCase） | `OverUserInfo`, `OrderDetail` |

### File Header Comments

每个文件使用「标记注释」标明层级归属：

```typescript
/* 「view」 */        // index.tsx
/* 「controller」 */  // controller.ts
/* 「service」 */     // service.ts
```

## Workflow: Creating a New Page

1. **创建目录**: `src/pages/<page-name>/`
2. **定义类型**: 在 `type.ts` 中定义 service-type 和 controller-type
3. **实现 Service**: 在 `service.ts` 中按接口文档实现 API 调用
4. **实现 Controller**: 在 `controller.ts` 中完成数据转换和编排
5. **实现 View**: 在 `index.tsx` 中组合 UI，从 controller 获取数据
6. **拆分组件**: 将可复用 UI 片段提取到 `components/` 目录

## Key Principles

- **View 不直接调用 Service** - 始终通过 Controller 或 hooks 间接访问
- **Service 与接口文档一致** - 不在 service 层做数据加工
- **类型集中管理** - 所有类型放在 `type.ts`，按分区注释组织
- **Controller 负责适配** - 将后端数据结构转换为前端 UI 友好的格式
- **全局共享逻辑** 放 `src/hooks/` 或 `src/stores/`，页面级逻辑留在 controller
