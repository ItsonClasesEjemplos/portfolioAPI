const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    userId:{
        type:String,
        required: true,
    },
    technologies:{
        type: Array,
        required: false,
    },
    repository:{
        type: String,
        required: false,
    },
    images:{
        type: Array,
        required: false,
    }
})

const projectModel = mongoose.model('Projects',ProjectSchema, 'Projects');

module.exports = projectModel;