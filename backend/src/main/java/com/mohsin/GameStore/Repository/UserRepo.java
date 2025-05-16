package com.mohsin.GameStore.Repository;

import com.mohsin.GameStore.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User,Integer> {

     User findUserByusername(String username);

     boolean existsByUsername(String username);
}
