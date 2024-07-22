resource "aws_ecs_cluster" "api_cluster" {
  name = var.cluster_name
}

resource "aws_ecs_task_definition" "api_task" {
  family                   = var.task_family
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.task_cpu
  memory                   = var.task_memory
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = var.container_name
      image = "${var.ecr_repository_url}:latest"
      portMappings = [
        {
          containerPort = 8888
          hostPort      = 8888
        }
      ]
      environment = [
        {
          name  = "DB_CONNECTION_STRING"
          value = var.db_connection_string
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "api_service" {
  name            = var.service_name
  cluster         = aws_ecs_cluster.api_cluster.id
  task_definition = aws_ecs_task_definition.api_task.arn
  launch_type     = "FARGATE"
  desired_count   = var.desired_count

  network_configuration {
    subnets          = var.subnet_ids
    assign_public_ip = true
    security_groups  = [aws_security_group.api_sg.id]
  }

  load_balancer {
    target_group_arn = var.target_group_arn
    container_name   = var.container_name
    container_port   = 8888
  }
}

resource "aws_security_group" "api_sg" {
  name        = "api-sg"
  description = "Security group for API ECS tasks"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 8888
    to_port     = 8888
    protocol    = "tcp"
    security_groups = [var.alb_security_group_id] 
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_iam_role" "ecs_execution_role" {
  name = "api-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}