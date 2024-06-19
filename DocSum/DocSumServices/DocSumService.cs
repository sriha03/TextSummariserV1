﻿using Azure;
using Azure.Storage.Blobs;
using DocSumRepository;
using common.model;
using Azure.AI.TextAnalytics;
using Microsoft.AspNetCore.Http;
using System;
using Azure.Storage;
using iText.Forms.Form.Element;


namespace DocSumServices
{
    public class DocSumService : IDocSumService
    {
        private readonly IDocSumRepo _docSumRepo;
        private readonly string _storageAccount = "";
        private readonly string _accesskey = "";
        private readonly BlobContainerClient _filesContainer;

        public DocSumService(IDocSumRepo docSumRepo)
        {
            _docSumRepo = docSumRepo;
            var credential = new StorageSharedKeyCredential(_storageAccount, _accesskey);
            var blobUri = $"https://{_storageAccount}.blob.core.windows.net";
            var blobServiceClient = new BlobServiceClient(new Uri(blobUri), credential);
            _filesContainer = blobServiceClient.GetBlobContainerClient("files");

        }
        public async Task<FileResponseModel> UploadAsync(IFormFile blob)
        {
            try
            {

                FileResponseModel response = new();
                var FileId = Guid.NewGuid().ToString() + Path.GetExtension(blob.FileName);
                BlobClient client = _filesContainer.GetBlobClient(FileId);
                await using (Stream? data = blob.OpenReadStream())
                {
                    await client.UploadAsync(data);
                }
                response.Status = $"File {blob.FileName} uploaded succesfully";
                response.Error = false;
                response.Blob.Uri = client.Uri.AbsoluteUri;
                response.Blob.Id = FileId;
                response.Blob.FileName = blob.FileName;
                response.Blob.ContentType = blob.ContentType;
                return response;
            }
            catch (Exception e)
            {
                return new FileResponseModel
                {
                    Status = e.Message,
                    Error = true
                };
            }
        }
        public async Task<ConversationModel> NewChat(FileModel blob)
        {
            return await _docSumRepo.CreateNewConversation(new List<string>(), blob);
        }


        public async Task<ConversationModel> GetConversation(string id)
        {
            return await _docSumRepo.GetConversation(id);
        }
        public async Task<List<ConversationModel>> GetAllConversation()
        {
            return await _docSumRepo.GetAllConversation();
        }

        public async Task<ConversationModel> UpdateConversation(string id, string userPrompt, string botReply)
        {
            ConversationModel conversation = await _docSumRepo.GetConversation(id);
            conversation.Conv += $"UserPrompt: {userPrompt};BotReply: {botReply};";
            await _docSumRepo.UpdateConversation(id, conversation);
            return conversation;
        }
    }
}
