// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CreatorContract {
    // Struct to represent a data entry
    struct Metadata {
        string network;
        string handle;
        string creatorName;
        string creatorDescription;
        address creatorAddress;
        string[] requests;
        bool active;
        uint createdAt;
    }

    // owner
    address private owner;
    // metadata
    Metadata private metadata;

    // mapping[string[Metadata]] creatorMap;

    event HandleCreated(string handle);
    event VideoUploaded(address verifier, uint256 video, string signature);
    event VideoRequest(address requester, string name, uint donation);

    constructor(
        string memory _name,
        string memory _description,
    ) {
        // Constructor to initialize the contract
        owner = msg.sender;
    }

    // get owner
    function getContractOwner() public view returns (address) {
        return owner;
    }

    function registerHandle(string memory _handle) {
        Metadata memory creator = creatorMap[_handle]
        require(creator == null, "A creator page for this handle already exists");

        // Require small payment to reduce / eliminate spam of handle creation.

        return creatorMap[_handle];

    }

    function makeRequest(string memory _handle) public returns (Metadata memory) {
        Metadata memory creator = getMetadata(_handle);

        // emit event
        emit VideoUploaded(msg.sender, video, _signature);
        return metadata;
    }

    function makeUpload(string memory _handle, string memory _contentId) public returns (Metadata memory) {
        Metadata memory creator = getMetadata(_handle);

        // assert that the sender is the creator
        require(msg.sender == creator.creatorAddress, "Only the owner of this handle can upload video content")

        // assert 
        // emit event
        emit VideoUploaded(msg.sender, video, _signature);
        return metadata;
    }

    // get metadata
    function getMetadata(string memory _handle) public view returns (Metadata memory) {
        require(creatorMap[_handle], "Creator not found for the provided handle")
        return creatorMap[_handle];
    }
}
