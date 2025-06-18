/**
 * 규칙 관리 훅
 */

import { useState, useEffect } from 'react';
import { API_ENDPOINTS, HTTP_HEADERS } from '../constants';

export const useRules = () => {
    const [rules, setRules] = useState([]);
    const [selectedRule, setSelectedRule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    /**
     * 승인된 규칙 목록 가져오기
     */
    const fetchRules = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch(API_ENDPOINTS.RULES_ADMIN, {
                method: 'GET',
                headers: {
                    'Content-Type': HTTP_HEADERS.CONTENT_TYPE,
                },
            });

            if (!response.ok) {
                throw new Error('승인된 규칙 목록을 불러오는 데 실패했습니다.');
            }

            const data = await response.json();
            setRules(data);
        } catch (err) {
            console.error('❌ 규칙 불러오기 오류:', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * 규칙 선택 핸들러
     * @param {string} ruleTitle - 선택된 규칙의 제목
     */
    const selectRule = (ruleTitle) => {
        const selected = rules.find((rule) => rule.title === ruleTitle);
        setSelectedRule(selected || null);
    };

    /**
     * 규칙 선택 초기화
     */
    const clearSelectedRule = () => {
        setSelectedRule(null);
    };

    /**
     * 선택된 규칙 정보 가져오기
     * @returns {Object} - { title: string, description: string }
     */
    const getSelectedRuleInfo = () => {
        return {
            title: selectedRule?.title || '',
            description: selectedRule?.description || ''
        };
    };

    // 컴포넌트 마운트 시 규칙 목록 가져오기
    useEffect(() => {
        fetchRules();
    }, []);

    return {
        rules,
        selectedRule,
        loading,
        error,
        selectRule,
        clearSelectedRule,
        getSelectedRuleInfo,
        refetchRules: fetchRules
    };
};