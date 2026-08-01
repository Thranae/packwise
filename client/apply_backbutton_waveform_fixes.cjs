const fs = require('fs');

// --- 1. Fix Back Button in App.jsx ---
let appContent = fs.readFileSync('src/App.jsx', 'utf-8');

// Add import
if (!appContent.includes("import { App as CapacitorApp } from '@capacitor/app';")) {
    appContent = appContent.replace(
        "import { Routes, Route, useLocation, Navigate } from 'react-router-dom';",
        "import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';\nimport { App as CapacitorApp } from '@capacitor/app';"
    );
}

// Add back button listener to AppRoutes
const backButtonEffect = `
    const navigate = useNavigate();
    
    // Handle Capacitor Hardware Back Button
    useEffect(() => {
        let listener = null;
        const setupListener = async () => {
            listener = await CapacitorApp.addListener('backButton', () => {
                if (location.pathname === ROUTES.HOME) {
                    CapacitorApp.exitApp();
                } else {
                    navigate(-1);
                }
            });
        };
        setupListener();
        return () => {
            if (listener) listener.remove();
        };
    }, [location.pathname, navigate]);
`;
if (!appContent.includes("CapacitorApp.addListener")) {
    appContent = appContent.replace(
        "const location = useLocation();",
        "const location = useLocation();" + backButtonEffect
    );
}
fs.writeFileSync('src/App.jsx', appContent);
console.log("App.jsx fixed.");


// --- 2. Fix Voice Waveform Link in HomePage.jsx ---
let homeContent = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');

// Ensure useToast is imported
if (!homeContent.includes("useToast")) {
    homeContent = homeContent.replace(
        "import { useAuth } from '@/hooks/useAuth';",
        "import { useAuth } from '@/hooks/useAuth';\nimport { useToast } from '@/hooks/useToast';"
    );
}

// Ensure useToast is instantiated
if (!homeContent.includes("const { addToast } = useToast();")) {
    homeContent = homeContent.replace(
        "const { isAuthenticated, user } = useAuth();",
        "const { isAuthenticated, user } = useAuth();\n  const { addToast } = useToast();"
    );
}

// Remove the Link wrapper around Voice Waveform and add onClick toast
const oldWaveformLinkRegex = /<Link to=\{ROUTES\.ASSISTANT\}>\s*(<div className="relative flex items-center bg-\[#030712\]\/40 backdrop-blur-xl[\s\S]*?<\/div>)\s*<\/Link>/;
const newWaveformDiv = `<div onClick={(e) => { e.preventDefault(); addToast("AI Voice Assistant is coming in the next update!", "info"); }}>
                       $1
                     </div>`;
homeContent = homeContent.replace(oldWaveformLinkRegex, newWaveformDiv);

fs.writeFileSync('src/pages/HomePage.jsx', homeContent);
console.log("HomePage.jsx voice waveform fixed.");
