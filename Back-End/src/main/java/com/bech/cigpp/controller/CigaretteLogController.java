package com.bech.cigpp.controller;

import com.bech.cigpp.controller.dto.log.CigaretteLogRequestDto;
import com.bech.cigpp.controller.dto.log.CigaretteLogResponseDto;
import com.bech.cigpp.service.api.CigaretteLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

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

    @GetMapping("{userId}")
    public ResponseEntity<List<CigaretteLogResponseDto>> getCigaretteLogs(@PathVariable String userId) {
        List<CigaretteLogResponseDto> response = cigaretteLogService.getCigaretteLogs(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("{userId}/between")
    public ResponseEntity<List<CigaretteLogResponseDto>> getCigaretteLogsBetweenDates(
            @PathVariable String userId,
            @RequestParam Instant startDate,
            @RequestParam Instant endDate) {
        List<CigaretteLogResponseDto> response = cigaretteLogService.getCigaretteLogsBetweenDates(userId, startDate, endDate);
        return ResponseEntity.ok(response);
    }

}
