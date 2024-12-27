

using KaraokeParty.DataStore;

namespace KaraokeParty.Services {
	public class AppLoggerService {
		private readonly KPContext context;

		public AppLoggerService(KPContext context) {
			this.context = context;
		}

		public void LogError(string message) => _createLog(LogLevel.Error, message);
		public void LogWarning(string message) => _createLog(LogLevel.Warning, message);
		public void LogInfo(string message) => _createLog(LogLevel.Information, message);
		public void LogDebug(string message) => _createLog(LogLevel.Debug, message);

		public void LogError(string message, Exception ex) {
			try {
				context.ApplicationLog.Add(new ApplicationLog {
					Message = message,
					LogLevel = LogLevel.Error.ToString(),
					ExceptionSource = ex.Source ?? "",
					ExceptionType = ex.GetType().ToString(),
					InnerException = ex.InnerException?.Message ?? "",
					StackTrace = ex.StackTrace?.ToString() ?? ""
				});
				context.SaveChanges();
			} catch {
				_createLog(LogLevel.Error, "An error occured in the Exception logger");
			}

		}

		private void _createLog(LogLevel logLevel, string message) {
			try {
				context.ApplicationLog.Add(new ApplicationLog {
					Message = message,
					LogLevel = logLevel.ToString()
				});
				context.SaveChanges();
			} catch {
				// there's an error in the error handler
			}

		}
	}
}
