-- 用户级专属账号绑定表
-- 轻运营场景下，第三方账号直接绑定给某个用户使用，跳过为每个客户单独创建 group。

CREATE TABLE IF NOT EXISTS user_route_bindings (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    dedicated_account_id BIGINT REFERENCES accounts(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_user_route_bindings_non_empty
        CHECK (dedicated_account_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_user_route_bindings_dedicated_account_id
    ON user_route_bindings(dedicated_account_id)
    WHERE dedicated_account_id IS NOT NULL;
