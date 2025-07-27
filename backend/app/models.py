from django.db import models

class WebApp(models.Model):
    name = models.CharField(max_length=100)
    owner = models.CharField(max_length=100)
    region = models.CharField(max_length=50)
    template = models.CharField(max_length=50)
    plan_type = models.CharField(max_length=20)
    repo_url = models.URLField()

class Environment(models.Model):
    webapp = models.ForeignKey(WebApp, on_delete=models.CASCADE,related_name='environment')
    port = models.IntegerField()
    env_vars = models.JSONField(default=dict)

class Instance(models.Model):
    environment = models.ForeignKey(Environment, on_delete=models.CASCADE)
    cpu = models.IntegerField()
    ram = models.IntegerField()
    storage = models.IntegerField()
    status = models.CharField(max_length=20, default="pending")
    public_ip = models.GenericIPAddressField(null=True, blank=True)

class DeploymentLog(models.Model):
    webapp = models.ForeignKey(WebApp, on_delete=models.CASCADE, related_name="deployment_logs", null=True,blank=True)
    status = models.CharField(max_length=50)  # e.g., "pending", "deploying", "completed"
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


