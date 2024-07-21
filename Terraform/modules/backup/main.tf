resource "aws_backup_vault" "age_backup_vault" {
  name = "age-backup-vault"
}

resource "aws_backup_plan" "age_backup_plan" {
  name = "age-backup-plan"

  rule {
    rule_name         = "age_backup_rule"
    target_vault_name = aws_backup_vault.age_backup_vault.name
    schedule          = "cron(0 1 * * ? *)"  # Daily backup at 1 AM UTC

    lifecycle {
      delete_after = 30
    }
  }
}

resource "aws_backup_selection" "age_backup_selection" {
  iam_role_arn = aws_iam_role.backup_role.arn
  name         = "age-backup-selection"
  plan_id      = aws_backup_plan.age_backup_plan.id

  resources = [
    var.efs_arn
  ]
}

resource "aws_iam_role" "backup_role" {
  name = "backup-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "backup.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "backup_policy" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup"
  role       = aws_iam_role.backup_role.name
}