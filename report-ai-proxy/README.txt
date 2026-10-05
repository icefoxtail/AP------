Report AI Proxy
===============

This proxy receives AP Math OS report-analysis payloads from the Cloudflare Worker and calls Gemini from outside the Worker runtime.

Endpoint
--------

POST /api/report-analysis

Required environment variables
------------------------------

REPORT_AI_PROXY_SECRET
GEMINI_API_KEY
GEMINI_REPORT_MODEL

GEMINI_REPORT_MODEL is optional. If it is not set, the proxy uses:

1. gemini-3-flash-preview
2. gemini-2.5-flash
3. gemini-2.5-flash-lite

Request authentication
----------------------

The request must include:

X-Report-AI-Proxy-Secret: <REPORT_AI_PROXY_SECRET>

If the header is missing or does not match process.env.REPORT_AI_PROXY_SECRET, the proxy returns 401.

Request body
------------

{
  "payload": {},
  "systemPrompt": "",
  "userPrompt": "",
  "schema": {}
}

Success response
----------------

{
  "success": true,
  "source": "gemini",
  "analysis": {
    "summary": "",
    "diagnosis": "",
    "wrongAnalysis": "",
    "nextPlan": "",
    "parentMessage": "",
    "kakaoSummary": "",
    "teacherMemo": "",
    "riskLevel": "stable",
    "mainWeaknesses": [],
    "nextActions": []
  },
  "warning": ""
}

Failure response
----------------

{
  "success": false,
  "source": "fallback",
  "warning": "reason"
}

Local syntax check
------------------

npm run check

Cloudflare Worker settings
--------------------------

Set these Worker secrets in AP Math OS:

REPORT_AI_PROXY_URL=https://your-proxy-domain.example.com/api/report-analysis
REPORT_AI_PROXY_SECRET=<same secret as proxy>
