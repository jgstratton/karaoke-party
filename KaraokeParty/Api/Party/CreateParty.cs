using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using KaraokeParty.Services;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Controllers {
	[ApiController]
	public class ApiCreateParty : ControllerBase {
		private readonly IPartyService partyService;
		private readonly ISingerService singerService;
		private readonly KPContext context;

		public ApiCreateParty(KPContext context, IPartyService partyService, ISingerService singerService) {
			this.partyService = partyService;
			this.singerService = singerService;
			this.context = context;
		}

		[HttpPost]
		[Route("party")]
		[HttpPost]
		public ActionResult<CreatePartyResponse> Post(CreatePartyPost postParty) {
			if (string.IsNullOrEmpty(postParty.Title)) {
				return BadRequest("You need to give your party a name");
			}

			if (string.IsNullOrEmpty(postParty.DJName)) {
				return BadRequest("You need to provide a DJ name");
			}

			if (string.IsNullOrEmpty(postParty.Password)) {
				return BadRequest("You must provide a DJ password to create a new party");
			}

			if (context.Djs.Where(d => d.Password == postParty.Password).Count() == 0) {
				return BadRequest("The provided password was invalid.");
			}

			Party newParty = new Party {
				Title = postParty.Title,
				PartyKey = KeyGenerator.CreateAlphaKey(4),
				DjKey = KeyGenerator.CreateAlphaKey(5)
			};

			User newUser = new User {
				Name = postParty.DJName,
				IsDj = true
			};

			partyService.ApllyDefaultPlayerSettings(newParty);
			context.Parties.Add(newParty);
			context.Users.Add(newUser);
			context.SaveChanges();

			return new CreatePartyResponse {
				Party = PartyDTO.FromDb(newParty),
				Dj = UserDTO.FromDb(newUser)
			};
		}

		public class CreatePartyPost {
			public string Title { get; set; } = "";
			public string DJName { get; set; } = "";
			public string Password { get; set; } = "";
		}

		public class CreatePartyResponse {
			public PartyDTO Party { get; set; }
			public UserDTO Dj { get; set; }

			public CreatePartyResponse() {
				Party = new PartyDTO();
				Dj = new UserDTO();
			}
		}
	}
}
