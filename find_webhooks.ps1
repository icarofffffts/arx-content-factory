$API = "https://n8n.arxsolutions.cloud"
$KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWQ1ODUyOC01YTRjLTQ2NDMtOGNlYi1lN2RjMDExNzI5NWYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNGFjYWQ0YmQtOGJjYy00Mjc3LTk3MDQtN2U1ZTVjYzNhMjE3IiwiaWF0IjoxNzc3OTIwODY4fQ.n7vnEc_O3LVGMk5zvrLV_VBd1iZy-gB6Iw8urtoAeHc"

# Find webhook IDs for LinkedIn and Instagram
$H = @{ "X-N8N-API-KEY" = $KEY; "Content-Type" = "application/json" }

# Get workflow webhooks
Write-Host "=== LinkedIn webhooks ===" -ForegroundColor Cyan
$f2 = Invoke-RestMethod -Uri "https://n8n.arxsolutions.cloud/api/v1/workflows/Id3FzEJC4bA4FCVI" -Headers $H -Method GET
$f2.nodes | Where-Object { $_.type -like "*webhook*" } | ForEach-Object {
    Write-Host "Webhook path:" $_.parameters.path "ID:" $_.id
}

Write-Host "=== Instagram webhooks ===" -ForegroundColor Cyan
$f3 = Invoke-RestMethod -Uri "https://n8n.arxsolutions.cloud/api/v1/workflows/AckgqzMmYGlvhcND" -Headers $H -Method GET
$f3.nodes | Where-Object { $_.type -like "*webhook*" } | ForEach-Object {
    Write-Host "Webhook path:" $_.parameters.path "ID:" $_.id
}