using Forge.OpenAI.Interfaces.Infrastructure;
using Forge.OpenAI.Interfaces.Services;
using Forge.OpenAI.Models.ChatCompletions;
using Forge.OpenAI.Models.Common;
using KaraokeParty.Services;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Api.Song {
	[ApiController]
	public class ApiGetSongOpenAi : ControllerBase {
		private readonly AppLoggerService logger;
		private readonly IOpenAIService openAi;

		public ApiGetSongOpenAi(AppLoggerService logger, IOpenAIService openAi) {
			this.logger = logger;
			this.openAi = openAi;
		}

		[HttpGet]
		[Route("song/{songTitle}/openai-stream")]
		public async Task<ActionResult> StreamPrompt(string songTitle) {

			try {
				ChatCompletionRequest request = new ChatCompletionRequest(
					new List<ChatMessage> {
						new ChatMessage (
							"system",
							@"You will be provided prompt of karaoke songs might contain the artist or song name.
							The prompt will be given by users requesting a song to sing at karaoke. When given a prompt,
							you should provide a short interesting fact or words of encouragement that are relevant to the
							karaoke request."
						),
						new ChatMessage (
							"user",
							songTitle
						)
					}
				);

				request.Temperature = 0.9;
				request.Stream = true;

				Response.ContentType = "text/plain";
				StreamWriter sw;
				await using ((sw = new StreamWriter(Response.Body)).ConfigureAwait(false)) {
					await foreach (HttpOperationResult<IAsyncEventInfo<ChatCompletionStreamedResponse>> response in openAi.ChatCompletionService.GetStreamAsync(request, CancellationToken.None)) {
						if (response.IsSuccess) {
							await sw.WriteAsync(response.Result!.Data.Choices[0].Delta.Content).ConfigureAwait(false);
							await sw.FlushAsync().ConfigureAwait(false);
						}
					}
				}
				return new EmptyResult();

			} catch (Exception ex) {
				logger.LogError("Error in openai-stream endpoing", ex);
				return new EmptyResult();
			}
		}
	}
}
