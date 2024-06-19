using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace common.model
{
    public class FileResponseModel
    {
        public FileResponseModel()
        {
            Blob = new FileModel();
        }
        public string? Status { get; set; }
        public bool? Error { get; set; }

        public FileModel Blob { get; set; }
    }
}
