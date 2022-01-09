// contracts/Box.sol
// SPDX-License-Identifier: MIT
// pragma solidity ^0.8.4;
pragma solidity ^0.6.6;

// Import Ownable from the OpenZeppelin Contracts library
import "@openzeppelin/contracts/access/Ownable.sol";

// Import Auth from the access-control subdirectory
import "./Auth.sol";

contract Box is Ownable {
    /// Using these values to manipulate the random value on each die roll.
    /// The goal is an attempt to further randomize randomness for each die rolled.
    /**
    * 77194726158210796949047323339125271902179989777093709359638389338608753093290
    * 0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    * 10101010101010101010101010101...
    */
    // uint constant MODIFIER_VALUE_1 = 77194726158210796949047323339125271902179989777093709359638389338608753093290;

    /**
    * 38597363079105398474523661669562635951089994888546854679819194669304376546645
    * 0x55555555555555555555555555555555555555555555555555555555555555555
    * 0101010101...
    */
    // uint constant MODIFIER_VALUE_2 = 38597363079105398474523661669562635951089994888546854679819194669304376546645;
    uint constant MAX_DICE_ALLOWED = 10;
    uint constant MAX_DIE_SIZE_ALLOWED = 100;
    int constant MAX_ADJUSTMENT_ALLOWED = 20;
    // int8 private constant ROLL_IN_PROGRESS = 42;

    // bytes32 private chainLinkKeyHash;
    // uint256 private chainlinkVRFFee;

    struct DiceRollee {
        address rollee;
        uint256 timestamp; /// When the die were rolled
        uint256 randomness; /// Stored to help verify/debug results
        uint128 numberOfDie; /// 1 = roll once, 4 = roll four die
        uint128 dieSize; // 6 = 6 sided die, 20 = 20 sided die
        int128 adjustment; /// Can be a positive or negative value
        int128 result; /// Result of all die rolls and adjustment. Can be negative because of a negative adjustment.
        /// Max value can be 1000 (10 * 100 sided die rolled)
        uint256 hasRolled; /// Used in some logic tests
        uint128[] rolledValues; /// array of individual rolls. These can only be positive.
    }

    /**
    * Mapping between the requestID (returned when a request is made), 
    * and the address of the roller. This is so the contract can keep track of 
    * who to assign the result to when it comes back.
    */
    // mapping(bytes32 => address) private rollers;

    /// Used to indicate if an address has ever rolled.
    mapping(address => bool) private rollers;

    /// stores the roller and the state of their current die roll.
    /// This is useful so we can see if the dice have actually landed yet.
    mapping(address => DiceRollee) private currentRoll;

    /// users can have multiple die rolls
    mapping (address => DiceRollee[]) rollerHistory;

    /// keep list of user addresses for fun/stats
    /// can iterate over them later.
    address[] internal rollerAddresses;

    /// Emit this when either of the rollDice functions are called.
    /// Used to notify soem front end that we are waiting for response from
    /// chainlink VRF.
    // event DiceRolled(bytes32 indexed requestId, address indexed roller);

    /// Emitted when fulfillRandomness is called by Chainlink VRF to provide the random value.
    // event DiceLanded(
    //     bytes32 indexed requestId, 
    //     address indexed roller, 
    //     uint8[] rolledvalues, 
    //     int8 adjustment, 
    //     int16 result
    //     );

    modifier validateNumberOfDie(uint _numberOfDie) {
        require(_numberOfDie <= MAX_DICE_ALLOWED, "Too many dice!");
        _;
    }

    modifier validateDieSize(uint _dieSize) {
        require(_dieSize <= MAX_DIE_SIZE_ALLOWED, "100 sided die is the max allowed.");
        _;
    }

    modifier validateAdjustment(int128 _adjustment) {
        int128 tempAdjustment = _adjustment >= 0 ? _adjustment : -_adjustment; // convert to positive value and test that.
        require(tempAdjustment <= MAX_ADJUSTMENT_ALLOWED, "Adjustment is too large.");
        _;
    }


    uint256 private _value;
    Auth private _auth;

    event ValueChanged(uint256 value);

    constructor() public {
        _auth = new Auth(msg.sender);
    }

    // The onlyOwner modifier restricts who can call the store function
    function store(uint256 value) public onlyOwner{
        // Require that the caller is registered as an administrator in Auth
        require(_auth.isAdministrator(msg.sender), "Unauthorized");

        _value = value;
        emit ValueChanged(value);
    }

    function retrieve() public view returns (uint256) {
        return _value;
    }

    /// Used to perform specific logic based on if user has rolled previoulsy or not.
    function hasRolledOnce(address _member) public view returns(bool) {
        // return (rollerHistory[_member].length > 0);
        return (getUserRollsCount(_member) > 0);
    }
    /// Used to perform specific logic based on if user has rolled previoulsy or not.
    function hasRolledBefore(address _member) public view returns(bool) {
        return (rollers[_member]);
    }

    /// How many times someone rolled.
    function getUserRollsCount(address _address) public view returns (uint) {
        return rollerHistory[_address].length;
    }

    /**
    * Called by the front end if user wants to use the front end to 
    * generate the random values. We just use this to store the result of the roll on the blockchain.
    *
    * @param _numberOfDie how many dice are rolled
    * @param _dieSize the type of die rolled (4 = 4 sided, 6 = six sided, etc.)
    * @param _adjustment the modifier to add after all die have been rolled. Can be negative.
    * @param _result can be negative if you have a low enough dice roll and larger negative adjustment.
    * Example, rolled 2 4 sided die with -4 adjustment.
    */
    function hasRolled(uint128 _numberOfDie, uint128 _dieSize, int128 _adjustment, int128 _result) 
        public 
        validateNumberOfDie(_numberOfDie)
        validateDieSize(_dieSize)
        validateAdjustment(_adjustment)
    {
        // DiceRollee memory diceRollee = DiceRollee(
        //         msg.sender, 
        //         block.timestamp,
        //         0, 
        //         _numberOfDie, 
        //         _dieSize, 
        //         _adjustment, 
        //         _result, 
        //         true,
        //         new uint8[](_numberOfDie)
        //         );

        DiceRollee memory diceRollee = DiceRollee({
                rollee: msg.sender, 
                timestamp: block.timestamp,
                randomness: 0, 
                numberOfDie: _numberOfDie, 
                dieSize: _dieSize, 
                adjustment: _adjustment, 
                result: _result, 
                hasRolled: 1,
                rolledValues: new uint128[](_numberOfDie)
        });

        // no need to store the current roll, because there is none.
        currentRoll[msg.sender] = diceRollee;
        rollerHistory[msg.sender].push(diceRollee);

        /// Only add roller to this list once.
        // if (! hasRolledOnce(msg.sender)) {
        if (! hasRolledBefore(msg.sender)) {
            rollers[msg.sender] = true;
            rollerAddresses.push(msg.sender);
        }
    }
    
}