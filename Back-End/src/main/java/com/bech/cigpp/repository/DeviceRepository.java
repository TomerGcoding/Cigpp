package com.bech.cigpp.repository;

import com.bech.cigpp.model.device.Device;
import com.bech.cigpp.model.log.CigaretteLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface DeviceRepository extends JpaRepository<Device,String> {
}
