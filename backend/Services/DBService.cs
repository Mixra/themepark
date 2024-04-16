using System.Data.SqlClient;
using Dapper;

namespace backend.Services
{
    public class DatabaseService
    {
        private readonly string _connectionString;

        public DatabaseService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException(nameof(_connectionString), "Connection string not found");
        }

        public async Task<IEnumerable<T>> QueryAsync<T>(string sql, object? param = null)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                return await connection.QueryAsync<T>(sql, param);
            }
        }

        public async Task<T?> QuerySingleOrDefaultAsync<T>(string sql, object? param = null)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                return await connection.QuerySingleOrDefaultAsync<T>(sql, param);
            }
        }

        public async Task<int> ExecuteAsync(string sql, object? param = null)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                return await connection.ExecuteAsync(sql, param);
            }
        }

        public async Task<T> QuerySingleAsync<T>(string sql, object? param = null)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                return await connection.QuerySingleAsync<T>(sql, param);
            }
        }

        public async Task<int> ExecuteInsertAsync(string sql, object? param = null)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                var result = await connection.QuerySingleAsync<int>(sql + "; SELECT SCOPE_IDENTITY();", param);
                return result;
            }
        }
    }
}
