using AspNetCore.Proxy;
using AspNetCore.Proxy.Options;
using KaraokeParty.Services;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Controllers {
	[ApiController]
	public class YtDlpProxyController : ControllerBase {
		private HttpProxyOptions _httpOptions = HttpProxyOptionsBuilder.Instance
		  .WithShouldAddForwardedHeaders(false).Build();

	  [Route("yt-dlp/{**rest}")]
		public Task ProxyCatchAll(string rest) {
			var queryString = this.Request.QueryString.Value;
			return this.HttpProxyAsync($"http://127.0.0.1:5000/{rest}{queryString}", _httpOptions);
		}
	}
}
