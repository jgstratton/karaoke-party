using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using KaraokeParty.ExtensionMethods;
using KaraokeParty.Services;
using Microsoft.AspNetCore.Mvc;

namespace KaraokeParty.Controllers {
	[ApiController]
	public class ApiSingerDelete : ControllerBase {
		private readonly IPartyService partyService;
		private readonly KPContext context;

		public ApiSingerDelete(KPContext context, IPartyService partyService) {
			this.partyService = partyService;
			this.context = context;
		}

		[HttpDelete]
		[Route("party/{partyKey}/singer/{singerId}")]
		public ActionResult<bool> Delete(string partyKey, int singerId) {
			try {
				Party? party = partyService.GetPartyByKey(partyKey);
				if (party == null) {
					return NotFound("404 - Party not found.");
				}
				Singer? singer = context.Singers.Where(s => s.SingerId == singerId).FirstOrDefault();
				if (singer == null) {
					return NotFound("404 - Singer not found.");
				}
				int rotationNumber = singer.RotationNumber;
				context.Performances.RemoveRange(context.Performances.Where(p => p.Singer == singer));
				context.Singers.Remove(singer);
				context.SaveChanges();

				// update the rotation numbers for all singers that come after the delete singer
				party.Singers.OrderBy(s => s.RotationNumber).ToList().Each((s, i) => s.RotationNumber = i + 1);
				context.SaveChanges();
				return true;
			} catch (Exception ex) {
				return BadRequest($"An unexpected error occured: {ex.Message}");
			}
		}
	}
}
