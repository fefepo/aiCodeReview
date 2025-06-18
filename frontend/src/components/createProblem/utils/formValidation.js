/**
 * 폼 검증 관련 유틸리티 함수들
 */

import { TYPES_REQUIRING_EXAMPLES } from '../constants';

/**
 * 기본 필수 필드 검증
 * @param {Object} formData - 검증할 폼 데이터
 * @param {string} formData.title - 문제 제목
 * @param {string} formData.description - 문제 설명
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateRequiredFields = ({ title, description }) => {
    if (!title?.trim()) {
        return { isValid: false, error: '제목을 입력해주세요.' };
    }

    if (!description?.trim()) {
        return { isValid: false, error: '문제 설명을 입력해주세요.' };
    }

    return { isValid: true, error: '' };
};

/**
 * 입력/출력 예제 검증
 * @param {Object} params - 검증 파라미터
 * @param {number} params.option - 문제 유형
 * @param {string[]} params.inputExamples - 입력 예제 배열
 * @param {string[]} params.outputExamples - 출력 예제 배열
 * @returns {Object} - { isValid: boolean, error: string, needsCorrection: boolean, correctedInputs?: string[], correctedOutputs?: string[] }
 */
export const validateExamples = ({ option, inputExamples, outputExamples }) => {
    // 예제가 필요하지 않은 문제 유형인 경우 통과
    if (!TYPES_REQUIRING_EXAMPLES.includes(option)) {
        return { isValid: true, error: '', needsCorrection: false };
    }

    // 예제가 하나도 없는 경우
    if (!inputExamples?.length || !outputExamples?.length) {
        return {
            isValid: false,
            error: '입력 예제와 출력 예제를 최소 하나씩 입력해주세요.',
            needsCorrection: false
        };
    }

    // 입력과 출력의 개수가 다른 경우
    if (inputExamples.length !== outputExamples.length) {
        const minLength = Math.min(inputExamples.length, outputExamples.length);

        return {
            isValid: false,
            error: '⚠️ 입력과 출력의 개수가 맞지 않습니다. 불필요한 입력 또는 출력을 삭제합니다.',
            needsCorrection: true,
            correctedInputs: inputExamples.slice(0, minLength),
            correctedOutputs: outputExamples.slice(0, minLength)
        };
    }

    // 빈 예제가 있는지 확인
    const hasEmptyInputs = inputExamples.some(input => !input?.trim());
    const hasEmptyOutputs = outputExamples.some(output => !output?.trim());

    if (hasEmptyInputs || hasEmptyOutputs) {
        return {
            isValid: false,
            error: '빈 입력 또는 출력 예제가 있습니다. 모든 예제를 입력해주세요.',
            needsCorrection: false
        };
    }

    return { isValid: true, error: '', needsCorrection: false };
};

/**
 * 규칙 선택 검증
 * @param {Object} selectedRule - 선택된 규칙
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateRuleSelection = (selectedRule) => {
    if (!selectedRule) {
        return { isValid: false, error: '규칙 카테고리를 선택해주세요.' };
    }

    return { isValid: true, error: '' };
};

/**
 * 전체 폼 검증
 * @param {Object} formData - 전체 폼 데이터
 * @returns {Object} - { isValid: boolean, error: string, corrections?: Object }
 */
export const validateForm = (formData) => {
    const { title, description, option, inputExamples, outputExamples, selectedRule } = formData;

    // 1. 필수 필드 검증
    const requiredValidation = validateRequiredFields({ title, description });
    if (!requiredValidation.isValid) {
        return requiredValidation;
    }

    // 2. 규칙 선택 검증
    const ruleValidation = validateRuleSelection(selectedRule);
    if (!ruleValidation.isValid) {
        return ruleValidation;
    }

    // 3. 예제 검증
    const exampleValidation = validateExamples({ option, inputExamples, outputExamples });
    if (!exampleValidation.isValid) {
        if (exampleValidation.needsCorrection) {
            return {
                ...exampleValidation,
                corrections: {
                    inputExamples: exampleValidation.correctedInputs,
                    outputExamples: exampleValidation.correctedOutputs
                }
            };
        }
        return exampleValidation;
    }

    return { isValid: true, error: '' };
};

/**
 * 테스트 케이스 생성 가능 여부 검증
 * @param {Object} params - 검증 파라미터
 * @param {string} params.description - 문제 설명
 * @param {boolean} params.isConnected - 소켓 연결 상태
 * @returns {Object} - { canGenerate: boolean, error: string }
 */
export const validateTestCaseGeneration = ({ description, isConnected }) => {
    if (!isConnected) {
        return { canGenerate: false, error: 'AI 서버에 연결되어 있지 않습니다.' };
    }

    if (!description?.trim()) {
        return { canGenerate: false, error: '문제 설명을 입력해주세요.' };
    }

    return { canGenerate: true, error: '' };
};