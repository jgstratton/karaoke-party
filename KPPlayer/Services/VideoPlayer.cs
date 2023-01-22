using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using KPPlayer.ExtensionMethods;
using LibVLCSharp.Shared;
using System;
using System.Threading.Tasks;
using System.Windows.Forms;
using static System.Net.Mime.MediaTypeNames;

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
		private string _newline = System.Environment.NewLine;
		private int messageDisplayTime = 15 * 1000;

		public VideoPlayer() {
			_libVLC = new LibVLC();
			_mp = new MediaPlayer(_libVLC);
			_mp.EndReached += onPlayerEndReached;
		}

		public void SetGlobalText(TextBox txtBox) {
			_globalText = txtBox;
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

		public async Task<bool> StartNextSong() {
			PerformanceDTO response = await AppState.client.FetchObject<PerformanceDTO>($"party/{AppState.PartyKey}/player/next");
			_mp.Stop();
			if (response != null) {
				_setMessage($"Now Performing{_newline}{response.SingerName}{_newline}");
				_showMessage();
				await Task.Delay(messageDisplayTime);
				_hideMessage();
				bool playNewSongResult = _mp.Play(new Media(_libVLC, SongDownloader.GetFilePath(response.FileName), FromType.FromPath));
				if (!playNewSongResult) {
					_setMessage($"Error playing new song");
				}
				return playNewSongResult;
			}
			
			_globalText.Text = $"No performances in queue{_newline}Get your requests in!";
			_hideMessage();
			return false;
		}

		public async void onPlayerEndReached(object sender, EventArgs e) {
			_ = await StartNextSong();
		}

		public void Dispose() {
			_mp.Dispose();
		}

		public void _setMessage(string text) => _globalText.InvokeIfRequired(() => { _globalText.Text = text; });
		public void _showMessage() => _globalText.InvokeIfRequired(() => { _globalText.Show(); });
		public void _hideMessage() => _globalText.InvokeIfRequired(() => { _globalText.Hide(); });
	}
}
