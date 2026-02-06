# PowerShell script to download all Stitch HTML screens

$downloads = @(
    @{filename="landing-page.html"; url="https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2MzNjhmNjIzODdiNTRhMGI5MzRiNTA3M2Y0NzZiMDNjEgsSBxCU8LiulQIYAZIBIwoKcHJvamVjdF9pZBIVQhMxMDIxNDg4MDA5NzI5MjE2NjEx&filename=&opi=89354086"},
    @{filename="student-dashboard.html"; url="https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzdlMmVkOTNiNjhjNzQ1N2RhOGFiZjAxOGU1MzZmMzYwEgsSBxCU8LiulQIYAZIBIwoKcHJvamVjdF9pZBIVQhMxMDIxNDg4MDA5NzI5MjE2NjEx&filename=&opi=89354086"},
    @{filename="teacher-portal.html"; url="https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2IyMGE4MmZmZDA5ZjQyMTM5YjdkYjBhODUyZDJlNWViEgsSBxCU8LiulQIYAZIBIwoKcHJvamVjdF9pZBIVQhMxMDIxNDg4MDA5NzI5MjE2NjEx&filename=&opi=89354086"},
    @{filename="signup.html"; url="https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzI1NWY1ZTAxOWE5MTQxZjU5MjQ4YjQyOGRmNmVlNmQ2EgsSBxCU8LiulQIYAZIBIwoKcHJvamVjdF9pZBIVQhMxMDIxNDg4MDA5NzI5MjE2NjEx&filename=&opi=89354086"},
    @{filename="ai-quiz-creator.html"; url="https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzExMTU1NDMxMWM1MjQxYWJiZGY3MTA0ZDcwZmFhNzJiEgsSBxCU8LiulQIYAZIBIwoKcHJvamVjdF9pZBIVQhMxMDIxNDg4MDA5NzI5MjE2NjEx&filename=&opi=89354086"},
    @{filename="manual-quiz-editor.html"; url="https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2JjMTQ4ZmY5YWExNzQwNTNiNWRlNWM3NmVhYTEyNjk4EgsSBxCU8LiulQIYAZIBIwoKcHJvamVjdF9pZBIVQhMxMDIxNDg4MDA5NzI5MjE2NjEx&filename=&opi=89354086"},
    @{filename="step-by-step-creator.html"; url="https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzMxYTgzMGQzZTE4NjRmZGFiYzg4YTljOWZjM2ZlYjIyEgsSBxCU8LiulQIYAZIBIwoKcHJvamVjdF9pZBIVQhMxMDIxNDg4MDA5NzI5MjE2NjEx&filename=&opi=89354086"},
    @{filename="active-quiz.html"; url="https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAxZjIyODU0ZGYwOTQ3NjViOGRmYzkyY2RiODUwNmM1EgsSBxCU8LiulQIYAZIBIwoKcHJvamVjdF9pZBIVQhMxMDIxNDg4MDA5NzI5MjE2NjEx&filename=&opi=89354086"},
    @{filename="quiz-management.html"; url="https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzZjZDAyNzdiYWRjYjQ5ZjZhNzM3NzZiYzI0MzNlZGFiEgsSBxCU8LiulQIYAZIBIwoKcHJvamVjdF9pZBIVQhMxMDIxNDg4MDA5NzI5MjE2NjEx&filename=&opi=89354086"},
    @{filename="performance-feedback.html"; url="https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzVjM2E0ZmVhZWVjODQ4N2U5ZmRjOGM0NGU0YmU0YWVkEgsSBxCU8LiulQIYAZIBIwoKcHJvamVjdF9pZBIVQhMxMDIxNDg4MDA5NzI5MjE2NjEx&filename=&opi=89354086"},
    @{filename="quiz-progress.html"; url="https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzNlMmJkNjExYzVjOTQ4YTVhOWI3ZDE3ZDE3YThjYjIxEgsSBxCU8LiulQIYAZIBIwoKcHJvamVjdF9pZBIVQhMxMDIxNDg4MDA5NzI5MjE2NjEx&filename=&opi=89354086"},
    @{filename="quiz-config-modal.html"; url="https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzNkOWI1YzVlZDM1NTQ5YTk4ZmM2Mjc1ZGY3OWQ0NjUxEgsSBxCU8LiulQIYAZIBIwoKcHJvamVjdF9pZBIVQhMxMDIxNDg4MDA5NzI5MjE2NjEx&filename=&opi=89354086"},
    @{filename="ai-quiz-creator-v2.html"; url="https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzlhMjlkOTM1MGQ2NTQxYjc4ZDhhOTUyMTUyMWViNTVjEgsSBxCU8LiulQIYAZIBIwoKcHJvamVjdF9pZBIVQhMxMDIxNDg4MDA5NzI5MjE2NjEx&filename=&opi=89354086"}
)

Write-Host "Downloading 13 Stitch HTML screens..." -ForegroundColor Green

foreach ($download in $downloads) {
    Write-Host "Downloading $($download.filename)..." -ForegroundColor Cyan
    try {
        Invoke-WebRequest -Uri $download.url -OutFile "stitch-exports\$($download.filename)"
        Write-Host "  ✓ Downloaded $($download.filename)" -ForegroundColor Green
    }
    catch {
        Write-Host "  ✗ Failed to download $($download.filename): $_" -ForegroundColor Red
    }
}

Write-Host "`nAll downloads complete!" -ForegroundColor Green
