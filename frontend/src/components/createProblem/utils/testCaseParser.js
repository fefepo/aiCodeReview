/**
 * 테스트 케이스 파싱 관련 유틸리티 함수들
 */

// 테스트 케이스 파싱을 위한 정규표현식
const TEST_CASE_REGEX = /## Test Case \d+[\s\n]*\*\*Input:\*\*[\s\n]*([\s\S]*?)[\s\n]*\*\*Expected Output:\*\*[\s\n]*([\s\S]*?)(?:\n## Test Case|\n\n|\s*$)/g;

/**
 * AI가 생성한 테스트 케이스 텍스트를 파싱하여 입력/출력 배열로 변환
 * @param {string} testCaseText - AI가 생성한 테스트 케이스 텍스트
 * @returns {Object} - { inputs: string[], outputs: string[], count: number }
 */
export const parseTestCases = (testCaseText) => {
    console.log('테스트 케이스 파싱 시작:', testCaseText);

    const inputs = [];
    const outputs = [];
    let matchCount = 0;
    let match;

    // 정규표현식을 사용하여 테스트 케이스 추출
    while ((match = TEST_CASE_REGEX.exec(testCaseText)) !== null) {
        matchCount++;

        // 입력값에서 쉼표를 공백으로 변환하고 trim
        const input = match[1].trim().replace(/,/g, ' ');
        const output = match[2].trim();

        inputs.push(input);
        outputs.push(output);
    }

    console.log(`${matchCount}개의 테스트 케이스를 추출했습니다.`);

    return {
        inputs,
        outputs,
        count: matchCount
    };
};

/**
 * 테스트 케이스 파싱 결과가 유효한지 검증
 * @param {Object} parseResult - parseTestCases의 결과
 * @returns {boolean} - 유효성 여부
 */
export const isValidParseResult = (parseResult) => {
    return parseResult &&
        parseResult.count > 0 &&
        parseResult.inputs.length === parseResult.outputs.length &&
        parseResult.inputs.length > 0;
};

/**
 * 테스트 케이스 텍스트에서 유효한 테스트 케이스가 있는지 미리 확인
 * @param {string} testCaseText - 확인할 텍스트
 * @returns {boolean} - 유효한 테스트 케이스 포함 여부
 */
export const hasValidTestCases = (testCaseText) => {
    if (!testCaseText || typeof testCaseText !== 'string') {
        return false;
    }

    return TEST_CASE_REGEX.test(testCaseText);
};