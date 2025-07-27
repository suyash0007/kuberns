import boto3
import os
from dotenv import load_dotenv

# Make sure your .env file is loaded at the start
load_dotenv()

AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

# The key is a tuple of (cpu, ram_in_mb)
INSTANCE_TYPE_MAP = {
    (1, 1024): 't3.micro',  # 1 CPU, 1GB RAM (Free Tier Eligible)
    (2, 2048): 't3.small',  # 2 CPU, 2GB RAM
    (2, 4096): 't3.medium', # 2 CPU, 4GB RAM
    (4, 8192): 't3.large',  # 4 CPU, 8GB RAM
} 

def get_instance_type_from_specs(cpu, ram):
    """Translates CPU and RAM to a known EC2 instance type."""
    # Convert RAM from MB to GB for easier lookup if needed, but the mapping
    # uses MB so we can use the raw value directly.
    instance_type = INSTANCE_TYPE_MAP.get((cpu, ram))
    if not instance_type:
        # Fallback to a default if the combination is not found
        print(f"Warning: No matching instance type for CPU={cpu}, RAM={ram}. Using t3.micro as a fallback.")
        return 't3.micro'
    return instance_type

def get_latest_ami_id(region):
    """
    Fetches the latest Amazon Linux 2023 AMI ID from SSM Parameter Store.
    """
    ssm_client = boto3.client('ssm', region_name=region)
    # This public parameter path is maintained by AWS and always points to the latest AMI.
    # Use different paths for other operating systems.
    ami_param_path = '/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64'
    
    try:
        response = ssm_client.get_parameter(Name=ami_param_path, WithDecryption=False)
        return response['Parameter']['Value']
    except Exception as e:
        print(f"Error fetching AMI ID from SSM: {e}")
        raise

def create_ec2_instance(region, cpu, ram):
    """
    Launches a new EC2 instance with a dynamic instance type.
    """
    ami_id = get_latest_ami_id(region)
    
    # Get the instance type based on the provided CPU and RAM
    instance_type = get_instance_type_from_specs(cpu, ram)
    
    ec2 = boto3.resource(
        'ec2',
        region_name=region,
        aws_access_key_id=AWS_ACCESS_KEY,
        aws_secret_access_key=AWS_SECRET_KEY
    )

    print(f"Launching instance type '{instance_type}' with AMI ID: {ami_id} in region: {region}")

    try:
        instance = ec2.create_instances(
            ImageId=ami_id,
            InstanceType=instance_type,  # Use the dynamically determined instance type
            MinCount=1,
            MaxCount=1,
            TagSpecifications=[{
                'ResourceType': 'instance',
                'Tags': [{'Key': 'Name', 'Value': 'KubernsAppInstance'}]
            }]
        )[0]

        instance.wait_until_running()
        instance.reload()
        
        return instance.public_ip_address

    except Exception as e:
        print(f"Error launching EC2 instance: {e}")
        raise