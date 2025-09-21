# =======================
# Variable Definitions
# =======================

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

variable "environment" {
  description = "Deployment environment (dev, qa, demo, prod)"
  type        = string
}

variable "cpu_architecture" {
  description = "CPU architecture for the ECS task"
  type        = string
  default     = "ARM64"  
}

# =======================
# Provider Configuration
# =======================

provider "aws" {
  region = var.aws_region
}

# =======================
# ECS Task Definition
# =======================

resource "aws_ecs_task_definition" "this" {
  family                   = "${var.environment}-webapp-td"
  task_role_arn            = "arn:aws:iam::${var.aws_account_id}:role/ecs-executionrole"
  execution_role_arn       = "arn:aws:iam::${var.aws_account_id}:role/ecs-executionrole"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "1024"
  memory                   = "2048"

  container_definitions = jsonencode([
    {
      name  = "webapp"
      image = "${var.ecr_repo}:${var.image_tag}"
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
          "awslogs-group"         = "/ecs/${var.environment}-webapp"
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
    cpu_architecture        = var.cpu_architecture
    operating_system_family = "LINUX"
  }
}

# =======================
# Outputs
# =======================

output "ecs_task_definition_arn" {
  description = "The ARN of the ECS Task Definition"
  value       = aws_ecs_task_definition.this.arn
}

output "ecs_task_definition_family" {
  description = "The family of the ECS Task Definition"
  value       = aws_ecs_task_definition.this.family
}
