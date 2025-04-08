// --- controller/ESBControllerProductUpload.java ---
package com.utd.ti.soa.ebs_service.controllers;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/esb/products/upload")
public class ESBControllerProductUpload {

    // private final String productServiceUrl = "http://localhost:5000/api/products/products";
    private final String productServiceUrl = "http://products_service:3000/api/products/products";

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") String price,
            @RequestParam("category_id") String category_id,
            @RequestParam("image") MultipartFile image
    ) {
        try {
            // Guardar archivo temporal
            File tempFile = File.createTempFile("upload-", image.getOriginalFilename());
            image.transferTo(tempFile);
            FileSystemResource fileResource = new FileSystemResource(tempFile);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("name", name);
            body.add("description", description);
            body.add("price", price);
            body.add("category_id", category_id);
            body.add("image", fileResource);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.postForEntity(productServiceUrl, requestEntity, String.class);

            tempFile.delete();
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Error al manejar archivo\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("{\"error\": \"Fallo al enviar al servicio de productos\"}");
        }
    }
}
