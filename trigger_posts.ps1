$API = "https://n8n.arxsolutions.cloud/api/v1"
$KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWQ1ODUyOC01YTRjLTQ2NDMtOGNlYi1lN2RjMDExNzI5NWYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNGFjYWQ0YmQtOGJjYy00Mjc3LTk3MDQtN2U1ZTVjYzNhMjE3IiwiaWF0IjoxNzc3OTIwODY4fQ.n7vnEc_O3LVGMk5zvrLV_VBd1iZy-gB6Iw8urtoAeHc"
$H = @{ "X-N8N-API-KEY" = $KEY; "Content-Type" = "application/json" }

Write-Host "=== LinkedIn ===" -ForegroundColor Cyan
try {
    $r = Invoke-RestMethod -Uri "$API/workflows/Id3FzEJC4bA4FCVI/execute" -Headers $H -Method POST -Body "{}"
    Write-Host "OK - Execution ID:" $r.executionId -ForegroundColor Green
} catch {
    Write-Host "ERRO LinkedIn:" $_.Exception.Message -ForegroundColor Red
}

Start-Sleep -Seconds 3

Write-Host "=== Instagram ===" -ForegroundColor Cyan
try {
    $r2 = Invoke-RestMethod -Uri "$API/workflows/AckgqzMmYGlvhcND/execute" -Headers $H -Method POST -Body "{}"
    Write-Host "OK - Execution ID:" $r2.executionId -ForegroundColor Green
} catch {
    Write-Host "ERRO Instagram:" $_.Exception.Message -ForegroundColor Red
}