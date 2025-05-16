package com.mohsin.GameStore.Repository;

import com.mohsin.GameStore.Model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product,Integer> {

    @Query("SELECT p from Product p WHERE " +
            "LOWER(p.name) LIKE LOWER (CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.Description) LIKE LOWER (CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.company) LIKE LOWER (CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.Category) LIKE LOWER (CONCAT('%', :keyword, '%'))")
    List<Product> searchProduct(String keyword);

    @Query("select DISTINCT p.Category, p.Category from Product p")
    List<String> getCategories();
}
