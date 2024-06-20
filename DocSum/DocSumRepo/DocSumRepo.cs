using com.sun.jndi.dns;
using common.model;
using Microsoft.Azure.Cosmos;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration.Internal;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DocSumRepository
{
    public class DocSumRepo : IDocSumRepo
    {
        private readonly CosmosClient _cosmosClient;
        private const string DatabaseId = "DocSum";
        private const string ContainerId = "Conversation";

        public DocSumRepo(CosmosClient cosmosClient)
        {
            _cosmosClient = cosmosClient;
        }
        public async Task<ConversationModel> CreateNewConversation(SummaryModel summaries, FileModel blob)
        {
            var container = _cosmosClient.GetContainer(DatabaseId, ContainerId);

            var conversation = new ConversationModel
            {
                id = Guid.NewGuid().ToString(),
                ConKey = Guid.NewGuid().ToString(),
                Summaries = summaries,
                Conv = "",
                Blob = blob
            };

            var response = await container.CreateItemAsync(conversation);
            return conversation;
        }
        public async Task<ConversationModel> GetConversation(string id)
        {
            var container = _cosmosClient.GetContainer(DatabaseId, ContainerId);

            var query = "SELECT * FROM c WHERE c.id = @Id";
            var queryDefinition = new QueryDefinition(query).WithParameter("@Id", id);
            try
            {
                var resultSetIterator = container.GetItemQueryIterator<ConversationModel>(queryDefinition);
                if (resultSetIterator.HasMoreResults)
                {
                    var response = await resultSetIterator.ReadNextAsync();
                    var currentComm = response.FirstOrDefault();
                    if (currentComm != null)
                    {
                        return new ConversationModel
                        {
                            id = currentComm.id,
                            ConKey = currentComm.ConKey,
                            Summaries = currentComm.Summaries,
                            Conv = currentComm.Conv,
                            Blob = currentComm.Blob
                        };
                    }
                }
            }
            catch (Exception ex)
            {
                // Handle exception
                Console.WriteLine($"An error occurred: {ex.Message}");
            }

            return null; // or throw an exception if required
        }
        public async Task<List<ConversationModel>> GetAllConversation()
        {
            var container = _cosmosClient.GetContainer(DatabaseId, ContainerId);

            var query = "SELECT * FROM c";
            var queryDefinition = new QueryDefinition(query);
            var conversations = new List<ConversationModel>();

            var resultSetIterator = container.GetItemQueryIterator<ConversationModel>(queryDefinition);

            while (resultSetIterator.HasMoreResults)
            {
                var currentResultSet = await resultSetIterator.ReadNextAsync();
                conversations.AddRange(currentResultSet);
            }

            return conversations;
        }

        public async Task<ConversationModel> UpdateConversation(string id, ConversationModel conversation)
        {
            var container = _cosmosClient.GetContainer(DatabaseId, ContainerId);
            try
            {
                var ConKey = conversation.ConKey;
                var response = await container.ReplaceItemAsync(conversation, id, new PartitionKey(ConKey));

                return conversation;
            }
            catch (Exception ex)
            {
                conversation.id = ex.Message;
                conversation.Conv = ex.StackTrace;
                return conversation;
            }
        }

    }

}