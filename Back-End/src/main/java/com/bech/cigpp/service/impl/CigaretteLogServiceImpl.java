package com.bech.cigpp.service.impl;

import com.bech.cigpp.controller.dto.log.CigaretteLogRequestDto;
import com.bech.cigpp.controller.dto.log.CigaretteLogResponseDto;
import com.bech.cigpp.model.CigaretteLog;
import com.bech.cigpp.repository.CigaretteLogRepository;
import com.bech.cigpp.service.api.CigaretteLogService;
import com.bech.cigpp.util.CigaretteLogMapper;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class CigaretteLogServiceImpl implements CigaretteLogService {

    private final CigaretteLogRepository cigaretteLogRepository;

    public CigaretteLogServiceImpl(CigaretteLogRepository cigaretteLogRepository) {
        this.cigaretteLogRepository = cigaretteLogRepository;
    }

    @Override
    public CigaretteLogResponseDto addCigaretteLog(CigaretteLogRequestDto cigaretteLogDto) {
        CigaretteLog cigaretteLog = CigaretteLogMapper.toEntity(cigaretteLogDto);
        CigaretteLog savedCigaretteLog = cigaretteLogRepository.save(cigaretteLog);
        if (savedCigaretteLog == null) {
            throw new RuntimeException("Failed to save cigarette log");
        }
        return CigaretteLogMapper.toResponseDto(savedCigaretteLog);
    }

    @Override
    public List<CigaretteLogResponseDto> getCigaretteLogs(String userId) {
        List<CigaretteLog> cigaretteLogs = cigaretteLogRepository.findByUserId(userId);
        if (cigaretteLogs == null || cigaretteLogs.isEmpty()) {
            throw new RuntimeException("No cigarette logs found for user: " + userId);
        }
        return CigaretteLogMapper.toResponseDtoList(cigaretteLogs);

    }
    @Override
    public List<CigaretteLogResponseDto> getCigaretteLogsBetweenDates(String userId, Instant startDate, Instant endDate) {
        List<CigaretteLog> cigaretteLogs = cigaretteLogRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
        if (cigaretteLogs == null || cigaretteLogs.isEmpty()) {
            throw new RuntimeException("No cigarette logs found for user: " + userId + " between dates: " + startDate + " and " + endDate);
        }
        return CigaretteLogMapper.toResponseDtoList(cigaretteLogs);
    }

    @Override
    public CigaretteLogResponseDto deleteCigaretteLog(Long id) {
        CigaretteLog cigaretteLog = cigaretteLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cigarette log not found with id: " + id));
        cigaretteLogRepository.delete(cigaretteLog);
        return CigaretteLogMapper.toResponseDto(cigaretteLog);
    }
}
