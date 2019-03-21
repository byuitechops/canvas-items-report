// Main Logic

// Get Items

const fs = require('fs');
const canvas = require('canvas-api-wrapper');
const prompt = require('prompt');
const json2csv = require('json2csv').parse;
const asyncLib = require('async');
const moment = require('moment');
const {
    promisify
} = require('util');
const asyncReduce = promisify(asyncLib.reduce);

/***************************************************
 * retrieveInput
 * 
 * This function prompts the user for the course ID
 * for course visualization. This also handles errors.
 **************************************************/
function retrieveInput() {
    prompt.start();

    prompt.get('CourseID', (err, result) => {
        if (err) {
            console.log('\n\nERROR: ', err.message);
            return;
        } else if (!parseInt(result.CourseID, 10)) {
            console.log('\nERROR: Invalid input.');
            return;
        }

        checkFolders();
        runTool(result.CourseID);
    });
}

/*************************************************
 * retrieveModules
 * @param {Int} courseId
 * @returns {Array} all of the course modules
 * 
 * This function makes an API call to Canvas to 
 * retrieve all of the course modules with the 
 * provided course ID.
 *************************************************/
async function retrieveModules(courseId) {
    try {
        return await canvas.get(`/api/v1/courses/${courseId}/modules`);
    } catch (err) {
        throw err;
    }
}

/*************************************************
 * retrieveModuleItems
 * @param {Int} courseId
 * @param {Int} moduleId
 * @returns {Array} module items
 * 
 * This function makes an API call to Canvas to 
 * retrieve all of the module items found in the
 * provided module ID in the provided course.
 *************************************************/
async function retrieveModuleItems(courseId, moduleId) {
    try {
        return await canvas.get(`/api/v1/courses/${courseId}/modules/${moduleId}/items`, {
            "include[]": "content_details"
        });
    } catch (err) {
        throw err;
    }
}

/*************************************************
 * retrieveModuleItems
 * @param {Int} courseId
 * @param {Int} moduleId
 * @returns {String} Canvas link
 * 
 * This function returns a string for a specific
 * module item.
 *************************************************/
function returnModuleUrl(courseId, moduleId) {
    return `https://byui.instructure.com/courses/${courseId}/modules#module_${moduleId}`;
}

/*************************************************
 * buildModuleItems
 * @param {Int} courseId
 * @param {Array} modules
 * @returns {Array} module items for the modules
 * 
 * This function returns an array of all module items
 * for each module.
 *************************************************/
async function buildModuleItems(courseId, modules) {
    /* Retrieves all module items for each module */
    return await asyncReduce(modules, [], async (acc, moduleIn) => {
        let moduleItems = await retrieveModuleItems(courseId, moduleIn.id);
        moduleItems = moduleItems
            // drop the no points/ 0 points
            // .filter(item => item.content_details !== undefined && item.content_details.points_possible > 0)
            // make sure they are in order
            .sort((a, b) => a.position - b.position)
            // Adds the Module name and position to each module item object
            .map((moduleItem, i) => {
                moduleItem.position = -(i + 1);
                moduleItem.moduleName = moduleIn.name;
                moduleItem.modulePosition = moduleIn.position;
                return moduleItem;
            })
            .filter(moduleItem => moduleItem.type !== "SubHeader");

        return acc.concat(moduleItems);
    });
}

/*************************************************
 * createModuleItemObject
 * @param {Int} courseId
 * @param {Array} allItems
 * @returns {Array} A JSON object for bubble chart 
 * 
 * This function returns an array of JSON objects
 * for the bubble chart.
 *************************************************/
function createModuleItemObject(courseId, allItems) {
    return allItems.map(gradedItem => {
        return {
            courseCode: courseId,
            id: gradedItem.id,
            type: gradedItem.type,
            newEndDate: moment("2019-07-20").format("MM/D/YYYY"),
            dueDate: moment(gradedItem.content_details.due_at).format("MM/D/YYYY"),
            lockDate: moment(gradedItem.content_details.lock_at).format("MM/D/YYYY"),
            title: gradedItem.title,
            URL: gradedItem.type === 'ExternalUrl' ? returnModuleUrl(courseId, gradedItem.module_id) : gradedItem.html_url
        };
    });

}

/*************************************************
 * runTool
 * @param {Int} courseId
 * 
 * This function serves as the driver for the 
 * program. It calls all of the correct functions.
 *************************************************/
async function runTool(courseId) {
    let excludeModules = ['Welcome', 'Instructor Resources', 'Resources', 'Instructor Resources (Do NOT Publish)']
    let modules;

    // We are not sure if the courseId is valid so we wrap the function call in a try/catch statement
    try {
        modules = await retrieveModules(courseId);
    } catch (err) {
        console.log('ERROR: ', err.message);
        return;
    }

    // Filters the modules to exclude the ones named in the excludeModules array
    modules = modules.filter(moduleIn => !excludeModules.includes(moduleIn.name));

    let allItems = await buildModuleItems(courseId, modules);

    // Creates the module item object with necessary properties
    allItems = createModuleItemObject(courseId, allItems);

    return allItems;
}

module.exports = {
    getCourseItems: runTool
}