import type { Diagnosis } from "@/types/interfaces";
import {
  AlertTriangle,
  CheckCircle,
  Heart,
  Pill,
  Stethoscope,
  XCircle,
} from "lucide-react";
import React from "react";

const DiagnosisCard: React.FC<{ diagnosis: Diagnosis }> = ({ diagnosis }) => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-100 rounded-full">
          <Stethoscope className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-green-800">
            Medical Diagnosis
          </h2>
          <p className="text-green-600 text-sm">AI-Generated Assessment</p>
        </div>
      </div>

      {/* Disease Name */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Condition</h3>
        <p className="text-xl font-bold text-green-700 bg-green-100 px-4 py-2 rounded-lg">
          {diagnosis.diseaseName}
        </p>
      </div>

      {/* Disease Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Summary</h3>
        <p className="text-gray-700 leading-relaxed">
          {diagnosis.diseaseSummary}
        </p>
      </div>

      {/* Why You Have This */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Why This Occurred
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {diagnosis.whyYouHaveThis}
        </p>
      </div>

      {/* What To Do First */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Immediate Actions
        </h3>
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-gray-700 leading-relaxed">
            {diagnosis.whatToDoFirst}
          </p>
        </div>
      </div>

      {/* Medicines */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Pill className="w-5 h-5 text-green-600" />
          Recommended Medications
        </h3>
        <div className="space-y-4">
          {diagnosis.medicines.map((medicine, index: number) => (
            <div
              key={index}
              className="border border-green-200 rounded-lg p-4 bg-white"
            >
              <h4 className="font-bold text-green-700 text-lg mb-2">
                {medicine.name}
              </h4>
              <p className="text-gray-600 mb-3">{medicine.purpose}</p>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-700 mb-1">
                    How it works:
                  </p>
                  <p className="text-gray-600 mb-3">{medicine.how_it_works}</p>

                  <p className="font-semibold text-green-600 mb-1">Pros:</p>
                  <ul className="text-gray-600 mb-3">
                    {medicine.pros.map((pro: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-orange-600 mb-1">Cons:</p>
                  <ul className="text-gray-600 mb-3">
                    {medicine.cons.map((con: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <XCircle className="w-3 h-3 text-orange-500" />
                        {con}
                      </li>
                    ))}
                  </ul>

                  <p className="font-semibold text-red-600 mb-1">
                    When not to take:
                  </p>
                  <ul className="text-gray-600 mb-3">
                    {medicine.when_not_to_take.map(
                      (condition: string, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                          {condition}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-green-100">
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Dosage:</p>
                  {(Object.entries(medicine.dosage) as [string, string][]).map(
                    ([age, dose]) => (
                      <p key={age} className="text-sm text-gray-600">
                        {age}: {dose}
                      </p>
                    )
                  )}
                </div>
                {medicine.age_restriction && (
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">
                      Age Restriction:
                    </p>
                    <p className="text-sm text-gray-600">
                      {medicine.age_restriction}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lifestyle Changes */}
      {diagnosis.lifestyleChanges && diagnosis.lifestyleChanges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Heart className="w-5 h-5 text-green-600" />
            Lifestyle Changes
          </h3>
          <div className="bg-green-50 p-4 rounded-lg">
            <ul className="space-y-2">
              {diagnosis.lifestyleChanges.map(
                (change: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {change}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Danger Signs */}
      {diagnosis.dangerSigns && diagnosis.dangerSigns.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Seek Immediate Medical Attention If:
          </h3>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <ul className="space-y-2">
              {diagnosis.dangerSigns.map((sign: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-red-700">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  {sign}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 text-center mt-6 p-3 bg-gray-50 rounded-lg">
        <p className="font-semibold">⚠️ Important Disclaimer</p>
        <p>
          This is an AI-generated assessment for informational purposes only.
          Always consult with a qualified healthcare professional for proper
          medical diagnosis and treatment.
        </p>
      </div>
    </div>
  );
};

export default DiagnosisCard;
