package com.mohsin.GameStore.Service;

import com.mohsin.GameStore.Model.User;
import com.mohsin.GameStore.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User saveUser(User user){

        User newUser = new User();
        newUser.setUsername(user.getUsername());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setRole(User.Role.valueOf("USER"));
        userRepo.save(newUser);
        return newUser;
    }

    public boolean checkIfUserExists(String username) {
        return userRepo.existsByUsername(username);
    }
}
