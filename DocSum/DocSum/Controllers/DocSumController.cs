using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using DocSumServices;
using sun.swing;
using common.model;

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
    }
}
