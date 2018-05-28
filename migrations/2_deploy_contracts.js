//Artifacts represent the contract abstraction
var Pervasive = artifacts.require("./Pervasive.sol");

module.exports = function(deployer) {
  deployer.deploy(Pervasive);
};
