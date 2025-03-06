package tno.cigpp_server.mapper;

import tno.cigpp_server.model.cigarette.Tobacco;
import tno.cigpp_server.model.cigarette.TobaccoDTO;

public class TobaccoMapper {

    public static TobaccoDTO toDTO(Tobacco tobacco) {
        return new TobaccoDTO(tobacco.getTobaccoId(), tobacco.getBrandName(), tobacco.getSizeInGrams(), tobacco.getPrice());
    }

    public static Tobacco toEntity(TobaccoDTO tobaccoDTO) {
        return new Tobacco(tobaccoDTO.getTobaccoId(), tobaccoDTO.getBrandName(), tobaccoDTO.getSizeInGrams(), tobaccoDTO.getPrice());
    }
}
