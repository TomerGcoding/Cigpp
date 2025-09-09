package com.bech.cigpp.service.impl;

import com.bech.cigpp.controller.dto.log.CigaretteLogRequestDto;
import com.bech.cigpp.controller.dto.log.CigaretteLogResponseDto;
import com.bech.cigpp.exception.ResourceNotFoundException;
import com.bech.cigpp.model.device.Device;
import com.bech.cigpp.model.log.CigaretteLog;
import com.bech.cigpp.repository.CigaretteLogRepository;
import com.bech.cigpp.repository.DeviceRepository;
import com.bech.cigpp.service.api.ChallengeProgressService;
import com.bech.cigpp.service.api.CigaretteLogService;
import com.bech.cigpp.util.CigaretteLogMapper;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;

@Service
public class CigaretteLogServiceImpl implements CigaretteLogService {

    private final CigaretteLogRepository cigaretteLogRepository;
    private final DeviceRepository deviceRepository;
    private final ChallengeProgressService challengeProgressService;

    public CigaretteLogServiceImpl(CigaretteLogRepository cigaretteLogRepository, 
                                   DeviceRepository deviceRepository,
                                   ChallengeProgressService challengeProgressService) {
        this.cigaretteLogRepository = cigaretteLogRepository;
        this.deviceRepository = deviceRepository;
        this.challengeProgressService = challengeProgressService;
    }

    @Override
    public CigaretteLogResponseDto addCigaretteLog(CigaretteLogRequestDto dto) {
        CigaretteLog log;
        if ((dto.userId() == null && dto.deviceId() == null) || (dto.userId() != null && dto.deviceId() != null)) {
            throw new IllegalArgumentException("Exactly one of userId or deviceId must be provided.");
        }
        if (dto.deviceId() != null) {
            Device device = deviceRepository.findById(dto.deviceId()).orElseThrow(() -> new IllegalArgumentException("Device ID not found: " + dto.deviceId()));
            if (device.getUser().getUserId() == null) {
                throw new IllegalStateException("Device does noy have an associated user");
            }
            log = CigaretteLog.builder()
                    .userId(device.getUser().getUserId())
                    .description(dto.description())
                    .timestamp(dto.timestamp())
                    .build();
        } else {
            log = CigaretteLogMapper.toEntity(dto);
        }

        CigaretteLog savedCigaretteLog = cigaretteLogRepository.save(log);
        if (savedCigaretteLog == null) {
            throw new RuntimeException("Failed to save cigarette log");
        }
        
        // Update challenge progress asynchronously
        String userId = savedCigaretteLog.getUserId();
        LocalDate logDate = savedCigaretteLog.getTimestamp().atZone(ZoneId.systemDefault()).toLocalDate();
        try {
            challengeProgressService.updateChallengeProgressOnCigaretteLog(userId, logDate);
        } catch (Exception e) {
            // Log error but don't fail the cigarette log creation
            // In a production environment, you might want to use async processing or retry mechanism
            System.err.println("Failed to update challenge progress for user " + userId + " on date " + logDate + ": " + e.getMessage());
        }
        
        return CigaretteLogMapper.toResponseDto(savedCigaretteLog);
    }


    @Override
    public List<CigaretteLogResponseDto> getCigaretteLogs(String userId) {
        List<CigaretteLog> cigaretteLogs = cigaretteLogRepository.findByUserId(userId);
        if (cigaretteLogs == null || cigaretteLogs.isEmpty()) {
            throw new ResourceNotFoundException("No cigarette logs found for user: " + userId);
        }
        return CigaretteLogMapper.toResponseDtoList(cigaretteLogs);

    }
    @Override
    public List<CigaretteLogResponseDto> getCigaretteLogsBetweenDates(String userId, Instant startDate, Instant endDate) {
        List<CigaretteLog> cigaretteLogs = cigaretteLogRepository.findByUserIdAndTimestampBetween(userId, startDate, endDate);
        if (cigaretteLogs == null || cigaretteLogs.isEmpty()) {
            throw new ResourceNotFoundException("No cigarette logs found for user: " + userId + " between dates: " + startDate + " and " + endDate);
        }
        return CigaretteLogMapper.toResponseDtoList(cigaretteLogs);
    }

    @Override
    public List<CigaretteLogResponseDto> getTodaysCigaretteLogs(String userId) {
        ZoneId zoneId = ZoneId.systemDefault();
        Instant startOfTheDay = LocalDate.now().atStartOfDay(zoneId).toInstant();
        Instant endOfTheDay = LocalDate.now().plusDays(1).atStartOfDay(zoneId).toInstant().minusMillis(1);
        List<CigaretteLog> cigaretteLogs = cigaretteLogRepository.findByUserIdAndTimestampBetween(userId, startOfTheDay, endOfTheDay);

        if (cigaretteLogs == null || cigaretteLogs.isEmpty()) {
            return Collections.emptyList();
        }
        return CigaretteLogMapper.toResponseDtoList(cigaretteLogs);
    }

    @Override
    public CigaretteLogResponseDto deleteCigaretteLog(Long id) {
        CigaretteLog cigaretteLog = cigaretteLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cigarette log not found with id: " + id));
        
        // Store info before deletion for challenge progress update
        String userId = cigaretteLog.getUserId();
        LocalDate logDate = cigaretteLog.getTimestamp().atZone(ZoneId.systemDefault()).toLocalDate();
        
        cigaretteLogRepository.delete(cigaretteLog);
        
        // Update challenge progress after deletion
        try {
            challengeProgressService.updateChallengeProgressOnCigaretteDelete(userId, logDate);
        } catch (Exception e) {
            // Log error but don't fail the deletion
            System.err.println("Failed to update challenge progress after deletion for user " + userId + " on date " + logDate + ": " + e.getMessage());
        }
        
        return CigaretteLogMapper.toResponseDto(cigaretteLog);
    }
}
