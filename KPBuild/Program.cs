using System.Diagnostics;
using System.IO;
namespace KPBuild {
	internal class Program {
		static string SolutionDirectory { get; set; } = "";
		static string FrontEndPath { get; set; } = "";
		static string BackEndPath { get; set; } = "";

		private static void Main(string[] args) {

			SetPaths();
			BuildReactApp();
			CopyReactAppToSpaLocation();
			DotNetRestore();
			DotNetPublish();
		}

		static void SetPaths() {
			string workingDirectory = Directory.GetCurrentDirectory();
			string? solutionDirectory = Directory.GetParent(workingDirectory)?.Parent?.Parent?.Parent?.FullName;

			if (solutionDirectory == null) {
				throw new Exception("Unable to determine project directory");
			}
			Console.WriteLine($"Solution directory: {solutionDirectory}");
			SolutionDirectory = solutionDirectory;
			BackEndPath = Path.Combine(SolutionDirectory, "KaraokeParty");
			FrontEndPath = Path.Combine(SolutionDirectory, "KPFrontend");
		}

		static void BuildReactApp() {

			var pNpmRunBuild = Process.Start(new ProcessStartInfo {
				FileName = "cmd",
				RedirectStandardInput = true,
				WorkingDirectory = FrontEndPath
			});
			if (pNpmRunBuild is null) {
				Console.Error.WriteLine("npm process not created");
				return;
			}
			pNpmRunBuild.StandardInput.WriteLine("npm run build & exit");
			pNpmRunBuild.WaitForExit();
		}

		static void CopyReactAppToSpaLocation() {
			string frontEndBuildPath = Path.Combine(FrontEndPath, "Build");
			string backEndSpaPath = Path.Combine(BackEndPath, "FrontEndSpa");
			// clear build folder in backend
			IOUtility.ClearDirectory(backEndSpaPath);

			// copy the react build to the SpaLocation
			IOUtility.CopyDirectory(frontEndBuildPath, backEndSpaPath, true);
		}

		static void DotNetRestore() {

			var dotnetRestore = Process.Start(new ProcessStartInfo {
				FileName = "cmd",
				RedirectStandardInput = true,
				WorkingDirectory = BackEndPath
			});
			if (dotnetRestore is null) {
				throw new Exception("Process not created");
			}
			dotnetRestore.StandardInput.WriteLine("dotnet restore");
			dotnetRestore.StandardInput.Flush();
			dotnetRestore.StandardInput.Close();
			dotnetRestore.WaitForExit();
		}

		static void DotNetPublish() {

			var buildDotnetProcess = Process.Start(new ProcessStartInfo {
				FileName = "cmd",
				RedirectStandardInput = true,
				WorkingDirectory = BackEndPath
			});
			if (buildDotnetProcess is null) {
				throw new Exception("Process not created");
			}
			buildDotnetProcess.StandardInput.WriteLine("dotnet publish -c Release");
			buildDotnetProcess.StandardInput.Flush();
			buildDotnetProcess.StandardInput.Close();
			buildDotnetProcess.WaitForExit();
		}
	}
}