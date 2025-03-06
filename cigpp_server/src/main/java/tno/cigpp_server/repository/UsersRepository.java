package tno.cigpp_server.repository;


import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import tno.cigpp_server.model.user.User;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@Slf4j
public class UsersRepository {

    private final Map<Long, User> users = new HashMap<>();

    public User save(User user) {
        log.info("Saving user: {}", user);
        if(users.containsKey(user.getUserId())) {
            throw new RuntimeException("User already exists");
        }
        users.put(user.getUserId(), user);
        return user;
    }

    public User findById(Long userId) {
        log.info("Finding user by id: {}", userId);
        return users.get(userId);
    }

    public User deleteById(Long userId) {
        log.info("Deleting user by id: {}", userId);
        return users.remove(userId);
    }

    public User update(User user) {
        log.info("Updating user: {}", user);
        users.put(user.getUserId(), user);
        return user;
    }

    public List<User> findAll() {
        log.info("Finding all users");
        return List.copyOf(users.values());
    }

}
