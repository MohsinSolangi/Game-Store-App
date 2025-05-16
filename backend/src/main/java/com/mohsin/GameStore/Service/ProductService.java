package com.mohsin.GameStore.Service;

import com.mohsin.GameStore.Model.Product;
import com.mohsin.GameStore.Repository.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    ProductRepo productRepo;

    public List<Product> getAllProduct(){

        return productRepo.findAll();

    }

    public Product getProductBydId(int id) {

           return productRepo.findById(id).orElse(null);

    }

    public Product addProductOrUpdate(Product product, MultipartFile image) throws IOException {

        product.setImageName(image.getOriginalFilename());
        product.setImageType(image.getContentType());
        product.setImageData(image.getBytes());

        return productRepo.save(product);
    }


    public void deleteProduct(int id) {

        productRepo.deleteById(id);
    }

    public List<Product> searchProduct(String keyword) {

        return productRepo.searchProduct(keyword);
    }

    public List<String> getCategories() {

        return productRepo.getCategories();
    }
}
