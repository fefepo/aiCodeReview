import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../createProblem/CreateProblemPage.css'; // 문제 생성과 동일한 스타일 사용

function EditProblemPage() {
    const { problemId } = useParams(); // ✅ URL에서 problemId 추출
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [inputExamples, setInputExamples] = useState(['']);
    const [outputExamples, setOutputExamples] = useState(['']);
    const [constraints, setConstraints] = useState('');
    const [option, setOption] = useState(0); // ✅ 문제 유형 옵션 추가
    const [message, setMessage] = useState('');

    // 문제 불러오기
    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await fetch(`http://localhost:8080/problems/${problemId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) throw new Error('문제 정보를 불러오는 데 실패했습니다.');

                const data = await response.json();
                setTitle(data.title);
                setDescription(data.description);
                setInputExamples(data.inputExamples);
                setOutputExamples(data.outputExamples);
                setConstraints(data.constraints);
                setOption(data.option || 0); // ✅ 기존 옵션 값 가져오기 (없으면 0으로 기본값 설정)
            } catch (err) {
                setMessage(`❌ ${err.message}`);
            }
        };

        fetchProblem();
    }, [problemId]);


    const handleInputChange = (index, value, type) => {
        const update = type === 'input' ? [...inputExamples] : [...outputExamples];
        update[index] = value;
        type === 'input' ? setInputExamples(update) : setOutputExamples(update);
    };

    const handleAddInput = () => setInputExamples([...inputExamples, '']);
    const handleAddOutput = () => setOutputExamples([...outputExamples, '']);

    const handleSubmit = async () => {
        setMessage('');

        if (inputExamples.length !== outputExamples.length) {
            const minLength = Math.min(inputExamples.length, outputExamples.length);
            setInputExamples(inputExamples.slice(0, minLength));
            setOutputExamples(outputExamples.slice(0, minLength));
            setMessage('⚠️ 입력과 출력 개수가 다릅니다. 맞춰주세요.');
            return;
        }

        const body = {
            title,
            description,
            inputExamples,
            outputExamples,
            constraints,
            option: parseInt(option) // ✅ 옵션 값 추가
        };

        try {
            const response = await fetch(`http://localhost:8080/problems/${problemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!response.ok) throw new Error('문제 수정에 실패했습니다.');
            const result = await response.json();
            setMessage(`✅ '${result.title}' 문제 수정이 완료되었습니다.`);
        } catch (error) {
            setMessage(`❌ ${error.message}`);
        }
    };

    return (
        <div className="cp-container">
            <h1 className="cp-title">문제 수정</h1>
            <div className="cp-label2">✅ 여러개의 입력을 받을 시, 스페이스바로 구분하여 입력하시오.</div>
            <div className="cp-label2">✅ ex. 10과 20을 입력받아야 할 경우 (10 20)</div>

            <div className="cp-form">
                <label className="cp-label">제목</label>
                <input
                    className="cp-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="문제 제목"
                />

                <label className="cp-label">설명</label>
                <textarea
                    className="cp-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="문제 설명"
                />

                <label className="cp-label">입력 예제</label>
                {inputExamples.map((input, i) => (
                    <input
                        key={i}
                        className="cp-input"
                        value={input}
                        onChange={(e) => handleInputChange(i, e.target.value, 'input')}
                        placeholder={`입력 예제 ${i + 1}`}
                    />
                ))}
                <button className="cp-add-button" onClick={handleAddInput}>+ 입력 추가</button>

                <label className="cp-label">출력 예제</label>
                {outputExamples.map((output, i) => (
                    <input
                        key={i}
                        className="cp-input"
                        value={output}
                        onChange={(e) => handleInputChange(i, e.target.value, 'output')}
                        placeholder={`출력 예제 ${i + 1}`}
                    />
                ))}
                <button className="cp-add-button" onClick={handleAddOutput}>+ 출력 추가</button>

                <label className="cp-label">제한사항</label>
                <textarea
                    className="cp-textarea"
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                    placeholder="예: N은 1 이상 1,000 이하의 정수입니다."
                />

                <label className="cp-label">문제 유형</label>
                <div className="cp-radio-group">
                    <label className="cp-radio-label">
                        <input
                            type="radio"
                            name="option"
                            value="0"
                            checked={option === 0}
                            onChange={(e) => setOption(parseInt(e.target.value))}
                        />
                        코드 제출용
                    </label>
                    <label className="cp-radio-label">
                        <input
                            type="radio"
                            name="option"
                            value="1"
                            checked={option === 1}
                            onChange={(e) => setOption(parseInt(e.target.value))}
                        />
                        알고리즘 분석용
                    </label>
                    <label className="cp-radio-label">
                        <input
                            type="radio"
                            name="option"
                            value="2"
                            checked={option === 2}
                            onChange={(e) => setOption(parseInt(e.target.value))}
                        />
                        테스트 케이스 분석용
                    </label>
                </div>

                {message && <p className={message.startsWith('✅') ? 'cp-success' : 'cp-error'}>{message}</p>}

                <button className="cp-submit" onClick={handleSubmit} disabled={!title || !description}>
                    문제 수정
                </button>
            </div>
        </div>
    );
}

export default EditProblemPage;