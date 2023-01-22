using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Windows.Forms;
using KaraokeParty.Controllers;
using KPPlayer.Services;
using KPPlayer.Types;
using LibVLCSharp.Shared;

namespace KPPlayer {
	public partial class MainForm : Form {
		private SongDownloader songDownloader { get; set; }
		public LibVLC _libVLC;
		internal VideoPlayer _player { get; set; }

		public MainForm() {
			if (!DesignMode)
			{
				Core.Initialize();
			}

			InitializeComponent();
			_player = new VideoPlayer();
			_player.SetGlobalText(txtMessages);
			videoView1.MediaPlayer = _player.GetMediaPlayerObject();
			Load += MainForm_Load;

			System.Net.ServicePointManager.Expect100Continue = false;
			System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
			songDownloader = new SongDownloader();
		}

		private void initializeHttpClient() {
			AppState.client = new HttpClient();
			AppState.client.BaseAddress = new Uri(txtServerUrl.Text.ToString());
			AppState.client.DefaultRequestHeaders.Accept.Clear();
			AppState.client.DefaultRequestHeaders.Accept.Add(
				new MediaTypeWithQualityHeaderValue("application/json")
			);
		}

		private async void MainForm_Load(object sender, EventArgs e) {
			_player.PlayUrl("http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
			await AppState.ReadStoredSettings();
			txtServerUrl.Text = AppState.ServerUrl;
			txtPartyKey.Text = AppState.PartyKey;
		}

		private async Task checkConnection() {
			try {
				initializeHttpClient();
				var query = HttpUtility.ParseQueryString(string.Empty);
				query["partyKey"] = txtPartyKey.Text;

				var response = await AppState.client.GetAsync($"party?{query}");
				var data = await response.Content.ReadAsStringAsync();
				txtCheckConnection.Text = data;
				AppState.ServerUrl = txtServerUrl.Text;
				AppState.PartyKey = txtPartyKey.Text;
				AppState.WriteSettigns();
				lblConnectionStatus.Text = ConnectionStatus.Connected.ToString();
				AppState.Status = ConnectionStatus.Connected;
			} catch (Exception ex) {
				txtCheckConnection.Text = ex.Message;
				lblConnectionStatus.Text = ConnectionStatus.Failed.ToString();
			}
		}

		private async void btnCheckConnection_Click(object sender, EventArgs e) {
			btnCheckConnection.Enabled = false;
			await checkConnection();
			btnCheckConnection.Enabled = true;
		}

		private async void playerTimer_Tick(object sender, EventArgs e) {
			playerTimer.Stop();
			txtCheckConnection.Text = $"Try ping...{AppState.Status}";
			if (AppState.Status == ConnectionStatus.Connected) {
				GetQueuedListResponse response = await AppState.client.FetchObject<GetQueuedListResponse>($"party/{txtPartyKey.Text}/player/GetQueuedList");
				foreach(var performance in response.Performances) {
					songDownloader.PrepareVideo(performance.FileName);
				}
			}
			playerTimer.Start();
		}

		private void btnTogglePlayer_Click(object sender, EventArgs e) {
			this.TopMost = true;
			this.FormBorderStyle = FormBorderStyle.None;
			this.WindowState = FormWindowState.Maximized;
		}

		protected override bool ProcessCmdKey(ref Message msg, Keys keyData) {
			if (keyData == (Keys.F11)) {
				if (WindowState == FormWindowState.Maximized) {
					this.TopMost = false;
					this.FormBorderStyle = FormBorderStyle.Fixed3D;
					this.WindowState = FormWindowState.Normal;
					foreach (var lbl in Controls.OfType<Label>()) {
						lbl.Show();
					}
					foreach (var btn in Controls.OfType<Button>()) {
						btn.Show();
					}
					foreach (var txt in Controls.OfType<TextBox>()) {
						txt.Show();
					}
				} else {
					this.TopMost = true;
					this.FormBorderStyle = FormBorderStyle.None;
					this.WindowState = FormWindowState.Maximized;
					foreach (var lbl in Controls.OfType<Label>()) {
						lbl.Hide();
					}
					foreach (var btn in Controls.OfType<Button>()) {
						btn.Hide();
					}
					foreach (var txt in Controls.OfType<TextBox>()) {
						if (txt.Name == txtMessages.Name) {
							continue;
						}
						txt.Hide();
					}
				}
				return true;
			}
			return base.ProcessCmdKey(ref msg, keyData);
		}

		private void btnNextSong_Click(object sender, EventArgs e) {
			_ = _player.StartNextSong();
		}
	}
}
