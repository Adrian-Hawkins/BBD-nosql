output "cluster_arn" {
  value = aws_ecs_cluster.api_cluster.arn
}

output "service_name" {
  value = aws_ecs_service.api_service.name
}