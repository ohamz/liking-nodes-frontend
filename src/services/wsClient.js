export const WebSocketService = (() => {
  let ws;
  const listeners = new Set();

  const connect = (url) => {
    if (ws) {
      console.warn("WebSocket already connected.");
      return;
    }

    ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("WebSocket connection established.");
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        listeners.forEach((listener) => listener(message));
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
      ws = null;
    };
  };

  const disconnect = () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
      ws = null;
    }
  };

  const addListener = (listener) => {
    if (typeof listener == "function" && !listeners.has(listener)) {
      listeners.add(listener);
    }
  };

  const removeListener = (listener) => {
    if (listeners.has(listener)) {
      listeners.delete(listener);
    }
  };

  const send = (data) => {
    if (ws && ws.readyState == WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    } else {
      console.error("Websocket is not open.");
    }
  };

  return {
    connect,
    disconnect,
    addListener,
    removeListener,
    send,
  };
})();
