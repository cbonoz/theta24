// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CreatorContract {
    // Struct to represent a data entry
    struct Metadata {
        address owner;
        string network;
        uint createdAt;
        string name;
        string description;
        uint256 video;
        string recipientName;
        address recipientAddress;
        string cid; // optional cid pointer to attachment/s
        uint validatedAt;
        string signature;
    }

    // owner
    address private owner;
    // metadata
    Metadata private metadata;

    // Event to log video listing
    event VideoVerified(address verifier, uint256 video, string signature);

    constructor(
        string memory _name,
        string memory _description,
        uint256 _video,
        string memory _recipientName,
        address _recipientAddress,
        string memory _cid,
        string memory _network
    ) {
        // Constructor to initialize the contract
        owner = msg.sender;
        metadata = Metadata(
            msg.sender,
            _network,
            block.timestamp,
            _name,
            _description,
            _video,
            _recipientName,
            _recipientAddress,
            _cid,
            0,
            ""
        );
    }

    // get owner
    function getOwner() public view returns (address) {
        return owner;
    }

    function validate(string memory _signature) public returns (Metadata memory) {
        // find address
        // get video of sender
        uint256 video = address(msg.sender).video;
        uint256 targetVideo = metadata.video;
        // only the recipient address can validate
        require(
            msg.sender == metadata.recipientAddress,
            "Only the intended recipient can validate their video"
        );
        // require at least video of the metadata
        require(video >= targetVideo, "Video is less than expected");
        // only validate once
        require(metadata.validatedAt == 0, "Video already validated");
        // set validatedAt timestamp
        metadata.validatedAt = block.timestamp;
        metadata.signature = _signature;
        // emit event
        emit VideoVerified(msg.sender, video, _signature);
        return metadata;
    }

    // get metadata
    function getMetadata() public view returns (Metadata memory) {
        return metadata;
    }
}
