using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Controllers {
	[ApiController]
	[Route("[controller]")]
	public class SingerController : ControllerBase {

		private readonly ILogger<PartyController> _logger;
		private readonly KPContext context;

		public SingerController(ILogger<PartyController> logger, KPContext context) {
			_logger = logger;
			this.context = context;
		}

		[HttpGet]
		public ActionResult<User> Get(int singerId) {
			User? singer = context.Users.Find(singerId);
			if (singer is null) {
				return NotFound();
			}
			return singer;
		}

		[HttpPost]
		public ActionResult<User> Post(UserDTO singerPost) {
			if (singerPost.UserId is null) {
				return NotFound();
			}
			User? singer = context.Users.Find(singerPost.UserId);
			if (singer is null) {
				return NotFound();
			}
			singerPost.UpdateDb(singer);
			context.SaveChanges();
			return singer;
		}
	}
}