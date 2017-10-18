DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS stops CASCADE;
DROP TABLE IF EXISTS polls CASCADE;

CREATE TABLE trips (
  gtfsId text NOT NULL,
  directionId integer NOT NULL,
  PRIMARY KEY (gtfsId)
);

CREATE TABLE stops (
  gtfsId text NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  url text NOT NULL,
  lon double precision NOT NULL,
  lat double precision NOT NULL,
  PRIMARY KEY (gtfsId)
);

CREATE TABLE polls (
  id serial NOT NULL,
  tripGtfsId text NOT NULL,
  stopGtfsId text NOT NULL,
  scheduledArrival integer NOT NULL,
  arrivalDelay integer NOT NULL,
  polled_at timestamp default current_timestamp,
  FOREIGN KEY (tripGtfsId) REFERENCES trips(gtfsId),
  FOREIGN KEY (stopGtfsId) REFERENCES stops(gtfsId),
  PRIMARY KEY (id)
);
