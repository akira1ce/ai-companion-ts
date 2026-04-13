# ===== Vectorize =====
# 查看向量存储列表
yarn wrangler vectorize list --cwd .

# 删除向量存储
yarn wrangler vectorize delete ai-companion-memories --cwd .

# 创建向量存储
yarn wrangler vectorize create ai-companion-memories --dimensions 768 --metric cosine --cwd .

# 创建 metadata index（需在插入向量前执行，已有向量不会自动生效）
yarn wrangler vectorize create-metadata-index ai-companion-memories --property-name sessionId --type string --cwd .

# ===== D1 =====
# 执行数据库迁移（本地）
yarn wrangler d1 execute ai-companion-db --local --file=./src/sql/schema.sql --cwd .

# 执行数据库迁移（远程）
yarn wrangler d1 execute ai-companion-db --remote --file=./src/sql/schema.sql --cwd .

# 清空 memories 表
yarn wrangler d1 execute ai-companion-db --remote --command="DELETE FROM memories" --cwd .

# ===== KV =====
# 列出所有 key
yarn wrangler kv key list --binding=KV --remote --cwd .

# 批量删除所有 key
yarn wrangler kv key list --binding=KV --remote --cwd . | \
  jq -r '.[].name' | \
  xargs -I {} yarn wrangler kv key delete --binding=KV --remote {} --cwd .

# 删除 namespace 并重建
yarn wrangler kv namespace delete --namespace-id=723da0f6fbb848d198127a089cab5b02 --cwd .
yarn wrangler kv namespace create KV --cwd .

# ===== 日志 =====
# 查看实时日志
yarn wrangler tail --format pretty --cwd .