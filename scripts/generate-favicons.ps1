Add-Type -AssemblyName System.Drawing

function Resize-PngImage([string]$srcPath, [string]$destPath, [int]$width, [int]$height) {
    $srcImage = [System.Drawing.Image]::FromFile($srcPath)
    $destBitmap = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($destBitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.DrawImage($srcImage, 0, 0, $width, $height)
    $destBitmap.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $destBitmap.Dispose()
    $srcImage.Dispose()
    Write-Host "Created $destPath ($width x $height)"
}

$src = 'c:\Users\bhave\OneDrive\Desktop\Projects\Bliss Balance\public\icon.png'
Resize-PngImage $src 'c:\Users\bhave\OneDrive\Desktop\Projects\Bliss Balance\public\favicon-48x48.png' 48 48
Resize-PngImage $src 'c:\Users\bhave\OneDrive\Desktop\Projects\Bliss Balance\public\favicon.png' 48 48
Resize-PngImage $src 'c:\Users\bhave\OneDrive\Desktop\Projects\Bliss Balance\public\favicon-96x96.png' 96 96
Resize-PngImage $src 'c:\Users\bhave\OneDrive\Desktop\Projects\Bliss Balance\public\favicon-144x144.png' 144 144
Resize-PngImage $src 'c:\Users\bhave\OneDrive\Desktop\Projects\Bliss Balance\public\favicon-192x192.png' 192 192
Resize-PngImage $src 'c:\Users\bhave\OneDrive\Desktop\Projects\Bliss Balance\public\icon-192.png' 192 192
Resize-PngImage $src 'c:\Users\bhave\OneDrive\Desktop\Projects\Bliss Balance\public\icon-512.png' 512 512
Resize-PngImage $src 'c:\Users\bhave\OneDrive\Desktop\Projects\Bliss Balance\public\apple-touch-icon.png' 180 180

Write-Host "All favicons generated successfully!"
