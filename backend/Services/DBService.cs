using System.Data.SqlClient;
using Dapper;

namespace backend.Services
{
    public class DatabaseService : IDisposable
    {
        private readonly string _connectionString;
        private readonly SqlConnection _connection;

        public DatabaseService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException(nameof(_connectionString), "Connection string not found");
            _connection = new SqlConnection(_connectionString);
        }

        public async Task<IEnumerable<T>> QueryAsync<T>(string sql, object? param = null)
        {
            return await _connection.QueryAsync<T>(sql, param);
        }

        public async Task<T?> QuerySingleOrDefaultAsync<T>(string sql, object? param = null)
        {
            return await _connection.QuerySingleOrDefaultAsync<T>(sql, param);
        }

        public async Task<int> ExecuteAsync(string sql, object? param = null)
        {
            return await _connection.ExecuteAsync(sql, param);
        }

        public async Task<T> QuerySingleAsync<T>(string sql, object? param = null)
        {
            return await _connection.QuerySingleAsync<T>(sql, param);
        }

        public void Dispose()
        {
            _connection.Dispose();
        }
    }
}
