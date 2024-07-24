variable "db_username" {
  description = "Username for the PostgreSQL database"
  type        = string
}

variable "db_password" {
  description = "Password for the PostgreSQL database"
  type        = string
  sensitive   = true
}

variable "db_connection_string" {
  description = "Database connection string"
  type        = string
}

variable "image_tag" {
  description = "Tag of the Docker image"
  type        = string
}