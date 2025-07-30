const { default: mongoose } = require("mongoose")
const Characterdata = require("../models/Characterdata")


exports.checkcharacter = async (id, characterid) => {

    if (!characterid || !id) {
        return "failed"
    }

    const character = await Characterdata.findOne({
        owner: new mongoose.Types.ObjectId(id),
        _id: characterid
    })


    if (!character) {
        return "failed"
    }

    return "success"

}

/**
 * Get character's gender
 * @param {String} characterid - Character ID
 * @returns {Object} - Object with gender info or error
 */
exports.getCharacterGender = async (characterid) => {
    try {
        if (!characterid) {
            return { success: false, message: "Character ID is required" };
        }

        const character = await Characterdata.findById(characterid, 'gender');
        
        if (!character) {
            return { success: false, message: "Character not found" };
        }

        const genderNumber = character.gender;
        const genderString = genderNumber === 0 ? 'male' : 'female';

        return {
            success: true,
            genderNumber: genderNumber,
            genderString: genderString,
            isMale: genderNumber === 0,
            isFemale: genderNumber === 1
        };

    } catch (error) {
        console.error('Error getting character gender:', error);
        return { 
            success: false, 
            message: `Error retrieving character gender: ${error.message}` 
        };
    }
};

/**
 * Check if character is male
 * @param {String} characterid - Character ID
 * @returns {Boolean|null} - True if male, false if female, null if error
 */
exports.isCharacterMale = async (characterid) => {
    const result = await exports.getCharacterGender(characterid);
    return result.success ? result.isMale : null;
};

/**
 * Check if character is female
 * @param {String} characterid - Character ID
 * @returns {Boolean|null} - True if female, false if male, null if error
 */
exports.isCharacterFemale = async (characterid) => {
    const result = await exports.getCharacterGender(characterid);
    return result.success ? result.isFemale : null;
};

/**
 * Get character gender as string
 * @param {String} characterid - Character ID
 * @returns {String|null} - "male" or "female", null if error
 */
exports.getCharacterGenderString = async (characterid) => {
    const result = await exports.getCharacterGender(characterid);
    return result.success ? result.genderString : null;
};

/**
 * Get character gender as number
 * @param {String} characterid - Character ID
 * @returns {Number|null} - 0 for male, 1 for female, null if error
 */
exports.getCharacterGenderNumber = async (characterid) => {
    const result = await exports.getCharacterGender(characterid);
    return result.success ? result.genderNumber : null;
};