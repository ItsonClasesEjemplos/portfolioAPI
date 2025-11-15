const boom = require('@hapi/boom');
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const registerUser = async (data) => {
    const newUser = new userModel(data);
    const isEmailExist = await userModel.findOne({ email: newUser.email });
    if (isEmailExist) {
        throw boom.conflict('Email already exists');
    }

    const isItsonIdExist = await userModel.findOne({ itsonId: newUser.itsonId });
    if (isItsonIdExist) {
        throw boom.conflict('itsonId already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(data.password, salt);
    newUser.password = password;
    newUser.save();
    return newUser;
};

const updateUser = async (id, newData) => {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(newData.password, salt);
    newData.password = password;
    const result = await userModel.findOneAndUpdate({ _id: id }, newData);
    if(result==null) {
        throw boom.notFound('User not found')
    }
    return await userModel.findOne({_id:id});
};

const getUserByEmail = async (email) => {
    const user = await userModel.findOne({ email: email });
    return user;
};

module.exports = {
    registerUser,
    updateUser,
    getUserByEmail
};

