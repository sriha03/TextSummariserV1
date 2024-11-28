using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Azure;

namespace common.model
{
    public class ConversationModel
    {
        public ConversationModel()
        {
            Blob = new FileModel();
            Summaries = new SummaryModel
            {
                original_summary = "",
                further_summary = "",
                parsed_text = ""
            };
            Conv = new List<ConvModel>();
            LastUpdated = DateTime.UtcNow;
        }
        public string id { get; set; }
        public string ConKey { get; set; }
        public List<ConvModel> Conv { get; set; }
        public SummaryModel Summaries { get; set; }
        public FileModel Blob { get; set; }
        public DateTime LastUpdated { get; set; }
        public void AppendMessage(string role, string content)
        {
            Conv.Add(new ConvModel
            {
                id = (Conv.Count + 1).ToString(),
                role = role,
                content = content
            });
        }
    }
    public class ConvModel
    {
        public string id { get; set; }
        public string role { get; set; }
        public string content { get; set; }
    }
}