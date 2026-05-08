# xtest-agent-web

Enterprise Next.js + TypeScript + antd + Emotion/antd-style app with the ProChat source kept locally under `src/components/pro-chat`.

## Development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000/chat`.

## Qwen API

Create `.env.local`:

```bash
DASHSCOPE_API_KEY=your_dashscope_api_key
```

The demo page posts ProChat messages to `/api/qwen` and renders `data.output?.text`.
