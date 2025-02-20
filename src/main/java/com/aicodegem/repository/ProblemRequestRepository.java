package com.aicodegem.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.aicodegem.model.ProblemRequest;
import com.aicodegem.model.ProblemRequest.RequestStatus;;

public interface ProblemRequestRepository extends MongoRepository<ProblemRequest, String> {
    List<ProblemRequest> findByStatus(RequestStatus status);

    List<ProblemRequest> findByRequesterId(String requesterId);
}
