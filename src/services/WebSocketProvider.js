import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext'; // Giả sử bạn có AuthContext để lấy thông tin user

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
    const [stompClient, setStompClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const { user } = useAuth(); // Lấy thông tin người dùng đã đăng nhập

    const connect = useCallback(() => {
        if (stompClient && stompClient.active) {
            console.log('WebSocket already connected.');
            return;
        }

        // Chỉ kết nối nếu có người dùng đã đăng nhập
        if (!user) {
            console.log("WebSocket: No user logged in, skipping connection.");
            return;
        }

        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('WebSocket Connected!');
                setIsConnected(true);

                // Lắng nghe trên kênh riêng của user
                // Backend Spring Security sẽ tự động định tuyến tới user đúng
                client.subscribe('/user/queue/invoice-updates', (message) => {
                    console.log('Received invoice update:', message.body);
                    // Thông báo cho các component khác bằng cách phát một custom event
                    window.dispatchEvent(new CustomEvent('invoice-updated', { detail: JSON.parse(message.body) }));
                });
            },
            onDisconnect: () => {
                console.log('WebSocket Disconnected!');
                setIsConnected(false);
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        client.activate();
        setStompClient(client);

    }, [user, stompClient]);

    useEffect(() => {
        if (user && !isConnected) {
            connect();
        } else if (!user && stompClient && stompClient.active) {
            stompClient.deactivate();
        }

        return () => {
            if (stompClient && stompClient.active) {
                stompClient.deactivate();
            }
        };
    }, [user, isConnected, connect, stompClient]);

    return (
        <WebSocketContext.Provider value={{ isConnected }}>
            {children}
        </WebSocketContext.Provider>
    );
};