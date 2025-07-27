# app/views.py
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import WebApp, DeploymentLog
from .serializers import WebAppCreateSerializer, WebAppListSerializer
from .aws import create_ec2_instance

class WebAppCreateView(APIView):
    def post(self, request):
        serializer = WebAppCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                # Use a database transaction to ensure atomicity for core data
                print("Serializer is valid. Attempting to save data and launch instance...")
                
                with transaction.atomic():
                    # All database and external calls are now in the atomic block
                    webapp = serializer.save()
                    
                    environment = webapp.environment.first()
                    if not environment:
                        raise ValueError("Failed to retrieve new environment object.")
                    
                    instance = environment.instance_set.first()
                    if not instance:
                        raise ValueError("Failed to retrieve new instance object.")
                    
                    region = webapp.region
                    cpu = instance.cpu
                    ram = instance.ram
                    
                    public_ip = create_ec2_instance(region, cpu=cpu, ram=ram)
                    
                    instance.public_ip = public_ip
                    instance.status = 'active'
                    instance.save()
                
                # If the transaction block above succeeds, the DeploymentLog is created here.
                # This ensures that even if logging fails, the core objects are not rolled back.
                DeploymentLog.objects.create(
                    webapp=webapp,
                    status="completed",
                    message=f"Deployed EC2 instance at {public_ip} successfully."
                )

                print("Deployment successful.")
                return Response({"message": "WebApp created & EC2 instance launched", "public_ip": public_ip}, status=status.HTTP_201_CREATED)
            
            except Exception as e:
                # The transaction will automatically be rolled back on this exception
                # The webapp and instance objects will be deleted from the database.
                print("=====================================================")
                print("An error occurred during deployment:")
                print(e)
                print("=====================================================")

                # Create a failed log without linking it to a webapp object
                # (as it no longer exists after the rollback).
                DeploymentLog.objects.create(
                    status="failed",
                    message=f"Deployment failed before completing. Reason: {e}"
                )
                
                return Response({"error": f"Deployment failed. Reason: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        else:
            print("Serializer validation failed:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        webapps = WebApp.objects.all().prefetch_related('environment__instance_set')
        serializer = WebAppListSerializer(webapps, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)