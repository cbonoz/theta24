// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CreatorContract {


    // Struct to represent a video request
    uint256 constant MAX_REQUESTS = 10;

    struct Request {
        address requester;
        string message;
        uint donation;
        uint createdAt;
    }

    // Struct to represent a data entry
    struct Metadata {
        string handle;
        string creatorName;
        string creatorDescription;
        string initialVideoUrls;
        address creatorAddress;
        Request[MAX_REQUESTS] requests;
        bool active;
        uint createdAt;
        bool isValue;
        uint256 requestCount;
        uint256 oldestRequestIndex;
    }

    // owner
    address private owner;
    // metadata
    Metadata private metadata;
    string public network;

    // map from handle to metadata
    mapping(string => Metadata) private creatorMap;

    event HandleCreated(string handle);
    event VideoUploaded(address verifier, string video, string description);
    event VideoRequest(address requester, string name, string message, uint donation);

    constructor(string memory _network) {
        owner = msg.sender;
        network = _network;
    }

    function registerHandle(string memory _handle,
        string memory _creatorName,
        string memory _creatorDescription,
        string memory _initialVideoUrls
    ) public returns (Metadata memory) {
        Metadata storage creator = creatorMap[_handle];
        require(!creator.isValue, "A creator page for this handle already exists");

        // set values
        creator.handle = _handle;
        creator.creatorName = _creatorName;
        creator.creatorDescription = _creatorDescription;
        creator.initialVideoUrls = _initialVideoUrls;
        creator.creatorAddress = msg.sender;
        creator.active = true;
        creator.createdAt = block.timestamp;
        creator.isValue = true;

        creatorMap[_handle] = creator;

        emit HandleCreated(_handle);
        return creatorMap[_handle];
    }

    function makeRequest(string memory _handle, string memory _message) public payable returns (Metadata memory) {
        Metadata storage creator = creatorMap[_handle];
        require(!creator.isValue, "A creator page for this handle already exists");

        address requester = msg.sender;
        uint donation = msg.value;

        // assert that the sender is not the creator
        require(msg.sender != creator.creatorAddress, "Creator cannot request their own video");

        if (donation > 0) {
            address payable creatorAddress = payable(creator.creatorAddress);
            creatorAddress.transfer(donation);
        }
        
        Request memory request = Request({
            requester: requester,
            message: _message,
            donation: donation,
            createdAt: block.timestamp
        });
       // Add the request at the oldest request index
        creator.requests[creator.oldestRequestIndex] = request;

        // Update the oldest request index
        creator.oldestRequestIndex = (creator.oldestRequestIndex + 1) % MAX_REQUESTS;

        // If the request count is less than MAX_REQUESTS, increment it
        if (creator.requestCount < MAX_REQUESTS) {
            creator.requestCount++;
        }

        creatorMap[_handle] = creator;

        // emit event
        emit VideoRequest(requester, _handle, _message, donation);
        return metadata;
    }

    function makeUpload(string memory _handle, string memory _contentId, string memory _description) public returns (Metadata memory) {
        Metadata memory creator = getMetadataForHandle(_handle);

        // assert that the sender is the creator
        require(msg.sender == creator.creatorAddress, "Only the owner of this handle can upload video content");

        // emit event
        emit VideoUploaded(msg.sender, _contentId, _description);
        return metadata;
    }

    // get metadata
    function getMetadataForHandle(string memory _handle) public view returns (Metadata memory) {
        // Verify handle exists
        require(creatorMap[_handle].isValue, "Creator page does not exist");
        return creatorMap[_handle];
    }

    function getMetadataUnchecked(string memory _handle) public view returns (Metadata memory) {
        return creatorMap[_handle];
    }

    // get owner
    function getContractOwner() public view returns (address) {
        return owner;
    }
}
