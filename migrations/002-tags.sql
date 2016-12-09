--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE tags (
  id TEXT PRIMARY KEY NOT NULL

  CONSTRAINT tags_id_ck CHECK(id <> '')
);

CREATE TABLE nodes_tags (
  id INTEGER PRIMARY KEY NOT NULL,
  node_id INTEGER NOT NULL,
  tag_id TEXT NOT NULL,

  CONSTRAINT nodes_tags_node_id_fk FOREIGN KEY(node_id) REFERENCES nodes(id) ON DELETE CASCADE,
  CONSTRAINT nodes_tags_tag_id_fk FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  CONSTRAINT nodes_tags_node_per_tag_uq UNIQUE(node_id, tag_id) ON CONFLICT IGNORE
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE node_tags;
DROP TABLE tags;
