resource "kubectl_manifest" "deployment" {
  depends_on = [
    kubernetes_namespace.lanchonete_ns,
    kubectl_manifest.db_migrate_job,
    kubectl_manifest.secrets,
    kubectl_manifest.configmap
  ]
  yaml_body = <<YAML
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tc4-item-api
  namespace: tc4-item
spec:
  replicas: 1
  selector:
    matchLabels:
      app: tc4-item-api
  template:
    metadata:
      labels:
        app: tc4-item-api
    spec:
      containers:
      - name: tc4-item-api
        image: fealves/tc4-item:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 3000
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 15
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        envFrom:
        - configMapRef:
            name: api-configmap
        - secretRef:
            name: api-secrets
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"

YAML
}