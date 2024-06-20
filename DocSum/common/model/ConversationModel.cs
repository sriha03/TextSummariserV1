using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        }
        public string id { get; set; }
        public string ConKey { get; set; }
        public string Conv { get; set; }
        public SummaryModel Summaries { get; set; }
        public FileModel Blob { get; set; }
    }
}