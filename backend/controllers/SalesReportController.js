const SalesReport = require('../models/SalesReport');
const Activity = require('../models/ActivityCRUD');
const Itinerary = require('../models/schematour');
const Product = require('../models/ProductCRUD');

const generateSalesReport = async (req, res) => {
    try {
        const { productName, specificDate, specificMonth } = req.query;

        // Filter for specific products
        let productFilter = {};
        if (productName) {
            productFilter = { description: productName };
        }

        // Fetch filtered products
        const products = await Product.find(productFilter);

        // Calculate gift shop revenue for filtered products
        const giftShopRevenue = products.reduce((total, product) => {
            return total + product.sales * product.price;
        }, 0);

        // Filter for specific dates or months in Activity and Itinerary
        let dateFilter = {};
        if (specificDate) {
            const date = new Date(specificDate);
            dateFilter = {
                createdAt: {
                    $gte: new Date(date.setHours(0, 0, 0, 0)),
                    $lte: new Date(date.setHours(23, 59, 59, 999)),
                },
            };
        } else if (specificMonth) {
            const [year, month] = specificMonth.split("-");
            dateFilter = {
                createdAt: {
                    $gte: new Date(year, month - 1, 1),
                    $lt: new Date(year, month, 1),
                },
            };
        }

        const activities = await Activity.find(dateFilter);
        const itineraries = await Itinerary.find(dateFilter);

        // Calculate revenues
        const activityRevenue = activities.reduce((total, activity) => {
            return total + activity.bookings * activity.price;
        }, 0);

        const itineraryRevenue = itineraries.reduce((total, itinerary) => {
            return total + itinerary.bookings * itinerary.TourPrice[0];
        }, 0);

        // Calculate total revenue and app fee
        const totalRevenue = activityRevenue + itineraryRevenue + giftShopRevenue;
        const appFee = totalRevenue * 0.10;

        // Send the response
        res.status(200).json({
            success: true,
            data: {
                activityRevenue,
                itineraryRevenue,
                giftShopRevenue,
                totalRevenue,
                appFee,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to generate sales report",
            error: error.message,
        });
    }
};

module.exports = {
    generateSalesReport,
};
