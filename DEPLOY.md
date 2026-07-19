# 部署指南 — AI 辦公達人

## 事前準備

你需要開通以下免費帳號：

1. **GitHub** — 存放程式碼 (github.com)
2. **Vercel** — 部署網站 (vercel.com)
3. **Supabase** — 用戶認證 + 資料庫 (supabase.com)
4. **Stripe** — 收款 (stripe.com)

---

## Step 1：上傳程式碼到 GitHub

```bash
cd /Users/chengholong/ai-course-platform

# 已經有 Git，直接推上 GitHub
# 1. 去 github.com 開一個新 repository（叫 ai-course-platform）
# 2. 唔好剔任何選項，直接 create
# 3. 跟住 GitHub 顯示嘅指令做：
git remote add origin https://github.com/你的用戶名/ai-course-platform.git
git push -u origin main
```

---

## Step 2：開通 Supabase

1. 去 [supabase.com](https://supabase.com) 註冊
2. 建立新 Project
3. 喺 Project Settings → API 拎到：
   - `Project URL`（NEXT_PUBLIC_SUPABASE_URL）
   - `anon public key`（NEXT_PUBLIC_SUPABASE_ANON_KEY）
   - `service_role key`（SUPABASE_SERVICE_ROLE_KEY）

### 建立資料表

去 Supabase 嘅 SQL Editor，執行：

```sql
CREATE TABLE subscriptions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all"
  ON subscriptions FOR ALL
  USING (true)
  WITH CHECK (true);
```

### 設定 Auth

去 Supabase → Authentication → Settings：
- 開啟 Email + Password 註冊
- 開啟 Google OAuth（需要 Google Cloud Console 申請 credentials）

---

## Step 3：開通 Stripe

1. 去 [stripe.com](https://stripe.com) 註冊
2. 拎到 Publishable Key 同 Secret Key
3. 去 Stripe Dashboard → Webhooks → Add endpoint：
   - Endpoint URL：`https://你的域名.com/api/webhook`
   - 揀事件：`checkout.session.completed`
   - 記低 Webhook Signing Secret

---

## Step 4：喺 Vercel 部署

1. 去 [vercel.com](https://vercel.com) 用 GitHub 登入
2. 按 Add New → Project → 揀 `ai-course-platform`
3. 加入以下環境變數：

```
NEXT_PUBLIC_SUPABASE_URL=你的supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=你的service_role_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=你的stripe_publishable_key
STRIPE_SECRET_KEY=你的stripe_secret_key
STRIPE_WEBHOOK_SECRET=你的webhook_secret
COURSE_PRICE_HKD=89900
NEXT_PUBLIC_SITE_URL=https://你的域名.com
NEXT_PUBLIC_WHATSAPP_GROUP_URL=https://chat.whatsapp.com/你的群組連結
```

4. 按 Deploy，等幾分鐘就搞掂

---

## Step 5：設定域名

1. 喺 Vercel Project → Domains 加入你嘅域名
2. 跟指示改 DNS 設定

---

## 設定價格

價格喺環境變數 `COURSE_PRICE_HKD` 設定。
- 89900 = HK$899
- 要改價錢就改呢個變數，重新 deploy

---

## 常見問題

**Q：網站出 error 500？**
A：多數係環境變數未設定好。Check Vercel 嘅 Environment Variables 係咪齊全。

**Q：Stripe 收唔到錢？**
A：Check Stripe Dashboard 係咪 live mode（測試模式收唔到真錢）。同埋 check webhook endpoint 有冇設定正確。

**Q：用戶登入唔到？**
A：Check Supabase Auth settings 係咪開咗 Email 註冊。

**Q：俾咗錢但睇唔到付費內容？**
A：Check Supabase `subscriptions` 表有冇記錄。可能係 webhook 出問題，去 Stripe Dashboard 睇 webhook logs。
