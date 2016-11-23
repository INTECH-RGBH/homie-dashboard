--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE devices (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  online INTEGER NOT NULL, -- SQLite BOOLEAN
  ip TEXT NOT NULL,
  mac TEXT NOT NULL,
  stats_signal INTEGER,
  stats_uptime INTEGER NOT NULL,
  stats_interval_in_seconds INTEGER NOT NULL,
  fw_name TEXT NOT NULL,
  fw_version TEXT NOT NULL,
  fw_checksum TEXT NOT NULL,
  implementation TEXT NOT NULL,
  added INTEGER NOT NULL, -- SQLite BOOLEAN

  CONSTRAINT devices_id_ck CHECK(id <> ''),
  CONSTRAINT devices_name_ck CHECK(name <> ''),
  CONSTRAINT devices_online_ck CHECK (online IN (0, 1)),
  CONSTRAINT devices_ip_ck CHECK(length(ip) >= 7 AND length(ip) <= 15),
  CONSTRAINT devices_mac_ck CHECK(length(mac) = 17),
  CONSTRAINT devices_stats_signal_ck CHECK(stats_signal >= 0 AND stats_signal <= 100),
  CONSTRAINT devices_stats_uptime_ck CHECK(stats_uptime >= 0),
  CONSTRAINT devices_stats_interval_in_seconds_ck CHECK(stats_interval_in_seconds >= 1),
  CONSTRAINT devices_fw_name_ck CHECK(fw_name <> ''),
  CONSTRAINT devices_fw_version_ck CHECK(fw_version <> ''),
  CONSTRAINT devices_fw_checksum_ck CHECK(fw_checksum <> ''),
  CONSTRAINT devices_implementation_ck CHECK(implementation <> ''),
  CONSTRAINT devices_added_ck CHECK (added IN (0, 1))
);

CREATE TABLE nodes (
  id INTEGER PRIMARY KEY NOT NULL,
  device_id TEXT NOT NULL,
  device_node_id TEXT NOT NULL,
  type TEXT NOT NULL,
  properties TEXT NOT NULL,

  CONSTRAINT nodes_device_id_fk FOREIGN KEY(device_id) REFERENCES devices(id),
  CONSTRAINT nodes_node_per_device_uq UNIQUE(device_id, device_node_id) ON CONFLICT REPLACE,
  CONSTRAINT nodes_device_node_id_ck CHECK(device_node_id <> ''),
  CONSTRAINT nodes_type_ck CHECK(type <> ''),
  CONSTRAINT nodes_properties_ck CHECK(properties <> '')
);

CREATE TABLE properties (
  id INTEGER PRIMARY KEY NOT NULL,
  node_id INTEGER NOT NULL,
  node_property_id TEXT NOT NULL,

  CONSTRAINT properties_node_id_fk FOREIGN KEY(node_id) REFERENCES nodes(id),
  CONSTRAINT properties_property_per_node_uq UNIQUE(node_id, node_property_id) ON CONFLICT REPLACE,
  CONSTRAINT properties_node_property_id_ck CHECK(node_property_id <> '')
);

CREATE TABLE property_history (
  id INTEGER PRIMARY KEY NOT NULL,
  property_id INTEGER NOT NULL,
  value TEXT NOT NULL,
  date TEXT NOT NULL, -- SQLite DATETIME,

  CONSTRAINT property_history_property_id_fk FOREIGN KEY(property_id) REFERENCES properties(id),
  CONSTRAINT property_history_value_ck CHECK(value <> ''),
  CONSTRAINT property_history_date_ck CHECK(length(date) = 24)
);

CREATE TABLE IFTTT (
  id INTEGER PRIMARY KEY NOT NULL,
  I_property_id INTEGER NOT NULL,
  condition TEXT NOT NULL,
  O_property_id INTEGER NOT NULL,
  O_value TEXT NOT NULL,

  CONSTRAINT IFTTT_I_property_id_fk FOREIGN KEY(I_property_id) REFERENCES properties(id),
  CONSTRAINT IFTTT_O_property_id_fk FOREIGN KEY(O_property_id) REFERENCES properties(id),
  CONSTRAINT IFTTT_whole_condition_uq UNIQUE(I_property_id, condition, O_property_id) ON CONFLICT REPLACE,
  CONSTRAINT IFTTT_condition_ck CHECK(condition <> '')
);

CREATE TABLE settings (
  id TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);

CREATE TABLE auth_tokens (
  token TEXT PRIMARY KEY NOT NULL,
  last_activity TEXT NOT NULL, -- SQLite DATETIME,

  CONSTRAINT auth_tokens_token_ck CHECK(length(token) = 36),
  CONSTRAINT auth_tokens_last_activity_ck CHECK(length(last_activity) = 24)
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE auth_tokens;
DROP TABLE settings;
DROP TABLE IFTTT;
DROP TABLE property_history;
DROP TABLE properties;
DROP TABLE nodes;
DROP TABLE devices;
