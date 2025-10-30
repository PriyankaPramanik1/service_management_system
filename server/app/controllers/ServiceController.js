const Service = require('../model/serviceModel');

const createService = async (req, res) => {
  try {
    // console.log('=== REQUEST RECEIVED ===');
    // console.log('Request body:', req.body);
    // console.log('Uploaded file:', req.file);

    // Check if image was uploaded
    if (!req.file) {
      req.flash('error', 'Please upload a service image')

    }

    const {
      serviceName,
      serviceType,
      serviceHeader,
      serviceDetails,
      serviceInclude
    } = req.body;

    // Check required fields
    if (!serviceName || !serviceHeader || !serviceDetails) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields: serviceName, serviceHeader, serviceDetails'
      });
    }

    // Parse array fields
    const parseArrayField = (field) => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') {
        return field.split(',').map(item => item.trim()).filter(item => item);
      }
      return [];
    };

    // Create new service
    const newService = new Service({
      serviceName,
      serviceType: parseArrayField(serviceType),
      serviceHeader,
      serviceDetails,
      serviceImage: req.file.path, // Cloudinary URL
      serviceInclude: parseArrayField(serviceInclude)
    });

    const savedService = await newService.save();
    if (savedService) {
      req.flash('success', 'Service created successfully!')
      return res.redirect('/get/serviceList')
    }

  } catch (error) {
    req.flash('error', 'Error creating service')
    // PROPER ERROR response
    return res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message
    });
  }
};

const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Services retrieved successfully!',
      data: services,
      count: services.length
    });

  } catch (error) {
    console.error('❌ Error retrieving services:', error);

    return res.status(500).json({
      success: false,
      message: 'Error retrieving services',
      error: error.message
    });
  }
};

const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Service retrieved successfully!',
      data: service
    });

  } catch (error) {
    console.error('❌ Error retrieving service:', error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID format'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error retrieving service',
      error: error.message
    });
  }
};

// Render serviceList page
const renderServiceList = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.render('serviceList', {
      title: 'All Services',
      services: services,
      servicesCount: services.length,
      success: req.flash('success'),
      error: req.flash('error'),
    });

  } catch (error) {
    console.error('❌ Error rendering service list:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to load services page'
    });
  }
}

module.exports = { createService, getServices, getServiceById, renderServiceList };