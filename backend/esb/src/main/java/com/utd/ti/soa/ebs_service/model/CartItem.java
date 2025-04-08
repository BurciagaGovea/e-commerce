package com.utd.ti.soa.ebs_service.model;
public class CartItem {
    public String client_id;
    public ProductQuantity[] product;

    public static class ProductQuantity {
        public String product_id;
        public String quantity;
    }
}