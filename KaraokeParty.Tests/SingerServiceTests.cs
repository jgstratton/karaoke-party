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
		public void AutoMoveSingerTest_DontMove_LiveSinger() {
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
		public void AutoMoveSingerTest_DontMove_QueuedSingers() {
			Singer singer = _singer(2);

			Party party = new Party {
				Queue = new List<Performance> {
					_performance(_singer(1), PerformanceStatus.Live),
					_performance(singer, PerformanceStatus.Queued),
					_performance(_singer(3), PerformanceStatus.Queued)
				}
			};

			var moveResult = _singerService.AutoMoveSinger(party, singer);
			Assert.IsFalse(moveResult.shouldMove);
		}

		[Test]
		public void AutoMoveSingerTest_DontMove_MissingLive() {
			Singer singer = _singer(2);

			Party party = new Party {
				Queue = new List<Performance> {
					_performance(_singer(1), PerformanceStatus.Queued),
					_performance(singer, PerformanceStatus.Queued),
					_performance(_singer(3), PerformanceStatus.Queued)
				}
			};

			var moveResult = _singerService.AutoMoveSinger(party, singer);
			Assert.IsFalse(moveResult.shouldMove);
		}

		[Test]
		public void AutoMoveSingerTest_DontMove_Outside_Before() {
			Singer singer = _singer(3);

			Party party = new Party {
				SplashScreenUpcomingCount = 3,
				Queue = new List<Performance> {
					_performance(_singer(1), PerformanceStatus.Queued),
					_performance(_singer(2), PerformanceStatus.Queued),
					_performance(singer, PerformanceStatus.Completed),
					_performance(_singer(4), PerformanceStatus.Live),
					_performance(_singer(5), PerformanceStatus.Queued)
				}
			};

			var moveResult = _singerService.AutoMoveSinger(party, singer);
			Assert.IsFalse(moveResult.shouldMove);
		}

		[Test]
		public void AutoMoveSingerTest_Move_Inside_Before() {
			Singer singer = _singer(2);

			Party party = new Party {
				SplashScreenUpcomingCount = 3,
				Queue = new List<Performance> {
					_performance(_singer(1), PerformanceStatus.Queued),
					_performance(singer, PerformanceStatus.Requested),
					_performance(_singer(3), PerformanceStatus.Queued),
					_performance(_singer(4), PerformanceStatus.Live),
					_performance(_singer(5), PerformanceStatus.Queued)
				}
			};

			var (shouldMove, rotationNumber) = _singerService.AutoMoveSinger(party, singer);
			Assert.IsTrue(shouldMove);
			Assert.That(rotationNumber, Is.EqualTo(3));
		}

		[Test]
		public void AutoMoveSingerTest_Move_Inside_Clipped() {
			Singer singer = _singer(2);

			Party party = new Party {
				SplashScreenUpcomingCount = 3,
				Queue = new List<Performance> {
					_performance(_singer(1), PerformanceStatus.Live),
					_performance(singer, PerformanceStatus.Completed),
					_performance(_singer(3), PerformanceStatus.Queued),
					_performance(_singer(4), PerformanceStatus.Completed),
				}
			};

			var (shouldMove, rotationNumber) = _singerService.AutoMoveSinger(party, singer);
			Assert.IsTrue(shouldMove);
			Assert.That(rotationNumber, Is.EqualTo(3));
		}

		[Test]
		public void AutoMoveSingerTest_DontMove_Outside_Last() {
			Singer singer = _singer(5);

			Party party = new Party {
				SplashScreenUpcomingCount = 3,
				Queue = new List<Performance> {
					_performance(_singer(1), PerformanceStatus.Live),
					_performance(_singer(2), PerformanceStatus.Queued),
					_performance(_singer(3), PerformanceStatus.Queued),
					_performance(_singer(4), PerformanceStatus.Queued),
					_performance(singer, PerformanceStatus.Completed)

				}
			};
			var (shouldMove, _) = _singerService.AutoMoveSinger(party, singer);
			Assert.IsFalse(shouldMove);
		}

		[Test]
		public void AutoMoveSingerTest_Move_2nd() {
			Singer singer = _singer(5);

			Party party = new Party {
				SplashScreenUpcomingCount = 3,
				Queue = new List<Performance> {
					_performance(_singer(1), PerformanceStatus.Queued),
					_performance(_singer(2), PerformanceStatus.Live),
					_performance(_singer(3), PerformanceStatus.Completed),
					_performance(_singer(4), PerformanceStatus.Queued),
					_performance(singer, PerformanceStatus.Completed)

				}
			};
			var (shouldMove, rotationNumber) = _singerService.AutoMoveSinger(party, singer);
			Assert.IsTrue(shouldMove);
			Assert.That(rotationNumber, Is.EqualTo(2));
		}

		[Test]
		public void AutoMoveSingerTest_DontMove_NoPerformances() {
			Singer singer = _singer(3);

			Party party = new Party {
				SplashScreenUpcomingCount = 3,
				Queue = new List<Performance> {
					_performance(_singer(1), PerformanceStatus.Live),
					_performance(_singer(2), PerformanceStatus.Queued),
				}
			};
			var (shouldMove, _) = _singerService.AutoMoveSinger(party, singer);
			Assert.IsFalse(shouldMove);
		}

		[Test]
		public void AutoMoveSingerTest_Move_IgnoreOtherStatuses() {
			Singer singer = _singer(6);

			Party party = new Party {
				SplashScreenUpcomingCount = 3,
				Queue = new List<Performance> {
					_performance(_singer(1), PerformanceStatus.Live),
					_performance(_singer(2), PerformanceStatus.Queued),
					_performance(_singer(3), PerformanceStatus.Requested),
					_performance(_singer(4), PerformanceStatus.Requested),
					_performance(_singer(5), PerformanceStatus.Completed),
					_performance(singer, PerformanceStatus.Completed),
					_performance(_singer(7), PerformanceStatus.Queued),

				}
			};
			var (shouldMove, rotationNumber) = _singerService.AutoMoveSinger(party, singer);
			Assert.IsTrue(shouldMove);
			Assert.That(rotationNumber, Is.EqualTo(7));
		}

		[Test]
		public void AutoMoveSingerTest_Move_IgnoreCompleted() {
			Singer singer = _singer(4);

			Party party = new Party {
				SplashScreenUpcomingCount = 3,
				Queue = new List<Performance> {
					_performance(_singer(1), PerformanceStatus.Queued),
					_performance(_singer(2), PerformanceStatus.Live),
					_performance(_singer(3), PerformanceStatus.Completed),
					_performance(singer, PerformanceStatus.Completed),
					_performance(_singer(5), PerformanceStatus.Queued),

				}
			};
			var (shouldMove, rotationNumber) = _singerService.AutoMoveSinger(party, singer);
			Assert.IsTrue(shouldMove);
			Assert.That(rotationNumber, Is.EqualTo(2));
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
					_performance(singer, PerformanceStatus.Requested),
					_performance(_singer(12), PerformanceStatus.Queued),

				}
			};
			var (shouldMove, rotationNumber) = _singerService.AutoMoveSinger(party, singer);
			Assert.IsTrue(shouldMove);
			Assert.That(rotationNumber, Is.EqualTo(5));
		}

		[Test]
		public void AutoMoveSingerTest_Move_LargeTest2() {
			Singer singer = _singer(9);

			Party party = new Party {
				SplashScreenUpcomingCount = 5,
				Queue = new List<Performance> {
					_performance(_singer(1), PerformanceStatus.Queued),
					_performance(_singer(2), PerformanceStatus.Requested),
					_performance(_singer(3), PerformanceStatus.Live),
					_performance(_singer(4), PerformanceStatus.Queued),
					_performance(_singer(5), PerformanceStatus.Queued),
					_performance(_singer(6), PerformanceStatus.Requested),
					_performance(_singer(7), PerformanceStatus.Completed),
					_performance(_singer(8), PerformanceStatus.Queued),
					_performance(singer, PerformanceStatus.Completed),
					_performance(_singer(10), PerformanceStatus.Queued),
					_performance(_singer(11), PerformanceStatus.Completed),
					_performance(_singer(12), PerformanceStatus.Queued),
					_performance(_singer(13), PerformanceStatus.Queued),
					_performance(_singer(14), PerformanceStatus.Completed),
					_performance(_singer(15), PerformanceStatus.Queued),
				}
			};
			var (shouldMove, rotationNumber) = _singerService.AutoMoveSinger(party, singer);
			Assert.IsTrue(shouldMove);
			Assert.That(rotationNumber, Is.EqualTo(12));
		}
	}
}