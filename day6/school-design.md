# School Database Design

## Table Explanations
* **students:** Stores the core identity information of the people taking classes. It uses an auto-incrementing ID as the primary key and enforces a unique constraint on the email address so no two accounts can share an email.
* **courses:** Stores the catalogue of available classes. It uses an auto-incrementing ID as the primary key and requires a course name and credit value for every entry.
* **enrolments:** The junction (or join) table that records whenever a student signs up for a course, along with the grade they receive.

## Relationships
The relationship between a student and a course is **many-to-many**: one student can take many courses, and one course can hold many students. Because relational databases cannot directly map many-to-many relationships, we use the `enrolments` join table to act as a bridge. This breaks the structure down into two manageable **one-to-many** relationships: one student to many enrolments, and one course to many enrolments.

## Recommended Index
I would add an index to the `email` column in the `students` table (`CREATE INDEX idx_student_email ON students(email);`). Because an email address is frequently used as a lookup value (like logging into a student portal), indexing it prevents the database from having to scan every single row when authenticating a user, drastically speeding up queries as the student body grows.

## SQL vs. NoSQL
For a school grading and enrolment system, I would strictly choose a relational SQL database. School data is highly structured, predictable, and requires absolute data integrity (e.g., a student cannot be enrolled in a course that doesn't exist, and grades must be strictly bound to both the student and the course). SQL's ACID compliance, foreign key constraints, and normalized structures prevent the kind of data anomalies or orphaned records that could easily occur in a flexible, document-based NoSQL database.