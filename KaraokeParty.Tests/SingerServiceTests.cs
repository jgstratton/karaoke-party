using KaraokeParty.DataStore;
using KaraokeParty.Services;

namespace KaraokeParty.Tests {

	[TestFixture]
	public class SingerServiceTests {

		private SingerService _singerService;

		// create a test singer
		private Singer _singer(int rotationNumber) {
			return new Singer {
				SingerId = rotationNumber,
				RotationNumber = rotationNumber
			};
		}

		// create a test performance
		private Performance _performance(Singer singer, PerformanceStatus status) {
			return new Performance {
				Singer = singer,
				Status = status
			};
		}

		[SetUp]
		public void Setup() {
			_singerService = new SingerService();
		}

		[Test]
		public void AutoMoveSingerTest_DontMoveLiveSinger() {
			Singer singer = _singer(5);

			Party party = new Party {
				Queue = new List<Performance> {
					_performance(singer, PerformanceStatus.Live)
				}
			};

			var moveResult = _singerService.AutoMoveSinger(party, singer);
			Assert.IsFalse(moveResult.shouldMove);
		}

		[Test]
		public void AutoMoveSingerTest_DontQueuedSingers() {
			Singer singer = _singer(5);

			Party party = new Party {
				Queue = new List<Performance> {
					_performance(_singer(4), PerformanceStatus.Live),
					_performance(singer, PerformanceStatus.Queued),
					_performance(_singer(6), PerformanceStatus.Queued)
				}
			};

			var moveResult = _singerService.AutoMoveSinger(party, singer);
			Assert.IsFalse(moveResult.shouldMove);
		}

		[Test]
		public void AutoMoveSingerTest_DontMoveMissingLive() {
			Singer singer = _singer(5);

			Party party = new Party {
				Queue = new List<Performance> {
					_performance(_singer(4), PerformanceStatus.Queued),
					_performance(singer, PerformanceStatus.Queued),
					_performance(_singer(6), PerformanceStatus.Queued)
				}
			};

			var moveResult = _singerService.AutoMoveSinger(party, singer);
			Assert.IsFalse(moveResult.shouldMove);
		}

		[Test]
		public void AutoMoveSingerTest_DontMoveIfOutside_Before() {
			Singer singer = _singer(13);

			Party party = new Party {
				SplashScreenUpcomingCount = 3,
				Queue = new List<Performance> {
					_performance(_singer(4), PerformanceStatus.Queued),
					_performance(_singer(12), PerformanceStatus.Queued),
					//_singer(13)
					_performance(_singer(15), PerformanceStatus.Live),
					_performance(_singer(17), PerformanceStatus.Queued)
				}
			};

			var moveResult = _singerService.AutoMoveSinger(party, singer);
			Assert.IsFalse(moveResult.shouldMove);
		}

		[Test]
		public void AutoMoveSingerTest_MoveIfInside_Before() {
			Singer singer = _singer(10);

			Party party = new Party {
				SplashScreenUpcomingCount = 3,
				Queue = new List<Performance> {
					_performance(_singer(4), PerformanceStatus.Queued),
					// _singer(10)
					_performance(_singer(12), PerformanceStatus.Queued),
					_performance(_singer(15), PerformanceStatus.Live),
					_performance(_singer(17), PerformanceStatus.Queued)
				}
			};

			var (shouldMove, rotationNumber) = _singerService.AutoMoveSinger(party, singer);
			Assert.IsTrue(shouldMove);
			Assert.That(rotationNumber, Is.EqualTo(13));
		}

		[Test]
		public void AutoMoveSingerTest_MoveIfInside_Small() {
			Singer singer = _singer(5);

			Party party = new Party {
				SplashScreenUpcomingCount = 3,
				Queue = new List<Performance> {
					_performance(_singer(4), PerformanceStatus.Live),
					// _singer(5)
					_performance(_singer(6), PerformanceStatus.Queued)
				}
			};

			var (shouldMove, rotationNumber) = _singerService.AutoMoveSinger(party, singer);
			Assert.IsTrue(shouldMove);
			Assert.That(rotationNumber, Is.EqualTo(7));
		}

