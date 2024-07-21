module "networking" {
  source = "./modules/networking"
}

module "ecs" {
  source = "./modules/ecs"
  vpc_id = module.networking.vpc_id
  subnet_ids = module.networking.subnet_ids
  db_username = var.db_username
  db_password = var.db_password
  efs_id = module.storage.efs_id
  security_group_id = module.networking.security_group_id
  target_group_arn = module.load_balancer.target_group_arn
}

module "load_balancer" {
  source = "./modules/load_balancer"
  vpc_id = module.networking.vpc_id
  subnet_ids = module.networking.subnet_ids
}

module "storage" {
  source = "./modules/storage"
  vpc_id = module.networking.vpc_id
  subnet_id = module.networking.subnet_ids[0]
}

module "backup" {
  source = "./modules/backup"
  efs_arn = module.storage.efs_arn
}

output "database_endpoint" {
  description = "The endpoint URL to connect to the database"
  value       = "${module.load_balancer.nlb_dns_name}:5432"
}