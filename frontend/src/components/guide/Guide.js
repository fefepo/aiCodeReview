import React from 'react';
import './Guide.css';

const Guide = () => {
    return (
        <div className="guide-page">
            <div className="guide-header">
                <h1>AI 신뢰성 및 작동 방식</h1>
                <p>AI가 어떻게 작동하고, 왜 믿을 수 있는지 알려드립니다.</p>
            </div>

            <div className="guide-grid-container">
                <div className="guide-summary-section">
                    <div className="guide-section-header">
                        <span>AI 신뢰성의 근거</span>
                        <button className="guide-more-button">자세히 보기</button>
                    </div>
                    <div className="guide-list">
                        <div className="guide-list-row">
                            <span className="guide-badge gray">1단계</span>
                            <span className="guide-list-title">코드 맥락을 고려한 개선 제안 기능</span>
                            <span className="guide-list-info">AI는 코드의 문맥을 파악하여 변수명, 함수명, 로직의 가독성을 자동으로 분석합니다.</span>
                        </div>
                        <div className="guide-list-row">
                            <span className="guide-badge gray">2단계</span>
                            <span className="guide-list-title">RAG 기반 AI 채점 시스템 구축</span>
                            <span className="guide-list-info">클린 코드 문서를 벡터 DB로 구축해 RAG 기반의 신뢰도 높은 코드 검증 및 정교한 AI 피드백을 제공합니다.</span>
                        </div>
                        <div className="guide-list-row">
                            <span className="guide-badge gray">3단계</span>
                            <span className="guide-list-title">AI 모델 튜닝</span>
                            <span className="guide-list-info">DeepSeek 모델을 파인튜닝하고 다중 모델 기반 클린 코드 규칙 채점 시스템 제공합니다.</span>
                        </div>
                        <div className="guide-list-row">
                            <span className="guide-badge gray">4단계</span>
                            <span className="guide-list-title">Abstract Syntax Tree 기반 코드 분석 기능 추가</span>
                            <span className="guide-list-info">AST 기반 분석을 통해 코드 구조와 스타일을 감지하고, 요소 간 관계를 파악해 정밀 리뷰와 최적의 작성 방식을 제공합니다.</span>
                        </div>
                    </div>
                </div>

                <div className="guide-summary-section">
                    <div className="guide-section-header">
                        <span>AI 작동 방식</span>
                        <button className="guide-more-button">자세히 보기</button>
                    </div>
                    <div className="guide-list">
                        <div className="guide-list-row">
                            <span className="guide-badge gray">1단계</span>
                            <span className="guide-list-title">코드 전처리</span>
                            <span className="guide-list-info">입력된 코드를 파싱하여 AST 구조로 분석합니다.</span>
                        </div>
                        <div className="guide-list-row">
                            <span className="guide-badge gray">2단계</span>
                            <span className="guide-list-title">규칙 기반 RAG 위반사항 수집</span>
                            <span className="guide-list-info">AI가 RAG 기반으로 유사한 규칙과 사례를 검색합니다.</span>
                        </div>
                        <div className="guide-list-row">
                            <span className="guide-badge gray">3단계</span>
                            <span className="guide-list-title">개별 규칙별 코드 검증</span>
                            <span className="guide-list-info">각 규칙에 따라 코드의 위반 여부를 평가합니다.</span>
                        </div>
                        <div className="guide-list-row">
                            <span className="guide-badge gray">4단계</span>
                            <span className="guide-list-title">검증 결과 통합</span>
                            <span className="guide-list-info">개별 평가를 종합해 최종 점수를 계산하고 주요 위반 사항을 요약합니다.</span>
                        </div>
                        <div className="guide-list-row">
                            <span className="guide-badge gray">5단계</span>
                            <span className="guide-list-title">종료</span>
                            <span className="guide-list-info">결과를 출력하고 프로세스를 마칩니다.</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="guide-footer">
                <p>AI 신뢰성 및 작동 방식에 대해 더 알고 싶다면, 아래의 메일로 도움을 받으세요.</p>
            </div>
        </div>
    );
};

export default Guide;
