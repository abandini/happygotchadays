-- HappyGotchaDays.com Database Schema
-- Initial migration for Cloudflare D1

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    settings TEXT DEFAULT '{}' -- JSON string for user preferences
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Pets table
CREATE TABLE IF NOT EXISTS pets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    species TEXT NOT NULL CHECK(species IN ('dog', 'cat')),
    breed TEXT,
    gotcha_date TEXT NOT NULL, -- ISO date format YYYY-MM-DD
    adoption_story TEXT,
    created_at INTEGER NOT NULL,
    is_public INTEGER DEFAULT 1, -- 1 for public, 0 for private
    profile_photo_url TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_pets_user_id ON pets(user_id);
CREATE INDEX idx_pets_gotcha_date ON pets(gotcha_date);
CREATE INDEX idx_pets_species ON pets(species);

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
    id TEXT PRIMARY KEY,
    pet_id TEXT NOT NULL,
    r2_object_key TEXT NOT NULL UNIQUE,
    caption TEXT,
    uploaded_at INTEGER NOT NULL,
    width INTEGER,
    height INTEGER,
    file_size INTEGER,
    ai_tags TEXT, -- JSON array of AI-generated tags
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);

CREATE INDEX idx_photos_pet_id ON photos(pet_id);
CREATE INDEX idx_photos_uploaded_at ON photos(uploaded_at);

-- Posts table (gotcha day celebration posts)
CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    pet_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    photo_ids TEXT, -- JSON array of photo IDs
    anniversary_year INTEGER, -- Which anniversary is this celebrating?
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_pet_id ON posts(pet_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);

-- Follows table
CREATE TABLE IF NOT EXISTS follows (
    follower_id TEXT NOT NULL,
    following_id TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);

-- Reminders table (for upcoming gotcha day notifications)
CREATE TABLE IF NOT EXISTS reminders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    pet_id TEXT NOT NULL,
    reminder_date TEXT NOT NULL, -- ISO date format
    sent INTEGER DEFAULT 0, -- 0 not sent, 1 sent
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);

CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_reminder_date ON reminders(reminder_date);
CREATE INDEX idx_reminders_sent ON reminders(sent);
