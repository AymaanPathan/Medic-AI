import { CheckCircle, Sparkles } from "lucide-react";
import type { ThankYouSectionProps } from "../../types/interfaces";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import Button from "../ui/Button";

// Thank You Section
export const ThankYouSection: React.FC<ThankYouSectionProps> = ({
  onRestart,
}) => (
  <div className="w-full min-h-screen flex items-center justify-center p-4">
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-green-600/20 rounded-full animate-pulse">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <CardTitle className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Assessment Complete!
        </CardTitle>
        <CardDescription>
          Thank you for providing your information. Our system is processing
          your symptoms and will provide recommendations shortly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 text-gray-300">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            <span>Your assessment has been successfully submitted</span>
          </div>
          <div className="p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
            <h4 className="font-medium text-blue-400 mb-2">What's Next?</h4>
            <p className="text-sm text-gray-400">
              We'll analyze your symptoms and personal information to provide
              personalized health insights. You should receive your results
              within the next few minutes.
            </p>
          </div>
        </div>
        <Button
          onClick={onRestart}
          variant="outline"
          className="w-full py-3 text-base"
        >
          Start New Assessment
        </Button>
      </CardContent>
    </Card>
  </div>
);
