import orderDetail from "./order.detailModel.js";
import Orders from "./orderModel.js";

//https://sequelize.org/docs/v6/core-concepts/assocs/
//https://stackoverflow.com/questions/61163520/nodejssequelize-referenceerror-cannot-access-modelname-before-initializat

Orders.hasMany(orderDetail, {foreignKey: "order_id"});
orderDetail.belongsTo(Orders, {foreignKey: "order_id"});

const models = { Orders, orderDetail };

export {models};