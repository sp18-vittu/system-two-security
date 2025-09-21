variable "aws_region" {
  description = "The AWS region to deploy resources"
  type        = string
}

variable "aws_account_id" {
  description = "The AWS account ID"
  type        = string
}

variable "ecr_repo" {
  description = "The ECR repository for the Docker image"
  type        = string
}

variable "image_tag" {
  description = "The image tag for the Docker image"
  type        = string
}

# AWS Provider
provider "aws" {
  region = var.aws_region
}

resource "aws_ecs_task_definition" "this" {
  family                   = "prod-webapp-td"
  task_role_arn            = "arn:aws:iam::143364003363:role/ecs-executionrole"
  execution_role_arn       = "arn:aws:iam::143364003363:role/ecs-executionrole"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "1024"
  memory                   = "2048"

  container_definitions = jsonencode([
    {
      name  = "webapp"
      image = "143364003363.dkr.ecr.us-west-2.amazonaws.com/prod/s2s-webapp:${var.image_tag}"
      cpu   = 0
      portMappings = [
        {
          containerPort = 3001
          hostPort      = 3001
          protocol      = "tcp"
          appProtocol   = "http"
        }
      ]
      essential = true

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/prod-webapp"
          "mode"                  = "non-blocking"
          "awslogs-create-group"  = "true"
          "max-buffer-size"       = "25m"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  runtime_platform {
    cpu_architecture         = "ARM64"
    operating_system_family  = "LINUX"
  }
}