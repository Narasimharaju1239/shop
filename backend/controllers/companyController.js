const Company = require('../models/Company');

exports.getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    next(err);
  }
};

exports.addCompany = async (req, res, next) => {
  const { name, image } = req.body;
  try {
    // Only include image if provided
    const companyData = { name };
    if (image) companyData.image = image;
    const company = await Company.create(companyData);
    res.status(201).json(company);
  } catch (err) {
    next(err);
  }
};

exports.updateCompany = async (req, res, next) => {
  try {
    const updated = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteCompany = async (req, res, next) => {
  try {
    const deleted = await Company.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({ message: 'Company deleted' });
  } catch (err) {
    next(err);
  }
};
