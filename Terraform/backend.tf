terraform {
  backend "s3" {
    bucket = "nosqlbckt"
    key    = "terraform.tfstate"
    region = "eu-west-1"
  }
}
