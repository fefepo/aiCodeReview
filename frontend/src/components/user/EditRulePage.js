import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditRulePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRule = async () => {
            try {
                const response = await fetch(`http://localhost:8080/rules/${id}`);
                if (!response.ok) {
                    throw new Error('규칙 정보를 불러오는 데 실패했습니다.');
                }
                const data = await response.json();
                setTitle(data.title);
                setDescription(data.description);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRule();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/rules/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description }),
            });

            if (response.ok) {
                alert('규칙이 성공적으로 수정되었습니다.');
                navigate('/profile-rules');
            } else {
                throw new Error('규칙 수정에 실패했습니다.');
            }
        } catch (err) {
            alert(`오류 발생: ${err.message}`);
        }
    };

    if (loading) return <p>불러오는 중...</p>;
    if (error) return <p>오류: {error}</p>;

    return (
        <div className="profile-problems-container">
            <div className="profile-problems-box">
                <h1 className="profile-problems-title">규칙 수정</h1>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                        <label>제목</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                borderRadius: '8px',
                                border: '1px solid #ccc',
                                marginTop: '8px',
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '30px', textAlign: 'left' }}>
                        <label>설명</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={6}
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                borderRadius: '8px',
                                border: '1px solid #ccc',
                                marginTop: '8px',
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="profile-problems-edit-button"
                        style={{ marginRight: '10px' }}
                    >
                        수정 완료
                    </button>
                    <button
                        type="button"
                        className="profile-problems-delete-button"
                        onClick={() => navigate('/profile-rules')}
                    >
                        취소
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditRulePage;
