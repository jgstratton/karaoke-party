using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using KaraokeParty.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace KaraokeParty.Controllers {
	[ApiController]
	[Route("[controller]")]
	public class PartyController : ControllerBase {
		private readonly IPartyService partyService;
		private readonly ILogger<PartyController> _logger;
		private readonly KPContext context;

		public PartyController(IPartyService partyService, ILogger<PartyController> logger, KPContext context) {
			this.partyService = partyService;
			_logger = logger;
			this.context = context;
		}

		[HttpGet]
		public ActionResult<PartyDTO> Get(string partyKey) {
			Party? party = context.Parties.Where(p =>
				!p.IsExpired && p.PartyKey == partyKey
			).OrderByDescending(p => p.DateTimeCreated).FirstOrDefault();

			if (party == null) {
				return NotFound();
			}
			return PartyDTO.FromDb(party);
		}

		[HttpGet]
		[Route("{partyKey}/join")]
		public ActionResult<UserDTO> Join(string partyKey, [FromQuery] UserDTO singer) {
			Party? party = partyService.GetPartyByKey(partyKey);
			if (party == null) {
				return NotFound();
			}
			User newUser = singer.ToDb();
			context.Users.Add(newUser);
			context.SaveChanges();
			return UserDTO.FromDb(newUser);
		}

		[HttpPost]
		[Route("{partyKey}/performance")]
		public ActionResult<PerformanceDTO> PostPerformance(string partyKey, [FromBody] PerformanceRequestDTO dto) {
			Party? party = partyService.GetPartyByKey(partyKey);
			User? user = context.Users.Find(dto.UserId);
			Song? song = context.Songs.Find(dto.FileName);
			Singer? singer = context.Singers.Find(dto.SingerId);

			if (party == null || user == null || song == null) {
				return NotFound();
			}
			Performance performance = new Performance {
				Party = party,
				User = user,
				Song = song,
				SingerName = dto.SingerName
			};

			if (singer is null && dto.CreateNewSinger) {
				bool singerNameIsOk = context.Singers
					.Where(s => s.Name.ToUpper() == dto.SingerName.ToUpper() && s.Party != null && s.Party.PartyKey == partyKey)
					.Count() == 0;
				if (!singerNameIsOk) {
					return BadRequest("The singer name is already used by another singer in this party");
				}
				singer = new Singer {
					Name = dto.SingerName,
					RotationNumber = party.Singers.Select(s => s.RotationNumber).DefaultIfEmpty(0).Max() + 1,
					Party = party
				};
				context.Singers.Add(singer);
			}

			if (singer != null) {
				performance.Singer = singer;
				performance.Status = PerformanceStatus.Queued;
				int? lastSongNumber = party.Queue
					.Where(p => p.Singer != null && p.Singer.SingerId == singer.SingerId)
					.Max(p => p.SortOrder);
				performance.SortOrder = lastSongNumber is null ? 1 : lastSongNumber + 1;
			}
			context.Performances.Add(performance);
			context.SaveChanges();
			return PerformanceDTO.FromDb(performance);
		}

		[HttpPut]
		[Route("{partyKey}/performance")]
		public ActionResult<PerformanceDTO> UpdatePerformance(string partyKey, [FromBody] PerformanceDTO dto) {
			try {
				if (dto.PerformanceId == null) {
					return BadRequest("Wrong verb or missing id, use POST to update an existing performance, or provide a performance id");
				}
				Performance? performance = context.Performances
					.Include(p => p.Party)
					.Include(p => p.User)
					.Where(p => p.PerformanceID == dto.PerformanceId).FirstOrDefault();
				if (performance == null) {
					return NotFound($"No performance was found with id {dto.PerformanceId}");
				}
				if (partyKey != performance.Party?.PartyKey) {
					return BadRequest("Performance partyKey mismatch");
				}
				dto.UpdateDb(context, performance);
				context.SaveChanges();
				return PerformanceDTO.FromDb(performance);
			} catch (Exception ex) {
				return BadRequest($"An unexpected error occured: {ex.Message}");
			}
		}

		[HttpDelete]
		[Route("{partyKey}/performance/{PerformanceId}")]
		public ActionResult<bool> DeletePerformance(string partyKey, int performanceId) {
			Performance? performance = context.Performances.Find(performanceId);
			if (performance == null) {
				return NotFound($"No performance was found with id {performanceId}");
			}
			if (partyKey != performance.Party?.PartyKey) {
				return BadRequest("Performance partyKey mismatch");
			}
			context.Performances.Remove(performance);
			context.SaveChanges();
			return true;
		}

		[HttpPost]
		public CreatePartyResponse Post(CreatePartyPost postParty) {
			Party newParty = new Party {
				Title = postParty.Title,
				PartyKey = KeyGenerator.CreateAlphaKey(4),
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
	}
}
