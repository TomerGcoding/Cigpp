package tno.cigpp_server.model.user;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import tno.cigpp_server.model.cigarette.Tobacco;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private Long userId;
    private String username;
    private Tobacco tobaccoType;
    private Integer currentCigaretteConsumption;
    private Integer targetCigaretteConsumption;
}
