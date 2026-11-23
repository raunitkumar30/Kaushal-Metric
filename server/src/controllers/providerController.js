const Provider = require("../models/Provider");

const createProvider = async (req, res) => {
  try {
    const {
      name,
      registrationNumber,
      state,
      district,
      contactEmail,
    } = req.body;

    if (!name || !registrationNumber) {
      return res.status(400).json({
        message: "Name and registrationNumber are required",
      });
    }

    const existingProvider = await Provider.findOne({
      registrationNumber,
    });

    if (existingProvider) {
      return res.status(409).json({
        message: "Provider already exists",
      });
    }

    const provider = await Provider.create({
      name,
      registrationNumber,
      state,
      district,
      contactEmail,
    });

    res.status(201).json({
      message: "Provider created successfully",
      provider,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create provider",
    });
  }
};

const getProviders = async (req, res) => {
  try {
    const providers = await Provider.find()
      .sort({ createdAt: -1 });

    res.json({
      providers,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch providers",
    });
  }
};

module.exports = {
  createProvider,
  getProviders,
};
