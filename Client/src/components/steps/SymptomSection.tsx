import React from "react";
import { Stethoscope, ChevronRight } from "lucide-react";
import type { SymptomSectionProps } from "../../types/interfaces";
import Button from "../ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/Card";

const SymptomSection: React.FC<SymptomSectionProps> = ({
  symptoms,
  setSymptoms,
  onNext,
}) => (
  <div className="w-full min-h-screen flex items-center justify-center p-4">
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-600/20 rounded-full">
            <Stethoscope className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <CardTitle className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Describe Your Symptoms
        </CardTitle>
        <CardDescription>
          Tell us about what you're experiencing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Describe your symptoms..."
          className="flex min-h-[120px] w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          rows={5}
        />
        <Button
          onClick={onNext}
          disabled={!symptoms.trim()}
          className="w-full py-3 text-base"
        >
          Continue to Personal Information
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default SymptomSection;
