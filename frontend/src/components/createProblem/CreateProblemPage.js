import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // 🔹 JWT 디코딩을 위해 추가
import './CreateProblemPage.css';

function CreateProblemPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [inputExamples, setInputExamples] = useState(['']); // 입력 예제 배열
    const [outputExamples, setOutputExamples] = useState(['']); // 출력 예제 배열
    const [constraints, setConstraints] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [userId, setUserId] = useState(''); // 🔹 유저 아이디 상태 추가

    // 🔹 로그인한 유저의 ID 가져오기
    useEffect(() => {
        const token = localStorage.getItem("token"); // 토큰 가져오기
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserId(decoded.sub); // JWT에서 사용자 ID 추출 (예: "sub" 필드 사용)
            } catch (error) {
                console.error("토큰 디코딩 실패:", error);
                setUserId('');
            }
        }
    }, []);

    // 입력 추가 핸들러
    const handleAddInputExample = () => {
        setInputExamples([...inputExamples, '']);
    };

    // 출력 추가 핸들러
    const handleAddOutputExample = () => {
        setOutputExamples([...outputExamples, '']);
    };

    // 입력값 변경 핸들러
    const handleInputChange = (index, value, type) => {
        if (type === "input") {
            const updatedInputs = [...inputExamples];
            updatedInputs[index] = value;
            setInputExamples(updatedInputs);
        } else {
            const updatedOutputs = [...outputExamples];
            updatedOutputs[index] = value;
            setOutputExamples(updatedOutputs);
        }
    };

    // 문제 생성 요청
    const handleSubmit = async () => {
        setErrorMessage('');
        setSuccessMessage('');

        // 입력과 출력 개수 검증
        if (inputExamples.length !== outputExamples.length) {
            setErrorMessage("⚠️ 입력과 출력의 개수가 맞지 않습니다. 불필요한 입력 또는 출력을 삭제합니다.");
            const minLength = Math.min(inputExamples.length, outputExamples.length);
            setInputExamples(inputExamples.slice(0, minLength));
            setOutputExamples(outputExamples.slice(0, minLength));
            return;
        }

        const requestBody = {
            title,
            description,
            inputExamples,
            outputExamples,
            constraints,
            createdBy: userId // 🔹 유저 ID 추가
        };

        try {
            const response = await fetch("http://localhost:8080/problems", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error("문제 생성에 실패했습니다.");
            }

            const result = await response.json();
            setSuccessMessage(`✅ 문제 '${result.title}'이(가) 성공적으로 생성되었습니다!`);
            setTitle('');
            setDescription('');
            setInputExamples(['']);
            setOutputExamples(['']);
            setConstraints('');
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="cp-container">
            <h1 className="cp-title">문제 생성</h1>
            <div className="cp-label2">✅ 여러개의 입력을 받을 시, 스페이스바로 구분하여 입력하시오.(10 20)</div>
            <div className="cp-label2">✅ ex. 10과 20을 입력받아야 할 경우 (10 20)</div>

            <div className="cp-form">
                <label className="cp-label">제목</label>
                <input
                    type="text"
                    className="cp-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="문제 제목을 입력하세요"
                />

                <label className="cp-label">설명</label>
                <textarea
                    className="cp-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="문제 설명을 입력하세요"
                />

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
                <button className="cp-add-button" onClick={handleAddInputExample}>+ 입력 추가</button>

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
                <button className="cp-add-button" onClick={handleAddOutputExample}>+ 출력 추가</button>

                <label className="cp-label">제한사항</label>
                <textarea
                    className="cp-textarea"
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                    placeholder="예: 입력값은 -1000 이상 1000 이하의 정수입니다."
                />

                {/* 🔹 유저 ID 표시 */}
                {userId && <p className="cp-user-id">🆔 작성자: {userId}</p>}

                {errorMessage && <p className="cp-error">{errorMessage}</p>}
                {successMessage && <p className="cp-success">{successMessage}</p>}

                <button className="cp-submit" onClick={handleSubmit} disabled={!title || !description || inputExamples.length === 0 || outputExamples.length === 0}>
                    문제 생성
                </button>
            </div>
        </div>
    );
}

export default CreateProblemPage;
