# reestructurar.ps1
Write-Host "Reestructurando proyecto para que package.json esté en la raíz..." -ForegroundColor Green

# 1. Mover archivos de frontend/ a la raíz (excepto node_modules, .next, etc.)
$frontendPath = "frontend"
if (Test-Path $frontendPath) {
    Get-ChildItem -Path $frontendPath -Exclude "node_modules", ".next", "out", ".git" | ForEach-Object {
        $destino = Join-Path "." $_.Name
        if ($_.PSIsContainer) {
            # Si es carpeta, mover su contenido recursivamente
            Copy-Item -Path $_.FullName -Destination $destino -Recurse -Force
            Remove-Item -Path $_.FullName -Recurse -Force
        } else {
            # Si es archivo, mover directamente
            Move-Item -Path $_.FullName -Destination $destino -Force
        }
    }
    # Eliminar carpeta frontend vacía
    Remove-Item -Path $frontendPath -Force -ErrorAction SilentlyContinue
    Write-Host "Contenido de 'frontend/' movido a la raíz." -ForegroundColor Green
} else {
    Write-Host "La carpeta 'frontend/' no existe." -ForegroundColor Yellow
}

# 2. Ajustar scripts en package.json si es necesario (rutas relativas a backend)
$packageJson = "package.json"
if (Test-Path $packageJson) {
    $json = Get-Content $packageJson -Raw | ConvertFrom-Json
    $cambio = $false
    if ($json.scripts.dev -and $json.scripts.dev -match "cd frontend") {
        $json.scripts.dev = "next dev"
        $cambio = $true
    }
    if ($json.scripts.build -and $json.scripts.build -match "cd frontend") {
        $json.scripts.build = "next build"
        $cambio = $true
    }
    if ($cambio) {
        $json | ConvertTo-Json -Depth 10 | Set-Content $packageJson
        Write-Host "Scripts en package.json actualizados." -ForegroundColor Green
    }
}

# 3. Actualizar README.md para reflejar nueva estructura (si existe)
$readme = "README.md"
if (Test-Path $readme) {
    $contenido = Get-Content $readme -Raw
    $contenido = $contenido -replace "cd frontend", "cd ."
    $contenido = $contenido -replace "frontend/", ""
    Set-Content $readme $contenido
    Write-Host "README.md actualizado." -ForegroundColor Green
}

Write-Host "Reestructuración completada. Ahora ejecuta los comandos git para subir los cambios." -ForegroundColor Green