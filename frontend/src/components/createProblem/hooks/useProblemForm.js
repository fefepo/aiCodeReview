/**
 * 문제 생성 폼 상태 관리 훅
 */

import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { PROBLEM_TYPES } from '../constants';

export const useProblemForm = () => {
    // 폼 상태
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        constraints: '',
        option: PROBLEM_TYPES.CODE_SUBMISSION
    });

    // 예제 상태
    const [inputExamples, setInputExamples] = useState(['']);
    const [outputExamples, setOutputExamples] = useState(['']);

    // 사용자 정보
    const [userId, setUserId] = useState('');

    // 메시지 상태
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    /**
     * 로그인한 유저의 ID 가져오기
     */
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserId(decoded.sub);
            } catch (error) {
                console.error("토큰 디코딩 실패:", error);
                setUserId('');
            }
        }
    }, []);

    /**
     * 폼 데이터 업데이트
     * @param {Object} updates - 업데이트할 데이터
     */
    const updateFormData = (updates) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    /**
     * 입력 예제 추가
     */
    const addInputExample = () => {
        setInputExamples(prev => [...prev, '']);
    };

    /**
     * 출력 예제 추가
     */
    const addOutputExample = () => {
        setOutputExamples(prev => [...prev, '']);
    };

    /**
     * 입력/출력 예제 값 변경
     * @param {number} index - 인덱스
     * @param {string} value - 새 값
     * @param {string} type - 'input' | 'output'
     */
    const updateExample = (index, value, type) => {
        if (type === "input") {
            const updated = [...inputExamples];
            updated[index] = value;
            setInputExamples(updated);
        } else {
            const updated = [...outputExamples];
            updated[index] = value;
            setOutputExamples(updated);
        }
    };

    /**
     * 입력/출력 예제 일괄 설정
     * @param {string[]} inputs - 입력 예제 배열
     * @param {string[]} outputs - 출력 예제 배열
     */
    const setExamples = (inputs, outputs) => {
        setInputExamples(inputs);
        setOutputExamples(outputs);
    };

    /**
     * 에러 메시지 설정
     * @param {string} message - 에러 메시지
     */
    const setError = (message) => {
        setErrorMessage(message);
        setSuccessMessage('');
    };

    /**
     * 성공 메시지 설정
     * @param {string} message - 성공 메시지
     */
    const setSuccess = (message) => {
        setSuccessMessage(message);
        setErrorMessage('');
    };

    /**
     * 메시지 초기화
     */
    const clearMessages = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };

    /**
     * 폼 초기화
     */
    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            constraints: '',
            option: PROBLEM_TYPES.CODE_SUBMISSION
        });
        setInputExamples(['']);
        setOutputExamples(['']);
        clearMessages();
    };

    /**
     * 전체 폼 데이터 가져오기
     * @returns {Object} - 완전한 폼 데이터
     */
    const getCompleteFormData = () => {
        return {
            ...formData,
            inputExamples,
            outputExamples,
            userId
        };
    };

    return {
        // 상태
        formData,
        inputExamples,
        outputExamples,
        userId,
        errorMessage,
        successMessage,

        // 액션
        updateFormData,
        addInputExample,
        addOutputExample,
        updateExample,
        setExamples,
        setError,
        setSuccess,
        clearMessages,
        resetForm,
        getCompleteFormData
    };
};