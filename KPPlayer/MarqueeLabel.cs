using System.Drawing;
using System;
using System.Windows.Forms;

namespace KPPlayer {
	public partial class MarqueeLabel : Label {
		Timer timer;
		int? left;
		int textWidth = 0;

		public MarqueeLabel() {
			InitializeComponent();
			DoubleBuffered = true;
			timer = new Timer() { Interval = 25 };
			timer.Enabled = true;
			timer.Tick += Timer_Tick;
		}

		private void Timer_Tick(object sender, EventArgs e) {
			if (RightToLeft == RightToLeft.Yes) {
				left += 2;
				if (left > Width)
					left = -textWidth;
			} else {
				left -= 2;
				if (left < -textWidth)
					left = Width;
			}
			Invalidate();
		}

		protected override void OnPaint(PaintEventArgs e) {
			e.Graphics.Clear(BackColor);
			var s = TextRenderer.MeasureText(Text, Font, new Size(0, 0),
				TextFormatFlags.TextBoxControl | TextFormatFlags.SingleLine);
			textWidth = s.Width;
			if (!left.HasValue) left = Width;
			var format = TextFormatFlags.TextBoxControl | TextFormatFlags.SingleLine |
				TextFormatFlags.VerticalCenter;
			if (RightToLeft == RightToLeft.Yes) {
				format |= TextFormatFlags.RightToLeft;
				if (!left.HasValue) left = -textWidth;
			}
			TextRenderer.DrawText(e.Graphics, Text, Font,
				new Rectangle(left.Value, 0, textWidth, Height),
				ForeColor, BackColor, format);
		}


		protected override void Dispose(bool disposing) {
			if (disposing)
				timer.Dispose();
			base.Dispose(disposing);
		}


		private void InitializeComponent() {
			this.SuspendLayout();
			// 
			// MarqueeLabel
			// 
			this.Name = "MarqueeLabel";
			this.Size = new System.Drawing.Size(1020, 26);
			this.ResumeLayout(false);

		}
	}
}
