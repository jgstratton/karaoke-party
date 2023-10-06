using Forge.OpenAI.Interfaces.Services;
using Forge.OpenAI.Models.ChatCompletions;
using Forge.OpenAI.Models.Common;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Controllers {
	[ApiController]
	public class ApiGetSongOpenAi : ControllerBase {
		private readonly IOpenAIService openAi;

		public ApiGetSongOpenAi(IOpenAIService openAi) {
			this.openAi = openAi;
		}

		[HttpGet]
		[Route("song/{songTitle}/openai")]
		public async Task<ActionResult<string>> GetFile(string songTitle) {

			ChatCompletionRequest request = new ChatCompletionRequest(
				new List<ChatMessage> {
					new ChatMessage (
						"system",
						@"You will be provided prompts that will contain file names for karaoke songs.
						The name might contain the artist or song name.  The prompt will be given by users
						requesting a song to sing at karaoke.  When given a prompt, you should provide an 
						interesting fact or words of encouragement that are relevant to the karaoke request.
						Keep the responses short. Do not start the response with the words ""Did you know""."
					),
					new ChatMessage (
						"user",
						songTitle
					)
				}
			);

			request.Temperature = 1.5;

			HttpOperationResult<ChatCompletionResponse> response =
				await openAi.ChatCompletionService
					.GetAsync(request, CancellationToken.None)
					.ConfigureAwait(false);

			if (!response.IsSuccess) {
				return BadRequest("Failed to communicate with Open AI API");
			}

			return response.Result!.Choices[0].Message.Content;
		}
	}
}
