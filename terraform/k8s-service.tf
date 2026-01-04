resource "kubernetes_service" "api_service" {
  metadata {
    name      = "api-service"
    namespace = "tc4-item"
    annotations = {
      "service.beta.kubernetes.io/aws-load-balancer-type" = "nlb"
    }
  }
  spec {
    selector = {
      app = "tc4-item-api"
    }
    port {
      protocol    = "TCP"
      port        = 80
      target_port = 3000
    }
    type = "LoadBalancer"
  }
  depends_on = [kubernetes_namespace.lanchonete_ns]

}

resource "kubernetes_service" "api_service_internal" {
  metadata {
    name      = "api-service-internal"
    namespace = "tc4-item"
  }
  spec {
    selector = {
      app = "tc4-item-api"
    }
    port {
      protocol    = "TCP"
      port        = 80
      target_port = 3000
    }
    type = "ClusterIP"
  }
  depends_on = [kubernetes_namespace.lanchonete_ns]
}
