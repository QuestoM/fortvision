import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/header';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <Header />

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* Google brand color shapes */}
        <div className="absolute top-10 right-[10%] w-64 h-64 rounded-full bg-blue-500/10 dark:bg-blue-500/5"></div>
        <div className="absolute top-40 right-[20%] w-32 h-32 rounded-full bg-red-500/10 dark:bg-red-500/5"></div>
        <div className="absolute bottom-20 right-[15%] w-48 h-48 rounded-full bg-yellow-400/10 dark:bg-yellow-400/5"></div>
        <div className="absolute bottom-40 right-[25%] w-24 h-24 rounded-full bg-green-500/10 dark:bg-green-500/5"></div>
        
        {/* Facebook brand color shapes */}
        <div className="absolute top-20 left-[5%] w-52 h-52 rounded-full bg-[#1877F2]/10 dark:bg-[#1877F2]/5"></div>
        <div className="absolute bottom-10 left-[15%] w-40 h-40 rounded-full bg-[#1877F2]/5 dark:bg-[#1877F2]/5"></div>
      </div>
      
      <div className="container relative mx-auto px-4 flex flex-col items-center justify-center min-h-screen pt-16 pb-8 z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center mb-6 px-3 py-1 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex space-x-1">
                <span className="h-2 w-2 rounded-full bg-[#4285F4]"></span>
                <span className="h-2 w-2 rounded-full bg-[#EA4335]"></span>
                <span className="h-2 w-2 rounded-full bg-[#FBBC05]"></span>
                <span className="h-2 w-2 rounded-full bg-[#34A853]"></span>
                <span className="h-2 w-2 rounded-full bg-[#1877F2] ml-1"></span>
              </div>
              <span className="text-sm font-medium ml-3 text-gray-800 dark:text-gray-200">Advertising Analytics Platform</span>
            </div>
            
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Create your account</h1>
            <p className="text-gray-600 dark:text-gray-300">Join us and start optimizing your campaigns</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
            <SignUp 
              redirectUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "bg-transparent shadow-none",
                  headerTitle: "text-xl font-semibold text-gray-900 dark:text-white",
                  headerSubtitle: "text-sm text-gray-600 dark:text-gray-300",
                  socialButtonsBlockButton: "border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 hover:bg-blue-50 dark:hover:bg-blue-900/30",
                  socialButtonsBlockButtonText: "text-gray-700 dark:text-gray-300 font-medium",
                  formFieldLabel: "text-gray-700 dark:text-gray-300",
                  formFieldInput: "rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1877F2] dark:focus:ring-[#1877F2]",
                  formButtonPrimary: "bg-[#1877F2] hover:bg-[#166fe5] text-white",
                  footerActionLink: "text-[#1877F2] hover:text-[#166fe5]",
                  identityPreviewText: "text-gray-600 dark:text-gray-300",
                  identityPreviewEditButton: "text-[#1877F2] hover:text-[#166fe5]",
                }
              }}
            />
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/sign-in" className="font-medium text-[#4285F4] hover:text-[#4285F4]/80">
                Sign in <ArrowRight className="inline h-3 w-3" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
