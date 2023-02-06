using AspNetCore.Proxy;
using AspNetCore.Proxy.Options;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Controllers {
	[ApiController]
	public class YtDlpProxyController : ControllerBase {
		private string ytdlpConnectionString { get; set; }
		private HttpProxyOptions _httpOptions = HttpProxyOptionsBuilder.Instance
		  .WithShouldAddForwardedHeaders(false).Build();
		
		public YtDlpProxyController(IConfiguration config) {
			ytdlpConnectionString = config.GetSection("YTDLPServiceConnectionString").Value ?? "";
		}

		[Route("yt-dlp/{**rest}")]
		public Task ProxyCatchAll(string rest) {
			var queryString = this.Request.QueryString.Value;
			return this.HttpProxyAsync($"{ytdlpConnectionString}/{rest}{queryString}", _httpOptions);
		}
	}
}
