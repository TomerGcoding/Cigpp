package com.bech.cigpp.controller;

import com.bech.cigpp.controller.dto.log.CigaretteLogRequestDto;
import com.bech.cigpp.controller.dto.log.CigaretteLogResponseDto;
import com.bech.cigpp.service.api.CigaretteLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cigarettes")
public class CigaretteLogController {

    private final CigaretteLogService cigaretteLogService;

    public CigaretteLogController(CigaretteLogService cigaretteLogService) {
        this.cigaretteLogService = cigaretteLogService;
    }

    @PostMapping
    public ResponseEntity<CigaretteLogResponseDto> addCigaretteLog(@RequestBody CigaretteLogRequestDto cigaretteLogDto) {
        CigaretteLogResponseDto response = cigaretteLogService.addCigaretteLog(cigaretteLogDto);
        return ResponseEntity.ok(response);
    }
}
