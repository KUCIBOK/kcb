import { memo } from "react"

export const PageLoader = memo(()=>{
    return (
        <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-br from-gray-950 via-gray-900 to-amber-950">
            <div className="relative flex flex-col items-center">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-4 border-amber-700 border-t-transparent animate-spin"></div>
                    <div className="absolute inset-2 rounded-full bg-amber-900 bg-opacity-80 animate-pulse"></div>
                </div>
                <span className="mt-4 sr-only text-amber-200 text-base font-medium tracking-wide animate-fade-in">
                    Chargement...
                </span>
            </div>
            <style>{`
                @keyframes fade-in {
                    0% { opacity: 0;}
                    100% { opacity: 1;}
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-in;
                }
            `}</style>
        </div>
    )
})

export const DataLoader = memo(()=>{
    return (
        <div className="flex justify-center">
            <div className="relative flex flex-col items-center">
                <div className="relative w-6 h-6">
                    <div className="absolute inset-0 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
                    <div className="absolute inset-1 rounded-full border border-rose-700 border-b-transparent animate-spin-reverse"></div>
                </div>
                <span className="mt-2 sr-only text-amber-900 text-xs font-normal tracking-wide animate-fade-in">
                    Chargement...
                </span>
            </div>
            <style>{`
                @keyframes spin-reverse {
                    0% { transform: rotate(360deg);}
                    100% { transform: rotate(0deg);}
                }
                .animate-spin-reverse {
                    animation: spin-reverse 1.2s linear infinite;
                }
                .animate-fade-in {
                    animation: fade-in 0.8s ease-in;
                }
                @keyframes fade-in {
                    0% { opacity: 0;}
                    100% { opacity: 1;}
                }
            `}</style>
        </div>
    )
})