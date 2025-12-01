import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
// @ts-ignore
import { Stomp } from 'stompjs/lib/stomp.js';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [stompClient, setStompClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState(null);
    const subscriptions = useRef({});

    useEffect(() => {
        let client;

        // Chỉ connect khi đã login
        if (isAuthenticated && user) {
            const socket = new SockJS('http://localhost:8080/ws');
            client = Stomp.over(socket);

            // Tắt debug log spam nếu muốn
            // client.debug = () => {}; 

            // --- QUAN TRỌNG: Gửi Token để Authenticate ---
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}` 
            };
            // ---------------------------------------------

            client.connect(headers, () => {
                setIsConnected(true);
                setStompClient(client);
                console.log('WebSocket Connected as ' + user.username); // Log để debug
            }, (error) => {
                console.error('WebSocket Connection Error:', error);
                setIsConnected(false);
                setStompClient(null);
            });
        }

        return () => {
            if (client && client.connected) {
                // Hủy tất cả đăng ký trước khi ngắt
                Object.values(subscriptions.current).forEach(sub => {
                    if(sub && typeof sub.unsubscribe === 'function') sub.unsubscribe();
                });
                client.disconnect(() => {
                    console.log('WebSocket Disconnected');
                    setIsConnected(false);
                    setStompClient(null);
                    subscriptions.current = {};
                });
            }
        };
    }, [isAuthenticated, user]); // Re-connect nếu user thay đổi

    const subscribe = useCallback((topic, callback) => {
        if (stompClient && isConnected) {
            // Kiểm tra để tránh subscribe trùng lặp
            if (subscriptions.current[topic]) {
                 subscriptions.current[topic].unsubscribe();
            }

            const subscription = stompClient.subscribe(topic, message => {
                // Parse JSON an toàn
                try {
                    const parsedMessage = JSON.parse(message.body);
                    console.log(`WS Message [${topic}]:`, parsedMessage);
                    setLastMessage(parsedMessage);
                    callback(parsedMessage);
                } catch (e) {
                    console.error("Error parsing WS message:", e);
                }
            });
            subscriptions.current[topic] = subscription;
            return subscription;
        }
        return null;
    }, [stompClient, isConnected]);

    const unsubscribe = useCallback((topic) => {
        if (subscriptions.current[topic]) {
            subscriptions.current[topic].unsubscribe();
            delete subscriptions.current[topic];
        }
    }, []);

    const value = {
        stompClient,
        isConnected,
        lastMessage,
        subscribe,
        unsubscribe,
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};