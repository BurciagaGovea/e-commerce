// Login y registro (se mantienen en Railway)
export const login = "https://eesb-production.up.railway.app/esb/users/login";
export const register = "https://eesb-production.up.railway.app/esb/users/create";

// Productos
export const get_products = "http://192.168.1.16:8081/esb/products";
export const get_product_by_id = "http://192.168.1.16:8081/esb/products/";
export const create_product = "http://192.168.1.16:8081/esb/products/upload";

// Categorías
export const get_categories = "http://192.168.1.16:8081/esb/categories";
export const post_category = "http://192.168.1.16:8081/esb/categories";
export const get_cat_byid = "http://192.168.1.16:8081/esb/products/category/";

// Órdenes
export const get_orders = "http://192.168.1.16:8081/esb/orders";
export const order_details = "http://192.168.1.16:8081/esb/orders/details/";

// Clientes
export const get_clients = "http://192.168.1.16:8081/esb/clients";

// Usuario por ID
export const get_userbyid = "http://192.168.1.16:8081/esb/users/";

// Pagar orden
export const pay_order = "http://192.168.1.16:8081/esb/orders/pay/";

// Añadir al carrito
export const add_to_cart = "http://192.168.1.16:8081/esb/orders/add";


//NOTA IMPORTANTE LOS ARCHIVOS QUE ESTAN ESANDO ESTO DE DOCKER SON SEARCH, CARRITO Y HOME QUE SON LOS QUE MAS CONSUMEN