/*************************************************************************
 * Module Description
 *************************************************************************/
async function main(args) {
    // await / no await
    await supportingFunction1();
    await supportingFunction2();
    await supportingFunction3();
    return args;
    // Promise.resolve
    return await Promise.resolve(args)
        .then(supportingFunction1)
        .then(supportingFunction2)
        .then(supportingFunction3)
        .catch(errorHandling);
    // Promise.all, arrayed output
    return Promise.all([
        supportingFunction1(),
        supportingFunction2(),
        supportingFunction3(),
    ])
}

module.exports = {
    main: main
};


// TODO: Get course items and filter out based on due date (if dueDate > newEndDate)

// CREATE array of courses with item counts

// CREATE array of course items with {course name, URL, and due date}

async function supportingFunction1() { }
async function supportingFunction2() { }
async function supportingFunction3() { }
async function errorHandling(error) { console.error(error) };