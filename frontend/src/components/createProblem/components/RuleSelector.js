import React from 'react';

const RuleSelector = ({ rules, selectedRule, setSelectedRule }) => {
    const handleChange = (e) => {
        const selected = rules.find((rule) => rule.title === e.target.value);
        setSelectedRule(selected || null);
    };

    return (
        <div>
            <label className="cp-label">규칙 카테고리 선택</label>
            <select
                className="cp-select"
                value={selectedRule?.title || ''}
                onChange={handleChange}
                required
            >
                <option value="">-- 규칙을 선택하세요 --</option>
                {rules.map((rule) => (
                    <option key={rule.id} value={rule.title}>
                        {rule.title}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default RuleSelector;