using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using KaraokeParty.Hubs;
using KaraokeParty.Hubs.Clients;
using KPPlayer.ExtensionMethods;
using KPPlayer.Types;
using LibVLCSharp.Shared;
using Microsoft.AspNetCore.SignalR.Client;
using System;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace KPPlayer.Services {

	/// <summary>
	/// Wrapper around the VLC MediaPlayer
	/// </summary>
	internal class VideoPlayer : IDisposable {
		public PlayerState State {get ;set;}
		public string FileName { get; set;}
		private MediaPlayer _mp;
		private LibVLC _libVLC;
		private TextBox _globalText { get; set; }
		private TextBox _durationText { get; set; }
		private string _newline = System.Environment.NewLine;
		private int defaultMessageDisplayTime = 15;
		private Timer _timer;
		private double previousPosition { get; set; } = 0;

		public VideoPlayer() {
			_libVLC = new LibVLC();
			_mp = new MediaPlayer(_libVLC);
			_mp.EndReached += onPlayerEndReached;
			_timer = new Timer();
			_timer.Interval = 2000;
			_timer.Tick += onPlayerTick;
			_timer.Start();
		}

		public void InitializeHubListeners() {
			AppState.PlayerHub.On<decimal>(nameof(IPlayerClient.ReceivePosition), (position) => {
				_mp.Time = (long)(_mp.Length * position);
			});

			AppState.PlayerHub.On(nameof(IPlayerClient.ReceivePause), () => {
				_mp.Pause();
			});

			AppState.PlayerHub.On(nameof(IPlayerClient.ReceivePlay), () => {
				_mp.Play();
			});

			AppState.PlayerHub.On<PerformanceDTO>(nameof(IPlayerClient.ReceiveNewPerformanceStarted), async (dto) => {
				// safely stop the player without causing a deadlock
				AppState.Logger.LogInfo($"Stopping video player.");
				System.Threading.ThreadPool.QueueUserWorkItem(_ => _mp.Stop());
				AppState.Logger.LogInfo($"Video player stopped.");

				_setMessage($"Now Performing{_newline}{dto.SingerName}{_newline}{_newline}{dto.SongTitle}");
				_showMessage();
				await Task.Delay(GetMessageDurationTime());
				_hideMessage();
				bool playNewSongResult = _mp.Play(new Media(_libVLC, SongDownloader.GetFilePath(dto.FileName), FromType.FromPath));
				if (!playNewSongResult) {
					_setMessage($"Error playing new song");
					_showMessage();
					return;
				}
				await _mp.Media.Parse();
				await AppState.PlayerHub.InvokeAsync(nameof(PlayerHub.SendVideoLength), AppState.PartyKey, _mp.Media.Duration);
				AppState.Logger.LogInfo($"Send Video Length completed: {_mp.Media.Duration}");
			});

			AppState.PlayerHub.On<PerformanceDTO>(nameof(IPlayerClient.ReceivePreviousSong), async (dto) => {
				// safely stop the player without causing a deadlock
				AppState.Logger.LogInfo($"Stopping video player.");
				System.Threading.ThreadPool.QueueUserWorkItem(_ => _mp.Stop());
				AppState.Logger.LogInfo($"Video player stopped.");

				bool playNewSongResult = _mp.Play(new Media(_libVLC, SongDownloader.GetFilePath(dto.FileName), FromType.FromPath));
				if (!playNewSongResult) {
					_setMessage($"Error playing new song");
					_showMessage();
					return;
				}
				await _mp.Media.Parse();
				await AppState.PlayerHub.InvokeAsync(nameof(PlayerHub.SendVideoLength), AppState.PartyKey, _mp.Media.Duration);
				AppState.Logger.LogInfo($"Send Video Length completed: {_mp.Media.Duration}");
			});

			AppState.PlayerHub.On(nameof(IPlayerClient.ReceiveEndOfQueue), () => {
				// safely stop the player without causing a deadlock
				AppState.Logger.LogInfo($"Stopping video player.");
				System.Threading.ThreadPool.QueueUserWorkItem(_ => _mp.Stop());
				AppState.Logger.LogInfo($"Video player stopped.");

				_setMessage($"No performances in queue{_newline}Get your requests in!{_newline}{_newline}Join at {AppState.ServerUrl} and use code {AppState.PartyKey}");
				_showMessage();
			});
		}

		public void SetGlobalText(TextBox txtBox) => _globalText = txtBox;
		public void SetDurationText(TextBox txtBox) => _durationText = txtBox;

		public int GetMessageDurationTime() {
			int messageDuration = 0;
			_durationText.InvokeIfRequired(() => {
				Int32.TryParse(_durationText.Text, out messageDuration);
			});
			
			return messageDuration < 1 ? defaultMessageDisplayTime*1000 : messageDuration*1000;
		}

		public MediaPlayer GetMediaPlayerObject() {
			return _mp;
		}

		public void PlayUrl(string url) {
			_mp.Play(new Media(_libVLC, url, FromType.FromLocation));
		}

		public static async Task<bool> RefreshFromServer() {
			PlayerDTO response = await AppState.client.FetchObject<PlayerDTO>($"party/{AppState.PartyKey}/player");
			return true;
		}

		public async Task StartNextSong() {
			await AppState.PlayerHub.InvokeAsync(nameof(PlayerHub.StartNewPerformance), AppState.PartyKey);
		}

		async void onPlayerEndReached(object sender, EventArgs e) {
			await StartNextSong();
		}

		async void onPlayerTick(object sender, EventArgs e) {
			_timer.Stop();
			if (AppState.Status == ConnectionStatus.Connected) {
				double position = (_mp.Time * 1.00) / (_mp.Length * 1.00);
				if (position < 0) {
					position = 0;
				}
				if (position != previousPosition && !Double.IsNaN(position)) {
					await AppState.PlayerHub.InvokeAsync(nameof(PlayerHub.SendPosition), AppState.PartyKey, position);
					AppState.Logger.LogInfo($"Send position completed: {position}");
					previousPosition = position;
				}
				
			}
			_timer.Start();
		}

		public void Dispose() {
			_mp.Dispose();
		}

		public void _setMessage(string text) => _globalText.InvokeIfRequired(() => { _globalText.Text = text; });
		public void _showMessage() => _globalText.InvokeIfRequired(() => { _globalText.Show(); });
		public void _hideMessage() => _globalText.InvokeIfRequired(() => { _globalText.Hide(); });
	}
}
