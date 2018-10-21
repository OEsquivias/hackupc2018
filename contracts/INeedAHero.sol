pragma solidity ^0.4.20;

contract INeedAHero {
    struct person {
        bytes32 id;
        address account;
        int lat;
        int lon;
        uint accuracy;
        bool inDanger;
        bool hero;
        uint heroRating;
    }

    struct policeReport {
        int lat;
        int lon;
        bytes32 id;
        uint accuracy;
    }

    uint lastReport = 0;
    mapping (uint => policeReport) public reports;

    event Alert(bytes32 indexed _id, int _lat, int _lon);
    event unAlert(bytes32 indexed _id);


    mapping (bytes32 => person) public people;
    mapping (bytes32 => bytes32[]) public matches;

    function needHelp(bytes32 _id, int _lat, int _lon, uint _accuracy) public {
        people[_id].account = msg.sender;
        people[_id].id = _id;
        people[_id].lat = _lat;
        people[_id].lon = _lon;
        people[_id].accuracy = _accuracy;
        people[_id].inDanger = true;
        emit Alert(_id, _lat, _lon);
    }

    function doMatch(bytes32 _idVictim, bytes32 _id, int _lat, int _lon, uint _accuracy) public {
        people[_id].account = msg.sender;
        people[_id].id = _id;
        people[_id].lat = _lat;
        people[_id].lon = _lon;
        people[_id].accuracy = _accuracy;
        matches[_idVictim].push(_id);
    }

    function report(bytes32 _id, int _lat, int _lon, uint _accuracy) public {
        reports[lastReport].lat = _lat;
        reports[lastReport].lon = _lon;
        reports[lastReport].id = _id;
        reports[lastReport].accuracy = _accuracy;
        people[_id].inDanger = false;
        lastReport += 1;
    }

    function noMoreHelp(bytes32 _id) public {
        people[_id].inDanger = false;
        for (uint i = 0; i < matches[_id].length; i++) {
            people[matches[_id][i]].heroRating += 1;
        }
        emit unAlert(_id);
    }

    function getRating(bytes32 _id) public view returns(uint score){
        score = people[_id].heroRating;
    }

}
