resource "aws_ecr_repository" "api_repo" {
  name = var.repository_name
}

resource "aws_ecr_repository_policy" "api_repo_policy" {
  repository = aws_ecr_repository.api_repo.name

  policy = jsonencode({
    Version = "2008-10-17"
    Statement = [
      {
        Sid    = "AllowPullFromECS"
        Effect = "Allow"
        Principal = {
          Service = "ecs.amazonaws.com"
        }
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability"
        ]
      }
    ]
  })
}