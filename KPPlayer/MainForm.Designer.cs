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
                this._mp?.Dispose();
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
			this.videoView1 = new LibVLCSharp.WinForms.VideoView();
			this.btnCheckConnection = new System.Windows.Forms.Button();
			this.txtCheckConnection = new System.Windows.Forms.TextBox();
			this.lblServerUrl = new System.Windows.Forms.Label();
			this.lblPartyKey = new System.Windows.Forms.Label();
			this.txtServerUrl = new System.Windows.Forms.TextBox();
			this.txtPartyKey = new System.Windows.Forms.TextBox();
			this.lblConnectionStatus = new System.Windows.Forms.Label();
			((System.ComponentModel.ISupportInitialize)(this.videoView1)).BeginInit();
			this.SuspendLayout();
			// 
			// videoView1
			// 
			this.videoView1.BackColor = System.Drawing.Color.Black;
			this.videoView1.Location = new System.Drawing.Point(13, 12);
			this.videoView1.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
			this.videoView1.MediaPlayer = null;
			this.videoView1.Name = "videoView1";
			this.videoView1.Size = new System.Drawing.Size(697, 360);
			this.videoView1.TabIndex = 0;
			// 
			// btnCheckConnection
			// 
			this.btnCheckConnection.Location = new System.Drawing.Point(12, 512);
			this.btnCheckConnection.Name = "btnCheckConnection";
			this.btnCheckConnection.Size = new System.Drawing.Size(141, 23);
			this.btnCheckConnection.TabIndex = 1;
			this.btnCheckConnection.Text = "Check Connection";
			this.btnCheckConnection.UseVisualStyleBackColor = true;
			this.btnCheckConnection.Click += new System.EventHandler(this.btnCheckConnection_Click);
			// 
			// txtCheckConnection
			// 
			this.txtCheckConnection.Dock = System.Windows.Forms.DockStyle.Right;
			this.txtCheckConnection.Location = new System.Drawing.Point(717, 0);
			this.txtCheckConnection.Multiline = true;
			this.txtCheckConnection.Name = "txtCheckConnection";
			this.txtCheckConnection.Size = new System.Drawing.Size(293, 561);
			this.txtCheckConnection.TabIndex = 2;
			// 
			// lblServerUrl
			// 
			this.lblServerUrl.AutoSize = true;
			this.lblServerUrl.Location = new System.Drawing.Point(13, 398);
			this.lblServerUrl.Name = "lblServerUrl";
			this.lblServerUrl.Size = new System.Drawing.Size(63, 15);
			this.lblServerUrl.TabIndex = 3;
			this.lblServerUrl.Text = "Server URL";
			// 
			// lblPartyKey
			// 
			this.lblPartyKey.AutoSize = true;
			this.lblPartyKey.Location = new System.Drawing.Point(13, 454);
			this.lblPartyKey.Name = "lblPartyKey";
			this.lblPartyKey.Size = new System.Drawing.Size(56, 15);
			this.lblPartyKey.TabIndex = 4;
			this.lblPartyKey.Text = "Party Key";
			// 
			// txtServerUrl
			// 
			this.txtServerUrl.Location = new System.Drawing.Point(13, 416);
			this.txtServerUrl.Name = "txtServerUrl";
			this.txtServerUrl.Size = new System.Drawing.Size(292, 23);
			this.txtServerUrl.TabIndex = 5;
			// 
			// txtPartyKey
			// 
			this.txtPartyKey.Location = new System.Drawing.Point(13, 472);
			this.txtPartyKey.Name = "txtPartyKey";
			this.txtPartyKey.Size = new System.Drawing.Size(292, 23);
			this.txtPartyKey.TabIndex = 6;
			// 
			// lblConnectionStatus
			// 
			this.lblConnectionStatus.AutoSize = true;
			this.lblConnectionStatus.Location = new System.Drawing.Point(159, 516);
			this.lblConnectionStatus.Name = "lblConnectionStatus";
			this.lblConnectionStatus.Size = new System.Drawing.Size(101, 15);
			this.lblConnectionStatus.TabIndex = 7;
			this.lblConnectionStatus.Text = "(Status Unknown)";
			// 
			// MainForm
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.ClientSize = new System.Drawing.Size(1010, 561);
			this.Controls.Add(this.lblConnectionStatus);
			this.Controls.Add(this.txtPartyKey);
			this.Controls.Add(this.txtServerUrl);
			this.Controls.Add(this.lblPartyKey);
			this.Controls.Add(this.lblServerUrl);
			this.Controls.Add(this.txtCheckConnection);
			this.Controls.Add(this.btnCheckConnection);
			this.Controls.Add(this.videoView1);
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
		private System.Windows.Forms.TextBox txtCheckConnection;
		private System.Windows.Forms.Label lblServerUrl;
		private System.Windows.Forms.Label lblPartyKey;
		private System.Windows.Forms.TextBox txtServerUrl;
		private System.Windows.Forms.TextBox txtPartyKey;
		private System.Windows.Forms.Label lblConnectionStatus;
	}
}