// Middleware to authenticate Logidoo API requests
exports.logidooAuth = (req, res, next) => {
  const expectedApiKey = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGY1NmM3OGYyNDkyN2U3ODg1NDJhYWUiLCJpYXQiOjE3NjM1OTAyNTEsImV4cCI6MTkyMTM3ODI1MX0.yrw6_713Nucr_xnEdjPW1szk6riiwjZbM_IYBEUDUxmRVSSqVd4IUz3uhFDI7o88hEd50dAzVZV4_ggbtW-b6HO5Wpc6ruq33yHQfDBxwPCoMywUGeK9lw_BrAGwm3L7QyBe9oa048m0cyeApiofYIYTrp1yV0iCQR_1VM58wk0fmZj6ocd1LqDinCsyJ18W-XiiCWVOJsLLIaP8iTzyn0axkhel8mKPMtmijeDyhL32BykKrKPyCWM7nSkSI-AokUedgQFm2v4UJRsTEWNPZnEJWa2qkQOikl8b5kxz7Iph4lRW4x4rehh6fqBk-2dWqf8F8ubPxiwLEBgyLjFyu6-mO0g_hF7LjA5rAwu1NFT4-IIgxtkIVuGCC_F1bZD5cUKbHKgYqsV7gN_K7_hmgRWNYAotT7dSZLKsbseM4PpOUsrmm_E_6AY8sW2F5i9cQidX-nCIO1dJxWG_mTAeIQEoy66UQZ8dxVpVjiw5IcKTlJ9ELp7WOOnCKZFOX8XINrSVVFgXC7oEcW1KykJ85pEAj5ksxRZJDbistgc_ESVhhbAP_Ri2hffr9lRjr3adBGRqcXKlxqbes-YOSVN2Q1hk6dD-ZNG0f4c4iikcRzRi0lgG_NoHe_bjeH7-K1WtdgYZQuZZRq_luFXcwXh_vGQ5gjAy1Zex04l7ean4Wdk';
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }
  
  const token = authHeader.substring(7);
  
  if (token !== expectedApiKey) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  next();
};