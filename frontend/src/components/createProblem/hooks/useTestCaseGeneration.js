/**
 * 테스트 케이스 생성 관리 훅
 */

import { useState, useEffect, useCallback } from 'react';
import {
    SOCKET_EVENTS,
    TEST_CASE_GENERATION_OPTION,
    TIMEOUTS
} from '../constants';
import {
    parseTestCases,
    isValidParseResult,
    validateTestCaseGeneration
} from '../utils';

export const useTestCaseGeneration = (socket, isConnected) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedTestCases, setGeneratedTestCases] = useState('');
    const [timeoutId, setTimeoutId] = useState(null);

    /**
     * 테스트 케이스 생성 요청
     * @param {string} description - 문제 설명
     * @param {string} constraints - 제약사항
     * @param {Function} onSuccess - 성공 콜백 (inputs, outputs) => void
     * @param {Function} onError - 에러 콜백 (error) => void
     */
    const generateTestCases = useCallback((description, constraints, onSuccess, onError) => {
        // 생성 가능 여부 검증
        const validation = validateTestCaseGeneration({ description, isConnected });
        if (!validation.canGenerate) {
            onError(validation.error);
            return;
        }

        setIsGenerating(true);
        setGeneratedTestCases('');

        // 타임아웃 설정
        const newTimeoutId = setTimeout(() => {
            setIsGenerating(false);
            onError('테스트 케이스 생성 요청이 시간 초과되었습니다. 나중에 다시 시도해주세요.');
            setTimeoutId(null);
        }, TIMEOUTS.TEST_CASE_GENERATION);

        setTimeoutId(newTimeoutId);

        // AI 서버로 테스트 케이스 생성 요청 전송
        const message = {
            question: description + constraints,
            option: TEST_CASE_GENERATION_OPTION
        };

        const success = socket.emit(SOCKET_EVENTS.PREDICT, message);
        if (!success) {
            setIsGenerating(false);
            onError('테스트 케이스 생성 요청을 보내는 데 실패했습니다.');
            if (newTimeoutId) {
                clearTimeout(newTimeoutId);
                setTimeoutId(null);
            }
        }
    }, [socket, isConnected]);

    /**
     * AI 응답 처리
     */
    const handlePredictResponse = useCallback((response, onSuccess, onError) => {
        try {
            // 타임아웃 취소
            if (timeoutId) {
                clearTimeout(timeoutId);
                setTimeoutId(null);
            }

            if (response.status === 'success') {
                console.log('AI 응답:', response);
                console.log('받은 테스트 케이스:', response.response_text);

                setGeneratedTestCases(response.response_text);

                // 테스트 케이스 파싱
                const parseResult = parseTestCases(response.response_text);

                if (isValidParseResult(parseResult)) {
                    onSuccess(parseResult.inputs, parseResult.outputs);
                } else {
                    console.warn('테스트 케이스를 추출하지 못했습니다.');
                    onError('생성된 테스트 케이스 형식이 올바르지 않습니다.');
                }
            } else {
                onError(response.error || '테스트 케이스 생성 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('메시지 처리 중 오류:', error);
            onError('서버 응답 처리 중 오류가 발생했습니다.');
        } finally {
            setIsGenerating(false);
        }
    }, [timeoutId]);

    /**
     * Socket 이벤트 리스너 등록
     */
    useEffect(() => {
        if (!socket) return;

        const handleResponse = (response) => {
            // 이 함수는 실제 사용 시에 onSuccess, onError 콜백과 함께 사용됩니다.
            // 여기서는 기본 처리만 수행합니다.
            handlePredictResponse(response, () => { }, () => { });
        };

        socket.on(SOCKET_EVENTS.PREDICT_RESPONSE, handleResponse);

        return () => {
            socket.off(SOCKET_EVENTS.PREDICT_RESPONSE, handleResponse);
        };
    }, [socket, handlePredictResponse]);

    /**
     * 컴포넌트 언마운트 시 타임아웃 정리
     */
    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    /**
     * 생성된 테스트 케이스 초기화
     */
    const clearGeneratedTestCases = () => {
        setGeneratedTestCases('');
    };

    /**
     * 생성 중단
     */
    const cancelGeneration = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
        setIsGenerating(false);
    };

    return {
        isGenerating,
        generatedTestCases,
        generateTestCases,
        handlePredictResponse,
        clearGeneratedTestCases,
        cancelGeneration
    };
};