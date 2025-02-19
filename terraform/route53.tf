data "aws_route53_zone" "main_zone" {
  name = "jaredhayashi.com"
}

resource "aws_acm_certificate" "api_cert" {
  domain_name       = "api.jaredhayashi.com"
  validation_method = "DNS"
}

resource "aws_route53_record" "api_cert_validation_records" {
  for_each = {
    for dvo in aws_acm_certificate.api_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 300
  type            = each.value.type
  zone_id         = aws_route53_zone.main_zone.zone_id
}

resource "aws_acm_certificate_validation" "api_cert_validation" {
  certificate_arn         = aws_acm_certificate.api_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.api_cert_validation_records : record.fqdn]
}

# resource "aws_route53_record" "website_record" {
#   zone_id = aws_route53_zone.main_zone.zone_id
#   name    = "api.jaredhayashi.com"
#   type    = "A"

#   alias {
#     name                   = aws_cloudfront_distribution.cloudfront.domain_name
#     zone_id                = aws_cloudfront_distribution.cloudfront.hosted_zone_id
#     evaluate_target_health = false
#   }
# }

# resource "aws_route53_record" "website_record2" {
#   zone_id = aws_route53_zone.main_zone.zone_id
#   name    = "www.jaredhayashi.com"
#   type    = "A"

#   alias {
#     name                   = aws_cloudfront_distribution.cloudfront.domain_name
#     zone_id                = aws_cloudfront_distribution.cloudfront.hosted_zone_id
#     evaluate_target_health = false
#   }
# }
