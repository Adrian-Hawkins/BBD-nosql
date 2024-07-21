resource "aws_default_vpc" "default_vpc" {
  tags = {
    Name = "Default VPC"
  }
}

data "aws_availability_zones" "available_zones" {}

resource "aws_default_subnet" "subnet_az1" {
  availability_zone = data.aws_availability_zones.available_zones.names[0]
}

resource "aws_default_subnet" "subnet_az2" {
  availability_zone = data.aws_availability_zones.available_zones.names[1]
}

resource "aws_security_group" "allow_postgres" {
  name        = "allow_postgres"
  description = "Allow PostgreSQL inbound traffic"
  vpc_id      = aws_default_vpc.default_vpc.id

  ingress {
    description = "PostgreSQL from anywhere"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

output "vpc_id" {
  value = aws_default_vpc.default_vpc.id
}

output "subnet_ids" {
  value = [aws_default_subnet.subnet_az1.id, aws_default_subnet.subnet_az2.id]
}

output "security_group_id" {
  value = aws_security_group.allow_postgres.id
}