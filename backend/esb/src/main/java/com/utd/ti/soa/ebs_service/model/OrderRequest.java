package com.utd.ti.soa.ebs_service.model;

public class OrderRequest {
    public String client_id;
    public ProductItem[] products;

    public static class ProductItem {
        public String product_id;
        public String quantity;
    }
}