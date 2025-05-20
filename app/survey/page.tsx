import Link from 'next/link';
import { AIPredictionForm } from "@/components/AIPredictionForm";

export default function SurveyPage() {
  return (
    <div>
      <div className="w-full flex flex-col items-center justify-center bg-gradient-to-br from-dusty-blue to-mist-green py-12 px-4">
        <h1 className="text-4xl font-bold text-forest-green mb-4">Comprehensive Health Survey</h1>
        <p className="text-lg text-gray-800 mb-6 max-w-xl text-center">
          Share your treatment history, physical activity, emotional health, and lifestyle factors to receive personalized care recommendations.
        </p>
        <Link href="/" className="px-6 py-3 bg-forest-green text-white rounded-lg shadow hover:bg-forest-green/90 transition">Back to Home</Link>
      </div>
      <AIPredictionForm />
    </div>
  );
}
