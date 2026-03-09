// (function () {
//     // Masquer la barre Google Translate et le badge
//     const style = document.createElement('style');
//     style.innerHTML = `
//         .goog-te-banner-frame.skiptranslate, .goog-logo-link, .goog-te-gadget-icon, .goog-te-balloon-frame, .goog-te-menu-value, .goog-te-gadget-simple, .goog-te-combo, #goog-gt-tt, .goog-te-spinner-pos, .goog-te-banner-frame, .goog-te-menu-frame, .goog-te-menu2 { display: none !important; }
//         body { top: 0px !important; }
//         .goog-te-banner-frame { display: none !important; }
//         .goog-te-gadget-icon { display: none !important; }
//     `;
//     document.head.appendChild(style);

//     // Fonction d'initialisation de Google Translate
//     window.googleTranslateElementInit = function() {
//         new window.google.translate.TranslateElement(
//             { pageLanguage: 'en', autoDisplay: false },
//             'root'
//         );

//         // Forcer la langue du navigateur
//         const userLanguage = navigator.language || navigator.languages[0];
//         const langCode = userLanguage.split('-')[0];

//         const interval = setInterval(() => {
//             const translateSelect = document.querySelector('.goog-te-combo');
//             if (translateSelect) {
//                 if (translateSelect.value !== langCode) {
//                     translateSelect.value = langCode;
//                     translateSelect.dispatchEvent(new Event('change'));
//                 }
//                 clearInterval(interval);
//             }
//         }, 200);
//     };

//     // Ajouter le script Google Translate dynamiquement
//     function addGoogleTranslateScript() {
//         if (window.google && window.google.translate) return;
//         const script = document.createElement('script');
//         script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//         script.async = true;
//         document.body.appendChild(script);
//     }

//     // Charger le script Google Translate
//     addGoogleTranslateScript();
// })();
