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
	}

	public interface ISingerService {
		void MoveSingerInRotation(Party party, Singer singer, int newRotationNumber);
	}
}
