package com.utd.ti.soa.ebs_service.controllers;

import com.utd.ti.soa.ebs_service.model.*;
import com.utd.ti.soa.ebs_service.utils.Auth;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/esb/orders")
public class ESBControllerOrder {

    private final WebClient webClient = WebClient.create("http://orders_service:3000/api/orders");
    private final Auth auth = new Auth();

    @GetMapping
    public Mono<ResponseEntity<String>> getAllOrders(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        if (!auth.validateToken(token))
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido"));

        return webClient.get()
                .uri("/orders")
                .retrieve()
                .bodyToMono(String.class)
                .map(ResponseEntity::ok)
                .onErrorResume(WebClientResponseException.class,
                    e -> Mono.just(ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString())))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor")));
    }

    @GetMapping("/details/{order_id}")
    public Mono<ResponseEntity<String>> getOrderDetails(@PathVariable String order_id,
                                                        @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        if (!auth.validateToken(token))
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido"));

        return webClient.get()
                .uri("/details/" + order_id)
                .retrieve()
                .bodyToMono(String.class)
                .map(ResponseEntity::ok)
                .onErrorResume(WebClientResponseException.class,
                    e -> Mono.just(ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString())))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor")));
    }

    @PostMapping("/add")
    public Mono<ResponseEntity<String>> addToCart(@RequestBody CartItem item,
                                                  @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        if (!auth.validateToken(token))
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido"));

        return webClient.post()
                .uri("/add")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(item)
                .retrieve()
                .bodyToMono(String.class)
                .map(ResponseEntity::ok)
                .onErrorResume(WebClientResponseException.class,
                    e -> Mono.just(ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString())))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor")));
    }

    @PostMapping("/create")
    public Mono<ResponseEntity<String>> createOrder(@RequestBody OrderRequest order,
                                                    @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        if (!auth.validateToken(token))
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido"));

        return webClient.post()
                .uri("/createOrder")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(order)
                .retrieve()
                .bodyToMono(String.class)
                .map(ResponseEntity::ok)
                .onErrorResume(WebClientResponseException.class,
                    e -> Mono.just(ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString())))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor")));
    }

    @PutMapping("/pay/{client_id}")
    public Mono<ResponseEntity<String>> payOrder(@PathVariable String client_id,
                                                 @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        if (!auth.validateToken(token))
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido"));

        return webClient.put()
                .uri("/pay/" + client_id)
                .retrieve()
                .bodyToMono(String.class)
                .map(ResponseEntity::ok)
                .onErrorResume(WebClientResponseException.class,
                    e -> Mono.just(ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString())))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor")));
    }
}