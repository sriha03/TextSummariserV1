using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace common.model
{
    public class FileModel
    {
        public string? Uri { get; set; }
        public string? Id { get; set; }

        public string? FileName { get; set; }

        public string? ContentType { get; set; }

        public Stream? Content { get; set; } // Byte array representing the file content
        // Add additional properties as needed, such as URL or path
    }
}
