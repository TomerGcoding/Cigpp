package tno.cigpp_server.mapper;

import tno.cigpp_server.model.cigarette.Tobacco;
import tno.cigpp_server.model.user.User;
import tno.cigpp_server.model.user.UserDTO;

public class UserMapper {

    public static UserDTO toDTO(User user) {
        return new UserDTO(user.getUserId(), user.getUsername(), TobaccoMapper.toDTO(user.getTobaccoType()), user.getCurrentCigaretteConsumption(), user.getTargetCigaretteConsumption());
    }

    public static User toEntity(UserDTO userDTO) {
        return new User(userDTO.getUserId(), userDTO.getUsername(), TobaccoMapper.toEntity(userDTO.getTobacco()), userDTO.getCurrentCigaretteConsumption(), userDTO.getTargetCigaretteConsumption());
    }

}
