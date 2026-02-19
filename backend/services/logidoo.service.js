const axios = require('axios');

class LogidooService {
  constructor() {
    // Production API URL
    // For staging/testing, use: https://staging-expedition.logidoo.co
    this.baseURL = 'https://expedition.logidoo.co';
    // Use the provided API key
    this.apiKey = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGY1NmM3OGYyNDkyN2U3ODg1NDJhYWUiLCJpYXQiOjE3NzEzNzQ3MzEsImV4cCI6MTkyOTE2MjczMX0.bzpWJrD8rEaR-HSuq13PnWFA9xbdfEEsf-bOZj03Aw1S_rwFCUiygXFDWdD7NAUwM9vBn_r68AKW0ICZCikpMwRiJRQAOproCHS2Re2YUF8_MYCgt7gkjz9fmBHxjHzryFqsTch3qj1sW9WUlNIKr3471mtyd8eB-_4BnVgovdo-99GKZaTmYVUMfvLR9BQbCxR-PVYOTJOt-fGP1JsiLphuvWJAZtzLa-z6rRt_lxu2m_jZVnzj78c2n_-lWTcdxP1ktGEPKwXcNpzNUCxLPQ1av1gdPy1b_TMg9PI4kaI2uC2IFil9zztI_TqZyEMDoYsCbQ8--TNX-fU_GunHpvcOuUAxx4pqlk-UEJvNCCQHtU6qw8dfCyHZNxwwQhVJJurPRLJ4iFpG1-LtxWq63xWTjWOh2uVVEgadk6Dj0SO8mqtgD_0eMx_rduVR9y5c96zB-qhFtAKUuYKZdwh2JbB9OCkLUKrBPgn0shnLPB8LYXwkzVlU0WnDIxcACtqPrElvWPwo6Ln-BhrJR3WHB5N6S7Tz1pYz_r6zazBT7srwvtv5kl54vhP6utSKLd7sZyiuhkZ29GRofrWML2a3taQyblAe8TS5SWYwStLxxhC_LUI4drxDUhRR-GS5vWrPuJWpvYX8nGOdnsoLwGKV1YbdSA08c90oLd8YXVVZrcQ';
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // Get all expeditions
  async getExpeditions() {
    try {
      const response = await this.axiosInstance.get('/expeditions');
      return response.data;
    } catch (error) {
      console.error('Error fetching expeditions:', error.response?.data || error.message);
      // Return mock data
      return { expeditions: [], mock: true };
    }
  }

  // Get expedition by ID
  async getExpeditionById(expeditionId) {
    try {
      const response = await this.axiosInstance.get(`/expeditions/${expeditionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching expedition:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get expedition by tracking number - try multiple endpoint variations
  async getExpeditionByTracking(trackingNumber) {
    const endpoints = [
      `/expeditions/track/${trackingNumber}`,
      `/track/${trackingNumber}`,
      `/shipments/track/${trackingNumber}`,
      `/tracking/${trackingNumber}`
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await this.axiosInstance.get(endpoint);
        return response.data;
      } catch (error) {
        console.log(`Tried endpoint ${endpoint}: ${error.response?.status || error.message}`);
      }
    }
    
    // Return mock data for testing
    return {
      trackingNumber,
      status: 'in_transit',
      location: 'Dakar, Senegal',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      events: [
        { date: new Date().toISOString(), status: 'in_transit', location: 'Dakar' }
      ],
      mock: true
    };
  }

  // Create new expedition
  async createExpedition(expeditionData) {
    try {
      const response = await this.axiosInstance.post('/expeditions', expeditionData);
      return response.data;
    } catch (error) {
      console.error('Error creating expedition:', error.response?.data || error.message);
      // Return mock response for testing
      return {
        id: `EXP-${Date.now()}`,
        status: 'created',
        trackingNumber: `TRK${Date.now()}`,
        ...expeditionData,
        mock: true
      };
    }
  }

  // Update expedition
  async updateExpedition(expeditionId, expeditionData) {
    try {
      const response = await this.axiosInstance.put(`/expeditions/${expeditionId}`, expeditionData);
      return response.data;
    } catch (error) {
      console.error('Error updating expedition:', error.response?.data || error.message);
      throw error;
    }
  }

  // Track expedition - try multiple endpoint variations
  async trackExpedition(trackingNumber) {
    return this.getExpeditionByTracking(trackingNumber);
  }

  // Get expedition status history
  async getExpeditionHistory(expeditionId) {
    try {
      const response = await this.axiosInstance.get(`/expeditions/${expeditionId}/history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching expedition history:', error.response?.data || error.message);
      // Return mock data
      return { events: [], mock: true };
    }
  }

  // Cancel expedition
  async cancelExpedition(expeditionId) {
    try {
      const response = await this.axiosInstance.delete(`/expeditions/${expeditionId}`);
      return response.data;
    } catch (error) {
      console.error('Error canceling expedition:', error.response?.data || error.message);
      throw error;
    }
  }

  // Calculate shipping price - try multiple endpoint variations
  async calculatePrice(origin, destination, packageDetails) {
    const endpoints = [
      '/expeditions/calculate-price',
      '/calculate-price',
      '/pricing',
      '/rates'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await this.axiosInstance.post(endpoint, {
          origin,
          destination,
          package: packageDetails
        });
        return response.data;
      } catch (error) {
        console.log(`Tried endpoint ${endpoint}: ${error.response?.status || error.message}`);
      }
    }
    
    // Return mock data for testing
    const basePrice = 1500;
    const weightMultiplier = packageDetails?.weight || 1;
    return {
      price: basePrice * weightMultiplier,
      currency: 'XOF',
      estimatedDays: 3,
      mock: true
    };
  }

  // Get delivery zones - try multiple endpoint variations
  async getDeliveryZones() {
    const endpoints = ['/zones', '/delivery-zones', '/area', '/coverage', '/regions'];
    
    for (const endpoint of endpoints) {
      try {
        const response = await this.axiosInstance.get(endpoint);
        return response.data;
      } catch (error) {
        console.log(`Tried endpoint ${endpoint}: ${error.response?.status || error.message}`);
      }
    }
    
    // Return worldwide zones with major countries
    return {
      zones: [
        // Africa
        { id: '1', name: 'Sénégal', region: 'Afrique', price: 1500, days: '1-3' },
        { id: '2', name: 'Côte d\'Ivoire', region: 'Afrique', price: 2000, days: '2-4' },
        { id: '3', name: 'Mali', region: 'Afrique', price: 2500, days: '3-5' },
        { id: '4', name: 'Burkina Faso', region: 'Afrique', price: 2000, days: '2-4' },
        { id: '5', name: 'Mauritanie', region: 'Afrique', price: 2200, days: '2-4' },
        { id: '6', name: 'Guinée', region: 'Afrique', price: 2300, days: '3-5' },
        { id: '7', name: 'Nigeria', region: 'Afrique', price: 3000, days: '3-5' },
        { id: '8', name: 'Kenya', region: 'Afrique', price: 4000, days: '4-6' },
        { id: '9', name: 'Afrique du Sud', region: 'Afrique', price: 5000, days: '5-7' },
        
        // Europe
        { id: '10', name: 'France', region: 'Europe', price: 8000, days: '3-5' },
        { id: '11', name: 'Allemagne', region: 'Europe', price: 8500, days: '3-5' },
        { id: '12', name: 'Italie', region: 'Europe', price: 8500, days: '3-5' },
        { id: '13', name: 'Espagne', region: 'Europe', price: 8500, days: '3-5' },
        { id: '14', name: 'Belgique', region: 'Europe', price: 8000, days: '3-5' },
        { id: '15', name: 'Suisse', region: 'Europe', price: 9000, days: '3-5' },
        { id: '16', name: 'Royaume-Uni', region: 'Europe', price: 9000, days: '4-6' },
        { id: '17', name: 'Pays-Bas', region: 'Europe', price: 8000, days: '3-5' },
        
        // Americas
        { id: '18', name: 'États-Unis', region: 'Amérique', price: 15000, days: '5-7' },
        { id: '19', name: 'Canada', region: 'Amérique', price: 16000, days: '5-7' },
        { id: '20', name: 'Brésil', region: 'Amérique', price: 14000, days: '5-7' },
        { id: '21', name: 'Mexique', region: 'Amérique', price: 12000, days: '4-6' },
        { id: '22', name: 'Argentine', region: 'Amérique', price: 15000, days: '6-8' },
        
        // Asia
        { id: '23', name: 'Singapour', region: 'Asie', price: 12000, days: '4-6' },
        { id: '24', name: 'Japon', region: 'Asie', price: 14000, days: '5-7' },
        { id: '25', name: 'Chine', region: 'Asie', price: 11000, days: '4-6' },
        { id: '26', name: 'Hong Kong', region: 'Asie', price: 12000, days: '4-6' },
        { id: '27', name: 'Thaïlande', region: 'Asie', price: 10000, days: '4-6' },
        { id: '28', name: 'Émirats Arabes Unis', region: 'Asie/Moyen-Orient', price: 11000, days: '4-6' },
        
        // Oceania
        { id: '29', name: 'Australie', region: 'Océanie', price: 18000, days: '6-8' },
        { id: '30', name: 'Nouvelle-Zélande', region: 'Océanie', price: 18000, days: '6-8' }
      ],
      mock: true,
      worldwide: true
    };
  }

  // Get pickup points - try multiple endpoint variations
  async getPickupPoints() {
    const endpoints = ['/pickup-points', '/points', '/relay-points', '/agencies', '/depots'];
    
    for (const endpoint of endpoints) {
      try {
        const response = await this.axiosInstance.get(endpoint);
        return response.data;
      } catch (error) {
        console.log(`Tried endpoint ${endpoint}: ${error.response?.status || error.message}`);
      }
    }
    
    // Return mock data
    return {
      pickupPoints: [
        { id: '1', name: 'Logidoo Dakar Centre', address: 'Rue 10, Dakar', phone: '+221 33 123 45 67' },
        { id: '2', name: 'Logidoo Almadies', address: 'Almadies, Dakar', phone: '+221 33 123 45 68' },
        { id: '3', name: 'Logidoo Plateau', address: 'Centre ville, Dakar', phone: '+221 33 123 45 69' }
      ],
      mock: true
    };
  }
}

module.exports = new LogidooService();
