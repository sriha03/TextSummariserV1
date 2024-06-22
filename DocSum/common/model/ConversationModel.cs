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
            Summaries = new SummaryModel();
            Summaries.original_summary = "";
            Summaries.further_summary = "";
            Summaries.parsed_text = "";
        }
        public string id { get; set; }
        public string ConKey { get; set; }
        public List<Dictionary<string, string>> Conv { get; set; }
        public SummaryModel Summaries { get; set; }
        public FileModel Blob { get; set; }

        public void AppendMessage(string role, string content)
        {
            Conv.Add(new Dictionary<string, string> { { "role", role }, { "content", content } });
        }
    }
}