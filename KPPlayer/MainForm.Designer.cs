using LibVLCSharp.WinForms;
namespace KPPlayer
{
    partial class MainForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
                this._player?.Dispose();
                this._libVLC?.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
			this.components = new System.ComponentModel.Container();
			this.videoView1 = new LibVLCSharp.WinForms.VideoView();
			this.btnCheckConnection = new System.Windows.Forms.Button();
			this.txtLogger = new System.Windows.Forms.TextBox();
			this.lblServerUrl = new System.Windows.Forms.Label();
			this.lblPartyKey = new System.Windows.Forms.Label();
			this.txtServerUrl = new System.Windows.Forms.TextBox();
			this.txtPartyKey = new System.Windows.Forms.TextBox();
			this.lblConnectionStatus = new System.Windows.Forms.Label();
			this.playerTimer = new System.Windows.Forms.Timer(this.components);
			this.btnNextSong = new System.Windows.Forms.Button();
			this.txtMessages = new System.Windows.Forms.TextBox();
			this.lblVideoMessageDuration = new System.Windows.Forms.Label();
			this.txtMessageDuration = new System.Windows.Forms.TextBox();
			((System.ComponentModel.ISupportInitialize)(this.videoView1)).BeginInit();
			this.SuspendLayout();
			// 
			// videoView1
			// 
			this.videoView1.BackColor = System.Drawing.Color.Black;
			this.videoView1.Dock = System.Windows.Forms.DockStyle.Fill;
			this.videoView1.Location = new System.Drawing.Point(0, 0);
			this.videoView1.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
			this.videoView1.MediaPlayer = null;
			this.videoView1.Name = "videoView1";
			this.videoView1.Size = new System.Drawing.Size(1010, 561);
			this.videoView1.TabIndex = 0;
			// 
			// btnCheckConnection
			// 
			this.btnCheckConnection.Location = new System.Drawing.Point(13, 215);
			this.btnCheckConnection.Name = "btnCheckConnection";
			this.btnCheckConnection.Size = new System.Drawing.Size(141, 23);
			this.btnCheckConnection.TabIndex = 1;
			this.btnCheckConnection.Text = "Check Connection";
			this.btnCheckConnection.UseVisualStyleBackColor = true;
			this.btnCheckConnection.Click += new System.EventHandler(this.btnCheckConnection_Click);
			// 
			// txtLogger
			// 
			this.txtLogger.Dock = System.Windows.Forms.DockStyle.Right;
			this.txtLogger.Location = new System.Drawing.Point(462, 0);
			this.txtLogger.Multiline = true;
			this.txtLogger.Name = "txtLogger";
			this.txtLogger.Size = new System.Drawing.Size(548, 561);
			this.txtLogger.TabIndex = 2;
			// 
			// lblServerUrl
			// 
			this.lblServerUrl.AutoSize = true;
			this.lblServerUrl.Location = new System.Drawing.Point(13, 25);
			this.lblServerUrl.Name = "lblServerUrl";
			this.lblServerUrl.Size = new System.Drawing.Size(63, 15);
			this.lblServerUrl.TabIndex = 3;
			this.lblServerUrl.Text = "Server URL";
			// 
			// lblPartyKey
			// 
			this.lblPartyKey.AutoSize = true;
			this.lblPartyKey.Location = new System.Drawing.Point(12, 87);
			this.lblPartyKey.Name = "lblPartyKey";
			this.lblPartyKey.Size = new System.Drawing.Size(56, 15);
			this.lblPartyKey.TabIndex = 4;
			this.lblPartyKey.Text = "Party Key";
			// 
			// txtServerUrl
			// 
			this.txtServerUrl.Location = new System.Drawing.Point(13, 43);
			this.txtServerUrl.Name = "txtServerUrl";
			this.txtServerUrl.Size = new System.Drawing.Size(292, 23);
			this.txtServerUrl.TabIndex = 5;
			// 
			// txtPartyKey
			// 
			this.txtPartyKey.Location = new System.Drawing.Point(12, 107);
			this.txtPartyKey.Name = "txtPartyKey";
			this.txtPartyKey.Size = new System.Drawing.Size(292, 23);
			this.txtPartyKey.TabIndex = 6;
			// 
			// lblConnectionStatus
			// 
			this.lblConnectionStatus.AutoSize = true;
			this.lblConnectionStatus.Location = new System.Drawing.Point(160, 215);
			this.lblConnectionStatus.Name = "lblConnectionStatus";
			this.lblConnectionStatus.Size = new System.Drawing.Size(101, 15);
			this.lblConnectionStatus.TabIndex = 7;
			this.lblConnectionStatus.Text = "(Status Unknown)";
			// 
			// playerTimer
			// 
			this.playerTimer.Enabled = true;
			this.playerTimer.Interval = 2000;
			this.playerTimer.Tick += new System.EventHandler(this.playerTimer_Tick);
			// 
			// btnNextSong
			// 
			this.btnNextSong.Location = new System.Drawing.Point(13, 305);
			this.btnNextSong.Name = "btnNextSong";
			this.btnNextSong.Size = new System.Drawing.Size(75, 23);
			this.btnNextSong.TabIndex = 9;
			this.btnNextSong.Text = "Next Song";
			this.btnNextSong.UseVisualStyleBackColor = true;
			this.btnNextSong.Click += new System.EventHandler(this.btnNextSong_Click);
			// 
			// txtMessages
			// 
			this.txtMessages.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.txtMessages.BackColor = System.Drawing.Color.Black;
			this.txtMessages.BorderStyle = System.Windows.Forms.BorderStyle.None;
			this.txtMessages.Font = new System.Drawing.Font("Segoe UI", 24F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
			this.txtMessages.ForeColor = System.Drawing.SystemColors.Menu;
			this.txtMessages.Location = new System.Drawing.Point(0, 136);
			this.txtMessages.Multiline = true;
			this.txtMessages.Name = "txtMessages";
			this.txtMessages.Size = new System.Drawing.Size(1010, 262);
			this.txtMessages.TabIndex = 10;
			this.txtMessages.Text = "Global Mesages";
			this.txtMessages.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
			this.txtMessages.Visible = false;
			// 
			// lblVideoMessageDuration
			// 
			this.lblVideoMessageDuration.AutoSize = true;
			this.lblVideoMessageDuration.Location = new System.Drawing.Point(12, 146);
			this.lblVideoMessageDuration.Name = "lblVideoMessageDuration";
			this.lblVideoMessageDuration.Size = new System.Drawing.Size(189, 15);
			this.lblVideoMessageDuration.TabIndex = 11;
			this.lblVideoMessageDuration.Text = "Video Message Duration (seconds)";
			// 
			// txtMessageDuration
			// 
			this.txtMessageDuration.Location = new System.Drawing.Point(12, 164);
			this.txtMessageDuration.Name = "txtMessageDuration";
			this.txtMessageDuration.Size = new System.Drawing.Size(292, 23);
			this.txtMessageDuration.TabIndex = 12;
			// 
			// MainForm
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.ClientSize = new System.Drawing.Size(1010, 561);
			this.Controls.Add(this.txtMessageDuration);
			this.Controls.Add(this.lblVideoMessageDuration);
			this.Controls.Add(this.btnNextSong);
			this.Controls.Add(this.lblConnectionStatus);
			this.Controls.Add(this.txtPartyKey);
			this.Controls.Add(this.txtServerUrl);
			this.Controls.Add(this.lblPartyKey);
			this.Controls.Add(this.lblServerUrl);
			this.Controls.Add(this.btnCheckConnection);
			this.Controls.Add(this.txtMessages);
			this.Controls.Add(this.txtLogger);
			this.Controls.Add(this.videoView1);
			this.KeyPreview = true;
			this.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
			this.Name = "MainForm";
			this.Text = "LibVLCSharp.WinForms";
			((System.ComponentModel.ISupportInitialize)(this.videoView1)).EndInit();
			this.ResumeLayout(false);
			this.PerformLayout();

        }

        #endregion

        private VideoView videoView1;
		private System.Windows.Forms.Button btnCheckConnection;
		private System.Windows.Forms.TextBox txtLogger;
		private System.Windows.Forms.Label lblServerUrl;
		private System.Windows.Forms.Label lblPartyKey;
		private System.Windows.Forms.TextBox txtServerUrl;
		private System.Windows.Forms.TextBox txtPartyKey;
		private System.Windows.Forms.Label lblConnectionStatus;
		private System.Windows.Forms.Timer playerTimer;
		private System.Windows.Forms.Button btnNextSong;
		private System.Windows.Forms.TextBox txtMessages;
		private System.Windows.Forms.Label lblVideoMessageDuration;
		private System.Windows.Forms.TextBox txtMessageDuration;
	}
}