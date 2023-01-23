using KaraokeParty.DataStore;
using KaraokeParty.Hubs;
using KaraokeParty.Services;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();

builder.Services.AddCors(options => {
	options.AddPolicy("CORSPolicy", builder =>
		builder.AllowAnyMethod().
		AllowAnyHeader().
		AllowCredentials().
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
builder.Services.AddSwaggerGen(options => options.CustomSchemaIds( type => type.FullName));

builder.Services.AddTransient<IPartyService, PartyService>();
builder.Services.AddTransient<PlayerHub>();
builder.Services.AddScoped<KPContext, KPContext>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseCors("CORSPolicy");
app.UseRouting();
app.UseHttpsRedirection();

app.UseAuthorization();
app.UseEndpoints(endpoints => {
	endpoints.MapControllers();
	endpoints.MapHub<PlayerHub>("/hubs/player");
});
app.MapControllers();

app.Run();
