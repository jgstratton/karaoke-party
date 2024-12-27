using KaraokeParty.DataStore;

namespace KaraokeParty.Services {
	public class SingerService : ISingerService {

		public SingerService() { }

		public void MoveSingerInRotation(Party party, Singer singer, int newRotationNumber) {
			List<Singer> otherSingers = party.Singers.Where(s => s.SingerId != singer.SingerId).OrderBy(s => s.RotationNumber).ToList();
			for (var i = 0; i < otherSingers.Count; i++) {
				int curRotation = i + 1;
				var otherSinger = otherSingers[i];
				otherSinger.RotationNumber = (curRotation < newRotationNumber) ? curRotation : curRotation + 1;
			}
			singer.RotationNumber = newRotationNumber;
		}

		/// <summary>
		/// Call this before adding a request to an existing singer.  If the new request would result in an interruption
		/// of the "Upcoming Singers" list, then it will return the new position the user needs to be moved to instead
		/// (right after the upcoming rotation.
		/// </summary>
		public (bool shouldMove, int? newPosition) AutoMoveSinger(Party party, Singer singer) {
			if (!party.AutoMoveSingerEnabled) {
				return (false, null);
			}
			var singerPerformances = party.Queue.Where(p =>
				p.Singer is not null &&
				p.Singer.SingerId == singer.SingerId
			).ToList();

			var upcomingStatusList = new List<PerformanceStatus> { PerformanceStatus.Live, PerformanceStatus.Queued };

			// this only applies to existing singers. If they have no requests then do nothing
			if (singerPerformances.Count == 0) {
				return (false, null);
			}

			// If singer is up or already has an active request, no need to move them, they can keep their spot
			if (singerPerformances.Where(p => upcomingStatusList.Contains(p.Status)).Any()) {
				return (false, null);
			}

			var allUpcomingPerformances = party.Queue
				.Where(p =>
					upcomingStatusList.Contains(p.Status) &&
					p.Singer != null &&
					!p.Singer.IsPaused
				)
				.Select(p => new {
					singer = p.Singer,
					status = p.Status,
				})
				.ToList();

			var currentSinger = allUpcomingPerformances
				.Where(p => p.status == PerformanceStatus.Live)
				.Select(p => p.singer)
				.FirstOrDefault();

			// if for some reason we don't know who is up, then just quit.  There's nothing more we can do.
			if (currentSinger == null) {
				return (false, null);
			}

			// get all upcoming singers and add the target singer in 
			var allUpcomingSingers = allUpcomingPerformances
				.Select(p => p.singer!)
				.Distinct()
				.Union(new List<Singer> { singer })
				.OrderBy(s => s.RotationNumber)
				.ToList();

			var tempQueue = new Queue<Singer>();
			var normalizedSingerList = new List<Singer>();
			var foundCurrent = false;

			allUpcomingSingers.ForEach(singer => {
				if (!foundCurrent && singer.SingerId == currentSinger.SingerId) {
					foundCurrent = true;
					return; // don't add the current singer to the stack
				}
				if (foundCurrent) {
					normalizedSingerList.Add(singer);
					return;
				}

				tempQueue.Enqueue(singer);
			});

			while (tempQueue.Count > 0) {
				normalizedSingerList.Add(tempQueue.Dequeue());
			}

			// at this point the normalized list should be in rotation order starting with the next upcoming singer
			// and include the new singer in position.  We only need to check where they ended up in the list to see if they need to move
			var upcomingCount = party.SplashScreenUpcomingCount;
			var singerIndex = -1;

			// find the singer's index
			for (var i = 0; i < normalizedSingerList.Count; i++) {
				if (normalizedSingerList[i].SingerId == singer.SingerId) {
					singerIndex = i;
					break;
				}
			}

			if (singerIndex >= upcomingCount) {
				return (false, null);
			}

			// move the user to right after the last upcoming singer
			var lastUpcomingSinger = normalizedSingerList.Count > upcomingCount ? normalizedSingerList[upcomingCount] : normalizedSingerList.Last();

			return (
				true,
				lastUpcomingSinger.RotationNumber + (lastUpcomingSinger.RotationNumber < currentSinger.RotationNumber && singer.RotationNumber > lastUpcomingSinger.RotationNumber ? 1 : 0)
			);
		}
	}

	public interface ISingerService {
		(bool shouldMove, int? newPosition) AutoMoveSinger(Party party, Singer singer);
		void MoveSingerInRotation(Party party, Singer singer, int newRotationNumber);
	}
}
