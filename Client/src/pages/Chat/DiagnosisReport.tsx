import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useNavigate } from "react-router";
import { CheckCircle, ChevronLeft } from "lucide-react";

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
    <div className="min-h-screen w-full bg-gray-50 px-6 py-10 flex justify-center items-start">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-2xl p-8 space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-700 flex items-center gap-2">
            <CheckCircle className="w-7 h-7" />
            Diagnosis Report
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-700 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* Section: Symptoms */}

        {/* Section: Follow-up Answers */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Your Follow-up Answers
          </h2>
          <div className="space-y-3">
            {Object.entries(followupAnswers || {}).map(
              ([question, answer], index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 rounded-xl shadow-sm"
                >
                  <p className="text-sm text-gray-700 font-medium mb-1">
                    Q: {question}
                  </p>
                  <p className="text-gray-600">A: {answer}</p>
                </div>
              )
            )}
          </div>
        </section>

        {/* Section: Final Prompt */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Final Prompt Summary
          </h2>
          <div className="bg-gray-50 border border-dashed border-green-400 p-4 rounded-lg text-gray-700">
            {finalPrompt}
          </div>
        </section>

        <div className="space-y-4">
          <p className="text-lg font-semibold">{diagnosisResult.diseaseName}</p>
          <p>{diagnosisResult.diseaseSummary}</p>

          <div>
            <h3 className="font-semibold">Why You Might Have This</h3>
            <p>{diagnosisResult.whyYouHaveThis}</p>
          </div>

          <div>
            <h3 className="font-semibold">What To Do First</h3>
            <p>{diagnosisResult.whatToDoFirst}</p>
          </div>

          {diagnosisResult.dangerSigns?.length > 0 && (
            <div>
              <h3 className="font-semibold">Danger Signs</h3>
              <ul className="list-disc list-inside">
                {diagnosisResult.dangerSigns.map((sign, idx) => (
                  <li key={idx}>{sign}</li>
                ))}
              </ul>
            </div>
          )}

          {diagnosisResult.lifestyleChanges?.length > 0 && (
            <div>
              <h3 className="font-semibold">Lifestyle Changes</h3>
              <ul className="list-disc list-inside">
                {diagnosisResult.lifestyleChanges.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {diagnosisResult.medicines?.length > 0 && (
            <div>
              <h3 className="font-semibold">Recommended Medicine</h3>
              {diagnosisResult.medicines.map((med, idx) => (
                <div
                  key={idx}
                  className="border border-green-300 p-4 rounded-lg bg-white text-sm space-y-2"
                >
                  <p className="font-semibold text-base">{med.name}</p>
                  <p>
                    <strong>Purpose:</strong> {med.purpose}
                  </p>
                  <p>
                    <strong>How it works:</strong> {med.how_it_works}
                  </p>
                  <p>
                    <strong>Dosage:</strong>
                  </p>
                  <ul className="list-disc list-inside pl-4">
                    {Object.entries(med.dosage).map(([ageGroup, dose], i) => (
                      <li key={i}>
                        <strong>{ageGroup}:</strong> {dose}
                      </li>
                    ))}
                  </ul>
                  <p>
                    <strong>Pros:</strong> {med.pros.join(", ")}
                  </p>
                  <p>
                    <strong>Cons:</strong> {med.cons.join(", ")}
                  </p>
                  <p>
                    <strong>When not to take:</strong>{" "}
                    {med.when_not_to_take.join(", ")}
                  </p>
                  <p>
                    <strong>Age Restriction:</strong> {med.age_restriction}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="text-center pt-4">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium shadow-md"
          >
            Start New Diagnosis
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisReport;
