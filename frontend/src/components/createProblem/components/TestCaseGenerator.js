import React from 'react';
import { TYPES_REQUIRING_TEST_CASES } from '../constants';

const TestCaseGenerator = ({
    option,
    description,
    isConnected,
    isGenerating,
    onGenerate
}) => {
    // 테스트 케이스가 필요하지 않은 문제 유형인 경우 렌더링하지 않음
    if (!TYPES_REQUIRING_TEST_CASES.includes(option)) {
        return null;
    }

    const isDisabled = !description || isGenerating || !isConnected;

    return (
        <div className="cp-generate-test-cases">
            <button
                type="button"
                className="cp-generate-button"
                onClick={onGenerate}
                disabled={isDisabled}
                title={
                    !isConnected
                        ? 'AI 서버에 연결되지 않았습니다'
                        : !description
                            ? '문제 설명을 먼저 입력해주세요'
                            : ''
                }
            >
                <div className="cp-button-content">
                    {isGenerating && <div className="cp-loading-spinner"></div>}
                    <span>
                        {isGenerating ? '생성 중...' : '테스트 케이스 생성'}
                    </span>
                </div>
            </button>

            {!isConnected && (
                <div className="cp-connection-status">
                    ⚠️ AI 서버 연결 대기 중...
                </div>
            )}
        </div>
    );
};

export default TestCaseGenerator;