using backend.Services;

public class DBCronJobService : BackgroundService
{
    private readonly DatabaseService _databaseService;

    public DBCronJobService(DatabaseService databaseService)
    {
        _databaseService = databaseService;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await _databaseService.ExecuteAsync("EXECUTE UpdateClosureStatusAfterMaintenance");
            await Task.Delay(TimeSpan.FromMinutes(30), stoppingToken);
        }
    }
}
