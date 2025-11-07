const boom = require('@hapi/boom');
const projectModel = require('../models/projectModel');
const userModel = require('../models/userModel');

const getProjectsByUser = async (userId) => {
    return projectModel.find({userId:userId});
}

const getProjectById = async (projectId) => {
    const project = await projectModel.findOne({_id:projectId})
    if(!project){
        throw boom.notFound('Project not found')
    }
    return project;
}

const getProjectByItsonId = async (itsonId) => {
    const user = await userModel.findOne({itsonId:itsonId})
    if(!user){
        throw boom.notFound('Student not found')
    }
    return projectModel.find({userId:user._id})
}

const createProject = async (project) => {
    const newProject = await projectModel(project);
    newProject.save();
    return newProject;
}

const deleteProject = async (projectId) => {
    const result = await projectModel.deleteOne({_id:projectId});
    if (result.deletedCount === 0) {
        throw boom.notFound('Project not found');
    }else{
        return result;
    }
}

const updateProject = async (projectId, project) => {
    const result = await projectModel.findOneAndUpdate({_id:projectId}, project);
    if(result === null){
        throw boom.notFound('Project not found');
    }
    return await projectModel.findOne({_id:projectId});
}

module.exports = {
    getProjectsByUser,
    getProjectById,
    createProject,
    deleteProject,
    updateProject,
    getProjectByItsonId
}