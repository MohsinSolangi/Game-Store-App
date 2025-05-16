package com.mohsin.GameStore.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  int id;
    private String name;
    private String company;
    private BigDecimal price;
    private String Category;
    private String Description;

    private Boolean productAvailable;
    private String imageName;
    private String imageType;
    @Lob
    private byte[] imageData;







}


