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
        [HttpPost("NewChat")]
        public async Task<ActionResult<ConversationModel>> NewChat(IFormFile file, [FromForm] SummaryModel summary)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("No file uploaded");
                var blobResult = await _docSumService.UploadAsync(file);

                var conv = await _docSumService.NewChat(blobResult.Blob, summary);
                return conv;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("GetConverstion")]
        public async Task<ActionResult<ConversationModel>> GetConversation(string id)
        {
            return await _docSumService.GetConversation(id);
        }
        [HttpPost("GetAllConversation")]
        public async Task<ActionResult<List<ConversationModel>>> GetAllConversation()
        {
            return await _docSumService.GetAllConversation();
        }
        [HttpPost("UpdateConversation")]
        public async Task<ActionResult<ConversationModel>> UpdateConversation(string id, string userPrompt, string botReply)
        {
            return await _docSumService.UpdateConversation(id, userPrompt, botReply);
        }

        [HttpPost("DeleteConversation")]
        public async Task<bool> DeleteConversation(string id, string partitionKey);
    }
}