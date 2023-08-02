using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Controllers {
	[ApiController]
	[Route("party/{partyKey}/player")]
	public class PlayerController : Controller {
		public PlayerController() { }

		[HttpGet]
		public ActionResult Index([FromRoute] string partyKey) {
			return View("Index", new PlayerModel {
				PartyKey = partyKey
			});
		}

		public class PlayerModel {
			public string PartyKey { get; set; } = "";
		}
	}
}
