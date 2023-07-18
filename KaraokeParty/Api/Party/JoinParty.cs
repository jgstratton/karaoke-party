using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using KaraokeParty.Services;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Controllers {
	[ApiController]
	public class ApiJoinParety : ControllerBase {
		private readonly IPartyService partyService;
		private readonly KPContext context;

		public ApiJoinParety(KPContext context, IPartyService partyService) {
			this.partyService = partyService;
			this.context = context;
		}

		[HttpGet]
		[Route("party/{partyKey}/join")]
		public ActionResult<UserDTO> Join(string partyKey, [FromQuery] UserDTO singer) {
			Party? party = partyService.GetPartyByKey(partyKey);
			if (party == null) {
				Party? djParty = partyService.GetPartyByDjKey(partyKey);
				if (djParty == null) {
					return NotFound();
				}
				User newDjUser = singer.ToDb();
				newDjUser.IsDj = true;
				context.Users.Add(newDjUser);
				context.SaveChanges();
				return UserDTO.FromDb(newDjUser);
			}
			User newUser = singer.ToDb();
			context.Users.Add(newUser);
			context.SaveChanges();
			return UserDTO.FromDb(newUser);
		}
	}
}
