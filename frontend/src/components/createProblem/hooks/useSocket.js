/**
 * Socket.io 연결 관리 훅
 */

import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_CONFIG, SOCKET_EVENTS } from '../constants';

export const useSocket = () => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState('');

    useEffect(() => {
        // Socket.io 연결 초기화
        socketRef.current = io(SOCKET_CONFIG.URL, SOCKET_CONFIG.OPTIONS);

        // 연결 성공 이벤트
        socketRef.current.on(SOCKET_EVENTS.CONNECT, () => {
            console.log('🟢 WebSocket connected');
            setIsConnected(true);
            setConnectionError('');
        });

        // 연결 에러 이벤트
        socketRef.current.on(SOCKET_EVENTS.CONNECT_ERROR, (error) => {
            console.error('Socket.io 연결 오류:', error);
            setConnectionError('AI 서버 연결에 실패했습니다.');
            setIsConnected(false);
        });

        // 연결 해제 이벤트
        socketRef.current.on(SOCKET_EVENTS.DISCONNECT, () => {
            console.log('🔴 WebSocket disconnected');
            setIsConnected(false);
        });

        // 컴포넌트 언마운트 시 연결 정리
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    /**
     * 소켓으로 메시지 전송
     * @param {string} event - 이벤트 이름
     * @param {Object} data - 전송할 데이터
     * @returns {boolean} - 전송 성공 여부
     */
    const emit = (event, data) => {
        if (!socketRef.current || !isConnected) {
            console.error('Socket이 연결되어 있지 않습니다.');
            return false;
        }

        try {
            socketRef.current.emit(event, data);
            return true;
        } catch (error) {
            console.error('메시지 전송 중 오류:', error);
            return false;
        }
    };

    /**
     * 소켓 이벤트 리스너 등록
     * @param {string} event - 이벤트 이름
     * @param {Function} callback - 콜백 함수
     */
    const on = (event, callback) => {
        if (socketRef.current) {
            socketRef.current.on(event, callback);
        }
    };

    /**
     * 소켓 이벤트 리스너 제거
     * @param {string} event - 이벤트 이름
     * @param {Function} callback - 콜백 함수
     */
    const off = (event, callback) => {
        if (socketRef.current) {
            socketRef.current.off(event, callback);
        }
    };

    return {
        isConnected,
        connectionError,
        emit,
        on,
        off,
        socket: socketRef.current
    };
};