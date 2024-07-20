// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CreatorContract {


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
        Request[] requests;
        bool active;
        uint createdAt;
        bool isValue;
        uint256 requestCount;
        Request lastRequest;
    }

    // owner
    address private owner;
    // metadata
    Metadata private metadata;
    string public network;

    // map from handle to metadata
    mapping(string => Metadata) private creatorMap;
    mapping(string => Request[]) private handleToRequestMap;
    mapping(string => Request) private handleToLastRequest;

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

    function makeRequest(string memory _handle, string memory _message) public payable {
        Metadata storage creator = creatorMap[_handle];
        require(creator.isValue, "A creator page for this handle does not exist");

        address requester = msg.sender;
        uint donation = msg.value;

        // assert that the sender is not the creator
        require(msg.sender != creator.creatorAddress, "Creator cannot request their own video");

        if (donation > 0) {
            payable(creator.creatorAddress).transfer(donation);
        }

        // emit event
        emit VideoRequest(requester, _handle, _message, donation);

        Request[] storage requests = handleToRequestMap[_handle];
        Request memory request = Request(requester, _message, donation, block.timestamp);
        requests.push(request);
        handleToRequestMap[_handle] = requests;
        handleToLastRequest[_handle] = request;
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
        return getMetadataUnchecked(_handle);
    }

    function getMetadataUnchecked(string memory _handle) public view returns (Metadata memory) {
        Metadata memory creator = creatorMap[_handle];
        creator.requests = handleToRequestMap[_handle];
        creator.lastRequest = handleToLastRequest[_handle];
        return creator;
    }

    // get owner
    function getContractOwner() public view returns (address) {
        return owner;
    }
}
