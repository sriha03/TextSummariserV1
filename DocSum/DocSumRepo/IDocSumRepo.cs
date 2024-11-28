using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using common.model;

namespace DocSumRepository
{
    public interface IDocSumRepo
    {
        public Task<ConversationModel> CreateNewConversation(SummaryModel summaries, FileModel blob);
        public Task<ConversationModel> GetConversation(string id);
        public Task<List<ConversationModel>> GetAllConversation();
        public Task<ConversationModel> UpdateConversation(string id, ConversationModel conversation);
        public Task<bool> DeleteConversation(string id,string partitionKey);
    }

}