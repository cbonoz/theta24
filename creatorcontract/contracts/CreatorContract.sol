// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CreatorContract {

    // Struct to represent a video request
    struct Request {
        address requester;
        string name;
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
        Request[] requests;
        bool active;
        uint createdAt;
        bool isValue;
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

    // get owner
    function getContractOwner() public view returns (address) {
        return owner;
    }

    function registerHandle(string memory _handle,
        string memory _creatorName,
        string memory _creatorDescription,
        string memory _initialVideoUrls
    ) public returns (Metadata memory) {
        Metadata memory creator = creatorMap[_handle];
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


        emit HandleCreated(_handle);
        return creatorMap[_handle];
    }

    function makeRequest(string memory _handle, string memory _message) public payable returns (Metadata memory) {
        Metadata memory creator = getMetadataForHandle(_handle);

        address requester = msg.sender;
        uint donation = msg.value;

        // assert that the sender is not the creator
        require(msg.sender != creator.creatorAddress, "Creator cannot request their own video");

        if (donation > 0) {
            address payable creatorAddress = payable(creator.creatorAddress);
            creatorAddress.transfer(donation);
        }

        // add request to creator
        Request memory request = Request({
            requester: requester,
            name: _handle,
            donation: donation,
            createdAt: block.timestamp
        });

        creator.requests = copyAndAppendRequest(creator.requests, request);

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

    function copyAndAppendRequest(Request[] memory requests, Request memory request) private pure returns (Request[] memory) {
        Request[] memory newRequests = new Request[](requests.length + 1);
        for (uint i = 0; i < requests.length; i++) {
            newRequests[i] = requests[i];
        }
        newRequests[requests.length] = request;
        return newRequests;
    }

    // get metadata
    function getMetadataForHandle(string memory _handle) public view returns (Metadata memory) {
        // Verify handle exists
        require(creatorMap[_handle].isValue, "Creator page does not exist");
        return creatorMap[_handle];
    }
}
