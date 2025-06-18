import React from 'react';
import './CreateProblemPage.css';

// 컴포넌트들
import ProblemTypeSelector from './components/ProblemTypeSelector';
import RuleSelector from './components/RuleSelector';
import ExampleInputs from './components/ExampleInputs';
import TestCaseGenerator from './components/TestCaseGenerator';
import ProblemForm from './components/ProblemForm';

// 훅들
import {
    useSocket,
    useRules,
    useProblemForm,
    useTestCaseGeneration
} from './hooks';

function CreateProblemPage() {
    // 소켓 연결 상태 관리
    const { isConnected } = useSocket();

    // 규칙 데이터 관리
    const { rules, selectedRule, setSelectedRule } = useRules();

    // 폼 데이터 관리
    const {
        formData,
        userId,
        messages,
        updateFormData,
        handleAddInputExample,
        handleAddOutputExample,
        handleInputChange,
        handleSubmit
    } = useProblemForm();

    // 테스트 케이스 생성 관리
    const {
        isGeneratingTestCases,
        handleGenerateTestCases
    } = useTestCaseGeneration({
        description: formData.description,
        constraints: formData.constraints,
        isConnected,
        onTestCasesGenerated: (inputs, outputs) => {
            updateFormData({
                inputExamples: inputs,
                outputExamples: outputs
            });
        },
        onError: (error) => {
            updateFormData({ errorMessage: error });
        },
        onSuccess: (message) => {
            updateFormData({ successMessage: message });
        }
    });

    const {
        title,
        description,
        inputExamples,
        outputExamples,
        constraints,
        option
    } = formData;

    const { errorMessage, successMessage } = messages;

    return (
        <div className="cp-container">
            <h1 className="cp-title">문제 생성</h1>

            <div className="cp-form">
                {/* 문제 유형 선택 */}
                <ProblemTypeSelector
                    option={option}
                    setOption={(newOption) => updateFormData({ option: newOption })}
                />

                {/* 규칙 선택 */}
                <RuleSelector
                    rules={rules}
                    selectedRule={selectedRule}
                    setSelectedRule={setSelectedRule}
                />

                {/* 테스트 케이스 생성 버튼 */}
                <TestCaseGenerator
                    option={option}
                    description={description}
                    isConnected={isConnected}
                    isGenerating={isGeneratingTestCases}
                    onGenerate={handleGenerateTestCases}
                />

                {/* 입력/출력 예제 */}
                <ExampleInputs
                    option={option}
                    inputExamples={inputExamples}
                    outputExamples={outputExamples}
                    onInputChange={handleInputChange}
                    onAddInput={handleAddInputExample}
                    onAddOutput={handleAddOutputExample}
                />

                {/* 문제 폼 */}
                <ProblemForm
                    title={title}
                    setTitle={(newTitle) => updateFormData({ title: newTitle })}
                    description={description}
                    setDescription={(newDescription) => updateFormData({ description: newDescription })}
                    constraints={constraints}
                    setConstraints={(newConstraints) => updateFormData({ constraints: newConstraints })}
                    option={option}
                    userId={userId}
                    errorMessage={errorMessage}
                    successMessage={successMessage}
                    onSubmit={() => handleSubmit(selectedRule)}
                    inputExamples={inputExamples}
                    outputExamples={outputExamples}
                    selectedRule={selectedRule}
                />
            </div>
        </div>
    );
}

export default CreateProblemPage;