package com.utd.ti.soa.ebs_service.controllers;

import com.utd.ti.soa.ebs_service.model.Comment;
import com.utd.ti.soa.ebs_service.utils.Auth;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/esb/comments")
public class ESBControllerComment {

    private final WebClient webClient = WebClient.create("http://products_service:3000/api");
    private final Auth auth = new Auth();

    @PostMapping
    public Mono<ResponseEntity<String>> createComment(@RequestBody Comment data,
                                                      @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        if (!auth.validateToken(token))
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido"));

        return webClient.post()
                .uri("/comments")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(data)
                .retrieve()
                .bodyToMono(String.class)
                .map(ResponseEntity::ok)
                .onErrorResume(WebClientResponseException.class,
                        e -> Mono.just(ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString())))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor")));
    }

    @GetMapping("/product/{product_id}")
    public Mono<ResponseEntity<String>> getCommentsByProduct(@PathVariable String product_id,
                                                             @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        if (!auth.validateToken(token))
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido"));

        return webClient.get()
                .uri("/comments/product/" + product_id)
                .retrieve()
                .bodyToMono(String.class)
                .map(ResponseEntity::ok)
                .onErrorResume(WebClientResponseException.class,
                        e -> Mono.just(ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString())))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor")));
    }

    @GetMapping("/user/{user_id}")
    public Mono<ResponseEntity<String>> getCommentsByUser(@PathVariable String user_id,
                                                          @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        if (!auth.validateToken(token))
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido"));

        return webClient.get()
                .uri("/comments/user/" + user_id)
                .retrieve()
                .bodyToMono(String.class)
                .map(ResponseEntity::ok)
                .onErrorResume(WebClientResponseException.class,
                        e -> Mono.just(ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString())))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor")));
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<String>> deleteComment(@PathVariable String id,
                                                      @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        if (!auth.validateToken(token))
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido"));

        return webClient.delete()
                .uri("/comments/" + id)
                .retrieve()
                .bodyToMono(String.class)
                .map(ResponseEntity::ok)
                .onErrorResume(WebClientResponseException.class,
                        e -> Mono.just(ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString())))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor")));
    }
}
