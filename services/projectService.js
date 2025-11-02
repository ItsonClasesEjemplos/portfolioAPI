const boom = require('@hapi/boom');

const getProjectsByUser = async (userId) => {
    return "getProjectsByUserId";
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