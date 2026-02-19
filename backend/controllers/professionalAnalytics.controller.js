const ProfessionalAnalytics = require("../models/ProfessionalAnalytics");
const Artwork = require("../models/Artwork");
const mongoose = require("mongoose");
const createError = require("http-errors");

// ✅ Get analytics for professional
exports.getAnalytics = async (req, res, next) => {
  try {
    const professionalId = req.user._id;
    const { period = "month" } = req.query;

    // Get artworks for this professional
    const artworks = await Artwork.find({
      $or: [
        { artistId: professionalId },
        { createdBy: professionalId },
      ],
    }).populate("artistId", "name");

    // Calculate KPIs
    const totalArtworks = artworks.length;
    const soldArtworks = artworks.filter((a) => a.sold);
    const unsoldArtworks = artworks.filter((a) => !a.sold && a.status === "approved");
    const pendingArtworks = artworks.filter((a) => a.status === "pending");

    // Conversion Rate
    const conversionRate = totalArtworks > 0 
      ? (soldArtworks.length / totalArtworks) * 100 
      : 0;

    // Average Sale Time (days)
    const saleTimes = soldArtworks
      .filter((a) => a.soldAt && a.createdAt)
      .map((a) => {
        const created = new Date(a.createdAt);
        const sold = new Date(a.soldAt);
        return (sold - created) / (1000 * 60 * 60 * 24);
      });

    const averageSaleTime = saleTimes.length > 0
      ? saleTimes.reduce((a, b) => a + b, 0) / saleTimes.length
      : 0;

    // Total Views & Favorites
    const totalViews = artworks.reduce((sum, a) => sum + (a.views || 0), 0);
    const totalFavorites = artworks.reduce((sum, a) => sum + (a.favorites || 0), 0);
    const viewsToSale = totalViews > 0 && soldArtworks.length > 0
      ? totalViews / soldArtworks.length
      : 0;

    // Sales by Category
    const salesByCategory = {};
    const categoryMap = {
      "peinture": "Peinture",
      "sculpture": "Sculpture",
      "photographie": "Photographie",
      "dessin": "Dessin",
      "gravure": "Gravure",
      "installation": "Installation",
      "video": "Video",
      "autre": "Autre",
    };
    
    soldArtworks.forEach((a) => {
      const cat = categoryMap[a.category] || "Autre";
      if (!salesByCategory[cat]) {
        salesByCategory[cat] = { count: 0, revenue: 0 };
      }
      salesByCategory[cat].count++;
      salesByCategory[cat].revenue += Number(a.soldPrice || 0);
    });

    // Sales by Price Range
    const salesByPriceRange = {
      "0-100K": { count: 0, revenue: 0 },
      "100K-300K": { count: 0, revenue: 0 },
      "300K-500K": { count: 0, revenue: 0 },
      "500K-1M": { count: 0, revenue: 0 },
      "1M+": { count: 0, revenue: 0 },
    };

    soldArtworks.forEach((a) => {
      const price = Number(a.soldPrice || 0);
      if (price < 100000) {
        salesByPriceRange["0-100K"].count++;
        salesByPriceRange["0-100K"].revenue += price;
      } else if (price < 300000) {
        salesByPriceRange["100K-300K"].count++;
        salesByPriceRange["100K-300K"].revenue += price;
      } else if (price < 500000) {
        salesByPriceRange["300K-500K"].count++;
        salesByPriceRange["300K-500K"].revenue += price;
      } else if (price < 1000000) {
        salesByPriceRange["500K-1M"].count++;
        salesByPriceRange["500K-1M"].revenue += price;
      } else {
        salesByPriceRange["1M+"].count++;
        salesByPriceRange["1M+"].revenue += price;
      }
    });

    // Top Performing Artworks
    const topArtworks = soldArtworks
      .map((a) => ({
        title: a.title,
        price: a.soldPrice,
        artist: a.artistId?.name || "Inconnu",
      }))
      .sort((a, b) => Number(b.price) - Number(a.price))
      .slice(0, 10);

    // Top Artists
    const artistSales = {};
    soldArtworks.forEach((a) => {
      const artistName = a.artistId?.name || "Inconnu";
      if (!artistSales[artistName]) {
        artistSales[artistName] = { count: 0, revenue: 0 };
      }
      artistSales[artistName].count++;
      artistSales[artistName].revenue += Number(a.soldPrice || 0);
    });

    const topArtists = Object.entries(artistSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Sales by Period (last 12 months)
    const currentYear = new Date().getFullYear();
    const monthNames = ["Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil", "Aou", "Sep", "Oct", "Nov", "Dec"];
    const salesByPeriod = Array.from({ length: 12 }, (_, i) => {
      const month = i;
      const monthArtworks = soldArtworks.filter((a) => {
        if (!a.soldAt) return false;
        const soldDate = new Date(a.soldAt);
        return soldDate.getMonth() === month && soldDate.getFullYear() === currentYear;
      });
      return {
        month: monthNames[i],
        count: monthArtworks.length,
        revenue: monthArtworks.reduce((sum, a) => sum + Number(a.soldPrice || 0), 0),
      };
    });

    // Total Revenue
    const totalRevenue = soldArtworks.reduce((sum, a) => sum + Number(a.soldPrice || 0), 0);
    const averagePrice = soldArtworks.length > 0 ? totalRevenue / soldArtworks.length : 0;

    // Build response
    const analytics = {
      overview: {
        totalArtworks,
        soldArtworks: soldArtworks.length,
        unsoldArtworks: unsoldArtworks.length,
        pendingArtworks: pendingArtworks.length,
        totalRevenue,
        averagePrice,
      },
      kpis: {
        conversionRate: conversionRate.toFixed(1),
        averageSaleTime: averageSaleTime.toFixed(0),
        totalViews,
        totalFavorites,
        viewsToSale: viewsToSale.toFixed(0),
      },
      salesByCategory,
      salesByPriceRange,
      salesByPeriod,
      topArtworks,
      topArtists,
    };

    res.status(200).json(analytics);
  } catch (error) {
    next(createError.internal(error.message));
  }
};

// ✅ Get real-time stats
exports.getRealTimeStats = async (req, res, next) => {
  try {
    const professionalId = req.user._id;

    const artworks = await Artwork.find({
      $or: [
        { artistId: professionalId },
        { createdBy: professionalId },
      ],
    });

    const todayViews = artworks.reduce((sum, a) => sum + (a.todayViews || 0), 0);
    const weekViews = artworks.reduce((sum, a) => sum + (a.weekViews || 0), 0);
    const activeListings = artworks.filter((a) => a.status === "approved" && !a.sold).length;
    const inquiriesCount = artworks.reduce((sum, a) => sum + (a.inquiries || 0), 0);

    const recentSales = artworks
      .filter((a) => a.sold && a.soldAt)
      .sort((a, b) => new Date(b.soldAt) - new Date(a.soldAt))
      .slice(0, 5)
      .map((a) => ({
        title: a.title,
        price: a.soldPrice,
        soldAt: a.soldAt,
      }));

    res.status(200).json({
      todayViews,
      weekViews,
      activeListings,
      inquiriesCount,
      recentSales,
    });
  } catch (error) {
    next(createError.internal(error.message));
  }
};
