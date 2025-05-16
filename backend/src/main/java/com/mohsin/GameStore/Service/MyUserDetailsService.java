package com.mohsin.GameStore.Service;

import com.mohsin.GameStore.Model.User;
import com.mohsin.GameStore.Model.UserPrinciple;
import com.mohsin.GameStore.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {


    @Autowired
    private UserRepo userRepo;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User  user = userRepo.findUserByusername(username);

        if(user==null){
            System.out.println("user 404");

            throw new UsernameNotFoundException("user 404");
        }

        return new UserPrinciple(user);
    }
}
