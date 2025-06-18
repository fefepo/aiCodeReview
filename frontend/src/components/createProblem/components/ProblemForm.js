import React from 'react';
import { CONSTRAINTS_PLACEHOLDERS, TYPES_REQUIRING_EXAMPLES } from '../constants';

const ProblemForm = ({
    title,
    setTitle,
    description,
    setDescription,
    constraints,
    setConstraints,
    option,
    userId,
    errorMessage,
    successMessage,
    onSubmit,
    inputExamples,
    outputExamples,
    selectedRule
}) => {
    const getConstraintsPlaceholder = () => {
        return CONSTRAINTS_PLACEHOLDERS[option] || "제한사항을 입력하세요";
    };

    const isSubmitDisabled = () => {
        if (!title || !description) return true;

        // 예제가 필요한 문제 유형인데 예제가 없는 경우
        if (TYPES_REQUIRING_EXAMPLES.includes(option)) {
            if (inputExamples.length === 0 || outputExamples.length === 0) {
                return true;
            }
        }

        return false;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* 제목 */}
            <div>
                <label className="cp-label">제목</label>
                <input
                    type="text"
                    className="cp-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="문제 제목을 입력하세요"
                    required
                />
            </div>

            {/* 설명 */}
            <div>
                <label className="cp-label">설명</label>
                <textarea
                    className="cp-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="문제 설명을 입력하세요"
                    required
                />
            </div>

            {/* 제한사항 */}
            <div>
                <label className="cp-label">제한사항</label>
                <textarea
                    className="cp-textarea"
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                    placeholder={getConstraintsPlaceholder()}
                />
            </div>

            {/* 사용자 ID 표시 */}
            {userId && (
                <p className="cp-user-id">🆔 작성자: {userId}</p>
            )}

            {/* 에러/성공 메시지 */}
            {errorMessage && <p className="cp-error">{errorMessage}</p>}
            {successMessage && <p className="cp-success">{successMessage}</p>}

            {/* 제출 버튼 */}
            <button
                type="submit"
                className="cp-submit"
                disabled={isSubmitDisabled()}
            >
                문제 생성
            </button>
        </form>
    );
};

export default ProblemForm;