		[Test]
		public void AutoMoveSingerTest_DontMove_Outside_Last() {
			Singer singer = _singer(10);

			Party party = new Party {
				SplashScreenUpcomingCount = 3,
				Queue = new List<Performance> {
					_performance(_singer(4), PerformanceStatus.Live),
					_performance(_singer(6), PerformanceStatus.Queued),
					_performance(_singer(8), PerformanceStatus.Queued),
					_performance(_singer(9), PerformanceStatus.Queued)
					// _singer(10)
					
				}
			};
			var (shouldMove, _) = _singerService.AutoMoveSinger(party, singer);
			Assert.IsFalse(shouldMove);
		}

		[Test]
		public void AutoMoveSingerTest_Move_IgnoreOtherStatuses() {
			Singer singer = _singer(11);

			Party party = new Party {
				SplashScreenUpcomingCount = 3,
				Queue = new List<Performance> {
					_performance(_singer(4), PerformanceStatus.Live),
					_performance(_singer(6), PerformanceStatus.Queued),
					_performance(_singer(8), PerformanceStatus.Requested),
					_performance(_singer(9), PerformanceStatus.Requested),
					_performance(_singer(10), PerformanceStatus.Completed),
					// _singer(11)
					_performance(_singer(12), PerformanceStatus.Queued),

				}
			};
			var (shouldMove, rotationNumber) = _singerService.AutoMoveSinger(party, singer);
			Assert.IsTrue(shouldMove);
			Assert.That(rotationNumber, Is.EqualTo(13));
		}

		[Test]
		public void AutoMoveSingerTest_Move_LargeUpcoming() {
			Singer singer = _singer(11);

			Party party = new Party {
				SplashScreenUpcomingCount = 20,
				Queue = new List<Performance> {
					_performance(_singer(4), PerformanceStatus.Queued),
					_performance(_singer(6), PerformanceStatus.Live),
					_performance(_singer(8), PerformanceStatus.Queued),
					_performance(_singer(9), PerformanceStatus.Queued),
					_performance(_singer(10), PerformanceStatus.Queued),
					// _singer(11)
					_performance(_singer(12), PerformanceStatus.Queued),

				}
			};
			var (shouldMove, rotationNumber) = _singerService.AutoMoveSinger(party, singer);
			Assert.IsTrue(shouldMove);
			Assert.That(rotationNumber, Is.EqualTo(5));
		}

		[Test]
		public void AutoMoveSingerTest_Move_LargeTest2() {
			Singer singer = _singer(15);

			Party party = new Party {
				SplashScreenUpcomingCount = 5,
				Queue = new List<Performance> {
					_performance(_singer(4), PerformanceStatus.Queued),
					_performance(_singer(6), PerformanceStatus.Requested),
					_performance(_singer(8), PerformanceStatus.Live),
					_performance(_singer(9), PerformanceStatus.Queued),
					_performance(_singer(10), PerformanceStatus.Queued),
					_performance(_singer(12), PerformanceStatus.Requested),
					_performance(_singer(13), PerformanceStatus.Completed),
					_performance(_singer(14), PerformanceStatus.Queued),
					// _singer(15)
					_performance(_singer(16), PerformanceStatus.Queued),
					_performance(_singer(17), PerformanceStatus.Completed),
					_performance(_singer(22), PerformanceStatus.Queued),
					_performance(_singer(25), PerformanceStatus.Queued),
					_performance(_singer(31), PerformanceStatus.Completed),
					_performance(_singer(34), PerformanceStatus.Queued),
				}
			};
			var (shouldMove, rotationNumber) = _singerService.AutoMoveSinger(party, singer);
			Assert.IsTrue(shouldMove);
			Assert.That(rotationNumber, Is.EqualTo(23));
		}
	}
}