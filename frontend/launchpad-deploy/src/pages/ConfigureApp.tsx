import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, X, Server, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";

interface EnvVariable {
  key: string;
  value: string;
}

interface PlanDetail {
  name: string;
  storage: number;
  bandwidth: string;
  memory: number; // in MB
  cpu: number;   // vCPU
  monthlyCost: string;
  hourlyRate: string;
}

interface PlanDetailsMap {
  [key: string]: PlanDetail;
}

interface LocationState {
  formData: {
    organization: string;
    repository: string;
    branch: string;
    appName: string;
    region: string;
    framework: string;
    planType: string;
    useDatabase: boolean;
  };
  planDetails: PlanDetailsMap;
}

// Define a default FormData object to use as a fallback
const defaultFormData = {
  organization: "",
  repository: "",
  branch: "",
  appName: "",
  region: "",
  framework: "",
  planType: "starter", // The default planType is now correctly defined
  useDatabase: false,
};

const ConfigureApp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Destructure formData and planDetails from location.state
  const { formData: initialFormData, planDetails } = (location.state as LocationState) || { 
      formData: defaultFormData, // Use the default form data here
      planDetails: {} 
  };

  // Explicitly type the useState hook and provide the default value
  const [formData, setFormData] = useState<typeof defaultFormData>(initialFormData);
  const [portConfig, setPortConfig] = useState<"random" | "custom">("random");
  const [customPort, setCustomPort] = useState("");
  const [envVariables, setEnvVariables] = useState<EnvVariable[]>([
    { key: "", value: "" }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If formData or planDetails are missing, redirect
    if (!initialFormData || Object.keys(planDetails).length === 0) {
      navigate("/");
    }
  }, [initialFormData, planDetails, navigate]);

  const addEnvVariable = () => {
    setEnvVariables([...envVariables, { key: "", value: "" }]);
  };

  const removeEnvVariable = (index: number) => {
    if (envVariables.length > 1) {
      setEnvVariables(envVariables.filter((_, i) => i !== index));
    }
  };

  const updateEnvVariable = (index: number, field: "key" | "value", value: string) => {
    const updated = envVariables.map((env, i) => 
      i === index ? { ...env, [field]: value } : env
    );
    setEnvVariables(updated);
  };

  const generateRandomPort = () => {
    return Math.floor(Math.random() * (9999 - 3000) + 3000).toString();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const finalPort = portConfig === "random" ? generateRandomPort() : customPort;
    const validEnvVars = envVariables.filter(env => env.key.trim() !== "");

    const selectedPlan = planDetails[formData.planType];

    const envVarsObject = validEnvVars.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});

    const deploymentData = {
      name: formData.appName,
      owner: "user",
      region: formData.region,
      template: formData.framework,
      plan_type: formData.planType,
      repo_url: `https://github.com/${formData.organization}/${formData.repository}`,
      environment: {
        port: parseInt(finalPort, 10),
        env_vars: envVarsObject,
        instance: [
          {
            cpu: selectedPlan.cpu,
            ram: selectedPlan.memory,
            storage: selectedPlan.storage,
            status: "pending"
          }
        ]
      }
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/webapps/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deploymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Deployment failed on server.");
      }

      const result = await response.json();
      
      toast({
        title: "Deployment Started!",
        description: `Your app "${formData.appName}" is being deployed. Public IP: ${result.public_ip || 'N/A'}`,
      });
      setTimeout(() => {
        toast({
          title: "Deployment Successful!",
          description: `Your app is now live at ${result.public_ip ? `http://${result.public_ip}` : 'a random IP'}`,
        });
        
        // This is the line that performs the redirect.
        navigate('/');
        
      }, 3000);

    } catch (error) {
      console.error("Deployment error:", error);
      toast({
        title: "Deployment Failed!",
        description: `Error: ${error.message || "An unexpected error occurred."}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Create New App</h1>
          <StepIndicator currentStep={2} totalSteps={2} />
        </div>
        <p className="text-muted-foreground mb-8">
          Connect your repository and fill in the requirements to see the app deployed in seconds.
        </p>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="w-5 h-5" />
                <span>Port Configuration</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                You can choose a specific port for your application or let us assign a random port automatically.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={portConfig} onValueChange={(value: "random" | "custom") => setPortConfig(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="random" id="random" />
                  <Label htmlFor="random">Assign a random port</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">Set a Custom Port</Label>
                </div>
              </RadioGroup>
              
              {portConfig === "custom" && (
                <div className="mt-4">
                  <Label htmlFor="customPort">Custom Port</Label>
                  <Input
                    id="customPort"
                    type="number"
                    placeholder="Enter port number (e.g., 3000)"
                    value={customPort}
                    onChange={(e) => setCustomPort(e.target.value)}
                    className="w-64"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Configure Environment Variables</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage and customize environment variables for your deployment.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {envVariables.map((env, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`key-${index}`} className="sr-only">Key</Label>
                        <Input
                          id={`key-${index}`}
                          placeholder="Key"
                          value={env.key}
                          onChange={(e) => updateEnvVariable(index, "key", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`value-${index}`} className="sr-only">Value</Label>
                        <Input
                          id={`value-${index}`}
                          placeholder="Value"
                          value={env.value}
                          onChange={(e) => updateEnvVariable(index, "value", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addEnvVariable}
                        className="px-3"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeEnvVariable(index)}
                        disabled={envVariables.length === 1}
                        className="px-3"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center pt-6">
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || (portConfig === "custom" && !customPort)}
              className="px-8 py-3 text-base"
            >
              {isSubmitting ? "Setting up..." : "Finish my Setup"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigureApp;