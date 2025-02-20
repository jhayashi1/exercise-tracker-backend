provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = {
      Name    = "exercise-tracker-backend"
      git_url = "https://github.com/jhayashi1/exercise-tracker-backend"
    }
  }
}

data "aws_caller_identity" "current" {}

data "aws_vpc" "ipv6_only" {
  id = "vpc-0b5b0e62c550b9f83"
}

data "aws_route53_zone" "main_zone" {
  name = "jaredhayashi.com"
}
