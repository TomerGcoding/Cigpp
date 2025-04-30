package com.bech.cigpp.controller;

import com.bech.cigpp.model.CigaretteLog;
import com.bech.cigpp.service.api.CigaretteLogService;
import com.bech.cigpp.service.api.impl.CigaretteLogServiceImpl;
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


}
