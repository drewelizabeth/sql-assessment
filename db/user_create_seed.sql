-- It may be helpful to drop and reinstantilize the table when doing
-- the tests in case you delete users/cars the tests are expecting to see
DROP TABLE IF EXISTS users;

create table users (
  id serial primary key,
  firstname varchar(20),
  lastname varchar(20),
  email text
);

insert into users
(firstname, lastname, email)
values
( 'John', 'Smith', 'John@Smith.com'),
( 'Dave', 'Davis', 'Dave@Davis.com'),
( 'Jane', 'Janis', 'Jane@Janis.com');
