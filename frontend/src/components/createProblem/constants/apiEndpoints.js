// API 엔드포인트 관련 상수들
export const API_BASE_URL = 'http://localhost:8080';

export const API_ENDPOINTS = {
    PROBLEMS: `${API_BASE_URL}/problems`,
    RULES_ADMIN: `${API_BASE_URL}/rules/admin`
};

// Socket.io 관련 설정
export const SOCKET_CONFIG = {
    URL: 'https://9813-39-125-143-248.ngrok-free.app',
    OPTIONS: {
        transports: ['websocket']
    }
};

// Socket 이벤트 이름들
export const SOCKET_EVENTS = {
    CONNECT: 'connect',
    CONNECT_ERROR: 'connect_error',
    DISCONNECT: 'disconnect',
    PREDICT: 'predict',
    PREDICT_RESPONSE: 'predict_response'
};

// HTTP 헤더
export const HTTP_HEADERS = {
    CONTENT_TYPE: 'application/json'
};

// 테스트 케이스 생성 옵션
export const TEST_CASE_GENERATION_OPTION = 2;

// 타임아웃 설정 (밀리초)
export const TIMEOUTS = {
    TEST_CASE_GENERATION: 600000 // 10분
};