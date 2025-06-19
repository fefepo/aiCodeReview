package com.aicodegem.service;

import com.aicodegem.model.Answer;
import java.util.List;

public interface AnswerService {
    // 특정 게시판 ID에 속한 답변 리스트 조회
    List<Answer> getAnswersByBoardId(Long boardId);

    // 특정 게시판 ID에 새로운 답변 저장
    Answer saveAnswer(Long boardId, Answer answer);
}
