# app/serializers.py

from rest_framework import serializers
from .models import WebApp, Environment, Instance

# Nested serializers for writing (POST)
class InstanceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instance
        exclude = ['environment'] 

class EnvironmentCreateSerializer(serializers.ModelSerializer):
    instance = InstanceCreateSerializer(many=True)

    class Meta:
        model = Environment
        exclude = ['webapp']

# Main serializer for POST requests
class WebAppCreateSerializer(serializers.ModelSerializer):
    environment = EnvironmentCreateSerializer()

    class Meta:
        model = WebApp
        fields = '__all__'

    def create(self, validated_data):
        env_data = validated_data.pop('environment')
        inst_data_list = env_data.pop('instance')

        webapp = WebApp.objects.create(**validated_data)
        environment = Environment.objects.create(webapp=webapp, **env_data)

        for inst_data in inst_data_list:
            Instance.objects.create(environment=environment, **inst_data)

        return webapp

# Nested serializers for reading (GET)
class InstanceListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instance
        fields = ['cpu', 'ram', 'storage', 'status', 'public_ip']

class EnvironmentListSerializer(serializers.ModelSerializer):
    instance_set = InstanceListSerializer(many=True, read_only=True)

    class Meta:
        model = Environment
        fields = ['port', 'env_vars', 'instance_set']

# Main serializer for GET requests
class WebAppListSerializer(serializers.ModelSerializer):
    environment_set = EnvironmentListSerializer(many=True, read_only=True)

    class Meta:
        model = WebApp
        fields = ['id', 'name', 'owner', 'region', 'template', 'plan_type', 'repo_url', 'environment_set']