using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using KaraokeParty.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using System.Data.SqlClient;
using System.Reflection.Metadata;

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
		public ActionResult<Party> Get(string partyKey) {
			// Load up the whole party at once, because... why not? just get it all working
			Party? party = context.Parties
				.Include(p => p.Singers)
				.Include(p => p.Queue)
					.ThenInclude(q => q.Singer)
				.Include(p => p.Queue)
					.ThenInclude(q => q.Song)
				.Where(p =>
				!p.IsExpired && p.PartyKey == partyKey
			).OrderByDescending(p => p.DateTimeCreated).FirstOrDefault();
			if (party == null) {
				return NotFound();
			}
			return party;
		}

		[HttpGet]
		[Route("{partyKey}/join")]
		public ActionResult<Singer> Join(string partyKey, [FromQuery] SingerDTO singer) {
			Party? party = partyService.GetPartyByKey(partyKey);
			if (party == null) {
				return NotFound();
			}
			Singer newSinger = singer.ToDb();
			party.Singers.Add(newSinger);
			context.SaveChanges();
			return newSinger;
		}

		[HttpPost]
		[Route("{partyKey}/performance")]
		public ActionResult<Performance> PostPerformance(string partyKey, [FromBody] PerformanceDTO dto) {
			if (dto.PerformanceId != null) {
				return BadRequest("Wrong verb, use PUT to update an existing performance");
			}
			Party? party = partyService.GetPartyByKey(partyKey);
			Singer? singer = context.Singers.Find(dto.SingerId);
			Song? song = context.Songs.Find(dto.FileName);

			if (party == null || singer == null || song == null) {
				return NotFound();
			}
			Performance performance = new Performance {
				Party = party,
				Singer = singer,
				Song = song
			};
			context.Performances.Add(performance);
			context.SaveChanges();
			return performance;
		}

		[HttpPost]
		[Route("{partyKey}/performance/{performanceId}/move")]
		public ActionResult MovePerformance(string partyKey, int performanceId, [FromBody] MovePerformanceBody body) {
			Party? party = partyService.GetPartyByKey(partyKey);
			if (party == null) {
				return NotFound();
			}
			int targetRow = body.TargetIndex + 1;
			// increase the order by value of all records after the target index
			context.Database.ExecuteSql($@"
					WITH cte AS (
						SELECT performance_id as id, row_number() OVER (ORDER BY sort_order) as row_num
						FROM performances
						WHERE performances.party_id = {party.PartyId}
							and status = {(int)body.TargetStatus}
							and performance_id != {performanceId}
						UNION
						SELECT performance_id as id, 0 as row_num
						FROM performances
						WHERE performance_id = {performanceId}
					)
					UPDATE performances 
					SET sort_order =
						CASE
							WHEN performance_id = {performanceId} THEN {targetRow}
							WHEN cte.row_num < {targetRow} THEN cte.row_num
							WHEN cte.row_num >= {targetRow} THEN cte.row_num + 1
							ELSE 999
						END,
						status = {(int)body.TargetStatus}
					FROM cte
					WHERE performances.performance_id = cte.id
				"
			);

			return Ok();
		}

		[HttpPut]
		[Route("{partyKey}/performance")]
		public ActionResult<Performance> UpdatePerformance(string partyKey, [FromBody] PerformanceDTO dto) {
			try {
				if (dto.PerformanceId == null) {
					return BadRequest("Wrong verb or missing id, use POST to update an existing performance, or provide a performance id");
				}
				Performance? performance = context.Performances
					.Include(p => p.Party)
					.Include(p => p.Singer)
					.Where(p => p.PerformanceID == dto.PerformanceId).FirstOrDefault();
				if (performance == null) {
					return NotFound($"No performance was found with id {dto.PerformanceId}");
				}
				if (partyKey != performance.Party?.PartyKey) {
					return BadRequest("Performance partyKey mismatch");
				}
				dto.UpdateDb(context, performance);
				context.SaveChanges();
				return performance;
			} catch (Exception ex) {
				return BadRequest($"An unexpected error occured: {ex.Message}");
			}
		}

		[HttpDelete]
		[Route("{partyKey}/performance/{performanceId}")]
		public ActionResult<Performance> DeletePerformance(string partyKey, int performanceId) {
			Performance? performance = context.Performances.Find(performanceId);
			if (performance == null) {
				return NotFound($"No performance was found with id {performanceId}");
			}
			if (partyKey != performance.Party?.PartyKey) {
				return BadRequest("Performance partyKey mismatch");
			}
			context.Performances.Remove(performance);
			context.SaveChanges();
			return performance;
		}

		[HttpPost]
		public Party Post(PartyPost postParty) {
			Party newParty = postParty.ToDb();
			partyService.ApllyDefaultPlayerSettings(newParty);
			context.Parties.Add(newParty);
			context.SaveChanges();
			return newParty;
		}
	}
}
