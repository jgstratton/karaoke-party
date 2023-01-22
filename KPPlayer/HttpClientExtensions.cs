using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace KPPlayer {
	internal static class HttpClientExtensions {
		internal static async Task<T> FetchObject<T>(this HttpClient client, string url) {
			var response = await client.GetAsync(url);
			if (response.StatusCode != System.Net.HttpStatusCode.OK) {
				throw (new Exception($"Error fetching file: {url}"));
			}
			var responseString = await response.Content.ReadAsStringAsync();
			return JsonConvert.DeserializeObject<T>(responseString);
		}

		internal static async Task<byte[]> FetchFile(this HttpClient client, string url) {
			var response = await client.GetAsync(url);
			if (response.StatusCode != System.Net.HttpStatusCode.OK) {
				throw (new Exception($"Error fetching file: {url}"));
			}
			return await response.Content.ReadAsByteArrayAsync();
		}
	}
}
