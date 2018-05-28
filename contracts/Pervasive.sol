pragma solidity ^0.4.11;

contract Pervasive{

//Model a Subject
struct Subject {
  uint id;
  string name;
  uint voteCount;
}

//Store sender
//default to false
mapping(address => bool) public votersList;
//Store Subjects
//Fetch Subject
mapping(uint => Subject) public subjects;
//Store Subject Count (Since there is non possibility to know how many elements are in Subjects)
uint public subjectsCount;

//voted event
event selectedSubjectEvent(
    uint indexed _subjectId
  );

//Run every time we depoly it to the block chain
  function Pervasive () public{
    addSubject("Ethereum Node");
    addSubject("VerneMQ");
    addSubject("AWS IoT");
    addSubject("AltBeacon");
    addSubject("Genuino 101");
  }

  function addSubject(string _name) private{
    subjectsCount ++;
    subjects[subjectsCount] = Subject(subjectsCount,_name,0);
  }


  function vote (uint _subjectId) public {
    //check if has voted once
    require(!votersList[msg.sender]);
    //require a valid subject
    require(_subjectId>0 && _subjectId<=subjectsCount);
    //record that voter has Voted
    votersList[msg.sender]=true;

    //update subject vote counter
    subjects[_subjectId].voteCount ++;

    //trigger voted events
    selectedSubjectEvent(_subjectId);
  }
}
