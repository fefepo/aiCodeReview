import React from 'react';
import { TYPES_REQUIRING_EXAMPLES } from '../constants';

const ExampleInputs = ({
    option,
    inputExamples,
    outputExamples,
    onInputChange,
    onAddInput,
    onAddOutput
}) => {
    // 입력/출력 예제가 필요하지 않은 문제 유형인 경우 렌더링하지 않음
    if (!TYPES_REQUIRING_EXAMPLES.includes(option)) {
        return null;
    }

    const handleInputChange = (index, value, type) => {
        onInputChange(index, value, type);
    };

    return (
        <>
            {/* 입력 예제 */}
            <div>
                <label className="cp-label">입력 예제 (여러 개 입력 가능)</label>
                {inputExamples.map((input, index) => (
                    <input
                        key={index}
                        type="text"
                        className="cp-input"
                        value={input}
                        onChange={(e) => handleInputChange(index, e.target.value, "input")}
                        placeholder={`예제 입력 ${index + 1}`}
                    />
                ))}
                <button
                    type="button"
                    className="cp-add-button"
                    onClick={onAddInput}
                >
                    + 입력 추가
                </button>
            </div>

            {/* 출력 예제 */}
            <div>
                <label className="cp-label">출력 예제 (여러 개 입력 가능)</label>
                {outputExamples.map((output, index) => (
                    <input
                        key={index}
                        type="text"
                        className="cp-input"
                        value={output}
                        onChange={(e) => handleInputChange(index, e.target.value, "output")}
                        placeholder={`예제 출력 ${index + 1}`}
                    />
                ))}
                <button
                    type="button"
                    className="cp-add-button"
                    onClick={onAddOutput}
                >
                    + 출력 추가
                </button>
            </div>
        </>
    );
};

export default ExampleInputs;