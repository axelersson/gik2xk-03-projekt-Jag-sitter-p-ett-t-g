"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
// Cart och user
db.cart.belongsTo(db.user);
db.user.hasMany(db.cart);

// Kopplat rating till produkt

/* db.product.hasMany(db.rating, {
  allowNull: false,
});
db.rating.belongsTo(
  db.product,
  { foreignKey: { allowNull: false } },
  {
    allowNull: false,
    onDelete: "CASCADE",
  }
); */

db.rating.belongsTo(db.product, {
  allowNull: false,
  onDelete: "CASCADE",
});
db.product.hasMany(db.rating);

db.product.belongsToMany(db.cart, { through: db.cartRow });
db.cart.belongsToMany(db.product, { through: db.cartRow });

//koppla rating till user??????? Finns ingen relation i umldiagrammet
//koppla user till cart?????? Finns inte med i uppgiftsbeskrivningen
//wackooo wackooo
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
