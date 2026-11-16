import { AnalysisType } from "@/types";
import {
  Brain,
  Hash,
  List,
  MessageCircle,
  MessageSquare,
  Shield,
  Sparkles,
  Upload,
  Users,
} from "lucide-react";

export const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Get instance summaries and insights with Google Gemini AI",
  },
  {
    icon: Users,
    title: "Multi-Tenant",
    description: "Separate organizations with isolated document storage",
  },
  {
    icon: Upload,
    title: "Easy Upload",
    description: "Drag and drop or select files in multiple formats",
  },
  {
    icon: Shield,
    title: "Secure",
    description: "Your documents are encrypted and stored sucurely",
  },
];

export const steps = [
  "Sign up for free account",
  "Create an organization",
  "Upload documents",
  "Get AI analysis instantly",
];

export const allowedTypes = [
  "text/plain",
  "application/pdf",
  "application/msword",
  "text/markdown",
];

export const analysisType: {
  value: AnalysisType;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
}[] = [
  {
    value: "summary",
    label: "Summary",
    description: "Generate comprehensive document summary",
    icon: Sparkles,
  },
  {
    value: "qa",
    label: "Q&A",
    description: "Generate questions and answers from document",
    icon: Sparkles,
  },
  {
    value: "sentiment",
    label: "Summary",
    description: "Generate comprehensive document summary",
    icon: Sparkles,
  },
];
