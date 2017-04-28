select *
from vehicles
join users on users.id = vehicles.ownerId
where users.firstname like $1;