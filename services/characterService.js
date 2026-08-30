const boom = require('@hapi/boom');
const characterModel = require('../models/characterModel');

const getCharacterByName = async (name) => {
  return characterModel.find({ name: name });
};

const getAllCharacters = async (page, limit) => {
  const skip = (page - 1) * limit;
  const characters = await characterModel.find().skip(skip).limit(limit);
  return characters;
};

const getCharacterById = async (characterId) => {
  const character = await characterModel.findOne({ _id: characterId });
  if (!character) {
    throw boom.notFound('Character not found');
  }
  return character;
};

const getCharacterByAlias = async (alias) => {
  const character = await characterModel.findOne({ alias: alias });
  if (!character) {
    throw boom.notFound('Character not found');
  }
  return character;
};

const createCharacter = async (character) => {
  const newCharacter = await characterModel(character);
  newCharacter.save();
  return newCharacter;
};

const deleteCharacter = async (characterId) => {
  const result = await characterModel.deleteOne({ _id: characterId });
  if (result.deletedCount === 0) {
    throw boom.notFound('Character not found');
  } else {
    return result;
  }
};

const updateCharacter = async (characterId, character) => {
  const result = await characterModel.findOneAndUpdate(
    { _id: characterId },
    character
  );
  if (result === null) {
    throw boom.notFound('Character not found');
  }
  return await characterModel.findOne({ _id: characterId });
};

// Update character partially only the fields that are provided in the request body
const updateCharacterPartial = async (characterId, character) => {
  const result = await characterModel.findOneAndUpdate(
    { _id: characterId },
    { $set: character },
    { new: true }
  );
  if (result === null) {
    throw boom.notFound('Character not found');
  }
  return result;
};

module.exports = {
  getCharacterByName,
  getCharacterById,
  getCharacterByAlias,
  createCharacter,
  deleteCharacter,
  updateCharacter,
  getAllCharacters,
  updateCharacterPartial
};
