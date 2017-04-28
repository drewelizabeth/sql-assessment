select vehicles.make, vehicles.model, vehicles.year, users.firstname, users.lastname
from users
join vehicles on users.id = vehicles.ownerId
where year > 2000
order by year desc