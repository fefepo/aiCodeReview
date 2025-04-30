import React from 'react';
import { useNavigate } from 'react-router-dom';

function SummarySection({ title, items, renderItem, moreLink }) {
    const navigate = useNavigate();

    return (
        <div className="mainpage-summary-section">
            <div className="mainpage-section-header">
                <h2 className="mainpage-section-title">{title}</h2>
                {moreLink && (
                    <div className="mainpage-more-button" onClick={() => navigate(moreLink)}>
                        더 보기 &gt;
                    </div>
                )}
            </div>

            <div className="mainpage-post-list">
                {items.slice(0, 7).map((item, index) => (
                    <div key={index} className="mainpage-post-list-item">
                        {renderItem(item)}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SummarySection;
