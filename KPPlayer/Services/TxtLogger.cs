using KPPlayer.ExtensionMethods;
using System;
using System.Windows.Forms;

namespace KPPlayer.Services {
	public class TxtLogger {
		private readonly TextBox txtBox;

		public TxtLogger(TextBox txtBox) {
			this.txtBox = txtBox;
		}

		public void LogInfo(string message) {
			txtBox.InvokeIfRequired(() => {
				if (txtBox.Lines.Length > 100) {
					string[] newLines = new string[50];
					Array.Copy(txtBox.Lines, 50, newLines, 0, 50);
					txtBox.Lines = newLines;
				}
				txtBox.AppendText(System.Environment.NewLine + message);
			});
		}
	}
}
