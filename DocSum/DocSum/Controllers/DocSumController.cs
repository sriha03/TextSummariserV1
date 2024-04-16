using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using DocSumServices;
using sun.swing;
using common.model;
using System.Collections.Generic;
using iTextSharp.text.pdf;
using iTextSharp.text;
using iTextSharp.text.pdf.parser;
using System.Text;

namespace DocSumController.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DocSumController : ControllerBase
    {
        private readonly IDocSumService _docSumService;

        public DocSumController(IDocSumService docSumService)
        {
            _docSumService = docSumService;
        }

        [HttpPost("uploadpdf")]
        public async Task<ConversationModel> uploadDocument(IFormFile file)
        {
            //  if (file == null || file.Length == 0)
            // return BadRequest("No file uploaded");
            using (var memoryStream = new MemoryStream())
            {
                file.CopyTo(memoryStream);
                var fileBytes = memoryStream.ToArray();
                var fileName = file.FileName;

                //  summary =_docSumService.ProcessDocument(fileBytes, fileName);
                var conv = await _docSumService.ProcessDocument(fileBytes, fileName);


                return conv;
            }
            return null;
        }
        [HttpPost("GetConverstion")]
        public async Task<ActionResult<ConversationModel>> GetConversation(string id)
        {
            return await _docSumService.GetConversation(id);
        }
        [HttpPost("UpdateConversation")]
        public async Task<ActionResult<ConversationModel>> UpdateConversation(string id,string userprompt)
        {
            return await _docSumService.UpdateConversation(id, userprompt);
        }
        [HttpPost("ExtractSubtopics")]
        public async Task<IActionResult> ExtractSubtopics(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded");
            }
            MemoryStream memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            byte[] fileBytes = memoryStream.ToArray();

            // Extract subtopics using iTextSharp
            List<string> extractedSubtopics = ExtractSubtopicsFromPdf(fileBytes);

            return Ok(new { subtopics = extractedSubtopics });
        }

        private List<string> ExtractSubtopicsFromPdf(byte[] pdfBytes)
        {
            List<string> extractedSubtopics = new List<string>();
            PdfReader reader = null;

            try
            {
                reader = new PdfReader(pdfBytes);

                for (int i = 1; i <= reader.NumberOfPages; i++)
                {
                    ITextExtractionStrategy strategy = new SimpleTextExtractionStrategy();
                    string pageText = PdfTextExtractor.GetTextFromPage(reader, i, strategy);

                    foreach (string line in pageText.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries))
                    {
                        if (IsPotentialSubtopic(line))
                        {
                            extractedSubtopics.Add(line.Trim());
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error extracting subtopics: {ex.Message}");
            }
            finally
            {
                reader?.Close();
            }

            return extractedSubtopics;
        }

        private static bool IsPotentialSubtopic(string line)
        {
            // Adjust these criteria based on your specific needs
            return line == line.ToUpper() || line.StartsWith("*") || line.StartsWith("-") || line.Count(Char.IsWhiteSpace)  <= 2;
        }

    }
}
