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
        public Task<ConversationModel> CreateNewConversation(List<string> summaries, FileModel blob);
        public Task<ConversationModel> GetConversation(string id);
        public Task<List<ConversationModel>> GetAllConversation();
        public Task<ConversationModel> UpdateConversation(string id, ConversationModel conversation);
    }

}
