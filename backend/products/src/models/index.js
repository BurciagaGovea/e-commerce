import Category from "./categoryModel.js";
import Inventory from "./inventoryModel.js";
import Product from "./productModel.js";
import Comment from "./commentModel.js";

 //https://sequelize.org/docs/v6/core-concepts/assocs/
Category.hasMany(Product, { foreignKey: "category_id" });
Product.belongsTo(Category, { foreignKey: "category_id" });

Product.hasMany(Inventory, { foreignKey: "product_id" });
Inventory.belongsTo(Product, { foreignKey: "product_id" });

const models = { Category, Inventory, Product, Comment };

export { models };

// https://stackoverflow.com/questions/61163520/nodejssequelize-referenceerror-cannot-access-modelname-before-initializat