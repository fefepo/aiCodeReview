package com.aicodegem.dto;

import java.util.List;
import java.util.stream.Collectors;

import com.aicodegem.model.Problem;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProblemResponseDto {

    private String id;
    private String title;
    private String description;
    private List<String> attachedRuleIds;
    private String status; // Enum을 String으로 변환
    private String modifiedAt; // LocalDateTime을 String으로 변환

    public ProblemResponseDto(String id, String title, String description, List<String> attachedRuleIds,
            String status, String modifiedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.attachedRuleIds = attachedRuleIds;
        this.status = status;
        this.modifiedAt = modifiedAt;
    }

    // 엔티티 -> DTO 변환 메서드
    public static ProblemResponseDto fromEntity(Problem problem) {
        return new ProblemResponseDto(
                problem.getId(),
                problem.getTitle(),
                problem.getDescription(),
                problem.getAttachedRuleIds(),
                problem.getStatus().name(), // Enum을 String으로 변환
                problem.getModifiedAt().toString() // LocalDateTime을 String으로 변환
        );
    }

    // 엔티티 리스트 -> DTO 리스트 변환 메서드
    public static List<ProblemResponseDto> fromEntityList(List<Problem> problems) {
        return problems.stream()
                .map(ProblemResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}
