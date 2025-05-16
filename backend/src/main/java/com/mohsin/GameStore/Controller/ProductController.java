package com.mohsin.GameStore.Controller;

import com.mohsin.GameStore.Model.Product;
import com.mohsin.GameStore.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")

public class ProductController {


    @Autowired
    private ProductService productService;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts(){

        return new ResponseEntity<>(productService.getAllProduct(), HttpStatus.OK);
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable int id){
        Product product  = productService.getProductBydId(id);

        if(product !=null){
            return new ResponseEntity<>(product,HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/product")
    public ResponseEntity<Product> addproduct(@RequestPart Product product, @RequestPart MultipartFile imageFile){
        Product savedProduct = null;
        try {
            savedProduct = productService.addProductOrUpdate(product,imageFile);
            return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
        } catch (IOException e) {
            throw new RuntimeException(e);

        }
    }

    @GetMapping("product/{productId}/image")
    public ResponseEntity<byte[]> getImageByProductId(@PathVariable int productId){

        Product product =productService.getProductBydId(productId);

        if(product !=null){
            return new ResponseEntity<>(product.getImageData(),HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @PutMapping("/product/{id}")
    public ResponseEntity<String> UpdateProduct(@PathVariable int id, @RequestPart Product product, @RequestPart MultipartFile imageFile){
        Product savedProduct = null;
        try {
            savedProduct = productService.addProductOrUpdate(product,imageFile);
            return new ResponseEntity<>("updated", HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }


    @DeleteMapping("/product/{id}")
    public ResponseEntity<String> deleteproduct(@PathVariable int id){
        Product product =productService.getProductBydId(id);
        if(product !=null) {
            productService.deleteProduct(id);
            return new ResponseEntity<>("Deleted", HttpStatus.OK);
        }else {
            return new ResponseEntity<>( HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/products/search")
    public ResponseEntity<List<Product>>  searchProduct(@RequestParam String keyword){

        List<Product> products = productService.searchProduct(keyword);

        System.out.println("search keyword"+keyword);

        return  new ResponseEntity<>(products,HttpStatus.OK);

    }

    @GetMapping("/product/categories")
    public ResponseEntity<List<String>> getCategory(){

        try {
            List<String> categories = productService.getCategories();
            System.out.println("categories"+categories);
            return new ResponseEntity<>( categories, HttpStatus.ACCEPTED);
        } catch ( Exception e) {
            System.out.println("error message"+e.getMessage());
            // Log the exception for debugging
            e.printStackTrace();
            // Return an error response with HTTP 500 status
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

}