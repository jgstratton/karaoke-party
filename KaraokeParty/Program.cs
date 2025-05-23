using Forge.OpenAI;
using KaraokeParty.ApiModels;
using KaraokeParty.DataStore;
using KaraokeParty.Hubs;
using KaraokeParty.Services;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR(options => {
	options.EnableDetailedErrors = true;
});

builder.Services.AddCors(options => {
	options.AddPolicy("CORSPolicy", builder =>
		builder.AllowAnyMethod().
		AllowAnyHeader().
		AllowAnyOrigin().
		SetIsOriginAllowed((hosts) => true)
	);
});

// Add services to the container.
builder.Services.AddControllersWithViews()
	.AddRazorRuntimeCompilation()
	.AddJsonOptions(options => {
		options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
	});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options => options.CustomSchemaIds(type => type.FullName));

builder.Services.AddTransient<IPartyService, PartyService>();
builder.Services.AddTransient<ISingerService, SingerService>();
builder.Services.AddTransient<PlayerHub>();
builder.Services.AddScoped<KPContext, KPContext>();
builder.Services.AddScoped<AppLoggerService, AppLoggerService>();
builder.Services.AddScoped<AwsSongService, AwsSongService>();
builder.Services.AddScoped<InternalSongService, InternalSongService>();

ServerSettingsStaticProvider.OpenAILambdaEndpoint = builder.Configuration["OpenAILambdaEndpoint"] ?? throw new Exception("Missing configuration: OpenAILambdaEndpoint");

// Need to register IHTTPClientFactory for the Proxy to work
builder.Services.AddHttpClient();

builder.Services.AddHttpClient("yt-dlp", c => {
	c.BaseAddress = new Uri(builder.Configuration["YTDLPServiceConnectionString"] ?? "");
});

builder.Services.AddForgeOpenAI(options => {
	options.AuthenticationInfo = builder.Configuration["OpenAI:ApiKey"]!;
});
var app = builder.Build();

// rewrite client-side routes to return index.html
var options = new RewriteOptions();
foreach (var clientRoute in new List<string> { "Search", "Home", "DjHome", "NoParty", "Player", "MyRequests", "TestApi" }) {
	options.AddRewrite($"(?i)^{clientRoute}", "index.html", skipRemainingRules: true);
	options.AddRewrite($"(?i)^{clientRoute}/.*", "index.html", skipRemainingRules: true);
}
app.UseRewriter(options);

var fsOptions = new FileServerOptions {
	FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "FrontEndSpa")),
	RequestPath = "",
	EnableDefaultFiles = true
};

fsOptions.StaticFileOptions.OnPrepareResponse = (ctx) => {
	if (ctx.File.Name.Contains(".html") || ctx.File.Name.Contains(".js") || ctx.File.Name.Contains(".css")) {
		ctx.Context.Response.Headers.Append("Cache-Control", "no-cache, no-store, must-revalidate");
		ctx.Context.Response.Headers.Append("Pragma", "no-cache");
		ctx.Context.Response.Headers.Append("Expires", "0");
	}
};

app.UseFileServer(fsOptions);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseCors("CORSPolicy");
app.UseRouting();
//app.UseHttpsRedirection();

app.UseAuthorization();
app.MapControllers();
app.MapHub<PlayerHub>("/hubs/player");
app.MapFallbackToFile("/index.html");


// Render only .js files in "Views" folder
app.UseStaticFiles();

using (var scope = app.Services.CreateScope()) {
	var services = scope.ServiceProvider;

	var context = services.GetRequiredService<KPContext>();
	await context.Database.MigrateAsync();
}
app.Run();
