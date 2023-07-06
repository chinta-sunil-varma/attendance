# Attendance Genie

## Project Overview
The main objective of this project is to allow users to submit their attendance data via a CSV file. The CSV file should contain the following information:

- ID of the person
- Name of the person

Once the information is submitted, it will be stored in MongoDB. Users can then take attendance using an attendance UI that comprises of ChatJS components. The content dynamically changes based on the attendance status, such as absent, present, late, or permission. Users have the option to edit the responses before submitting them to the database. Additionally, users can download the CSV file or upload it to the database.
## live link
https://thoughtful-bandanna-lamb.cyclic.app/
## Features
- Submission of attendance data via a CSV file
- Storage of attendance data in MongoDB
- Attendance UI with ChatJS components
- Dynamic content based on attendance status
- Editing of attendance responses
- Downloading and uploading of the CSV file

## Technologies Used
- MongoDB: A NoSQL database for storing attendance data.
- ChatJS: A library for building interactive chat components in the attendance UI.
- CSV File Handling: To allow users to submit and download attendance data in CSV format.

## Installation
1. Clone the repository:

```shell
git clone https://github.com/yourusername/attendance.git
```

2. Install the required dependencies:

```shell
cd attendance
npm install
```

```shell
cd vite-frontend
npm install
```

3. Configure MongoDB connection:
   - Open the `config.js` file or `.env ` file.
   - Update the MongoDB connection URL with your own MongoDB connection string.

4. Start the application:

```shell
npm start
```

5. Open the application in your browser:

```
http://localhost:3000
```

## Usage
1. Submitting Attendance Data:
   - Prepare a CSV file containing the attendance data.
   - Ensure that the CSV file contains columns for the ID and name of each person.
   - Go to the Attendance Submission page.
   - Upload the CSV file using the provided file upload component.
   - Click on the "Submit" button to store the attendance data in MongoDB.

2. Taking Attendance:
   - Go to the Attendance UI page.
   - The ChatJS components will display the attendance status for each person.
   - Edit the responses as needed.
   - Click on the "Submit" button to update the attendance data in the database.

3. Downloading Attendance Data:
   - Go to the Attendance Download page.
   - Click on the "Download CSV" button to download the attendance data as a CSV file.

4. Uploading Attendance Data:
   - Go to the Attendance Upload page.
   - Use the file upload component to select the CSV file containing the attendance data.
   - Click on the "Upload" button to update the attendance data in MongoDB.
   - 
## demo of the project 

https://github.com/chinta-sunil-varma/attendance/assets/93024237/ad08c15f-a166-4385-9bf8-c87cb3ac789a



  

