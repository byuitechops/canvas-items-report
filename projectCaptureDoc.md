# Project Capture Document for Canvas Assignments Report
#### *Author: Levi Stum*
#### *Stakeholder(s): Peter Williams*
#### *Date: March 20, 2019*


## Background

The Online Department is experimenting with changing start/end dates of semesters (specifically which day of the week the semester ends/starts on).
With that they're wanting to know how the courses will be affected by changing the course(s) end date.

-----

## Definition of Done

For every online master course they want to know how many items (e.g. content items, assignments, etc.) exist after a certain due date (e.g. July 17). Optionally might create a more specific report with which items are after that date.

-----

# Requirements

### General Requirements

N/A

### Input Requirements

#### Definition of Inputs

- Courses
  - either all online master courses *or* a CSV of course names and IDs
- Due Date
  - to check for all items with due/end dates after given date
  - Need to double check if it's just due dates or also end dates

#### Source of Inputs

- Courses
  - Grab all online master courses (within a subaccount)
  - OR a CSV containing course names and IDs prepared beforehand
- Due Date
  - Provided by user at runtime

---

### Output Requirements

#### Definition of Outputs

- CSV
  - Each row is a course
  - Columns include: 
    - Course Name
    - Course ID
    - URL/hyperlink
    - Count (of items after given date) (title would include date)
  - Name of file includes date used
  - Date that the CSV was created (when the tool was run)
- Second CSV (potentially)
  - Includes all items we looked at
  - Rows would be individual items (from various courses)
  - Columns would be: 
    - Course Name
    - URL to item (in course)
    - Current Due Date
  - Ability to filter by any given date thaty the user wants (filter would be built into excel/sheet)

#### Destination of Outputs

- Email CSV to Peter Williams (Stakeholder(s))

---

### User Interface

#### Type:

- CLI with prompt
  - Specify a subaccount to get Canvas courses from
  - (?) CSV location
  - Due Date

-----

## Expectations

### Timeline

- Need before end-of-day Thursday (March 21, 2019)

### Best Mode of Contact

- Email (williamsp@byui.edu)
- Slack (currDev slack channel)

### Next Meeting

- Before end-of-day Thursday (March 21, 2019)

### Action Items

#### TechOps

- Communicate with Peter Williams about questions
  - Does it matter that course setup is already changing end dates for courses? We could use the semester master instead of the overall master course(s).
  - Which end date were you looking at using? (at least for testing purposes)
  - Any other rollup data you'd like? (e.g. number of items, due dates, etc.)

#### Stakeholder

- N/A 

-----

#### *Approved By:* Josh McKinney
#### *Approval Date:* March 20, 2019
