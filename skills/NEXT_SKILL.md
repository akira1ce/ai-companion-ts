---
name: nextjs-best-practice
description: >-
  Next.js App Router best practices with MVC+BFF architecture, zustand state/action
  separation, and layered naming conventions. Use when building Next.js pages, components,
  services, stores, controllers, or types, or when the user mentions Next.js architecture,
  BFF, zustand patterns, or API layer organization.
---

# Next.js 最佳实践 — MVC + BFF 架构

## 架构总览

采用 **MVC + BFF** 分层架构，职责清晰：

- **Model（services/）**：纯粹的 API 调用层，不做任何数据变换
- **Controller（controller.ts）**：与页面同级放置，负责 API 数据到 UI 模型的转换（BFF 层）
- **View（page.tsx + components/）**：React 组件，消费 controller 返回的数据

```
src/
├── app/                        # View 层
│   ├── (auth)/                 # 路由分组：无需登录的页面
│   │   └── login/page.tsx
│   ├── (main)/                 # 路由分组：需要登录的页面
│   │   ├── layout.tsx          # 公共布局（Sidebar + AuthGuard）
│   │   └── posts/              # 示例：文章功能
│   │       ├── page.tsx        # View —— 页面入口
│   │       ├── controller.ts   # Controller —— 数据转换
│   │       └── components/     # 页面级组件
│   │           └── post-card.tsx
│   └── layout.tsx              # 根布局
├── components/                 # 跨页面复用的公共组件
├── services/                   # Model 层 —— 原始 API 调用
│   ├── index.ts                # 桶导出
│   └── post.ts
├── types/                      # 共享类型定义
│   ├── index.ts                # 桶导出（export type *）
│   └── post.ts
├── stores/                     # 全局状态（zustand）
│   ├── index.ts                # 桶导出
│   └── app.ts
└── lib/                        # 工具（http 客户端等）
    └── request.ts
```

## 各层职责

### 1. Service 层（Model）— `services/`

只做 API 调用，不做数据变换，不含业务逻辑。

- 按领域实体拆分文件（`post.ts`、`user.ts`、`auth.ts`）
- 函数以 `api` 前缀命名：`apiGetPosts`、`apiCreatePost`
- 参数使用 `Api*Req` 类型，返回值保持 API 原始结构
- 所有函数通过 `services/index.ts` 桶导出

```typescript
// services/post.ts
/* 「service」 */
import { http } from "@/lib/request";
import type { ApiPost, ApiCreatePostReq } from "@/types";

export const apiGetPosts = (): Promise<{ data: ApiPost[] }> => {
  return http.get<ApiPost[]>("/api/posts");
};

export const apiCreatePost = (
  params: ApiCreatePostReq,
): Promise<{ data: ApiPost }> => {
  return http.post<ApiPost>("/api/posts", params);
};
```

```typescript
// services/index.ts
export { apiGetPosts, apiCreatePost } from "./post";
```

### 2. Controller 层（BFF）— 与页面同级的 `controller.ts`

在 API 原始数据（snake_case）和 UI 友好模型（camelCase、派生字段）之间做转换。每个页面目录拥有自己的 `controller.ts`。

- 函数是普通 `async function`，用动词命名：`getPosts`、`createPost`
- 调用 service 函数，将 `Api*` 类型映射为 `controller-type` 接口
- 不含 UI 逻辑、不导入 React、不写入 store

```typescript
// app/(main)/posts/controller.ts
/* 「controller」 */
import { apiGetPosts, apiCreatePost } from "@/services";
import type { PostItem, ApiCreatePostReq, ApiPost } from "@/types";

function toPostItem(data: ApiPost): PostItem {
  return {
    id: data.id,
    title: data.title,
    summary: data.content.slice(0, 100),
    author: data.author_name,
    createdAt: data.created_at,
  };
}

export async function getPosts(): Promise<PostItem[]> {
  const { data } = await apiGetPosts();
  return data.map(toPostItem);
}

export async function createPost(params: ApiCreatePostReq): Promise<PostItem> {
  const { data } = await apiCreatePost(params);
  return toPostItem(data);
}
```

### 3. View 层 — `page.tsx` + `components/`

React 组件负责 UI 渲染和用户交互。

- `page.tsx` 是入口，标注 `/* 「view」 */` 和 `"use client"`
- 页面级子组件放在同级 `components/` 文件夹
- 页面只从自己的 `controller.ts` 导入数据函数，不直接调用 `services/`
- 跨页面复用的组件放在顶层 `components/`

```typescript
// app/(main)/posts/page.tsx
/* 「view」 */
"use client";

import { useQuery } from "@akira1ce/r-hooks";
import { getPosts } from "./controller";
import { PostCard } from "./components/post-card";

export default function PostsPage() {
  const { data: posts, loading } = useQuery(getPosts, { defaultData: [] });

  if (loading) return <p>加载中...</p>;

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

## 类型命名规范

每个类型文件分为两个区域，用注释标注：

```typescript
// types/post.ts

/* 「service-type」 —— 匹配 API 契约（snake_case 字段） */

export interface ApiPost {
  id: string;
  title: string;
  content: string;
  author_name: string;
  created_at: number;
}

export interface ApiCreatePostReq {
  title: string;
  content: string;
}

export interface ApiPostListRes {
  data: ApiPost[];
}

/* 「controller-type」 —— UI 友好模型（camelCase 字段） */

