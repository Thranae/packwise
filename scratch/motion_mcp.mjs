import EventSource from 'eventsource';
import fetch from 'node-fetch';

const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6Im5RYkhGa21OTjhmMmhwbHROXzRHSUVuNnBMNGtObVVmTHNhc2I1aXNLdWsiLCJ0eXAiOiJhdCtqd3QifQ.eyJjbGllbnRfaWQiOiI3OTZkOTdiMi1iN2I1LTQ2NmYtOGU4Mi03OGFhYTk0OTgxYjAiLCJzY29wZSI6Im1jcCBtb3Rpb246c2Vzc2lvbnM6cmVhZCBtb3Rpb246c2Vzc2lvbnM6d3JpdGUgbW90aW9uOmNyZWRpdHM6cmVhZCBtb3Rpb246Y3JlZGl0czpwdXJjaGFzZSBtb3Rpb246Y3JlZGl0czptYW5hZ2UgbW90aW9uOmFjY291bnQ6cmVhZCIsInN2YyI6IjgzZDc0MWNlLWU2NjAtNDJlNy04Y2VlLTcxOTg1YTZjMjBkNyIsImlzcyI6Imh0dHBzOi8vbWNwLm1vdGlvbi5zbyIsInN1YiI6IjUxZmJkMjVkLWFhMDUtNDdiMy1hYjhjLWExNzA0NGQxOGQ4ZiIsImF1ZCI6Imh0dHBzOi8vbWNwLm1vdGlvbi5zby9tY3AiLCJpYXQiOjE3ODYwMjE4MDcsImV4cCI6MTc4NjAyMjQwNywianRpIjoiNTgzYmUwMTAtOWMxZi00YzRiLTk4NTYtNzliYjI3YTc5ODU2In0.Dq8y9IrE9vwLvi150ByX7KQ0T4NEKu2wxkfMwn7EU8Rg3GGDeBzKQJFGqOTmQ4ycsIz5ua6tEkD8n5YL7UIDp5B0cxSFRvV7VOml1Y_YkvEnliVPqaWGml1lsN8W1w1tnkb0mVAQKYn_Oh-ckbbTq8NjgBHuggWKViu97FCBGhwGAzpZMRd3Za1vRJbE_LRcbMYQtLvS5mw5pIq60HKbd7T2xsnHO7BDoA9g5InpvPuRLw6UFDh3TzLRxFGK59SEuIM8es0lBvlASR8Fit3QTjKH4A7Akwjt7OirXO5RBV3qA_M_fL6YVeCPHur23H-AaG-1Qr4IpRzWfXPDSDeWPA";

const sse = new EventSource("https://mcp.motion.so/mcp", {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});

let messageEndpoint = null;
let id = 1;

async function sendRequest(method, params) {
  if (!messageEndpoint) {
    console.error("No message endpoint yet!");
    return;
  }
  const body = {
    jsonrpc: "2.0",
    id: id++,
    method,
    params
  };
  const res = await fetch(messageEndpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    console.error("Request failed", res.status, await res.text());
  }
}

sse.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("Received:", data);
};

sse.addEventListener('endpoint', (event) => {
  messageEndpoint = event.data;
  console.log("Got message endpoint:", messageEndpoint);
  
  // Call tools
  sendRequest("tools/list", {});
  
  setTimeout(() => {
    sendRequest("tools/call", {
      name: "purchase_credits",
      arguments: { amount: 10 } // Example amount
    });
  }, 2000);
});

sse.onerror = (err) => {
  console.error("SSE Error:", err);
};

setTimeout(() => {
  console.log("Closing...");
  sse.close();
}, 10000);
