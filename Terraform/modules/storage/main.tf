resource "aws_efs_file_system" "age_data" {
  creation_token = "age-data"
  encrypted      = true

  tags = {
    Name = "AGE Data"
  }
}

resource "aws_efs_mount_target" "age_data_mount" {
  file_system_id  = aws_efs_file_system.age_data.id
  subnet_id       = var.subnet_id
  security_groups = [aws_security_group.allow_efs.id]
}

resource "aws_security_group" "allow_efs" {
  name        = "allow_efs"
  description = "Allow EFS inbound traffic"
  vpc_id      = var.vpc_id

  ingress {
    description = "NFS from VPC"
    from_port   = 2049
    to_port     = 2049
    protocol    = "tcp"
    cidr_blocks = [data.aws_vpc.selected.cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "aws_vpc" "selected" {
  id = var.vpc_id
}

output "efs_id" {
  value = aws_efs_file_system.age_data.id
}

output "efs_arn" {
  value = aws_efs_file_system.age_data.arn
}