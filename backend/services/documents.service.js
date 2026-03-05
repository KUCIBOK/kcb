const htmlPdf = require('html-pdf-node') //Do not remove this
const QRCode = require('qrcode');
const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const { config } = require('../config/environnement');

const generatePDF = async (htmlContent, filePath) => {
    try {
        logger.info(`Génération PDF VPS Ubuntu: ${filePath}`);
        
        // FORCER html-pdf-node à utiliser le Chromium système (config.chrome.bin → CHROME_BIN)
        process.env.PUPPETEER_EXECUTABLE_PATH = config.chrome.bin;
        process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';
        
        // Créer le dossier si il n'existe pas
        const fullPath = path.join(process.cwd(), 'public', filePath);
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Configuration VPS Ubuntu optimisée
        const options = {
            format: 'A4',
            landscape: filePath.includes('certificate'),
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            },
            timeout: 180000, // 3 minutes pour VPS
            args: [
                // Sécurité
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-software-rasterizer',
                
                // Performance
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--disable-features=TranslateUI',
                '--disable-ipc-flooding-protection',
                
                // Stabilité VPS
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--run-all-compositor-stages-before-draw',
                '--no-first-run',
                '--no-default-browser-check',
                '--disable-default-apps',
                '--disable-extensions',
                '--disable-plugins',
                '--disable-sync',
                
                // Mémoire
                '--memory-pressure-off',
                '--max_old_space_size=4096',
                
                // Affichage
                '--hide-scrollbars',
                '--mute-audio',
                '--disable-logging',
                '--disable-gl-drawing-for-tests',
                '--single-process'
            ],
            // FORCER l'utilisation du Chromium système
            executablePath: process.env.CHROME_BIN || '/snap/bin/chromium'
        };

        logger.info(`Configuration VPS Ubuntu appliquée`);
        logger.info(`Timeout: ${options.timeout}ms`);
        logger.info(`Executable: ${options.executablePath}`);

        // Préparer le fichier HTML avec encoding UTF-8
        const file = { 
            content: htmlContent,
            encoding: 'utf8'
        };

        logger.info(`Génération PDF en cours sur VPS...`);
        
        // Génération avec retry et gestion d'erreurs robuste
        let pdfBuffer;
        let attempts = 0;
        const maxAttempts = 5; // Plus de tentatives pour VPS

        while (attempts < maxAttempts) {
            try {
                logger.info(`Tentative ${attempts + 1}/${maxAttempts}`);
                
                // Nettoyage de la mémoire avant chaque tentative
                if (global.gc) {
                    global.gc();
                }

                pdfBuffer = await htmlPdf.generatePdf(file, options);
                logger.info(`Génération réussie à la tentative ${attempts + 1}`);
                break;
                
            } catch (retryError) {
                attempts++;
                logger.error(`Tentative ${attempts}/${maxAttempts} échouée:`, { error: retryError.message });
                
                if (attempts >= maxAttempts) {
                    // Dernière tentative avec configuration minimale
                    logger.warn(`Tentative finale avec configuration minimale...`);
                    const minimalOptions = {
                        format: 'A4',
                        landscape: filePath.includes('certificate'),
                        printBackground: true,
                        timeout: 300000, // 5 minutes max
                        args: [
                            '--no-sandbox',
                            '--disable-setuid-sandbox',
                            '--disable-dev-shm-usage',
                            '--single-process'
                        ]
                    };
                    
                    try {
                        pdfBuffer = await htmlPdf.generatePdf(file, minimalOptions);
                        logger.info(`Génération réussie avec configuration minimale`);
                        break;
                    } catch (finalError) {
                        throw new Error(`Toutes les tentatives ont échoué. Dernière erreur: ${finalError.message}`);
                    }
                }
                
                // Attendre avant retry (progression: 2s, 4s, 6s, 8s)
                const waitTime = attempts * 2000;
                logger.info(`Attente ${waitTime}ms avant nouvelle tentative...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }

        // Vérification du buffer
        if (!pdfBuffer || pdfBuffer.length === 0) {
            throw new Error('PDF buffer vide ou invalide');
        }

        // Sauvegarder le PDF
        fs.writeFileSync(fullPath, pdfBuffer);
        
        // Vérifications finales
        if (!fs.existsSync(fullPath)) {
            throw new Error('Le fichier PDF n\'a pas été créé');
        }
        
        const stats = fs.statSync(fullPath);
        logger.info(`PDF VPS créé: ${fullPath} (${stats.size} bytes)`);
        
        if (stats.size < 1000) {
            logger.warn('ATTENTION: PDF très petit, vérifiez le contenu');
        }

        // Nettoyage mémoire final
        if (global.gc) {
            global.gc();
        }

    } catch (error) {
        logger.error('Erreur détaillée génération PDF VPS:', {
            error: error.message,
            stack: error.stack,
            filePath,
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch,
        });
        throw new Error(`Erreur génération PDF VPS: ${error.message}`);
    }
};

const createInvoiceForArtwork = async (artwork, buyer, seller) => {
    try {
        const filePath = `invoices/facture-${artwork?._id}.pdf`;

        // HTML simplifié sans Google Fonts externes
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
            <meta charset="UTF-8">
            <title>Facture Kucibok</title>
            <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
            background: linear-gradient(135deg, #f5f1eb 0%, #e8dcc6 100%);
            color: #2c1810;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
            }
                
                .container { 
                max-width: 900px; 
                margin: 0 auto; 
                background: #ffffff;
                border-radius: 20px; 
                box-shadow: 0 20px 60px rgba(44, 24, 16, 0.08);
                overflow: hidden;
                position: relative;
                }
                
                .header {
                background: linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #CD853F 100%);
                padding: 40px;
                color: white;
                position: relative;
                }
                
                .header-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                }
                
                .logo-section {
                display: flex;
                align-items: center;
                gap: 15px;
                }
                
                .logo {
                width: 60px;
                height: 60px;
                background: rgba(255, 255, 255, 0.15);
                border-radius: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                .logo img {
                filter: invert(1) brightness(1);
                }
                
                .company-info h1 {
                font-family: serif;
                font-size: 2.5rem;
                font-weight: 700;
                margin-bottom: 5px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                }
                
                .company-info p {
                font-size: 1.1rem;
                opacity: 0.9;
                font-weight: 300;
                }
                
                .invoice-info {
                text-align: right;
                }
                
                .invoice-number {
                font-size: 1.3rem;
                font-weight: 600;
                margin-bottom: 5px;
                }
                
                .invoice-date {
                font-size: 1rem;
                opacity: 0.9;
                }
                
                .content {
                padding: 40px;
                }
                
                .artwork-showcase {
                display: grid;
                grid-template-columns: 200px 1fr;
                gap: 30px;
                margin-bottom: 40px;
                padding: 30px;
                background: linear-gradient(135deg, #faf8f5 0%, #f5f1eb 100%);
                border-radius: 15px;
                border-left: 5px solid #CD853F;
                }
                
                .artwork-image {
                width: 200px;
                height: 200px;
                border-radius: 12px;
                object-fit: cover;
                box-shadow: 0 10px 30px rgba(44, 24, 16, 0.15);
                border: 3px solid #ffffff;
                }
                
                .artwork-details h2 {
                font-family: serif;
                font-size: 1.8rem;
                color: #8B4513;
                margin-bottom: 15px;
                font-weight: 600;
                }
                
                .details-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                }
                
                .detail-item {
                display: flex;
                flex-direction: column;
                gap: 3px;
                }
                
                .detail-label {
                font-size: 0.85rem;
                color: #8B4513;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                }
                
                .detail-value {
                font-size: 1rem;
                color: #2c1810;
                font-weight: 500;
                }
                
                .parties-section {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
                margin-bottom: 40px;
                }
                
                .party-card {
                background: #ffffff;
                border: 2px solid #f0e6d6;
                border-radius: 15px;
                padding: 25px;
                position: relative;
                }
                
                .party-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #CD853F 0%, #DEB887 100%);
                border-radius: 15px 15px 0 0;
                }
                
                .party-title {
                font-family: serif;
                font-size: 1.3rem;
                color: #8B4513;
                margin-bottom: 20px;
                font-weight: 600;
                }
                
                .party-detail {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                padding: 5px 0;
                border-bottom: 1px solid #f5f1eb;
                }
                
                .party-detail:last-child {
                border-bottom: none;
                }
                
                .party-label {
                color: #8B4513;
                font-weight: 500;
                font-size: 0.9rem;
                }
                
                .party-value {
                color: #2c1810;
                font-weight: 500;
                text-align: right;
                }
                
                .pricing-section {
                background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
                color: white;
                border-radius: 15px;
                padding: 30px;
                margin-bottom: 30px;
                }
                
                .pricing-title {
                font-family: serif;
                font-size: 1.5rem;
                margin-bottom: 25px;
                text-align: center;
                font-weight: 600;
                }
                
                .pricing-item {
                display: flex;
                justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .pricing-item:last-child {
                border-bottom: 2px solid rgba(255, 255, 255, 0.3);
                margin-top: 15px;
                padding-top: 20px;
                font-size: 1.2rem;
                font-weight: 600;
                }
                
                .certification {
                background: #f8f6f0;
                border-radius: 15px;
                padding: 25px;
                text-align: center;
                margin-bottom: 30px;
                border: 2px solid #e8dcc6;
                }
                
                .cert-title {
                font-family: serif;
                color: #8B4513;
                font-size: 1.3rem;
                margin-bottom: 15px;
                font-weight: 600;
                }
                
                .footer {
                background: #2c1810;
                color: #e8dcc6;
                padding: 30px;
                text-align: center;
                font-size: 0.9rem;
                line-height: 1.8;
                }
                
                .footer strong {
                color: #CD853F;
                }
            </style>
            </head>
            <body>
            <div class="container">
                <div class="header">
                <div class="header-content">
                    <div class="logo-section">
                    <div class="logo">
                        <img src="${`${process.env.API_URL}/images/kucibok-black.png`}" alt="Kucibok Logo" style="width:100%;height:100%;object-fit:contain;border-radius:8px;" />
                    </div>
                    <div class="company-info">
                        <h1>FACTURE</h1>
                        <p>Plateforme d'Art Africain</p>
                    </div>
                    </div>
                    <div class="invoice-info">
                    <div class="invoice-number">N° KCB-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
                    <div class="invoice-date">${new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                </div>
                </div>

                <div class="content">
                <div class="artwork-showcase">
                    <div style="width: 200px; height: 200px; background: #f0f0f0; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #8B4513; font-size: 3rem;">🖼️</div>
                    <div class="artwork-details">
                    <h2>${artwork?.title || 'Œuvre d\'Art'}</h2>
                    <div class="details-grid">
                        <div class="detail-item">
                        <span class="detail-label">Référence</span>
                        <span class="detail-value">${new String(artwork?._id)?.slice(-8)}</span>
                        </div>
                        <div class="detail-item">
                        <span class="detail-label">Catégorie</span>
                        <span class="detail-value">${artwork?.category}</span>
                        </div>
                        <div class="detail-item">
                        <span class="detail-label">Dimensions</span>
                        <span class="detail-value">${artwork?.height} × ${artwork?.width} cm</span>
                        </div>
                        <div class="detail-item">
                        <span class="detail-label">Prix</span>
                        <span class="detail-value">${artwork?.soldPrice} FCFA</span>
                        </div>
                    </div>
                    </div>
                </div>

                <div class="parties-section">
                    <div class="party-card">
                    <h3 class="party-title">Vendeur</h3>
                    <div class="party-detail">
                        <span class="party-label">Nom</span>
                        <span class="party-value">${seller?.name}</span>
                    </div>
                    <div class="party-detail">
                        <span class="party-label">Email</span>
                        <span class="party-value">${seller?.email}</span>
                    </div>
                    <div class="party-detail">
                        <span class="party-label">Pays</span>
                        <span class="party-value">${seller?.country}</span>
                    </div>
                    </div>

                    <div class="party-card">
                    <h3 class="party-title">Acheteur</h3>
                    <div class="party-detail">
                        <span class="party-label">Nom</span>
                        <span class="party-value">${buyer?.name}</span>
                    </div>
                    <div class="party-detail">
                        <span class="party-label">Email</span>
                        <span class="party-value">${buyer?.email}</span>
                    </div>
                    <div class="party-detail">
                        <span class="party-label">Pays</span>
                        <span class="party-value">${buyer?.country}</span>
                    </div>
                    </div>
                </div>

                <div class="pricing-section">
                    <h3 class="pricing-title">Récapitulatif des Coûts</h3>
                    <div class="pricing-item">
                    <span>Prix de l'œuvre</span>
                    <span>${artwork?.soldPrice || 0} FCFA</span>
                    </div>
                    <div class="pricing-item">
                    <span>Frais de livraison</span>
                    <span>35 000 FCFA</span>
                    </div>
                    <div class="pricing-item">
                    <span>Certification Kucibok</span>
                    <span>20 500 FCFA</span>
                    </div>
                    <div class="pricing-item">
                    <span>Assurance transport</span>
                    <span>17 000 FCFA</span>
                    </div>
                    <div class="pricing-item">
                    <span><strong>TOTAL À PAYER</strong></span>
                    <span><strong>${(artwork?.soldPrice || 0) + 72500} FCFA</strong></span>
                    </div>
                </div>

                <div class="certification">
                    <h3 class="cert-title">🔒 Certificat d'Authenticité</h3>
                    <p style="margin-bottom: 15px; color: #8B4513;">Cette œuvre est certifiée authentique par Kucibok</p>
                </div>
                </div>

                <div class="footer">
                <strong>Kucibok</strong> - Plateforme de certification d'art africain<br>
                Cette facture est générée automatiquement. L'acheteur dispose de 14 jours de rétractation.<br>
                Kucibok agit en qualité de <strong>tiers de confiance certifiant</strong> pour cette transaction.
                </div>
            </div>
            </body>
            </html>
        `;

        const document = new Document({
            artworkId: artwork?._id,
            type: 'invoice',
            title: `Facture-${artwork?._id}`,
            content: htmlContent,
            path: `${process.env.API_URL}/${filePath}`,
        });
        await document.save();

        // Générer le PDF avec html-pdf
        await generatePDF(htmlContent, filePath);
        if (!fs.existsSync(path.join(process.cwd(), 'public', filePath))) {
            throw new Error(`Le fichier PDF n'a pas été généré correctement à l'emplacement : ${filePath}`);
        }
        return {
            success: true,
            message: 'Facture générée avec succès',
            filePath: filePath
        };
    } 
    catch (error) {
        logger.error('Error creating invoice:', { error: error.message });
        return {
            success: false,
            message: 'Erreur lors de la création de la facture',
            error: error.message
        };
    }
};

const createCertificateForArtwork = async (artwork) => {
    try {
        const filePath = `certificates/certificate-${artwork?._id}.pdf`;
        const kuciobkId = artwork?.kuciobkId || `KCB-${String(artwork?._id).slice(-8).toUpperCase()}`;
        const verifyUrl = `${config.cors.origin}/verify/${kuciobkId}`;
        const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
            width: 120,
            margin: 1,
            color: { dark: '#8b4513', light: '#ffffff' },
        });
        
        // HTML redesigné - moderne, minimaliste et africain
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <title>Certificat d'Authenticité Kucibok</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }

                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                        background: linear-gradient(135deg, #faf8f5 0%, #f0ebe0 100%);
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 25px;
                    }

                    .certificate-container {
                        position: relative;
                        width: 100%;
                        max-width: 950px;
                        height: 620px;
                        background: #ffffff;
                        border-radius: 16px;
                        box-shadow: 0 25px 50px rgba(139, 69, 19, 0.15);
                        overflow: hidden;
                        border: 2px solid #e6d4c1;
                    }

                    /* Motif décoratif africain subtil */
                    .certificate-container::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 200px;
                        height: 100%;
                        background: 
                            radial-gradient(circle at 30% 20%, rgba(205, 133, 63, 0.03) 0%, transparent 50%),
                            radial-gradient(circle at 70% 60%, rgba(160, 82, 45, 0.03) 0%, transparent 50%);
                        z-index: 1;
                    }

                    .certificate-content {
                        position: relative;
                        z-index: 2;
                        height: 100%;
                        display: grid;
                        grid-template-columns: 1.8fr 1fr;
                        gap: 35px;
                        padding: 40px;
                    }
                    .logo img {
                        filter: invert(1) brightness(1);
                    }
                    .left-section {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    }

                    .header {
                        margin-bottom: 25px;
                    }

                    .logo-container {
                        display: flex;
                        align-items: center;
                        margin-bottom: 20px;
                    }

                    .logo {
                        height: 35px;
                        width: 35px;
                        background: linear-gradient(135deg, #cd853f 0%, #deb887 100%);
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 1.1rem;
                        margin-right: 12px;
                        box-shadow: 0 4px 12px rgba(205, 133, 63, 0.3);
                    }

                    .brand-text {
                        font-family: serif;
                        font-size: 1.4rem;
                        font-weight: 700;
                        color: #a0522d;
                        letter-spacing: 2px;
                    }

                    .certificate-title {
                        font-family: serif;
                        font-size: 2rem;
                        font-weight: 700;
                        color: #8b4513;
                        margin-bottom: 8px;
                        letter-spacing: 0.5px;
                        line-height: 1.1;
                    }

                    .subtitle {
                        font-size: 0.95rem;
                        color: #a0522d;
                        font-weight: 400;
                        margin-bottom: 15px;
                        opacity: 0.9;
                    }

                    .authenticity-badge {
                        display: inline-block;
                        padding: 6px 14px;
                        background: linear-gradient(135deg, #cd853f 0%, #deb887 100%);
                        color: white;
                        border-radius: 16px;
                        font-size: 0.8rem;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                        box-shadow: 0 3px 10px rgba(205, 133, 63, 0.3);
                    }

                    .artwork-info {
                        background: linear-gradient(135deg, rgba(205, 133, 63, 0.04) 0%, rgba(222, 184, 135, 0.04) 100%);
                        padding: 22px;
                        border-radius: 12px;
                        border-left: 3px solid #cd853f;
                        margin-top: 15px;
                    }

                    .info-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 7px 0;
                        border-bottom: 1px solid rgba(205, 133, 63, 0.1);
                    }

                    .info-row:last-child {
                        border-bottom: none;
                    }

                    .info-label {
                        font-size: 0.88rem;
                        color: #a0522d;
                        font-weight: 500;
                    }

                    .info-value {
                        font-size: 0.92rem;
                        color: #8b4513;
                        font-weight: 600;
                        text-align: right;
                        max-width: 55%;
                        word-break: break-word;
                    }

                    .right-section {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        align-items: center;
                        text-align: center;
                        padding-left: 20px;
                        border-left: 1px solid rgba(205, 133, 63, 0.2);
                    }

                    .artwork-image {
                        width: 160px;
                        height: 160px;
                        border-radius: 12px;
                        border: 2px solid #cd853f;
                        box-shadow: 0 8px 25px rgba(139, 69, 19, 0.2);
                        object-fit: cover;
                        margin-bottom: 20px;
                    }

                    .artwork-placeholder {
                        width: 160px;
                        height: 160px;
                        background: linear-gradient(135deg, #f5f1eb 0%, #e8dcc6 100%);
                        border-radius: 12px;
                        border: 2px solid #cd853f;
                        margin-bottom: 20px;
                        box-shadow: 0 8px 25px rgba(139, 69, 19, 0.2);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 2.5rem;
                        color: #a0522d;
                    }

                    .certificate-seal {
                        width: 100px;
                        height: 100px;
                        border: 2px solid #cd853f;
                        border-radius: 50%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 15px;
                        background: radial-gradient(circle, rgba(205, 133, 63, 0.06) 0%, transparent 70%);
                        position: relative;
                    }

                    .certificate-seal::before {
                        content: '';
                        position: absolute;
                        top: -3px;
                        left: -3px;
                        right: -3px;
                        bottom: -3px;
                        border: 1px solid rgba(205, 133, 63, 0.2);
                        border-radius: 50%;
                    }

                    .seal-text {
                        font-family: serif;
                        font-size: 0.65rem;
                        font-weight: 600;
                        color: #a0522d;
                        text-transform: uppercase;
                        letter-spacing: 0.3px;
                        line-height: 1.1;
                        text-align: center;
                    }

                    .verification-section {
                        text-align: center;
                    }

                    .verification-title {
                        font-size: 0.85rem;
                        color: #a0522d;
                        margin-bottom: 8px;
                        font-weight: 500;
                    }

                    .verification-code {
                        font-family: 'Courier New', monospace;
                        font-size: 0.8rem;
                        color: #8b4513;
                        background: rgba(205, 133, 63, 0.08);
                        padding: 6px 10px;
                        border-radius: 6px;
                        letter-spacing: 0.8px;
                        margin-bottom: 12px;
                        border: 1px solid rgba(205, 133, 63, 0.15);
                    }

                    .footer-text {
                        font-size: 0.75rem;
                        color: #a0522d;
                        line-height: 1.3;
                        opacity: 0.85;
                    }

                    /* Ornements décoratifs */
                    .ornament {
                        position: absolute;
                        width: 40px;
                        height: 40px;
                        background: radial-gradient(circle, rgba(205, 133, 63, 0.1) 0%, transparent 70%);
                        border-radius: 50%;
                    }

                    .ornament-1 {
                        top: 15px;
                        left: 15px;
                    }

                    .ornament-2 {
                        bottom: 15px;
                        right: 15px;
                    }
                </style>
            </head>
            <body>
                <div class="certificate-container">
                    <div class="ornament ornament-1"></div>
                    <div class="ornament ornament-2"></div>
                    
                    <div class="certificate-content">
                        <div class="left-section">
                            <div class="header">
                                <div class="logo-container">
                                    <div class="logo">
                                        <img src="${`${process.env.API_URL}/images/kucibok-black.png`}" alt="Kucibok Logo" style="width:100%;height:100%;object-fit:contain;border-radius:8px;" />
                                    </div>
                                    <div class="brand-text">KUCIBOK</div>
                                </div>
                                
                                <h1 class="certificate-title">CERTIFICAT<br>D'AUTHENTICITÉ</h1>
                                <div class="subtitle">Art Africain Authentique</div>
                                <div class="authenticity-badge">✓ ŒUVRE CERTIFIÉE</div>
                            </div>

                            <div class="artwork-info">
                                <div class="info-row">
                                    <span class="info-label">Titre de l'œuvre</span>
                                    <span class="info-value">${artwork?.title}</span>
                                </div>
                                
                                <div class="info-row">
                                    <span class="info-label">Artiste</span>
                                    <span class="info-value">${artwork?.artist}</span>
                                </div>
                                
                                <div class="info-row">
                                    <span class="info-label">Catégorie</span>
                                    <span class="info-value">${artwork?.category}</span>
                                </div>
                                
                                <div class="info-row">
                                    <span class="info-label">Dimensions</span>
                                    <span class="info-value">${artwork?.height} × ${artwork?.width} cm</span>
                                </div>
                                
                                <div class="info-row">
                                    <span class="info-label">Date d'émission</span>
                                    <span class="info-value">${new Date().toLocaleDateString('fr-FR')}</span>
                                </div>
                            </div>
                        </div>

                        <div class="right-section">
                            ${artwork?.image ? 
                                `<img src="${artwork.image}" alt="${artwork.title || 'Œuvre d\'art'}" class="artwork-image" />` :
                                `<div class="artwork-placeholder">🖼️</div>`
                            }
                            
                            <div class="certificate-seal">
                                <div class="seal-text">
                                    Certificat<br>
                                    Authenticité<br>
                                    Kucibok
                                </div>
                            </div>

                            <div class="verification-section">
                                <div class="verification-title">Vérifier l'authenticité</div>
                                <img src="${qrDataUrl}" alt="QR vérification" style="width:100px;height:100px;border-radius:6px;border:1px solid rgba(205,133,63,0.3);margin-bottom:8px;" />
                                <div class="verification-code">${kuciobkId}</div>
                                <div class="footer-text">
                                    Scannez le QR ou visitez<br>
                                    kucibok.com/verify
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
        // Générer le PDF avec html-pdf
        await generatePDF(htmlContent, filePath);
        logger.info(`Certificate generated for artwork: ${artwork?._id}`);
        if (!fs.existsSync(path.join(process.cwd(), 'public', filePath))) {
            throw new Error(`Le fichier PDF n'a pas été généré correctement à l'emplacement : ${filePath}`);
        }
        const document = new Document({
            artworkId: artwork?._id,
            type: 'certificate',
            title: `Certificat-${artwork?._id}`,
            content: htmlContent,
            path: `${process.env.API_URL}/${filePath}`,
        });
        await document.save();

        // Enregistrer le chemin du certificat dans l'œuvre
        artwork.certificatePath = `${process.env.API_URL}/${filePath}`;
        await artwork.save();
        

        return {
            success: true,
            message: 'Certificat généré avec succès',
            filePath: filePath
        };
    }
    catch (error) {
        logger.error('Error creating certificate:', { error: error.message });
        return {
            success: false,
            message: 'Erreur lors de la création du certificat',
            error: error.message
        };
    }
};

module.exports = {
    generatePDF,
    createInvoiceForArtwork,
    createCertificateForArtwork
};