package com.bech.cigpp.service.impl;

import com.bech.cigpp.controller.dto.log.CigaretteLogRequestDto;
import com.bech.cigpp.controller.dto.log.CigaretteLogResponseDto;
import com.bech.cigpp.exception.ResourceNotFoundException;
import com.bech.cigpp.model.device.Device;
import com.bech.cigpp.model.log.CigaretteLog;
import com.bech.cigpp.repository.CigaretteLogRepository;
import com.bech.cigpp.repository.DeviceRepository;
import com.bech.cigpp.service.api.CigaretteLogService;
import com.bech.cigpp.util.CigaretteLogMapper;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
public class CigaretteLogServiceImpl implements CigaretteLogService {

    private final CigaretteLogRepository cigaretteLogRepository;
    private final DeviceRepository deviceRepository;

    public CigaretteLogServiceImpl(CigaretteLogRepository cigaretteLogRepository, DeviceRepository deviceRepository) {
        this.cigaretteLogRepository = cigaretteLogRepository;
        this.deviceRepository = deviceRepository;
    }

    @Override
    public CigaretteLogResponseDto addCigaretteLog(CigaretteLogRequestDto dto) {
        CigaretteLog log;
        if ((dto.userId() == null && dto.deviceId() == null) || (dto.userId() != null && dto.deviceId() != null)) {
            throw new IllegalArgumentException("Exactly one of userId or deviceId must be provided.");
        }
        if (dto.deviceId() != null) {
            Device device = deviceRepository.findById(dto.deviceId()).orElseThrow(() -> new IllegalArgumentException("Device ID not found: " + dto.deviceId()));
            if (device.getUserId() == null) {
                throw new IllegalStateException("Device does noy have an associated user");
            }
            log = CigaretteLog.builder()
                    .userId(device.getUserId())
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
        List<CigaretteLog> cigaretteLogs = cigaretteLogRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
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
        List<CigaretteLog> cigaretteLogs = cigaretteLogRepository.findByUserIdAndDateBetween(userId, startOfTheDay, endOfTheDay);
        if (cigaretteLogs == null || cigaretteLogs.isEmpty()) {
            throw new ResourceNotFoundException("No cigarette logs found for user: " + userId + " between dates: " + startOfTheDay + " and " + endOfTheDay);
        }
        return CigaretteLogMapper.toResponseDtoList(cigaretteLogs);
    }

    @Override
    public CigaretteLogResponseDto deleteCigaretteLog(Long id) {
        CigaretteLog cigaretteLog = cigaretteLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cigarette log not found with id: " + id));
        cigaretteLogRepository.delete(cigaretteLog);
        return CigaretteLogMapper.toResponseDto(cigaretteLog);
    }
}
