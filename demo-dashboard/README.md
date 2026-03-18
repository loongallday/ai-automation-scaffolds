# AI Studio — Demo Dashboard

A single-file demo dashboard that simulates external services (LINE, orders, Google reviews) so you can demonstrate AI automation workflows **without real API keys or LINE accounts**.

## Quick Start

1. Open `index.html` in any browser — no build step, no npm, no dependencies.
2. Set the **n8n Webhook URL** in the config bar at the top (default: `http://localhost:5678/webhook/`).
3. Start sending test messages and showing results to customers.

## Tabs

### LINE Simulator
- Mock LINE chat UI with green bubbles
- Type a customer message or click a pre-filled quick message
- The message is sent as a webhook to n8n (`/webhook/line-demo`)
- n8n processes it and returns an AI response
- If n8n is not reachable, a realistic mock response is shown instead

### Order Simulator
- Fill in customer details and click "Create Order"
- Sends order data to n8n (`/webhook/order-demo`)
- Animated timeline shows: Received → Processing → Shipped
- Order history is displayed below

### Review Simulator
- Select a star rating (1-5) and write a review
- Click "Submit Review" → sends to n8n (`/webhook/review-demo`)
- Shows the AI-generated reply (or a mock reply if n8n is offline)
- Review history with AI responses is displayed below

### Analytics
- Static/random mock charts (no real data)
- Daily sales, messages per day, rating distribution, response time
- Useful for visual demos during sales calls

## Configuration

Edit `config.js` to change defaults:

```javascript
const DEMO_CONFIG = {
  n8n_webhook_url: "http://localhost:5678/webhook/",
  line_webhook_path: "line-demo",
  order_webhook_path: "order-demo",
  review_webhook_path: "review-demo",
  fallback_delay: 1500,
  offline_mode: false,
};
```

Or change the webhook URL directly in the browser's config bar.

## Offline Mode

Toggle "Offline Mode" in the config bar to use built-in mock responses without calling n8n. This is useful for demos when n8n is not running.

## Using During Sales Calls

1. Open the dashboard in your browser
2. Enable Offline Mode if n8n is not running, or connect to a live n8n instance
3. Walk the customer through each tab:
   - **LINE tab**: "This is how your customers will chat with AI on LINE"
   - **Order tab**: "Orders are automatically processed and tracked"
   - **Review tab**: "AI automatically replies to Google reviews"
   - **Analytics tab**: "You get real-time analytics for everything"
4. If connected to n8n, the responses are real AI — which is more impressive

## Docker / Caddy

When using with docker-compose, the dashboard is served at `/demo` by Caddy. The `demo-dashboard/` directory is mounted as a volume into the Caddy container.

## n8n Webhook Setup

To receive webhooks from this dashboard, create these n8n workflows:

1. **LINE Demo**: Webhook trigger at `/webhook/line-demo` → AI node → Respond with `{ "reply": "..." }`
2. **Order Demo**: Webhook trigger at `/webhook/order-demo` → Process order → Respond with status
3. **Review Demo**: Webhook trigger at `/webhook/review-demo` → AI node → Respond with `{ "reply": "..." }`
