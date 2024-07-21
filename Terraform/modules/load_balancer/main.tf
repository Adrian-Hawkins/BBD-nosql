resource "aws_lb" "age_nlb" {
  name               = "age-nlb"
  internal           = false
  load_balancer_type = "network"
  subnets            = var.subnet_ids

  enable_deletion_protection = false
}

resource "aws_lb_target_group" "age_tg" {
  name        = "age-tg"
  port        = 5432
  protocol    = "TCP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    interval            = 30
    port                = 5432
    protocol            = "TCP"
    healthy_threshold   = 3
    unhealthy_threshold = 3
  }
}

resource "aws_lb_listener" "age_listener" {
  load_balancer_arn = aws_lb.age_nlb.arn
  port              = 5432
  protocol          = "TCP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.age_tg.arn
  }
}

output "target_group_arn" {
  value = aws_lb_target_group.age_tg.arn
}

output "nlb_dns_name" {
  value = aws_lb.age_nlb.dns_name
}