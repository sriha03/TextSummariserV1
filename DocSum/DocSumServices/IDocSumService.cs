using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using common.model;
using iText.Forms.Form.Element;
using Microsoft.AspNetCore.Http;

namespace DocSumServices
{
    public interface IDocSumService
    {
        public Task<FileResponseModel> UploadAsync(IFormFile blob);
        public Task<ConversationModel> NewChat(FileModel blob, SummaryModel summary);
        public Task<ConversationModel> GetConversation(string id);
        public Task<List<ConversationModel>> GetAllConversation();
        public Task<ConversationModel> UpdateConversation(string id, string userPrompt, string botReply);
        public Task<bool> DeleteConversation(string id, string partitionKey);

    }
}
