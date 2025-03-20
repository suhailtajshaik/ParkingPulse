let socket = null;
let reconnectTimer = null;

export function setupWebSocket(onMessage) {
  const connect = () => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected. Reconnecting...');
      if (!reconnectTimer) {
        reconnectTimer = setTimeout(connect, 5000);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  connect();
  return () => {
    if (socket) {
      socket.close();
    }
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
    }
  };
}
