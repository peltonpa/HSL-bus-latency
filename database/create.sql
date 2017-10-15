DROP TABLE IF EXISTS trip;
DROP TABLE IF EXISTS stop;
DROP TABLE IF EXISTS poll;

CREATE TABLE trip (
  gtfsId text NOT NULL,
  tripHeadsign text NOT NULL,
  directionId integer NOT NULL,
  PRIMARY KEY (gtfsId)
);

CREATE TABLE stop (
  gtfsId text NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  url text NOT NULL,
  PRIMARY KEY (gtfsId)
);

CREATE TABLE poll (
  id serial NOT NULL,
  tripGtfsId text NOT NULL,
  stopGtfsId text NOT NULL,
  scheduledArrival integer NOT NULL,
  realtimeDeparture integer,
  arrivalDelay integer NOT NULL,
  scheduledDeparture integer NOT NULL,
  realtimeDeparture integer,
  departureDelay integer NOT NULL,
  realtime boolean NOT NULL,
  serviceDay integer NOT NULL,
  FOREIGN KEY (tripGtfsId) REFERENCES trip(gtfsId),
  FOREIGN KEY (stopGtfsId) REFERENCES stopGtfsId(gtfsId),
  PRIMARY KEY (id)
);