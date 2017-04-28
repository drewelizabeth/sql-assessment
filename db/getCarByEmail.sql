select *
from vehicles
join users on users.id = vehicles.ownerId
where users.email = $1;