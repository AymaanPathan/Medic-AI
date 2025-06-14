import { Calendar, ChevronRight, User } from "lucide-react";
import type { PersonalInfoSectionProps } from "../../types/interfaces";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  age,
  setAge,
  gender,
  setGender,
  onNext,
  onBack,
}) => (
  <div className="w-full min-h-screen flex items-center justify-center p-4">
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-purple-600/20 rounded-full">
            <User className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        <CardTitle className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Personal Information
        </CardTitle>
        <CardDescription>
          Help us provide more accurate insights by sharing some basic
          information about yourself.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-blue-400" />
              Age
            </label>
            <Input
              type="number"
              value={age}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAge(e.target.value)
              }
              placeholder="Enter your age"
              min="1"
              max="120"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center">
              <User className="h-4 w-4 mr-2 text-purple-400" />
              Gender
            </label>
            <select
              value={gender}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setGender(e.target.value)
              }
              className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1 py-3">
            Back
          </Button>
          <Button
            onClick={onNext}
            disabled={!age || !gender}
            className="flex-1 py-3 text-base"
          >
            Complete Assessment
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);
