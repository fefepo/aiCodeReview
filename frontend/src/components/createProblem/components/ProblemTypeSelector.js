import React from 'react';
import { PROBLEM_TYPE_OPTIONS, PROBLEM_TYPE_MESSAGES } from '../constants';

const ProblemTypeSelector = ({ option, setOption }) => {
    const handleChange = (e) => {
        setOption(parseInt(e.target.value));
    };

    return (
        <div>
            <label className="cp-label">문제 유형</label>
            <select
                className="cp-select"
                value={option}
                onChange={handleChange}
            >
                {PROBLEM_TYPE_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>

            {/* 문제 유형별 안내 메시지 */}
            {PROBLEM_TYPE_MESSAGES[option] && (
                <div>
                    {PROBLEM_TYPE_MESSAGES[option].map((message, index) => (
                        <div key={index} className="cp-label2">
                            {message}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProblemTypeSelector;