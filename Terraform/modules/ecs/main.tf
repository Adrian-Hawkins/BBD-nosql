resource "aws_ecs_cluster" "age_cluster" {
  name = "age-cluster"
}

resource "aws_ecs_task_definition" "age_task" {
  family                   = "age-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "1024"
  memory                   = "2048"

  container_definitions = jsonencode([
    {
      name  = "age-container"
      image = "apache/age:latest"
      portMappings = [
        {
          containerPort = 5432
          hostPort      = 5432
        }
      ]
      environment = [
        { name = "POSTGRES_USER", value = var.db_username },
        { name = "POSTGRES_PASSWORD", value = var.db_password },
        { name = "POSTGRES_DB", value = "dev" }
      ]
      mountPoints = [
        {
          sourceVolume  = "efs-volume"
          containerPath = "/var/lib/postgresql/data"
        }
      ]
    }
  ])

  volume {
    name = "efs-volume"
    efs_volume_configuration {
      file_system_id = var.efs_id
    }
  }
}

resource "aws_ecs_service" "age_service" {
  name            = "age-service"
  cluster         = aws_ecs_cluster.age_cluster.id
  task_definition = aws_ecs_task_definition.age_task.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets          = var.subnet_ids
    assign_public_ip = true
    security_groups  = [var.security_group_id]
  }

  load_balancer {
    target_group_arn = var.target_group_arn
    container_name   = "age-container"
    container_port   = 5432
  }
}