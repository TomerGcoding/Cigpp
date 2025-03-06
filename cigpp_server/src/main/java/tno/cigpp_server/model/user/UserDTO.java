package tno.cigpp_server.model.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import tno.cigpp_server.model.cigarette.Tobacco;
import tno.cigpp_server.model.cigarette.TobaccoDTO;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private Long userId;
    private String username;
    private TobaccoDTO tobacco;
    private Integer currentCigaretteConsumption;
    private Integer targetCigaretteConsumption;

}
