using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Controllers {
	[ApiController]
	[Route("[controller]")]
	public class SingerController : ControllerBase {

		private readonly ILogger<PartyController> _logger;
		private readonly KPContext context;

		public SingerController(ILogger<PartyController> logger) {
			_logger = logger;
			this.context = new KPContext();
		}

		[HttpPost]
		public ActionResult<Singer> Post(SingerDTO singerPost) {
			if (singerPost.SingerId is null) {
				return NotFound();
			}
			Singer? singer = context.Singers.Find(singerPost.SingerId);
			if (singer is null) {
				return NotFound();
			}
			singerPost.UpdateDb(singer);
			context.SaveChanges();
			return singer;
		}
	}
}