export interface PostItem {
  id: string;
  title: string;
  summary: string;
  author: string;
  createdAt: number;
}
```

### 命名规则

| 分类 | 模式 | 示例 |
|------|------|------|
| API 实体 | `Api{Entity}` | `ApiUser`、`ApiPost` |
| 请求参数 | `Api{Action}{Entity}Req` | `ApiLoginReq`、`ApiCreatePostReq` |
| 响应包装 | `Api{Entity}Res` / `Api{Entity}ListRes` | `ApiPostRes`、`ApiPostListRes` |
| UI 模型 | 描述性名词 | `UserProfile`、`PostItem` |
| Service 函数 | `api{Action}` | `apiLogin`、`apiGetPosts`、`apiCreatePost` |
| Controller 函数 | `{动词}{Entity}` | `getPosts`、`createPost`、`updateUser` |

桶导出类型使用 `export type *`：

```typescript
// types/index.ts
export type * from "./post";
export type * from "./user";
```

## Zustand — 状态与 Action 分离

hook 只持有状态定义；action 是同文件导出的普通对象。

```typescript
// stores/app.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProfile } from "@/types";

interface AppState {
  user: UserProfile | null;
}

export const useApp = create<AppState>()(
  persist(
    (): AppState => ({ user: null }),
    { name: "APP_STORE", storage: createJSONStorage(() => localStorage) },
  ),
);

const set = useApp.setState;

export const appActions = {
  setUser: (user: UserProfile) => set({ user }),
  clearUser: () => set({ user: null }),
};
```

### 为什么要分离？

- action 在事件处理和副作用中调用，不在渲染期间执行——不需要是 hook。
- 组件通过 selector 订阅状态：`useApp((s) => s.user)`，避免整个 store 变更触发重渲染。
- action 可以在 React 外部调用（controller、工具函数），不受 hook 规则限制。
- `appActions` 是稳定引用，不需要 `useCallback` 包裹。

### 何时使用 persist

只有真正需要跨页面刷新保持的状态（如登录态）才使用 `persist`。页面挂载时请求的数据不需要持久化。

## 状态放置原则

### 默认放组件本地

只有当前组件关心的状态，留在组件内部。不要过早提升。

```typescript
const [posts, setPosts] = useState<PostItem[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### 以下场景才放全局 store

1. **跨页面共享** —— 用户信息在侧栏、设置页、聊天页都需要 → `useApp`
2. **跨组件协调** —— 侧栏的列表和主内容区需要同步状态 → 独立 store
3. **导航间持久化** —— 登录状态需要在页面刷新后保留

### 绝对不要放 store 的

- 表单输入状态
- 页面级的 loading / error 标志
- 仅一个页面使用的请求数据（用 `useQuery` 或本地 state）

## React 使用原则

### 不滥用 `useCallback`

内联事件处理函数完全没问题。只有以下情况才使用 `useCallback`：

1. 回调传给 `React.memo` 包裹的子组件，且性能分析确认了不必要的重渲染
2. 回调作为 `useEffect` 依赖，不包裹会导致无限循环

```typescript
// 好 —— 内联处理函数，简洁直观
const handleSubmit = async () => {
  if (!title.trim()) return;
  await createPost({ title, content });
};

// 坏 —— 没必要的 useCallback，这个函数只在当前组件使用
const handleSubmit = useCallback(async () => { ... }, [title, content]);
```

### 不过度封装

- 不要为只用一次的 `useState` + `useEffect` 创建自定义 hook
- 不要把每个 API 调用都封装成自定义 hook —— controller 层已经负责了编排
- 组件保持直观：获取数据 → 管理本地状态 → 渲染

### Props 向下，Events 向上

子组件通过 props 接收数据，通过回调 props 向上通信：

```typescript
interface PostCardProps {
  post: PostItem;
  onDelete?: (id: string) => void;
}
```

### 文件角色标记

用注释标注文件的架构角色：

```typescript
/* 「view」 */            // page.tsx、组件文件
/* 「controller」 */      // controller.ts
/* 「service」 */         // services/*.ts
/* 「service-type」 */    // API 契约类型
/* 「controller-type」 */ // UI 模型类型
```

## 路由分组

使用 Next.js 路由分组区分鉴权和非鉴权页面：

- `(auth)/` —— 登录、注册页面，无侧栏，无鉴权守卫
- `(main)/` —— 所有需要登录的页面，公共 layout 包裹 `<AuthGuard>` 和 `<Sidebar>`

## HTTP 客户端

`lib/request.ts` 提供一个轻量的 `http` 对象，封装 `fetch`、JSON 序列化和统一错误处理。所有 service 文件从 `@/lib/request` 导入。

```typescript
export const http = {
  get<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> { ... },
  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> { ... },
  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> { ... },
  delete<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> { ... },
};
```

## 新功能 Checklist

创建一个新功能页面时：

1. 在 `types/{entity}.ts` 定义 `Api*` 类型和 `controller-type`，从 `types/index.ts` 桶导出
2. 在 `services/{entity}.ts` 编写 service 函数（`api*`），从 `services/index.ts` 桶导出
3. 在 `app/(main)/` 下创建页面目录，包含 `page.tsx`、`controller.ts` 和 `components/`
4. controller 从 `@/services` 导入，做数据转换，导出普通 async 函数
5. page 从 `./controller` 和 `@/stores` 导入，本地管理 UI 状态，渲染子组件
6. 只有状态确实需要跨页面 / 跨组件共享时，才创建 zustand store
