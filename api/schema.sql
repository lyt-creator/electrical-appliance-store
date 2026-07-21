CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  category_name VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  images TEXT[] NOT NULL,
  specs TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admin (username, password) VALUES ('admin', 'admin123') ON CONFLICT (username) DO NOTHING;

INSERT INTO categories (name, description) VALUES 
('方太', '方太集团创建于1996年，专注于高端厨房电器的研发和制造') ON CONFLICT DO NOTHING;

INSERT INTO categories (name, description) VALUES 
('奥普', '奥普家居股份有限公司，中国浴霸行业的缔造者') ON CONFLICT DO NOTHING;

INSERT INTO categories (name, description) VALUES 
('美的', '美的集团，中国家电行业的领军企业') ON CONFLICT DO NOTHING;

INSERT INTO categories (name, description) VALUES 
('海尔', '海尔集团，全球大型家电第一品牌') ON CONFLICT DO NOTHING;

INSERT INTO categories (name, description) VALUES 
('格力', '格力电器，中国空调行业的领军品牌') ON CONFLICT DO NOTHING;
