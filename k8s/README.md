//Executar comandos de apply no minikube


kubectl apply -f userineventservice-deployment.yaml
kubectl apply -f userineventservice-service.yaml





PRIMEIRO:
userineventservice-deployment

SEGUNDO:
userineventservice-service

TERCEIRO:
postgres-storage

QUARTO:
postgres-deployment


COMANDO PARA ABRIR O TUNEL DO MINIKUBE:
minikube tunnel