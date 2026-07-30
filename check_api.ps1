$API = "https://n8n.arxsolutions.cloud/api/v1"
$KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWQ1ODUyOC01YTRjLTQ2NDMtOGNlYi1lN2RjMDExNzI5NWYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNGFjYWQ0YmQtOGJjYy00Mjc3LTk3MDQtN2U1ZTVjYzNhMjE3IiwiaWF0IjoxNzc3OTIwODY4fQ.n7vnEc_O3LVGMk5zvrLV_VBd1iZy-gB6Iw8urtoAeHc"
$H = @{ "X-N8N-API-KEY" = $KEY; "Content-Type" = "application/json" }

# Check API capabilities
Write-Host "=== Checking API ===" -ForegroundColor Cyan
try {
    $r = Invoke-RestMethod -Uri "$API/workflows" -Headers $H -Method GET
    Write-Host "API OK - Count:" $r.data.Count
    # Find workflow details
    $f2 = $r.data | Where-Object { $_.id -eq "Id3FzEJC4bA4FCVI" }
    Write-Host "Fluxo 2 name:" $f2.name
    Write-Host "Fluxo 2 active:" $f2.active
} catch {
    Write-Host "ERRO:" $_.Exception.Message -ForegroundColor Red
}