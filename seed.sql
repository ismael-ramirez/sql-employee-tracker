USE employee_tracker_db;

INSERT INTO departments (id, name)
    VALUES (1, "Command"),
            (2, "Operations"),
            (3, "Sciences");

INSERT INTO roles (id, title, salary, department_id)
    VALUES (1, "Captain", 10, 1),
            (2, "First Officer", 9, 1),
            (3, "Science Officer", 6, 3),
            (4, "Communications Officer", 2, 2),
            (5, "Helmsman", 4, 1),
            (6, "Weapons Officer", 3, 1),
            (7, "Doctor", 7, 3),
            (8, "Nurse", 5, 3),
            (9, "Yeoman", 1, 1),
            (10, "Chief of Engineering", 8, 2),
            (11, "Database Administrator", 20, 1);

INSERT INTO employees (id, user_name, access, first_name, last_name, role_id, manager_id)
    VALUES (1, "jim", 3, "James", "Kirk", 1, null),
            (2, "spock", 3, "Mister", "Spock", 2, 1),
            (3, "bones", 3, "Leonard", "Mccoy", 7, 1),
            (4, "uhura", 1, "Nyota", "Uhura", 4, 2),
            (5, "sulu", 1, "Hikaru", "Sulu", 5, 2),
            (6, "chekov", 1, "Pavel", "Chekov", 6, 2),
            (7, "chapel", 1, "Christine", "Chapel", 8, 3),
            (8, "rand", 1, "Janice", "Rand", 9, 1),
            (9, "scotty", 3, "Montgomery", "Scott", 10, 1),
            (10, "admin", 4, "Cornelius", "Landru", 11, null)
            