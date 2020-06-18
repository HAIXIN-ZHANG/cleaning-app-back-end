const Tradie = require('../models/tradie')
const User = require('../models/user');
const Order = require('../models/order');

async function addTradie(req, res) {
    const {
         tradieName, ABN, tradieHours, tradieDescription,
        tradieAddress, tradieEmail, tradiePhone, tradiePhoto
    } = req.body;

    const newTradie = new Tradie({
        tradieName, ABN, tradieHours, tradieDescription,
        tradieAddress, tradieEmail, tradiePhone, tradiePhoto
    });
    // req.user came form token decode.
    const user = await User.findById(req.user.account).exec();
    if (user.tradie) return res.status(400).json('tradie already exist');

    newTradie.user.addToSet(req.user.account);
    await newTradie.save();
    user.tradie.addToSet(newTradie._id);
    await user.save();
    return res.status(201).json(newTradie);
};

async function getTradiebyID(req, res) {
    const { tradieId } = req.params;
    
    const tradie = await User.findById(tradieId).populate('order').exec();
    if (!tradie) return res.status(404).json('tradie is not exist');
    return res.status(200).json(tradie);

};

async function getAllTradies(req, res) {
    const tradies = await User.find().populate('order').exec();
    if (!tradies) return res.status(404).json('not found any tradie');
    return res.status(200).json(tradies);
};

async function updateTradieById(req, res) {
    const { tradieId } = req.params;
    const { tradieName, ABN, tradieHours, tradieDescription,
    tradieAddress, tradieEmail, tradiePhone, tradiePhoto
    } = req.body;
    const tradie = await User.findByIdAndUpdate(
        tradieId,
        { tradieName, ABN, tradieHours, tradieDescription,
        tradieAddress, tradieEmail, tradiePhone, tradiePhoto },
        { new: true },).exec();

        if (!tradie) return res.status(404).json('tradie is not exist');
        
        return res.status(200).json(tradie);
};

async function getAllServicesById(req, res) {
    const { tradieId } = req.params;
    const tradie = await User.findById(tradieId).populate('Service').exec();
    if (!tradie) return res.status(404).json('not a tradie')
    const services = tradie.service;
    if (!services) return res.status(404).json('this tradie does not have service')
    return res.status(200).json(services);
};

async function getAllOrdersById(req, res) {
    const { tradieId } = req.params;
    const tradie = await User.findById(tradieId).populate('Order').exec();
    if (!tradie) return res.status(404).json('not a tradie')
    const orders = tradie.order;
    if (!orders) return res.status(404).json('this tradie does not have order')
    return res.status(200).json(orders);
};

function updateTradieImage(req, res) {};

module.exports = {
    addTradie,
    getAllTradies,
    getTradiebyID,
    updateTradieById,
    getAllServicesById,
    getAllOrdersById,
    updateTradieImage,
}