interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-end space-x-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              i + 1 === currentStep
                ? "bg-primary text-primary-foreground"
                : i + 1 < currentStep
                ? "bg-success text-success-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div className="w-8 h-0.5 bg-border mx-2" />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;