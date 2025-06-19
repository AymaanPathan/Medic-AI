import React, { useEffect, useState } from "react";
import { socket } from "../../utils/socketSetup";
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Heart,
  Info,
  Pill,
  Stethoscope,
  XCircle,
} from "lucide-react";
const DiagnosisSection: React.FC = () => {
  useEffect(() => {
    socket.on("diagnosis_chunk", (data) => {
      console.log("Received diagnosis chunk:", data);
      if (data.text) {
        setDiagnosis((prev) => ({
          ...prev,
          diseaseName: data.text.diseaseName || prev.diseaseName,
          diseaseSummary: data.text.diseaseSummary || prev.diseaseSummary,
          whyYouHaveThis: data.text.whyYouHaveThis || prev.whyYouHaveThis,
          whatToDoFirst: data.text.whatToDoFirst || prev.whatToDoFirst,
          medicines: data.text.medicines || prev.medicines,
          lifestyleChanges: data.text.lifestyleChanges || prev.lifestyleChanges,
          dangerSigns: data.text.dangerSigns || prev.dangerSigns,
        }));
      }
    });

    socket.on("diagnosis_done", (data) => {
      console.log("✅ Diagnosis complete:", data);
    });

    return () => {
      socket.off("diagnosis_chunk");
      socket.off("diagnosis_done");
    };
  }, []);

  type Medicine = {
    name: string;
    purpose: string;
    how_it_works: string;
    dosage: { [key: string]: string };
    pros: string[];
    cons: string[];
    when_not_to_take: string[];
    age_restriction?: string;
  };

  type Diagnosis = {
    diseaseName: string;
    diseaseSummary: string;
    whyYouHaveThis: string;
    whatToDoFirst: string;
    medicines: Medicine[];
    lifestyleChanges: string[];
    dangerSigns: string[];
  };

  const [diagnosis, setDiagnosis] = useState<Diagnosis>({
    diseaseName: "",
    diseaseSummary: "",
    whyYouHaveThis: "",
    whatToDoFirst: "",
    medicines: [],
    lifestyleChanges: [],
    dangerSigns: [],
  });
  console.log("Diagnosis data:", diagnosis);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <Stethoscope className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {diagnosis.diseaseName}
              </h1>
              <p className="text-gray-600 mt-1">Medical Diagnosis Report</p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
            <p className="text-gray-800 leading-relaxed">
              {diagnosis.diseaseSummary}
            </p>
          </div>
        </div>

        {/* Key Information Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Why You Have This */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-amber-100 p-2 rounded-lg">
                <Info className="h-5 w-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Why You Have This
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {diagnosis.whyYouHaveThis}
            </p>
          </div>

          {/* What To Do First */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Immediate Actions
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {diagnosis.whatToDoFirst}
            </p>
          </div>
        </div>

        {/* Danger Signs */}
        {diagnosis.dangerSigns && diagnosis.dangerSigns.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-red-500">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                ⚠️ Danger Signs - Seek Immediate Medical Attention
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {diagnosis.dangerSigns.map((sign, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-red-50 p-3 rounded-lg"
                >
                  <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span className="text-gray-800 text-sm">{sign}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medicines Section */}
        {diagnosis.medicines && diagnosis.medicines.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Pill className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Prescribed Medications
              </h2>
            </div>

            <div className="space-y-6">
              {diagnosis.medicines.map((medicine, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {medicine.name}
                    </h3>
                    {medicine.age_restriction && (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                        {medicine.age_restriction}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4">{medicine.purpose}</p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <span>How It Works</span>
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {medicine.how_it_works}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-green-500" />
                        <span>Dosage</span>
                      </h4>
                      <div className="space-y-1">
                        {Object.entries(medicine.dosage).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-600 capitalize">
                              {key}:
                            </span>
                            <span className="text-gray-800 font-medium">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2 flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4" />
                        <span>Benefits</span>
                      </h4>
                      <ul className="space-y-1">
                        {medicine.pros.map((pro, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-600 flex items-start space-x-1"
                          >
                            <span className="text-green-500 mt-1">•</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-orange-700 mb-2 flex items-center space-x-1">
                        <XCircle className="h-4 w-4" />
                        <span>Side Effects</span>
                      </h4>
                      <ul className="space-y-1">
                        {medicine.cons.map((con, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-600 flex items-start space-x-1"
                          >
                            <span className="text-orange-500 mt-1">•</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-red-700 mb-2 flex items-center space-x-1">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Avoid If</span>
                      </h4>
                      <ul className="space-y-1">
                        {medicine.when_not_to_take.map((condition, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-600 flex items-start space-x-1"
                          >
                            <span className="text-red-500 mt-1">•</span>
                            <span>{condition}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lifestyle Changes */}
        {diagnosis.lifestyleChanges &&
          diagnosis.lifestyleChanges.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Heart className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Recommended Lifestyle Changes
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {diagnosis.lifestyleChanges.map((change, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 bg-green-50 p-4 rounded-lg"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-800">{change}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Footer */}
        <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
          <p className="text-gray-600 text-sm">
            This diagnosis is generated based on the symptoms provided. Always
            consult with a healthcare professional for proper medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisSection;
