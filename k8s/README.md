//Executar comandos de apply no minikube


kubectl apply -f userineventservice-deployment.yaml
kubectl apply -f userineventservice-service.yaml

kubectl apply -f postgres-storage.yaml
kubectl apply -f postgres-deployment.yaml 



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