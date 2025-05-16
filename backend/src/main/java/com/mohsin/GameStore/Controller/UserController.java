package com.mohsin.GameStore.Controller;

import com.mohsin.GameStore.Model.JwtResponse;
import com.mohsin.GameStore.Model.User;
import com.mohsin.GameStore.Repository.UserRepo;
import com.mohsin.GameStore.Service.JwtService;
import com.mohsin.GameStore.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;


    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {

        if (userService.checkIfUserExists(user.getUsername())) {

            return ResponseEntity.badRequest().body("Username is already taken");
        }

        userService.saveUser(user);
        return ResponseEntity.ok("User registered successfully");
    }

@PostMapping("/login")
public ResponseEntity<?> authenticateUser(@RequestBody User user) {
    try {
        System.out.println("User: " + user.getUsername() + ", Password: " + user.getPassword());

        if (!userService.checkIfUserExists(user.getUsername())) {
            return ResponseEntity.status(404).body("User not found");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(),
                        user.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // If successful, generate JWT
        String token = jwtService.generateToken(user.getUsername(), authentication.getAuthorities());

        return ResponseEntity.ok(new JwtResponse(token));
    } catch (Exception e) {
        return ResponseEntity.status(401).body("Invalid username or password");
    }
}



}