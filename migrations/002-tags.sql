--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE tags (
  id TEXT PRIMARY KEY NOT NULL,
  color TEXT NOT NULL,
  icon TEXT NOT NULL

  CONSTRAINT tags_id_ck CHECK(id <> ''),
  CONSTRAINT tags_color_ck CHECK(color <> ''),
  CONSTRAINT tags_icon_ck CHECK(icon <> '')
);

CREATE TABLE nodes_tags (
  id INTEGER PRIMARY KEY NOT NULL,
  node_id INTEGER NOT NULL,
  tag_id TEXT NOT NULL,

  CONSTRAINT nodes_tags_node_id_fk FOREIGN KEY(node_id) REFERENCES nodes(id),
  CONSTRAINT nodes_tags_tag_id_fk FOREIGN KEY(tag_id) REFERENCES tags(id),
  CONSTRAINT nodes_tags_node_per_tag_uq UNIQUE(node_id, tag_id) ON CONFLICT REPLACE
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE node_tags;
DROP TABLE tags;
