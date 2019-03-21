const logic = require("./logic.js");
const json2csv = require('json2csv').parse;
const fs = require('fs');
const canvas = require('canvas-api-wrapper')
const moment = require('moment');

async function getCourses() {
    var onlineMasterCourses = await canvas.get("/api/v1/accounts/42/courses?blueprint=1");
    var pathwayMasterCourses = await canvas.get("/api/v1/accounts/39/courses?blueprint=1");
    var onlineCourses = onlineMasterCourses.concat(pathwayMasterCourses);
    return onlineCourses;
}

async function getDate() {
    return moment("2019-07-20");
    // return new Date("2019-07-20");
}

async function makeReport(data, name) {
    // Converts JSON to CSV
    let csv = json2csv(data);

    checkFolders();

    // Writes all data to a CSV file with the course name as the filename
    fs.writeFileSync(`./reports/${name}.csv`, csv, 'utf8');

    // TODO: Returns CSV
    // Let user know that it's done
    console.log("Files created.");
}

/*************************************************
 * checkFolders
 * 
 * This function checks to see if the folder exists
 * If not, it creates it.
 *************************************************/
function checkFolders() {
    const reportPath = './reports';

    if (!fs.existsSync(reportPath))
        fs.mkdirSync(reportPath);
}

function handleError(error) {
    console.error(error)
    return;
}

async function start() {
    try {
        var courseList = await getCourses();
        var newEndDate = await getDate();

        var reportItemList = [];
        var reportCourseList = [];
        // for (let i = 0; i < 3; i++) {
        for (let i = 0; i < courseList.length; i++) {
            const course = courseList[i];
            var courseItems = await logic.getCourseItems(course.id);
            console.log((i + 1) + "/" + courseList.length + ") Got items for " + course.name);

            var filteredCourseItems = courseItems.filter(item => item.dueDate != undefined && moment(item.dueDate).isAfter(newEndDate));

            reportItemList = reportItemList.concat(filteredCourseItems);

            reportCourseList.push({
                courseName: course.name,
                courseID: course.id,
                courseURL: "https://byui.instructure.com/courses/" + course.id,
                itemCount: filteredCourseItems.length,
                newEndDate: newEndDate.format("MM/D/YYYY")
            });
        }
        console.log("Creating files now.");

        await makeReport(reportItemList, "itemList");

        await makeReport(reportCourseList, "courseList");

    } catch (error) {
        handleError(error);
    }
}

start();

