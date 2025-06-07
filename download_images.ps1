$urls = @{
    'hero-image.jpg' = 'https://source.unsplash.com/1600x900/?therapy,consulting'
    'profissional.jpg' = 'https://source.unsplash.com/800x600/?psychologist,professional'
    'logo.png' = 'https://source.unsplash.com/300x100/?logo,psychology'
}

# Criar pasta se não existir
if (-not (Test-Path -Path "assets\images")) {
    New-Item -ItemType Directory -Path "assets\images"
}

# Baixar cada imagem
foreach ($entry in $urls.GetEnumerator()) {
    $filename = $entry.Key
    $url = $entry.Value
    $filepath = Join-Path "assets\images" $filename
    
    try {
        Write-Host "Baixando $filename..."
        Invoke-WebRequest -Uri $url -OutFile $filepath
        Write-Host "$filename baixado com sucesso!"
    }
    catch {
        Write-Host "Erro ao baixar $filename: $_"
    }
}
