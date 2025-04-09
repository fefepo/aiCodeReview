package com.aicodegem.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

import org.springframework.data.domain.Page;

import com.aicodegem.model.Problem;

@Getter
@Setter
public class MultiResponseDto {

    private List<ProblemResponseDto> data;
    private PageInfo pageInfo;

    public MultiResponseDto(List<ProblemResponseDto> data, Page<Problem> page) {
        this.data = data;
        this.pageInfo = new PageInfo(page.getNumber() + 1, page.getSize(), page.getTotalElements(),
                page.getTotalPages());
    }
}
