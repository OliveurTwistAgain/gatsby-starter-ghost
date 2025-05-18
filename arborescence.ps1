# arborescence.ps1
$base = "C:\Users\OlivEur\Documents\Github\gatsby-starter-ghost"
$excludeDirs = @("node_modules", ".cache", "public")
$maxDepth = 2
$output = "structure-clean.txt"

function Show-Tree {
    param (
        [string]$Path,
        [int]$Level
    )
    if ($Level -gt $maxDepth) { return }
    $indent = " " * ($Level * 2)
    Get-ChildItem -LiteralPath $Path | ForEach-Object {
        $name = $_.Name
        if ($_.PSIsContainer) {
            if ($excludeDirs -notcontains $name) {
                "$indent📁 $name" | Out-File -Append $output
                Show-Tree -Path $_.FullName -Level ($Level + 1)
            }
        }
        else {
            "$indent📄 $name" | Out-File -Append $output
        }
    }
}

if (Test-Path $output) { Remove-Item $output }
"📦 Arborescence du projet : $base`n" | Out-File $output
Show-Tree -Path $base -Level 0
notepad $output
# This script generates a tree structure of the specified directory, excluding certain directories and limiting the depth.
# It uses PowerShell to recursively list files and directories, formatting the output with indentation and icons.