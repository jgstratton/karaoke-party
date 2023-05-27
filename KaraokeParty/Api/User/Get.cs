using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Controllers {
	[ApiController]
	public class ApiUserGet : ControllerBase {
		private readonly KPContext context;

		public ApiUserGet(KPContext context) {
			this.context = context;
		}

		[HttpGet]
		[Route("user/{userId}")]
		public ActionResult<UserDTO> Get(int userId) {
			User? user = context.Users.Find(userId);
			if (user is null) {
				return NotFound();
			}
			return UserDTO.FromDb(user);
		}
	}
}
