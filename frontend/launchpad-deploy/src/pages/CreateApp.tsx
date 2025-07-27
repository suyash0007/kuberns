import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Github, Database, Gitlab } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";

const CreateApp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organization: "",
    repository: "",
    branch: "",
    appName: "",
    region: "",
    framework: "", // This maps to 'template' in your Django model
    planType: "starter",
    useDatabase: false
  });

  // Define planDetails here, as it's the source for both pages
  const planDetails = {
    starter: {
      name: "Starter",
      storage: 10, // GB
      bandwidth: "10 GB",
      memory: 1024, // MB (1GB for t3.micro)
      cpu: 1,      // vCPU for t3.micro
      monthlyCost: "$0",
      hourlyRate: "$0"
    },
    pro: {
      name: "Pro",
      storage: 100, // GB
      bandwidth: "100 GB",
      memory: 4096, // MB (4GB for t3.medium)
      cpu: 2,      // vCPU for t3.medium
      monthlyCost: "$99",
      hourlyRate: "$0.15"
    }
  };

  const handleContinue = () => {
    // Pass both formData and planDetails to the next page
    navigate("/configure", { state: { formData, planDetails } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold text-foreground">Create New App</h1>
          <StepIndicator currentStep={1} totalSteps={2} />
        </div>
        <p className="text-muted-foreground mb-8">
          Connect your repository and fill in the requirements to see the app deployed in seconds.
        </p>

        <div className="space-y-8">
          {/* GitHub Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Github className="w-5 h-5" />
                <span>Choose your Version Control System</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 ">
                <div className="flex flex-row-reverse items-center justify-between p-4 border-border rounded-lg bg-secondary/50 border border-[#2758d1] w-1/3">
                  <Github className="w-8 h-8 text-foreground" />
                  <div>
                    <p className="font-medium text-foreground">GitHub</p>
                    <p className="text-green-600">Connected</p>
                  </div>
                  
                </div>
                <div className="flex flex-row-reverse items-center justify-between p-4 border-border rounded-lg bg-secondary/50 border w-1/3">
                  <Gitlab className="w-8 h-8 text-foreground" />
                  <div>
                    <p className="font-medium text-foreground">GitHub</p>
                    <p className="text-muted-foreground">Not Connected</p>
                  </div>
                  
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Select value={formData.organization} onValueChange={(value) => setFormData({...formData, organization: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Organization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kuberns">Kuberns</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="repository">Repository</Label>
                  <Select value={formData.repository} onValueChange={(value) => setFormData({...formData, repository: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select repository" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="my-app">my-app</SelectItem>
                      <SelectItem value="webapp">webapp</SelectItem>
                      <SelectItem value="api-service">api-service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Select value={formData.branch} onValueChange={(value) => setFormData({...formData, branch: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    <SelectContent>
                      <SelectItem value="main">main</SelectItem>
                      <SelectItem value="develop">develop</SelectItem>
                      <SelectItem value="staging">staging</SelectItem>
                    </SelectContent>
                  </SelectTrigger>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* App Details */}
          <Card>
            <CardHeader>
              <CardTitle>Fill in the details of your App</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="appName">App Name</Label>
                  <Input 
                    id="appName"
                    value={formData.appName}
                    onChange={(e) => setFormData({...formData, appName: e.target.value})}
                    placeholder="Enter app name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Select value={formData.region} onValueChange={(value) => setFormData({...formData, region: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us-east-1">United States - Michigan</SelectItem>
                      <SelectItem value="eu-west-1">Europe - Ireland</SelectItem>
                      <SelectItem value="ap-south-1">Asia Pacific - Mumbai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="framework">Framework/Template</Label>
                <Select value={formData.framework} onValueChange={(value) => setFormData({...formData, framework: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="vue">Vue.js</SelectItem>
                    <SelectItem value="angular">Angular</SelectItem>
                    <SelectItem value="next">Next.js</SelectItem>
                    <SelectItem value="nuxt">Nuxt.js</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Plan Type */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Type</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose a plan that fits your app's usage. You can change or refactor instances, memory limits, and more later. Choose the plan that aligns with your app's current and future requirements.
              </p>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={formData.planType} 
                onValueChange={(value) => setFormData({...formData, planType: value})}
                className="space-y-4"
              >
                {Object.entries(planDetails).map(([key, plan]) => (
                  <div key={key} className="flex items-center space-x-3 p-4 border border-border rounded-lg">
                    <RadioGroupItem value={key} id={key} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={key} className="font-medium">{plan.name}</Label>
                        {key === "starter" && <Badge variant="secondary">Value for prototyping and small projects</Badge>}
                      </div>
                      <div className="grid grid-cols-6 gap-4 mt-2 text-sm text-muted-foreground">
                        <div>
                          <p className="font-medium">Storage</p>
                          <p>{plan.storage} GB</p>
                        </div>
                        <div>
                          <p className="font-medium">Bandwidth</p>
                          <p>{plan.bandwidth}</p>
                        </div>
                        <div>
                          <p className="font-medium">Memory (RAM)</p>
                          <p>{plan.memory / 1024} GB</p>
                        </div>
                        <div>
                          <p className="font-medium">CPU</p>
                          <p>{plan.cpu} vCPU</p>
                        </div>
                        <div>
                          <p className="font-medium">Monthly Cost</p>
                          <p>{plan.monthlyCost}</p>
                        </div>
                        <div>
                          <p className="font-medium">Price per hour</p>
                          <p>{plan.hourlyRate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Database Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Database Selection</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Please be informed that the project function output is dependent on a valid database connection during deployment. Failing to establish a correct database connection will result in an inability to access or manipulate essential data required for the application to function. It is crucial to ensure a reliable database connection to guarantee the app's proper functionality.
              </p>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="default" 
                  className="bg-success hover:bg-success/90"
                  onClick={() => setFormData({...formData, useDatabase: true})}
                >
                  <Database className="w-4 h-4 mr-2" />
                  Connect Database
                </Button>
                <Button variant="outline">Maybe Later</Button>
              </div>
            </CardContent>
          </Card>

          {/* Continue Button */}
          <div className="flex justify-end pt-6">
            <Button 
              onClick={handleContinue}
              disabled={!formData.appName || !formData.region || !formData.framework || !formData.repository || !formData.organization}
              className="px-8 py-3 text-base"
            >
              Set Up Env Variables
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateApp;