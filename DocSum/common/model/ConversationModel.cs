﻿using System;
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
        }
        public string id { get; set; }
        public string ConKey { get; set; }
        public string Conv { get; set; }
        public List<string> Summaries { get; set; }
        public FileModel Blob { get; set; }
    }
}
