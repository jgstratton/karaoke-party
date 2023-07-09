using KaraokeParty.DataStore;
using KaraokeParty.Hubs;
using KaraokeParty.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();

builder.Services.AddCors(options => {
	options.AddPolicy("CORSPolicy", builder =>
		builder.AllowAnyMethod().
		AllowAnyHeader().
		AllowAnyOrigin().
		SetIsOriginAllowed((hosts) => true)
	);
});

// Add services to the container.
builder.Services.AddControllers()
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

// Need to register IHTTPClientFactory for the Proxy to work
builder.Services.AddHttpClient();

builder.Services.AddHttpClient("yt-dlp", c => {
	c.BaseAddress = new Uri(builder.Configuration["YTDLPServiceConnectionString"] ?? "");
});

var app = builder.Build();

// rewrite client-side routes to return index.html
var options = new RewriteOptions();
foreach (var clientRoute in new List<string> { "Search","Home","NoParty","Player"}) {
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
	if (ctx.File.Name.Contains(".html") || ctx.File.Name.Contains("sw.js")) {
		ctx.Context.Response.Headers
					.Add("Cache-Control", "no-cache, no-store, must-revalidate");
		ctx.Context.Response.Headers.Add("Pragma", "no-cache");
		ctx.Context.Response.Headers.Add("Expires", "0");
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
app.UseEndpoints(endpoints => {
	endpoints.MapControllers();
	endpoints.MapHub<PlayerHub>("/hubs/player");
	endpoints.MapFallbackToFile("/index.html");
});
app.MapControllers();

using (var scope = app.Services.CreateScope()) {
	var services = scope.ServiceProvider;

	var context = services.GetRequiredService<KPContext>();
	await context.Database.MigrateAsync();
}
app.Run();
