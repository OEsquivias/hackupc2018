pragma solidity ^0.4.20;

contract INeedAHero {
    struct person {
        bytes32 id;
        address account;
        int lat;
        int lon;
        bool volunteer;
    }

    event Alert(bytes32 indexed _id, int _lat, int _lon);


    mapping (bytes32 => person) public people;
    mapping (bytes32 => mapping (bytes32 => bool)) public matches;

    function setGps(bytes32 _id, int _lat, int _lon) public {
        people[_id].account = msg.sender;
        people[_id].id = _id;
        people[_id].lat = _lat;
        people[_id].lon = _lon;
        emit Alert(_id, _lat, _lon);
    }

    function getGps(bytes32 _id) public view returns(int _lat, int _lon) {
        _lat = people[_id].lat;
        _lon = people[_id].lon;
    }

    function changeMatch (bytes32 _id1, bytes32 _id2) public {
        if(matches[_id1][_id2]) {
            matches[_id1][_id2] = false;
        }
        else{
            matches[_id1][_id2] = true;
        }
    }
}
