package com.aicodegem.service;

import com.aicodegem.model.Answer;
import java.util.List;

public interface AnswerService {
    List<Answer> getAnswersByBoardId(Long boardId);

    Answer saveAnswer(Long boardId, Answer answer);
}
