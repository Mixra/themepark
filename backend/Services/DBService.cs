using System.Data;
using System.Data.SqlClient;
using Dapper;
using Microsoft.Extensions.Configuration;

namespace backend.Services
{
    public class DatabaseService
    {
        private readonly string? _connectionString;

        public DatabaseService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            if (string.IsNullOrEmpty(_connectionString))
            {
                throw new NoNullAllowedException("Connection string not found");
            }
        }

        public async Task<List<T>> QueryAsync<T>(string sql, object? param = null)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var result = await connection.QueryAsync<T>(sql, param);
                return result.ToList();
            }
            
        }

        public async Task<int> ExecuteAsync(string sql, object? param = null)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                return await connection.ExecuteAsync(sql, param);
            }
        }
        
    }
}
