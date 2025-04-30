package com.bech.cigpp.service.api.impl;

import com.bech.cigpp.model.CigaretteLog;
import com.bech.cigpp.repository.CigaretteLogRepository;
import com.bech.cigpp.service.api.CigaretteLogService;
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
    public void addCigaretteLog(String userId, String description, Instant date) {
        try {
            CigaretteLog cigaretteLog = CigaretteLog.builder()
                    .userId(userId)
                    .description(description)
                    .date(date)
                    .build();
            cigaretteLogRepository.save(cigaretteLog);
        } catch (Exception e) {
            // Handle exception
            e.printStackTrace();
        }
    }

    @Override
    public List<CigaretteLog> getCigaretteLogs(String userId) {
        try {
            return cigaretteLogRepository.findByUserId(userId);
        } catch (Exception e) {
            // Handle exception
            e.printStackTrace();
            return List.of();
        }
    }
    @Override
    public List<CigaretteLog> getCigaretteLogsBetweenDates(String userId, Instant startDate, Instant endDate) {
        try{
            return cigaretteLogRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
        } catch (Exception e) {
            // Handle exception
            e.printStackTrace();
            return List.of();
        }
    }
    @Override
    public void deleteCigaretteLog(Long id) {
        try{
            cigaretteLogRepository.deleteById(id);
        }catch (Exception e){
            // Handle exception
            e.printStackTrace();
        }
    }
}
