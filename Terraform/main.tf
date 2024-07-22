
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_ecr_repository" "api_repo" {
  name = "api-repo"
}

module "networking" {
  source = "./modules/networking"
}

module "api_ecr" {
  source          = "./modules/api_ecr"
  repository_name = "api-repo"
}

module "api_load_balancer" {
  source     = "./modules/api_load_balancer"
  vpc_id     = data.aws_vpc.default.id
  subnet_ids = data.aws_subnets.default.ids
}

module "api_ecs" {
  source                 = "./modules/api_ecs"
  cluster_name           = "api-cluster"
  task_family            = "api-task"
  task_cpu               = "256"
  task_memory            = "512"
  container_name         = "api-container"
  ecr_repository_url     = data.aws_ecr_repository.api_repo.repository_url
  db_connection_string   = var.db_connection_string
  service_name           = "api-service"
  desired_count          = 1
  subnet_ids             = data.aws_subnets.default.ids
  vpc_id                 = data.aws_vpc.default.id
  target_group_arn       = module.api_load_balancer.target_group_arn
  alb_security_group_id  = module.api_load_balancer.alb_security_group_id
}

module "ecs" {
  source            = "./modules/ecs"
  vpc_id            = module.networking.vpc_id
  subnet_ids        = module.networking.subnet_ids
  db_username       = var.db_username
  db_password       = var.db_password
  efs_id            = module.storage.efs_id
  security_group_id = module.networking.security_group_id
  target_group_arn  = module.load_balancer.target_group_arn
}

module "load_balancer" {
  source     = "./modules/load_balancer"
  vpc_id     = module.networking.vpc_id
  subnet_ids = module.networking.subnet_ids
}

module "storage" {
  source    = "./modules/storage"
  vpc_id    = module.networking.vpc_id
  subnet_id = module.networking.subnet_ids[0]
}

module "backup" {
  source  = "./modules/backup"
  efs_arn = module.storage.efs_arn
}

output "database_endpoint" {
  description = "The endpoint URL to connect to the database"
  value       = "${module.load_balancer.nlb_dns_name}:5432"
}