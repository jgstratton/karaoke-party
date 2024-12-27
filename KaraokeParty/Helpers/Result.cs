using System.Diagnostics.CodeAnalysis;

namespace KaraokeParty.Helpers {
	public class Result {
		public bool Success { get; private set; }
		public string Error { get; private set; }

		public bool Failure {
			get { return !Success; }
		}

		protected Result(bool success, string error) {
			Contracts.Require(success || !string.IsNullOrEmpty(error), "Value must be defined for successfull Result objects.");
			Contracts.Require(!success || string.IsNullOrEmpty(error), "Value must be defined for successfull Result objects.");

			Success = success;
			Error = error;
		}

		public static Result Fail(string message) {
			return new Result(false, message);
		}

		public static Result<T> Fail<T>(string message) {
			return new Result<T>(default(T), false, message);
		}

		public static Result Ok() {
			return new Result(true, String.Empty);
		}

		public static Result<T> Ok<T>(T value) {
			return new Result<T>(value, true, String.Empty);
		}

		public static Result Combine(params Result[] results) {
			foreach (Result result in results) {
				if (result.Failure)
					return result;
			}

			return Ok();
		}
	}


	public class Result<T> : Result {
		private T _value;

		public T Value {
			get {
				Contracts.Require(Success, "Cannot read value for failed result objects.");
				return _value;
			}
			[param: AllowNull]
			private set { _value = value; }
		}

		protected internal Result([AllowNull] T value, bool success, string error)
			: base(success, error) {
			Contracts.Require(value != null || !success, "Value must be defined for successfull Result objects.");
			Value = value;
		}
	}

	public static class ResultExtensions {
		public static Result OnSuccess(this Result result, Func<Result> func) {
			if (result.Failure)
				return result;

			return func();
		}

		public static Result OnSuccess(this Result result, Action action) {
			if (result.Failure)
				return result;

			action();

			return Result.Ok();
		}

		public static Result OnSuccess<T>(this Result<T> result, Action<T> action) {
			if (result.Failure)
				return result;

			action(result.Value);

			return Result.Ok();
		}

		public static Result<T> OnSuccess<T>(this Result result, Func<T> func) {
			if (result.Failure)
				return Result.Fail<T>(result.Error);

			return Result.Ok(func());
		}

		public static Result<T> OnSuccess<T>(this Result result, Func<Result<T>> func) {
			if (result.Failure)
				return Result.Fail<T>(result.Error);

			return func();
		}

		public static Result OnSuccess<T>(this Result<T> result, Func<T, Result> func) {
			if (result.Failure)
				return result;

			return func(result.Value);
		}

		public static Result OnFailure(this Result result, Action action) {
			if (result.Failure) {
				action();
			}

			return result;
		}

		public static Result OnBoth(this Result result, Action<Result> action) {
			action(result);

			return result;
		}

		public static T OnBoth<T>(this Result result, Func<Result, T> func) {
			return func(result);
		}
	}

	public class Contracts {
		public static void Require(bool precondition, string exceptionMessage) {
			if (!precondition)
				throw new CodeContractException(exceptionMessage);
		}
	}

	public class CodeContractException : Exception {
		public CodeContractException(string message) : base(message) { }
	}
}
