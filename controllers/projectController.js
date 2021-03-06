const Project = require("../models/Project")
const {validationResult} = require("express-validator")
const connectDataBase = require("../config/db")

exports.createProject = async(req, res) =>{
  const Errors = validationResult(req)
  if(!Errors.isEmpty()){
    return res.status(400).json({Errors: Errors.array()})
  }
  try{
    const project = new Project(req.body)

    project.userCreator = req.userContainer.id
    

    project.save()
    res.json(project)
  } catch (error){
    console.log(error)
    res.status(500).send("There are Error")
  }
}

// get all projects
exports.getProjects = async (req, res)=>{
  try {
    const project = await Project.find({userCreator: req.userContainer.id})
    res.json({project})
  } catch (error) {
    console.log(error)
    res.status(500).send("There was a mistake")
  }
}

exports.updateProject = async(req, res) =>{
  const Errors = validationResult(req)
  if(!Errors.isEmpty()){
    return res.status(400).json({Errors: Errors.array()})
  }
  const {name} = req.body
  const newProject = {}
  if(name) {
    newProject.name = name
  }
  try {
    let project = await Project.findById(req.params.id)
    if(!project){
      return res.status(400).json({msg: "Project not found"})
    }
    if(project.userCreator.toString() !== req.userContainer.id){
      return res.status(401).json({msg: "Not Authorized"})
    }
    project = await Project.findByIdAndUpdate({_id: req.params.id}, {$set: newProject}, {new: true})
    res.json({project})
  } catch (error) {
    console.log(error)
    res.status(500).send("Server error")
  }
}
exports.deleteProject = async(req, res) =>{
  try {
    let project = await Project.findById(req.params.id)
    if(!project){
      return res.status(400).json({msg: "Project not found"})
    }
    if(project.userCreator.toString() !== req.userContainer.id){
      return res.status(401).json({msg: "Not Authorized"})
    }
    await Project.findOneAndRemove({_id: req.params.id})
    res.json({msg: "Project Deleted"})
  } catch (error) {
    console.log(error)
    rest.status(500).send("Server error")
  }
}