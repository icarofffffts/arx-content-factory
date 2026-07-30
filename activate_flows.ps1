$API = "https://n8n.arxsolutions.cloud/api/v1"
$KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWQ1ODUyOC01YTRjLTQ2NDMtOGNlYi1lN2RjMDExNzI5NWYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNGFjYWQ0YmQtOGJjYy00Mjc3LTk3MDQtN2U1ZTVjYzNhMjE3IiwiaWF0IjoxNzc3OTIwODY4fQ.n7vnEc_O3LVGMk5zvrLV_VBd1iZy-gB6Iw8urtoAeHc"
$H = @{ "X-N8N-API-KEY" = $KEY; "Content-Type" = "application/json" }

# Check both workflows
Write-Host "=== Status dos Fluxos ===" -ForegroundColor Cyan
$all = Invoke-RestMethod -Uri "$API/workflows" -Headers $H -Method GET
$workflows = @(
    @{id="Id3FzEJC4bA4FCVI";name="LinkedIn"},
    @{id="AckgqzMmYGlvhcND";name="Instagram"},
    @{id="dQnhyh8LbQsiBhxq";name="Gerador"}
)
foreach ($w in $workflows) {
    $f = $all.data | Where-Object { $_.id -eq $w.id }
    if ($f) {
        Write-Host "$($w.name): active=$($f.active)"
    } else {
        Write-Host "$($w.name): NOT FOUND"
    }
}

# Activate LinkedIn
Write-Host ""
Write-Host "=== Ativando LinkedIn ===" -ForegroundColor Yellow
try {
    $r = Invoke-RestMethod -Uri "$API/workflows/Id3FzEJC4bA4FCVI/activate" -Headers $H -Method POST
    Write-Host "LinkedIn ativado!" -ForegroundColor Green
} catch {
    Write-Host "ERRO:" $_.Exception.Message -ForegroundColor Red
}

Start-Sleep -Seconds 2

# Activate Instagram
Write-Host "=== Ativando Instagram ===" -ForegroundColor Yellow
try {
    $r2 = Invoke-RestMethod -Uri "$API/workflows/AckgqzMmYGlvhcND/activate" -Headers $H -Method POST
    Write-Host "Instagram ativado!" -ForegroundColor Green
} catch {
    Write-Host "ERRO:" $_.Exception.Message -ForegroundColor Red
}