CREATE TABLE IF NOT EXISTS users(
    id serial,
    username character varying(50) UNIQUE NOT NULL,
    email character varying(50) UNIQUE NOT NULL,
    password text NOT NULL,
    profile_image text,
    description character varying(200),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS photos(
    id serial,
    owner_id int,
    photo_url text,
    description character varying(200),
    created_on timestamptz,
    last_update timestamptz,
    PRIMARY KEY(id),
    CONSTRAINT fk_upload_by
    FOREIGN KEY(owner_id)
    REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS comments(
    id serial,
    comment_by_id int,
    photo_id int,
    comment character varying(200),
    posted_time timestamptz,
    last_update timestamptz,
    PRIMARY KEY(id),
    CONSTRAINT fk_commented_by
    FOREIGN KEY(comment_by_id)
    REFERENCES users(id),
    CONSTRAINT fk_photo
    FOREIGN KEY(photo_id)
    REFERENCES photos(id)
);

CREATE TABLE IF NOT EXISTS tags(
    id serial,
    title character varying(120),
    owner_id int,
    PRIMARY KEY(id),
    CONSTRAINT fk_tag_owner
    FOREIGN KEY(owner_id)
    REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS saved_photos(
    id serial,
    photo_id int,
    tag_id int,
    PRIMARY KEY(id),
    CONSTRAINT fk_photo
    FOREIGN KEY(photo_id)
    REFERENCES photos(id),
    CONSTRAINT fk_tag
    FOREIGN KEY(tag_id)
    REFERENCES tags(id)
);
