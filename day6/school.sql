-- ==========================================
-- 1. CREATE TABLES
-- ==========================================

CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_name TEXT NOT NULL,
    credits INTEGER NOT NULL
);

CREATE TABLE enrolments (
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    -- A composite primary key prevents a student from enrolling in the same course twice
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);


-- ==========================================
-- 2. INSERT SAMPLE DATA
-- ==========================================

-- Inserting 4 students (Diana will purposefully have no enrolments for query testing)
INSERT INTO students (first_name, last_name, email) VALUES
('Alice', 'Johnson', 'alice@example.com'),
('Bob', 'Smith', 'bob@example.com'),
('Charlie', 'Brown', 'charlie@example.com'),
('Diana', 'Prince', 'diana@example.com');

-- Inserting 3 courses
INSERT INTO courses (course_name, credits) VALUES
('Introduction to Programming', 3),
('Database Design', 4),
('Web Development', 3);

-- Inserting 5 enrolments with grades
INSERT INTO enrolments (student_id, course_id, grade) VALUES
(1, 1, 'A'),
(1, 2, 'B'),
(2, 1, 'A'),
(2, 3, 'C'),
(3, 3, 'B');


-- ==========================================
-- 3. QUERIES
-- ==========================================

-- Query A: All courses for one student (by name)
SELECT courses.course_name, enrolments.grade
FROM courses
JOIN enrolments ON courses.id = enrolments.course_id
JOIN students ON students.id = enrolments.student_id
WHERE students.first_name = 'Alice' AND students.last_name = 'Johnson';

-- Query B: All students on one course
SELECT students.first_name, students.last_name, enrolments.grade
FROM students
JOIN enrolments ON students.id = enrolments.student_id
JOIN courses ON courses.id = enrolments.course_id
WHERE courses.course_name = 'Introduction to Programming';

-- Query C: The number of students per course
SELECT courses.course_name, COUNT(enrolments.student_id) AS total_students
FROM courses
LEFT JOIN enrolments ON courses.id = enrolments.course_id
GROUP BY courses.id, courses.course_name;

-- Query D: Students who have no enrolments
SELECT students.first_name, students.last_name
FROM students
LEFT JOIN enrolments ON students.id = enrolments.student_id
WHERE enrolments.student_id IS NULL;

-- Query E: Update of one enrolment's grade
UPDATE enrolments
SET grade = 'A+'
WHERE student_id = 1 AND course_id = 2;