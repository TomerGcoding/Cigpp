package tno.cigpp_server.controller;


import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import tno.cigpp_server.mapper.TobaccoMapper;
import tno.cigpp_server.mapper.UserMapper;
import tno.cigpp_server.model.user.User;
import tno.cigpp_server.model.user.UserDTO;
import tno.cigpp_server.repository.UsersRepository;

@RestController
@Slf4j
public class CigppServerController {


    private UsersRepository usersRepository;

    public CigppServerController(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @GetMapping("/health")
    public String health() {
        log.info("Cigpp Server health check");
        return "OK";
    }

    @PostMapping("/users")
    public ResponseEntity createUser(@RequestBody UserDTO newUser) {
        try {
            User newUserEntity = UserMapper.toEntity(newUser);
            log.info("Creating user: {}", newUserEntity);
            usersRepository.save(newUserEntity);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error creating user: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/users")
    public ResponseEntity getUsers() {
        try {
            log.info("Getting all users");
            return ResponseEntity.ok(usersRepository.findAll());
        } catch (Exception e) {
            log.error("Error getting users: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }


}
