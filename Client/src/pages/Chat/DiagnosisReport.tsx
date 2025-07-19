import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useNavigate } from "react-router";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle,
  ChevronLeft,
  Download,
  FileText,
  Heart,
  Pill,
  Shield,
  Stethoscope,
} from "lucide-react";

const DiagnosisReport = () => {
  const navigate = useNavigate();

  const followupAnswers = useSelector(
    (state: RootState) => state.diagnosis.user_response
  );
  const finalPrompt = useSelector(
    (state: RootState) => state.diagnosis.finalPrompt
  );
  const diagnosisResult = useSelector(
    (state: RootState) => state.diagnosis.diagnosis
  );

  console.log("diagnosisResult: ", diagnosisResult);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-emerald-100">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex items-center gap-2 px-2 py-1 bg-emerald-50 rounded-full border border-emerald-100">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              <span className="text-xs font-medium text-emerald-700">
                Complete
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 py-4">
        {/* Compact Hero */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl border border-emerald-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-6 relative">
              <div className="absolute top-2 right-4 opacity-10">
                <Stethoscope className="w-16 h-16 text-emerald-600" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {diagnosisResult.diseaseName}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-emerald-700">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                      <span>Most likely condition</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {diagnosisResult.diseaseSummary}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Understanding Section */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-3 h-3 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Understanding Your Condition
                  </h3>
                </div>
              </div>
              <div className="px-4 py-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {diagnosisResult.whyYouHaveThis}
                </p>
              </div>
            </div>

            {/* Immediate Action */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Immediate Action
                  </h3>
                </div>
              </div>
              <div className="px-4 py-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {diagnosisResult.whatToDoFirst}
                </p>
              </div>
            </div>

            {/* Lifestyle Recommendations */}
            {diagnosisResult.lifestyleChanges?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-3 h-3 text-purple-600" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Lifestyle Tips
                    </h3>
                  </div>
                </div>
                <div className="px-4 py-4">
                  <div className="space-y-2">
                    {diagnosisResult.lifestyleChanges.map((tip, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Compact Medications */}
            {diagnosisResult.medicines?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Pill className="w-3 h-3 text-indigo-600" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Medications
                    </h3>
                  </div>
                </div>
                <div className="px-4 py-4">
                  {diagnosisResult.medicines.map((med, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-xl overflow-hidden mb-4 last:mb-0"
                    >
                      {/* Medicine Header */}
                      <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-gray-900">
                            {med.name}
                          </h4>
                          <div className="bg-indigo-100 px-2 py-1 rounded-full">
                            <span className="text-indigo-700 text-xs font-medium">
                              OTC
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Medicine Details */}
                      <div className="px-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                              Purpose
                            </h5>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {med.purpose}
                            </p>
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                              How It Works
                            </h5>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {med.how_it_works}
                            </p>
                          </div>
                        </div>

                        {/* Compact Dosage */}
                        <div className="mb-4">
                          <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                            Dosage
                          </h5>
                          <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                            {Object.entries(med.dosage).map(
                              ([ageGroup, dose], i) => (
                                <div
                                  key={i}
                                  className="px-3 py-2 flex justify-between items-center border-b border-gray-200 last:border-b-0"
                                >
                                  <span className="font-semibold text-gray-800 text-sm">
                                    {ageGroup}
                                  </span>
                                  <span className="text-gray-700 font-medium text-sm">
                                    {dose}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* Compact Pros/Cons/Restrictions */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                              <h6 className="font-bold text-green-900 text-xs uppercase">
                                Benefits
                              </h6>
                            </div>
                            <ul className="space-y-1">
                              {med.pros.map((pro, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-green-800"
                                >
                                  <div className="w-1 h-1 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                  <span className="text-xs leading-relaxed">
                                    {pro}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-3 h-3 text-yellow-600" />
                              <h6 className="font-bold text-yellow-900 text-xs uppercase">
                                Side Effects
                              </h6>
                            </div>
                            <ul className="space-y-1">
                              {med.cons.map((con, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-yellow-800"
                                >
                                  <div className="w-1 h-1 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                  <span className="text-xs leading-relaxed">
                                    {con}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-3 h-3 text-red-600" />
                              <h6 className="font-bold text-red-900 text-xs uppercase">
                                Avoid If
                              </h6>
                            </div>
                            <ul className="space-y-1">
                              {med.when_not_to_take.map((avoid, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-red-800"
                                >
                                  <div className="w-1 h-1 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                  <span className="text-xs leading-relaxed">
                                    {avoid}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Age Restriction */}
                        <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                          <div className="flex items-start gap-2">
                            <div className="w-3 h-3 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs font-bold">
                                i
                              </span>
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-gray-800">
                                Age Restriction:{" "}
                              </span>
                              <span className="text-xs text-gray-700">
                                {med.age_restriction}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Compact Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Critical Alert */}
            {diagnosisResult.dangerSigns?.length > 0 && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-red-100 border-b border-red-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <h3 className="font-bold text-red-900 text-sm">
                      🚨 Seek Immediate Care
                    </h3>
                  </div>
                </div>
                <div className="px-4 py-4">
                  <div className="space-y-2">
                    {diagnosisResult.dangerSigns.map((sign, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-2 bg-red-100 rounded-lg"
                      >
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 flex-shrink-0"></div>
                        <p className="text-red-900 font-medium text-xs leading-relaxed">
                          {sign}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-2 bg-red-600 rounded-lg">
                    <p className="text-white text-xs font-medium text-center">
                      Contact emergency services immediately
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Compact Assessment Summary */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-900 text-sm">
                  Assessment Summary
                </h3>
              </div>
              <div className="px-4 py-4 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                    Your Responses
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(followupAnswers || {}).map(
                      ([question, answer], index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded-lg">
                          <p className="text-xs font-medium text-gray-600 mb-1">
                            Q: {question}
                          </p>
                          <p className="text-xs text-gray-900 font-medium">
                            A: {answer}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                    Clinical Notes
                  </h4>
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {finalPrompt}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate("/")}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 text-sm"
              >
                Start New Assessment
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Download className="w-3 h-3" />
                  <span>Print</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 text-sm">
                  <FileText className="w-3 h-3" />
                  <span>Save</span>
                </button>
              </div>
            </div>

            {/* Compact Trust Footer */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-800">
                    HIPAA Compliant & Secure
                  </span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  For informational purposes only. Not a replacement for
                  professional medical advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisReport;
