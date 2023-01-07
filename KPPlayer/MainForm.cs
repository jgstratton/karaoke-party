using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Windows.Forms;
using KPPlayer.Services;
using KPPlayer.Types;
using LibVLCSharp.Shared;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace KPPlayer {
	public partial class MainForm : Form {
		static HttpClient client;
		public LibVLC _libVLC;
		public MediaPlayer _mp;
		public ConnectionStatus Status { get; set; } = ConnectionStatus.Unknown;

		public MainForm() {
			if (!DesignMode)
			{
				Core.Initialize();
			}

			InitializeComponent();
			_libVLC = new LibVLC();
			_mp = new MediaPlayer(_libVLC);
			videoView1.MediaPlayer = _mp;
			Load += MainForm_Load;

			System.Net.ServicePointManager.Expect100Continue = false;
			System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
		}

		private void initializeHttpClient() {
			client = new HttpClient();
			client.BaseAddress = new Uri(txtServerUrl.Text.ToString());
			client.DefaultRequestHeaders.Accept.Clear();
			client.DefaultRequestHeaders.Accept.Add(
				new MediaTypeWithQualityHeaderValue("application/json"));
		}

		private async void MainForm_Load(object sender, EventArgs e) {
			_mp.Play(new Media(_libVLC, "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", FromType.FromLocation));
			ApplicationSettings settings = await ApplicationSettings.ReadStoredSettings();
			txtServerUrl.Text = settings.ServerUrl;
			txtPartyKey.Text = settings.PartyKey;
		}

		private async Task checkConnection() {
			try {
				initializeHttpClient();
				var query = HttpUtility.ParseQueryString(string.Empty);
				query["partyKey"] = txtPartyKey.Text;

				var response = await client.GetAsync($"party?{query}");
				var data = await response.Content.ReadAsStringAsync();
				txtCheckConnection.Text = data;
				ApplicationSettings settings = await ApplicationSettings.ReadStoredSettings();
				settings.ServerUrl = txtServerUrl.Text;
				settings.PartyKey = txtPartyKey.Text;
				settings.WriteSettigns();
				lblConnectionStatus.Text = ConnectionStatus.Connected.ToString();
				Status = ConnectionStatus.Connected;
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
			txtCheckConnection.Text = $"Try ping...{Status.ToString()}";
			if (Status == ConnectionStatus.Connected) {
				var response = await client.GetAsync($"party/{txtPartyKey.Text}/player");
				var data = await response.Content.ReadAsStringAsync();
				txtCheckConnection.Text = $"{DateTime.Now.ToLongTimeString()} {data}";
			}
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
						txt.Hide();
					}
				}
				return true;
			}
			return base.ProcessCmdKey(ref msg, keyData);
		}
	}
}
