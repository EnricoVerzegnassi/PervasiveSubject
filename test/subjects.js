var Pervasive = artifacts.require("./Pervasive.sol");

//Testing thanks to Mocha and Chai
contract("Pervasive", function(accounts){
  var subjectInstance;
  it("initializes with five subjects", function(){
    return Pervasive.deployed().then(function(instance){
      return instance.subjectsCount();
    }).then(function(count){
      assert.equal(count,5);
    });
  });

  it("It initializes the first two subjects with the correct values",function(){
    //Get instance of our deployed contract
    return Pervasive.deployed().then(function(instance){
      subjectInstance = instance;
      return subjectInstance.subjects(1);
      //the return object will finish inside the next function
    }).then(function(subject){
      assert.equal(subject[0],1,"contains the correct id");
      assert.equal(subject[1],"Ethereum Node","contains the correct name");
      assert.equal(subject[2],0,"Contains the correct votes count");
      return subjectInstance.subjects(2);
    }).then(function(subject){
      assert.equal(subject[0],2,"contains the correct id");
      assert.equal(subject[1],"VerneMQ","contains the correct name");
      assert.equal(subject[2],0,"Contains the correct number of votes");
    });
  });

  it("allows a voter to cast a vote", function(){
    return Pervasive.deployed().then(function(instance){
      subjectInstance = instance;
      subjectId = 1;
      return subjectInstance.vote(subjectId, {from: accounts[0]});
    }).then(function(receipt){
      assert.equal(receipt.logs.length,1,"an event was triggered");
      assert.equal(receipt.logs[0].event,"selectedSubjectEvent","the event type is correct");
      assert.equal(receipt.logs[0].args._subjectId.toNumber(),subjectId, "the subject id is correct");

      return subjectInstance.votersList(accounts[0]);
    }).then(function(voted){
      //voted is a variable that can be true or false
      assert(voted,"the voter was marked as voted");
      return subjectInstance.subjects(subjectId);
    }).then(function (subject){
      var voteCount = subject[2];
      assert.equal(voteCount,1,"increments the subject's vote count");
    })
  });

  it("throws an exception for invalid candiates", function() {
    return Pervasive.deployed().then(function(instance) {
      subjectInstance = instance;
      return subjectInstance.vote(99, { from: accounts[1] })
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return subjectInstance.subjects(1);
    }).then(function(subject1) {
      var voteCount = subject1[2];
      assert.equal(voteCount, 1, "subject 1 did not receive any votes");
      return subjectInstance.subjects(2);
    }).then(function(subject2) {
      var voteCount = subject2[2];
      assert.equal(voteCount, 0, "subject 2 did not receive any votes");
    });
  });

  it("throws an exception for double voting", function() {
    return Pervasive.deployed().then(function(instance) {
      subjectInstance = instance;
      subjectId = 2;
      subjectInstance.vote(subjectId, { from: accounts[1] });
      return subjectInstance.subjects(subjectId);
    }).then(function(subject) {
      var voteCount = subject[2];
      assert.equal(voteCount, 1, "accepts first vote");
      // Try to vote again
      return subjectInstance.vote(subjectId, { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return subjectInstance.subjects(1);
    }).then(function(subject1) {
      var voteCount = subject1[2];
      assert.equal(voteCount, 1, "subject 1 did not receive any votes");
      return subjectInstance.subjects(2);
    }).then(function(subject2) {
      var voteCount = subject2[2];
      assert.equal(voteCount, 1, "subject 2 did not receive any votes");
    });
  });
});
