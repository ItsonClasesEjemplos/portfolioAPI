const boom = require('@hapi/boom');
const projectModel = require('../models/projectModel');

const getProjectsByUser = async (userId) => {
    return projectModel.find({userId:userId});
}

const getProjectById = async (projectId) => {
    return "getProjectById";
}

const createProject = async (project) => {
    return "createProject";
}

const deleteProject = async (projectId) => {
    return "deleteProject";
}

const updateProject = async (projectId, project) => {
    return "updateProject";
}

module.exports = {
    getProjectsByUser,
    getProjectById,
    createProject,
    deleteProject,
    updateProject,
}