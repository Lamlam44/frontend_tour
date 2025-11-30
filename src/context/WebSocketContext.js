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

        if (isAuthenticated && user) {
            // Establish connection
            const socket = new SockJS('http://localhost:8080/ws'); // Backend WebSocket endpoint
            client = Stomp.over(socket);

            const headers = {
                // If using JWT, pass the token for authentication
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            };

            client.connect(headers, () => {
                setIsConnected(true);
                setStompClient(client);
                console.log('WebSocket Connected');
            }, (error) => {
                console.error('WebSocket Connection Error:', error);
                setIsConnected(false);
                setStompClient(null);
            });

        }

        return () => {
            // Cleanup on unmount or user logout
            if (client && client.connected) {
                Object.values(subscriptions.current).forEach(sub => sub.unsubscribe());
                client.disconnect(() => {
                    console.log('WebSocket Disconnected');
                    setIsConnected(false);
                    setStompClient(null);
                    subscriptions.current = {};
                });
            }
        };
    }, [isAuthenticated, user]);

    const subscribe = useCallback((topic, callback) => {
        if (stompClient && isConnected) {
            const subscription = stompClient.subscribe(topic, message => {
                const parsedMessage = JSON.parse(message.body);
                console.log(`WebSocket message received on topic ${topic}:`, parsedMessage); // Placeholder for toast notification
                setLastMessage(parsedMessage); // Store the last message
                callback(parsedMessage); // Also call the specific callback
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
        subscribe: subscribe,
        unsubscribe,
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};
